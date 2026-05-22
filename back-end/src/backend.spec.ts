import { describe, test, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { changeStatusIssue, userRegistration, sendMail } from "./query";
import { database } from "./server";
import * as bcrypt from "bcryptjs";

// --- MOCK DI SISTEMA ---
vi.mock("./server", () => ({
    database: {
        update: vi.fn(),
        insert: vi.fn(),
        query: {
            utente: { findFirst: vi.fn() }
        }
    }
}));

vi.mock("bcryptjs", async (importOriginal) => {
    const actual = await importOriginal<typeof import("bcryptjs")>();
    return {
        ...actual,
        hash: vi.fn().mockResolvedValue("hashed_password_mock"),
        compare: vi.fn(),
        default: {
            ...actual,
            hash: vi.fn().mockResolvedValue("hashed_password_mock"),
            compare: vi.fn()
        }
    };
});

vi.mock("nodemailer", () => ({
    createTransport: vi.fn().mockReturnValue({
        sendMail: vi.fn((options, callback) => callback(null, { messageId: "mock-id" }))
    })
}));

vi.mock("./middleware/codeGenerator", () => ({
    codeGenerator: vi.fn().mockReturnValue("123456")
}));


describe("Backend Testing Suite (Express + Drizzle)", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.EMAIL = "test@gmail.com";
        process.env.PASSWORD_MAIL = "mockpassword";
        process.env.JWT_SECRET = "mocksecret";
    });

    // ==========================================
    // CASO 1: Test di Unità - Cambiamento Stato Issue (Drizzle ORM)
    // ==========================================
    describe("Funzione changeStatusIssue", () => {
        test("Dovrebbe aggiornare correttamente lo stato se i parametri sono validi", async () => {
            const mockUpdatedIssue = { id_issue: 1, stato: "in_progress", updated_at: new Date() };

            const mockReturning = vi.fn().mockResolvedValue([mockUpdatedIssue]);
            const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
            const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
            vi.mocked(database.update).mockReturnValue({ set: mockSet } as any);

            const result = await changeStatusIssue({ id_issue: 1, stato: "in_progress" });

            expect(database.update).toHaveBeenCalled();
            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ stato: "in_progress" }));
            expect(result).toEqual(mockUpdatedIssue);
        });

        test("Dovrebbe lanciare un errore 400 se lo stato passato non è valido", async () => {
            await expect(
                changeStatusIssue({ id_issue: 1, stato: "" })
            ).rejects.toEqual({
                code: 400,
                message: "Stato non valido. Valori ammessi: todo, in_progress, done"
            });
        });
    });

    // ==========================================
    // CASO 2: Test di Unità - Registrazione Utente con Hashing Bcrypt (FIXED)
    // ==========================================
    describe("Funzione userRegistration", () => {
        test("Dovrebbe criptare la password prima di salvare l'utente sul database", async () => {
            const mockInputUser = {
                id_utente: 99,
                nome: "Mario",
                cognome: "Rossi",
                email: "mario@example.com",
                password: "passwordSicura123",
                role: "user" as const
            };

            const mockReturning = vi.fn().mockResolvedValue([mockInputUser]);
            const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
            vi.mocked(database.insert).mockReturnValue({ values: mockValues } as any);

            // RISOLUZIONE: Recuperiamo il mock agganciato all'istanza reale caricata da Vitest
            const bcryptHashMock = vi.mocked(bcrypt.hash);

            const result = await userRegistration(mockInputUser);

            // Usiamo il mock isolato per l'asserzione
            expect(bcryptHashMock).toHaveBeenCalledWith("passwordSicura123", 10);

            expect(mockValues).toHaveBeenCalledWith(expect.objectContaining({
                password: "hashed_password_mock"
            }));
            expect(result.idUser).toBe(99);
        });
    });

    // ==========================================
    // CASO 3: Test di Integrazione API - Endpoint Invio Mail con Check Duplicati
    // ==========================================
    describe("POST /user/sendMail", () => {
        let app: express.Application;

        beforeEach(() => {
            app = express();
            app.use(express.json());
            app.post("/user/sendMail", async (req, res) => {
                try {
                    const response = await sendMail(req.body);
                    res.status(200).json(response);
                } catch (err: any) {
                    res.status(err.code || 500).send(err.message);
                }
            });
        });

        test("Dovrebbe bloccare l'invio e rispondere 400 se l'email esiste già", async () => {
            vi.mocked(database.query.utente.findFirst).mockResolvedValue({
                id_utente: 1,
                email: "esistente@example.com"
            } as any);

            const response = await request(app)
                .post("/user/sendMail")
                .send({ email: "esistente@example.com", password: "123", nome: "X", cognome: "Y", role: "user" });

            expect(response.status).toBe(400);
            expect(response.text).toContain("Utente esistente, utilizzare un username differente.");
        });

        test("Dovrebbe rispondere 200 e inviare la mail se l'utente non è duplicato", async () => {
            vi.mocked(database.query.utente.findFirst).mockResolvedValue(undefined as any);

            const response = await request(app)
                .post("/user/sendMail")
                .send({ email: "nuovo@example.com", password: "123", nome: "X", cognome: "Y", role: "user" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                codeResponse: 200,
                message: "Mail inviata con successo",
                codeVerification: "123456"
            });
        });
    });

});
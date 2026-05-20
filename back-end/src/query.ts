import { database } from "./server";
import { commento, issue, utente } from "./db/schemas";
import { and, arrayOverlaps, asc, count, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { InsertCommenti, InsertIssue, InsertUtenti, RegistrationUser, SelectUtenti, UserLogged, ResponseEmail, Filter, Role } from "./db/type";
import * as bcrypt from "bcryptjs"
import * as jwt from 'jsonwebtoken'
import * as nodemailer from 'nodemailer'
import { codeGenerator } from "./middleware/codeGenerator";

async function checkUser(filters: { email: string; }) {
    try {
        const user = await database.query.utente.findFirst({
            where: eq(utente.email, filters.email)
        })
        return user
    } catch (error) {
        throw { code: 500, message: error }
    }
}

export async function userRegistration(newUser: InsertUtenti): Promise<RegistrationUser> {

    const registrationUserData = { ...newUser, password: await bcrypt.hash(newUser.password, 10) }

    try {
        const userRegister: SelectUtenti[] = await database.insert(utente).values(registrationUserData).returning();
        const userRegistrated = { idUser: userRegister[0].id_utente, email: userRegister[0].email, hashedPassword: userRegister[0].password, nome: userRegister[0].nome, cognome: userRegister[0].cognome, role: userRegister[0].role }
        return userRegistrated;
    } catch (error) {
        throw { code: 500, message: "Errore recupero dati." }
    }
}

export async function sendMail(newUser: InsertUtenti): Promise<ResponseEmail> {
    const check = await checkUser({ email: newUser.email })
    if (check) {
        throw { code: 400, message: "Utente esistente, utilizzare un username differente." }
    }

    const newCode = codeGenerator();
    const requiredEnv = [
        'EMAIL',
        'PASSWORD_MAIL'
    ];
    for (const envVar of requiredEnv) {
        if (!process.env[envVar]) {
            throw { code: 500, message: `Variabile di ambiente mancante: ${envVar}` };
        }
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_MAIL
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: newUser.email,
        subject: 'Codice avviso per conferma identita',
        text: `Codice avviso per completare registrazione: ${newCode}`,
    };

    const mailResult: ResponseEmail = await new Promise<ResponseEmail>((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({ code: 400, message: `Errore invio mail: ${error}` });
            } else {
                resolve({ codeResponse: 200, message: "Mail inviata con successo", codeVerification: newCode });
            }
        });
    })
    return mailResult;
}

export async function loginUtente(user: InsertUtenti): Promise<UserLogged> {
    const userFinded = await checkUser({ email: user.email });

    if (!userFinded) {
        throw { code: 400, message: "Email o password non corretta." };
    }

    const passwordValid = await bcrypt.compare(user.password, userFinded.password);
    if (!passwordValid) {
        throw { code: 400, message: "Email o password non corretta." };
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET non definito nelle variabili di ambiente");
    }

    const token = jwt.sign(
        { id: userFinded.id_utente, role: userFinded.role },
        process.env.JWT_SECRET
    );

    return {
        idUser: userFinded.id_utente,
        nome: userFinded.nome,
        cognome: userFinded.cognome,
        email: userFinded.email,
        hashedPassword: userFinded.password,
        jwtToken: token,
        role: userFinded.role
    };
}

export async function getIssueWithSameId(filter: Filter) {
    try {
        const issues = await database.query.issue.findFirst({
            with: {
                utente: true,
                commenti: true,
            },
            where: filter.id ? eq(issue.id_issue, filter.id) : undefined
        })
        return issues;
    } catch (error) {
        throw { code: 500, message: "Errore recupero dati." }
    }
}

export async function getIssue() {
    try {
        const issues = await database.query.issue.findMany({
            with: {
                utente: true,
                commenti: true,
            },
        })
        return issues;
    } catch (error) {
        console.log('error :>> ', error);
        throw { code: 500, message: "Errore recupero dati." }
    }
}

export async function insertIssue(newIssue: any): Promise<InsertIssue | undefined> {
    try {
        // Mappatura di sicurezza: allineiamo i dati del req.body con lo schema del DB
        const dataToInsert = {
            id_utente: newIssue.id_utente, // <-- Assicurati di passarlo dal FE (es. prendendolo dal JWT)
            titolo: newIssue.titolo,
            descrizione: newIssue.descrizione,
            priorita: newIssue.priority,   // Se sul DB si chiama 'priorita' e dal FE arriva 'priority'
            tipo: newIssue.tipo?.toLowerCase(), // Il DB si aspetta 'bug', dal FE arriva 'Bug' (maiuscolo)
            immagine: newIssue.immagine_url, // Se sul DB si chiama 'immagine'
        };

        // AGGIUNTO .returning(): Forza Postgres a restituire i dati inseriti
        const response = await database.insert(issue).values(dataToInsert).returning();

        // Visto che response è un array (es: [insertedIssue]), restituiamo il primo elemento
        return response[0];
    } catch (error) {
        console.error("Errore DB Insert:", error);
        throw { code: 400, message: error };
    }
}

export async function insertCommento(newCommento: InsertCommenti): Promise<InsertIssue | undefined> {
    try {
        await database.insert(commento).values(newCommento);
        const response = await getIssueWithSameId({ id: newCommento.id_issue })
        return response;
    } catch (error) {
        throw { code: 400, message: error }
    }
}
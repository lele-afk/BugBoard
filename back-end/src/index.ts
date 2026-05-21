import express, { Application } from "express";
import { authenticateToken } from "./middleware/authHandler";
import { loginUtente, sendMail, userRegistration, insertCommento, getIssue, insertIssue, changeStatusIssue } from "./query";
import dotenv from 'dotenv';
import cors from 'cors'

const app: Application = express();
const port = process.env.PORT || "3030"
dotenv.config();

app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use((err: any, req: any, res: any, next: any) => {
    if (err.message.includes('connect ECONNREFUSED')) {
        return res.status(503).json({ error: 'Database non disponibile' });
    }
    next(err);
});

app.post("/user/registration", async (req, res) => {
    try {
        const response = await userRegistration(req.body)
        res.status(200).json(response);
    } catch (err: any) {
        if (err.code && err.message) {
            res.status(err.code).send(err.message);
        } else {
            res.status(500).send("Errore interno");
        }
    }
})

app.post("/user/registration/auth", authenticateToken, async (req, res) => {
    try {
        const response = await userRegistration(req.body)
        res.status(200).json(response);
    } catch (err: any) {
        if (err.code && err.message) {
            res.status(err.code).send(err.message);
        } else {
            res.status(500).send("Errore interno");
        }
    }
})

app.post("/user/sendMail", async (req, res) => {
    try {
        const response = await sendMail(req.body);
        res.status(200).json(response);
    } catch (err: any) {
        if (err.code && err.message) {
            res.status(err.code).send(err.message);
        } else {
            res.status(500).send("Errore interno");
        }
    }
})

app.post("/issue", async (req, res) => {
    try {
        const nuovaIssue = await insertIssue(req.body);
        res.status(201).json(nuovaIssue);
    } catch (err: any) {
        res.status(err.code || 500).send(err.message || "Errore interno");
    }
});

app.put("/issue/changeState", async (req, res) => {
    try {
        const response = await changeStatusIssue(req.body)
        res.status(200).json(response)
    } catch (err: any) {
        res.status(err.code || 500).send(err.message || "Errore interno");
    }
});

app.get("/issue", async (req, res) => {
    try {
        const response = await getIssue();
        res.status(200).json(response);
    } catch (err: any) {
        if (err.code && err.message) {
            res.status(err.code).send(err.message);
        } else {
            res.status(500).send("Errore interno");
        }
    }
})


app.post("/user/login", async (req, res) => {
    try {
        const response = await loginUtente(req.body);
        res.status(200).json(response);
    } catch (err: any) {
        if (err.code && err.message) {
            res.status(err.code).send(err.message);
        } else {
            res.status(500).send("Errore interno");
        }
    }
})

app.post("/commento/insert", authenticateToken, async (req, res) => {
    try {
        const response = await insertCommento(req.body)
        res.status(200).json(response)
    } catch (err: any) {
        if (err.code && err.message) {
            res.status(err.code).send(err.message);
        } else {
            res.status(500).send("Errore interno");
        }
    }
})

app.listen(port, (err) => {
    if (err) return console.error(err);
    return console.log("Server started")
})
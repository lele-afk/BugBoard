import express, { Application } from "express";
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

app.listen(port, (err) => {
    if (err) return console.error(err);
    return console.log("Server started")
})
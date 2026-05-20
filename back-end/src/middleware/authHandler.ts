import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserLogged } from '../db/type';

export interface AuthRequest extends Request {
    user?: UserLogged;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token mancante' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET non definita");

        const decoded = jwt.verify(token, secret) as UserLogged;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token non valido' });
    }
}
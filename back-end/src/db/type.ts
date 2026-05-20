import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { commento, issue, utente } from "./schemas";
import { JwtPayload } from "jsonwebtoken";

export type SelectUtenti = InferSelectModel<typeof utente>;
export type InsertUtenti = typeof utente.$inferInsert;
export type RegistrationUser = { idUser: number, email: string, hashedPassword: string }
export type Role = (typeof utente.$inferSelect)['role'];
export type UserLogged = { idUser: number, nome: string, cognome: string, hashedPassword: string, jwtToken: string | JwtPayload, email: string, role: Role }

export type InsertCommenti = InferInsertModel<typeof commento>;

export type SelectIssue = InferSelectModel<typeof issue>;
export type InsertIssue = InferInsertModel<typeof issue>;
export type Filter = { id?: number, date?: Date }

export type ResponseEmail = { codeResponse: number, message: string, codeVerification: string }

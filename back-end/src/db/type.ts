import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { commento, issue, utente } from "./schemas";
import { JwtPayload } from "jsonwebtoken";

export type SelectUtenti = InferSelectModel<typeof utente>;
export type InsertUtenti = typeof utente.$inferInsert;
export type RegistrationUser = { idUser: number, username: string, hashedPassword: string }
export type UserLogged = { idUser: number, username: string, hashedPassword: string, jwtToken: string | JwtPayload, email: string }

export type InsertCommenti = InferInsertModel<typeof commento>;



export type SelectMeme = InferSelectModel<typeof issue>;
export type InsertMeme = InferInsertModel<typeof issue>;

export type ResponseEmail = { codeResponse: number, message: string, codeVerification: string }

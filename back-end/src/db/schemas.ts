import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core"
import * as type from "drizzle-orm/pg-core";

export const utente = pgTable('utente', {
    id_utente: type.integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
    nome: type.varchar({ length: 50 }).notNull(),
    cognome: type.varchar({ length: 50 }).notNull(),
    email: type.varchar({ length: 100 }).notNull().unique(),
    password: type.varchar("password_hash", { length: 255 }).notNull(),
    data_registrazione: type.timestamp().defaultNow()
});

export const relazioneUtenteIssue = relations(utente, ({ many, one }) => ({
    issues: many(issue),
}));

export const issue = pgTable('issue', {
    id_issue: type.integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
    id_utente: type.integer().references(() => utente.id_utente).notNull(),
    titolo: type.varchar({ length: 100 }).notNull(),
    priority: type.varchar({ length: 100 }).notNull(),
    tipo: type.varchar({ length: 100 }).notNull(),
    immagine_url: type.text().notNull(),
    data_caricamento: type.timestamp().defaultNow(),
});

export const relazioneIssueUtente = relations(issue, ({ one }) => ({
    utente: one(utente, {
        fields: [issue.id_utente],
        references: [utente.id_utente],
    }),
}));


export const commento = pgTable('commento', {
    id_commento: type.integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
    id_issue: type.integer().notNull().references(() => issue.id_issue),
    id_utente: type.integer().notNull().references(() => utente.id_utente),
    testo: type.varchar({ length: 255 }).notNull(),
    data_commento: type.timestamp().defaultNow()
});

export const relazioneCommentoUtenteIssue = relations(commento, ({ one }) => ({
    utente: one(utente, {
        fields: [commento.id_utente],
        references: [utente.id_utente],
    }),
    issue: one(issue, {
        fields: [commento.id_issue],
        references: [issue.id_issue],
    }),
}));

export const relazioneIssueCommentiEVoti = relations(issue, ({ many }) => ({
    commento: many(commento),
}));
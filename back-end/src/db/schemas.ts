import { relations, sql } from "drizzle-orm";
import { pgTable, pgEnum, pgRole } from "drizzle-orm/pg-core"
import * as type from "drizzle-orm/pg-core";

export const ruoloEnum = pgEnum('ruolo_enum', ["user", "admin"]);

export const utente = pgTable('utente', {
    // Se usi SERIAL nel DB, in Drizzle basta .primaryKey() senza generatedAlwaysAsIdentity
    id_utente: type.integer('id_utente').notNull().primaryKey(),

    // Aggiornata la lunghezza a 100 come da DB
    nome: type.varchar('nome', { length: 100 }).notNull(),
    cognome: type.varchar('cognome', { length: 100 }).notNull(),

    // Aggiornata la lunghezza a 255 come da DB
    email: type.varchar('email', { length: 255 }).notNull().unique(),
    password: type.varchar('password', { length: 255 }).notNull(),

    role: ruoloEnum('role').notNull().default("user"),

    // CORREZIONE CHIAVE: Mappiamo la proprietà su 'created_at' (Postgres non fa caso a MAIUSCOLE/minuscole nei nomi virgolettati se scritti così)
    data_registrazione: type.timestamp('created_at').defaultNow().notNull()
});

export const relazioneUtenteIssue = relations(utente, ({ many, one }) => ({
    issues: many(issue),
}));

export const admin = pgRole('admin').existing();

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
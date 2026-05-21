-- ============================================================
-- SCHEMA DEL DATABASE – PostgreSQL
-- ============================================================

-- Tipi ENUM
CREATE TYPE ruolo_enum     AS ENUM ('user', 'admin');
CREATE TYPE tipo_issue     AS ENUM ('question', 'bug', 'documentation', 'feature');
CREATE TYPE priorita_enum  AS ENUM ('low', 'medium', 'high');
CREATE TYPE stato_enum     AS ENUM ('todo', 'in_progress', 'done');

-- ============================================================
-- Tabella UTENTE
CREATE TABLE UTENTE (
    ID_UTENTE   SERIAL          NOT NULL,
    NOME        VARCHAR(100)    NOT NULL,
    COGNOME     VARCHAR(100)    NOT NULL,
    EMAIL       VARCHAR(255)    NOT NULL UNIQUE,
    PASSWORD    VARCHAR(255)    NOT NULL,
    ROLE        ruolo_enum      NOT NULL DEFAULT 'user',
    CREATED_AT  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (ID_UTENTE)
);

-- ============================================================
-- Tabella ISSUE
CREATE TABLE ISSUE (
    ID_ISSUE    SERIAL          NOT NULL,
    ID_UTENTE   INT             NOT NULL,
    TITOLO      VARCHAR(255)    NOT NULL,
    DESCRIZIONE TEXT            NOT NULL,
    TIPO        tipo_issue      NOT NULL,
    PRIORITA    priorita_enum   DEFAULT NULL,
    STATO       stato_enum      NOT NULL DEFAULT 'todo',
    IMMAGINE    TEXT    DEFAULT NULL,
    CREATED_AT  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (ID_ISSUE),
    CONSTRAINT fk_issue_utente
        FOREIGN KEY (ID_UTENTE) REFERENCES UTENTE(ID_UTENTE)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_issue_tipo     ON ISSUE(TIPO);
CREATE INDEX idx_issue_stato    ON ISSUE(STATO);
CREATE INDEX idx_issue_priorita ON ISSUE(PRIORITA);
CREATE INDEX idx_issue_utente   ON ISSUE(ID_UTENTE);

-- ============================================================
-- Tabella COMMENTO
CREATE TABLE COMMENTO (
    ID_COMMENTO SERIAL          NOT NULL,
    ID_UTENTE   INT             NOT NULL,
    ID_ISSUE    INT             NOT NULL,
    COMMENTO    TEXT            NOT NULL,
    CREATED_AT  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (ID_COMMENTO),
    CONSTRAINT fk_commento_utente
        FOREIGN KEY (ID_UTENTE) REFERENCES UTENTE(ID_UTENTE)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_commento_issue
        FOREIGN KEY (ID_ISSUE) REFERENCES ISSUE(ID_ISSUE)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_commento_issue ON COMMENTO(ID_ISSUE);

-- ============================================================
-- Account amministratore di default
INSERT INTO UTENTE (NOME, COGNOME, EMAIL, PASSWORD, ROLE)
VALUES (
    'Admin',
    'System',
    'admin@sistema.it',
    '$2a$12$j6nYpo01iwP3/eikr7YkWun72bDKpxJkwRYIhLi3YLvEMdDMxrYAC' ## test1234
    'admin'
);
import { test, expect } from '@playwright/test';

test.describe.serial('Flusso Completo Applicazione', () => {

    test.describe('Verifiche sulla pagina di Login', () => {

        test('La pagina mostra correttamente i titoli visivi di Material UI', async ({ page }) => {
            await page.goto('/');
            const titoloPagina = page.getByText(/Pagina di Login/i);
            await expect(titoloPagina).toBeVisible();

            const sottotitolo = page.getByText('Accedi al tuo account');
            await expect(sottotitolo).toBeVisible();
        });

        test('Dovrebbe mostrare il banner di errore se le credenziali sono errate', async ({ page }) => {
            await page.route('/user/login', async route => {
                await route.fulfill({
                    status: 401,
                    json: { message: 'Unauthorized' }
                });
            });

            await page.goto('/');
            await page.getByLabel(/email/i).fill('utente-sbagliato@azienda.com');
            await page.getByLabel(/password/i).fill('passwordErrata');
            await page.getByRole('button', { name: 'Accedi' }).click();

            const bannerErrore = page.getByText('Login fallito, utente non esistente o le credenziali non sono corrette');
            await expect(bannerErrore).toBeVisible();
        });

        test('Dovrebbe effettuare il login con successo e reindirizzare alla dashboard', async ({ page }) => {
            await page.route('/user/login', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    json: {
                        token: 'finto-jwt-token-valido',
                        user: { email: 'admin@sistema.it', role: 'admin', isAdmin: true } // Assicurati che qui rispecchi la logica del tuo FE (es. isAdmin)
                    }
                });
            });

            await page.goto('/');
            await page.getByLabel(/email/i).fill('admin@sistema.it');
            await page.getByLabel(/password/i).fill('test1234');
            await page.getByRole('button', { name: 'Accedi' }).click();

            await expect(page).toHaveURL('/dashboard');

            // Salviamo lo stato di autenticazione (cookie, localStorage, ecc.)
            await page.context().storageState({ path: 'playwright/.auth/user.json' });
        });
    });

    test.describe('Dashboard E2E Tests', () => {

        test.beforeEach(async ({ page }) => {
            await page.goto('/');

            // Trova i campi di login (adatta i selettori se usi placeholder o label diverse)
            await page.getByLabel(/email/i).fill('admin@sistema.it');
            await page.getByLabel(/password/i).fill('test1234')

            // Clicca sul pulsante di login per entrare nella Dashboard
            await page.getByRole('button', { name: /accedi/i }).click();

            // Aspetta che la Dashboard carichi controllando la colonna TODO
            await expect(page.getByText('TODO')).toBeVisible();
        });

        test('Dovrebbe mostrare correttamente il layout  con le tre colonne principali', async ({ page }) => {
            const colonnaTodo = page.locator('text=TODO');
            const colonnaInProgress = page.locator('text=IN_PROGRESS');
            const colonnaDone = page.locator('text=DONE');

            await expect(colonnaTodo).toBeVisible();
            await expect(colonnaInProgress).toBeVisible();
            await expect(colonnaDone).toBeVisible();
        });

        test('Dovrebbe filtrare i ticket quando si cambia la priorità', async ({ page }) => {
            const rispostaAPIPromise = page.waitForResponse(response =>
                response.url().includes('/issue?priorita=alta') && response.status() === 200
            );

            await page.getByLabel('Priorità Ticket').click();
            await page.getByRole('option', { name: 'Alta' }).click();
            await rispostaAPIPromise;
        });
        test('Dovrebbe mostrare le funzioni Admin e aprire la modale di creazione utente', async ({ page }) => {
            const bottoneCreaUtente = page.getByRole('button', { name: 'Crea utente' });

            // Ora il bottone sarà visibile perché l'app riceve i dati di sessione corretti
            await expect(bottoneCreaUtente).toBeVisible();
            await expect(bottoneCreaUtente).toBeEnabled();

            await bottoneCreaUtente.click();

            const modale = page.getByRole('dialog');
            await expect(modale).toBeVisible();
        });
    });

    test.describe('Flusso Creazione Nuova Issue nella Dashboard', () => {

        // Eseguiamo il login prima di testare la creazione della issue
        test.beforeEach(async ({ page }) => {
            await page.goto('/');

            // Trova i campi di login (adatta i selettori se usi placeholder o label diverse)
            await page.getByLabel(/email/i).fill('admin@sistema.it');
            await page.getByLabel(/password/i).fill('test1234')

            // Clicca sul pulsante di login per entrare nella Dashboard
            await page.getByRole('button', { name: /accedi/i }).click();

            // Aspetta che la Dashboard carichi controllando la colonna TODO
            await expect(page.getByText('TODO')).toBeVisible();
        });

        test('Dovrebbe aprire la modale, compilare il form e creare una issue con successo', async ({ page }) => {
            // 1. Clicca sul pulsante "Crea ticket" presente nella Dashboard
            const btnCreaTicket = page.getByRole('button', { name: 'Crea ticket' });
            await expect(btnCreaTicket).toBeVisible();
            await btnCreaTicket.click();

            // 2. Verifica che la modale del form (FormModal) sia aperta
            // (Immaginando che il form contenga i campi Titolo, Descrizione e Priorità)
            const inputTitolo = page.getByLabel(/Titolo/i);
            const inputDescrizione = page.getByLabel(/Descrizione/i);

            await expect(inputTitolo).toBeVisible();

            // 3. Compila i campi del form
            await inputTitolo.fill('Test Bug Grafico Dashboard');
            await inputDescrizione.fill('Il testo esce fuori dai margini della card nella colonna IN PROGRESS su schermi piccoli.');

            // Clicca sulla Select usando il suo ID specifico
            await page.locator('#priority').click();

            // Clicca sulla voce del menu che si è aperta
            await page.getByRole('option', { name: 'Alta' }).click();

            // --- GESTIONE SELECT TIPOLOGIA ---
            await page.locator('#typo').click();
            await page.getByRole('option', { name: 'Bug' }).click()

            // 4. Invia il form (adatta il nome del pulsante invio/conferma dentro FormModal)
            await page.getByRole('button', { name: /Crea ticket/i }).click();

            // 5. Verifica la comparsa del banner di successo (DomicileBanner)
            // Nel tuo codice ha titolo "Successo" e messaggio "Inserimento issue completato"
            const bannerSuccessoTitle = page.getByText('Successo');
            const bannerSuccessoMessage = page.getByText('Inserimento issue completato');

            await expect(bannerSuccessoTitle).toBeVisible();
            await expect(bannerSuccessoMessage).toBeVisible();

            // 6. [Opzionale] Verifica che la nuova issue sia visibile nella colonna "TODO"
            const nuovaCardIssue = page.locator('.MuiCard-root', { hasText: 'Test Bug Grafico Dashboard' });
            await expect(nuovaCardIssue).toBeVisible();

            // Controlla che mostri il tag corretto (es: tipo di ticket)
            await expect(nuovaCardIssue.getByText('#')).toBeVisible(); // Controlla la presenza dell'ID generato
        });
    });
});
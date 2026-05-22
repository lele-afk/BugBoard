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
        });
    });

    test.describe('Dashboard E2E Tests', () => {

        test.beforeEach(async ({ page }) => {
            await page.goto('/');

            await page.getByLabel(/email/i).fill('admin@sistema.it');
            await page.getByLabel(/password/i).fill('test1234')

            await page.getByRole('button', { name: /accedi/i }).click();

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

            await expect(bottoneCreaUtente).toBeVisible();
            await expect(bottoneCreaUtente).toBeEnabled();

            await bottoneCreaUtente.click();

            const modale = page.getByRole('dialog');
            await expect(modale).toBeVisible();
        });
    });

    test.describe('Flusso Creazione Nuova Issue nella Dashboard', () => {

        test.beforeEach(async ({ page }) => {
            await page.goto('/');

            await page.getByLabel(/email/i).fill('admin@sistema.it');
            await page.getByLabel(/password/i).fill('test1234')

            await page.getByRole('button', { name: /accedi/i }).click();

            await expect(page.getByText('TODO')).toBeVisible();
        });

        test('Dovrebbe aprire la modale, compilare il form e creare una issue con successo', async ({ page }) => {
            const suffissoUnico = Date.now();
            const titoloUnico = `Test Bug Grafico Dashboard - ${suffissoUnico}`;

            const btnCreaTicket = page.getByRole('button', { name: 'Crea ticket' });
            await expect(btnCreaTicket).toBeVisible();
            await btnCreaTicket.click();

            const inputTitolo = page.getByLabel(/Titolo/i);
            const inputDescrizione = page.getByLabel(/Descrizione/i);

            await expect(inputTitolo).toBeVisible();

            await inputTitolo.fill(titoloUnico);
            await inputDescrizione.fill('Il testo esce fuori dai margini della card nella colonna IN PROGRESS su schermi piccoli.');

            await page.locator('#priority').click();
            await page.getByRole('option', { name: 'Alta' }).click();

            await page.locator('#typo').click();
            await page.getByRole('option', { name: 'Bug' }).click();

            await page.getByRole('button', { name: /Crea ticket/i }).click();

            const bannerSuccessoTitle = page.getByText('Successo');
            const bannerSuccessoMessage = page.getByText('Inserimento issue completato');

            await expect(bannerSuccessoTitle).toBeVisible();
            await expect(bannerSuccessoMessage).toBeVisible();

            const nuovaCardIssue = page.locator('.MuiCard-root', { hasText: titoloUnico });
            await expect(nuovaCardIssue).toBeVisible();

            await expect(nuovaCardIssue.getByText('#')).toBeVisible();
        });
    });
});
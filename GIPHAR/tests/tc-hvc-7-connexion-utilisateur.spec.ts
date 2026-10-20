import { test, expect, type Page } from '@playwright/test';

// Référence Squash : TC-HVC-7 (couvre l'exigence HVC-7).
// Le cas suppose un compte existant. Pour ne dépendre d'aucun secret, le test crée
// d'abord son propre compte (identifiant unique, suffixe horaire) en préparation,
// hors des pas Squash, puis repart d'une session anonyme avant le premier pas.

async function ouvrirConnexion(page: Page) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Se connecter' }).click();
  await expect(page.locator('#modal-login')).toBeVisible();
}

test('TC-HVC-7: Connexion utilisateur', async ({ page }) => {
  const suffixe = Date.now();
  const identifiant = `homey_login_${suffixe}`;
  const motDePasse = 'MotDePasse!2026';

  // Préparation (pas un pas Squash) : créer le compte qui servira à se connecter.
  await page.goto('/');
  await page.getByRole('link', { name: "S'inscrire" }).click();
  await page.locator('#modal-register input[name="username"]').fill(identifiant);
  await page.locator('#modal-register input[name="useremail"]').fill(`${identifiant}@example.com`);
  await page.locator('#modal-register input[name="register_pass"]').fill(motDePasse);
  await page.locator('#modal-register input[name="register_pass_retype"]').fill(motDePasse);
  await page.locator('#modal-register input[name="term_condition"]').check();
  await page.locator('#modal-register').getByRole('button', { name: "S'inscrire" }).click();
  await expect(page.getByText(/account was created/i).first()).toBeVisible();
  await page.context().clearCookies();

  await test.step("Ouvrir la page d'accueil, cliquer sur Se connecter, saisir des identifiants valides, cocher Se souvenir de moi, puis valider.", async () => {
    await ouvrirConnexion(page);
    const modale = page.locator('#modal-login');
    await modale.locator('input[name="username"]').fill(identifiant);
    await modale.locator('input[name="password"]').fill(motDePasse);
    await modale.locator('input[name="remember"]').check();
    await modale.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByRole('link', { name: 'Se connecter' })).not.toBeVisible({ timeout: 15000 });
  });

  await test.step('Se deconnecter puis se connecter avec des identifiants invalides.', async () => {
    // Déconnexion : on repart d'une session anonyme.
    await page.context().clearCookies();
    await ouvrirConnexion(page);
    const modale = page.locator('#modal-login');
    await modale.locator('input[name="username"]').fill(`inconnu_${suffixe}`);
    await modale.locator('input[name="password"]').fill('mauvais-mot-de-passe');
    await modale.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByText(/invalid username or email/i).first()).toBeVisible();
  });
});

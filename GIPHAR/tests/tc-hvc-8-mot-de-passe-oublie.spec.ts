import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-8 (couvre l'exigence HVC-8).
// Le site refuse la demande pour un email inconnu (« There is no user registered with
// that email address. »). Le test crée donc d'abord son propre compte (identifiant
// unique, suffixe horaire) en préparation, hors des pas Squash, puis repart d'une
// session anonyme avant le premier pas.
test('TC-HVC-8: Réinitialisation du mot de passe', async ({ page }) => {
  const identifiant = `homey_reset_${Date.now()}`;
  const email = `${identifiant}@example.com`;
  const motDePasse = 'MotDePasse!2026';

  // Préparation (pas un pas Squash) : créer le compte dont on oubliera le mot de passe.
  await page.goto('/');
  await page.getByRole('link', { name: "S'inscrire" }).click();
  await page.locator('#modal-register input[name="username"]').fill(identifiant);
  await page.locator('#modal-register input[name="useremail"]').fill(email);
  await page.locator('#modal-register input[name="register_pass"]').fill(motDePasse);
  await page.locator('#modal-register input[name="register_pass_retype"]').fill(motDePasse);
  await page.locator('#modal-register input[name="term_condition"]').check();
  await page.locator('#modal-register').getByRole('button', { name: "S'inscrire" }).click();
  await expect(page.getByText(/account was created/i).first()).toBeVisible();
  await page.context().clearCookies();

  await test.step("Ouvrir la page d'accueil, cliquer sur Se connecter puis sur « mot de passe oublie ? ».", async () => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Se connecter' }).click();
    await expect(page.locator('#modal-login')).toBeVisible();
    await page.getByText(/mot de passe oubli/i).first().click();
    await expect(page.locator('#user_login_forgot')).toBeVisible();
  });

  await test.step('Saisir un email et cliquer sur Soumettre.', async () => {
    await page.locator('#user_login_forgot').fill(email);
    await page.locator('#homey_forgetpass').click();
    const message = page.locator('#homey_msg_reset');
    await expect(message).toBeVisible({ timeout: 15000 });
    // Le site affiche d'abord « veuillez patienter » : attendre la réponse finale.
    await expect(message).not.toHaveText(/patienter/i, { timeout: 20000 });
    console.log('Message affiché :', await message.innerText());
    await expect(message).not.toHaveText(/no user registered|error|erreur|invalid/i);
    await expect(message).toHaveText(/check your e-?mail|lien|link|envoy|sent/i);
  });
});

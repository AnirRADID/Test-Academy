import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-6 (couvre l'exigence HVC-6).
// Chaque exécution crée un compte avec un identifiant unique (suffixe horaire)
// pour ne jamais entrer en collision avec un compte existant sur le site.
test('TC-HVC-6: Inscription d\'un nouveau compte', async ({ page }) => {
  const suffixe = Date.now();

  await test.step('Créer un compte avec mot de passe et confirmation identiques', async () => {
    await page.goto('/');
    await page.getByRole('link', { name: "S'inscrire" }).click();
    await page.locator('#modal-register input[name="username"]').fill(`homey_test_${suffixe}`);
    await page.locator('input[name="useremail"]').fill(`homey_test_${suffixe}@example.com`);
    await page.locator('input[name="register_pass"]').fill('MotDePasse!2026');
    await page.locator('input[name="register_pass_retype"]').fill('MotDePasse!2026');
    await page.locator('input[name="term_condition"]').check();
    await page.getByRole('button', { name: "S'inscrire" }).click();
    await expect(page.getByText(/account was created/i).first()).toBeVisible();
  });

  await test.step('Refuser l\'inscription si les mots de passe diffèrent', async () => {
    await page.goto('/');
    await page.getByRole('link', { name: "S'inscrire" }).click();
    await page.locator('#modal-register input[name="username"]').fill(`homey_test_${suffixe}_b`);
    await page.locator('input[name="useremail"]').fill(`homey_test_${suffixe}_b@example.com`);
    await page.locator('input[name="register_pass"]').fill('MotDePasse!2026');
    await page.locator('input[name="register_pass_retype"]').fill('AutreMotDePasse!');
    await page.locator('input[name="term_condition"]').check();
    await page.getByRole('button', { name: "S'inscrire" }).click();
    await expect(page.getByText(/passwords do not match/i).first()).toBeVisible();
  });
});

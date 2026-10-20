import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-8 (couvre l'exigence HVC-8).
test('TC-HVC-8: Réinitialisation du mot de passe', async ({ page }) => {
  await page.goto('/');

  await test.step("Ouvrir le formulaire de connexion puis « mot de passe oublié ? »", async () => {
    await page.getByRole('link', { name: 'Se connecter' }).click();
    await page.getByText('mot de passe oublié?').click();
    await expect(page.locator('#user_login_forgot')).toBeVisible();
  });

  await test.step('Saisir un email et soumettre la demande de réinitialisation', async () => {
    await page.locator('#user_login_forgot').fill('test@example.com');
    await page.locator('#homey_forgetpass').click();
    await expect(page.locator('#homey_msg_reset')).not.toBeEmpty();
  });
});

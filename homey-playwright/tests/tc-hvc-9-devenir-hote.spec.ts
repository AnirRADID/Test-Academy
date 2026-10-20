import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-9 (couvre l'exigence HVC-9).
test('TC-HVC-9: Devenir hôte', async ({ page }) => {
  await page.goto('/');

  await test.step("Cliquer sur le lien Devenir un hôte depuis la page d'accueil", async () => {
    await page.getByRole('link', { name: 'Devenir un hôte' }).first().click();
    await expect(page).toHaveURL(/become-a-host/);
  });

  await test.step('Vérifier que la page présente le parcours pour publier une annonce', async () => {
    await expect(page.getByRole('heading', { name: 'Become a Host' }).first()).toBeVisible();
  });
});

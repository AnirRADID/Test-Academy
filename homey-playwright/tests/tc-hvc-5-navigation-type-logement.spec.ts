import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-5 (couvre l'exigence HVC-5). Un seul pas Squash,
// donc un seul test.step().
test('TC-HVC-5: Navigation par type de logement', async ({ page }) => {
  await test.step("Cliquer sur une catégorie de logement depuis la page d'accueil", async () => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Studio' }).click();
    await expect(page).toHaveURL(/type\/studio/);
  });
});

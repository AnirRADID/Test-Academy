import { test, expect } from '@playwright/test';

// Références Squash : TC-HVC-9 (couvrent l'exigence HVC-9).
// Ancienne story à cas unique : un seul test, un test.step() par pas Squash.
test('TC-HVC-9: Devenir hôte', async ({ page }) => {
  await page.goto('/');

  await test.step("Depuis la page d'accueil, cliquer sur le lien Devenir un hote.", async () => {
    await page.getByRole('link', { name: /Devenir un h[oô]te/i }).first().click();
    await expect(page).toHaveURL(/become-a-host/);
  });

  await test.step('Observer le contenu de la page.', async () => {
    await expect(page.getByRole('heading', { name: /Become a Host/i }).first()).toBeVisible();
  });
});

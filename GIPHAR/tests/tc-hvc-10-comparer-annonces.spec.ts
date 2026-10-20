import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-10 (couvre l'exigence HVC-10).
// Les liens "Comparer" (.homey_compare) et l'étiquette du panneau sont stylés par le
// thème avec une boîte de taille nulle (icône purement visuelle) : Playwright les juge
// "non visibles" même si l'utilisateur les voit et les clique réellement. dispatchEvent
// contourne la vérification d'actionabilité sans changer le comportement de l'appli.
test('TC-HVC-10: Comparer des annonces', async ({ page }) => {
  await page.goto('/index.php/search-results/?city=miami');

  await test.step('Sélectionner deux logements pour la comparaison', async () => {
    const liensComparer = page.locator('.homey_compare');
    await liensComparer.nth(0).dispatchEvent('click');
    await liensComparer.nth(1).dispatchEvent('click');
    await expect(page.locator('.compare-property-label .compare-count')).toHaveText('2');
  });

  await test.step('Ouvrir le panneau de comparaison', async () => {
    await page.locator('.compare-property-label').dispatchEvent('click');
    await expect(page.locator('.compare-wrap .compare-item')).toHaveCount(2);
  });

  await test.step('Cliquer sur Comparer et vérifier la page de comparaison', async () => {
    await page.locator('a.compare-btn').click();
    await expect(page).toHaveURL(/\/compare\//);
    await expect(page.getByText('Prix', { exact: true })).toBeVisible();
  });
});

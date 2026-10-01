import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-3 (couvre l'exigence HVC-3).
// Même overlay de recherche mobile que TC-HVC-2 (voir son commentaire d'en-tête) :
// viewport mobile + tap() pour ouvrir le panneau, clic sur le <label> (pas l'input,
// masqué visuellement) pour cocher.
test.use({ viewport: { width: 414, height: 896 }, hasTouch: true });

test('TC-HVC-3: Filtrage par équipements et installations', async ({ page }) => {
  await page.goto('/');
  await page.locator('.search-banner-mobile').click();
  await page.locator('.search-filter-mobile-btn').tap();

  await test.step('Cocher plusieurs équipements simultanément dans le panneau Avancée', async () => {
    const climatisation = page.locator('input[name="amenity[]"][value="air-conditioning"]').last();
    const piscine = page.locator('input[name="amenity[]"][value="swimming-pool"]').last();
    await climatisation.locator('xpath=ancestor::label[1]').click();
    await piscine.locator('xpath=ancestor::label[1]').click();
    // Les deux cases doivent rester cochées en même temps : cumul, pas exclusion.
    await expect(climatisation).toBeChecked();
    await expect(piscine).toBeChecked();
  });

  await test.step('Appliquer les filtres et vérifier que la recherche est relancée avec les deux critères', async () => {
    await page.getByRole('button', { name: 'Appliquer des filtres' }).last().click();
    await expect(page).toHaveURL(/search-results/);
    const params = new URL(page.url()).searchParams.getAll('amenity[]');
    expect(params).toContain('air-conditioning');
    expect(params).toContain('swimming-pool');
  });
});

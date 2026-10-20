import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-2 (couvre l'exigence HVC-2).
// Le panneau "Avancée" vit dans l'overlay de recherche plein écran du thème (ouvert au
// toucher sur `.search-banner-mobile`, geste `touchstart` — d'où viewport mobile + tap()
// plus bas), et non dans la barre de recherche desktop. `.last()` cible systématiquement
// cette copie overlay du formulaire : le thème duplique les mêmes champs (desktop + overlay).
test.use({ viewport: { width: 414, height: 896 }, hasTouch: true });

test('TC-HVC-2: Recherche avancée par filtres', async ({ page }) => {
  await page.goto('/');
  await page.locator('.search-banner-mobile').click();

  await test.step("Ouvrir le panneau de recherche avancée et choisir des critères", async () => {
    await page.locator('.search-filter-mobile-btn').tap();
    // Sélection directe sur les <select> natifs (chambres, pièces) pour rester fiable
    // sans dépendre du rendu visuel du widget "selectpicker".
    await page.locator('select[name="bedrooms"]').last().selectOption({ index: 1 }, { force: true });
    await page.locator('select[name="rooms"]').last().selectOption({ index: 1 }, { force: true });
    // La case réelle est visuellement masquée par le thème (indicateur personnalisé) :
    // on clique son <label>, seul élément qui déclenche réellement la coche.
    const wifi = page.locator('input[name="amenity[]"][value="swimming-pool"]').last();
    await wifi.locator('xpath=ancestor::label[1]').click();
    await expect(wifi).toBeChecked();
  });

  await test.step("Appliquer les filtres et vérifier que la recherche est relancée", async () => {
    await page.getByRole('button', { name: 'Appliquer des filtres' }).last().click();
    await expect(page).toHaveURL(/search-results/);
  });

  await test.step("Réinitialiser les filtres avancés", async () => {
    await page.goBack();
    await page.locator('.search-banner-mobile').click();
    await page.locator('.search-filter-mobile-btn').tap();
    await page.getByRole('button', { name: 'Réinitialiser' }).last().click();
    await expect(page.locator('input[name="amenity[]"][value="swimming-pool"]').last()).not.toBeChecked();
  });
});

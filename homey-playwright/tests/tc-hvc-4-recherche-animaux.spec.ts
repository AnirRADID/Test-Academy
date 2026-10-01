import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-4 (couvre l'exigence HVC-4).
// Le widget Voyageurs (avec son sélecteur Animaux) vit dans le même overlay de recherche
// mobile que TC-HVC-2/TC-HVC-3 (voir leur commentaire d'en-tête) : viewport mobile, overlay
// ouvert via `.search-banner-mobile`, puis clic sur le <label> du bouton radio (l'input est
// masqué visuellement par le thème).
test.use({ viewport: { width: 414, height: 896 }, hasTouch: true });

test('TC-HVC-4: Recherche avec ou sans animaux', async ({ page }) => {
  await page.goto('/');
  await page.locator('.search-banner-mobile').click();
  await page.locator('input[name="guest"]').last().click();

  const avecAnimaux = page.locator('input[name="pets"][value="1"]').last();
  const sansAnimaux = page.locator('input[name="pets"][value="0"]').last();

  await test.step("Choisir « avec animaux » et vérifier l'exclusivité du choix", async () => {
    await avecAnimaux.locator('xpath=ancestor::label[1]').click();
    await expect(avecAnimaux).toBeChecked();
    await sansAnimaux.locator('xpath=ancestor::label[1]').click();
    // Le bouton radio est exclusif : choisir "Non" désélectionne "Oui".
    await expect(avecAnimaux).not.toBeChecked();
    await expect(sansAnimaux).toBeChecked();
    await avecAnimaux.locator('xpath=ancestor::label[1]').click();
  });

  await test.step('Appliquer le filtre Voyageurs et vérifier que la recherche le respecte', async () => {
    await page.locator('.guest-apply-btn .btn').last().click();
    await page.locator('#search_submit_button').click();
    await expect(page).toHaveURL(/search-results/);
    expect(new URL(page.url()).searchParams.get('pets')).toBe('1');
  });
});

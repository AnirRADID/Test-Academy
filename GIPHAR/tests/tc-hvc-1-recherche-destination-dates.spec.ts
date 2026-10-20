import { test, expect } from '@playwright/test';

// Référence Squash : TC-HVC-1 (couvre l'exigence HVC-1).
// Un fichier = un cas de test Squash. Chaque test.step() ci-dessous correspond
// à un "pas" du cas de test dans Squash — le rapporteur (étape 4) comptera ces
// pas pour les faire correspondre à ceux déclarés côté Squash.
test('TC-HVC-1: Recherche de logements par destination et dates', async ({ page }) => {
  await test.step('Rechercher avec une ville, des dates valides et un nombre de voyageurs', async () => {
    await page.goto('/index.php/search-results/?city=1&arrive=2026-10-01&depart=2026-10-08&guest=2');
    await expect(page.locator('body')).toBeVisible();
  });

  await test.step('Refuser la recherche si la destination est vide (défaut connu CT-06)', async () => {
    await page.goto('/index.php/search-results/?city=&arrive=2026-10-01&depart=2026-10-08&guest=2');
    // Ce que l'application DEVRAIT garantir. Homey affiche pourtant les résultats
    // même destination vide : ce test est donc attendu en échec pour l'instant.
    await expect(page).not.toHaveURL(/city=&/);
  });

  await test.step("Refuser ou signaler une période inversée (défaut connu CT-08)", async () => {
    await page.goto('/index.php/search-results/?city=1&arrive=2026-10-08&depart=2026-10-01&guest=2');
    // Même logique : Homey affiche tout son catalogue sans avertir. Échec attendu.
    await expect(page.getByText(/date|période/i)).toBeVisible();
  });
});

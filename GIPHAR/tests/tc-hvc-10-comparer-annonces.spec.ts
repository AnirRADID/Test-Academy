import { test, expect, type Page } from '@playwright/test';

// Références Squash : TC-HVC-10 (couvrent l'exigence HVC-10).
// Ancienne story à cas unique : un seul test, un test.step() par pas Squash.
// Les liens "Comparer" (.homey_compare) et l'étiquette du panneau sont stylés par le
// thème avec une boîte de taille nulle (icône purement visuelle) : Playwright les juge
// "non visibles" même si l'utilisateur les voit et les clique réellement. dispatchEvent
// contourne la vérification d'actionabilité sans changer le comportement de l'appli.

// Une ligne du tableau de comparaison : son libellé (1re colonne) puis une cellule par logement.
function ligneDeComparaison(page: Page, libelle: string) {
  return page.locator('table tbody tr').filter({
    has: page.locator('td:first-child', { hasText: new RegExp(`^\\s*${libelle}\\s*$`) }),
  });
}

test('TC-HVC-10: Comparer des annonces', async ({ page }) => {
  const liensComparer = page.locator('.homey_compare');
  const titres: string[] = [];

  await test.step('Lancer une recherche de logements (par exemple sur la ville de Miami).', async () => {
    await page.goto('/index.php/search-results/?city=miami');
    await expect(liensComparer.first()).toBeAttached();
    expect(await liensComparer.count()).toBeGreaterThanOrEqual(2);
  });

  await test.step('Cliquer sur « Comparer » pour le premier logement, puis pour le deuxième logement.', async () => {
    await liensComparer.nth(0).dispatchEvent('click');
    await liensComparer.nth(1).dispatchEvent('click');
    await expect(page.locator('.compare-property-label .compare-count')).toHaveText('2');
  });

  await test.step('Ouvrir le panneau de comparaison.', async () => {
    await page.locator('.compare-property-label').dispatchEvent('click');
    await expect(page.locator('.compare-wrap .compare-item')).toHaveCount(2);
  });

  await test.step('Cliquer sur le bouton « Comparer » du panneau.', async () => {
    await page.locator('a.compare-btn').click();
    await expect(page).toHaveURL(/\/compare\//);
    // Côte à côte : une colonne par logement, chacune avec sa photo et son titre.
    await expect(page.locator('table thead th a img')).toHaveCount(2);
    const cellulesTitre = ligneDeComparaison(page, 'Titre').locator('td:not(:first-child)');
    await expect(cellulesTitre).toHaveCount(2);
    for (const texte of await cellulesTitre.allInnerTexts()) {
      expect(texte.trim()).not.toBe('');
      titres.push(texte.trim());
    }
    expect(titres[0]).not.toBe(titres[1]);
  });

  await test.step('Observer le contenu de la page de comparaison.', async () => {
    // Prix : une valeur par logement.
    const prix = ligneDeComparaison(page, 'Prix').locator('td:not(:first-child)');
    await expect(prix).toHaveCount(2);
    await expect(prix.nth(0)).toContainText(/\d/);
    await expect(prix.nth(1)).toContainText(/\d/);

    // Capacité : le nombre de chambres de chaque logement.
    const chambres = ligneDeComparaison(page, 'Chambres').locator('td:not(:first-child)');
    await expect(chambres).toHaveCount(2);
    await expect(chambres.nth(0)).toHaveText(/\d/);
    await expect(chambres.nth(1)).toHaveText(/\d/);

    // Équipements : chaque équipement indique présent / absent pour les deux logements.
    for (const equipement of ['Climatisation', 'Wi-Fi']) {
      const cellules = ligneDeComparaison(page, equipement).locator('td:not(:first-child)');
      await expect(cellules).toHaveCount(2);
      await expect(cellules.locator('i.fa-check, i.fa-times')).toHaveCount(2);
    }
  });
});

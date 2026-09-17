import { test, expect } from '@playwright/test';

/**
 * CT-06 - Lancer une recherche sans destination
 * Cas de test Squash : CT-06 (iteration IT-01, projet Homey-Demo)
 *
 * Critere d'acceptation attendu (Phase A) :
 *   Etant donne que je suis sur la page d'accueil de Homey
 *   Quand je lance une recherche sans avoir saisi de destination
 *   Alors la recherche n'est pas lancee et je reste sur la page d'accueil.
 *
 * Constat en A4 (execution manuelle) : ECHEC. Ce test reproduit cet echec reel.
 *
 * L'assertion reprend volontairement le mot-cle deja utilise par la suite Robot
 * Framework de l'equipe pour une recherche invalide :
 *   "Verifier Qu'On Est Toujours Sur La Page D'Accueil"
 */
test('CT-06 - Lancer une recherche sans destination', { tag: ['@CT-06'] }, async ({ page }) => {
  await page.goto('/');

  const formulaire = page.locator('#section-body form[action*="search-results"]').first();
  await formulaire.scrollIntoViewIfNeeded();

  // On soumet sans avoir renseigne la destination.
  await formulaire.locator('button').last().click();
  await page.waitForLoadState('domcontentloaded');

  await expect(
    page,
    "La recherche a ete lancee alors qu'aucune destination n'a ete saisie : "
    + "l'application affiche la page de resultats au lieu de reclamer une destination."
  ).not.toHaveURL(/search-results/);
});

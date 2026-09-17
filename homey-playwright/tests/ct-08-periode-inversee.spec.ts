import { test, expect, type Page } from '@playwright/test';

/**
 * CT-08 - Lancer une recherche avec une periode inversee
 * Cas de test Squash : CT-08 (iteration IT-01, projet Homey-Demo)
 *
 * Critere d'acceptation attendu (Phase A) :
 *   Etant donne que je suis sur la page de recherche de Homey
 *   Quand je lance une recherche dont la date de depart precede la date d'arrivee
 *   Alors l'application me signale que la periode est invalide, ou a tout le moins
 *   ne fait pas comme si aucune periode n'avait ete saisie.
 *
 * Constat en A4 (execution manuelle) : ECHEC. Ce test reproduit cet echec reel.
 *
 * Le test etablit d'abord que le filtre de dates fonctionne (une periode valide reduit
 * bien le nombre de logements), pour qu'il n'y ait aucune ambiguite sur la cause de
 * l'echec : ce n'est pas le filtre qui est casse, c'est la periode impossible qui est
 * jetee en silence.
 *
 * Format de date : ISO YYYY-MM-DD - c'est exactement ce que le calendrier de Homey
 * ecrit dans le champ (les cellules exposent li[data-formatted-date="2026-09-20"]).
 * Le calendrier n'empeche pas de choisir un depart anterieur a l'arrivee, et les champs
 * ne sont pas readonly sur l'accueil : la periode inversee est saisissable a la main.
 */

const RECHERCHE = '/index.php/search-results/';

/** Nombre total de logements annonce par la page ("138 Location"). */
async function nombreDeLogements(page: Page, query: string): Promise<number> {
  await page.goto(RECHERCHE + query, { waitUntil: 'domcontentloaded' });
  // La liste est rendue en JavaScript : attendre les cartes, pas seulement le DOM.
  await page.waitForSelector('#homey_halfmap_listings_container div.item-wrap', { timeout: 20_000 });
  const texte = await page.locator('body').innerText();
  const m = texte.replace(/\s+/g, ' ').match(/(\d+)\s+Location/);
  if (!m) throw new Error("Nombre de logements introuvable sur la page de resultats");
  return Number(m[1]);
}

test('CT-08 - Lancer une recherche avec une periode inversee', { tag: ['@CT-08'] }, async ({ page }) => {
  // 1. Reference : aucune periode saisie -> catalogue complet.
  const catalogueComplet = await nombreDeLogements(page, '?city=');

  // 2. Controle : une periode valide filtre bien. Si cette assertion casse un jour,
  //    c'est le filtre lui-meme qui a change, et le diagnostic de l'etape 3 ne tient plus.
  const periodeValide = await nombreDeLogements(page, '?city=&arrive=2026-09-15&depart=2026-09-20');
  expect(
    periodeValide,
    `Le filtre de dates ne filtre plus rien (${periodeValide} logements, comme sans dates) : `
    + `verifier l'application avant d'interpreter l'echec ci-dessous.`,
  ).toBeLessThan(catalogueComplet);

  // 3. Le defaut : une periode impossible (depart avant arrivee).
  const periodeInversee = await nombreDeLogements(page, '?city=&arrive=2026-09-20&depart=2026-09-15');

  expect(
    periodeInversee,
    `Periode inversee ignoree en silence : ${periodeInversee} logements affiches, `
    + `soit exactement le catalogue complet (${catalogueComplet}), alors qu'une periode valide `
    + `le reduit a ${periodeValide}. L'application ne signale rien et presente ces logements `
    + `comme disponibles pour une periode qui ne peut pas exister.`,
  ).not.toBe(catalogueComplet);
});

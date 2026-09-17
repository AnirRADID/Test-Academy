import type {
  Reporter, FullConfig, Suite, TestCase, TestResult, FullResult,
} from '@playwright/test/reporter';

/**
 * Reporter Playwright -> Squash TM (leçon B6).
 *
 * Envoie les resultats d'execution a Squash, en fin de run, via :
 *   POST {SQUASH_URL}/api/rest/latest/import/results/{SQUASH_ITERATION_ID}
 *
 * Cet endpoint est gratuit sur une instance auto-hebergee ; il est desactive sur
 * Squash Cloud Premium (seul garde-fou du controleur : denyFeatureForCloudPremium).
 *
 * PIEGE A CONNAITRE : l'appariement ne se fait PAS sur la reference du cas de test,
 * mais sur son champ `automated_test_reference`. Tant que ce champ est vide cote
 * Squash, l'import repond :
 *   « Test with reference CT-08 and an empty dataset not found in iteration IT-01 Recette v1 »
 * C'est exactement l'erreur que B6 fait apparaitre volontairement sur CT-08.
 *
 * SECOND PIEGE, cote Jenkins : `npx playwright test --reporter=html` REMPLACE la liste
 * de reporters de playwright.config.ts. Avec ce drapeau, ce fichier ne s'execute jamais
 * et l'import n'a pas lieu, sans le moindre message. Le stage B5 doit lancer
 * `npx playwright test` tout court.
 *
 * Variables d'environnement :
 *   SQUASH_URL          ex. http://127.0.0.1:8090/squash
 *   SQUASH_TOKEN        jeton d'acces personnel (PAT), droits READ_WRITE
 *   SQUASH_ITERATION_ID ex. 2  (IT-01 Recette v1)
 * Si le jeton est absent, le reporter ne fait rien : les executions locales de B4
 * fonctionnent sans Squash.
 */

/**
 * Statuts acceptes par Squash, pour un test comme pour un pas — c'est la meme liste :
 *   BLOCKED, CANCELLED, SUCCESS, RUNNING, SKIPPED, FAILURE, READY
 * Attention : NOT_RUN n'en fait PAS partie, alors qu'il existe ailleurs dans Squash.
 * Un test non joue est SKIPPED ; un pas non joue est READY.
 */
type SquashStatus =
  | 'BLOCKED' | 'CANCELLED' | 'SUCCESS' | 'RUNNING' | 'SKIPPED' | 'FAILURE' | 'READY';

/** Piece jointe : contenu en base64. Extensions admises a l'import : txt, html, xml, log. */
interface SquashAttachment {
  name: string;
  content: string;
}

interface SquashStep {
  status: SquashStatus;
}

interface SquashTest {
  reference: string;
  dataset_name: string | null;
  status: SquashStatus;
  duration: number;
  attachments: SquashAttachment[];
  test_steps: SquashStep[];
}

/** Ce que le reporter retient de chaque test, avant mise en forme du payload. */
interface ResultatLocal {
  reference: string;
  status: SquashStatus;
  duration: number;
  message: string | null;
}

/** Corps de reponse de l'import : SEULS LES TESTS EN ERREUR y figurent. */
interface ReponseImport {
  iteration_id?: number;
  tests?: Array<{ test_case_id: number | null; reference: string; error: string }>;
}

function toSquashStatus(status: TestResult['status']): SquashStatus {
  switch (status) {
    case 'passed':      return 'SUCCESS';
    case 'failed':      return 'FAILURE';
    case 'timedOut':    return 'FAILURE';
    case 'interrupted': return 'CANCELLED';
    case 'skipped':     return 'SKIPPED';
    default:            return 'BLOCKED';
  }
}

/** Retire les codes couleur ANSI du message d'erreur avant de l'envoyer a Squash. */
function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

/** La reference Squash est portee par le tag du test : @CT-06 -> CT-06. */
function squashReference(test: TestCase): string | null {
  const tag = test.tags.find((t) => /^@CT-\d+$/i.test(t));
  return tag ? tag.replace(/^@/, '') : null;
}

/** 4200 -> « 4,2 s » */
function duree(ms: number): string {
  return `${(ms / 1000).toFixed(1).replace('.', ',')} s`;
}

class SquashReporter implements Reporter {
  private resultats: ResultatLocal[] = [];
  private startedAt = new Date();
  private disabled = false;

  private readonly base = (process.env.SQUASH_URL ?? 'http://127.0.0.1:8090/squash').replace(/\/$/, '');
  private readonly iteration = process.env.SQUASH_ITERATION_ID ?? '2';

  /** reference -> nombre de pas du cas, et reference -> identifiant du cas. Lus dans Squash. */
  private nbPas = new Map<string, number>();
  private idDuCas = new Map<string, number>();
  /** La lecture du plan de test demarre avec les tests et n'est attendue qu'a la fin. */
  private planCharge: Promise<void> | null = null;

  onBegin(_config: FullConfig, _suite: Suite) {
    this.startedAt = new Date();
    if (!process.env.SQUASH_TOKEN) {
      this.disabled = true;
      console.log('[squash] SQUASH_TOKEN absent - aucun resultat ne sera envoye a Squash.');
      return;
    }
    // Lancee ici, attendue dans onEnd : elle tourne pendant que les tests s'executent.
    this.planCharge = this.chargerPlanDeTest();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const reference = squashReference(test);
    if (!reference) {
      console.log(`[squash] test sans tag @CT-xx, ignore : ${test.title}`);
      return;
    }
    this.resultats.push({
      reference,
      status: toSquashStatus(result.status),
      duration: result.duration,
      message: result.error?.message ? stripAnsi(result.error.message) : null,
    });
  }

  async onEnd(_result: FullResult) {
    if (this.disabled || this.resultats.length === 0) return;

    // Playwright AVALE les exceptions levees dans un reporter : sans ce try/catch, un
    // import rate ressemblerait a un import reussi — l'inverse de ce que B6 enseigne.
    try {
      await this.planCharge;

      const url = `${this.base}/api/rest/latest/import/results/${this.iteration}`;
      const globalStatus: SquashStatus =
        this.resultats.some((r) => r.status === 'FAILURE') ? 'FAILURE' : 'SUCCESS';

      const tests: SquashTest[] = this.resultats.map((r) => ({
        reference: r.reference,
        dataset_name: null,
        status: r.status,
        duration: r.duration,
        // `failure_details` est refuse hors Premium/Ultimate (« Adding failure details is
        // only available for SquashTM Premium or Ultimate licenses. »), et `comment` est
        // avale sans erreur. Le SEUL moyen de faire arriver le detail de l'echec dans
        // Squash Community est donc une piece jointe sur l'execution.
        attachments: this.pieceJointeEchec(r),
        test_steps: this.pasDuCas(r.reference, r.status),
      }));

      // Le contrat documente par Squash (api/rest/latest/docs/automated-test-result-import)
      // ne comporte que ces deux clefs. Les champs `infos` et `metadata` que l'on trouve
      // dans de vieux exemples sont acceptes puis IGNORES : rien n'en arrive en base.
      const payload = {
        automated_test_suite: { status: globalStatus, attachments: [] },
        tests,
      };

      console.log(`[squash] envoi de ${tests.length} resultat(s) vers ${url}`);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SQUASH_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      const corps = await res.text();
      console.log(`[squash] HTTP ${res.status}`);
      this.detaillerReponse(res.status, corps, tests);
    } catch (e) {
      console.error('[squash] ================= IMPORT ECHOUE =================');
      console.error(`[squash] ${(e as Error).stack ?? String(e)}`.slice(0, 800));
      console.error('[squash] ==================================================');
    }
  }

  /**
   * Lit le plan de test de l'iteration, puis le nombre de pas de chaque cas.
   * Squash exige AUTANT d'entrees `test_steps` que le cas en compte : un tableau vide
   * renvoie « Expected 2 but got 0 ». On le decouvre au lieu de le coder en dur
   * (aujourd'hui CT-06 = 2 pas, CT-08 = 3 pas).
   */
  private async chargerPlanDeTest(): Promise<void> {
    const entetes = { Authorization: `Bearer ${process.env.SQUASH_TOKEN}` };
    const plan = await this.lireJson(
      `${this.base}/api/rest/latest/iterations/${this.iteration}/test-plan?size=200`, entetes,
    ) as { _embedded?: { 'test-plan'?: Array<{ referenced_test_case?: { id: number; reference: string } }> } };

    for (const item of plan._embedded?.['test-plan'] ?? []) {
      const cas = item.referenced_test_case;
      if (!cas?.reference) continue;
      this.idDuCas.set(cas.reference, cas.id);
      const pas = await this.lireJson(
        `${this.base}/api/rest/latest/test-cases/${cas.id}/steps?size=200`, entetes,
      ) as { _embedded?: { steps?: unknown[] } };
      this.nbPas.set(cas.reference, (pas._embedded?.steps ?? []).length);
    }
  }

  private async lireJson(url: string, headers: Record<string, string>): Promise<Record<string, unknown>> {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GET ${url} -> HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
    return await res.json() as Record<string, unknown>;
  }

  /**
   * Autant de pas que le cas en compte. Le premier porte le verdict du test ; les
   * suivants sont SUCCESS si le test passe, READY sinon (« pas encore joue »).
   * Squash veut le bon COMPTE, pas une semantique fine : Playwright ne sait pas a quel
   * pas de Squash son echec correspond.
   */
  private pasDuCas(reference: string, status: SquashStatus): SquashStep[] {
    const total = this.nbPas.get(reference);
    if (total === undefined) {
      console.warn(`[squash] nombre de pas inconnu pour ${reference} (cas absent de l'iteration ?) - 1 pas envoye.`);
      return [{ status: status === 'SUCCESS' ? 'SUCCESS' : 'FAILURE' }];
    }
    const reussi = status === 'SUCCESS';
    return Array.from({ length: total }, (_, i): SquashStep => ({
      status: i === 0 ? (reussi ? 'SUCCESS' : 'FAILURE') : (reussi ? 'SUCCESS' : 'READY'),
    }));
  }

  /**
   * Le detail de l'echec, en piece jointe sur l'execution — c'est la ou Squash Community
   * sait l'afficher. Extensions admises a l'import : txt, html, xml, log ; taille max
   * 2 Mo (`uploadfilter.upload.import.sizeLimitInBytes`), d'ou la troncature.
   */
  private pieceJointeEchec(r: ResultatLocal): SquashAttachment[] {
    if (!r.message) return [];
    const texte = [
      `${r.reference} ${r.status} (${duree(r.duration)})`,
      `Playwright - build ${process.env.BUILD_NUMBER ?? 'local'} - ${this.startedAt.toISOString()}`,
      '',
      r.message.trim(),
      '',
    ].join('\n').slice(0, 200_000);
    return [{ name: `${r.reference}-echec.txt`, content: Buffer.from(texte, 'utf8').toString('base64') }];
  }

  /**
   * Affiche le verdict test par test. Dans la reponse de Squash, SEULS LES TESTS EN
   * ERREUR figurent : ceux qui n'y sont pas ont ete importes. C'est ce contraste qu'on
   * montre a l'ecran en B6 (204 = tout est passe, 207 = multi-statut).
   */
  private detaillerReponse(code: number, corps: string, tests: SquashTest[]): void {
    if (code === 401 || code === 403) {
      console.error(`[squash] jeton refuse (HTTP ${code}) - verifier SQUASH_TOKEN. ${corps.slice(0, 800)}`);
      return;
    }
    if (code !== 200 && code !== 204 && code !== 207) {
      console.error(`[squash] reponse inattendue : ${corps.slice(0, 800)}`);
      return;
    }
    let erreurs = new Map<string, string>();
    if (corps.trim()) {
      try {
        const json = JSON.parse(corps) as ReponseImport;
        erreurs = new Map((json.tests ?? []).map((t) => [t.reference, t.error]));
      } catch {
        console.error(`[squash] reponse illisible : ${corps.slice(0, 800)}`);
        return;
      }
    }
    for (const t of tests) {
      const erreur = erreurs.get(t.reference);
      if (erreur) {
        console.error(`  ${t.reference} -> ${erreur}`);
      } else {
        const id = this.idDuCas.get(t.reference);
        console.log(`  ${t.reference} -> importe${id !== undefined ? ` (test_case_id ${id})` : ''}`);
      }
    }
  }
}

export default SquashReporter;

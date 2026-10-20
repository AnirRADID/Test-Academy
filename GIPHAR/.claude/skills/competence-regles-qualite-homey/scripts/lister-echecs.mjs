#!/usr/bin/env node
/**
 * lister-echecs.mjs — base factuelle du triage : les cas en echec d'une iteration Squash.
 *
 *   node .claude/skills/competence-regles-qualite-homey/scripts/lister-echecs.mjs <iteration_id>
 *
 * Pour chaque cas FAILURE : sa reference, l'exigence qu'il couvre (reference Jira miroir),
 * et l'id de sa DERNIERE execution (une nouvelle execution est creee a chaque run : c'est
 * toujours cet id-la qu'il faut utiliser pour poser un commentaire ou une piece jointe).
 *
 * Meme convention de jeton que squash.mjs : SQUASH_TOKEN, sinon squash/.token.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const BASE = (process.env.SQUASH_URL || 'http://127.0.0.1:8090/squash').replace(/\/+$/, '');
const API = `${BASE}/api/rest/latest`;

function jeton() {
  if (process.env.SQUASH_TOKEN) return process.env.SQUASH_TOKEN.trim();
  const f = join(RACINE, 'squash', '.token');
  if (existsSync(f)) return readFileSync(f, 'utf8').trim();
  throw new Error("Aucun jeton. Definis SQUASH_TOKEN ou colle-le dans squash/.token.");
}

async function appel(chemin) {
  const r = await fetch(`${API}/${chemin}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${jeton()}` },
  });
  if (!r.ok) throw new Error(`GET ${chemin} -> HTTP ${r.status}\n  ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

const [iterationId] = process.argv.slice(2);
if (!iterationId) {
  console.log('Usage : lister-echecs.mjs <iteration_id>');
  process.exit(1);
}

(async () => {
  const plan = (await appel(`iterations/${iterationId}/test-plan?size=200`))._embedded?.['test-plan'] || [];
  const echecs = plan.filter((item) => item.execution_status === 'FAILURE');

  if (echecs.length === 0) {
    console.log(`Aucun echec dans l'iteration ${iterationId}.`);
    return;
  }

  console.log(`${echecs.length} echec(s) dans l'iteration ${iterationId} :\n`);
  for (const item of echecs) {
    const cas = item.referenced_test_case;
    const detail = await appel(`test-cases/${cas.id}`);
    const exigences = (detail.verified_requirements || [])
      .map((v) => v.name || `#${v.id}`)
      .join(', ') || '(aucune)';
    const derniereExec = item.executions[item.executions.length - 1];
    console.log(`${cas.reference}`);
    console.log(`  cas de test id        : ${cas.id}`);
    console.log(`  exigence(s) couverte(s): ${exigences}`);
    console.log(`  derniere execution id  : ${derniereExec?.id ?? '(aucune)'}`);
    console.log(`  executee le            : ${derniereExec?.last_executed_on ?? '?'}`);
    console.log('');
  }
})().catch((e) => {
  console.error('ECHEC —', e.message);
  process.exit(1);
});

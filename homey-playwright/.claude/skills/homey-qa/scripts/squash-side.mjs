#!/usr/bin/env node
/**
 * squash-side.mjs — pose la moitie Squash de la tracabilite bidirectionnelle d'un bug.
 *
 *   node .claude/skills/homey-qa/scripts/squash-side.mjs <execution_id> <JIRA-KEY> <capture.png> "<explication>"
 *
 * Fait deux choses sur l'execution Squash en echec :
 *   1. Genere un PDF (capture d'ecran + explication + reference Jira) et l'attache a
 *      l'execution. PDF et pas PNG : les pieces jointes d'execution n'acceptent que
 *      .txt/.pdf sur cette instance (voir reference/conventions.md).
 *   2. Pose un commentaire HTML reellement cliquable (<a href>) sur l'execution ET sur
 *      le pas identifie comme l'origine de l'echec.
 *
 * Ne touche jamais a Jira : la moitie Jira (recherche de doublon, creation/commentaire du
 * bug) reste pilotee par Claude via le connecteur Atlassian MCP, voir SKILL.md.
 *
 * Meme convention de jeton que squash.mjs : SQUASH_TOKEN, sinon squash/.token.
 * JIRA_BASE_URL (optionnel) : par defaut https://testacademy.atlassian.net
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const BASE = (process.env.SQUASH_URL || 'http://127.0.0.1:8090/squash').replace(/\/+$/, '');
const API = `${BASE}/api/rest/latest`;
const JIRA_BASE = (process.env.JIRA_BASE_URL || 'https://testacademy.atlassian.net').replace(/\/+$/, '');

function jeton() {
  if (process.env.SQUASH_TOKEN) return process.env.SQUASH_TOKEN.trim();
  const f = join(RACINE, 'squash', '.token');
  if (existsSync(f)) return readFileSync(f, 'utf8').trim();
  throw new Error("Aucun jeton. Definis SQUASH_TOKEN ou colle-le dans squash/.token.");
}

async function appelJson(methode, chemin, corps) {
  const r = await fetch(`${API}/${chemin}`, {
    method: methode,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${jeton()}` },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
  const texte = await r.text();
  if (!r.ok) throw new Error(`${methode} ${chemin} -> HTTP ${r.status}\n  ${texte.slice(0, 300)}`);
  return texte ? JSON.parse(texte) : null;
}

async function appelFichier(chemin, blob, nomFichier) {
  const form = new FormData();
  form.append('files', blob, nomFichier);
  const r = await fetch(`${API}/${chemin}`, { method: 'POST', headers: { Authorization: `Bearer ${jeton()}` }, body: form });
  if (!r.ok) throw new Error(`POST ${chemin} (fichier) -> HTTP ${r.status}\n  ${(await r.text()).slice(0, 300)}`);
}

const [executionId, jiraKey, captureChemin, explication] = process.argv.slice(2);
if (!executionId || !jiraKey || !captureChemin) {
  console.log('Usage : squash-side.mjs <execution_id> <JIRA-KEY> <capture.png> "<explication>"');
  process.exit(1);
}
if (!existsSync(captureChemin)) {
  console.error(`ECHEC — capture introuvable : ${captureChemin}`);
  process.exit(1);
}

const jiraUrl = `${JIRA_BASE}/browse/${jiraKey}`;
const lienHtml = `<p>Anomalie associee : <a href="${jiraUrl}" target="_blank" rel="noopener">${jiraKey}</a> (Bug Jira)</p>`;

(async () => {
  const exec = await appelJson('GET', `executions/${executionId}`);
  console.log(`execution #${executionId} (${exec.reference}) — ${exec.execution_status}`);

  // --- 1. rapport PDF (capture + explication) ---------------------------------------
  const b64 = readFileSync(captureChemin).toString('base64');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #1a1a1a; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .meta { color: #555; font-size: 12px; margin-bottom: 16px; }
    .box { border: 1px solid #ccc; padding: 12px; margin-bottom: 16px; border-radius: 4px; }
    img { max-width: 100%; border: 1px solid #999; margin-top: 8px; }
  </style></head><body>
    <h1>${exec.reference} — rapport d'anomalie</h1>
    <div class="meta">Execution Squash #${executionId} — ${new Date().toISOString()}</div>
    <div class="box">
      <p><b>Explication :</b> ${explication || '(voir le ticket Jira)'}</p>
      <p><b>Ticket Jira associe :</b> ${jiraKey} — ${jiraUrl}</p>
    </div>
    <p><b>Capture d'ecran au moment de l'echec :</b></p>
    <img src="data:image/png;base64,${b64}" />
  </body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  await appelFichier(`executions/${executionId}/attachments`, new Blob([pdfBuffer], { type: 'application/pdf' }), `${exec.reference}-rapport-anomalie.pdf`);
  console.log('  PDF joint a l\'execution.');

  // --- 2. commentaire HTML cliquable, execution + pas en echec ------------------------
  await appelJson('PATCH', `executions/${executionId}`, { _type: 'execution', comment: lienHtml });
  console.log('  commentaire pose sur l\'execution.');

  const pasEnEchec = exec.execution_steps.find((s) => s.execution_status === 'FAILURE') || exec.execution_steps[0];
  if (pasEnEchec) {
    await appelJson('PATCH', `execution-steps/${pasEnEchec.id}`, { _type: 'execution-step', comment: lienHtml });
    console.log(`  commentaire pose sur le pas #${pasEnEchec.id} (${pasEnEchec.action.slice(0, 60)}...).`);
  }

  console.log(`\nVoir dans Squash : ${BASE}/execution/${executionId}/content?anchor=information`);
})().catch((e) => {
  console.error('ECHEC —', e.message);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * squash.mjs — parler a Squash TM depuis Claude Code, sous Windows comme ailleurs.
 *
 *   node .claude/skills/squash/squash.mjs verifier
 *   node .claude/skills/squash/squash.mjs reperes
 *   node .claude/skills/squash/squash.mjs creer-projet [chemin/contenu-homey.json]
 *   node .claude/skills/squash/squash.mjs tag CT-06
 *   node .claude/skills/squash/squash.mjs detag CT-06
 *
 * Le jeton n'est JAMAIS passe en argument (il resterait visible dans la liste des
 * processus). Il est lu, dans cet ordre :
 *   1. la variable d'environnement SQUASH_TOKEN
 *   2. le fichier squash/.token, a la racine du projet (ignore par git)
 * A defaut de jeton, SQUASH_USER / SQUASH_PASSWORD servent de repli.
 *
 * Adresse de Squash : variable SQUASH_URL, sinon http://127.0.0.1:8090/squash
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const BASE = (process.env.SQUASH_URL || 'http://127.0.0.1:8090/squash').replace(/\/+$/, '');
const API = `${BASE}/api/rest/latest`;

function jeton() {
  if (process.env.SQUASH_TOKEN) return process.env.SQUASH_TOKEN.trim();
  const f = join(RACINE, 'squash', '.token');
  if (existsSync(f)) return readFileSync(f, 'utf8').trim();
  return null;
}
function entetes() {
  const t = jeton();
  if (t) return { Authorization: `Bearer ${t}` };
  const u = process.env.SQUASH_USER, p = process.env.SQUASH_PASSWORD;
  if (u && p) return { Authorization: 'Basic ' + Buffer.from(`${u}:${p}`).toString('base64') };
  throw new Error(
    "Aucun jeton. Cree-en un dans Squash (Mon compte > Jetons personnels d'API,\n" +
    "  permissions « Lecture et ecriture »), puis colle-le dans squash/.token.");
}

async function appel(methode, chemin, corps) {
  const r = await fetch(`${API}/${chemin}`, {
    method: methode,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...entetes() },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
  const texte = await r.text();
  let donnees = null;
  try { donnees = texte ? JSON.parse(texte) : null; } catch { /* reponse non JSON */ }
  if (!r.ok) {
    const erreurs = donnees?.fieldValidationErrors;
    const detail = erreurs ? erreurs.map(e => `${e.fieldName} : ${e.errorMessage}`).join(' ; ')
                           : (donnees?.message || texte.slice(0, 300));
    throw new Error(`${methode} ${chemin} -> HTTP ${r.status}\n  ${detail}`);
  }
  return donnees;
}
// PIEGE : la cle de la liste change selon l'endroit. Le contenu d'un DOSSIER arrive sous
// la cle "content", celui d'une RACINE de bibliotheque sous "test-case-library-content",
// "requirement-library-content", etc. On prend donc la seule liste presente.
const contenuDe = async (chemin) => {
  const e = (await appel('GET', chemin))?._embedded || {};
  return e.content || Object.values(e).find(Array.isArray) || [];
};

/* ------------------------------------------------------------------ reperes */
async function projetHomey() {
  const l = (await appel('GET', 'projects?size=200'))?._embedded?.projects || [];
  return l.find(p => p.name === 'Homey-Demo') || l[0] || null;
}
async function parcourir(typeDossier, id, sortie = []) {
  for (const n of await contenuDe(`${typeDossier}/${id}/content?size=200`)) {
    if (n._type.endsWith('-folder')) await parcourir(`${n._type}s`, n.id, sortie);
    else sortie.push(n);
  }
  return sortie;
}
async function tousLesCas(projet) {
  const sortie = [];
  for (const n of await contenuDe(`projects/${projet.id}/test-cases-library/content?size=200`)) {
    if (n._type.endsWith('-folder')) await parcourir(`${n._type}s`, n.id, sortie);
    else sortie.push(n);
  }
  // la liste du dossier ne porte pas la reference : on relit chaque cas
  return Promise.all(sortie.map(n => appel('GET', `test-cases/${n.id}`)));
}
async function casParReference(projet, ref) {
  const trouve = (await tousLesCas(projet)).find(c => c.reference === ref);
  if (!trouve) throw new Error(`Aucun cas de test de reference ${ref} dans ${projet.name}.`);
  return trouve;
}

/* ---------------------------------------------------------------- commandes */
const commandes = {
  async verifier() {
    const p = await appel('GET', 'projects?size=1');
    console.log(`OK — ${BASE} repond, le jeton est accepte.`);
    console.log(`   projets visibles : ${p?.page?.totalElements ?? '?'}`);
  },

  async reperes() {
    const projet = await projetHomey();
    if (!projet) return console.log('Aucun projet. Lance d abord : creer-projet');
    console.log(`Projet   ${projet.name}  (id ${projet.id})`);
    for (const c of await contenuDe(`projects/${projet.id}/campaigns-library/content?size=200`)) {
      if (c._type !== 'campaign') continue;
      const its = await contenuDe(`campaigns/${c.id}/iterations?size=200`);
      console.log(`Campagne ${c.name}  (id ${c.id})`);
      for (const it of its) console.log(`  Iteration ${it.name}  ->  SQUASH_ITERATION_ID = ${it.id}`);
    }
    console.log('Cas de test :');
    for (const c of (await tousLesCas(projet)).sort((a, b) => (a.reference || '').localeCompare(b.reference || '')))
      console.log(`  ${(c.reference || '?').padEnd(6)} id ${String(c.id).padEnd(4)}` +
                  ` automatise : ${c.automated_test_reference || '—'}`);
  },

  async 'creer-projet'(fichier) {
    const chemin = fichier || join(RACINE, 'squash', 'contenu-homey.json');
    const d = JSON.parse(readFileSync(chemin, 'utf8'));

    const projet = await appel('POST', 'projects',
      { _type: 'project', name: d.projet.name, label: d.projet.label, description: 'Fil rouge Homey' });
    console.log(`projet ${projet.name} cree (id ${projet.id})`);

    // --- exigences ---------------------------------------------------------
    // PIEGE : `current_version` DOIT figurer AVANT `name` dans le JSON. Sinon Squash
    // repond « Invalid JSON » sans rien expliquer. Et le parent est le PROJET, jamais
    // la bibliotheque. (Les deux verifies sur une instance neuve, 17/09/2026.)
    const versionParNom = new Map();
    for (const e of d.exigences) {
      const r = await appel('POST', 'requirements', {
        _type: 'requirement',
        current_version: {
          _type: 'requirement-version', reference: e.reference, description: e.description,
          criticality: e.criticality || 'MAJOR', status: e.status || 'APPROVED',
        },
        name: e.name,
        parent: { _type: 'project', id: projet.id },
      });
      versionParNom.set(e.name, r.current_version.id);
      console.log(`  exigence ${e.reference} — ${e.name}`);
    }

    // --- cas de test, avec leurs pas ET leur couverture ---------------------
    // PIEGE : la couverture ne se pose QU'A LA CREATION du cas. Un PATCH la refuse et
    // renvoie vers /test-cases/{id}/coverages, qui n'existe pas dans cette version.
    for (const c of d.cas_de_test) {
      const couvre = (c.verifie || []).map(nom => versionParNom.get(nom))
                                      .filter(Boolean)
                                      .map(id => ({ _type: 'requirement-version', id }));
      const tc = await appel('POST', 'test-cases', {
        _type: 'test-case',
        verified_requirements: couvre,
        name: c.name, reference: c.reference,
        description: c.description, prerequisite: c.prerequisite,
        importance: c.importance || 'MEDIUM',
        parent: { _type: 'project', id: projet.id },
        steps: (c.steps || []).map(s => ({
          _type: 'action-step', action: s.action, expected_result: s.expected_result })),
      });
      console.log(`  cas ${c.reference} — ${(c.steps || []).length} pas, couvre ${couvre.length} exigence(s)`);
      if (couvre.length !== (c.verifie || []).length)
        console.log(`    /!\\ couverture incomplete pour ${c.reference}`);
      c._id = tc.id;
    }

    // --- campagne, iteration, plan d'execution ------------------------------
    const camp = await appel('POST', 'campaigns',
      { _type: 'campaign', name: d.campagne.name, parent: { _type: 'project', id: projet.id } });
    const iter = await appel('POST', `campaigns/${camp.id}/iterations`,
      { _type: 'iteration', name: d.campagne.iteration });
    for (const c of d.cas_de_test)
      await appel('POST', `iterations/${iter.id}/test-plan`,
        { _type: 'iteration-test-plan-item', test_case: { _type: 'test-case', id: c._id } });

    console.log(`campagne ${camp.name} (id ${camp.id})`);
    console.log(`iteration ${iter.name} — ${d.cas_de_test.length} cas au plan d execution`);
    console.log('');
    console.log(`A RETENIR pour Jenkins :  SQUASH_ITERATION_ID = ${iter.id}`);
  },

  async tag(ref) {
    if (!ref) throw new Error('Usage : tag CT-06');
    const projet = await projetHomey();
    const c = await casParReference(projet, ref);
    // Le discriminant _type est obligatoire sur un PATCH.
    await appel('PATCH', `test-cases/${c.id}`, { _type: 'test-case', automated_test_reference: ref });
    console.log(`${ref} (id ${c.id}) est declare automatise sous la reference ${ref}.`);
  },

  async detag(ref) {
    if (!ref) throw new Error('Usage : detag CT-06');
    const projet = await projetHomey();
    const c = await casParReference(projet, ref);
    // A SAVOIR : un PATCH a null est ignore par Squash, et "" ecrit une chaine vide.
    // Il n'existe pas de moyen propre de revenir a un vrai NULL par l'API.
    await appel('PATCH', `test-cases/${c.id}`, { _type: 'test-case', automated_test_reference: '' });
    console.log(`${ref} (id ${c.id}) n est plus declare automatise.`);
  },
};

const [cmd, ...args] = process.argv.slice(2);
if (!cmd || !commandes[cmd]) {
  console.log('Commandes : ' + Object.keys(commandes).join(', '));
  process.exit(cmd ? 1 : 0);
}
commandes[cmd](...args).catch(e => { console.error('ECHEC — ' + e.message); process.exit(1); });

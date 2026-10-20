#!/usr/bin/env node
/**
 * squash.mjs — parler a Squash TM depuis Claude Code, sous Windows comme ailleurs.
 *
 *   node .claude/skills/competence-piloter-squash/squash.mjs verifier
 *   node .claude/skills/competence-piloter-squash/squash.mjs reperes
 *   node .claude/skills/competence-piloter-squash/squash.mjs creer-projet [chemin/contenu-homey.json]
 *   node .claude/skills/competence-piloter-squash/squash.mjs tag CT-06
 *   node .claude/skills/competence-piloter-squash/squash.mjs detag CT-06
 *
 * Commandes du cycle par story (utilisees par les agents, voir .claude/agents/) :
 *   ajouter-story <fichier.json>          exigence miroir (si absente) + cas de test « A approuver »
 *   modifier-cas <fichier.json>           reecrit nom, description, prerequis et pas d'un cas
 *   lire-cas <reference> [--json]         le cas et ses pas, en clair (ou en JSON)
 *   statut <reference> <EN_COURS|A_APPROUVER|APPROUVE>
 *   ajouter-au-plan <reference> <iteration_id>
 *   resultats <iteration_id> [--json]     statut de chaque cas du plan + derniere execution
 *   bilan-iteration <iteration_id> <fichier.html>   ajoute un bilan date en tete de la description
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
async function toutesLesExigences(projet) {
  const sortie = [];
  for (const n of await contenuDe(`projects/${projet.id}/requirements-library/content?size=200`)) {
    if (n._type.endsWith('-folder')) await parcourir(`${n._type}s`, n.id, sortie);
    else sortie.push(n);
  }
  // comme pour les cas : la reference n'est portee que par la version courante
  return Promise.all(sortie.map(n => appel('GET', `requirements/${n.id}`)));
}

// Statuts d'un cas de test : le nom affiche dans Squash -> la valeur attendue par l'API.
const STATUTS = { EN_COURS: 'WORK_IN_PROGRESS', A_APPROUVER: 'UNDER_REVIEW', APPROUVE: 'APPROVED' };

const lireJson = (fichier) => JSON.parse(readFileSync(resolve(fichier), 'utf8'));
const pasSquash = (pas) => (pas || []).map(s => ({
  _type: 'action-step', action: s.action, expected_result: s.resultat_attendu }));

async function planDeLIteration(iterationId) {
  return (await appel('GET', `iterations/${iterationId}/test-plan?size=200`))?._embedded?.['test-plan'] || [];
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

  /* ------------------------------------------------- cycle par story (agents) */

  // Fichier attendu (cf. competence-piloter-squash/SKILL.md, « Le cycle par story ») :
  // { story_jira, exigence: { nom, description, criticite }, cas: { reference, nom,
  //   description, prerequis, importance, pas: [{ action, resultat_attendu }] }, iteration_id? }
  async 'ajouter-story'(fichier) {
    if (!fichier) throw new Error('Usage : ajouter-story <fichier.json>');
    const d = lireJson(fichier);
    const projet = await projetHomey();

    if ((await tousLesCas(projet)).some(c => c.reference === d.cas.reference))
      throw new Error(`Le cas ${d.cas.reference} existe deja. Utiliser modifier-cas.`);

    // L'exigence miroir n'est creee que si la story n'a pas encore la sienne.
    let exigence = (await toutesLesExigences(projet))
      .find(e => e.current_version?.reference === d.story_jira);
    if (exigence) {
      console.log(`exigence ${d.story_jira} deja presente (id ${exigence.id}), reutilisee`);
    } else {
      // PIEGE : current_version AVANT name, et le parent est le PROJET.
      exigence = await appel('POST', 'requirements', {
        _type: 'requirement',
        current_version: {
          _type: 'requirement-version', reference: d.story_jira, description: d.exigence.description,
          criticality: d.exigence.criticite || 'MAJOR', status: 'APPROVED',
        },
        name: d.exigence.nom,
        parent: { _type: 'project', id: projet.id },
      });
      console.log(`exigence ${d.story_jira} creee (id ${exigence.id})`);
    }

    // PIEGE : la couverture ne se pose QU'A LA CREATION du cas.
    const tc = await appel('POST', 'test-cases', {
      _type: 'test-case',
      verified_requirements: [{ _type: 'requirement-version', id: exigence.current_version.id }],
      name: d.cas.nom, reference: d.cas.reference,
      description: d.cas.description, prerequisite: d.cas.prerequis,
      importance: d.cas.importance || 'MEDIUM',
      status: STATUTS.A_APPROUVER,
      parent: { _type: 'project', id: projet.id },
      steps: pasSquash(d.cas.pas),
    });
    console.log(`cas ${d.cas.reference} cree (id ${tc.id}), ${d.cas.pas.length} pas, statut « A approuver »`);

    if (d.iteration_id) await commandes['ajouter-au-plan'](d.cas.reference, d.iteration_id);
  },

  // Meme fichier que ajouter-story (seule la partie « cas » est lue). Les pas sont
  // entierement remplaces : la couverture, elle, ne bouge pas.
  async 'modifier-cas'(fichier) {
    if (!fichier) throw new Error('Usage : modifier-cas <fichier.json>');
    const { cas } = lireJson(fichier);
    const c = await casParReference(await projetHomey(), cas.reference);
    await appel('PATCH', `test-cases/${c.id}`, {
      _type: 'test-case', name: cas.nom, description: cas.description,
      prerequisite: cas.prerequis, status: STATUTS.A_APPROUVER,
    });
    const anciens = (await appel('GET', `test-cases/${c.id}/steps?size=200`))?._embedded?.steps || [];
    if (anciens.length) await appel('DELETE', `test-steps/${anciens.map(s => s.id).join(',')}`);
    for (const s of pasSquash(cas.pas)) await appel('POST', `test-cases/${c.id}/steps`, s);
    console.log(`cas ${cas.reference} reecrit : ${cas.pas.length} pas, statut « A approuver »`);
  },

  async 'lire-cas'(ref, format) {
    if (!ref) throw new Error('Usage : lire-cas TC-HVC-6 [--json]');
    const c = await casParReference(await projetHomey(), ref);
    const pas = (await appel('GET', `test-cases/${c.id}/steps?size=200`))?._embedded?.steps || [];
    if (format === '--json') return console.log(JSON.stringify({
      reference: c.reference, nom: c.name, statut: c.status, description: c.description || '',
      pas: pas.map(s => ({ action: s.action, attendu: s.expected_result })) }));
    console.log(`${c.reference} — ${c.name}   (id ${c.id}, statut ${c.status})`);
    console.log(`automatise sous : ${c.automated_test_reference || '—'}`);
    console.log(`exigence(s)     : ${(c.verified_requirements || []).map(v => v.name || `#${v.id}`).join(', ') || '—'}`);
    console.log(`\nDescription : ${c.description || '—'}\nPrerequis   : ${c.prerequisite || '—'}\n`);
    pas.forEach((s, i) => console.log(`Pas ${i + 1}\n  action   : ${s.action}\n  attendu  : ${s.expected_result}`));
  },

  async statut(ref, nom) {
    if (!ref || !STATUTS[nom]) throw new Error(`Usage : statut TC-HVC-6 <${Object.keys(STATUTS).join('|')}>`);
    const c = await casParReference(await projetHomey(), ref);
    await appel('PATCH', `test-cases/${c.id}`, { _type: 'test-case', status: STATUTS[nom] });
    console.log(`${ref} (id ${c.id}) passe au statut ${STATUTS[nom]}.`);
  },

  async 'ajouter-au-plan'(ref, iterationId) {
    if (!ref || !iterationId) throw new Error('Usage : ajouter-au-plan TC-HVC-6 <iteration_id>');
    if ((await planDeLIteration(iterationId)).some(i => i.referenced_test_case?.reference === ref))
      return console.log(`${ref} est deja au plan de l'iteration ${iterationId}.`);
    const c = await casParReference(await projetHomey(), ref);
    await appel('POST', `iterations/${iterationId}/test-plan`,
      { _type: 'iteration-test-plan-item', test_case: { _type: 'test-case', id: c.id } });
    console.log(`${ref} ajoute au plan de l'iteration ${iterationId}.`);
  },

  async resultats(iterationId, format) {
    if (!iterationId) throw new Error('Usage : resultats <iteration_id> [--json]');
    const plan = await planDeLIteration(iterationId);
    if (format === '--json') {
      const it = await appel('GET', `iterations/${iterationId}`);
      return console.log(JSON.stringify({ iteration: { id: Number(iterationId), nom: it.name },
        cas: plan.map(i => ({ reference: i.referenced_test_case?.reference || null, nom: i.referenced_test_case?.name || '',
          statut: i.execution_status, derniereExecution: i.executions?.at(-1)?.last_executed_on || null })) }));
    }
    const compte = {};
    for (const i of plan) compte[i.execution_status] = (compte[i.execution_status] || 0) + 1;
    console.log(`Iteration ${iterationId} — ${plan.length} cas : ` +
      Object.entries(compte).map(([s, n]) => `${n} ${s}`).join(', '));
    for (const i of plan) {
      const derniere = i.executions?.[i.executions.length - 1];
      console.log(`  ${(i.referenced_test_case?.reference || '?').padEnd(10)} ${String(i.execution_status).padEnd(8)}` +
        ` derniere execution ${derniere?.id ?? '—'} (${derniere?.last_executed_on ?? '—'})`);
    }
  },

  // La description de l'iteration, en texte : c'est la que s'empilent les bilans.
  async 'lire-bilans'(iterationId) {
    if (!iterationId) throw new Error('Usage : lire-bilans <iteration_id>');
    const it = await appel('GET', `iterations/${iterationId}`);
    const texte = (it.description || '')
      .replace(/<hr\s*\/?>/gi, '\n----------\n').replace(/<\/(p|h\d|li)>|<br\s*\/?>/gi, '\n')
      .replace(/<li>/gi, '- ').replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim();
    console.log(`Iteration ${it.name} (id ${iterationId}) — bilans, du plus recent au plus ancien :\n`);
    console.log(texte || '(aucun bilan pour l instant)');
  },

  // Le bilan le plus recent en tete ; les precedents restent dessous, comme un journal.
  async 'bilan-iteration'(iterationId, fichier) {
    if (!iterationId || !fichier) throw new Error('Usage : bilan-iteration <iteration_id> <fichier.html>');
    const it = await appel('GET', `iterations/${iterationId}`);
    const bilan = readFileSync(resolve(fichier), 'utf8').trim();
    await appel('PATCH', `iterations/${iterationId}`,
      { _type: 'iteration', description: `${bilan}\n<hr/>\n${it.description || ''}` });
    console.log(`Bilan ajoute en tete de la description de l'iteration ${it.name} (id ${iterationId}).`);
  },
};

const [cmd, ...args] = process.argv.slice(2);
if (!cmd || !commandes[cmd]) {
  console.log('Commandes : ' + Object.keys(commandes).join(', '));
  process.exit(cmd ? 1 : 0);
}
commandes[cmd](...args).catch(e => { console.error('ECHEC — ' + e.message); process.exit(1); });

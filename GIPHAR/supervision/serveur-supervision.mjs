#!/usr/bin/env node
/**
 * serveur-supervision.mjs — la Tour de controle des agents QA, sur http://localhost:5680
 *
 *   node supervision/serveur-supervision.mjs
 *
 * Demarre tout seul avec n8n/demarrer-n8n.cmd. N'ecoute que ce PC. Il LIT ce que n8n et
 * les agents ecrivent deja, plus les resultats Squash :
 *   - suivi-des-stories/journal-des-taches.md   (chaque action, toutes stories confondues)
 *   - suivi-des-stories/story-*.md              (la fiche de suivi de chaque story)
 *   - suivi-des-stories/.agent-en-cours.json    (le verrou : quel agent travaille en ce moment)
 *   - Squash : le plan de l'iteration et le resultat de chaque cas (relu toutes les minutes)
 * Il n'AGIT que sur votre demande, depuis la page :
 *   - lancer des stories (envoyees au flux n8n « 1. Lancer des stories ») ; chaque lancement
 *     est note dans suivi-des-stories/lancements.json, et le Kanban ne montre que le dernier ;
 *   - pause / reprise : suivi-des-stories/.pause.json, que chaque agent consulte avant de
 *     demarrer (n8n/outils/lancer-agent.mjs) ;
 *   - arret d'un lancement : suivi-des-stories/.arret.json (les stories a ne plus traiter) ;
 *   - votre decision sur un cas de test, transmise au formulaire de validation de n8n ;
 *   - l'analyse de Claude, gardee dans supervision/.analyse-claude.json.
 * Chacune de ces actions est ecrite dans le journal, au nom de « vous ».
 *
 * Adresses :
 *   /                 la page (tableau-de-bord.html)
 *   /etat             l'etat complet, en JSON (la page le relit toutes les 3 secondes)
 *   /fiche?cle=       le texte de la fiche de suivi d'une story
 *   /cas?cle=         le cas de test d'une story, lu dans Squash (pour la validation)
 *   /stories?portee=  les stories du sprint actif (sprint) ou du backlog, lues dans Jira par
 *                     le flux n8n « 4. Lister les stories »
 *   POST /lancer      { portee: "choix"|"sprint"|"backlog", cles: ["HVC-6", …] }
 *   POST /pause, POST /reprendre, POST /arreter
 *   POST /valider     { cle, decision: "Approuver"|"Refuser", remarques }
 *   POST /analyse     demande une nouvelle analyse a Claude (la reponse arrive dans /etat)
 *
 * Reglage : l'iteration Squash suivie est celle des Reglages du flux n8n « 1. Lancer des
 * stories » (n8n/flux/1-lancer-des-stories.json), ou SQUASH_ITERATION_ID si elle est definie.
 */
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ecrire } from '../n8n/outils/ecrire-au-journal.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, '..');
const SUIVI = process.env.SUIVI_DES_STORIES || join(RACINE, 'suivi-des-stories'); // autre dossier : pour les essais
const JOURNAL = process.env.JOURNAL_DES_TACHES || join(SUIVI, 'journal-des-taches.md');
const VERROU = process.env.VERROU_AGENT || join(SUIVI, '.agent-en-cours.json');
const ANALYSE = join(ICI, '.analyse-claude.json');
const PAUSE = join(SUIVI, '.pause.json');
const ARRET = join(SUIVI, '.arret.json');
const LANCEMENTS = join(SUIVI, 'lancements.json');
const N8N = process.env.N8N_URL || 'http://127.0.0.1:5678';
const SQUASH_MJS = join(RACINE, '.claude', 'skills', 'competence-piloter-squash', 'squash.mjs');
const PORT = Number(process.env.SUPERVISION_PORT || 5680);
const JIRA = 'https://testacademy.atlassian.net';

/* --------------------------------------------------------------- l'equipe */
// Les colonnes du Kanban, dans l'ordre : une par agent, plus « À faire », « À valider »
// (vous) et « Terminé ». Ce sont aussi les colonnes du tableau Jira. Une story bloquee
// reste dans la colonne de son agent, marquee « bloquée ».
export const COLONNES = [
  { id: 'a-faire', titre: 'À faire', agent: null },
  { id: 'analyste', titre: 'Analyste', agent: 'agent-analyste' },
  { id: 'a-valider', titre: 'À valider', agent: null },
  { id: 'automaticien', titre: 'Automaticien', agent: 'agent-automaticien' },
  { id: 'executant', titre: 'Exécutant', agent: 'agent-executant' },
  { id: 'anomalies', titre: "Gestionnaire d'anomalies", agent: 'agent-gestionnaire-anomalies' },
  { id: 'rapporteur', titre: 'Rapporteur', agent: 'agent-rapporteur' },
  { id: 'termine', titre: 'Terminé', agent: null },
];
const AGENTS = [
  { nom: 'agent-analyste', titre: 'Analyste', metier: 'rédige le cas de test dans Squash' },
  { nom: 'agent-automaticien', titre: 'Automaticien', metier: 'écrit et vérifie le test Playwright' },
  { nom: 'agent-executant', titre: 'Exécutant', metier: 'joue la campagne de tests' },
  { nom: 'agent-gestionnaire-anomalies', titre: "Gestionnaire d'anomalies", metier: 'trie les échecs, déclare les bugs' },
  { nom: 'agent-rapporteur', titre: 'Rapporteur', metier: 'publie les comptes rendus' },
];
// Apres le travail d'un agent, la story passe a la colonne suivante.
const APRES = {
  'agent-analyste': 'a-valider', 'agent-automaticien': 'executant', 'agent-executant': 'anomalies',
  'agent-gestionnaire-anomalies': 'rapporteur', 'agent-rapporteur': 'rapporteur',
};
const colonneDeLAgent = Object.fromEntries(COLONNES.filter(c => c.agent).map(c => [c.agent, c.id]));

/* --------------------------------------------------------------- lectures */
const lire = (f) => { try { return readFileSync(f, 'utf8'); } catch { return ''; } };

// - **12:32** · Connexion utilisateur (HVC-7) · **agent-automaticien** · lance le test …
function lireJournal() {
  const evenements = [];
  let jour = null;
  for (const ligne of lire(JOURNAL).split(/\r?\n/)) {
    const j = ligne.match(/^## \S+ (\d{2})\/(\d{2})\/(\d{4})/);
    if (j) { jour = { j: j[1], m: j[2], a: j[3] }; continue; }
    const e = ligne.match(/^- \*\*(\d{2}):(\d{2})\*\* · (.*?) · \*\*(.+?)\*\* · (.*)$/);
    if (!e || !jour) continue;
    const cle = e[3].match(/\(([A-Z][A-Z0-9]+-\d+)\)\s*$/)?.[1] || null;
    evenements.push({
      n: evenements.length,
      date: `${jour.j}/${jour.m}/${jour.a}`, heure: `${e[1]}:${e[2]}`,
      instant: `${jour.a}-${jour.m}-${jour.j}T${e[1]}:${e[2]}`,
      story: e[3] === '—' ? null : e[3], cle, qui: e[4], quoi: e[5],
    });
  }
  return evenements;
}

// Section 5 de la fiche : les bugs Jira cites, « nouveau » ou « deja connu ».
function bugsDeLaFiche(texte, cleStory) {
  const section = texte.split(/^## 5\./m)[1]?.split(/^## 6\./m)[0] || '';
  const bugs = [];
  for (const m of section.matchAll(/\[([A-Z][A-Z0-9]+-\d+)(?:\s*[—-]\s*([^\]]+))?\]\(https?:[^)]*\/browse\/\1\)/g)) {
    if (m[1] === cleStory) continue;
    const avant = section.slice(Math.max(0, m.index - 250), m.index).toLowerCase();
    bugs.push({ cle: m[1], titre: m[2]?.trim() || '', nouveau: !/déjà connu|deja connu/.test(avant), lien: `${JIRA}/browse/${m[1]}` });
  }
  return bugs;
}

function lireFiches() {
  const fiches = {};
  if (!existsSync(SUIVI)) return fiches;
  for (const f of readdirSync(SUIVI).filter(n => /^story-.*\.md$/.test(n))) {
    const texte = lire(join(SUIVI, f));
    const cle = texte.match(/\/browse\/([A-Z][A-Z0-9]+-\d+)/)?.[1];
    if (!cle) continue;
    const ligne = (nom) => texte.match(new RegExp(`\\|\\s*\\*\\*${nom}\\*\\*\\s*\\|\\s*(.*?)\\s*\\|\\s*$`, 'm'))?.[1] || '';
    const prochaine = ligne('Prochaine action');
    fiches[cle] = {
      fichier: f, cle,
      titre: texte.match(/^# Story : (.+)$/m)?.[1]?.trim() || cle,
      ouEnEst: ligne('Où en est-on'),
      prochaineAction: prochaine.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
      lienValidation: (prochaine + texte).match(/(https?:\/\/[^)\s]*form-waiting[^)\s]*)/)?.[1] || null,
      bugs: bugsDeLaFiche(texte, cle),
    };
  }
  return fiches;
}

function lireVerrou() {
  try {
    const v = JSON.parse(lire(VERROU));
    process.kill(v.pid, 0); // le verrou d'un agent arrete brutalement ne compte pas
    return v;
  } catch (e) {
    return e?.code === 'EPERM' ? JSON.parse(lire(VERROU)) : null;
  }
}

/* ------------------------------------------------------ Squash (toutes les minutes) */
function iterationSuivie() {
  if (process.env.SQUASH_ITERATION_ID) return process.env.SQUASH_ITERATION_ID;
  try {
    const flux = JSON.parse(lire(join(RACINE, 'n8n', 'flux', '1-lancer-des-stories.json')));
    const reglages = flux.nodes.find(n => n.name === 'Réglages');
    return reglages.parameters.assignments.assignments.find(a => a.name === 'iterationSquash').value;
  } catch { return '1'; }
}

function squash(...args) {
  return new Promise((ok, ko) => {
    const p = spawn(process.execPath, [SQUASH_MJS, ...args], { cwd: RACINE });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('close', code => {
      if (code !== 0) return ko(new Error(err.replace(/^ECHEC — /, '').trim() || `code ${code}`));
      try { ok(JSON.parse(out)); } catch { ko(new Error('Réponse Squash illisible')); }
    });
  });
}

const resultatsSquash = { valeur: null, erreur: null, quand: 0, enCours: false };
async function rafraichirSquash(force = false) {
  if (resultatsSquash.enCours || (!force && Date.now() - resultatsSquash.quand < 60000)) return;
  resultatsSquash.enCours = true;
  try {
    resultatsSquash.valeur = await squash('resultats', iterationSuivie(), '--json');
    resultatsSquash.erreur = null;
  } catch (e) {
    resultatsSquash.erreur = e.message;
  } finally {
    resultatsSquash.quand = Date.now();
    resultatsSquash.enCours = false;
  }
}

/* ------------------------------------------- l'etat, deduit du journal */
// Que change cet evenement pour sa story ? { colonne, bloque, arretee } (chacun facultatif)
export function colonneApres(ev) {
  const q = ev.quoi;
  if (ev.qui === 'n8n') {
    if (/demandée depuis Claude/.test(q)) return { colonne: 'a-faire', bloque: false, arretee: false };
    if (/cycle démarré/.test(q)) return { colonne: 'analyste', bloque: false, arretee: false };
    if (/attend votre validation/.test(q)) return { colonne: 'a-valider' };
    if (/REFUSÉ/.test(q)) return { colonne: 'analyste' };
    if (/APPROUVÉ|passé à « Approuvé »/.test(q)) return { colonne: 'automaticien' };
    if (/cycle terminé/.test(q)) return { colonne: 'termine', bloque: false };
    if (/cycle arrêté/.test(q)) return { arretee: true };
    if (/cycle interrompu/.test(q)) return { bloque: true };
    return {};
  }
  if (!colonneDeLAgent[ev.qui]) return {};
  if (/^⏹ arrêté/.test(q)) return { arretee: true };
  if (/^⏸|^▶ reprise/.test(q)) return {};
  if (/^✅ terminé/.test(q)) return { colonne: APRES[ev.qui], bloque: false };
  if (/^🛑 bloqué/.test(q)) return { colonne: colonneDeLAgent[ev.qui], bloque: true };
  if (/^démarre$/.test(q)) return { colonne: colonneDeLAgent[ev.qui], bloque: false };
  return { colonne: colonneDeLAgent[ev.qui] };
}

const titreDe = (nom) => (AGENTS.find(a => a.nom === nom)?.titre || nom.replace('agent-', '')).toLowerCase();
const raisonDuBlocage = (q) => q.replace(/^🛑 bloqué(?: après [^:]*)?\s*:\s*/, '').trim() || q;

const RESULTAT = { SUCCESS: 'reussi', SETTLED: 'reussi', FAILURE: 'echoue', BLOCKED: 'echoue' };

// Les regles fixes du niveau de qualite (pourcentage de tests reussis parmi les tests joues).
export const NIVEAUX = [
  { min: 95, nom: 'Excellent', ton: 'good', reco: 'La qualité permet de livrer ce sprint.' },
  { min: 70, nom: 'Bon', ton: 'info', reco: "Livrable, après avoir revu les bugs signalés avec l'équipe de développement." },
  { min: 50, nom: 'Fragile', ton: 'warn', reco: 'Corriger les échecs avant toute livraison, puis relancer la campagne.' },
  { min: 0, nom: 'Insuffisant', ton: 'crit', reco: 'Ne pas livrer : trop de fonctionnalités ne marchent pas comme prévu.' },
];

/* ------------------------------------------- les lancements */
const lireLancements = () => { try { return JSON.parse(lire(LANCEMENTS)) || []; } catch { return []; } };
const ecrireLancements = (l) => writeFileSync(LANCEMENTS, JSON.stringify(l, null, 2));
const lireArret = () => { try { return JSON.parse(lire(ARRET)).cles || []; } catch { return []; } };
const noterAuJournal = (quoi, story = '—') => { try { ecrire(story, 'vous', quoi); } catch { /* le journal ne bloque rien */ } };

// Le lancement en cours est le dernier. Sans fichier de lancements (stories lancees avant
// cette version de la Tour), on part de la derniere demande recue dans le journal.
function lancementCourant(evenements) {
  const l = lireLancements().at(-1);
  if (l) return l;
  const ev = evenements.findLast(e => e.qui === 'n8n' && /demande reçue/.test(e.quoi));
  return ev ? { n: 0, debut: null, portee: 'choix', cles: [], apres: ev.n, implicite: true } : null;
}

function etat() {
  const evenements = lireJournal();
  const fiches = lireFiches();
  const verrou = lireVerrou();
  const sq = resultatsSquash.valeur;
  const lancement = lancementCourant(evenements);
  const pause = existsSync(PAUSE) ? JSON.parse(lire(PAUSE) || '{}') : null;

  // Les stories du lancement : celles choisies dans la Tour, plus celles demandees a n8n
  // depuis (par exemple par Claude, dans la conversation).
  const membres = new Set(lancement?.cles || []);
  const dansLeLancement = (ev) => lancement && ev.n >= lancement.apres;
  for (const ev of evenements)
    if (ev.cle && dansLeLancement(ev) && ev.qui === 'n8n' && /demandée depuis Claude/.test(ev.quoi)) membres.add(ev.cle);

  // --- les stories : celles du journal, plus celles du plan Squash -----------------
  // Leur colonne ne tient compte que de ce qui s'est passe depuis le debut du lancement.
  const stories = {};
  const story = (cle, titre) => stories[cle] ??= { cle, titre: titre || cle, colonne: null, bloque: false, arretee: false, raison: null };
  for (const ev of evenements) {
    if (!ev.cle) continue;
    const s = story(ev.cle, ev.story.replace(/\s*\([^)]*\)\s*$/, ''));
    const ref = ev.quoi.match(/\b(TC-[A-Z][A-Z0-9]+-\d+)\b/)?.[1];
    if (ref && ref.endsWith(`-${ev.cle.split('-').pop()}`)) s.referenceCas = ref;
    if (!membres.has(ev.cle) || !dansLeLancement(ev)) continue;
    const { colonne, bloque, arretee } = colonneApres(ev);
    if (colonne) s.colonne = colonne;
    if (bloque === true) { s.bloque = true; if (/^🛑 bloqué/.test(ev.quoi)) s.raison = raisonDuBlocage(ev.quoi); }
    if (bloque === false) { s.bloque = false; s.raison = null; }
    if (arretee !== undefined) s.arretee = arretee;
  }
  for (const cle of membres) story(cle, lancement.titres?.[cle]);
  for (const c of sq?.cas || []) {
    const cle = c.reference?.replace(/^TC-/, '');
    if (!cle) continue;
    const s = story(cle, c.nom.replace(/^TC-\S+\s*-\s*/, ''));
    s.referenceCas ??= c.reference;
    s.resultat = RESULTAT[c.statut] || null;
    s.statutSquash = c.statut;
    s.joueLe = c.derniereExecution;
  }

  for (const s of Object.values(stories)) {
    const f = fiches[s.cle];
    if (f?.titre) s.titre = f.titre;
    s.dansLancement = membres.has(s.cle);
    if (!s.dansLancement) s.colonne = null;
    else {
      s.colonne ??= 'a-faire';
      if (lancement.arreteLe && s.colonne !== 'termine') s.arretee = true;
    }
    // Le resultat Squash ne compte pour le Kanban que s'il date de ce lancement.
    s.resultatDuLancement = s.dansLancement && s.resultat && (!lancement.debut || (s.joueLe && s.joueLe >= lancement.debut)) ? s.resultat : null;
    const enTravail = s.dansLancement && verrou && verrou.story?.includes(`(${s.cle})`);
    s.travail = enTravail ? { agent: verrou.agent, depuis: verrou.depuis } : null;
    if (enTravail) {
      const action = [...evenements].reverse().find(e => e.cle === s.cle && e.qui === verrou.agent && !/^démarre$|attend son tour|^⏸|^▶ reprise/.test(e.quoi));
      s.travail.action = action?.quoi || 'démarre';
    }
    s.attendSonTour = s.dansLancement && !enTravail && !s.bloque && !s.arretee
      && ['a-faire', 'analyste', 'automaticien', 'executant', 'anomalies', 'rapporteur'].includes(s.colonne);
    s.lienValidation = s.colonne === 'a-valider' ? f?.lienValidation || null : null;
    s.attenteDepuis = s.colonne === 'a-valider'
      ? [...evenements].reverse().find(e => e.cle === s.cle && /attend votre validation/.test(e.quoi))?.heure || null : null;
    s.referenceCas ??= `TC-${s.cle}`;
    s.prochaineAction = f?.prochaineAction || '';
    s.fiche = f?.fichier || null;
    s.lienJira = `${JIRA}/browse/${s.cle}`;
  }
  const listeStories = Object.values(stories).sort((a, b) => Number(a.cle.split('-').pop()) - Number(b.cle.split('-').pop()));
  const duLancement = listeStories.filter(s => s.dansLancement);

  // --- les agents ------------------------------------------------------------------
  const agents = AGENTS.map((a) => {
    const colonne = colonneDeLAgent[a.nom];
    const ici = duLancement.filter(s => s.colonne === colonne && !s.arretee);
    const travail = verrou?.agent === a.nom;
    const bloque = !travail && ici.some(s => s.bloque);
    const etat = travail ? 'travail' : bloque ? 'bloque' : pause && ici.length ? 'pause' : ici.length ? 'attente' : 'libre';
    return { ...a, colonne, etat };
  });

  // --- le lancement en cours et les precedents ------------------------------------------
  const resume = lancement && {
    n: lancement.n, debut: lancement.debut, portee: lancement.portee, implicite: !!lancement.implicite,
    arreteLe: lancement.arreteLe || null, nb: duLancement.length,
    termines: duLancement.filter(s => s.colonne === 'termine').length,
    reussis: duLancement.filter(s => s.resultatDuLancement === 'reussi').length,
    echoues: duLancement.filter(s => s.resultatDuLancement === 'echoue').length,
    fini: duLancement.length > 0 && duLancement.every(s => s.colonne === 'termine' || s.arretee),
  };
  const historique = lireLancements().slice(0, -1).slice(-5).reverse()
    .map(l => ({ n: l.n, debut: l.debut, portee: l.portee, nb: l.cles.length, arreteLe: l.arreteLe || null }));

  // --- les bugs signales (fiches de suivi, section 5) -------------------------------
  const bugs = {};
  for (const f of Object.values(fiches)) for (const b of f.bugs) {
    const deja = bugs[b.cle];
    bugs[b.cle] = { ...b, titre: b.titre || deja?.titre || '', nouveau: deja ? deja.nouveau && b.nouveau : b.nouveau };
  }

  // --- la qualite (regles fixes) -----------------------------------------------------
  const joues = listeStories.filter(s => s.resultat);
  const reussis = joues.filter(s => s.resultat === 'reussi').length;
  const taux = joues.length ? Math.round(reussis / joues.length * 100) : null;
  const niveau = taux === null ? null : NIVEAUX.find(n => taux >= n.min);
  const qualite = {
    stories: listeStories.length, joues: joues.length, reussis, echoues: joues.length - reussis,
    nonJoues: listeStories.length - joues.length, taux, niveau,
    provisoire: listeStories.length > joues.length,
    couverture: listeStories.length ? Math.round(joues.length / listeStories.length * 100) : 0,
  };

  return {
    maintenant: new Date().toISOString(),
    colonnes: COLONNES,
    agents,
    lancement: resume,
    historique,
    pause,
    stories: listeStories,
    bugs: Object.values(bugs),
    qualite,
    niveaux: NIVEAUX,
    squash: { iteration: sq?.iteration || { id: Number(iterationSuivie()), nom: null }, erreur: resultatsSquash.erreur,
              relu: resultatsSquash.quand ? new Date(resultatsSquash.quand).toISOString() : null },
    analyse: analyse.etat(),
    evenements: evenements.slice(-200).reverse(),
    services: services.valeurs,
  };
}

/* ------------------------------------------- n8n et Squash sont-ils allumes ? */
const services = { valeurs: { n8n: null, squash: null }, quand: 0 };
async function sonder(url) {
  try { const r = await fetch(url, { signal: AbortSignal.timeout(2500) }); return r.status < 500; } catch { return false; }
}
async function rafraichirServices() {
  if (Date.now() - services.quand < 15000) return;
  services.quand = Date.now();
  const [n8n, squash] = await Promise.all([
    sonder(`${N8N}/healthz`), sonder('http://127.0.0.1:8090/squash/'),
  ]);
  services.valeurs = { n8n, squash };
}

/* ------------------------------------------- la validation, transmise a n8n */
// Le formulaire « ⏸ Attendre votre validation » de n8n a deux champs : field-0 (Décision)
// et field-1 (Remarques). On le remplit exactement comme le ferait votre navigateur.
async function valider({ cle, decision, remarques }) {
  if (!['Approuver', 'Refuser'].includes(decision)) throw new Error('Décision inconnue.');
  remarques = String(remarques || '').trim().slice(0, 2000);
  if (decision === 'Refuser' && !remarques) throw new Error("Expliquez ce qu'il faut corriger : c'est ce que lira l'Analyste.");
  const s = etat().stories.find(x => x.cle === cle);
  if (!s || s.colonne !== 'a-valider' || s.arretee) throw new Error(`${cle} n'attend pas de validation.`);
  if (!s.lienValidation) throw new Error("Lien du formulaire n8n introuvable dans la fiche de suivi. Ouvrez le formulaire depuis le commentaire Jira de la story.");
  await envoyerAuFormulaire(s.lienValidation, decision, remarques);
}

async function envoyerAuFormulaire(adresse, decision, remarques) {
  const lien = new URL(adresse);
  if (!['localhost', '127.0.0.1'].includes(lien.hostname)) throw new Error('Le lien de validation ne pointe pas vers le n8n de ce PC.');
  const corps = new FormData();
  corps.append('field-0', decision);
  corps.append('field-1', remarques);
  let r;
  try {
    r = await fetch(lien, { method: 'POST', body: corps, signal: AbortSignal.timeout(15000) });
  } catch {
    throw new Error("n8n ne répond pas. Est-il démarré (n8n/demarrer-n8n.cmd) ?");
  }
  if (!r.ok) throw new Error(r.status === 404
    ? "n8n n'attend plus cette validation (déjà donnée, ou cycle arrêté)."
    : `n8n a refusé la réponse (HTTP ${r.status}).`);
}

/* ------------------------------------------- lancer, mettre en pause, reprendre, arreter */
const PORTEES = { choix: 'stories choisies', sprint: 'sprint actif', backlog: 'tout le backlog' };

// La liste des stories du sprint actif ou du backlog, lue dans Jira par le flux n8n 4.
async function listerStories(portee) {
  let r;
  try {
    r = await fetch(`${N8N}/webhook/qa-homey-lister-les-stories?portee=${portee === 'sprint' ? 'sprint' : 'backlog'}`, { signal: AbortSignal.timeout(20000) });
  } catch {
    throw new Error("n8n ne répond pas. Démarrez-le avec n8n/demarrer-n8n.cmd.");
  }
  const texte = await r.text();
  if (r.status === 404) throw new Error("Le flux n8n « 4. Lister les stories » n'est pas publié : ouvrez-le dans n8n et cliquez sur Publish.");
  let donnees;
  try { donnees = JSON.parse(texte); } catch { throw new Error(`Réponse de n8n illisible (HTTP ${r.status}).`); }
  if (!r.ok) throw new Error(donnees.erreur || `n8n a répondu HTTP ${r.status}.`);
  // On ajoute ce que la Tour sait deja : dernier resultat Squash, presence dans le lancement.
  const e = etat();
  for (const s of donnees.stories) {
    const connue = e.stories.find(x => x.cle === s.cle);
    s.resultat = connue?.resultat || null;
    s.joueLe = connue?.joueLe || null;
    // « deja en cours » : dans le lancement en cours, ni terminee, ni bloquee, ni arretee.
    s.dansLancement = !!connue?.dansLancement && connue.colonne !== 'termine' && !connue.bloque && !connue.arretee
      && !e.lancement?.fini && !e.lancement?.arreteLe;
  }
  return donnees;
}

async function lancer({ portee, cles, titres }) {
  if (!PORTEES[portee]) throw new Error('Portée inconnue.');
  cles = [...new Set((cles || []).map(c => String(c).trim().toUpperCase()).filter(c => /^[A-Z][A-Z0-9]+-\d+$/.test(c)))];
  if (!cles.length) throw new Error('Choisissez au moins une story.');
  const e = etat();
  const enCours = e.lancement && !e.lancement.implicite && !e.lancement.fini && !e.lancement.arreteLe;
  const dejaEnRoute = enCours ? cles.filter(c => { const s = e.stories.find(x => x.cle === c);
    return s?.dansLancement && s.colonne !== 'termine' && !s.arretee && !s.bloque; }) : [];
  if (dejaEnRoute.length) throw new Error(`Déjà en cours dans ce lancement : ${dejaEnRoute.join(', ')}.`);

  // Le lancement commence ici : n8n ecrit au journal des qu'il recoit la demande.
  const nbEvenements = lireJournal().length;
  // D'abord n8n : si la demande echoue, rien n'est note.
  let r;
  try {
    r = await fetch(`${N8N}/webhook/qa-homey-lancer-des-stories`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stories: cles }), signal: AbortSignal.timeout(20000) });
  } catch {
    throw new Error("n8n ne répond pas. Démarrez-le avec n8n/demarrer-n8n.cmd.");
  }
  if (r.status === 404) throw new Error("Le flux n8n « 1. Lancer des stories » n'est pas publié : ouvrez-le dans n8n et cliquez sur Publish.");
  if (!r.ok) throw new Error(`n8n a refusé le lancement (HTTP ${r.status}).`);

  // Ces stories ne sont plus « arretees » : les agents les traiteront de nouveau.
  const arret = lireArret().filter(c => !cles.includes(c));
  if (arret.length) writeFileSync(ARRET, JSON.stringify({ cles: arret })); else if (existsSync(ARRET)) unlinkSync(ARRET);

  const lancements = lireLancements();
  const t = Object.fromEntries(Object.entries(titres || {}).filter(([c]) => cles.includes(c)).map(([c, v]) => [c, String(v).slice(0, 200)]));
  let l;
  if (enCours) {
    l = lancements.at(-1);
    l.cles.push(...cles.filter(c => !l.cles.includes(c)));
    l.titres = { ...l.titres, ...t };
    noterAuJournal(`➕ ajouté au lancement n° ${l.n} : ${cles.join(', ')}`);
  } else {
    l = { n: (lancements.at(-1)?.n || 0) + 1, debut: new Date().toISOString(), portee, cles, titres: t, apres: nbEvenements };
    lancements.push(l);
    noterAuJournal(`🚀 lancement n° ${l.n} (${PORTEES[portee]}) : ${cles.join(', ')}`); // 1re ligne du lancement
  }
  ecrireLancements(lancements);
  return { n: l.n, ajoute: !!enCours, cles };
}

function mettreEnPause() {
  if (existsSync(PAUSE)) return;
  writeFileSync(PAUSE, JSON.stringify({ depuis: new Date().toISOString() }));
  noterAuJournal('⏸ pause demandée : les agents finissent leur étape en cours, puis attendent');
}
function reprendre() {
  if (!existsSync(PAUSE)) return;
  unlinkSync(PAUSE);
  noterAuJournal('▶ reprise demandée : les agents repartent');
}

// Arreter le lancement : les agents ne demarrent plus rien pour ses stories ; un cas qui
// attend votre validation est refuse « pour arret », ce qui termine proprement son cycle.
async function arreter() {
  const e = etat();
  if (!e.lancement || e.lancement.implicite || e.lancement.fini || e.lancement.arreteLe) throw new Error('Aucun lancement en cours.');
  const restantes = e.stories.filter(s => s.dansLancement && s.colonne !== 'termine');
  writeFileSync(ARRET, JSON.stringify({ cles: [...new Set([...lireArret(), ...restantes.map(s => s.cle)])] }));
  const lancements = lireLancements();
  lancements.at(-1).arreteLe = new Date().toISOString();
  ecrireLancements(lancements);
  noterAuJournal(`⏹ lancement n° ${e.lancement.n} arrêté : ${restantes.map(s => s.cle).join(', ') || 'plus rien à faire'}`);
  const nonJoints = [];
  for (const s of restantes.filter(x => x.colonne === 'a-valider' && x.lienValidation)) {
    try { await envoyerAuFormulaire(s.lienValidation, 'Refuser', 'Lancement arrêté depuis la Tour de contrôle.'); }
    catch { nonJoints.push(s.cle); }
  }
  return { arretees: restantes.map(s => s.cle), nonJoints };
}

/* ------------------------------------------- l'analyse de Claude, a la demande */
const exe = join(process.env.APPDATA || '', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');
const analyse = {
  enCours: false, erreur: null,
  derniere() { try { return JSON.parse(lire(ANALYSE)); } catch { return null; } },
  etat() { return { enCours: this.enCours, erreur: this.erreur, derniere: this.derniere() }; },
  lancer() {
    if (this.enCours) return;
    const e = etat();
    const donnees = {
      iteration: e.squash.iteration, qualite: { ...e.qualite, niveau: e.qualite.niveau?.nom },
      stories: e.stories.map(s => ({ cle: s.cle, titre: s.titre, etape: s.colonne, bloquee: s.bloque, raison: s.raison, resultat: s.resultat || 'pas encore testée' })),
      bugs: e.bugs, journal: e.evenements.slice(0, 60).map(v => `${v.date} ${v.heure} · ${v.story || '—'} · ${v.qui} · ${v.quoi}`),
    };
    const consigne = `Tu es le responsable qualité d'une équipe de test. Voici l'état du sprint de test du site Homey, en JSON :

${JSON.stringify(donnees, null, 1)}

Écris une analyse en français pour un lecteur non technique, en 3 à 5 courts paragraphes, sans titre, sans liste, sans Markdown :
- ce qui marche et ce qui ne marche pas, du point de vue d'un utilisateur du site ;
- les risques les plus importants et pourquoi ;
- ce qu'il faut faire en priorité (une validation en attente, un blocage, un bug à corriger).
N'invente rien : appuie-toi seulement sur ces données. Réponds uniquement avec le texte de l'analyse.`;
    this.enCours = true; this.erreur = null;
    const [programme, shell] = existsSync(exe) ? [exe, false] : ['claude', true];
    const p = spawn(programme, ['-p', '--output-format', 'json', '--tools', '', '--strict-mcp-config', '--no-session-persistence'],
      { cwd: RACINE, shell, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('error', (x) => { this.enCours = false; this.erreur = `Claude introuvable : ${x.message}`; });
    p.on('close', (code) => {
      this.enCours = false;
      try {
        const r = JSON.parse(out);
        if (r.is_error || !r.result) throw new Error(r.result || 'réponse vide');
        writeFileSync(ANALYSE, JSON.stringify({ texte: String(r.result).trim(), quand: new Date().toISOString(),
          resultatsDu: e.squash.relu, cout: r.total_cost_usd ?? null }, null, 2));
      } catch (x) {
        this.erreur = `Claude n'a pas pu répondre (${code}) : ${(err || x.message).trim().slice(0, 300)}`;
      }
    });
    p.stdin.end(consigne);
  },
};

/* ---------------------------------------------------------------- serveur */
function repondre(res, code, type, corps) {
  res.writeHead(code, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
  res.end(corps);
}
const json = (res, code, objet) => repondre(res, code, 'application/json', JSON.stringify(objet));

// Une page d'un autre site ouverte dans votre navigateur ne doit pas pouvoir valider a
// votre place : les demandes qui modifient quelque chose doivent venir de la Tour elle-meme.
function demandeDeLaTour(req) {
  const origine = req.headers.origin;
  return req.headers['content-type']?.startsWith('application/json')
    && (!origine || origine === `http://localhost:${PORT}` || origine === `http://127.0.0.1:${PORT}`);
}
async function lireCorps(req) {
  let corps = '';
  for await (const morceau of req) { corps += morceau; if (corps.length > 20000) throw new Error('Demande trop longue'); }
  return corps ? JSON.parse(corps) : {};
}

const serveur = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (req.method === 'POST') {
      if (!demandeDeLaTour(req)) return json(res, 403, { erreur: 'Demande refusée.' });
      const corps = await lireCorps(req);
      if (url.pathname === '/valider') {
        try { await valider(corps); } catch (e) { return json(res, 400, { erreur: e.message }); }
        return json(res, 200, { ok: true });
      }
      if (url.pathname === '/analyse') { analyse.lancer(); return json(res, 202, { ok: true }); }
      try {
        if (url.pathname === '/lancer') return json(res, 200, await lancer(corps));
        if (url.pathname === '/pause') { mettreEnPause(); return json(res, 200, { ok: true }); }
        if (url.pathname === '/reprendre') { reprendre(); return json(res, 200, { ok: true }); }
        if (url.pathname === '/arreter') return json(res, 200, await arreter());
      } catch (e) { return json(res, 400, { erreur: e.message }); }
      return json(res, 404, { erreur: 'Introuvable' });
    }
    if (url.pathname === '/') return repondre(res, 200, 'text/html', readFileSync(join(ICI, 'tableau-de-bord.html')));
    if (url.pathname === '/etat') {
      await rafraichirServices();
      rafraichirSquash(); // en arriere-plan : la page n'attend jamais Squash
      return json(res, 200, etat());
    }
    if (url.pathname === '/fiche') {
      const f = lireFiches()[url.searchParams.get('cle')];
      return f ? repondre(res, 200, 'text/plain', lire(join(SUIVI, f.fichier)))
               : repondre(res, 404, 'text/plain', 'Pas encore de fiche de suivi pour cette story.');
    }
    if (url.pathname === '/stories') {
      try { return json(res, 200, await listerStories(url.searchParams.get('portee'))); }
      catch (e) { return json(res, 502, { erreur: e.message }); }
    }
    if (url.pathname === '/cas') {
      const s = etat().stories.find(x => x.cle === url.searchParams.get('cle'));
      if (!s) return json(res, 404, { erreur: 'Story inconnue.' });
      try { return json(res, 200, await squash('lire-cas', s.referenceCas, '--json')); }
      catch (e) { return json(res, 502, { erreur: `Squash : ${e.message}` }); }
    }
    repondre(res, 404, 'text/plain', 'Introuvable');
  } catch (e) {
    repondre(res, 500, 'text/plain', String(e?.message || e));
  }
});

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  serveur.on('error', (e) => {
    if (e.code === 'EADDRINUSE') { console.log(`La Tour de contrôle tourne déjà : http://localhost:${PORT}`); process.exit(0); }
    throw e;
  });
  serveur.listen(PORT, '127.0.0.1', () => console.log(`Tour de contrôle des agents QA : http://localhost:${PORT}`));
  rafraichirSquash(true);
}

export { etat, lireJournal, bugsDeLaFiche };

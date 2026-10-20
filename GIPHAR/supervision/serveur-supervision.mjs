#!/usr/bin/env node
/**
 * serveur-supervision.mjs — l'ecran de supervision des agents QA, sur http://localhost:5680
 *
 *   node supervision/serveur-supervision.mjs
 *
 * Demarre tout seul avec n8n/demarrer-n8n.cmd. N'ecoute que ce PC. Ne consomme rien :
 * il ne fait que LIRE ce que n8n et les agents ecrivent deja :
 *   - suivi-des-stories/journal-des-taches.md   (chaque action, toutes stories confondues)
 *   - suivi-des-stories/story-*.md              (la fiche de suivi de chaque story)
 *   - suivi-des-stories/.agent-en-cours.json    (le verrou : quel agent travaille en ce moment)
 *
 * Adresses :
 *   /            la page (tableau-de-bord.html)
 *   /etat        l'etat complet, en JSON (la page le relit toutes les 3 secondes)
 *   /fiche?cle=  le texte de la fiche de suivi d'une story
 */
import http from 'node:http';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, '..');
const SUIVI = join(RACINE, 'suivi-des-stories');
const JOURNAL = process.env.JOURNAL_DES_TACHES || join(SUIVI, 'journal-des-taches.md');
const VERROU = process.env.VERROU_AGENT || join(SUIVI, '.agent-en-cours.json');
const PORT = Number(process.env.SUPERVISION_PORT || 5680);
const JIRA = 'https://testacademy.atlassian.net';

/* --------------------------------------------------------------- l'equipe */
// Les colonnes du Kanban, dans l'ordre. Ce sont aussi les colonnes du tableau Jira.
export const COLONNES = [
  { id: 'analyste', titre: 'Analyste', agent: 'agent-analyste' },
  { id: 'a-valider', titre: 'À valider', agent: null },
  { id: 'automaticien', titre: 'Automaticien', agent: 'agent-automaticien' },
  { id: 'executant', titre: 'Exécutant', agent: 'agent-executant' },
  { id: 'anomalies', titre: 'Anomalies', agent: 'agent-gestionnaire-anomalies' },
  { id: 'rapporteur', titre: 'Rapporteur', agent: 'agent-rapporteur' },
  { id: 'termine', titre: 'Terminé', agent: null },
  { id: 'bloque', titre: 'Bloqué', agent: null },
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
      lienValidation: prochaine.match(/\((https?:\/\/[^)]*form-waiting[^)]*)\)/)?.[1] || null,
      miseAJour: ligne('Dernière mise à jour'),
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

/* ------------------------------------------- l'etat, deduit du journal */
// Ou en est une story apres cet evenement ? (null : l'evenement ne la deplace pas)
function colonneApres(ev) {
  const q = ev.quoi;
  if (ev.qui === 'n8n') {
    if (/attend votre validation/.test(q)) return 'a-valider';
    if (/REFUSÉ/.test(q)) return 'analyste';
    if (/APPROUVÉ|passé à « Approuvé »/.test(q)) return 'automaticien';
    if (/cycle terminé/.test(q)) return 'termine';
    if (/cycle interrompu/.test(q)) return 'bloque';
    if (/demandée depuis Claude|cycle démarré/.test(q)) return 'analyste';
    return null;
  }
  if (!colonneDeLAgent[ev.qui]) return null;
  if (/^✅ terminé/.test(q)) return APRES[ev.qui];
  if (/^🛑 bloqué/.test(q)) return 'bloque';
  return colonneDeLAgent[ev.qui];
}

const titreDe = (nom) => (AGENTS.find(a => a.nom === nom)?.titre || nom.replace('agent-', '')).toLowerCase();
function sousEtat(ev, verrou) {
  if (!ev) return { code: 'inconnu', texte: '' };
  if (ev.qui === 'n8n' && /attend votre validation/.test(ev.quoi)) return { code: 'vous', texte: 'attend votre validation' };
  if (/attend son tour/.test(ev.quoi)) return { code: 'attente', texte: `${titreDe(ev.qui)} attend son tour` };
  if (/cycle terminé/.test(ev.quoi)) return { code: 'fini', texte: /Verdict : echouee/.test(ev.quoi) ? 'terminé · anomalie' : 'terminé' };
  if (/cycle interrompu|^🛑/.test(ev.quoi)) return { code: 'bloque', texte: 'bloqué' };
  if (verrou && ev.cle && verrou.story?.includes(`(${ev.cle})`)) return { code: 'travail', texte: `${titreDe(verrou.agent)} au travail` };
  return { code: 'transit', texte: 'passe à l’étape suivante' };
}

function etat() {
  const evenements = lireJournal();
  const fiches = lireFiches();
  const verrou = lireVerrou();

  // --- les stories -------------------------------------------------------------
  const stories = {};
  for (const ev of evenements) {
    if (!ev.cle) continue;
    const s = stories[ev.cle] ??= { cle: ev.cle, titre: ev.story.replace(/\s*\([^)]*\)\s*$/, ''), colonne: 'analyste', dernier: null, nb: 0 };
    const c = colonneApres(ev);
    if (c) s.colonne = c;
    if (!/déplacé dans la colonne|colonne Jira/.test(ev.quoi)) s.dernier = ev;
    s.nb++;
  }
  for (const s of Object.values(stories)) {
    const f = fiches[s.cle];
    s.sousEtat = sousEtat(s.dernier, verrou);
    s.lienValidation = s.colonne === 'a-valider' ? f?.lienValidation || null : null;
    s.prochaineAction = f?.prochaineAction || '';
    s.fiche = f?.fichier || null;
    s.lienJira = `${JIRA}/browse/${s.cle}`;
    if (f?.titre) s.titre = f.titre;
  }

  // --- les agents ----------------------------------------------------------------
  const agents = AGENTS.map((a) => {
    const siens = evenements.filter(e => e.qui === a.nom);
    if (verrou?.agent === a.nom) {
      const surStory = siens.filter(e => verrou.story && e.story === verrou.story);
      const action = [...surStory].reverse().find(e => !/^démarre$|attend son tour/.test(e.quoi));
      return { ...a, etat: 'travail', story: verrou.story, cle: verrou.story?.match(/\(([^)]+)\)\s*$/)?.[1],
               action: action?.quoi || 'démarre', depuis: verrou.depuis };
    }
    // Les stories ou cet agent attend son tour (sa derniere ligne pour elles).
    const derniereParStory = {};
    for (const e of siens) if (e.cle) derniereParStory[e.cle] = e;
    const enAttente = Object.values(derniereParStory).filter(e => /attend son tour/.test(e.quoi));
    if (enAttente.length)
      return { ...a, etat: 'attente', stories: enAttente.map(e => e.story), action: enAttente[0].quoi };
    const fin = [...siens].reverse().find(e => /^✅ terminé|^🛑 bloqué/.test(e.quoi));
    return { ...a, etat: 'libre', dernier: fin ? { story: fin.story, quoi: fin.quoi, quand: `${fin.date} ${fin.heure}` } : null };
  });

  return {
    maintenant: new Date().toISOString(),
    colonnes: COLONNES.map(({ id, titre, agent }) => ({ id, titre, agent })),
    agents,
    stories: Object.values(stories),
    evenements: evenements.slice(-150).reverse(),
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
    sonder('http://127.0.0.1:5678/healthz'), sonder('http://127.0.0.1:8090/squash/'),
  ]);
  services.valeurs = { n8n, squash };
}

/* ---------------------------------------------------------------- serveur */
function repondre(res, code, type, corps) {
  res.writeHead(code, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
  res.end(corps);
}

const serveur = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/') return repondre(res, 200, 'text/html', readFileSync(join(ICI, 'tableau-de-bord.html')));
    if (url.pathname === '/etat') {
      await rafraichirServices();
      return repondre(res, 200, 'application/json', JSON.stringify(etat()));
    }
    if (url.pathname === '/fiche') {
      const f = lireFiches()[url.searchParams.get('cle')];
      return f ? repondre(res, 200, 'text/plain', lire(join(SUIVI, f.fichier)))
               : repondre(res, 404, 'text/plain', 'Pas encore de fiche de suivi pour cette story.');
    }
    repondre(res, 404, 'text/plain', 'Introuvable');
  } catch (e) {
    repondre(res, 500, 'text/plain', String(e?.message || e));
  }
});

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  serveur.on('error', (e) => {
    if (e.code === 'EADDRINUSE') { console.log(`La supervision tourne deja : http://localhost:${PORT}`); process.exit(0); }
    throw e;
  });
  serveur.listen(PORT, '127.0.0.1', () => console.log(`Supervision des agents QA : http://localhost:${PORT}`));
}

export { etat, lireJournal, colonneApres };

#!/usr/bin/env node
/**
 * lancer-agent.mjs — lance UN agent Claude pour n8n, en racontant au journal ce qu'il fait.
 *
 * Plusieurs agents travaillent en parallele (nombre regle depuis la Tour de controle) ; la
 * campagne de tests et la publication du bilan restent a un seul agent a la fois. Si la
 * limite d'usage de Claude est atteinte, tous les agents se mettent en pause jusqu'a la
 * remise a zero, puis l'etape est rejouee.
 *
 *   node n8n/outils/lancer-agent.mjs <nom-de-l-agent> "<story>" <consigne...>
 *
 * Remplace l'appel direct `claude -p` des boites 🤖 de n8n :
 *   - chaque action de l'agent (lire la story, ecrire un test, lancer Playwright, creer un
 *     bug…) est traduite en une phrase simple dans suivi-des-stories/journal-des-taches.md,
 *     au moment ou elle a lieu ;
 *   - la consigne est passee a Claude par l'entree standard, pas par la ligne de commande :
 *     aucun risque qu'un caractere special la coupe ;
 *   - l'heure de Paris est ajoutee a la consigne, pour que les comptes rendus soient dates
 *     juste ;
 *   - a la fin, la SEULE chose ecrite sur la sortie est la reponse finale de Claude, au meme
 *     format que `claude -p --output-format json` : n8n la lit exactement comme avant.
 */
import { spawn } from 'node:child_process';
import { existsSync, writeFileSync, readFileSync, unlinkSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { ecrire } from './ecrire-au-journal.mjs';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const [agent, story, ...mots] = process.argv.slice(2);
if (!agent || !mots.length) {
  console.error('Usage : lancer-agent.mjs <agent> "<story>" <consigne...>');
  process.exit(1);
}
const journal = (quoi) => { try { ecrire(story, agent, quoi); } catch { /* le journal ne bloque jamais l'agent */ } };

const heureDeParis = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' }).format(new Date());
const consigne = `${mots.join(' ')}\n\nDate et heure actuelles (heure de Paris) : ${heureDeParis}. ` +
  'Utilise cette heure pour dater tes textes.';

/* ------------------------------------------- traduire une action en phrase */
const court = (t, n = 90) => { t = String(t ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; };
const fichier = (p) => p ? relative(RACINE, resolve(RACINE, p)).replace(/\\/g, '/') : '?';
let essaisPlaywright = 0;

const SQUASH = {
  'ajouter-story': () => "crée l'exigence et le cas de test dans Squash",
  'modifier-cas': () => 'réécrit le cas de test dans Squash',
  'lire-cas': (a) => `lit le cas de test ${a[0]} dans Squash`,
  statut: (a) => `passe le cas ${a[0]} au statut ${a[1]} dans Squash`,
  tag: (a) => `déclare le cas ${a[0]} « automatisé » dans Squash`,
  detag: (a) => `retire la déclaration « automatisé » du cas ${a[0]}`,
  'ajouter-au-plan': (a) => `vérifie que ${a[0]} est au plan de l'itération Squash`,
  resultats: () => "relève les résultats de l'itération Squash",
  'lire-bilans': () => "relit les bilans précédents de l'itération Squash",
  'bilan-iteration': () => "publie le bilan global dans l'itération Squash",
  reperes: () => 'relève les identifiants Squash',
  verifier: () => "vérifie l'accès à Squash",
};

function decrireCommande(cmd) {
  const sq = cmd.match(/squash\.mjs\s+([\w-]+)\s*(.*)/);
  if (sq) return (SQUASH[sq[1]] || (() => `Squash : ${sq[1]}`))(sq[2].split(/\s+/));
  if (/lancer-campagne\.mjs/.test(cmd)) return 'lance toute la campagne Playwright (résultats envoyés à Squash)';
  if (/lister-echecs\.mjs/.test(cmd)) return "liste les tests en échec de l'itération";
  const lien = cmd.match(/squash-side\.mjs\s+(\d+)\s+(\S+)/);
  if (lien) return `relie l'exécution Squash n° ${lien[1]} au bug ${lien[2]} (capture en PDF + lien)`;
  const pw = cmd.match(/playwright test\s*([^\s|&;]*)/);
  if (pw) return `lance le test ${pw[1] || '(tous)'} sur le vrai site (essai ${++essaisPlaywright})`;
  return `exécute une commande : ${court(cmd, 70)}`;
}

const OPERATIONS_JIRA = {
  createJiraIssueLink: 'relie le bug à la story dans Jira',
  createJiraIssueRemoteIssueLink: "ajoute dans Jira un lien vers l'exécution Squash",
};

function decrire(nom, e = {}) {
  const jira = nom.match(/Atlassian_MCP__(\w+)/)?.[1];
  if (jira) {
    switch (jira) {
      case 'getAccessibleAtlassianResources': return 'se connecte à Jira';
      case 'getJiraIssue': return `lit le ticket ${e.issueIdOrKey} dans Jira`;
      case 'searchJiraIssuesUsingJql': return 'cherche dans Jira si le bug existe déjà (anti-doublon)';
      case 'createJiraIssue': return `crée dans Jira le ticket « ${court(e.summary, 70)} »`;
      case 'addOrEditJiraIssueComment': return `commente le ticket ${e.issueIdOrKey} dans Jira`;
      case 'editJiraIssue': return `modifie le ticket ${e.issueIdOrKey} dans Jira`;
      case 'transitionJiraIssue': return `fait avancer le ticket ${e.issueIdOrKey} dans Jira`;
      case 'discover': return null; // simple recherche d'outil : sans interet pour le journal
      case 'executeRead': case 'executeWrite':
        return OPERATIONS_JIRA[e.name] || `Jira : ${e.name}`;
      default: return `Jira : ${jira}`;
    }
  }
  switch (nom) {
    case 'Skill': return `charge la compétence ${e.skill || e.command || ''}`.trim();
    case 'Read': return `lit ${fichier(e.file_path)}`;
    case 'Write': return `écrit ${fichier(e.file_path)}`;
    case 'Edit': return `met à jour ${fichier(e.file_path)}`;
    case 'Glob': case 'Grep': return null;
    case 'Bash': return decrireCommande(e.command || '');
    default: return `utilise l'outil ${nom}`;
  }
}

/* ---------------------------------------------------------------- lancer */
const exe = join(process.env.APPDATA || '', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');
const [programme, shell] = existsSync(exe) ? [exe, false] : ['claude', true];
// LANCER_AGENT_DOUBLURE : un faux Claude (script Node), pour tester sans rien consommer.
const doublure = process.env.LANCER_AGENT_DOUBLURE;
const args = [...(doublure ? [doublure] : []), '-p', '--agent', agent, '--permission-mode', 'acceptEdits',
              '--output-format', 'stream-json', '--verbose'];

/* ------------------------------------------- plusieurs agents en parallele */
// Chaque agent au travail occupe une « place » : un fichier suivi-des-stories/.agents/<pid>.json.
// Le nombre de places se regle depuis la Tour de controle (suivi-des-stories/.reglages.json,
// 1 a 5). Deux ressources ne se partagent pas :
//  - la campagne de tests (executant, puis gestionnaire d'anomalies qui trie ses echecs) :
//    deux campagnes en meme temps enverraient des resultats en double a Squash ;
//  - la publication du bilan dans l'iteration Squash (rapporteur) : deux bilans en meme
//    temps s'ecraseraient.
// Une place laissee par un agent arrete brutalement est ignoree (son processus n'existe plus).
const SUIVI = process.env.SUIVI_DES_STORIES || join(RACINE, 'suivi-des-stories'); // autre dossier : pour les essais
const PLACES = process.env.AGENTS_AU_TRAVAIL || join(SUIVI, '.agents');
const MUTEX = join(SUIVI, '.agents.mutex');
const REGLAGES = join(SUIVI, '.reglages.json');
const RESSOURCE = { 'agent-executant': 'campagne', 'agent-gestionnaire-anomalies': 'campagne', 'agent-rapporteur': 'bilan' }[agent] || null;
const NOM_RESSOURCE = { campagne: 'la campagne de tests', bilan: 'la publication du bilan Squash' };
const MA_PLACE = join(PLACES, `${process.pid}.json`);
const vivant = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
const maxAgents = () => {
  try { return Math.min(5, Math.max(1, Math.round(Number(JSON.parse(readFileSync(REGLAGES, 'utf8')).agentsEnParallele)) || 5)); }
  catch { return 5; }
};
function lirePlaces() {
  mkdirSync(PLACES, { recursive: true });
  return readdirSync(PLACES).filter(f => f.endsWith('.json')).map((f) => {
    try {
      const p = JSON.parse(readFileSync(join(PLACES, f), 'utf8'));
      if (vivant(p.pid)) return p;
      unlinkSync(join(PLACES, f));
    } catch { /* fichier en cours d'ecriture ou deja retire */ }
    return null;
  }).filter(Boolean);
}
// Compter les places puis en prendre une : jamais deux agents a la fois (sinon ils
// pourraient prendre la derniere place ensemble).
async function avecMutex(fn) {
  for (;;) {
    try { writeFileSync(MUTEX, String(process.pid), { flag: 'wx' }); break; } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      try { if (!vivant(Number(readFileSync(MUTEX, 'utf8')))) unlinkSync(MUTEX); } catch { /* deja libere */ }
      await attendre(150);
    }
  }
  try { return fn(); } finally { try { unlinkSync(MUTEX); } catch { /* deja retire */ } }
}

/* ------------------------------------------- pause et arret, decides depuis la Tour */
// La Tour de controle pose suivi-des-stories/.pause.json (pause) et .arret.json (liste des
// stories dont le lancement est arrete). Un agent les consulte AVANT de commencer : un agent
// deja au travail finit son etape, on ne le coupe jamais au milieu. Une pause automatique
// (limite d'usage Claude) porte une heure de fin « jusqua » : passee cette heure, elle se
// leve toute seule.
const PAUSE = join(SUIVI, '.pause.json');
const ARRET = join(SUIVI, '.arret.json');
const cleStory = String(story || '').match(/\(([A-Z][A-Z0-9]+-\d+)\)\s*$/)?.[1];
function pauseActive() {
  let p;
  try { p = JSON.parse(readFileSync(PAUSE, 'utf8')); } catch { return null; }
  if (p.jusqua && Date.now() >= Date.parse(p.jusqua)) {
    try { unlinkSync(PAUSE); journal("▶ reprise automatique : la limite d'usage Claude est levée"); } catch { /* un autre agent l'a deja levee */ }
    return null;
  }
  return p;
}
const arretee = () => {
  try { return !!cleStory && JSON.parse(readFileSync(ARRET, 'utf8')).cles.includes(cleStory); } catch { return false; }
};
function sortirCarArretee() {
  journal('⏹ arrêté depuis la Tour de contrôle : ne démarre pas');
  // Meme forme qu'une reponse de Claude : n8n la lit comme les autres et termine le cycle.
  process.stdout.write(JSON.stringify({ type: 'result', subtype: 'success', is_error: false, result: JSON.stringify({
    statut: 'arrete', resume: 'Lancement arrêté depuis la Tour de contrôle.',
    prochaine_action: 'Aucune. Relancer la story depuis la Tour de contrôle si besoin.' }) }) + '\n');
  process.exit(0);
}

let maPlace = null;
async function prendreUnePlace() {
  let annonce = false, pauseAnnoncee = false;
  for (;;) {
    if (arretee()) sortirCarArretee();
    const pause = pauseActive();
    if (pause) {
      if (!pauseAnnoncee) {
        journal(pause.jusqua ? `⏸ en pause (limite d'usage Claude) jusqu'à ${heureCourte(pause.jusqua)}` : '⏸ en pause : attend la reprise depuis la Tour de contrôle');
        pauseAnnoncee = true;
      }
      await attendre(5000);
      continue;
    }
    const reponse = await avecMutex(() => {
      const places = lirePlaces();
      const max = maxAgents();
      if (places.length >= max) return { attente: `attend son tour : ${places.length} agent${places.length > 1 ? 's' : ''} déjà au travail (maximum ${max})` };
      const occupant = RESSOURCE && places.find(x => x.ressource === RESSOURCE);
      if (occupant) return { attente: `attend son tour : ${occupant.agent} utilise ${NOM_RESSOURCE[RESSOURCE]} pour « ${occupant.story} »` };
      // Chaque place a ses ports de debogage de navigateur (10 par place, a partir de 9300) :
      // la Tour de controle s'y branche pour montrer les navigateurs en direct.
      const prises = new Set(places.map(x => x.indice));
      let indice = 0;
      while (prises.has(indice)) indice++;
      maPlace = { pid: process.pid, agent, story, cle: cleStory, depuis: new Date().toISOString(), ressource: RESSOURCE, indice, portBase: 9300 + 10 * indice };
      writeFileSync(MA_PLACE, JSON.stringify(maPlace));
      return { ok: true };
    });
    if (reponse.ok) {
      if (pauseAnnoncee) journal('▶ reprise après la pause');
      return;
    }
    if (!annonce) { journal(reponse.attente); annonce = true; }
    await attendre(3000);
  }
}
const rendreLaPlace = () => { try { unlinkSync(MA_PLACE); } catch { /* rien a rendre */ } };
process.on('exit', rendreLaPlace);

/* ------------------------------------------- limite d'usage Claude : pause automatique */
const LIMITE = /hit your (?:session |usage |weekly |daily )?limit|usage limit|session limit/i;
const MOIS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const heureCourte = (iso) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
// « resets 7:50pm », « resets at 3pm », « resets Oct 22, 9am » -> la date de remise a zero
// (+ 1 minute de marge). Format inconnu : 30 minutes.
function heureDeRemiseAZero(texte) {
  const m = texte.match(/resets\s+(?:at\s+)?(?:([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return new Date(Date.now() + 30 * 60000);
  let h = Number(m[3]) % 12;
  if (!m[5] && Number(m[3]) >= 12) h = Number(m[3]);
  if (m[5]?.toLowerCase() === 'pm') h += 12;
  const d = new Date();
  if (m[1] && MOIS[m[1].toLowerCase()] !== undefined) d.setMonth(MOIS[m[1].toLowerCase()], Number(m[2]));
  d.setHours(h, Number(m[4] || 0) + 1, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d;
}
function poserPauseAutomatique(jusqua, message) {
  let actuelle = null;
  try { actuelle = JSON.parse(readFileSync(PAUSE, 'utf8')); } catch { /* pas de pause */ }
  if (actuelle && !actuelle.jusqua) return; // une pause decidee par vous reste maitresse
  if (actuelle?.jusqua && Date.parse(actuelle.jusqua) >= jusqua.getTime()) return;
  writeFileSync(PAUSE, JSON.stringify({ depuis: new Date().toISOString(), jusqua: jusqua.toISOString(), raison: 'limite', message: court(message, 200) }));
}

/* ------------------------------------------- une execution de Claude */
function lancerClaude() {
  return new Promise((fini) => {
    const debut = Date.now();
    const enfant = spawn(doublure ? process.execPath : programme, args, {
      cwd: RACINE, shell: doublure ? false : shell, stdio: ['pipe', 'pipe', 'inherit'],
      // PW_PORT_BASE : les navigateurs Playwright de cet agent ouvrent leur port de debogage a
      // partir de ce numero ; STORY_EN_COURS : la story, pour la fenetre « navigateur en direct ».
      env: { ...process.env, PW_PORT_BASE: String(maPlace.portBase), STORY_EN_COURS: cleStory || '' },
    });
    enfant.stdin.end(consigne);
    const actions = new Map(); // id de l'action -> sa description, pour signaler un echec
    let resultat = null;
    createInterface({ input: enfant.stdout }).on('line', (ligne) => {
      let ev;
      try { ev = JSON.parse(ligne); } catch { return; }
      if (ev.type === 'assistant') {
        for (const b of ev.message?.content || []) {
          if (b.type !== 'tool_use') continue;
          const phrase = decrire(b.name, b.input);
          actions.set(b.id, phrase || b.name);
          if (phrase) journal(phrase);
        }
      } else if (ev.type === 'user') {
        for (const b of ev.message?.content || []) {
          if (b.type === 'tool_result' && b.is_error) {
            const texte = Array.isArray(b.content) ? b.content.map(c => c.text || '').join(' ') : b.content;
            journal(`⚠ échec de « ${actions.get(b.tool_use_id) || 'une action'} » : ${court(texte, 120)}`);
          }
        }
      } else if (ev.type === 'result') {
        resultat = ev;
      }
    });
    enfant.on('close', (code) => fini({ code, resultat, debut }));
  });
}

function terminer({ code, resultat, debut }) {
  const m = Math.round((Date.now() - debut) / 60000);
  const minutes = m < 1 ? "moins d'1" : String(m);
  if (!resultat) {
    journal(`⚠ s'est arrêté sans réponse finale (code ${code}) après ${minutes} min`);
    process.exit(code || 1);
  }
  for (const r of resultat.permission_denials || [])
    journal(`⚠ action refusée car non autorisée : ${decrire(r.tool_name, r.tool_input) || r.tool_name}`);

  let fin = null;
  const texte = String(resultat.result ?? '');
  try { fin = JSON.parse(texte.slice(texte.indexOf('{'), texte.lastIndexOf('}') + 1)); } catch { /* lu par n8n */ }
  const cout = typeof resultat.total_cost_usd === 'number' ? `, ${resultat.total_cost_usd.toFixed(2)} $` : '';
  journal(fin?.statut === 'ok'
    ? `✅ terminé en ${minutes} min${cout} : ${court(fin.resume, 200)}`
    : `🛑 bloqué après ${minutes} min${cout} : ${court(fin?.resume || texte, 200)}`);

  // Pour n8n : la reponse finale, sur une seule ligne, comme `--output-format json`.
  process.stdout.write(JSON.stringify(resultat) + '\n');
  process.exit(code ?? 0);
}

// Limite d'usage atteinte : la place est rendue, tout le monde se met en pause jusqu'a la
// remise a zero, puis l'etape est rejouee (les agents reprennent ce qui existe deja).
for (let essai = 1; ; essai++) {
  await prendreUnePlace();
  journal(essai === 1 ? 'démarre' : 'redémarre son étape après la pause');
  const execution = await lancerClaude();
  const texte = String(execution.resultat?.result ?? '');
  // (une reponse « ok » valide n'est jamais une limite, meme si son texte contient le mot)
  if (essai <= 3 && execution.resultat && LIMITE.test(texte) && !/"statut"\s*:\s*"ok"/.test(texte)) {
    rendreLaPlace();
    const jusqua = heureDeRemiseAZero(texte);
    poserPauseAutomatique(jusqua, texte);
    journal(`⏸ limite d'usage Claude atteinte : pause automatique de tous les agents jusqu'à ${heureCourte(jusqua)}, puis l'étape reprendra`);
    continue;
  }
  terminer(execution);
}

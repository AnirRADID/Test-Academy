#!/usr/bin/env node
/**
 * lancer-agent.mjs — lance UN agent Claude pour n8n, en racontant au journal ce qu'il fait.
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
import { existsSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
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

/* ------------------------------------------- un seul agent a la fois */
// Deux agents en meme temps se marcheraient dessus (meme dossier test-results de
// Playwright, imports Squash melanges). Le premier arrive pose un verrou ; les suivants
// attendent leur tour. Un verrou laisse par un agent arrete brutalement est ignore.
const VERROU = join(RACINE, 'suivi-des-stories', '.agent-en-cours.json');
const vivant = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

async function prendreLeVerrou() {
  let annonce = false;
  for (;;) {
    try {
      writeFileSync(VERROU, JSON.stringify({ pid: process.pid, agent, story, depuis: new Date().toISOString() }), { flag: 'wx' });
      return;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      let occupant = null;
      try { occupant = JSON.parse(readFileSync(VERROU, 'utf8')); } catch { /* verrou en cours d'ecriture */ }
      if (occupant && !vivant(occupant.pid)) { try { unlinkSync(VERROU); } catch { /* deja retire */ } continue; }
      if (occupant && !annonce) {
        journal(`attend son tour : ${occupant.agent} travaille sur « ${occupant.story} »`);
        annonce = true;
      }
      await attendre(5000);
    }
  }
}
const rendreLeVerrou = () => {
  try { if (JSON.parse(readFileSync(VERROU, 'utf8')).pid === process.pid) unlinkSync(VERROU); } catch { /* rien a rendre */ }
};
process.on('exit', rendreLeVerrou);

await prendreLeVerrou();
journal('démarre');
const debut = Date.now();
const enfant = spawn(doublure ? process.execPath : programme, args, { cwd: RACINE, shell: doublure ? false : shell, stdio: ['pipe', 'pipe', 'inherit'] });
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

enfant.on('close', (code) => {
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
});

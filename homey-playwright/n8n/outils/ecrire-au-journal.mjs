#!/usr/bin/env node
/**
 * ecrire-au-journal.mjs — ajoute une ligne au journal des taches de l'equipe QA.
 *
 *   node n8n/outils/ecrire-au-journal.mjs "<story>" "<qui>" "<ce qui a ete fait>"
 *
 * Le journal est suivi-des-stories/journal-des-taches.md : toutes les stories, tous les
 * agents et n8n, dans l'ordre ou les choses se passent (les plus recentes en bas). Un
 * titre de jour est ajoute a chaque changement de date. Heure de Paris, toujours.
 *
 * Utilise par les boites « Journal » de n8n, et par lancer-agent.mjs pour les agents.
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const JOURNAL = process.env.JOURNAL_DES_TACHES || join(RACINE, 'suivi-des-stories', 'journal-des-taches.md');

const ENTETE = `# Journal des tâches de l'équipe QA

Tout ce que font n8n et les agents, toutes stories confondues, dans l'ordre où cela se
passe : **les plus récentes en bas**. Heures de Paris. Ce fichier s'écrit tout seul ; ouvert
dans VS Code, il se met à jour en direct.

| Qui | Rôle |
|---|---|
| n8n | le chef d'équipe : rondes Jira, étiquettes, validation, signalements |
| agent-analyste · agent-automaticien · agent-executant · agent-gestionnaire-anomalies · agent-rapporteur | les agents Claude |
`;

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

function maintenant() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date()).map(x => [x.type, x.value]));
  const jour = JOURS[new Date(`${p.year}-${p.month}-${p.day}T12:00:00Z`).getUTCDay()];
  return { titreDuJour: `## ${jour} ${p.day}/${p.month}/${p.year}`, heure: `${p.hour}:${p.minute}` };
}

// Une ligne de journal ne doit jamais casser la mise en page Markdown.
const nettoyer = (t) => String(t ?? '').replace(/\s+/g, ' ').replace(/\|/g, '/').trim();

export function ecrire(story, qui, quoi) {
  mkdirSync(dirname(JOURNAL), { recursive: true });
  if (!existsSync(JOURNAL)) writeFileSync(JOURNAL, ENTETE);
  const { titreDuJour, heure } = maintenant();
  const contenu = readFileSync(JOURNAL, 'utf8');
  const dernierJour = contenu.match(/^## .+$/gm)?.at(-1);
  let ajout = '';
  if (dernierJour !== titreDuJour) ajout += `\n${titreDuJour}\n\n`;
  ajout += `- **${heure}** · ${nettoyer(story) || '—'} · **${nettoyer(qui)}** · ${nettoyer(quoi)}\n`;
  appendFileSync(JOURNAL, ajout);
}

// Appel direct en ligne de commande (boites n8n).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [story, qui, ...quoi] = process.argv.slice(2);
  if (!qui) {
    console.log('Usage : ecrire-au-journal.mjs "<story>" "<qui>" "<ce qui a ete fait>"');
    process.exit(1);
  }
  ecrire(story, qui, quoi.join(' '));
  console.log('ajoute au journal');
}

#!/usr/bin/env node
/**
 * lancer-campagne.mjs — joue toute la campagne Playwright ET envoie les resultats a Squash.
 *
 *   node .claude/skills/competence-regles-qualite-homey/scripts/lancer-campagne.mjs <iteration_id>
 *
 * Le rapporteur Squash (reporters/squash-reporter.ts) ne lit le jeton que dans la variable
 * SQUASH_TOKEN : sans elle, il ne remonte rien (c'est voulu, pour que les essais de
 * l'automaticien ne polluent pas Squash). Ce script la fournit a partir de squash/.token,
 * sans que le jeton apparaisse jamais dans une ligne de commande.
 *
 * Jamais d'option --reporter : elle remplacerait le rapporteur Squash (voir conventions).
 * Code de sortie : celui de Playwright (1 s'il y a des echecs — ce n'est pas une panne).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

const [iterationId] = process.argv.slice(2);
if (!iterationId) {
  console.log('Usage : lancer-campagne.mjs <iteration_id>');
  process.exit(1);
}

let jeton = process.env.SQUASH_TOKEN;
if (!jeton) {
  const f = join(RACINE, 'squash', '.token');
  if (!existsSync(f)) {
    console.error("ECHEC — aucun jeton Squash : ni SQUASH_TOKEN, ni squash/.token.");
    process.exit(1);
  }
  jeton = readFileSync(f, 'utf8').trim();
}

const r = spawnSync('npx', ['playwright', 'test'], {
  cwd: RACINE,
  stdio: 'inherit',
  shell: process.platform === 'win32', // npx est un .cmd sous Windows
  env: { ...process.env, SQUASH_TOKEN: jeton, SQUASH_ITERATION_ID: String(iterationId) },
});
process.exit(r.status ?? 1);

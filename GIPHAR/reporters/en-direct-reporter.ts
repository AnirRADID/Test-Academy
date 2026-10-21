/**
 * en-direct-reporter.ts — raconte a la Tour de controle ce que Playwright est en train de jouer.
 *
 * Ecrit un fichier par execution dans suivi-des-stories/.executions/ (plusieurs agents peuvent
 * jouer des tests en meme temps), a chaque debut de test, de pas (test.step) et de fin de
 * test : la fenetre « navigateur en direct » de la Tour s'en sert pour savoir quels
 * navigateurs sont ouverts et sur quel port de debogage (PW_PORT_BASE + numero du worker,
 * voir launchOptions dans playwright.config.ts).
 *
 * N'envoie rien nulle part et ne change aucun resultat : il ne fait qu'ecrire ce fichier.
 */
import type { FullConfig, Reporter, Suite, TestCase, TestResult, TestStep, FullResult } from '@playwright/test/reporter';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const DOSSIER = process.env.EXECUTIONS_EN_DIRECT || join(process.cwd(), 'suivi-des-stories', '.executions');
const FICHIER = join(DOSSIER, `${Date.now()}-${process.pid}.json`);
const PORT_BASE = Number(process.env.PW_PORT_BASE ?? 9300);

type EnCours = { test: string; fichier: string; pas: string | null; numeroPas: number; depuis: string; port: number };

export default class EnDirectReporter implements Reporter {
  private etat = {
    enCours: true,
    // Une campagne (lancer-campagne.mjs fournit SQUASH_TOKEN) ou un essai de l'automaticien.
    origine: process.env.SQUASH_TOKEN ? 'campagne' : 'essai',
    story: process.env.STORY_EN_COURS || null,
    pid: process.pid,
    portBase: PORT_BASE,
    debut: new Date().toISOString(),
    fin: null as string | null,
    total: 0, reussis: 0, echoues: 0,
    workers: {} as Record<string, EnCours>,
    derniers: [] as { test: string; statut: string; duree: number }[],
  };

  private ecrire() {
    try {
      mkdirSync(dirname(FICHIER), { recursive: true });
      writeFileSync(FICHIER, JSON.stringify(this.etat));
    } catch { /* la Tour n'est qu'un spectateur : jamais d'erreur pour elle */ }
  }

  onBegin(_config: FullConfig, suite: Suite) {
    this.etat.total = suite.allTests().length;
    this.ecrire();
  }

  onTestBegin(test: TestCase, result: TestResult) {
    this.etat.workers[result.parallelIndex] = {
      test: test.title, fichier: relative(process.cwd(), test.location.file).replace(/\\/g, '/'),
      pas: null, numeroPas: 0, depuis: new Date().toISOString(), port: PORT_BASE + result.parallelIndex,
    };
    this.ecrire();
  }

  onStepBegin(_test: TestCase, result: TestResult, step: TestStep) {
    const w = this.etat.workers[result.parallelIndex];
    if (!w || step.category !== 'test.step' || step.parent) return; // seulement les pas Squash
    w.pas = step.title;
    w.numeroPas++;
    this.ecrire();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    delete this.etat.workers[result.parallelIndex];
    const ok = result.status === 'passed' || result.status === 'skipped';
    if (ok) this.etat.reussis++; else this.etat.echoues++;
    this.etat.derniers.unshift({ test: test.title, statut: result.status, duree: result.duration });
    this.etat.derniers = this.etat.derniers.slice(0, 15);
    this.ecrire();
  }

  onEnd(_result: FullResult) {
    this.etat.enCours = false;
    this.etat.workers = {};
    this.etat.fin = new Date().toISOString();
    this.ecrire();
  }
}

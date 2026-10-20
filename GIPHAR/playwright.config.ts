import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    // Jamais via --reporter en ligne de commande : ce drapeau remplace la liste ci-dessous
    // et l'import vers Squash n'a plus jamais lieu, sans le moindre message.
    ['./reporters/squash-reporter.ts'],
    // Raconte a la Tour de controle le test et le pas en cours (fenetre « Exécution »).
    ['./reporters/en-direct-reporter.ts'],
  ],
  use: {
    // Port de debogage du navigateur (9300 + numero du worker, sur ce PC seulement) : la Tour
    // de controle s'en sert pour montrer l'ecran en direct. Ne change rien aux tests.
    launchOptions: { args: [`--remote-debugging-port=${9300 + Number(process.env.TEST_PARALLEL_INDEX ?? 0)}`] },
    baseURL: 'http://livraison3.testacademy.fr',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});

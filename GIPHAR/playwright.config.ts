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
    // Port de debogage du navigateur, sur ce PC seulement : PW_PORT_BASE (fourni a chaque agent
    // par n8n/outils/lancer-agent.mjs, 10 ports par agent, a partir de 9300) + numero du worker.
    // La Tour de controle s'en sert pour montrer l'ecran en direct. Ne change rien aux tests.
    launchOptions: { args: [`--remote-debugging-port=${Number(process.env.PW_PORT_BASE ?? 9300) + Number(process.env.TEST_PARALLEL_INDEX ?? 0)}`] },
    baseURL: 'http://livraison3.testacademy.fr',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});

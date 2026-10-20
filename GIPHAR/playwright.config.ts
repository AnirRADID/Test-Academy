import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    // Jamais via --reporter en ligne de commande : ce drapeau remplace la liste ci-dessous
    // et l'import vers Squash n'a plus jamais lieu, sans le moindre message.
    ['./reporters/squash-reporter.ts'],
  ],
  use: {
    baseURL: 'http://livraison3.testacademy.fr',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});

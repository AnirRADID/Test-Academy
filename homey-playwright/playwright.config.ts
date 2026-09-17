import { defineConfig, devices } from '@playwright/test';

/**
 * Projet Playwright — fil rouge Homey (Test Academy, Partie B).
 *
 * Homey ne repond qu'en HTTP (https ne repond pas) : le baseURL est donc en http://.
 * Chaque test porte le tag de son cas de test Squash (@CT-06, @CT-08) : c'est ce tag
 * que le reporter Squash renvoie comme `reference` a l'import de resultats, et il doit
 * etre identique au champ `automated_test_reference` du cas dans Squash (leçon B6).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./reporters/squash-reporter.ts'],
  ],
  use: {
    baseURL: process.env.HOMEY_URL ?? 'http://livraison3.testacademy.fr',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});

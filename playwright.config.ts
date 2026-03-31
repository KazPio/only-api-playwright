import { defineConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', {open: 'never'}], ['list'],['junit', { outputFile: 'test-results/junit.xml' }]],
  use: {
    baseURL: 'https://dummyjson.com/',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api-testing',
      testDir: './tests/api-tests',
      dependencies: ['api-smoke-tests']
    },
    {
      name: 'api-smoke-tests',
      testDir: '.tests/api-test',
      testMatch: 'example*'
    },
    {
      name: 'ui-testing',
      testDir: './tests/ui-tests',
      use: {
        defaultBrowserType: 'chromium'
      },
      timeout: 3000
    }
  ],

});

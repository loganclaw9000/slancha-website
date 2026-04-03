// @ts-check
import { defineConfig, devices } from '@playwright/test';
try {
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });
} catch {
  // dotenv not installed, skip
}

const rawBaseURL = process.env.VITE_BASE_URL || 'http://localhost:4173';
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : rawBaseURL + '/';
const isExternal = baseURL.startsWith('https://');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    timeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual-regression',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'performance',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Only start local server when not testing an external URL
  ...(isExternal ? {} : {
    webServer: {
      command: 'npm run preview',
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  }),
});

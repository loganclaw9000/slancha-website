// @ts-check
import { test, expect } from '@playwright/test';

const BASE = 'https://loganclaw9000.github.io/slancha-website';

const PUBLIC_PAGES = [
  ['/', 'Homepage'],
  ['/pricing', 'Pricing'],
  ['/contact', 'Contact'],
  ['/faq', 'FAQ'],
  ['/terms', 'Terms'],
  ['/privacy', 'Privacy'],
  ['/docs', 'Docs'],
  ['/docs/getting-started', 'Docs - Getting Started'],
  ['/docs/api-reference', 'Docs - API Reference'],
  ['/docs/router', 'Docs - Router'],
  ['/docs/models', 'Docs - Models'],
  ['/docs/webhooks', 'Docs - Webhooks'],
  ['/docs/architecture', 'Docs - Architecture'],
  ['/blog', 'Blog'],
  ['/use-cases', 'Use Cases'],
  ['/case-studies', 'Case Studies'],
  ['/integrations', 'Integrations'],
  ['/playground', 'Playground'],
  ['/changelog', 'Changelog'],
  ['/status', 'Status'],
  ['/enterprise', 'Enterprise'],
  ['/roi-calculator', 'ROI Calculator'],
  ['/vs-competitors', 'Competitors'],
  ['/login', 'Login'],
  ['/signup', 'Signup'],
  ['/reset-password', 'Reset Password'],
  ['/developers', 'Developers'],
  ['/demo', 'Demo'],
  ['/sdk-reference', 'SDK Reference'],
  ['/glossary', 'Glossary'],
  ['/solutions/fintech', 'Solutions - Fintech'],
  ['/solutions/healthtech', 'Solutions - Healthtech'],
  ['/solutions/ecommerce', 'Solutions - Ecommerce'],
];

const DASHBOARD_PAGES = [
  ['/dashboard', 'Dashboard Overview'],
  ['/dashboard/keys', 'API Keys'],
  ['/dashboard/usage', 'Usage'],
  ['/dashboard/models', 'Models'],
  ['/dashboard/semantic-router', 'Semantic Router'],
  ['/dashboard/evaluations', 'Evaluations'],
  ['/dashboard/fine-tuning', 'Fine-Tuning'],
  ['/dashboard/deployments', 'Deployments'],
  ['/dashboard/datasets', 'Datasets'],
  ['/dashboard/logs', 'Request Logs'],
  ['/dashboard/team', 'Team'],
  ['/dashboard/billing', 'Billing'],
  ['/dashboard/webhooks', 'Webhooks'],
  ['/dashboard/settings', 'Settings'],
];

// --- Public pages ---
test.describe('Public Pages', () => {
  for (const [path, name] of PUBLIC_PAGES) {
    test(`${name} (${path})`, async ({ page }) => {
      const jsErrors = [];
      page.on('pageerror', e => jsErrors.push(e.message));

      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 });

      const body = await page.locator('body').innerText();
      expect(body.length, `${name} has content`).toBeGreaterThan(50);

      const title = await page.title();
      expect(title.length, `${name} has title`).toBeGreaterThan(0);

      const corsErrors = jsErrors.filter(e =>
        e.includes('CORS') || e.includes('Cross-Origin') || e.includes('placeholder.supabase')
      );
      expect(corsErrors, `${name} has no CORS errors`).toEqual([]);
    });
  }
});

// --- Auth flow ---
test.describe('Auth Flow', () => {
  test('login reaches dashboard', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(BASE + '/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'loganclaw9000@gmail.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard**', { timeout: 15000 });

    expect(page.url()).toContain('/dashboard');

    const corsErrors = errors.filter(e =>
      e.includes('CORS') || e.includes('Cross-Origin') || e.includes('placeholder.supabase')
    );
    expect(corsErrors).toEqual([]);
  });

  test('dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });
});

// --- Dashboard pages (authenticated) ---
test.describe('Dashboard Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'loganclaw9000@gmail.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
  });

  for (const [path, name] of DASHBOARD_PAGES) {
    test(`${name} (${path})`, async ({ page }) => {
      const jsErrors = [];
      page.on('pageerror', e => jsErrors.push(e.message));

      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 });

      expect(page.url(), `${name} stays on dashboard`).toContain('/dashboard');

      const body = await page.locator('body').innerText();
      expect(body.length, `${name} has content`).toBeGreaterThan(50);

      const corsErrors = jsErrors.filter(e =>
        e.includes('CORS') || e.includes('Cross-Origin') || e.includes('placeholder.supabase')
      );
      expect(corsErrors, `${name} has no CORS errors`).toEqual([]);
    });
  }
});

// --- Asset loading ---
test.describe('Assets', () => {
  test('no JS/CSS 404s on homepage', async ({ page }) => {
    const failed = [];
    page.on('response', resp => {
      if (resp.status() === 404 && (resp.url().endsWith('.js') || resp.url().endsWith('.css')))
        failed.push(resp.url());
    });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    expect(failed).toEqual([]);
  });

  test('no JS/CSS 404s on login', async ({ page }) => {
    const failed = [];
    page.on('response', resp => {
      if (resp.status() === 404 && (resp.url().endsWith('.js') || resp.url().endsWith('.css')))
        failed.push(resp.url());
    });
    await page.goto(BASE + '/login', { waitUntil: 'networkidle', timeout: 30000 });
    expect(failed).toEqual([]);
  });
});

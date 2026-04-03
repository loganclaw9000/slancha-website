const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';
const SCREENSHOTS_DIR = path.join(__dirname, 'qa-logs/screenshots');
const LOGS_DIR = path.join(__dirname, 'qa-logs');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const PUBLIC_PAGES = [
  '/', '/pricing', '/contact', '/faq', '/terms', '/privacy',
  '/docs', '/docs/getting-started', '/docs/api-reference', '/docs/router',
  '/docs/models', '/docs/webhooks', '/docs/architecture',
  '/blog', '/use-cases', '/case-studies', '/integrations', '/playground',
  '/changelog', '/status', '/enterprise', '/roi-calculator',
  '/vs-competitors', '/login', '/signup', '/reset-password',
  '/developers', '/demo', '/sdk-reference', '/glossary',
  '/solutions/fintech', '/solutions/healthtech', '/solutions/ecommerce',
  '/benchmarks'
];

const DASHBOARD_PAGES = [
  '/dashboard', '/dashboard/keys', '/dashboard/usage', '/dashboard/models',
  '/dashboard/router', '/dashboard/evals', '/dashboard/fine-tuning',
  '/dashboard/optimization', '/dashboard/deployments', '/dashboard/datasets',
  '/dashboard/logs', '/dashboard/team', '/dashboard/billing',
  '/dashboard/webhooks', '/dashboard/settings'
];

const LOGIN_EMAIL = 'loganclaw9000@gmail.com';
const LOGIN_PASSWORD = 'password';

async function login(page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"], input[name="email"]', LOGIN_EMAIL);
  await page.fill('input[type="password"], input[name="password"]', LOGIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
}

async function testPage(page, url, isAuthenticated = false) {
  const result = {
    name: url,
    status: 'pass',
    errors: [],
    networkFailures: [],
    warnings: []
  };

  const consoleErrors = [];
  const networkFailures = [];

  page.on('pageerror', err => consoleErrors.push(err.message));
  page.on('requestfailed', req => {
    const url = req.url();
    const failure = req.failure();
    networkFailures.push({ url, error: failure?.errorText || 'unknown' });
  });

  try {
    const fullUrl = `${BASE_URL}${url}`;
    const response = await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Check HTTP status
    // NOTE: GitHub Pages SPA serves all routes via 404.html with HTTP 404 status.
    // This is expected and NOT a failure. Only flag 5xx errors.
    const status = response?.status();
    result.httpStatus = status;
    if (status && status >= 500) {
      result.status = 'fail';
      result.errors.push(`HTTP ${status} (server error)`);
    }

    // Wait for SPA to render (longer wait for auth-dependent pages)
    await page.waitForTimeout(isAuthenticated ? 4000 : 2000);

    // Check body text length
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.length < 100) {
      result.status = 'fail';
      result.errors.push(`Body text too short: ${bodyText.length} chars`);
    }

    // Check title contains "Slancha"
    const title = await page.title();
    if (!title.includes('Slancha')) {
      result.warnings.push(`Title doesn't contain "Slancha": "${title}"`);
    }

    // Check for NotFound/404 content being rendered by the SPA router (real bug)
    const pageContent = await page.content();
    const notFoundIndicators = [
      'Page not found',
      'This page could not be found',
    ];
    for (const indicator of notFoundIndicators) {
      if (bodyText.includes(indicator) && !url.includes('404')) {
        result.warnings.push(`Possible 404 content: "${indicator}" found in body`);
      }
    }

    // Check for bad references
    if (pageContent.includes('placeholder.supabase.co')) {
      result.errors.push('References placeholder.supabase.co');
      result.status = 'fail';
    }
    if (pageContent.includes('localhost:')) {
      result.warnings.push('References localhost');
    }

    // Check console errors
    if (consoleErrors.length > 0) {
      // Filter out known non-critical errors
      const criticalErrors = consoleErrors.filter(e =>
        !e.includes('favicon') &&
        !e.includes('analytics') &&
        !e.includes('gtag')
      );
      if (criticalErrors.length > 0) {
        result.errors.push(...criticalErrors.map(e => `Console error: ${e.substring(0, 200)}`));
        result.status = 'fail';
      }
    }

    // Check network failures (asset 404s)
    const assetFailures = networkFailures.filter(f =>
      f.url.match(/\.(js|css|png|jpg|svg|woff|woff2)/) &&
      !f.url.includes('analytics') &&
      !f.url.includes('gtag')
    );
    if (assetFailures.length > 0) {
      result.errors.push(...assetFailures.map(f => `Asset failed: ${f.url} (${f.error})`));
      result.status = 'fail';
    }

    // Check for CORS errors in console
    const corsErrors = consoleErrors.filter(e => e.toLowerCase().includes('cors'));
    if (corsErrors.length > 0) {
      result.warnings.push(`CORS errors: ${corsErrors.join('; ')}`);
    }

    // Take screenshot on failure
    if (result.status === 'fail') {
      const screenshotName = url.replace(/\//g, '_').replace(/^_/, '') || 'home';
      const screenshotPath = path.join(SCREENSHOTS_DIR, `phase1_${screenshotName}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
    }

    result.title = title;
    result.bodyLength = bodyText.length;
    result.networkFailures = networkFailures;

  } catch (err) {
    result.status = 'fail';
    result.errors.push(`Navigation failed: ${err.message}`);
    try {
      const screenshotName = url.replace(/\//g, '_').replace(/^_/, '') || 'home';
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `phase1_${screenshotName}_error.png`) });
    } catch (_) {}
  }

  return result;
}

async function main() {
  console.log('Starting Phase 1: Page Load Smoke Test');
  console.log(`Testing ${PUBLIC_PAGES.length + DASHBOARD_PAGES.length} pages`);

  const browser = await chromium.launch({ headless: true });
  const tests = [];
  let pass = 0, fail = 0;

  // Test public pages
  console.log('\n--- Public Pages ---');
  for (const url of PUBLIC_PAGES) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const result = await testPage(page, url);
    tests.push(result);
    const icon = result.status === 'pass' ? '✓' : '✗';
    const warnings = result.warnings.length > 0 ? ` [${result.warnings.length} warnings]` : '';
    console.log(`${icon} ${url} (${result.bodyLength || 0} chars)${warnings}`);
    if (result.errors.length > 0) {
      result.errors.forEach(e => console.log(`  ERROR: ${e.substring(0, 150)}`));
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach(w => console.log(`  WARN: ${w.substring(0, 150)}`));
    }
    if (result.status === 'pass') pass++; else fail++;
    await context.close();
  }

  // Login and test dashboard pages
  console.log('\n--- Dashboard Pages (authenticated) ---');
  const dashContext = await browser.newContext();
  const dashPage = await dashContext.newPage();

  try {
    console.log('Logging in...');
    await login(dashPage);
    const currentUrl = dashPage.url();
    console.log(`After login, URL: ${currentUrl}`);

    if (!currentUrl.includes('/dashboard')) {
      console.log('WARNING: Login may not have succeeded');
    }

    for (const url of DASHBOARD_PAGES) {
      const context2 = await browser.newContext({ storageState: await dashContext.storageState() });
      const page2 = await context2.newPage();
      const result = await testPage(page2, url, true);
      tests.push(result);
      const icon = result.status === 'pass' ? '✓' : '✗';
      const warnings = result.warnings.length > 0 ? ` [${result.warnings.length} warnings]` : '';
      console.log(`${icon} ${url} (${result.bodyLength || 0} chars)${warnings}`);
      if (result.errors.length > 0) {
        result.errors.forEach(e => console.log(`  ERROR: ${e.substring(0, 150)}`));
      }
      if (result.warnings.length > 0) {
        result.warnings.forEach(w => console.log(`  WARN: ${w.substring(0, 150)}`));
      }
      if (result.status === 'pass') pass++; else fail++;
      await context2.close();
    }
  } catch (err) {
    console.error('Dashboard testing failed:', err.message);
    // Mark all dashboard pages as failed
    for (const url of DASHBOARD_PAGES) {
      tests.push({ name: url, status: 'fail', errors: [`Dashboard login failed: ${err.message}`] });
      fail++;
    }
  }
  await dashContext.close();

  await browser.close();

  const log = {
    phase: 1,
    description: 'Page Load Smoke Test',
    timestamp: new Date().toISOString(),
    tests,
    summary: { pass, fail, skip: 0 }
  };

  fs.writeFileSync(path.join(LOGS_DIR, 'phase1.json'), JSON.stringify(log, null, 2));
  console.log(`\n=== Phase 1 Complete: ${pass} passed, ${fail} failed ===`);
  console.log(`Log saved to qa-logs/phase1.json`);

  return log;
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

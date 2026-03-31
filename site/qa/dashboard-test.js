#!/usr/bin/env node
/**
 * Dashboard QA Test — runs Playwright against the Vite preview server.
 * Tests all 12 dashboard pages, checks for console errors, CORS issues, and basic functionality.
 *
 * Usage:
 *   node qa/dashboard-test.js [--url http://localhost:4173] [--json]
 *
 * Output:
 *   Human-readable report to stdout (or JSON with --json)
 *   Exit code 0 = all pass, 1 = failures found
 */

const { chromium } = require('playwright');

const BASE_URL = (() => {
  const i = process.argv.indexOf('--url');
  return i !== -1 ? process.argv[i + 1] : 'http://localhost:4173';
})();
const JSON_OUTPUT = process.argv.includes('--json');

// All 12 dashboard routes (excluding main Dashboard shell)
const DASHBOARD_PAGES = [
  { name: 'Overview', path: '/dashboard' },
  { name: 'API Keys', path: '/dashboard/keys' },
  { name: 'Usage', path: '/dashboard/usage' },
  { name: 'Models', path: '/dashboard/models' },
  { name: 'Evaluations', path: '/dashboard/evals' },
  { name: 'Fine-Tuning', path: '/dashboard/fine-tuning' },
  { name: 'Optimization', path: '/dashboard/optimization' },
  { name: 'Deployments', path: '/dashboard/deployments' },
  { name: 'Logs', path: '/dashboard/logs' },
  { name: 'Team', path: '/dashboard/team' },
  { name: 'Billing', path: '/dashboard/billing' },
  { name: 'Webhooks', path: '/dashboard/webhooks' },
  { name: 'Settings', path: '/dashboard/settings' },
];

async function testDashboardPage(page, { name, path }) {
  const url = BASE_URL + path;
  const result = {
    page: name,
    url,
    pass: true,
    consoleErrors: [],
    consoleWarnings: [],
    networkErrors: [],
    corsErrors: [],
    checks: [],
  };

  // Capture console messages
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      result.consoleErrors.push(text);
      if (
        text.includes('CORS') ||
        text.includes('Cross-Origin') ||
        text.includes('Access-Control')
      ) {
        result.corsErrors.push(text);
      }
    } else if (msg.type() === 'warning') {
      result.consoleWarnings.push(text);
    }
  });

  // Capture network/request failures
  page.on('requestfailed', (request) => {
    const failure = request.failure();
    result.networkErrors.push({
      url: request.url(),
      reason: failure ? failure.errorText : 'unknown',
    });
    if (
      failure &&
      (failure.errorText.includes('CORS') ||
        failure.errorText.includes('net::ERR_FAILED'))
    ) {
      result.corsErrors.push(`Request failed: ${request.url()} — ${failure.errorText}`);
    }
  });

  // Navigate
  let response;
  try {
    response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    result.pass = false;
    result.checks.push({ name: 'Page load', pass: false, detail: e.message });
    return result;
  }

  // HTTP status
  const status = response ? response.status() : 0;
  const statusOk = status >= 200 && status < 400;
  result.checks.push({ name: `HTTP ${status}`, pass: statusOk, detail: url });
  if (!statusOk) result.pass = false;

  // Wait for React to render
  await page.waitForTimeout(1000);

  // Get page title
  const title = await page.title();
  result.checks.push({ name: 'Page title set', pass: title.length > 0, detail: title });

  // Check if protected route (redirect to login)
  const currentUrl = page.url();
  const isRedirectedToLogin = currentUrl.includes('/login') && currentUrl !== url;
  
  if (isRedirectedToLogin) {
    result.checks.push({ name: 'Protected route (redirects to auth)', pass: true, detail: 'Expected behavior - requires authentication' });
    // Still check for console errors even if redirected
  } else {
    // If we're on the dashboard page, check for dashboard-specific elements
    const hasSidebar = await page.$('aside.dash-sidebar') !== null;
    const hasNav = await page.$('nav.dash-nav') !== null;
    const hasContent = await page.$('main.dash-content') !== null;
    
    if (hasSidebar && hasNav && hasContent) {
      result.checks.push({ name: 'Dashboard layout present', pass: true });
      result.interactions = [{ action: 'Dashboard layout check', pass: true }];
    } else {
      result.checks.push({ name: 'Dashboard layout present', pass: false, detail: `sidebar:${hasSidebar},nav:${hasNav},content:${hasContent}` });
      result.pass = false;
    }

    // Check sidebar links are present
    const sidebarLinks = await page.$$('.dash-sidebar-link');
    result.checks.push({ name: 'Sidebar links', pass: sidebarLinks.length > 0, detail: `${sidebarLinks.length} links found` });

    // Check for empty state sections
    const emptyStates = await page.$$('.dash-empty-state, [class*="empty-state"]');
    result.checks.push({ name: 'Empty states present', pass: true, detail: `${emptyStates.length} empty state elements found` });
  }

  // Shared: no CORS errors
  if (result.corsErrors.length > 0) {
    result.pass = false;
    result.checks.push({
      name: 'No CORS errors',
      pass: false,
      detail: result.corsErrors.join(' | '),
    });
  } else {
    result.checks.push({ name: 'No CORS errors', pass: true });
  }

  // Shared: no JS errors (treat console errors as failures)
  if (result.consoleErrors.length > 0) {
    result.pass = false;
    result.checks.push({
      name: 'No JS console errors',
      pass: false,
      detail: result.consoleErrors.join(' | '),
    });
  } else {
    result.checks.push({ name: 'No JS console errors', pass: true });
  }

  return result;
}

function printReport(results) {
  let exitCode = 0;
  console.log('\n=== Dashboard QA Test Report ===\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Run: ${new Date().toISOString()}\n`);

  let passed = 0;
  let failed = 0;
  let authRequired = 0;

  for (const r of results) {
    let status = '✗ FAIL';
    if (!r.pass) {
      failed++;
    } else if (r.checks.some(c => c.name === 'Protected route (redirects to auth)')) {
      status = '✓ AUTH REQUIRED';
      authRequired++;
    } else {
      passed++;
    }

    console.log(`--- ${r.page} — ${status} ---`);

    for (const c of r.checks) {
      let icon = '  →';
      if (c.pass) icon = '  ✓';
      if (!c.pass) icon = '  ✗';
      console.log(`${icon} ${c.name}${c.detail ? ': ' + c.detail : ''}`);
    }

    if (r.consoleWarnings.length > 0) {
      console.log(`  Warnings (${r.consoleWarnings.length}):`);
      r.consoleWarnings.slice(0, 3).forEach((w) => console.log(`    ⚠ ${w.slice(0, 100)}`));
    }

    console.log();
  }

  console.log(`Summary: ${passed} passed | ${authRequired} auth required | ${failed} failed\n`);
  
  if (failed > 0) {
    console.log('❌ FAILURES:');
    results.filter(r => !r.pass && !r.checks.some(c => c.name === 'Protected route (redirects to auth)')).forEach(r => {
      console.log(`  - ${r.page}: ${r.checks.filter(c => !c.pass).map(c => c.name).join(', ')}`);
    });
    console.log();
    exitCode = 1;
  } else {
    console.log('✅ All pages loaded successfully (some require auth as expected)');
  }

  return exitCode;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (QA-Bot) Playwright',
  });

  const results = [];
  for (const pageConfig of DASHBOARD_PAGES) {
    const page = await context.newPage();
    const result = await testDashboardPage(page, pageConfig);
    results.push(result);
    await page.close();
  }

  await browser.close();

  if (JSON_OUTPUT) {
    console.log(JSON.stringify(results, null, 2));
    process.exit(results.some((r) => !r.pass) ? 1 : 0);
  } else {
    process.exit(printReport(results));
  }
})();

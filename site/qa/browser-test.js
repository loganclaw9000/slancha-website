#!/usr/bin/env node
/**
 * QA Browser Test — runs Playwright against the Vite preview server.
 * Captures console output, errors, CORS failures, and verifies interactions.
 *
 * Usage:
 *   node qa/browser-test.js [--url http://localhost:4173] [--json]
 *
 * Output:
 *   Human-readable report to stdout (or JSON with --json)
 *   Exit code 0 = all pass, 1 = failures found
 */

import { chromium } from 'playwright';

const BASE_URL = (() => {
  const i = process.argv.indexOf('--url');
  return i !== -1 ? process.argv[i + 1] : 'http://localhost:4173';
})();
const JSON_OUTPUT = process.argv.includes('--json');

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Contact', path: '/contact' },
];

async function testPage(page, { name, path }) {
  const url = BASE_URL + path;
  const result = {
    page: name,
    url,
    pass: true,
    consoleErrors: [],
    consoleWarnings: [],
    networkErrors: [],
    corsErrors: [],
    interactions: [],
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

  // --- Page-specific checks ---
  if (path === '/') {
    await checkHomepage(page, result);
  } else if (path === '/contact') {
    await checkContact(page, result);
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

async function checkHomepage(page, result) {
  // Sections present
  const sections = [
    { name: 'Nav', selector: 'nav' },
    { name: 'Hero', selector: 'section.hero, [class*="hero"], #hero' },
    { name: 'HowItWorks', selector: '[class*="how-it-works"], [class*="HowItWorks"]' },
    { name: 'TierCards', selector: '[class*="tier"], [class*="Tier"], [class*="pricing"]' },
    { name: 'TechStack', selector: '[class*="tech"], [class*="Tech"]' },
    { name: 'PilotCTA', selector: '[class*="pilot"], [class*="Pilot"], [class*="cta"]' },
    { name: 'Footer', selector: 'footer' },
  ];

  for (const s of sections) {
    const el = await page.$(s.selector);
    const pass = el !== null;
    if (!pass) result.pass = false;
    result.checks.push({ name: `Section: ${s.name}`, pass, detail: s.selector });
  }

  // Nav links are clickable
  const navLinks = await page.$$('nav a');
  result.interactions.push({ action: 'Count nav links', value: navLinks.length });

  // Scroll to bottom (triggers scroll-reveal)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  result.interactions.push({ action: 'Scroll to bottom', pass: true });

  // Page title not empty
  const title = await page.title();
  const titleOk = title.length > 0 && !title.toLowerCase().includes('vite app');
  result.checks.push({
    name: 'Page title set',
    pass: titleOk,
    detail: title,
  });
  if (!titleOk) result.pass = false;
}

async function checkContact(page, result) {
  // Form fields present
  const fields = [
    { name: 'Name field', selector: 'input[name="name"], input[placeholder*="name" i]' },
    { name: 'Email field', selector: 'input[type="email"], input[name="email"]' },
    { name: 'Company field', selector: 'input[name="company"], input[placeholder*="company" i]' },
    { name: 'Message field', selector: 'textarea' },
    { name: 'Submit button', selector: 'button[type="submit"], input[type="submit"]' },
  ];

  for (const f of fields) {
    const el = await page.$(f.selector);
    const pass = el !== null;
    if (!pass) result.pass = false;
    result.checks.push({ name: f.name, pass, detail: f.selector });
  }

  // Fill and submit the form (check for JS errors on submit)
  try {
    const nameField = await page.$('input[name="name"], input[placeholder*="name" i]');
    const emailField = await page.$('input[type="email"], input[name="email"]');
    const companyField = await page.$('input[name="company"], input[placeholder*="company" i]');
    const messageField = await page.$('textarea');

    if (nameField) await nameField.fill('QA Test User');
    if (emailField) await emailField.fill('qa@example.com');
    if (companyField) await companyField.fill('QA Corp');
    if (messageField) await messageField.fill('This is an automated QA test submission.');

    result.interactions.push({ action: 'Fill contact form', pass: true });

    // Capture errors during submit
    const errorsBefore = result.consoleErrors.length;
    const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(1500);
    }
    const newErrors = result.consoleErrors.length - errorsBefore;
    result.interactions.push({
      action: 'Submit contact form',
      pass: newErrors === 0,
      detail: newErrors > 0 ? `${newErrors} new console error(s) on submit` : 'no new errors',
    });
  } catch (e) {
    result.interactions.push({ action: 'Form interaction', pass: false, detail: e.message });
    result.pass = false;
  }
}

function printReport(results) {
  let exitCode = 0;
  console.log('\n=== QA Browser Test Report ===\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Run: ${new Date().toISOString()}\n`);

  for (const r of results) {
    const status = r.pass ? '✓ PASS' : '✗ FAIL';
    console.log(`--- ${r.page} (${r.url}) — ${status} ---`);

    for (const c of r.checks) {
      const icon = c.pass ? '  ✓' : '  ✗';
      console.log(`${icon} ${c.name}${c.detail ? ': ' + c.detail : ''}`);
    }

    if (r.interactions.length > 0) {
      console.log('  Interactions:');
      for (const i of r.interactions) {
        const icon = i.pass === false ? '  ✗' : '  →';
        console.log(`  ${icon} ${i.action}${i.value !== undefined ? ': ' + i.value : ''}${i.detail ? ' — ' + i.detail : ''}`);
      }
    }

    if (r.consoleWarnings.length > 0) {
      console.log(`  Warnings (${r.consoleWarnings.length}):`);
      r.consoleWarnings.slice(0, 5).forEach((w) => console.log(`    ⚠ ${w.slice(0, 120)}`));
    }

    if (!r.pass) exitCode = 1;
    console.log();
  }

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  console.log(`Summary: ${passed}/${total} pages passed\n`);
  return exitCode;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (QA-Bot) Playwright',
  });

  const results = [];
  for (const pageConfig of PAGES) {
    const page = await context.newPage();
    const result = await testPage(page, pageConfig);
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

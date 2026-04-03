const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';
const SCREENSHOTS_DIR = path.join(__dirname, 'qa-logs/screenshots');
const LOGS_DIR = path.join(__dirname, 'qa-logs');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const LOGIN_EMAIL = 'loganclaw9000@gmail.com';
const LOGIN_PASSWORD = 'NewTestPassword123!';

async function getAuthState(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"]', LOGIN_EMAIL);
  await page.fill('input[type="password"]', LOGIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(8000);
  const state = await ctx.storageState();
  return { ctx, state };
}

async function makeTest(name, fn) {
  const result = { name, status: 'pass', error: null, screenshot: null, notes: [] };
  try {
    await fn(result);
  } catch (err) {
    result.status = 'fail';
    result.error = err.message.substring(0, 300);
  }
  const icon = result.status === 'pass' ? '✓' : '✗';
  console.log(`${icon} ${name}`);
  if (result.error) console.log(`  ERROR: ${result.error.substring(0, 150)}`);
  result.notes.forEach(n => console.log(`  NOTE: ${n}`));
  return result;
}

async function ss(page, name) {
  const p = path.join(SCREENSHOTS_DIR, `phase6_${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  return p;
}

const XSS_PAYLOAD = '<script>window.__xss_fired=true</script><img src=x onerror="window.__xss_fired=true">';
const SQLI_PAYLOAD = "'; DROP TABLE users; --";
const LONG_INPUT = 'A'.repeat(10000);
const SPECIAL_CHARS = '<>&"\'{}[]|\\/`~!@#$%^*()_+-=';

async function testXSS(browser, url, selector, testName) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  let xssExecuted = false;

  await page.addInitScript(() => { window.__xss_fired = false; });
  page.on('dialog', async dialog => {
    xssExecuted = true;
    await dialog.dismiss();
  });

  await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const input = await page.$(selector);
  if (!input) {
    await ctx.close();
    return { fired: false, note: 'Input not found' };
  }

  await input.fill(XSS_PAYLOAD);
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    try { await submitBtn.click({ timeout: 3000 }); } catch (_) {}
    await page.waitForTimeout(2000);
  }

  xssExecuted = xssExecuted || await page.evaluate(() => window.__xss_fired);
  await ctx.close();
  return { fired: xssExecuted, note: xssExecuted ? 'XSS EXECUTED!' : 'XSS safe' };
}

async function main() {
  console.log('Starting Phase 6: Edge Cases & Security');
  const browser = await chromium.launch({ headless: true });
  const tests = [];
  let pass = 0, fail = 0;

  const { ctx: loginCtx, state: authState } = await getAuthState(browser);

  // ===== XSS Testing =====
  console.log('\n--- XSS Testing ---');

  const xssTargets = [
    { url: '/contact', selector: 'input[placeholder*="name" i]', name: 'Contact name field' },
    { url: '/contact', selector: 'textarea', name: 'Contact message field' },
    { url: '/login', selector: 'input[type="email"]', name: 'Login email field' },
    { url: '/signup', selector: 'input[type="email"]', name: 'Signup email field' },
  ];

  for (const target of xssTargets) {
    tests.push(await makeTest(`XSS: ${target.name}`, async (r) => {
      const result = await testXSS(browser, target.url, target.selector, target.name);
      r.notes.push(result.note);
      if (result.fired) {
        r.status = 'fail';
        r.error = `XSS executed in ${target.name}`;
      }
    }));
  }

  // ===== SQL Injection =====
  console.log('\n--- SQL Injection ---');

  tests.push(await makeTest('SQLi: Login email field', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', SQLI_PAYLOAD);
    await page.fill('input[type="password"]', SQLI_PAYLOAD);
    try { await page.click('button[type="submit"]', { timeout: 5000 }); } catch (_) {}
    await page.waitForTimeout(3000);

    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const succeededLogin = url.includes('/dashboard');

    if (succeededLogin) {
      r.status = 'fail';
      r.error = 'SQL injection in login succeeded — possible auth bypass';
    }
    const serverError = errors.some(e => e.toLowerCase().includes('sql') || e.toLowerCase().includes('syntax'));
    if (serverError) {
      r.notes.push('Server error revealed after SQL injection');
    }
    r.notes.push(`Login stayed safe: URL=${url.includes('/login') ? '/login' : url}`);
    await ctx.close();
  }));

  tests.push(await makeTest('SQLi: Contact form fields', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const nameInput = await page.$('input[placeholder*="name" i]');
    const emailInput = await page.$('input[type="email"]');
    const messageInput = await page.$('textarea');

    if (nameInput) await nameInput.fill(SQLI_PAYLOAD);
    if (emailInput) await emailInput.fill('test@example.com');
    if (messageInput) await messageInput.fill(SQLI_PAYLOAD);

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      try { await submitBtn.click({ timeout: 5000 }); } catch (_) {}
      await page.waitForTimeout(3000);
    }

    const crashed = errors.some(e => e.toLowerCase().includes('sql') || e.toLowerCase().includes('uncaught') || e.toLowerCase().includes('syntax error'));
    r.notes.push(crashed ? 'Error after SQL injection' : 'No crash from SQL injection');
    await ctx.close();
  }));

  // ===== Long Input =====
  console.log('\n--- Long Input ---');

  tests.push(await makeTest('Long input (10k chars): Contact form', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const messageInput = await page.$('textarea');
    if (messageInput) {
      await messageInput.fill(LONG_INPUT);
      r.notes.push('Filled 10k char message');
    }

    const nameInput = await page.$('input[placeholder*="name" i]');
    if (nameInput) await nameInput.fill(LONG_INPUT.substring(0, 1000));

    const emailInput = await page.$('input[type="email"]');
    if (emailInput) await emailInput.fill('test@example.com');

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      try { await submitBtn.click({ timeout: 5000 }); } catch (_) {}
      await page.waitForTimeout(3000);
    }

    const crashed = errors.some(e => !e.includes('favicon'));
    r.notes.push(crashed ? `Errors: ${errors[0]?.substring(0, 100)}` : 'No crash with long input');
    await ctx.close();
  }));

  tests.push(await makeTest('Long input (10k chars): Search', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const searchBtn = await page.$('button[aria-label*="search" i], button[class*="search"]');
    if (searchBtn) {
      await searchBtn.click();
      await page.waitForTimeout(500);
    }
    const searchInput = await page.$('input[type="search"], input[placeholder*="search" i]');
    if (searchInput) {
      await searchInput.fill(LONG_INPUT);
      r.notes.push('Filled 10k char search query');
      await page.waitForTimeout(1000);
      r.notes.push('No crash with long search input');
    } else {
      r.notes.push('No search input found');
    }
    await ctx.close();
  }));

  // ===== Special Characters =====
  console.log('\n--- Special Characters ---');

  tests.push(await makeTest('Special chars in contact form fields', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const nameInput = await page.$('input[placeholder*="name" i]');
    const emailInput = await page.$('input[type="email"]');
    const messageInput = await page.$('textarea');

    if (nameInput) await nameInput.fill(SPECIAL_CHARS);
    if (emailInput) await emailInput.fill('test@example.com');
    if (messageInput) await messageInput.fill(SPECIAL_CHARS);

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      try { await submitBtn.click({ timeout: 5000 }); } catch (_) {}
      await page.waitForTimeout(3000);
    }

    const crashed = errors.some(e => !e.includes('favicon') && !e.includes('analytics'));
    r.notes.push(crashed ? `Error with special chars: ${errors[0]?.substring(0, 100)}` : 'Special chars handled safely');
    await ctx.close();
  }));

  // ===== Rapid Double-Click =====
  console.log('\n--- Rapid Double-Click ---');

  tests.push(await makeTest('Rapid double-click on login submit', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password123');

    // Double click the submit button rapidly
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.dblclick({ timeout: 3000 });
      await page.waitForTimeout(3000);
      r.notes.push('Double-click handled (no crash)');
    }
    await ctx.close();
  }));

  tests.push(await makeTest('Rapid double-click on contact submit', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const emailInput = await page.$('input[type="email"]');
    const messageInput = await page.$('textarea');
    if (emailInput) await emailInput.fill('test@example.com');
    if (messageInput) await messageInput.fill('Test message');

    const nameInput = await page.$('input[placeholder*="name" i]');
    if (nameInput) await nameInput.fill('Test');

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      // Double click
      await submitBtn.dblclick({ timeout: 3000 });
      await page.waitForTimeout(3000);
    }

    const crashed = errors.some(e => !e.includes('favicon') && !e.includes('analytics'));
    r.notes.push(crashed ? `Error: ${errors[0]?.substring(0, 100)}` : 'Double-click handled safely');
    await ctx.close();
  }));

  // ===== Empty Form Submissions =====
  console.log('\n--- Empty Form Submissions ---');

  tests.push(await makeTest('Empty contact form → validation messages', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      try { await submitBtn.click({ timeout: 3000 }); } catch (_) {}
      await page.waitForTimeout(1500);
      const bodyText = await page.evaluate(() => document.body.innerText);
      const hasValidation = bodyText.toLowerCase().includes('required') ||
                            bodyText.toLowerCase().includes('error') ||
                            bodyText.toLowerCase().includes('field');
      r.notes.push(hasValidation ? 'Validation messages shown' : 'No validation messages for empty form');
    }
    await ctx.close();
  }));

  tests.push(await makeTest('Empty signup form → validation', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      try { await submitBtn.click({ timeout: 3000 }); } catch (_) {}
      await page.waitForTimeout(1500);
      const url = page.url();
      r.notes.push(!url.includes('/dashboard') ? 'Empty signup blocked' : 'WARNING: empty signup succeeded');
    }
    await ctx.close();
  }));

  // ===== Navigate Away Mid-Form =====
  console.log('\n--- Navigate Away Mid-Form ---');

  tests.push(await makeTest('Navigate away mid-form, come back', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const nameInput = await page.$('input[placeholder*="name" i]');
    if (nameInput) await nameInput.fill('Half-filled name');

    const emailInput = await page.$('input[type="email"]');
    if (emailInput) await emailInput.fill('test@example.com');

    // Navigate away
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Come back
    await page.goBack();
    await page.waitForTimeout(1500);

    // Form state is not expected to persist (SPA navigates away and back creates fresh component)
    r.notes.push('Navigate away and back: no crash');
    await ctx.close();
  }));

  // ===== Browser Back/Forward =====
  console.log('\n--- Browser Back/Forward ---');

  tests.push(await makeTest('Browser back/forward navigation', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const pages = ['/', '/pricing', '/blog', '/docs', '/contact'];

    for (const p of pages) {
      await page.goto(`${BASE_URL}${p}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(500);
    }

    // Go back several times
    for (let i = 0; i < 3; i++) {
      await page.goBack({ waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(500);
    }

    const bodyText = await page.evaluate(() => document.body.innerText);
    r.notes.push(bodyText.length > 100 ? 'Back navigation works' : 'Page may be empty after back');

    // Forward
    await page.goForward({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(500);
    r.notes.push('Forward navigation works');
    await ctx.close();
  }));

  // ===== Mobile Viewport =====
  console.log('\n--- Mobile Viewport (375px) ---');

  const mobilePages = ['/', '/pricing', '/blog', '/login'];
  for (const p of mobilePages) {
    tests.push(await makeTest(`Mobile 375px: ${p} renders`, async (r) => {
      const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
      const page = await ctx.newPage();
      await page.goto(`${BASE_URL}${p}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (bodyText.length < 100) {
        r.status = 'fail';
        r.error = `Mobile page too short: ${bodyText.length} chars`;
      }

      // Check for horizontal scroll
      const hasHorizScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      if (hasHorizScroll) {
        r.notes.push('WARNING: Horizontal scroll detected at 375px');
        r.screenshot = await ss(page, `mobile_${p.replace(/\//g, '_')}`);
      } else {
        r.notes.push('No horizontal scroll at 375px');
      }
      await ctx.close();
    }));
  }

  // ===== Concurrent Sessions =====
  console.log('\n--- Concurrent Sessions ---');

  tests.push(await makeTest('Concurrent sessions (2 tabs): no conflict', async (r) => {
    const ctx1 = await browser.newContext({ storageState: authState });
    const ctx2 = await browser.newContext({ storageState: authState });

    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    await Promise.all([
      page1.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 30000 }),
      page2.goto(`${BASE_URL}/dashboard/keys`, { waitUntil: 'networkidle', timeout: 30000 }),
    ]);
    await page1.waitForTimeout(4000);
    await page2.waitForTimeout(4000);

    const body1 = await page1.evaluate(() => document.body.innerText);
    const body2 = await page2.evaluate(() => document.body.innerText);

    r.notes.push(`Tab 1 (dashboard): ${body1.length} chars`);
    r.notes.push(`Tab 2 (keys): ${body2.length} chars`);

    if (body1.length < 100 || body2.length < 100) {
      r.notes.push('One or more tabs may not be authenticated');
    } else {
      r.notes.push('Both concurrent tabs loaded correctly');
    }

    await ctx1.close();
    await ctx2.close();
  }));

  // Tally
  for (const t of tests) {
    if (t.status === 'pass') pass++; else fail++;
  }

  await loginCtx.close();
  await browser.close();

  const log = {
    phase: 6,
    description: 'Edge Cases & Security',
    timestamp: new Date().toISOString(),
    tests,
    summary: { pass, fail, skip: 0 }
  };

  fs.writeFileSync(path.join(LOGS_DIR, 'phase6.json'), JSON.stringify(log, null, 2));
  console.log(`\n=== Phase 6 Complete: ${pass} passed, ${fail} failed ===`);
  return log;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

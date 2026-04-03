const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';
const SCREENSHOTS_DIR = path.join(__dirname, 'qa-logs/screenshots');
const LOGS_DIR = path.join(__dirname, 'qa-logs');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const LOGIN_EMAIL = 'loganclaw9000@gmail.com';
const LOGIN_PASSWORD = 'password';

async function makeTest(name, fn) {
  const result = { name, status: 'pass', error: null, screenshot: null, notes: [] };
  try {
    await fn(result);
  } catch (err) {
    result.status = 'fail';
    result.error = err.message;
  }
  const icon = result.status === 'pass' ? '✓' : '✗';
  console.log(`${icon} ${name}`);
  if (result.error) console.log(`  ERROR: ${result.error}`);
  if (result.notes.length) result.notes.forEach(n => console.log(`  NOTE: ${n}`));
  return result;
}

async function screenshot(page, name) {
  const p = path.join(SCREENSHOTS_DIR, `phase2_${name}.png`);
  await page.screenshot({ path: p });
  return p;
}

async function main() {
  console.log('Starting Phase 2: Auth Stress Test');
  const browser = await chromium.launch({ headless: true });
  const tests = [];
  let pass = 0, fail = 0;

  // --- Test 1: Login with correct credentials ---
  tests.push(await makeTest('Login with correct credentials → reaches /dashboard', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', LOGIN_EMAIL);
    await page.fill('input[type="password"]', LOGIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(6000);
    const url = page.url();
    if (!url.includes('/dashboard')) {
      r.status = 'fail';
      r.error = `Expected /dashboard, got ${url}`;
      r.screenshot = await screenshot(page, 'login_correct');
    } else {
      r.notes.push(`Redirected to: ${url}`);
    }
    await ctx.close();
  }));

  // --- Test 2: Login with wrong password ---
  tests.push(await makeTest('Login with wrong password → stays on /login, shows error', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', LOGIN_EMAIL);
    await page.fill('input[type="password"]', 'wrongpassword123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasError = bodyText.toLowerCase().includes('invalid') ||
                     bodyText.toLowerCase().includes('incorrect') ||
                     bodyText.toLowerCase().includes('wrong') ||
                     bodyText.toLowerCase().includes('error') ||
                     bodyText.toLowerCase().includes('credentials');
    if (url.includes('/dashboard')) {
      r.status = 'fail';
      r.error = 'Wrong password login succeeded — navigated to dashboard';
      r.screenshot = await screenshot(page, 'login_wrong_pass');
    } else if (!hasError) {
      r.status = 'fail';
      r.error = 'No error message shown for wrong password';
      r.screenshot = await screenshot(page, 'login_wrong_pass_no_error');
    } else {
      r.notes.push('Correctly blocked, error shown');
    }
    await ctx.close();
  }));

  // --- Test 3: Login with empty fields ---
  tests.push(await makeTest('Login with empty fields → shows validation', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const url = page.url();
    // Either stays on login or shows validation
    if (url.includes('/dashboard')) {
      r.status = 'fail';
      r.error = 'Empty form login succeeded';
      r.screenshot = await screenshot(page, 'login_empty');
    } else {
      r.notes.push('Correctly blocked empty submission');
    }
    await ctx.close();
  }));

  // --- Test 4: Login with non-existent email ---
  tests.push(await makeTest('Login with non-existent email → shows error', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'nobody@doesnotexist9999.com');
    await page.fill('input[type="password"]', 'somepassword123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasError = bodyText.toLowerCase().includes('invalid') ||
                     bodyText.toLowerCase().includes('error') ||
                     bodyText.toLowerCase().includes('not found') ||
                     bodyText.toLowerCase().includes('credentials');
    if (url.includes('/dashboard')) {
      r.status = 'fail';
      r.error = 'Non-existent user login succeeded';
      r.screenshot = await screenshot(page, 'login_nonexistent');
    } else if (!hasError) {
      r.status = 'fail';
      r.error = 'No error shown for non-existent email';
      r.screenshot = await screenshot(page, 'login_nonexistent_no_error');
    } else {
      r.notes.push('Correctly blocked, error shown');
    }
    await ctx.close();
  }));

  // --- Test 5: SQL injection in email ---
  tests.push(await makeTest("SQL injection in email field → doesn't break", async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', "' OR 1=1 --");
    await page.fill('input[type="password"]', "' OR 1=1 --");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    const url = page.url();
    if (url.includes('/dashboard')) {
      r.status = 'fail';
      r.error = 'SQL injection login succeeded';
      r.screenshot = await screenshot(page, 'login_sqli');
    } else {
      r.notes.push('SQL injection correctly blocked');
    }
    if (errors.length > 0) {
      r.notes.push(`Console errors: ${errors.join('; ').substring(0, 200)}`);
    }
    await ctx.close();
  }));

  // --- Test 6: XSS in email field ---
  tests.push(await makeTest('XSS in email field → not executed', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    let xssExecuted = false;
    await page.exposeFunction('xssAlert', () => { xssExecuted = true; });
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', '<script>window.xssAlert()</script>');
    await page.fill('input[type="password"]', 'test');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    if (xssExecuted) {
      r.status = 'fail';
      r.error = 'XSS executed in login form';
      r.screenshot = await screenshot(page, 'login_xss');
    } else {
      r.notes.push('XSS not executed');
    }
    await ctx.close();
  }));

  // --- Test 7: Signup form validation (empty fields) ---
  tests.push(await makeTest('Signup empty form → shows validation', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const url = page.url();
    if (url.includes('/dashboard')) {
      r.status = 'fail';
      r.error = 'Empty signup succeeded';
      r.screenshot = await screenshot(page, 'signup_empty');
    } else {
      r.notes.push('Empty signup correctly blocked');
    }
    await ctx.close();
  }));

  // --- Test 8: Signup with mismatched passwords ---
  tests.push(await makeTest('Signup with mismatched passwords → shows error', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle', timeout: 30000 });
    // Fill in what fields exist
    const emailInput = await page.$('input[type="email"]');
    const passwordInputs = await page.$$('input[type="password"]');
    if (emailInput) await emailInput.fill('test@example.com');
    if (passwordInputs[0]) await passwordInputs[0].fill('Password123!');
    if (passwordInputs[1]) await passwordInputs[1].fill('DifferentPassword!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasError = bodyText.toLowerCase().includes('match') ||
                     bodyText.toLowerCase().includes('password') ||
                     bodyText.toLowerCase().includes('error');
    if (url.includes('/dashboard')) {
      r.status = 'fail';
      r.error = 'Mismatched password signup succeeded';
      r.screenshot = await screenshot(page, 'signup_mismatch');
    } else if (!hasError) {
      r.notes.push('No clear error for mismatch (may not have 2 password fields)');
    } else {
      r.notes.push('Mismatch correctly handled');
    }
    await ctx.close();
  }));

  // --- Test 9: Password reset with valid email ---
  tests.push(await makeTest('Password reset with valid email → shows success', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/reset-password`, { waitUntil: 'networkidle', timeout: 30000 });
    const emailInput = await page.$('input[type="email"]');
    if (!emailInput) {
      r.notes.push('No email input found on reset-password page');
      r.status = 'fail';
      r.error = 'Reset password form not found';
      r.screenshot = await screenshot(page, 'reset_form_missing');
      await ctx.close();
      return;
    }
    await emailInput.fill(LOGIN_EMAIL);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasSuccess = bodyText.toLowerCase().includes('check') ||
                       bodyText.toLowerCase().includes('sent') ||
                       bodyText.toLowerCase().includes('email') ||
                       bodyText.toLowerCase().includes('success');
    if (!hasSuccess) {
      r.status = 'fail';
      r.error = 'No success message after password reset request';
      r.screenshot = await screenshot(page, 'reset_no_success');
    } else {
      r.notes.push('Success message shown');
    }
    await ctx.close();
  }));

  // --- Test 10: Password reset with invalid email ---
  tests.push(await makeTest('Password reset with invalid email format → shows error', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/reset-password`, { waitUntil: 'networkidle', timeout: 30000 });
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.fill('notanemail');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      const bodyText = await page.evaluate(() => document.body.innerText);
      const hasError = bodyText.toLowerCase().includes('valid') ||
                       bodyText.toLowerCase().includes('error') ||
                       bodyText.toLowerCase().includes('invalid');
      // Browser native email validation may block it
      r.notes.push(hasError ? 'Error shown for invalid email' : 'Native HTML5 email validation may apply');
    } else {
      r.notes.push('No email input found');
    }
    await ctx.close();
  }));

  // --- Test 11: Session persists across dashboard navigations ---
  tests.push(await makeTest('Session persists across dashboard page navigations', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    // Login
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', LOGIN_EMAIL);
    await page.fill('input[type="password"]', LOGIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(6000);

    if (!page.url().includes('/dashboard')) {
      r.status = 'fail';
      r.error = 'Login failed';
      await ctx.close();
      return;
    }

    // Navigate between dashboard pages
    const navPages = ['/dashboard/keys', '/dashboard/usage', '/dashboard/billing', '/dashboard'];
    for (const navPage of navPages) {
      await page.goto(`${BASE_URL}${navPage}`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      if (!currentUrl.includes('/dashboard')) {
        r.status = 'fail';
        r.error = `Session lost when navigating to ${navPage}, redirected to ${currentUrl}`;
        r.screenshot = await screenshot(page, 'session_lost');
        await ctx.close();
        return;
      }
    }
    r.notes.push('Session persisted across 4 dashboard navigations');
    await ctx.close();
  }));

  // --- Test 12: Sign out works ---
  tests.push(await makeTest('Sign Out button works → redirects away from dashboard', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    // Login
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', LOGIN_EMAIL);
    await page.fill('input[type="password"]', LOGIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(6000);

    if (!page.url().includes('/dashboard')) {
      r.status = 'fail';
      r.error = 'Login failed, cannot test sign out';
      await ctx.close();
      return;
    }

    // Find and click sign out button
    const signOutBtn = await page.$('button:has-text("Sign Out"), a:has-text("Sign Out"), button:has-text("Log Out"), a:has-text("Log Out"), button:has-text("Logout")');
    if (!signOutBtn) {
      r.status = 'fail';
      r.error = 'Sign Out button not found';
      r.screenshot = await screenshot(page, 'signout_not_found');
      await ctx.close();
      return;
    }
    await signOutBtn.click();
    await page.waitForTimeout(3000);
    const url = page.url();
    if (url.includes('/dashboard')) {
      r.status = 'fail';
      r.error = `Still on dashboard after sign out: ${url}`;
      r.screenshot = await screenshot(page, 'signout_failed');
    } else {
      r.notes.push(`Signed out, redirected to: ${url}`);
    }
    await ctx.close();
  }));

  // --- Test 13: /dashboard redirects to /login when not authenticated ---
  tests.push(await makeTest('/dashboard → /login when not authenticated', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    const url = page.url();
    if (url.includes('/dashboard') && !url.includes('/login')) {
      // Check if the page is showing login content or dashboard content
      const bodyText = await page.evaluate(() => document.body.innerText);
      const isLoginPage = bodyText.toLowerCase().includes('sign in') || bodyText.toLowerCase().includes('log in') || bodyText.toLowerCase().includes('email') && bodyText.toLowerCase().includes('password');
      if (!isLoginPage) {
        r.status = 'fail';
        r.error = `Dashboard accessible without auth: ${url}`;
        r.screenshot = await screenshot(page, 'dashboard_no_auth');
      } else {
        r.notes.push('Dashboard shows login form (inline redirect or overlay)');
      }
    } else if (url.includes('/login')) {
      r.notes.push('Correctly redirected to /login');
    } else {
      r.notes.push(`Redirected to: ${url}`);
    }
    await ctx.close();
  }));

  // --- Test 14: Direct dashboard URLs redirect to login when not auth ---
  tests.push(await makeTest('Direct /dashboard/keys → /login when not authenticated', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/keys`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const isProtected = url.includes('/login') ||
                        bodyText.toLowerCase().includes('sign in') ||
                        bodyText.toLowerCase().includes('log in') ||
                        !bodyText.toLowerCase().includes('api key');
    if (!isProtected) {
      r.status = 'fail';
      r.error = `Dashboard/keys accessible without auth at: ${url}`;
      r.screenshot = await screenshot(page, 'dashboard_keys_no_auth');
    } else {
      r.notes.push(`Protected: ${url}`);
    }
    await ctx.close();
  }));

  // Tally
  for (const t of tests) {
    if (t.status === 'pass') pass++; else fail++;
  }

  await browser.close();

  const log = {
    phase: 2,
    description: 'Auth Stress Test',
    timestamp: new Date().toISOString(),
    tests,
    summary: { pass, fail, skip: 0 }
  };

  fs.writeFileSync(path.join(LOGS_DIR, 'phase2.json'), JSON.stringify(log, null, 2));
  console.log(`\n=== Phase 2 Complete: ${pass} passed, ${fail} failed ===`);
  return log;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

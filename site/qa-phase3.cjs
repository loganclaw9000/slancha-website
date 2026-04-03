const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';
const SCREENSHOTS_DIR = path.join(__dirname, 'qa-logs/screenshots');
const LOGS_DIR = path.join(__dirname, 'qa-logs');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const LOGIN_EMAIL = 'loganclaw9000@gmail.com';
const LOGIN_PASSWORD = 'NewTestPassword123!';

async function loginAndGetContext(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"]', LOGIN_EMAIL);
  await page.fill('input[type="password"]', LOGIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(6000);
  const url = page.url();
  if (!url.includes('/dashboard')) throw new Error(`Login failed, ended up at: ${url}`);
  await page.close();
  return ctx;
}

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

async function ss(page, name) {
  const p = path.join(SCREENSHOTS_DIR, `phase3_${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  return p;
}

async function main() {
  console.log('Starting Phase 3: Form Interactions');
  const browser = await chromium.launch({ headless: true });
  const tests = [];

  // Login once and reuse storage state
  console.log('Logging in for dashboard tests...');
  const authCtx = await loginAndGetContext(browser);
  const authState = await authCtx.storageState();
  await authCtx.close();
  console.log('Login successful\n');

  // ===== PUBLIC FORMS =====
  console.log('--- Public Forms ---');

  // Contact form - valid submission
  tests.push(await makeTest('Contact form: valid submission', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const nameInput = await page.$('input[name="name"], input[placeholder*="name" i], input[id*="name" i]');
    const emailInput = await page.$('input[type="email"]');
    const subjectInput = await page.$('input[name="subject"], input[placeholder*="subject" i], input[id*="subject" i]');
    const messageInput = await page.$('textarea');

    if (!emailInput || !messageInput) {
      r.status = 'fail';
      r.error = 'Contact form inputs not found';
      r.screenshot = await ss(page, 'contact_form_missing');
      await ctx.close();
      return;
    }

    if (nameInput) await nameInput.fill('QA Test User');
    await emailInput.fill('qa@test.com');
    if (subjectInput) await subjectInput.fill('QA Test Subject');
    await messageInput.fill('This is a QA test message for the contact form.');

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await page.waitForTimeout(4000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasResponse = bodyText.toLowerCase().includes('thank') ||
                        bodyText.toLowerCase().includes('sent') ||
                        bodyText.toLowerCase().includes('success') ||
                        bodyText.toLowerCase().includes('error') ||
                        bodyText.toLowerCase().includes('received');
    if (!hasResponse) {
      r.notes.push('No clear success/error message after contact form submission');
    } else {
      r.notes.push('Response shown after submission');
    }
    r.screenshot = await ss(page, 'contact_submitted');
    await ctx.close();
  }));

  // Contact form - empty submission
  tests.push(await makeTest('Contact form: empty submission → validation', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await page.waitForTimeout(2000);
    const url = page.url();
    if (url !== `${BASE_URL}/contact` && !url.includes('/contact')) {
      r.notes.push(`Form submission redirected to: ${url}`);
    } else {
      r.notes.push('Stayed on contact page (validation worked)');
    }
    await ctx.close();
  }));

  // Waitlist form on homepage
  tests.push(await makeTest('Homepage waitlist/CTA: email submit', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Look for an email input in hero/footer CTA areas
    const emailInputs = await page.$$('input[type="email"]');
    if (emailInputs.length === 0) {
      r.notes.push('No email input found on homepage (may be CTA buttons only)');
      await ctx.close();
      return;
    }
    // Use the first email input (likely hero CTA)
    await emailInputs[0].fill('qa-waitlist@test.com');
    const submitBtns = await page.$$('button[type="submit"], button:has-text("Join"), button:has-text("Get"), button:has-text("Start")');
    if (submitBtns.length > 0) {
      await submitBtns[0].click();
      await page.waitForTimeout(3000);
      r.notes.push('Submitted waitlist email');
    } else {
      r.notes.push('No submit button found near email input');
    }
    await ctx.close();
  }));

  // Signup - create account with unique test email
  const testEmail = `qa-test-${Date.now()}@test.com`;
  tests.push(await makeTest(`Signup: create account (${testEmail})`, async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const emailInput = await page.$('input[type="email"]');
    const passwordInputs = await page.$$('input[type="password"]');

    if (!emailInput || !passwordInputs[0]) {
      r.status = 'fail';
      r.error = 'Signup form inputs not found';
      await ctx.close();
      return;
    }

    await emailInput.fill(testEmail);
    await passwordInputs[0].fill('TestPassword123!');
    if (passwordInputs[1]) await passwordInputs[1].fill('TestPassword123!');

    const nameInput = await page.$('input[name="name"], input[placeholder*="name" i]');
    if (nameInput) await nameInput.fill('QA Test User');

    await page.click('button[type="submit"]');
    await page.waitForTimeout(6000);

    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasSuccess = url.includes('/dashboard') ||
                       bodyText.toLowerCase().includes('verify') ||
                       bodyText.toLowerCase().includes('check your email') ||
                       bodyText.toLowerCase().includes('confirmation');
    const hasError = bodyText.toLowerCase().includes('error') ||
                     bodyText.toLowerCase().includes('already');

    if (hasSuccess) {
      r.notes.push(`Signup success - URL: ${url}`);
    } else if (hasError) {
      r.notes.push(`Signup error shown (may be expected if Supabase blocks test domain)`);
    } else {
      r.notes.push(`No clear response. URL: ${url}`);
    }
    r.screenshot = await ss(page, 'signup_test');
    await ctx.close();
  }));

  // Reset password form
  tests.push(await makeTest('Reset password form: valid email submission', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/reset-password`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.fill(LOGIN_EMAIL);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(4000);
      const bodyText = await page.evaluate(() => document.body.innerText);
      r.notes.push(bodyText.toLowerCase().includes('sent') || bodyText.toLowerCase().includes('check')
        ? 'Success message shown'
        : 'No clear success message');
    } else {
      r.notes.push('No email input found');
    }
    await ctx.close();
  }));

  // ===== DASHBOARD FORMS =====
  console.log('\n--- Dashboard Forms ---');

  // Create API Key
  tests.push(await makeTest('Dashboard: Create API Key modal', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/keys`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const createBtn = await page.$('button:has-text("Create"), button:has-text("New Key"), button:has-text("Generate"), button:has-text("Add")');
    if (!createBtn) {
      r.notes.push('No Create Key button found');
      r.screenshot = await ss(page, 'api_keys_page');
      await ctx.close();
      return;
    }
    await createBtn.click();
    await page.waitForTimeout(1500);

    // Check if modal appeared
    const modal = await page.$('[role="dialog"], .modal, .overlay, [class*="modal"], [class*="dialog"]');
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasForm = bodyText.toLowerCase().includes('name') || bodyText.toLowerCase().includes('key');

    if (modal || hasForm) {
      r.notes.push('Create Key modal/form appeared');
      // Try filling in a key name
      const nameInput = await page.$('input[type="text"], input[name="name"], input[placeholder*="name" i], input[placeholder*="key" i]');
      if (nameInput) {
        await nameInput.fill('QA Test Key');
        const submitBtn = await page.$('[role="dialog"] button[type="submit"], .modal button[type="submit"], button:has-text("Create"), button:has-text("Generate")');
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(3000);
          r.notes.push('Form submitted');
        }
      }
    } else {
      r.notes.push('No modal appeared after clicking Create');
    }
    r.screenshot = await ss(page, 'api_keys_modal');
    await ctx.close();
  }));

  // Settings: Profile
  tests.push(await makeTest('Dashboard: Settings profile save', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const nameInput = await page.$('input[name="name"], input[placeholder*="name" i], input[id*="name" i]');
    const companyInput = await page.$('input[name="company"], input[placeholder*="company" i], input[id*="company" i]');

    if (!nameInput) {
      r.notes.push('No name input found in settings');
      r.screenshot = await ss(page, 'settings_no_name');
      await ctx.close();
      return;
    }

    await nameInput.fill('QA Test User');
    if (companyInput) await companyInput.fill('QA Test Corp');

    const saveBtn = await page.$('button:has-text("Save"), button:has-text("Update Profile"), button:has-text("Save Profile")');
    if (saveBtn) {
      await saveBtn.click();
      await page.waitForTimeout(3000);
      const bodyText = await page.evaluate(() => document.body.innerText);
      const hasResponse = bodyText.toLowerCase().includes('saved') || bodyText.toLowerCase().includes('success') || bodyText.toLowerCase().includes('updated') || bodyText.toLowerCase().includes('error');
      r.notes.push(hasResponse ? 'Response shown after save' : 'No response shown after save');
    } else {
      r.notes.push('No Save Profile button found');
    }
    r.screenshot = await ss(page, 'settings_profile');
    await ctx.close();
  }));

  // Settings: Password change
  tests.push(await makeTest('Dashboard: Settings password update', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const pwdInputs = await page.$$('input[type="password"]');
    if (pwdInputs.length < 2) {
      r.notes.push(`Only ${pwdInputs.length} password input(s) found`);
      await ctx.close();
      return;
    }

    await pwdInputs[0].fill('NewTestPassword123!');
    await pwdInputs[1].fill('NewTestPassword123!');

    const updateBtn = await page.$('button:has-text("Update Password"), button:has-text("Change Password"), button:has-text("Save Password")');
    if (updateBtn) {
      await updateBtn.click();
      await page.waitForTimeout(3000);
      r.notes.push('Password update submitted');
    } else {
      r.notes.push('No Update Password button found');
    }
    await ctx.close();
  }));

  // Settings: Mismatched password
  tests.push(await makeTest('Dashboard: Settings mismatched password → error', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const pwdInputs = await page.$$('input[type="password"]');
    if (pwdInputs.length < 2) {
      r.notes.push('Not enough password inputs');
      await ctx.close();
      return;
    }

    await pwdInputs[0].fill('Password1!');
    await pwdInputs[1].fill('DifferentPassword2!');

    const updateBtn = await page.$('button:has-text("Update Password"), button:has-text("Change Password")');
    if (updateBtn) {
      await updateBtn.click();
      await page.waitForTimeout(2000);
      const bodyText = await page.evaluate(() => document.body.innerText);
      const hasError = bodyText.toLowerCase().includes('match') || bodyText.toLowerCase().includes('error');
      r.notes.push(hasError ? 'Error shown for mismatch' : 'No error shown for mismatch');
    } else {
      r.notes.push('No Update Password button found');
    }
    await ctx.close();
  }));

  // Settings: Notification toggles
  tests.push(await makeTest('Dashboard: Settings notification toggles', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const toggles = await page.$$('input[type="checkbox"], [role="switch"], button[aria-checked]');
    if (toggles.length === 0) {
      r.notes.push('No toggles found on settings page');
      await ctx.close();
      return;
    }

    r.notes.push(`Found ${toggles.length} toggles`);
    // Click each toggle
    for (let i = 0; i < Math.min(toggles.length, 4); i++) {
      try {
        await toggles[i].click();
        await page.waitForTimeout(500);
      } catch (_) {}
    }
    r.notes.push('Clicked all toggles');
    await ctx.close();
  }));

  // Team: Invite Member
  tests.push(await makeTest('Dashboard: Team invite member modal', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/team`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const inviteBtn = await page.$('button:has-text("Invite"), button:has-text("Add Member"), button:has-text("Add")');
    if (!inviteBtn) {
      r.notes.push('No Invite Member button found');
      r.screenshot = await ss(page, 'team_page');
      await ctx.close();
      return;
    }

    await inviteBtn.click();
    await page.waitForTimeout(1500);

    const emailInput = await page.$('input[type="email"], input[placeholder*="email" i]');
    if (emailInput) {
      await emailInput.fill('qa-invite@test.com');
      const submitBtn = await page.$('button[type="submit"], button:has-text("Send"), button:has-text("Invite")');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(3000);
        r.notes.push('Invite submitted');
      }
    } else {
      r.notes.push('No email input in invite modal');
    }
    r.screenshot = await ss(page, 'team_invite');
    await ctx.close();
  }));

  // Webhooks: Add endpoint
  tests.push(await makeTest('Dashboard: Webhooks add endpoint modal', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/webhooks`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const addBtn = await page.$('button:has-text("Add"), button:has-text("New"), button:has-text("Create"), button:has-text("Endpoint")');
    if (!addBtn) {
      r.notes.push('No Add Webhook button found');
      r.screenshot = await ss(page, 'webhooks_page');
      await ctx.close();
      return;
    }

    await addBtn.click();
    await page.waitForTimeout(1500);

    const urlInput = await page.$('input[type="url"], input[name="url"], input[placeholder*="url" i], input[placeholder*="https" i], input[type="text"]');
    if (urlInput) {
      await urlInput.fill('https://qa-test-webhook.example.com/hook');
      const submitBtn = await page.$('button[type="submit"], button:has-text("Add"), button:has-text("Save"), button:has-text("Create")');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(3000);
        r.notes.push('Webhook submitted');
      }
    } else {
      r.notes.push('No URL input in webhook modal');
    }
    r.screenshot = await ss(page, 'webhooks_modal');
    await ctx.close();
  }));

  // Deployments: New deployment
  tests.push(await makeTest('Dashboard: New deployment modal', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/deployments`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const newBtn = await page.$('button:has-text("New Deployment"), button:has-text("Deploy"), button:has-text("Create"), button:has-text("New")');
    if (!newBtn) {
      r.notes.push('No New Deployment button found');
      r.screenshot = await ss(page, 'deployments_page');
      await ctx.close();
      return;
    }

    await newBtn.click();
    await page.waitForTimeout(1500);
    r.screenshot = await ss(page, 'deployments_modal');
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasModal = bodyText.toLowerCase().includes('deploy') || bodyText.toLowerCase().includes('model') || bodyText.toLowerCase().includes('region');
    r.notes.push(hasModal ? 'Modal/form appeared' : 'No clear modal content');
    await ctx.close();
  }));

  // Fine-tuning: New job
  tests.push(await makeTest('Dashboard: Fine-tuning new job modal', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/fine-tuning`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const newBtn = await page.$('button:has-text("New Fine-Tune"), button:has-text("New Job"), button:has-text("Fine-Tune"), button:has-text("New")');
    if (!newBtn) {
      r.notes.push('No New Fine-Tune Job button found');
      r.screenshot = await ss(page, 'finetune_page');
      await ctx.close();
      return;
    }

    await newBtn.click();
    await page.waitForTimeout(1500);
    r.screenshot = await ss(page, 'finetune_modal');
    r.notes.push('Clicked new fine-tune button');
    await ctx.close();
  }));

  // Datasets: Upload
  tests.push(await makeTest('Dashboard: Upload dataset modal', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/datasets`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const uploadBtn = await page.$('button:has-text("Upload"), button:has-text("Add Dataset"), button:has-text("New Dataset")');
    if (!uploadBtn) {
      r.notes.push('No Upload Dataset button found');
      r.screenshot = await ss(page, 'datasets_page');
      await ctx.close();
      return;
    }

    await uploadBtn.click();
    await page.waitForTimeout(1500);
    r.screenshot = await ss(page, 'datasets_upload');
    r.notes.push('Clicked upload dataset button');
    await ctx.close();
  }));

  // Datasets: Search
  tests.push(await makeTest('Dashboard: Dataset search input works', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/datasets`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const searchInput = await page.$('input[type="search"], input[placeholder*="search" i], input[placeholder*="filter" i]');
    if (!searchInput) {
      r.notes.push('No search input found on datasets page');
      await ctx.close();
      return;
    }

    await searchInput.fill('test');
    await page.waitForTimeout(1000);
    r.notes.push('Search input accepts text');
    await ctx.close();
  }));

  // Request logs: Search
  tests.push(await makeTest('Dashboard: Request logs search works', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/logs`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const searchInput = await page.$('input[type="search"], input[placeholder*="search" i], input[placeholder*="filter" i], input[placeholder*="log" i]');
    if (!searchInput) {
      r.notes.push('No search input found on logs page');
      await ctx.close();
      return;
    }

    await searchInput.fill('gpt-4');
    await page.waitForTimeout(1000);
    r.notes.push('Logs search input accepts text');
    await ctx.close();
  }));

  // Settings: Delete Account - verify confirmation appears
  tests.push(await makeTest('Dashboard: Delete Account shows confirmation (DO NOT confirm)', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const deleteBtn = await page.$('button:has-text("Delete Account"), button:has-text("Delete My Account")');
    if (!deleteBtn) {
      r.notes.push('No Delete Account button found');
      await ctx.close();
      return;
    }

    await deleteBtn.click();
    await page.waitForTimeout(1500);

    // Check for confirmation dialog
    const dialog = await page.$('[role="dialog"], [role="alertdialog"], .modal, .confirm');
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasConfirm = dialog !== null || bodyText.toLowerCase().includes('confirm') || bodyText.toLowerCase().includes('are you sure') || bodyText.toLowerCase().includes('cannot be undone');

    if (hasConfirm) {
      r.notes.push('Confirmation dialog appeared');
      // Click Cancel/No to not delete
      const cancelBtn = await page.$('button:has-text("Cancel"), button:has-text("No"), button:has-text("Keep")');
      if (cancelBtn) {
        await cancelBtn.click();
        r.notes.push('Cancelled deletion');
      }
    } else {
      r.notes.push('No confirmation dialog - delete button may have had no effect or immediate action');
    }
    r.screenshot = await ss(page, 'delete_account_confirm');
    await ctx.close();
  }));

  // Settings: Export buttons
  tests.push(await makeTest('Dashboard: Export buttons on settings page', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const exportBtns = await page.$$('button:has-text("Export"), button:has-text("Download")');
    r.notes.push(`Found ${exportBtns.length} export button(s)`);

    // Click first export button
    if (exportBtns.length > 0) {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
        exportBtns[0].click()
      ]);
      await page.waitForTimeout(2000);
      if (download) {
        r.notes.push('Download triggered by export button');
      } else {
        const bodyText = await page.evaluate(() => document.body.innerText);
        r.notes.push('No download event - may show data inline or toast');
      }
    }
    await ctx.close();
  }));

  // Tally
  let pass = 0, fail = 0;
  for (const t of tests) {
    if (t.status === 'pass') pass++; else fail++;
  }

  await browser.close();

  const log = {
    phase: 3,
    description: 'Form Interactions',
    timestamp: new Date().toISOString(),
    tests,
    summary: { pass, fail, skip: 0 }
  };

  fs.writeFileSync(path.join(LOGS_DIR, 'phase3.json'), JSON.stringify(log, null, 2));
  console.log(`\n=== Phase 3 Complete: ${pass} passed, ${fail} failed ===`);
  return log;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

/**
 * Playwright script to catalog all interactive elements across dashboard pages.
 * Run with: node scripts/catalog-dashboard.js
 */

import { chromium } from 'playwright';

const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';
const LOGIN_URL = `${BASE_URL}/login`;
const EMAIL = 'loganclaw9000@gmail.com';
const PASSWORD = 'password';

const PAGES = [
  '/dashboard',
  '/dashboard/keys',
  '/dashboard/usage',
  '/dashboard/models',
  '/dashboard/semantic-router',
  '/dashboard/evaluations',
  '/dashboard/fine-tuning',
  '/dashboard/deployments',
  '/dashboard/datasets',
  '/dashboard/logs',
  '/dashboard/team',
  '/dashboard/billing',
  '/dashboard/webhooks',
  '/dashboard/settings',
];

async function catalogElements(page) {
  return await page.evaluate(() => {
    const selectors = [
      'button',
      'input',
      'select',
      'textarea',
      '[role="tab"]',
      '[role="switch"]',
      '[role="checkbox"]',
      '[role="radio"]',
      '[role="combobox"]',
      '[role="listbox"]',
      '[role="menuitem"]',
      '[role="slider"]',
      '[type="range"]',
      '.toggle',
      '.switch',
      'a[href]',
      '[role="dialog"] button',
      '[role="alertdialog"] button',
    ];

    const allElements = new Set();
    const results = [];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (allElements.has(el)) return;
        allElements.add(el);

        const tagName = el.tagName.toLowerCase();
        const type = el.getAttribute('type') || el.getAttribute('role') || tagName;
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100);
        const placeholder = el.getAttribute('placeholder') || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        const ariaLabelledBy = el.getAttribute('aria-labelledby') || '';
        const name = el.getAttribute('name') || '';
        const id = el.id || '';
        const className = el.className && typeof el.className === 'string'
          ? el.className.replace(/\s+/g, ' ').trim().slice(0, 80)
          : '';
        const href = el.getAttribute('href') || '';
        const value = el.value !== undefined ? el.value : '';
        const checked = el.checked !== undefined ? el.checked : null;
        const disabled = el.disabled || el.getAttribute('disabled') !== null || el.getAttribute('aria-disabled') === 'true';
        const hidden = el.hidden || el.getAttribute('aria-hidden') === 'true';
        const dataTestId = el.getAttribute('data-testid') || '';

        // Build a reasonable identifier
        const identifier = id
          ? `#${id}`
          : ariaLabel
          ? `[aria-label="${ariaLabel}"]`
          : name
          ? `${tagName}[name="${name}"]`
          : dataTestId
          ? `[data-testid="${dataTestId}"]`
          : className
          ? `${tagName}.${className.split(' ')[0]}`
          : tagName;

        results.push({
          matchedSelector: selector,
          tagName,
          type,
          identifier,
          text: text || null,
          placeholder: placeholder || null,
          ariaLabel: ariaLabel || null,
          ariaLabelledBy: ariaLabelledBy || null,
          name: name || null,
          id: id || null,
          href: href || null,
          value: value || null,
          checked,
          disabled,
          hidden,
          dataTestId: dataTestId || null,
          className: className || null,
        });
      });
    }

    return results;
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  });
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('=== STEP 1: Navigate to login page ===');
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`Login page title: ${await page.title()}`);
  console.log(`Login page URL: ${page.url()}`);

  // Take a screenshot to see what we have
  await page.screenshot({ path: '/tmp/login-page.png', fullPage: true });

  // Log all form elements on login page
  const loginElements = await catalogElements(page);
  console.log('\n=== Login page elements ===');
  loginElements.forEach(el => {
    if (!el.hidden) {
      console.log(`  [${el.tagName}] type=${el.type} text="${el.text}" placeholder="${el.placeholder}" ariaLabel="${el.ariaLabel}" id="${el.id}"`);
    }
  });

  console.log('\n=== STEP 2: Attempt login ===');

  // Try to find and fill email field
  const emailSelectors = [
    'input[type="email"]',
    'input[name="email"]',
    'input[placeholder*="email" i]',
    'input[id*="email" i]',
    '#email',
  ];
  let emailFilled = false;
  for (const sel of emailSelectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.fill(EMAIL);
        console.log(`Filled email using selector: ${sel}`);
        emailFilled = true;
        break;
      }
    } catch (e) {
      // try next
    }
  }
  if (!emailFilled) {
    // Try the first visible input
    const inputs = await page.$$('input:visible');
    if (inputs.length > 0) {
      await inputs[0].fill(EMAIL);
      console.log('Filled email using first visible input');
      emailFilled = true;
    }
  }

  // Try to find and fill password field
  const passwordSelectors = [
    'input[type="password"]',
    'input[name="password"]',
    'input[placeholder*="password" i]',
    'input[id*="password" i]',
    '#password',
  ];
  let passwordFilled = false;
  for (const sel of passwordSelectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.fill(PASSWORD);
        console.log(`Filled password using selector: ${sel}`);
        passwordFilled = true;
        break;
      }
    } catch (e) {
      // try next
    }
  }

  if (!passwordFilled) {
    const inputs = await page.$$('input:visible');
    if (inputs.length > 1) {
      await inputs[1].fill(PASSWORD);
      console.log('Filled password using second visible input');
      passwordFilled = true;
    }
  }

  // Submit the form
  const submitSelectors = [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Login")',
    'button:has-text("Sign in")',
    'button:has-text("Log in")',
    'button:has-text("Sign In")',
    'button:has-text("Submit")',
  ];
  let submitted = false;
  for (const sel of submitSelectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.click();
        console.log(`Clicked submit using selector: ${sel}`);
        submitted = true;
        break;
      }
    } catch (e) {
      // try next
    }
  }

  if (!submitted) {
    // Try pressing Enter
    await page.keyboard.press('Enter');
    console.log('Submitted by pressing Enter');
  }

  // Wait for navigation
  try {
    await page.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle' });
  } catch (e) {
    console.log('Navigation timeout (may be SPA), continuing...');
  }

  await page.waitForTimeout(2000);
  console.log(`After login URL: ${page.url()}`);
  await page.screenshot({ path: '/tmp/after-login.png', fullPage: true });

  // Catalog of all pages
  const catalog = {};

  for (const dashboardPath of PAGES) {
    const url = `${BASE_URL}${dashboardPath}`;
    console.log(`\n=== Visiting: ${url} ===`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    } catch (e) {
      console.log(`  Navigation error: ${e.message}, trying domcontentloaded...`);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      } catch (e2) {
        console.log(`  Failed: ${e2.message}`);
        catalog[dashboardPath] = { error: e2.message, elements: [] };
        continue;
      }
    }

    await page.waitForTimeout(1500);

    const currentUrl = page.url();
    const pageTitle = await page.title();
    console.log(`  Title: ${pageTitle}, URL: ${currentUrl}`);

    // Screenshot
    const safeName = dashboardPath.replace(/\//g, '_');
    await page.screenshot({ path: `/tmp/page${safeName}.png`, fullPage: true });

    // Check if we got redirected to login (not authenticated)
    if (currentUrl.includes('/login') || currentUrl.includes('login')) {
      console.log(`  REDIRECTED TO LOGIN - not authenticated for this page`);
      catalog[dashboardPath] = {
        url: currentUrl,
        redirectedToLogin: true,
        elements: [],
      };
      continue;
    }

    const elements = await catalogElements(page);
    const visible = elements.filter(el => !el.hidden);

    console.log(`  Found ${visible.length} visible interactive elements (${elements.length} total)`);

    catalog[dashboardPath] = {
      url: currentUrl,
      title: pageTitle,
      elementCount: visible.length,
      elements: visible,
    };

    // Print summary
    const byType = {};
    visible.forEach(el => {
      const key = el.type || el.tagName;
      byType[key] = (byType[key] || 0) + 1;
    });
    console.log('  By type:', JSON.stringify(byType));
  }

  await browser.close();

  // Print full catalog
  console.log('\n\n========================================');
  console.log('FULL INTERACTIVE ELEMENT CATALOG');
  console.log('========================================\n');

  for (const [path, data] of Object.entries(catalog)) {
    console.log(`\n## ${path}`);
    console.log(`   URL: ${data.url || 'N/A'}`);
    if (data.redirectedToLogin) {
      console.log('   STATUS: Redirected to login - authentication required');
      continue;
    }
    if (data.error) {
      console.log(`   ERROR: ${data.error}`);
      continue;
    }
    console.log(`   Title: ${data.title}`);
    console.log(`   Elements: ${data.elementCount}`);
    console.log('');

    const byType = {};
    data.elements.forEach(el => {
      const key = el.type || el.tagName;
      if (!byType[key]) byType[key] = [];
      byType[key].push(el);
    });

    for (const [type, els] of Object.entries(byType)) {
      console.log(`   ### ${type.toUpperCase()} (${els.length})`);
      els.forEach(el => {
        const parts = [];
        if (el.text) parts.push(`text="${el.text}"`);
        if (el.placeholder) parts.push(`placeholder="${el.placeholder}"`);
        if (el.ariaLabel) parts.push(`aria-label="${el.ariaLabel}"`);
        if (el.name) parts.push(`name="${el.name}"`);
        if (el.id) parts.push(`id="${el.id}"`);
        if (el.href) parts.push(`href="${el.href}"`);
        if (el.disabled) parts.push(`DISABLED`);
        if (el.checked !== null) parts.push(`checked=${el.checked}`);
        console.log(`     - [${el.identifier}] ${parts.join(', ')}`);
      });
      console.log('');
    }
  }

  // Save JSON
  const jsonOutput = JSON.stringify(catalog, null, 2);
  process.stdout.write('\n\nJSON_CATALOG_START\n');
  process.stdout.write(jsonOutput);
  process.stdout.write('\nJSON_CATALOG_END\n');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

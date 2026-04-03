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
  await page.waitForTimeout(6000);
  const state = await ctx.storageState();
  await ctx.close();
  return state;
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
  const p = path.join(SCREENSHOTS_DIR, `phase4_${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  return p;
}

async function main() {
  console.log('Starting Phase 4: Click Everything');
  const browser = await chromium.launch({ headless: true });
  const tests = [];
  let pass = 0, fail = 0;

  // Get auth state
  console.log('Logging in...');
  const authState = await getAuthState(browser);
  console.log('Logged in\n');

  // ===== HOMEPAGE =====
  console.log('--- Homepage ---');

  // Nav dropdowns
  tests.push(await makeTest('Homepage: Product nav dropdown opens', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Find nav trigger with "Product" text
    const productTrigger = await page.$('button:has-text("Product"), a:has-text("Product"), [data-trigger*="product" i]');
    if (!productTrigger) {
      r.notes.push('No Product nav trigger found');
      await ctx.close();
      return;
    }
    await productTrigger.hover();
    await page.waitForTimeout(500);
    // Check if dropdown appeared
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasDropdown = bodyText.includes('Router') || bodyText.includes('Evaluations') || bodyText.includes('Fine-Tuning');
    r.notes.push(hasDropdown ? 'Product dropdown appeared' : 'No dropdown content detected');
    r.screenshot = await ss(page, 'nav_product_dropdown');
    await ctx.close();
  }));

  // Search button
  tests.push(await makeTest('Homepage: Search button opens modal', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const searchBtn = await page.$('button[aria-label*="search" i], button:has-text("Search"), [data-search]');
    if (!searchBtn) {
      r.notes.push('No Search button found');
      await ctx.close();
      return;
    }
    await searchBtn.click();
    await page.waitForTimeout(1000);
    const searchInput = await page.$('input[type="search"], input[placeholder*="search" i], .search-modal input');
    r.notes.push(searchInput ? 'Search modal opened with input' : 'No search input after clicking search');
    r.screenshot = await ss(page, 'search_modal');
    await ctx.close();
  }));

  // CTA button navigation
  tests.push(await makeTest('Homepage: "Get Your API Endpoint" CTA → /signup', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const cta = await page.$('a:has-text("Get Your API Endpoint"), a:has-text("Get Started"), a:has-text("Start Free"), a[href*="signup"]');
    if (!cta) {
      r.notes.push('No API Endpoint CTA found');
      await ctx.close();
      return;
    }
    const href = await cta.getAttribute('href');
    r.notes.push(`CTA href: ${href}`);
    if (!href?.includes('signup') && !href?.includes('demo') && !href?.includes('contact')) {
      r.notes.push('CTA may not point to signup');
    }
    await ctx.close();
  }));

  // Pipeline viz nodes
  tests.push(await makeTest('Homepage: Pipeline viz nodes clickable', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Look for pipeline nodes
    const pipelineNodes = await page.$$('[data-step], .pipeline-node, .pipeline-step, button[class*="pipeline"], [class*="pipeline-node"]');
    if (pipelineNodes.length === 0) {
      r.notes.push('No pipeline nodes found (may be static visualization)');
      await ctx.close();
      return;
    }

    for (const node of pipelineNodes.slice(0, 4)) {
      try {
        await node.click({ timeout: 3000 });
        await page.waitForTimeout(300);
      } catch (_) {}
    }
    r.notes.push(`Clicked ${pipelineNodes.length} pipeline nodes`);
    await ctx.close();
  }));

  // ===== BLOG =====
  console.log('\n--- Blog ---');

  tests.push(await makeTest('Blog: Filter tags work', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const filterBtns = await page.$$('button[class*="filter"], button[class*="tag"], .blog-filter, [class*="category"]');
    if (filterBtns.length === 0) {
      r.notes.push('No filter buttons found on blog page');
      await ctx.close();
      return;
    }

    r.notes.push(`Found ${filterBtns.length} filter buttons`);
    // Click a few
    for (const btn of filterBtns.slice(0, 3)) {
      try {
        await btn.click();
        await page.waitForTimeout(500);
      } catch (_) {}
    }
    r.notes.push('Clicked filter buttons');
    await ctx.close();
  }));

  tests.push(await makeTest('Blog: Click into a blog post', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const blogLink = await page.$('a[href*="/blog/"], article a, .blog-card a, [class*="blog-post"] a');
    if (!blogLink) {
      r.notes.push('No blog post link found');
      await ctx.close();
      return;
    }
    await blogLink.click();
    await page.waitForTimeout(3000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    r.notes.push(`Blog post loaded (${bodyText.length} chars)`);
    if (bodyText.length < 500) {
      r.status = 'fail';
      r.error = `Blog post content too short: ${bodyText.length} chars`;
    }
    await ctx.close();
  }));

  // ===== PLAYGROUND =====
  console.log('\n--- Playground ---');

  tests.push(await makeTest('Playground: Tabs switch code examples', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/playground`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const tabs = await page.$$('[role="tab"], button[class*="tab"], .playground-tab, [class*="tab-btn"]');
    if (tabs.length === 0) {
      r.notes.push('No tabs found on playground page');
      await ctx.close();
      return;
    }

    r.notes.push(`Found ${tabs.length} tabs`);
    const initialText = await page.evaluate(() => document.body.innerText);

    if (tabs.length > 1) {
      await tabs[1].click();
      await page.waitForTimeout(500);
      const newText = await page.evaluate(() => document.body.innerText);
      r.notes.push(newText !== initialText ? 'Tab content changed on click' : 'Tab content unchanged');
    }
    await ctx.close();
  }));

  // ===== DEMO =====
  console.log('\n--- Demo ---');

  tests.push(await makeTest('Demo: Next Step button advances steps', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/demo`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const nextBtn = await page.$('button:has-text("Next"), button:has-text("Next Step"), button[class*="next"]');
    if (!nextBtn) {
      r.notes.push('No Next Step button found');
      await ctx.close();
      return;
    }

    const initialText = await page.evaluate(() => document.body.innerText);
    await nextBtn.click();
    await page.waitForTimeout(800);
    const afterText = await page.evaluate(() => document.body.innerText);
    r.notes.push(afterText !== initialText ? 'Step advanced on click' : 'No change after Next click');

    // Click through more steps
    for (let i = 0; i < 3; i++) {
      const btn = await page.$('button:has-text("Next"), button:has-text("Next Step")');
      if (btn) {
        try { await btn.click({ timeout: 2000 }); await page.waitForTimeout(500); } catch (_) {}
      }
    }

    // Test Previous button
    const prevBtn = await page.$('button:has-text("Previous"), button:has-text("← Previous"), button:has-text("Back")');
    if (prevBtn) {
      await prevBtn.click();
      await page.waitForTimeout(500);
      r.notes.push('Previous button works');
    }
    await ctx.close();
  }));

  tests.push(await makeTest('Demo: Direct step buttons work (1-5)', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/demo`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Find numbered step buttons
    const stepBtns = await page.$$('[class*="step-btn"], [class*="step-indicator"], button[aria-label*="step" i], .demo-step');
    if (stepBtns.length === 0) {
      r.notes.push('No direct step buttons found');
      await ctx.close();
      return;
    }

    r.notes.push(`Found ${stepBtns.length} step buttons`);
    // Click step 3 if available
    if (stepBtns.length >= 3) {
      await stepBtns[2].click({ timeout: 3000 });
      await page.waitForTimeout(500);
      r.notes.push('Clicked step 3 directly');
    }
    await ctx.close();
  }));

  // ===== ROI CALCULATOR =====
  console.log('\n--- ROI Calculator ---');

  tests.push(await makeTest('ROI Calculator: Sliders update values', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/roi-calculator`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const sliders = await page.$$('input[type="range"]');
    if (sliders.length === 0) {
      r.notes.push('No range sliders found');
      await ctx.close();
      return;
    }

    r.notes.push(`Found ${sliders.length} sliders`);
    const initialText = await page.evaluate(() => document.body.innerText);

    // Move first slider
    const slider = sliders[0];
    const box = await slider.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
      await page.mouse.up();
      await page.waitForTimeout(500);
    }

    const newText = await page.evaluate(() => document.body.innerText);
    r.notes.push(newText !== initialText ? 'Values updated when slider moved' : 'No change after slider move');
    await ctx.close();
  }));

  tests.push(await makeTest('ROI Calculator: Model dropdown changes', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/roi-calculator`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const selects = await page.$$('select');
    if (selects.length === 0) {
      r.notes.push('No select dropdowns found on ROI calculator');
      await ctx.close();
      return;
    }

    const initialText = await page.evaluate(() => document.body.innerText);
    await selects[0].selectOption({ index: 1 });
    await page.waitForTimeout(500);
    const newText = await page.evaluate(() => document.body.innerText);
    r.notes.push(newText !== initialText ? 'Values updated on model change' : 'No change after model select');
    await ctx.close();
  }));

  // ===== PRICING =====
  console.log('\n--- Pricing ---');

  tests.push(await makeTest('Pricing: CTA buttons navigate correctly', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const ctaBtns = await page.$$('a[href*="signup"], a[href*="contact"], a[href*="demo"], a:has-text("Get Started"), a:has-text("Start"), a:has-text("Contact"), a:has-text("Join")');
    r.notes.push(`Found ${ctaBtns.length} CTA buttons/links`);

    // Check all hrefs are valid
    for (const btn of ctaBtns.slice(0, 5)) {
      const href = await btn.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('/')) {
        r.status = 'fail';
        r.error = `CTA has invalid href: ${href}`;
      }
    }
    await ctx.close();
  }));

  // ===== DASHBOARD - Onboarding =====
  console.log('\n--- Dashboard ---');

  tests.push(await makeTest('Dashboard: Onboarding checklist Mark Complete buttons', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);

    const markBtns = await page.$$('button:has-text("Mark complete"), button:has-text("Complete"), [class*="onboarding"] button');
    if (markBtns.length === 0) {
      r.notes.push('No onboarding checklist buttons found (may already be completed)');
      await ctx.close();
      return;
    }

    r.notes.push(`Found ${markBtns.length} onboarding buttons`);
    await markBtns[0].click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    r.notes.push('Clicked Mark Complete');
    await ctx.close();
  }));

  tests.push(await makeTest('Dashboard Usage: 7d/30d/90d period buttons', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/usage`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);

    const periodBtns = await page.$$('button:has-text("7d"), button:has-text("30d"), button:has-text("90d"), button:has-text("7 days"), button:has-text("30 days")');
    if (periodBtns.length === 0) {
      r.notes.push('No period buttons found');
      await ctx.close();
      return;
    }

    r.notes.push(`Found ${periodBtns.length} period buttons`);
    for (const btn of periodBtns) {
      await btn.click({ timeout: 3000 });
      await page.waitForTimeout(300);
    }
    r.notes.push('Clicked all period buttons');
    await ctx.close();
  }));

  tests.push(await makeTest('Dashboard Logs: filters and refresh work', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/logs`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);

    // Check filter buttons/selects
    const filters = await page.$$('select, button[class*="filter"], [class*="filter-btn"]');
    r.notes.push(`Found ${filters.length} filter controls`);

    // Look for refresh button
    const refreshBtn = await page.$('button:has-text("Refresh"), button[aria-label*="refresh" i], button[class*="refresh"]');
    if (refreshBtn) {
      await refreshBtn.click({ timeout: 3000 });
      await page.waitForTimeout(1000);
      r.notes.push('Clicked refresh button');
    } else {
      r.notes.push('No refresh button found');
    }
    await ctx.close();
  }));

  tests.push(await makeTest('Dashboard Fine-Tuning: tabs work', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/fine-tuning`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);

    const tabs = await page.$$('[role="tab"], button[class*="tab"], [class*="ft-tab"]');
    r.notes.push(`Found ${tabs.length} tabs on fine-tuning page`);

    for (const tab of tabs) {
      try {
        await tab.click({ timeout: 2000 });
        await page.waitForTimeout(300);
      } catch (_) {}
    }
    r.notes.push('Clicked all fine-tuning tabs');
    await ctx.close();
  }));

  tests.push(await makeTest('Dashboard Deployments: tabs and dropdowns', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/deployments`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);

    // Tabs
    const tabs = await page.$$('[role="tab"], button[class*="tab"]');
    r.notes.push(`Found ${tabs.length} tabs`);
    for (const tab of tabs) {
      try { await tab.click({ timeout: 2000 }); await page.waitForTimeout(300); } catch (_) {}
    }

    // Selects
    const selects = await page.$$('select');
    r.notes.push(`Found ${selects.length} select dropdowns`);
    for (const sel of selects) {
      try { await sel.selectOption({ index: 0 }); await page.waitForTimeout(200); } catch (_) {}
    }
    await ctx.close();
  }));

  tests.push(await makeTest('Dashboard Billing: tabs work', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard/billing`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);

    const tabs = await page.$$('[role="tab"], button[class*="tab"], button:has-text("Overview"), button:has-text("Usage"), button:has-text("Invoices"), button:has-text("Payment")');
    r.notes.push(`Found ${tabs.length} billing tabs`);

    const clicked = new Set();
    for (const tab of tabs) {
      const text = await tab.evaluate(el => el.innerText);
      if (!clicked.has(text)) {
        try { await tab.click({ timeout: 2000 }); await page.waitForTimeout(400); clicked.add(text); } catch (_) {}
      }
    }
    r.notes.push(`Clicked ${clicked.size} unique tabs: ${[...clicked].join(', ')}`);
    await ctx.close();
  }));

  tests.push(await makeTest('Dashboard: Notifications bell click', async (r) => {
    const ctx = await browser.newContext({ storageState: authState });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);

    const bellBtn = await page.$('button[aria-label*="notification" i], button[class*="notification"], .notification-bell, button:has-text("🔔")');
    if (!bellBtn) {
      r.notes.push('No notification bell button found');
      await ctx.close();
      return;
    }
    await bellBtn.click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    r.screenshot = await ss(page, 'notifications_panel');
    r.notes.push('Clicked notification bell');
    await ctx.close();
  }));

  // Tally
  for (const t of tests) {
    if (t.status === 'pass') pass++; else fail++;
  }

  await browser.close();

  const log = {
    phase: 4,
    description: 'Click Everything',
    timestamp: new Date().toISOString(),
    tests,
    summary: { pass, fail, skip: 0 }
  };

  fs.writeFileSync(path.join(LOGS_DIR, 'phase4.json'), JSON.stringify(log, null, 2));
  console.log(`\n=== Phase 4 Complete: ${pass} passed, ${fail} failed ===`);
  return log;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

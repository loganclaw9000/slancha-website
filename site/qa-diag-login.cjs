const { chromium } = require('playwright');
const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';

async function tryLogin(email, password) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('  ERROR:', e.message.substring(0, 100)));
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(8000);
  const url = page.url();
  const body = await page.evaluate(() => document.body.innerText);
  console.log(`  Email: ${email}, Password: ${password}`);
  console.log(`  URL: ${url}`);
  console.log(`  Body preview: ${body.substring(0, 200)}`);
  await browser.close();
  return url.includes('/dashboard');
}

async function main() {
  const passwords = ['password', 'NewTestPassword123!', 'Password1!'];
  for (const pwd of passwords) {
    console.log(`\nTrying password: ${pwd}`);
    const success = await tryLogin('loganclaw9000@gmail.com', pwd);
    console.log(`  Result: ${success ? 'SUCCESS' : 'FAILED'}`);
    if (success) break;
  }
}
main().catch(console.error);

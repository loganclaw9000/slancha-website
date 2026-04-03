const { chromium } = require('playwright');

const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';
const LOGIN_EMAIL = 'loganclaw9000@gmail.com';
const LOGIN_PASSWORD = 'password';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"]', LOGIN_EMAIL);
  await page.fill('input[type="password"]', LOGIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(6000);
  
  const storageState = await ctx.storageState();
  const ctx2 = await browser.newContext({ storageState });
  const page2 = await ctx2.newPage();
  
  const errors = [];
  page2.on('pageerror', e => errors.push(e.message));
  
  await page2.goto(`${BASE_URL}/dashboard/webhooks`, { waitUntil: 'networkidle', timeout: 30000 });
  await page2.waitForTimeout(4000);
  
  const buttons = await page2.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim().substring(0, 50),
      disabled: b.disabled,
      class: b.className.substring(0, 50),
    }));
  });
  
  console.log('All buttons on /dashboard/webhooks:');
  buttons.forEach(b => console.log(`  [${b.disabled ? 'DISABLED' : 'enabled'}] "${b.text}" (${b.class})`));
  console.log('\nConsole errors:', errors.slice(0, 5));
  
  await browser.close();
}
main().catch(console.error);

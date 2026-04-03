const { chromium } = require('playwright');
const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  
  // Login
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"]', 'loganclaw9000@gmail.com');
  await page.fill('input[type="password"]', 'NewTestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(8000);
  console.log('After login, URL:', page.url());
  
  // Navigate to settings
  await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);
  console.log('Settings URL:', page.url());
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Settings body (first 300 chars):', bodyText.substring(0, 300));
  
  // List all inputs
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type,
      name: i.name,
      placeholder: i.placeholder,
      value: i.value,
    }));
  });
  console.log('\nAll inputs:', JSON.stringify(inputs, null, 2));
  
  // Check if page has display_name or name input
  const nameInput = await page.$('input[placeholder*="name" i], input[placeholder="Your name"]');
  console.log('\nName input found:', nameInput !== null);
  
  if (nameInput) {
    const testName = 'QA-Diag-' + Date.now();
    await nameInput.fill(testName);
    const saveBtn = await page.$('button:has-text("Save Profile"), button:has-text("Save")');
    if (saveBtn) {
      await saveBtn.click();
      await page.waitForTimeout(3000);
      console.log('Saved profile with name:', testName);
      
      // Reload and check
      await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(4000);
      const reloadBody = await page.evaluate(() => document.body.innerText);
      console.log('After reload, body contains name:', reloadBody.includes(testName));
      console.log('Body snippet:', reloadBody.substring(0, 400));
    }
  }
  
  await browser.close();
}
main().catch(console.error);

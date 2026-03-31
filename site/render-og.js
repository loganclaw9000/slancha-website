const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderOGImage() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set viewport to exact OG image dimensions
  await page.setViewportSize({ width: 1200, height: 630 });

  // Navigate to the HTML file
  const htmlPath = path.join(__dirname, 'og-image-template.html');
  await page.goto(`file://${htmlPath}`);

  // Wait for fonts to load
  await page.waitForSelector('.logo');
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Take screenshot
  await page.screenshot({
    path: path.join(__dirname, 'public', 'og-image.png'),
    fullPage: true
  });

  await browser.close();
  console.log('OG image rendered successfully!');
}

renderOGImage().catch(console.error);

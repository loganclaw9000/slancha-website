/**
 * Playwright script to catalog all interactive elements on the Slancha site.
 * Run with: node --experimental-vm-modules scripts/catalog-interactive.js
 * Or: npx playwright test scripts/catalog-interactive.js (if using test format)
 */

import { chromium } from 'playwright';

const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Login', path: '/login' },
  { name: 'Signup', path: '/signup' },
  { name: 'Reset Password', path: '/reset-password' },
  { name: 'Contact', path: '/contact' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Playground', path: '/playground' },
  { name: 'ROI Calculator', path: '/roi-calculator' },
  { name: 'Demo', path: '/demo' },
  { name: 'Docs', path: '/docs' },
  { name: 'Docs - Getting Started', path: '/docs/getting-started' },
  { name: 'Docs - API Reference', path: '/docs/api-reference' },
  { name: 'Blog', path: '/blog' },
  { name: 'SDK Reference', path: '/sdk-reference' },
];

async function catalogPage(page, url, pageName) {
  console.error(`\nVisiting: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    // Try with domcontentloaded if networkidle times out
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
    } catch (e2) {
      console.error(`  Failed to load ${url}: ${e2.message}`);
      return { page: pageName, url, error: e2.message, elements: [] };
    }
  }

  // Wait a bit for any JS-driven rendering
  await page.waitForTimeout(1500);

  const elements = await page.evaluate(() => {
    const results = [];
    const seen = new Set();

    function getSelector(el) {
      if (el.id) return `#${el.id}`;
      const tag = el.tagName.toLowerCase();
      const type = el.type ? `[type="${el.type}"]` : '';
      const role = el.getAttribute('role') ? `[role="${el.getAttribute('role')}"]` : '';
      const name = el.name ? `[name="${el.name}"]` : '';
      const cls = el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).filter(c => c && !c.includes(':') && !c.includes('(') && c.length < 40).slice(0, 2).join('.')
        : '';
      return `${tag}${type}${role}${name}${cls}` || tag;
    }

    function getText(el) {
      // Get meaningful visible text
      const ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) return ariaLabel;
      const placeholder = el.getAttribute('placeholder');
      if (placeholder) return placeholder;
      const title = el.getAttribute('title');
      const innerText = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      return innerText || title || el.getAttribute('value') || el.getAttribute('name') || '';
    }

    function addElement(el, type) {
      const key = el.outerHTML.slice(0, 200);
      if (seen.has(key)) return;
      seen.add(key);

      // Skip hidden elements
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      results.push({
        type,
        selector: getSelector(el),
        text: getText(el),
        tag: el.tagName.toLowerCase(),
        inputType: el.type || null,
        href: el.href || null,
      });
    }

    // Buttons
    document.querySelectorAll('button').forEach(el => addElement(el, 'button'));

    // Input elements
    document.querySelectorAll('input').forEach(el => {
      const type = (el.type || 'text').toLowerCase();
      if (type === 'hidden') return;
      const inputType = ['checkbox', 'radio', 'range', 'file', 'color', 'date', 'datetime-local', 'time', 'month', 'week', 'number'].includes(type) ? type : 'input';
      addElement(el, inputType);
    });

    // Textareas
    document.querySelectorAll('textarea').forEach(el => addElement(el, 'textarea'));

    // Selects / Dropdowns
    document.querySelectorAll('select').forEach(el => addElement(el, 'select'));

    // Links (only those with href or onClick that look interactive)
    document.querySelectorAll('a[href]').forEach(el => {
      const href = el.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:void')) {
        addElement(el, 'link');
      }
    });

    // Tabs
    document.querySelectorAll('[role="tab"]').forEach(el => addElement(el, 'tab'));

    // Switches / Toggles
    document.querySelectorAll('[role="switch"]').forEach(el => addElement(el, 'toggle'));
    document.querySelectorAll('[role="checkbox"]').forEach(el => addElement(el, 'checkbox'));

    // Listboxes / Comboboxes
    document.querySelectorAll('[role="listbox"], [role="combobox"], [role="option"]').forEach(el => addElement(el, 'dropdown'));

    // Dialog triggers (elements with aria-haspopup)
    document.querySelectorAll('[aria-haspopup]').forEach(el => {
      if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
        addElement(el, 'popup-trigger');
      }
    });

    // Any element with onClick that isn't already captured
    document.querySelectorAll('[onclick]').forEach(el => {
      if (!['button', 'a', 'input', 'select', 'textarea'].includes(el.tagName.toLowerCase())) {
        addElement(el, 'clickable');
      }
    });

    // Accordion / details
    document.querySelectorAll('details').forEach(el => addElement(el, 'accordion'));
    document.querySelectorAll('summary').forEach(el => addElement(el, 'accordion-trigger'));

    // Nav links (deduplicate but ensure we capture nav)
    document.querySelectorAll('nav a, header a, [role="navigation"] a').forEach(el => {
      addElement(el, 'nav-link');
    });

    return results;
  });

  return {
    page: pageName,
    url,
    elementCount: elements.length,
    elements,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  });

  const results = [];

  for (const { name, path } of PAGES) {
    const url = `${BASE_URL}${path}`;
    const page = await context.newPage();
    const result = await catalogPage(page, url, name);
    results.push(result);
    await page.close();
  }

  await browser.close();

  // Output JSON to stdout
  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

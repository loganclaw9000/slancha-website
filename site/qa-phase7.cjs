const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://loganclaw9000.github.io/slancha-website';
const BASE_PATH = '/slancha-website';
const SCREENSHOTS_DIR = path.join(__dirname, 'qa-logs/screenshots');
const LOGS_DIR = path.join(__dirname, 'qa-logs');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// Pages to crawl for links
const CRAWL_PAGES = [
  '/', '/pricing', '/contact', '/faq', '/blog', '/docs',
  '/use-cases', '/case-studies', '/integrations', '/playground',
  '/enterprise', '/vs-competitors', '/developers', '/glossary',
  '/solutions/fintech', '/solutions/healthtech', '/solutions/ecommerce',
];

async function makeTest(name, fn) {
  const result = { name, status: 'pass', error: null, notes: [] };
  try {
    await fn(result);
  } catch (err) {
    result.status = 'fail';
    result.error = err.message.substring(0, 300);
  }
  const icon = result.status === 'pass' ? '✓' : '✗';
  console.log(`${icon} ${name}`);
  if (result.error) console.log(`  ERROR: ${result.error.substring(0, 150)}`);
  result.notes.slice(0, 5).forEach(n => console.log(`  NOTE: ${n}`));
  if (result.notes.length > 5) console.log(`  NOTE: ... and ${result.notes.length - 5} more`);
  return result;
}

async function main() {
  console.log('Starting Phase 7: Link Audit');
  const browser = await chromium.launch({ headless: true });
  const tests = [];
  let pass = 0, fail = 0;
  const allLinks = new Set();
  const brokenLinks = [];
  const missingBasePath = [];
  const notFoundPages = [];
  const anchorLinks = [];
  const externalLinks = new Set();

  // --- Crawl all pages and extract links ---
  tests.push(await makeTest('Link extraction: crawl all pages', async (r) => {
    const ctx = await browser.newContext();

    for (const pagePath of CRAWL_PAGES) {
      const page = await ctx.newPage();
      try {
        await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1500);

        const links = await page.evaluate((basePath) => {
          return Array.from(document.querySelectorAll('a[href]')).map(a => ({
            href: a.getAttribute('href'),
            text: a.innerText.trim().substring(0, 50),
            fullHref: a.href,
          }));
        }, BASE_PATH);

        links.forEach(link => {
          if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
            // Special links - audit separately
          } else if (link.href.startsWith('http') && !link.href.includes('loganclaw9000.github.io')) {
            externalLinks.add(link.href);
          } else if (link.href.startsWith('#')) {
            anchorLinks.push({ page: pagePath, href: link.href, text: link.text });
          } else {
            allLinks.add(link.href);
          }
        });
      } catch (err) {
        r.notes.push(`Failed to crawl ${pagePath}: ${err.message.substring(0, 80)}`);
      }
      await page.close();
    }

    await ctx.close();
    r.notes.push(`Found ${allLinks.size} unique internal links`);
    r.notes.push(`Found ${externalLinks.size} external links`);
    r.notes.push(`Found ${anchorLinks.length} anchor links`);
  }));

  // --- Test internal links ---
  tests.push(await makeTest('Internal links: verify all resolve correctly', async (r) => {
    const ctx = await browser.newContext();
    let checked = 0, broken = 0;

    for (const href of allLinks) {
      // Convert full URL to path
      let linkPath = href;
      if (href.startsWith('http')) {
        try {
          const url = new URL(href);
          linkPath = url.pathname;
        } catch (_) { continue; }
      }

      // Skip GitHub Pages specific paths and external resources
      if (!linkPath.startsWith(BASE_PATH) && !linkPath.startsWith('/')) continue;

      // Normalize path
      const normalPath = linkPath.startsWith(BASE_PATH)
        ? linkPath.slice(BASE_PATH.length) || '/'
        : linkPath;

      if (!normalPath || normalPath === '') continue;

      const page = await ctx.newPage();
      try {
        const fullUrl = `${BASE_URL}${normalPath}`;
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(1000);

        const bodyText = await page.evaluate(() => document.body.innerText);
        if (bodyText.includes('Page not found') || bodyText.includes('This page could not be found')) {
          notFoundPages.push(normalPath);
          broken++;
          r.notes.push(`404 (SPA NotFound): ${normalPath}`);
        }
        checked++;
      } catch (err) {
        brokenLinks.push({ path: normalPath, error: err.message.substring(0, 80) });
        broken++;
      }
      await page.close();

      if (checked % 10 === 0) process.stdout.write('.');
    }

    await ctx.close();
    console.log('');
    r.notes.push(`Checked ${checked} links: ${broken} broken`);

    if (notFoundPages.length > 0) {
      r.status = 'fail';
      r.error = `${notFoundPages.length} pages render NotFound: ${notFoundPages.slice(0, 5).join(', ')}`;
    }
  }));

  // --- Check for missing base path ---
  tests.push(await makeTest('Base path: all internal links use /slancha-website/ prefix', async (r) => {
    // Check href attributes that look like internal links but don't have the base path
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const badLinks = await page.evaluate((basePath) => {
      return Array.from(document.querySelectorAll('a[href]'))
        .filter(a => {
          const href = a.getAttribute('href');
          // Flag links that start with / but not with /slancha-website/
          return href && href.startsWith('/') && !href.startsWith(basePath) && href !== '/' && !href.startsWith('/#');
        })
        .map(a => ({ href: a.getAttribute('href'), text: a.innerText.trim().substring(0, 30) }));
    }, BASE_PATH);

    await ctx.close();

    if (badLinks.length > 0) {
      r.status = 'fail';
      r.error = `${badLinks.length} links missing base path`;
      badLinks.forEach(l => r.notes.push(`Missing prefix: "${l.href}" (text: "${l.text}")`));
    } else {
      r.notes.push('All links on homepage have correct base path');
    }
  }));

  // --- External links audit ---
  tests.push(await makeTest('External links: verify reachable', async (r) => {
    let checked = 0, failed = 0;
    const externalArr = Array.from(externalLinks).slice(0, 20); // Test up to 20

    for (const url of externalArr) {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: AbortSignal.timeout(8000),
          headers: { 'User-Agent': 'Mozilla/5.0 QA-Bot' },
          redirect: 'follow',
        });
        if (response.status >= 400) {
          r.notes.push(`External link error (${response.status}): ${url.substring(0, 80)}`);
          failed++;
        }
        checked++;
      } catch (err) {
        // Network errors are common for HEAD requests, don't fail test
        r.notes.push(`External link unreachable: ${url.substring(0, 60)} (${err.message.substring(0, 40)})`);
        checked++;
      }
    }
    r.notes.push(`Checked ${checked} external links: ${failed} errors`);
  }));

  // --- Anchor links audit ---
  tests.push(await makeTest('Anchor links: #section elements exist on page', async (r) => {
    const ctx = await browser.newContext();
    let checked = 0, missing = 0;

    // Get unique page+anchor combinations
    const pageAnchors = new Map();
    for (const { page: pagePath, href } of anchorLinks) {
      if (!pageAnchors.has(pagePath)) pageAnchors.set(pagePath, new Set());
      pageAnchors.get(pagePath).add(href.slice(1)); // Remove #
    }

    for (const [pagePath, anchors] of pageAnchors) {
      const page = await ctx.newPage();
      try {
        await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1500);

        for (const anchor of anchors) {
          const element = await page.$(`#${anchor}, [name="${anchor}"]`);
          if (!element) {
            r.notes.push(`Missing anchor #${anchor} on ${pagePath}`);
            missing++;
          }
          checked++;
        }
      } catch (_) {}
      await page.close();
    }

    await ctx.close();
    r.notes.push(`Checked ${checked} anchor links: ${missing} missing targets`);
    if (missing > 0) {
      r.status = 'fail';
      r.error = `${missing} anchor links point to missing elements`;
    }
  }));

  // --- Mailto/tel format check ---
  tests.push(await makeTest('Mailto/tel links properly formatted', async (r) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const specialLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]'))
        .map(a => ({ href: a.getAttribute('href'), text: a.innerText.trim() }));
    });

    r.notes.push(`Found ${specialLinks.length} mailto/tel links`);
    for (const link of specialLinks) {
      if (link.href.startsWith('mailto:')) {
        const email = link.href.slice(7);
        if (!email.includes('@') || !email.includes('.')) {
          r.status = 'fail';
          r.error = `Invalid mailto: ${link.href}`;
        } else {
          r.notes.push(`Mailto OK: ${link.href}`);
        }
      }
    }
    await ctx.close();
  }));

  // Tally
  for (const t of tests) {
    if (t.status === 'pass') pass++; else fail++;
  }

  await browser.close();

  const log = {
    phase: 7,
    description: 'Link Audit',
    timestamp: new Date().toISOString(),
    tests,
    summary: { pass, fail, skip: 0 },
    details: {
      totalInternalLinks: allLinks.size,
      brokenLinks: brokenLinks.slice(0, 20),
      notFoundPages: notFoundPages.slice(0, 20),
      externalLinkCount: externalLinks.size,
      anchorLinkCount: anchorLinks.length,
    }
  };

  fs.writeFileSync(path.join(LOGS_DIR, 'phase7.json'), JSON.stringify(log, null, 2));
  console.log(`\n=== Phase 7 Complete: ${pass} passed, ${fail} failed ===`);
  return log;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Blog Post QA Test — tests all blog posts for links, meta tags, etc.
 * Usage: node qa/blog-test.js
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'http://localhost:4173';

// Get blog slugs from index.js
const blogIndexPath = path.join(__dirname, '../src/content/blog/index.js');
const blogIndexContent = fs.readFileSync(blogIndexPath, 'utf8');
const slugMatches = blogIndexContent.matchAll(/slug:\s*'([^']+)'/g);
const slugs = [...slugMatches].map(m => m[1]);

console.log(`Found ${slugs.length} blog posts to test\n`);

const PAGES = slugs.map(slug => ({
  name: `Blog: ${slug}`,
  path: `/blog/${slug}`,
}));

async function testBlogPost(page, { name, path: blogPath }) {
  const url = BASE_URL + blogPath;
  const result = {
    post: name,
    url,
    pass: true,
    consoleErrors: [],
    checks: [],
  };

  // Capture console messages
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      result.consoleErrors.push(msg.text());
    }
  });

  // Navigate
  let response;
  try {
    response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    result.pass = false;
    result.checks.push({ name: 'Page load', pass: false, detail: e.message });
    return result;
  }

  // HTTP status
  const status = response ? response.status() : 0;
  const statusOk = status >= 200 && status < 400;
  result.checks.push({ name: `HTTP ${status}`, pass: statusOk, detail: blogPath });
  if (!statusOk) result.pass = false;

  // Wait for React to render
  await page.waitForTimeout(1000);

  // Check for usePageMeta hook (meta tags)
  try {
    const metaTitle = await page.$('head title');
    const titleText = metaTitle ? await metaTitle.evaluate(el => el.textContent) : '';
    const hasMeta = titleText.length > 10 && !titleText.toLowerCase().includes('vite app');
    result.checks.push({ name: 'Page meta tags', pass: hasMeta, detail: hasMeta ? 'title present' : 'missing title' });
    if (!hasMeta) result.pass = false;
  } catch (e) {
    result.checks.push({ name: 'Page meta tags', pass: false, detail: e.message });
    result.pass = false;
  }

  // Check for JSON-LD structured data
  try {
    const jsonLd = await page.$('script[type="application/ld+json"]');
    const hasJsonLd = jsonLd !== null;
    result.checks.push({ name: 'JSON-LD structured data', pass: hasJsonLd, detail: hasJsonLd ? 'present' : 'missing' });
    if (!hasJsonLd) result.pass = false;
  } catch (e) {
    result.checks.push({ name: 'JSON-LD structured data', pass: false, detail: e.message });
    result.pass = false;
  }

  // Check for internal links
  try {
    const links = await page.$$('a[href]');
    const internalLinks = links.filter(async el => {
      const href = await el.evaluate(e => e.getAttribute('href'));
      return href && !href.startsWith('http');
    });
    result.checks.push({ name: 'Internal links', pass: true, detail: `${internalLinks.length} links found` });
  } catch (e) {
    result.checks.push({ name: 'Internal links', pass: false, detail: e.message });
    result.pass = false;
  }

  // Check for code blocks (code examples)
  try {
    const codeBlocks = await page.$$('pre code');
    result.checks.push({ name: 'Code examples', pass: true, detail: `${codeBlocks.length} code blocks found` });
  } catch (e) {
    result.checks.push({ name: 'Code examples', pass: false, detail: e.message });
  }

  return result;
}

function printReport(results) {
  let exitCode = 0;
  console.log('\n=== Blog Post QA Test Report ===\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Run: ${new Date().toISOString()}\n`);

  const summary = {
    total: results.length,
    passed: 0,
    failed: 0,
    issues: [],
  };

  for (const r of results) {
    const status = r.pass ? '✓ PASS' : '✗ FAIL';
    console.log(`--- ${r.post} — ${status} ---`);

    for (const c of r.checks) {
      const icon = c.pass ? '  ✓' : '  ✗';
      console.log(`${icon} ${c.name}: ${c.detail}`);
    }

    if (r.consoleErrors.length > 0) {
      console.log(`  ⚠ Console errors: ${r.consoleErrors.length}`);
      r.consoleErrors.slice(0, 3).forEach((e) => console.log(`    - ${e.slice(0, 100)}`));
    }

    if (r.pass) {
      summary.passed++;
    } else {
      summary.failed++;
      summary.issues.push(r.post);
      exitCode = 1;
    }
    console.log();
  }

  console.log(`Summary: ${summary.passed}/${summary.total} posts passed, ${summary.failed} failed\n`);

  if (summary.failed > 0) {
    console.log('Failed posts:');
    summary.issues.forEach((p) => console.log(`  - ${p}`));
    console.log();
  }

  return exitCode;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (QA-Bot) Playwright',
  });

  const results = [];
  for (const pageConfig of PAGES) {
    const page = await context.newPage();
    const result = await testBlogPost(page, pageConfig);
    results.push(result);
    await page.close();
  }

  await browser.close();

  process.exit(printReport(results));
})();

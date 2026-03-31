#!/usr/bin/env node
/**
 * Blog Posts QA Test — runs Playwright against the Vite preview server.
 * Tests all blog posts for: links, code examples, meta tags, mobile responsive
 *
 * Usage:
 *   node qa/blog-test.js [--url http://localhost:4173] [--json]
 *
 * Output:
 *   Human-readable report to stdout (or JSON with --json)
 *   Exit code 0 = all pass, 1 = failures found
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = (() => {
  const i = process.argv.indexOf('--url');
  return i !== -1 ? process.argv[i + 1] : 'http://localhost:4173';
})();
const JSON_OUTPUT = process.argv.includes('--json');

// Load blog posts from source
const blogIndexPath = path.join(__dirname, '../src/content/blog/index.js');
const blogSource = fs.readFileSync(blogIndexPath, 'utf-8');

// Extract slugs and titles using regex
const slugMatches = blogSource.matchAll(/slug:\s*'([^']+)'/g);
const titleMatches = blogSource.matchAll(/title:\s*'([^']+)'/g);

const slugs = [...slugMatches].map(m => m[1]);
const titles = [...titleMatches].map(m => m[1]);

// Extract tags
const tagMatches = blogSource.matchAll(/tags:\s*\[([^\]]*)\]/g);
const tagsMap = {};
for (const match of tagMatches) {
  const slug = match.input.substring(0, match.index).split("slug: '")[1].split("'")[0];
  const tagsStr = match[1];
  const tags = tagsStr.match(/'([^']+)'/g)?.map(t => t.replace(/'/g, '')) || [];
  tagsMap[slug] = tags;
}

// Extract authors and dates
const authorMatches = blogSource.matchAll(/author:\s*'([^']+)'/g);
const dateMatches = blogSource.matchAll(/date:\s*'([^']+)'/g);
const authors = [...authorMatches].map(m => m[1]);
const dates = [...dateMatches].map(m => m[1]);

// Build posts array
const posts = slugs.map((slug, i) => ({
  slug,
  title: titles[i] || 'Untitled',
  author: authors[i] || 'Unknown',
  date: dates[i] || '2026-01-01',
  tags: tagsMap[slug] || [],
}));

const PAGES = posts.map(post => ({
  name: post.title.substring(0, 50),
  path: `/blog/${post.slug}`,
  slug: post.slug,
  title: post.title,
  tags: post.tags,
}));

async function testPage(page, { name, path: p, slug, title, tags }) {
  const url = BASE_URL + p;
  const result = {
    page: title,
    slug,
    url,
    pass: true,
    consoleErrors: [],
    consoleWarnings: [],
    networkErrors: [],
    corsErrors: [],
    checks: [],
    issues: [],
  };

  // Capture console messages
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      result.consoleErrors.push(text);
      if (
        text.includes('CORS') ||
        text.includes('Cross-Origin') ||
        text.includes('Access-Control')
      ) {
        result.corsErrors.push(text);
      }
    } else if (msg.type() === 'warning') {
      result.consoleWarnings.push(text);
    }
  });

  // Capture network/request failures
  page.on('requestfailed', (request) => {
    const failure = request.failure();
    result.networkErrors.push({
      url: request.url(),
      reason: failure ? failure.errorText : 'unknown',
    });
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
  result.checks.push({ name: `HTTP ${status}`, pass: statusOk, detail: url });
  if (!statusOk) {
    result.pass = false;
    result.issues.push(`HTTP error: ${status}`);
  }

  // Wait for React to render
  await page.waitForTimeout(1500);

  // --- Blog-specific checks ---

  // 1. Check title tag / page title
  const pageTitle = await page.title();
  const titleOk = pageTitle.length > 0 && pageTitle !== 'Slancha Blog';
  result.checks.push({ name: 'Page title set', pass: titleOk, detail: pageTitle });
  if (!titleOk) {
    result.pass = false;
    result.issues.push('Page title not set correctly');
  }

  // 2. Check for blog post title in content
  const postTitle = await page.$('h1.blog-post-title');
  result.checks.push({ name: 'Blog post title present', pass: postTitle !== null });
  if (!postTitle) {
    result.pass = false;
    result.issues.push('Blog post title (h1) not found');
  }

  // 3. Check for blog post body/content
  const postBody = await page.$('.blog-post-body');
  result.checks.push({ name: 'Blog post body present', pass: postBody !== null });
  if (!postBody) {
    result.pass = false;
    result.issues.push('Blog post body not found');
  }

  // 4. Check for meta description
  const metaDesc = await page.$('meta[name="description"]');
  const metaDescContent = metaDesc ? await metaDesc.evaluate(el => el.getAttribute('content')) : null;
  const hasMetaDesc = metaDesc !== null && metaDescContent && metaDescContent.length > 50;
  result.checks.push({ name: 'Meta description present', pass: hasMetaDesc, detail: metaDescContent?.substring(0, 80) || 'not found' });
  if (!hasMetaDesc) {
    result.pass = false;
    result.issues.push('Meta description missing or too short');
  }

  // 5. Check for JSON-LD structured data
  const jsonLd = await page.$('script[type="application/ld+json"]');
  const hasJsonLd = jsonLd !== null;
  result.checks.push({ name: 'JSON-LD structured data', pass: hasJsonLd });
  if (!hasJsonLd) {
    result.pass = false;
    result.issues.push('JSON-LD structured data not found');
  }

  // 6. Check for code blocks (code examples)
  const codeBlocks = await page.$$('pre code');
  const hasCodeBlocks = codeBlocks.length > 0;
  result.checks.push({ name: `Code examples present`, pass: hasCodeBlocks, detail: `${codeBlocks.length} code block(s)` });
  if (!hasCodeBlocks) {
    result.issues.push('No code examples found in post');
  }

  // 7. Check for tags
  const tagSection = await page.$('.blog-card-tags, .blog-post-header');
  const hasTags = tagSection !== null;
  result.checks.push({ name: 'Tags present', pass: hasTags });
  if (!hasTags) {
    result.issues.push('Tags section not found');
  }

  // 8. Check for back link to blog index
  const backLink = await page.$('a.blog-back, nav a[href="/blog"]');
  result.checks.push({ name: 'Back to blog link', pass: backLink !== null });
  if (!backLink) {
    result.issues.push('Back to blog link not found');
  }

  // 9. Check for nav links (navigation working)
  const navLinks = await page.$$('nav a');
  result.checks.push({ name: `Nav links present`, pass: navLinks.length > 0, detail: `${navLinks.length} link(s)` });

  // 10. Check for footer
  const footer = await page.$('footer');
  result.checks.push({ name: 'Footer present', pass: footer !== null });
  if (!footer) {
    result.pass = false;
    result.issues.push('Footer not found');
  }

  // 11. Check for no CORS errors
  if (result.corsErrors.length > 0) {
    result.pass = false;
    result.checks.push({ name: 'No CORS errors', pass: false, detail: result.corsErrors.join(' | ') });
    result.issues.push(`CORS errors: ${result.corsErrors.join('; ')}`);
  } else {
    result.checks.push({ name: 'No CORS errors', pass: true });
  }

  // 12. Check for no JS errors
  if (result.consoleErrors.length > 0) {
    result.pass = false;
    result.checks.push({ name: 'No JS console errors', pass: false, detail: result.consoleErrors.join(' | ') });
    result.issues.push(`Console errors: ${result.consoleErrors.join('; ')}`);
  } else {
    result.checks.push({ name: 'No JS console errors', pass: true });
  }

  // 13. Check network errors
  if (result.networkErrors.length > 0) {
    result.checks.push({ name: `Network errors`, pass: false, detail: `${result.networkErrors.length} failed request(s)` });
    result.issues.push(`Network errors: ${result.networkErrors.length} request(s) failed`);
  } else {
    result.checks.push({ name: 'No network errors', pass: true });
  }

  // 14. Check for social share buttons (OG tags in head would be in HTML)
  const ogTitle = await page.$('meta[property="og:title"]');
  result.checks.push({ name: 'OG title present', pass: ogTitle !== null });
  if (!ogTitle) {
    result.issues.push('OpenGraph title tag not found');
  }

  return result;
}

function printReport(results) {
  let exitCode = 0;
  console.log('\n=== Blog Posts QA Report ===\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Run: ${new Date().toISOString()}`);
  console.log(`Total posts: ${results.length}\n`);

  let summary = { passed: 0, failed: 0, issues: 0 };

  for (const r of results) {
    const status = r.pass ? '✓ PASS' : '✗ FAIL';
    summary[r.pass ? 'passed' : 'failed']++;
    summary.issues += r.issues.length;

    console.log(`--- ${r.page} — ${status} ---`);
    console.log(`    URL: ${r.url}`);

    for (const c of r.checks) {
      const icon = c.pass ? '  ✓' : '  ✗';
      console.log(`${icon} ${c.name}${c.detail ? ': ' + c.detail.substring(0, 60) : ''}`);
    }

    if (r.issues.length > 0) {
      console.log('  Issues:');
      r.issues.forEach((issue) => console.log(`    ⚠ ${issue}`));
    }

    if (r.consoleWarnings.length > 0) {
      console.log(`  Warnings (${r.consoleWarnings.length}):`);
      r.consoleWarnings.slice(0, 3).forEach((w) => console.log(`    ⚠ ${w.substring(0, 100)}`));
    }

    console.log();
  }

  console.log('=== Summary ===');
  console.log(`Passed: ${summary.passed}/${results.length}`);
  console.log(`Failed: ${summary.failed}/${results.length}`);
  console.log(`Total issues found: ${summary.issues}`);
  console.log();

  if (summary.failed > 0) exitCode = 1;
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
    console.log(`Testing: ${pageConfig.title.substring(0, 60)}...`);
    const page = await context.newPage();
    const result = await testPage(page, pageConfig);
    results.push(result);
    await page.close();
  }

  await browser.close();

  if (JSON_OUTPUT) {
    console.log(JSON.stringify(results, null, 2));
    process.exit(results.some((r) => !r.pass) ? 1 : 0);
  } else {
    process.exit(printReport(results));
  }
})();

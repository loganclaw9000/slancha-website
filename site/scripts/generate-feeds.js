#!/usr/bin/env node
/**
 * Generates RSS 2.0 and JSON Feed from blog content.
 * Run after build: node scripts/generate-feeds.js
 * Outputs to dist/rss.xml and dist/feed.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// Import blog posts — they're ES modules, so we dynamically import
const blogModule = await import('../src/content/blog/index.js');
const posts = blogModule.posts;

const SITE_URL = 'https://slancha.ai';
const SITE_TITLE = 'Slancha Blog';
const SITE_DESC = 'Technical deep dives, tutorials, and insights on AI inference: intelligent routing, automated fine-tuning, inference optimization, and the closed-loop AI pipeline.';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate RSS 2.0
function generateRSS() {
  const items = posts.map(post => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>team@slancha.ai (${escapeXml(post.author)})</author>
      ${post.tags.map(t => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/favicon.svg</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}/blog</link>
    </image>
${items}
  </channel>
</rss>`;
}

// Generate JSON Feed (https://jsonfeed.org/version/1.1)
function generateJSONFeed() {
  return JSON.stringify({
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE_TITLE,
    home_page_url: `${SITE_URL}/blog`,
    feed_url: `${SITE_URL}/feed.json`,
    description: SITE_DESC,
    icon: `${SITE_URL}/favicon.svg`,
    language: 'en-US',
    items: posts.map(post => ({
      id: `${SITE_URL}/blog/${post.slug}`,
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      summary: post.excerpt,
      date_published: new Date(post.date).toISOString(),
      authors: [{ name: post.author }],
      tags: post.tags,
    })),
  }, null, 2);
}

if (!existsSync(distDir)) {
  console.error('dist/ directory not found. Run `npm run build` first.');
  process.exit(1);
}

writeFileSync(join(distDir, 'rss.xml'), generateRSS());
writeFileSync(join(distDir, 'feed.json'), generateJSONFeed());
console.log(`Generated RSS feed (${posts.length} posts) → dist/rss.xml`);
console.log(`Generated JSON feed (${posts.length} posts) → dist/feed.json`);

/**
 * Generate llms-full.txt — comprehensive markdown export of all Slancha documentation.
 *
 * Concatenates: llms.txt header + all doc pages + FAQ + pricing info.
 * Run: node scripts/generate-llms-full.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function main() {
  const parts = [];

  // 1. Start with llms.txt header
  const llmsTxt = fs.readFileSync(path.join(root, 'public', 'llms.txt'), 'utf-8');
  parts.push(llmsTxt);
  parts.push('\n\n---\n\n# Full Documentation\n\n');

  // 2. Import docs content
  const docsModule = await import(path.join(root, 'src', 'content', 'docs', 'index.js'));
  const docs = docsModule.default || docsModule.docs;

  for (const doc of docs) {
    parts.push(`## ${doc.title}\n\n`);
    if (doc.section) parts.push(`*Section: ${doc.section}*\n\n`);
    parts.push(doc.body.trim());
    parts.push('\n\n---\n\n');
  }

  // 3. Import blog content (titles + summaries only to keep size reasonable)
  try {
    const blogModule = await import(path.join(root, 'src', 'content', 'blog', 'index.js'));
    const posts = blogModule.default || blogModule.posts;

    parts.push('# Blog Posts\n\n');
    for (const post of posts) {
      parts.push(`## ${post.title}\n\n`);
      parts.push(`*${post.date} | ${post.category || 'General'}*\n\n`);
      if (post.excerpt || post.summary) {
        parts.push((post.excerpt || post.summary).trim());
        parts.push('\n\n');
      }
      parts.push(`[Read full post](https://slancha.ai/blog/${post.slug})\n\n---\n\n`);
    }
  } catch (e) {
    console.warn('Could not import blog content:', e.message);
  }

  // 4. Pricing summary
  parts.push('# Pricing\n\n');
  parts.push('## Plans\n\n');
  parts.push('| Tier | Price | Includes |\n');
  parts.push('|------|-------|----------|\n');
  parts.push('| Starter | Free | 10K requests/month, 20+ models, smart routing, zero markup |\n');
  parts.push('| Pro | $49/month | Unlimited requests, all models, analytics, A/B testing |\n');
  parts.push('| Scale | $499/month | Automated fine-tuning, inference optimization, 40-60% cheaper than frontier |\n');
  parts.push('| Enterprise | Custom | Self-hosted, SOC 2, HIPAA, SSO, dedicated support |\n\n');
  parts.push('## Token Pricing\n\n');
  parts.push('Slancha charges zero markup on routed requests — you pay exactly what the underlying model provider charges.\n\n');
  parts.push('Fine-tuned models on the Scale plan are significantly cheaper:\n');
  parts.push('- Fine-tuned 7B: $0.05 input / $0.10 output per 1M tokens (vs $3.00/$15.00 frontier)\n');
  parts.push('- Fine-tuned 14B: $0.12 input / $0.25 output per 1M tokens\n');
  parts.push('- Fine-tuned 70B: $0.50 input / $0.80 output per 1M tokens\n\n');

  // Write output
  const output = parts.join('');
  const outPath = path.join(root, 'public', 'llms-full.txt');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`Generated llms-full.txt (${(output.length / 1024).toFixed(1)} KB, ${output.split('\n').length} lines) → ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });

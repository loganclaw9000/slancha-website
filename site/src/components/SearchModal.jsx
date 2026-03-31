import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { docs } from '../content/docs';
import { posts } from '../content/blog';
import './SearchModal.css';

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/#+\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>|]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

const pages = [
  { title: 'Home', path: '/', desc: 'Main landing page', section: 'Navigate' },
  { title: 'Pricing', path: '/pricing', desc: 'Plans and pricing tiers', section: 'Navigate' },
  { title: 'Pricing Compare', path: '/pricing/compare', desc: 'Side-by-side competitor pricing', section: 'Navigate' },
  { title: 'Contact', path: '/contact', desc: 'Get in touch with our team', section: 'Navigate' },
  { title: 'Blog', path: '/blog', desc: 'Technical articles and guides', section: 'Navigate' },
  { title: 'Documentation', path: '/docs', desc: 'API docs, SDKs, and guides', section: 'Navigate' },
  { title: 'FAQ', path: '/faq', desc: 'Frequently asked questions', section: 'Navigate' },
  { title: 'Use Cases', path: '/use-cases', desc: 'By industry and team size', section: 'Navigate' },
  { title: 'Case Studies', path: '/case-studies', desc: 'Real customer results', section: 'Navigate' },
  { title: 'Integrations', path: '/integrations', desc: '31 platforms supported', section: 'Navigate' },
  { title: 'ROI Calculator', path: '/roi-calculator', desc: 'Estimate your savings', section: 'Navigate' },
  { title: 'Changelog', path: '/changelog', desc: 'Latest releases and updates', section: 'Navigate' },
  { title: 'API Playground', path: '/playground', desc: 'Try the API interactively', section: 'Navigate' },
  { title: 'Enterprise', path: '/enterprise', desc: 'Cloud, VPC, or on-prem deployment', section: 'Navigate' },
  { title: 'Security', path: '/security', desc: 'SOC 2, HIPAA, GDPR compliance', section: 'Navigate' },
  { title: 'Product Demo', path: '/demo', desc: '5-step interactive walkthrough', section: 'Navigate' },
  { title: 'Benchmarks', path: '/benchmarks', desc: 'Latency, quality, and cost data', section: 'Navigate' },
  { title: 'System Status', path: '/status', desc: 'Real-time system health', section: 'Navigate' },
  { title: 'Glossary', path: '/glossary', desc: 'AI inference terminology', section: 'Navigate' },
  { title: 'Resources', path: '/resources', desc: 'Guides, tools, and downloads', section: 'Navigate' },
  { title: 'Developers', path: '/developers', desc: 'Developer hub and SDK docs', section: 'Navigate' },
  { title: 'Pilot Program', path: '/pilot', desc: 'Prove ROI in 4-6 weeks', section: 'Navigate' },
  { title: 'Compare Competitors', path: '/vs-competitors', desc: 'All competitors side-by-side', section: 'Navigate' },
  { title: 'vs Portkey', path: '/vs/portkey', desc: 'Gateway vs optimization engine', section: 'Navigate' },
  { title: 'vs OpenRouter', path: '/vs/openrouter', desc: 'Marketplace vs closed loop', section: 'Navigate' },
  { title: 'vs Not Diamond', path: '/vs/not-diamond', desc: 'Offline vs real-time optimization', section: 'Navigate' },
  { title: 'vs Fireworks AI', path: '/vs/fireworks', desc: 'Engineer tools vs team results', section: 'Navigate' },
  { title: 'vs BaseTen', path: '/vs/baseten', desc: 'Infrastructure vs platform', section: 'Navigate' },
  { title: 'Fintech Solutions', path: '/solutions/fintech', desc: 'SOC 2 and PCI-DSS ready', section: 'Navigate' },
  { title: 'Healthtech Solutions', path: '/solutions/healthtech', desc: 'HIPAA-compliant inference', section: 'Navigate' },
  { title: 'E-Commerce Solutions', path: '/solutions/ecommerce', desc: 'Scale to millions of SKUs', section: 'Navigate' },
  { title: 'Terms of Service', path: '/terms', desc: 'Legal terms and conditions', section: 'Navigate' },
  { title: 'Privacy Policy', path: '/privacy', desc: 'Data handling and GDPR', section: 'Navigate' },
];

const dashboardPages = [
  { title: 'Dashboard Overview', path: '/dashboard', desc: 'Your project at a glance', section: 'Dashboard' },
  { title: 'API Keys', path: '/dashboard/keys', desc: 'Create and manage API keys', section: 'Dashboard' },
  { title: 'Usage Analytics', path: '/dashboard/usage', desc: 'Request volume and latency', section: 'Dashboard' },
  { title: 'Models & Routing', path: '/dashboard/models', desc: 'Active model pool and routes', section: 'Dashboard' },
  { title: 'Evaluations', path: '/dashboard/evals', desc: 'Eval runs and model scores', section: 'Dashboard' },
  { title: 'Fine-Tuning', path: '/dashboard/fine-tuning', desc: 'Training jobs and datasets', section: 'Dashboard' },
  { title: 'Optimization', path: '/dashboard/optimization', desc: 'QAT, MIG, multi-token prediction', section: 'Dashboard' },
  { title: 'Deployments', path: '/dashboard/deployments', desc: 'Active model deployments', section: 'Dashboard' },
  { title: 'Request Logs', path: '/dashboard/logs', desc: 'Request history and debugging', section: 'Dashboard' },
  { title: 'Team Management', path: '/dashboard/team', desc: 'Members, roles, and invites', section: 'Dashboard' },
  { title: 'Billing', path: '/dashboard/billing', desc: 'Plan, invoices, and payment', section: 'Dashboard' },
  { title: 'Webhooks', path: '/dashboard/webhooks', desc: 'Event subscriptions and logs', section: 'Dashboard' },
  { title: 'Settings', path: '/dashboard/settings', desc: 'Account and project settings', section: 'Dashboard' },
];

const quickActions = [
  { title: 'Create API Key', path: '/dashboard/keys', desc: 'Generate a new API key', section: 'Quick Actions', icon: 'key' },
  { title: 'Start Free Trial', path: '/signup', desc: 'Create your account', section: 'Quick Actions', icon: 'plus' },
  { title: 'View Documentation', path: '/docs', desc: 'API reference and guides', section: 'Quick Actions', icon: 'book' },
  { title: 'Try API Playground', path: '/playground', desc: 'Test endpoints interactively', section: 'Quick Actions', icon: 'play' },
  { title: 'Contact Sales', path: '/contact', desc: 'Talk to our team', section: 'Quick Actions', icon: 'mail' },
  { title: 'Calculate ROI', path: '/roi-calculator', desc: 'Estimate cost savings', section: 'Quick Actions', icon: 'calc' },
];

function buildIndex() {
  const items = [];

  // Quick actions (highest priority for empty state)
  for (const action of quickActions) {
    items.push({
      type: 'action',
      title: action.title,
      section: action.section,
      path: action.path,
      desc: action.desc,
      icon: action.icon,
      text: (action.title + ' ' + action.desc).toLowerCase(),
      titleLower: action.title.toLowerCase(),
    });
  }

  // Pages
  for (const page of pages) {
    items.push({
      type: 'page',
      title: page.title,
      section: page.section,
      path: page.path,
      desc: page.desc,
      text: (page.title + ' ' + page.desc).toLowerCase(),
      titleLower: page.title.toLowerCase(),
    });
  }

  // Dashboard pages
  for (const page of dashboardPages) {
    items.push({
      type: 'dashboard',
      title: page.title,
      section: page.section,
      path: page.path,
      desc: page.desc,
      text: (page.title + ' ' + page.desc).toLowerCase(),
      titleLower: page.title.toLowerCase(),
    });
  }

  // Docs
  for (const doc of docs) {
    items.push({
      type: 'doc',
      title: doc.title,
      section: doc.section,
      slug: doc.slug,
      path: `/docs/${doc.slug}`,
      text: stripMarkdown(doc.body).toLowerCase(),
      titleLower: doc.title.toLowerCase(),
    });
  }

  // Blog posts
  for (const post of posts) {
    items.push({
      type: 'blog',
      title: post.title,
      section: post.date,
      slug: post.slug,
      path: `/blog/${post.slug}`,
      text: (stripMarkdown(post.body) + ' ' + (post.excerpt || '') + ' ' + (post.tags || []).join(' ')).toLowerCase(),
      titleLower: post.title.toLowerCase(),
    });
  }

  return items;
}

function search(index, query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = [];
  for (const item of index) {
    let score = 0;
    const titleMatch = terms.every(t => item.titleLower.includes(t));
    const bodyMatch = terms.every(t => item.text.includes(t));

    if (titleMatch) score += 10;
    if (bodyMatch) score += 1;

    // Exact phrase bonus
    if (item.titleLower.includes(q)) score += 20;
    if (item.text.includes(q)) score += 3;

    // Type priority boost
    if (item.type === 'action') score += 5;
    if (item.type === 'page') score += 2;
    if (item.type === 'dashboard') score += 2;

    if (score > 0) {
      let snippet = item.desc || '';
      if (!snippet && item.text) {
        const idx = item.text.indexOf(terms[0]);
        if (idx >= 0) {
          const start = Math.max(0, idx - 60);
          const end = Math.min(item.text.length, idx + 120);
          snippet = (start > 0 ? '...' : '') + item.text.slice(start, end) + (end < item.text.length ? '...' : '');
        }
      }
      scored.push({ ...item, score, snippet });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 15);
}

const typeLabels = {
  action: 'Action',
  page: 'Page',
  dashboard: 'Dashboard',
  doc: 'Docs',
  blog: 'Blog',
};

const actionIcons = {
  key: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  book: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  play: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  mail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  calc: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="16" y1="18" x2="16" y2="18"/><line x1="8" y1="10" x2="16" y2="10"/></svg>,
};

function groupResults(results) {
  const groups = {};
  for (const r of results) {
    const label = typeLabels[r.type] || r.type;
    if (!groups[label]) groups[label] = [];
    groups[label].push(r);
  }
  return groups;
}

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const index = useMemo(() => buildIndex(), []);
  const results = useMemo(() => search(index, query), [index, query]);
  const grouped = useMemo(() => query.length >= 2 ? groupResults(results) : null, [results, query]);

  // Flatten grouped results for keyboard navigation
  const flatResults = useMemo(() => {
    if (!grouped) return [];
    const flat = [];
    for (const label of Object.keys(grouped)) {
      for (const r of grouped[label]) flat.push(r);
    }
    return flat;
  }, [grouped]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll selected result into view
  useEffect(() => {
    if (resultsRef.current) {
      const el = resultsRef.current.querySelector('.search-result.selected');
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [selected]);

  const go = useCallback((path) => {
    onClose();
    navigate(path);
  }, [onClose, navigate]);

  const handleKeyDown = (e) => {
    const list = flatResults;
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, list.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && list[selected]) {
      go(list[selected].path);
    }
  };

  if (!open) return null;

  // Default quick actions shown before typing
  const defaultActions = quickActions.slice(0, 6);

  let flatIdx = 0;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search pages, docs, blog, or jump to..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="search-kbd">Esc</kbd>
        </div>

        {query.length >= 2 && (
          <div className="search-results" ref={resultsRef}>
            {flatResults.length === 0 ? (
              <div className="search-empty">No results for "{query}"</div>
            ) : (
              Object.entries(grouped).map(([label, items]) => (
                <div key={label} className="search-group">
                  <div className="search-group-label">{label}</div>
                  {items.map((r) => {
                    const idx = flatIdx++;
                    return (
                      <button
                        key={r.path + r.title}
                        className={`search-result${idx === selected ? ' selected' : ''}`}
                        onClick={() => go(r.path)}
                        onMouseEnter={() => setSelected(idx)}
                      >
                        <span className={`search-result-badge ${r.type}`}>
                          {r.type === 'action' && r.icon && actionIcons[r.icon]
                            ? actionIcons[r.icon]
                            : typeLabels[r.type]}
                        </span>
                        <div className="search-result-body">
                          <span className="search-result-title">{r.title}</span>
                          {r.snippet && <span className="search-result-snippet">{r.snippet}</span>}
                        </div>
                        <svg className="search-result-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="search-results">
            <div className="search-group">
              <div className="search-group-label">Quick Actions</div>
              {defaultActions.map((action, i) => (
                <button
                  key={action.path}
                  className="search-result"
                  onClick={() => go(action.path)}
                >
                  <span className="search-result-badge action">
                    {actionIcons[action.icon] || action.icon}
                  </span>
                  <div className="search-result-body">
                    <span className="search-result-title">{action.title}</span>
                    <span className="search-result-snippet">{action.desc}</span>
                  </div>
                  <svg className="search-result-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              ))}
            </div>

            <div className="search-hints" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="search-shortcuts">
                <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Open</span>
                <span><kbd>Esc</kbd> Close</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

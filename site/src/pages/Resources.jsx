import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { posts } from '../content/blog';
import usePageMeta from '../hooks/usePageMeta';
import './Resources.css';

const CONTENT_TYPES = {
  all: 'All',
  blog: 'Blog',
  guides: 'Guides',
  docs: 'Documentation',
  tools: 'Tools',
  'case-studies': 'Case Studies',
};

const resources = [
  // Blog posts (auto-generated from blog content)
  ...posts.map(p => ({
    type: 'blog',
    title: p.title,
    description: p.excerpt,
    link: `/blog/${p.slug}`,
    date: p.date,
    tags: p.tags,
    author: p.author,
  })),

  // Guides
  {
    type: 'guides',
    title: 'Developer Quickstart',
    description: 'Install the SDK, run your first eval, and deploy a model in under 5 minutes.',
    link: '/docs/quickstart',
    date: '2026-03-29',
    tags: ['getting-started', 'sdk'],
  },
  {
    type: 'guides',
    title: 'Migration Guide',
    description: 'Step-by-step migration from OpenAI, Anthropic, Portkey, OpenRouter, Fireworks, and Not Diamond with code examples.',
    link: '/docs/migration',
    date: '2026-03-31',
    tags: ['migration', 'getting-started'],
  },
  {
    type: 'guides',
    title: 'Post-Training Guide',
    description: 'How Slancha automatically uses production data to drive fine-tuning, promote top-performing models, and continuously improve inference quality.',
    link: '/docs/post-training',
    date: '2026-03-30',
    tags: ['fine-tuning', 'training'],
  },
  {
    type: 'guides',
    title: 'Tutorials: Build Your First Eval Suite',
    description: 'Three hands-on tutorials: custom eval metrics, automated deployment gates, and fine-tuning from eval failures.',
    link: '/docs/tutorial-support-bot',
    date: '2026-03-31',
    tags: ['tutorial', 'eval'],
  },
  {
    type: 'guides',
    title: 'SDKs & Libraries',
    description: 'Python, TypeScript, OpenAI-compatible, and cURL reference for every Slancha endpoint.',
    link: '/docs/sdks',
    date: '2026-03-30',
    tags: ['sdk', 'libraries'],
  },

  // Documentation
  {
    type: 'docs',
    title: 'API Reference',
    description: 'Complete API documentation: evaluations, deployments, fine-tuning, datasets, router config, and webhooks.',
    link: '/docs/api-reference',
    date: '2026-03-30',
    tags: ['api', 'reference'],
  },
  {
    type: 'docs',
    title: 'Integrations',
    description: '31 integrations across model providers, cloud platforms, ML frameworks, observability, CI/CD, and communication tools.',
    link: '/integrations',
    date: '2026-03-30',
    tags: ['integrations'],
  },
  {
    type: 'docs',
    title: 'Changelog',
    description: 'Release history from v0.8 to v1.4 — new features, improvements, fixes, and API changes.',
    link: '/changelog',
    date: '2026-03-30',
    tags: ['changelog', 'releases'],
  },
  {
    type: 'docs',
    title: 'Security & Compliance',
    description: 'Data isolation, encryption, SOC 2 readiness, HIPAA, GDPR — how Slancha protects your data.',
    link: '/security',
    date: '2026-03-31',
    tags: ['security', 'compliance'],
  },

  // Tools
  {
    type: 'tools',
    title: 'API Playground',
    description: 'Try Slancha endpoints interactively — route, eval, deploy, fine-tune, and dataset operations with live responses.',
    link: '/playground',
    date: '2026-03-30',
    tags: ['playground', 'interactive'],
  },
  {
    type: 'tools',
    title: 'ROI Calculator',
    description: 'Calculate your savings: input your current spend, model usage, and team size to see TCO comparison.',
    link: '/roi-calculator',
    date: '2026-03-31',
    tags: ['roi', 'cost-optimization'],
  },
  {
    type: 'tools',
    title: 'Pricing Comparison',
    description: 'Side-by-side cost comparison against Portkey, OpenRouter, Not Diamond, Fireworks, and BaseTen.',
    link: '/pricing/compare',
    date: '2026-03-31',
    tags: ['pricing', 'comparison'],
  },
  {
    type: 'tools',
    title: 'Benchmarks',
    description: 'Latency, throughput, quality, and cost benchmarks for Slancha routing, fine-tuning, and optimization.',
    link: '/benchmarks',
    date: '2026-03-31',
    tags: ['benchmarks', 'performance'],
  },

  // Case Studies
  {
    type: 'case-studies',
    title: 'Fintech: From 6-Week Eval Cycles to Continuous Deployment',
    description: 'Series B fraud detection startup cut eval time from 6 weeks to 3 days with 23% fewer false positives.',
    link: '/case-studies',
    date: '2026-03-30',
    tags: ['fintech', 'case-study'],
  },
  {
    type: 'case-studies',
    title: 'Healthcare AI: Closing the Loop on Clinical NLP',
    description: 'Digital health platform improved entity extraction accuracy from 94% to 98.2% and eliminated repeated failure modes.',
    link: '/case-studies',
    date: '2026-03-30',
    tags: ['healthcare', 'case-study'],
  },
  {
    type: 'case-studies',
    title: 'E-Commerce: Cutting Model Serving Costs 60%',
    description: 'Top-50 marketplace saved $110K/month with intelligent routing — zero quality drop, ROI in under a week.',
    link: '/case-studies',
    date: '2026-03-30',
    tags: ['e-commerce', 'case-study'],
  },
];

function ResourceCard({ resource }) {
  const typeLabels = {
    blog: 'Blog',
    guides: 'Guide',
    docs: 'Docs',
    tools: 'Tool',
    'case-studies': 'Case Study',
  };

  return (
    <Link to={resource.link} className={`resource-card resource-type-${resource.type}`}>
      <div className="resource-card-header">
        <span className={`resource-badge ${resource.type}`}>{typeLabels[resource.type]}</span>
        {resource.date && <span className="resource-date">{resource.date}</span>}
      </div>
      <h3 className="resource-title">{resource.title}</h3>
      <p className="resource-desc">{resource.description}</p>
      {resource.tags && (
        <div className="resource-tags">
          {resource.tags.slice(0, 3).map(tag => (
            <span className="resource-tag" key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function Resources() {
  usePageMeta({
    title: 'Resources',
    description: 'Everything you need to build with Slancha: blog posts, tutorials, API docs, migration guides, benchmarks, and interactive tools.',
  });

  const [activeType, setActiveType] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let items = resources;
    if (activeType !== 'all') {
      items = items.filter(r => r.type === activeType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return items;
  }, [activeType, search]);

  const counts = useMemo(() => {
    const c = { all: resources.length };
    for (const r of resources) {
      c[r.type] = (c[r.type] || 0) + 1;
    }
    return c;
  }, []);

  return (
    <div className="page">
      <Nav />
      <main id="main-content" className="resources-page">
        <div className="resources-header">
          <h1>Resources</h1>
          <p>Blog posts, tutorials, documentation, tools, and case studies — everything you need to evaluate, deploy, and optimize AI models.</p>
        </div>

        <div className="resources-controls">
          <div className="resources-filters">
            {Object.entries(CONTENT_TYPES).map(([key, label]) => (
              <button
                key={key}
                className={`filter-btn ${activeType === key ? 'active' : ''}`}
                onClick={() => setActiveType(key)}
              >
                {label} <span className="filter-count">{counts[key] || 0}</span>
              </button>
            ))}
          </div>
          <div className="resources-search">
            <input
              type="text"
              placeholder="Search resources..."
              aria-label="Search resources"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="resources-empty">
            <p>No resources match your search. Try a different term or filter.</p>
          </div>
        ) : (
          <div className="resources-grid">
            {filtered.map((r, i) => (
              <ResourceCard key={`${r.type}-${r.link}-${i}`} resource={r} />
            ))}
          </div>
        )}

        <div className="resources-cta">
          <h2>Can't find what you're looking for?</h2>
          <p>Reach out to our team — we're happy to help.</p>
          <Link to="/contact" className="btn-primary">Contact Us</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

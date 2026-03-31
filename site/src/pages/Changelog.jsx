import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Changelog.css';

const entries = [
  {
    date: 'March 28, 2026',
    version: 'v1.4.0',
    major: true,
    title: 'Intelligent Model Router — GA',
    tags: ['feature', 'api'],
    items: [
      'Complexity-based routing across 15+ model providers',
      'Cost-ceiling constraints: set max $/request and the router respects it',
      'Latency-aware fallback chains with automatic failover',
      'Real-time routing analytics in dashboard',
      'OpenAI-compatible API — swap one line and start routing',
    ],
  },
  {
    date: 'March 21, 2026',
    version: 'v1.3.0',
    major: true,
    title: 'Eval-Driven Fine-Tuning Pipeline',
    tags: ['feature'],
    items: [
      'Eval failures automatically flow into fine-tuning datasets',
      'Configurable mixing ratios: balance new failures with retained knowledge',
      'Auto-promote: models that pass eval gates deploy without manual approval',
      'Training job monitoring with cost estimates and ETA',
      'Cancel running jobs from the dashboard',
    ],
  },
  {
    date: 'March 14, 2026',
    version: 'v1.2.0',
    major: false,
    title: 'Dashboard & API Keys',
    tags: ['feature', 'improvement'],
    items: [
      'Full dashboard with usage graphs, billing, and account settings',
      'API key management: create, rotate, revoke keys with scoped permissions',
      'Usage tracking: requests, tokens, cost breakdown by model and endpoint',
      'Billing history and invoice downloads',
    ],
  },
  {
    date: 'March 7, 2026',
    version: 'v1.1.0',
    major: false,
    title: 'Evaluation Suite Enhancements',
    tags: ['improvement', 'api'],
    items: [
      'Custom eval metrics: define scoring functions in Python or YAML',
      'Side-by-side model comparison with statistical significance testing',
      'Eval result webhooks — trigger CI/CD on pass/fail',
      'Dataset versioning: track which eval set each result was scored against',
      'CSV and JSON export for all eval results',
    ],
  },
  {
    date: 'February 28, 2026',
    version: 'v1.0.0',
    major: true,
    title: 'Slancha Platform Launch',
    tags: ['feature'],
    items: [
      'Core eval engine: run evaluations across any model via unified API',
      'One-click deployment to Slancha-managed inference endpoints',
      'Supabase-powered auth with email, Google, and GitHub SSO',
      'Docs, quickstart guide, Python and TypeScript SDKs',
      'Free tier: 10K router requests/month, 5 eval runs/day',
    ],
  },
  {
    date: 'February 14, 2026',
    version: 'v0.9.0',
    major: false,
    title: 'Beta Improvements',
    tags: ['fix', 'improvement'],
    items: [
      'Reduced eval cold-start latency from 8s to 1.2s',
      'Fixed token counting for multi-turn conversations',
      'Added retry logic for transient provider errors',
      'Improved error messages across all API endpoints',
      'OpenAPI spec published for all endpoints',
    ],
  },
  {
    date: 'January 31, 2026',
    version: 'v0.8.0',
    major: false,
    title: 'Docs & Developer Experience',
    tags: ['docs', 'improvement'],
    items: [
      'Comprehensive API reference with request/response examples',
      'Interactive quickstart that runs your first eval in 60 seconds',
      'SDK code generators for Python, TypeScript, and cURL',
      'Postman collection for all endpoints',
    ],
  },
];

export default function Changelog() {
  usePageMeta({
    title: 'Changelog',
    description:
      'See what\'s new in Slancha. Product updates, new features, and improvements to the AI engineering platform.',
  });

  return (
    <div className="page">
      <Nav />
      <main id="main-content" className="changelog-page">
        <div className="changelog-header">
          <h1>Changelog</h1>
          <p>What we shipped, when we shipped it. Every feature, fix, and improvement.</p>
        </div>

        <div className="changelog-timeline">
          {entries.map((entry) => (
            <article
              className={`changelog-entry${entry.major ? ' major' : ''}`}
              key={entry.version}
            >
              <div className="changelog-date">
                {entry.date}
                <span className="changelog-version">{entry.version}</span>
              </div>
              <h2>{entry.title}</h2>
              <div className="changelog-tags">
                {entry.tags.map((tag) => (
                  <span className={`changelog-tag ${tag}`} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <ul className="changelog-items">
                {entry.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="changelog-subscribe">
          <h3>Stay in the loop</h3>
          <p>Get notified when we ship new features. No spam, just product updates.</p>
          <Link to="/signup" className="btn-primary">Create Free Account</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

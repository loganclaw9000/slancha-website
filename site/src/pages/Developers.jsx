import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Developers.css';

const installTabs = [
  {
    lang: 'Python',
    install: 'pip install slancha',
    code: `from slancha import Slancha

client = Slancha(api_key="sk-...")

# One endpoint — Slancha picks the best model
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Summarize this contract"}],
    # No model parameter needed. The router handles it.
)

print(response.choices[0].message.content)
print(f"Model: {response.model}")          # e.g. gpt-4o
print(f"Latency: {response.usage.latency_ms}ms")
print(f"Cost: \${response.usage.cost:.4f}")`,
  },
  {
    lang: 'TypeScript',
    install: 'npm install @slancha/sdk',
    code: `import Slancha from '@slancha/sdk';

const client = new Slancha({ apiKey: 'sk-...' });

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Summarize this contract' }],
});

console.log(response.choices[0].message.content);
console.log(\`Model: \${response.model}\`);
console.log(\`Latency: \${response.usage.latency_ms}ms\`);`,
  },
  {
    lang: 'cURL',
    install: null,
    code: `curl -X POST https://api.slancha.ai/v1/chat/completions \\
  -H "Authorization: Bearer sk-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "user", "content": "Summarize this contract"}
    ]
  }'`,
  },
  {
    lang: 'OpenAI Compatible',
    install: 'pip install openai',
    code: `from openai import OpenAI

# Drop-in replacement — just change the base URL
client = OpenAI(
    api_key="sk-...",
    base_url="https://api.slancha.ai/v1"
)

response = client.chat.completions.create(
    model="auto",  # Slancha routes automatically
    messages=[{"role": "user", "content": "Summarize this contract"}],
)

print(response.choices[0].message.content)`,
  },
];

const quickLinks = [
  {
    title: 'Quickstart',
    desc: 'Install the SDK, create an API key, and make your first request in under 5 minutes.',
    link: '/docs/quickstart',
    icon: '→',
    tag: '5 min',
  },
  {
    title: 'API Reference',
    desc: 'Full endpoint documentation: routing, evals, deployments, fine-tuning, datasets, and webhooks.',
    link: '/docs/api-reference',
    icon: '{ }',
    tag: 'Reference',
  },
  {
    title: 'SDKs & Libraries',
    desc: 'Python, TypeScript, OpenAI-compatible mode, and cURL examples for every endpoint.',
    link: '/docs/sdks',
    icon: '📦',
    tag: 'SDKs',
  },
  {
    title: 'Migration Guide',
    desc: 'Step-by-step migration from OpenAI, Anthropic, Portkey, OpenRouter, Fireworks, and Not Diamond.',
    link: '/docs/migration',
    icon: '↗',
    tag: '6 platforms',
  },
  {
    title: 'Tutorials',
    desc: 'Build your first eval suite, set up deployment gates, and automate fine-tuning from eval failures.',
    link: '/docs/tutorials',
    icon: '📖',
    tag: '3 guides',
  },
  {
    title: 'API Playground',
    desc: 'Try every Slancha endpoint interactively with live responses — no setup required.',
    link: '/playground',
    icon: '▶',
    tag: 'Interactive',
  },
];

const features = [
  {
    title: 'OpenAI-Compatible API',
    desc: 'Change one line — your base URL. All OpenAI SDK code works with Slancha out of the box. No lock-in.',
  },
  {
    title: 'Automatic Model Routing',
    desc: 'Don\'t pick models. Send your request and the router selects the optimal model based on task, cost, and latency constraints.',
  },
  {
    title: 'Eval-Driven Fine-Tuning',
    desc: 'Failed evals automatically generate training data. Models improve continuously without manual intervention.',
  },
  {
    title: 'Real-Time Observability',
    desc: 'Every request logged with model, latency, cost, and quality scores. Export to your SIEM or use the built-in dashboard.',
  },
  {
    title: 'Webhooks & Events',
    desc: 'Subscribe to routing decisions, eval completions, deployment events, and fine-tuning progress via webhooks.',
  },
  {
    title: 'Inference Optimization',
    desc: 'QAT quantization, MIG GPU partitioning, and multi-token prediction applied automatically. You get the benefits without the complexity.',
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className="dev-copy-btn" onClick={handleCopy} title="Copy to clipboard">
      {copied ? '✓' : 'Copy'}
    </button>
  );
}

export default function Developers() {
  usePageMeta({
    title: 'Developers',
    description: 'Build with Slancha: SDKs for Python and TypeScript, OpenAI-compatible API, interactive playground, migration guides, and full API reference. First API call in 5 minutes.',
  });

  const [activeTab, setActiveTab] = useState(0);
  const tab = installTabs[activeTab];

  return (
    <div className="page">
      <Nav />
      <main className="developers-page">
        {/* Hero */}
        <section className="dev-hero">
          <span className="dev-eyebrow">Developer Portal</span>
          <h1>Build with Slancha</h1>
          <p>
            One API endpoint. Any model. Automatic routing, fine-tuning, and optimization.
            Get started in 5 minutes with Python, TypeScript, or any OpenAI-compatible SDK.
          </p>
          <div className="dev-hero-ctas">
            <Link to="/signup" className="btn-primary btn-lg">Get API Key</Link>
            <Link to="/docs/quickstart" className="btn-secondary btn-lg">Read the Docs</Link>
          </div>
        </section>

        {/* Code Example */}
        <section className="dev-code-section">
          <h2>Your first request</h2>
          <p className="dev-section-sub">Install the SDK and make a request — Slancha handles routing, optimization, and model selection.</p>

          <div className="dev-code-tabs">
            {installTabs.map((t, i) => (
              <button
                key={t.lang}
                className={`dev-tab ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {t.lang}
              </button>
            ))}
          </div>

          <div className="dev-code-block">
            {tab.install && (
              <div className="dev-install-line">
                <code>$ {tab.install}</code>
                <CopyButton text={tab.install} />
              </div>
            )}
            <div className="dev-code-content">
              <CopyButton text={tab.code} />
              <pre><code>{tab.code}</code></pre>
            </div>
          </div>
        </section>

        {/* Quick Links Grid */}
        <section className="dev-links-section">
          <h2>Everything you need</h2>
          <p className="dev-section-sub">Docs, guides, tools, and references to build production AI applications.</p>
          <div className="dev-links-grid">
            {quickLinks.map((item) => (
              <Link to={item.link} className="dev-link-card" key={item.title}>
                <div className="dev-link-header">
                  <span className="dev-link-icon">{item.icon}</span>
                  <span className="dev-link-tag">{item.tag}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Developer Features */}
        <section className="dev-features-section">
          <h2>Built for developers</h2>
          <p className="dev-section-sub">Every feature designed to reduce complexity, not add it.</p>
          <div className="dev-features-grid">
            {features.map((f) => (
              <div className="dev-feature-card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* OpenAI Compatibility Callout */}
        <section className="dev-compat-section">
          <div className="dev-compat-content">
            <h2>Already using OpenAI?</h2>
            <p>
              Slancha is fully compatible with the OpenAI SDK. Change your base URL,
              and your existing code works — with automatic routing, cost optimization,
              and continuous model improvement on top.
            </p>
            <div className="dev-compat-steps">
              <div className="dev-compat-step">
                <span className="dev-step-num">1</span>
                <div>
                  <strong>Change base URL</strong>
                  <code>base_url="https://api.slancha.ai/v1"</code>
                </div>
              </div>
              <div className="dev-compat-step">
                <span className="dev-step-num">2</span>
                <div>
                  <strong>Use your Slancha API key</strong>
                  <code>api_key="sk-..."</code>
                </div>
              </div>
              <div className="dev-compat-step">
                <span className="dev-step-num">3</span>
                <div>
                  <strong>That's it</strong>
                  <span>Automatic routing, fine-tuning, and optimization kick in immediately.</span>
                </div>
              </div>
            </div>
            <Link to="/docs/migration" className="btn-primary">Migration Guide</Link>
          </div>
        </section>

        {/* Blog / Deep Dives */}
        <section className="dev-blog-section">
          <h2>Technical deep dives</h2>
          <p className="dev-section-sub">Architecture decisions, production patterns, and optimization techniques.</p>
          <div className="dev-blog-grid">
            <Link to="/blog/building-a-production-ai-router-architecture-patterns" className="dev-blog-card">
              <span className="dev-blog-tag">Architecture</span>
              <h3>Building a Production AI Router</h3>
              <p>6 patterns for embedding classification, circuit breakers, shadow traffic, and adaptive route learning.</p>
            </Link>
            <Link to="/blog/ai-inference-optimization-qat-mig-multi-token" className="dev-blog-card">
              <span className="dev-blog-tag">Optimization</span>
              <h3>AI Inference Optimization: QAT, MIG, and Multi-Token Prediction</h3>
              <p>Deep technical guide with benchmarks, code examples, and how Slancha applies each technique.</p>
            </Link>
            <Link to="/blog/how-eval-data-should-drive-fine-tuning-technical-deep-dive" className="dev-blog-card">
              <span className="dev-blog-tag">Fine-Tuning</span>
              <h3>How Eval Data Should Drive Fine-Tuning</h3>
              <p>The eval→train loop: mixing ratios, data selection, auto-promotion, and common pitfalls.</p>
            </Link>
          </div>
          <div className="dev-blog-all">
            <Link to="/blog" className="btn-secondary">All Blog Posts →</Link>
          </div>
        </section>

        {/* CTA */}
        <section className="dev-cta-section">
          <h2>Start building today</h2>
          <p>Free tier includes 10,000 requests/month. No credit card required.</p>
          <div className="dev-cta-buttons">
            <Link to="/signup" className="btn-primary btn-lg">Create Free Account</Link>
            <Link to="/pricing" className="btn-secondary btn-lg">View Pricing</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

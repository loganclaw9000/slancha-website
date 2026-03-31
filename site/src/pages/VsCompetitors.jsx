import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import '../components/VsCompetitors.css';

const competitors = [
  {
    id: 'portkey',
    name: 'Portkey',
    tagline: 'AI Gateway & Governance',
    funding: '$15M Series A (Feb 2026)',
    keyMessage: 'Portkey governs your AI. Slancha optimizes it.',
    paragraphs: [
      'Portkey is an AI gateway and production control plane. It routes across 1,600+ LLMs with sub-millisecond latency, provides observability, guardrails, governance, prompt management, and cost controls. It processes 1T+ tokens daily across 24,000+ organizations.',
      "Portkey is an operations and governance layer. It routes, monitors, and controls — but it does not learn, fine-tune, or optimize inference for you. Customers still choose models.",
      "Slancha closes the loop. Where Portkey makes multi-model management reliable, Slancha makes it invisible. No model selection, no benchmarking, no governance configuration needed.",
    ],
    strengths: ['Routing across 1,600+ LLMs', 'Enterprise governance (policy-as-code)', 'Open-sourced gateway', 'MCP Gateway for agentic AI'],
    slanchaAdvantage: 'Portkey manages complexity. Slancha eliminates it.',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    tagline: 'Unified LLM API Marketplace',
    funding: 'Private',
    keyMessage: 'OpenRouter is a marketplace. Slancha is an optimization engine.',
    paragraphs: [
      'OpenRouter is a unified API for accessing and routing requests across multiple LLM providers. It aggregates providers behind a single endpoint and scouts for lowest prices and best latencies.',
      'Users can let the router auto-select or pick models manually. It optimizes for cost, latency, and throughput — but it exposes choice rather than removing it.',
      "OpenRouter doesn't analyze task patterns, fine-tune models, or improve over time. It's a smarter switchboard. Slancha learns from your traffic, builds custom models, and gets cheaper and better the longer you use it.",
    ],
    strengths: ['Wide model selection', 'Price/latency optimization', 'Simple unified API', 'Community-driven model rankings'],
    slanchaAdvantage: "OpenRouter finds you the best price today. Slancha builds you the best model over time.",
  },
  {
    id: 'not-diamond',
    name: 'Not Diamond',
    tagline: 'ML-Based Model Router',
    funding: 'Private',
    keyMessage: 'Not Diamond recommends. Slancha builds.',
    paragraphs: [
      'Not Diamond is the closest competitor in philosophy — an AI model router that acts as a "meta-model," recommending the best LLM for each query in under 50ms. It supports custom router training with customer evaluation data.',
      'The key difference is execution model. Not Diamond requires customers to explicitly provide evaluation data upfront, pay to optimize, and trigger optimization jobs via API. It runs offline and operates as a recommendation layer.',
      'Slancha learns continuously from live traffic with no explicit action required. More critically, Not Diamond routes to existing models. Slancha creates new ones through automated fine-tuning and serves them with optimized inference.',
    ],
    strengths: ['Per-query model recommendation', 'Client-side execution (data stays local)', 'Custom router training', 'Up to 25% accuracy improvement claims'],
    slanchaAdvantage: 'Not Diamond optimizes which existing model to call. Slancha builds you a better one.',
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    tagline: 'High-Performance Inference Platform',
    funding: '$254M raised, $4B valuation',
    keyMessage: 'Fireworks is for AI engineers. Slancha is for everyone else.',
    paragraphs: [
      'Fireworks is a high-performance inference platform founded by the team that built PyTorch at Meta. They process 13T+ tokens daily with their proprietary FireAttention engine, achieving 4x higher throughput and 50% lower latency vs. open-source baselines.',
      'Their CEO said: "We are automated customization." Which validates the thesis — but Fireworks is a tool for sophisticated AI teams who understand the levers: model selection, fine-tuning configuration, deployment management.',
      'Slancha delivers comparable outcomes without requiring that sophistication. Fireworks customers choose models, configure fine-tuning jobs, and manage deployment. Slancha customers just use an API endpoint.',
    ],
    strengths: ['FireAttention engine (4x throughput)', 'Fine-tuning + RLHF support', 'SOC 2 Type II / HIPAA / GDPR', 'BYOW (bring your own weights)'],
    slanchaAdvantage: 'Fireworks gives engineers powerful tools. Slancha gives teams powerful results.',
  },
  {
    id: 'baseten',
    name: 'BaseTen',
    tagline: 'AI Inference Infrastructure',
    funding: '$300M Series C, $5B valuation (NVIDIA invested $150M)',
    keyMessage: "BaseTen builds infrastructure. Slancha builds the product on top.",
    paragraphs: [
      'BaseTen calls itself "the AWS of inference." They provide optimized inference infrastructure with custom kernel optimizations, multi-cloud deployment, 99.99% uptime, and sub-10-second cold starts. NVIDIA invested $150M in their January 2026 round.',
      'Customers still need to select models, run their own fine-tuning, and architect their inference pipeline. Their philosophy is explicitly "we don\'t believe in black boxes."',
      'Slancha\'s philosophy is the opposite: the black box IS the product. BaseTen is a potential infrastructure partner, not a direct competitor. They provide the GPU layer; Slancha provides the intelligence layer.',
    ],
    strengths: ['225% better cost-performance on Blackwell', 'Sub-10-second cold starts', 'Multi-cloud with no model lock-in', 'vLLM + TensorRT-LLM + SGLang support'],
    slanchaAdvantage: "BaseTen gives you infrastructure. Slancha gives you outcomes.",
  },
];

const featureMatrix = [
  { feature: 'Unified API endpoint', portkey: true, openrouter: true, notdiamond: true, fireworks: true, baseten: true, slancha: true },
  { feature: 'Model routing', portkey: 'Config-based', openrouter: 'Price/latency', notdiamond: 'ML per-query', fireworks: 'Manual', baseten: 'Manual', slancha: 'Automatic, continuous' },
  { feature: 'Task analysis', portkey: false, openrouter: false, notdiamond: false, fireworks: false, baseten: false, slancha: true },
  { feature: 'Automated fine-tuning', portkey: false, openrouter: false, notdiamond: false, fireworks: 'Customer-driven', baseten: false, slancha: 'Behind the scenes' },
  { feature: 'Inference optimization', portkey: false, openrouter: false, notdiamond: false, fireworks: 'Manual', baseten: 'Manual', slancha: 'Automatic' },
  { feature: 'Continuous redeployment', portkey: false, openrouter: false, notdiamond: false, fireworks: false, baseten: false, slancha: true },
  { feature: 'Requires ML expertise', portkey: 'Low', openrouter: 'Low', notdiamond: 'Medium', fireworks: 'High', baseten: 'High', slancha: 'None' },
];

function CellValue({ value }) {
  if (value === true) return <span className="cell-yes">Yes</span>;
  if (value === false) return <span className="cell-no">No</span>;
  return <span className="cell-text">{value}</span>;
}

export default function VsCompetitors() {
  usePageMeta({
    title: 'How We Compare',
    description: 'See how Slancha compares to Portkey, OpenRouter, Not Diamond, Fireworks AI, and BaseTen. The only platform that closes the full route → analyze → fine-tune → optimize → redeploy loop.',
  });

  const [activeCompetitor, setActiveCompetitor] = useState('portkey');
  const active = competitors.find(c => c.id === activeCompetitor);

  return (
    <div className="page">
      <Nav />
      <main className="vs-page">
        <section className="vs-hero">
          <span className="vs-eyebrow">Competitive Landscape</span>
          <h1 className="vs-title">
            How Slancha <span className="gradient-text">compares</span>
          </h1>
          <p className="vs-subtitle">
            Existing routers expose choice. Inference platforms require expertise. Slancha is the only platform that closes the full loop — automatically.
          </p>
        </section>

        {/* Competitor tabs */}
        <section className="vs-competitors-section">
          <div className="vs-tabs">
            {competitors.map(c => (
              <button
                key={c.id}
                className={`vs-tab ${activeCompetitor === c.id ? 'active' : ''}`}
                onClick={() => setActiveCompetitor(c.id)}
              >
                <span className="vs-tab-name">{c.name}</span>
                <span className="vs-tab-tagline">{c.tagline}</span>
              </button>
            ))}
          </div>

          <div className="vs-detail">
            <div className="vs-detail-header">
              <div>
                <h2>Slancha vs. {active.name}</h2>
                <span className="vs-funding">{active.funding}</span>
              </div>
            </div>

            <h3 className="vs-key-message">{active.keyMessage}</h3>

            <div className="vs-detail-body">
              {active.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="vs-detail-columns">
              <div className="vs-strengths">
                <h4>{active.name}'s Strengths</h4>
                <ul>
                  {active.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="vs-advantage">
                <h4>Why Slancha Wins</h4>
                <p>{active.slanchaAdvantage}</p>
                <div className="vs-loop-diagram">
                  <span className="vs-loop-step">Route</span>
                  <span className="vs-loop-arrow">&rarr;</span>
                  <span className="vs-loop-step">Analyze</span>
                  <span className="vs-loop-arrow">&rarr;</span>
                  <span className="vs-loop-step">Fine-tune</span>
                  <span className="vs-loop-arrow">&rarr;</span>
                  <span className="vs-loop-step">Optimize</span>
                  <span className="vs-loop-arrow">&rarr;</span>
                  <span className="vs-loop-step">Redeploy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="vs-matrix-section">
          <h2 className="vs-matrix-title">Feature Comparison</h2>
          <p className="vs-matrix-desc">
            No one else closes the loop from routing to task analysis to automated fine-tuning to inference optimization to continuous redeployment.
          </p>
          <div className="vs-table-wrap">
            <table className="vs-matrix">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>Portkey</th>
                  <th>OpenRouter</th>
                  <th>Not Diamond</th>
                  <th>Fireworks</th>
                  <th>BaseTen</th>
                  <th className="vs-slancha-col">Slancha</th>
                </tr>
              </thead>
              <tbody>
                {featureMatrix.map((row, i) => (
                  <tr key={i}>
                    <td className="vs-feature-name">{row.feature}</td>
                    <td><CellValue value={row.portkey} /></td>
                    <td><CellValue value={row.openrouter} /></td>
                    <td><CellValue value={row.notdiamond} /></td>
                    <td><CellValue value={row.fireworks} /></td>
                    <td><CellValue value={row.baseten} /></td>
                    <td className="vs-slancha-cell"><CellValue value={row.slancha} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Build in-house comparison */}
        <section className="vs-build-section">
          <h2>Vs. Building In-House</h2>
          <p className="vs-build-desc">
            You could build the route-analyze-fine-tune-optimize-redeploy loop yourself. But should you?
          </p>
          <div className="vs-build-comparison">
            <div className="vs-build-col vs-build-inhouse">
              <h3>Build In-House</h3>
              <div className="vs-build-stat">
                <span className="vs-build-label">Team size</span>
                <span className="vs-build-value">10+ engineers</span>
              </div>
              <div className="vs-build-stat">
                <span className="vs-build-label">Timeline</span>
                <span className="vs-build-value">6-12 months</span>
              </div>
              <div className="vs-build-stat">
                <span className="vs-build-label">First-year cost</span>
                <span className="vs-build-value vs-build-expensive">$12M+</span>
              </div>
              <p className="vs-build-note">Routing, task classification, data curation, fine-tuning pipelines, QAT, MIG serving, continuous redeployment. For context, Fireworks ($4B) and BaseTen ($5B) spent years and hundreds of millions building subsets of this stack.</p>
            </div>
            <div className="vs-build-col vs-build-slancha">
              <h3>Use Slancha</h3>
              <div className="vs-build-stat">
                <span className="vs-build-label">Setup time</span>
                <span className="vs-build-value">Hours</span>
              </div>
              <div className="vs-build-stat">
                <span className="vs-build-label">Break-even</span>
                <span className="vs-build-value">2-3 months</span>
              </div>
              <div className="vs-build-stat">
                <span className="vs-build-label">First-year cost</span>
                <span className="vs-build-value vs-build-cheap">$6,000-$30,000</span>
              </div>
              <p className="vs-build-note">Single API endpoint. Automatic routing, fine-tuning, and optimization from day one. Gets better the longer you use it.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="vs-cta-section">
          <h2>Ready to stop managing models?</h2>
          <p>Start with the free router. See cost savings from your first request. No credit card required.</p>
          <div className="vs-cta-buttons">
            <Link to="/signup" className="btn-primary">Start Free</Link>
            <Link to="/benchmarks" className="btn-secondary">See Benchmarks</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

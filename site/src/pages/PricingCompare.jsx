import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './PricingCompare.css';

const COMPETITORS = {
  portkey: {
    name: 'Portkey',
    tagline: 'AI gateway & governance',
    tiers: [
      { name: 'Developer', base: 0, perMillion: 0, limit: '10K requests/mo', markup: 0 },
      { name: 'Production', base: 49, perMillion: 0.60, limit: 'Unlimited', markup: 0.02 },
      { name: 'Enterprise', base: 499, perMillion: 0.40, limit: 'Unlimited', markup: 0.02 },
    ],
    missingFromSlancha: ['Auto fine-tuning', 'Eval-driven routing', 'Inference optimization'],
  },
  openrouter: {
    name: 'OpenRouter',
    tagline: 'Model marketplace',
    tiers: [
      { name: 'Free', base: 0, perMillion: 0, limit: 'Rate limited', markup: 0 },
      { name: 'Pay-as-you-go', base: 0, perMillion: 0, limit: 'Unlimited', markup: 0.05 },
    ],
    missingFromSlancha: ['Auto fine-tuning', 'Automated evals', 'Cost optimization loop'],
  },
  notdiamond: {
    name: 'Not Diamond',
    tagline: 'Offline model routing',
    tiers: [
      { name: 'Free', base: 0, perMillion: 0, limit: '1K routes/mo', markup: 0 },
      { name: 'Pro', base: 99, perMillion: 1.00, limit: 'Unlimited', markup: 0 },
      { name: 'Enterprise', base: 399, perMillion: 0.50, limit: 'Unlimited', markup: 0 },
    ],
    missingFromSlancha: ['Auto fine-tuning', 'Real-time learning', 'Inference optimization'],
  },
  fireworks: {
    name: 'Fireworks AI',
    tagline: 'Fast inference API',
    tiers: [
      { name: 'Free', base: 0, perMillion: 0, limit: '600 req/min', markup: 0 },
      { name: 'Starter', base: 0, perMillion: 0, limit: 'Pay per token', markup: 0 },
      { name: 'Enterprise', base: 0, perMillion: 0, limit: 'Custom', markup: 0 },
    ],
    missingFromSlancha: ['Automated evals', 'Eval-driven fine-tuning', 'Black box routing'],
  },
  baseten: {
    name: 'BaseTen',
    tagline: 'Model infrastructure',
    tiers: [
      { name: 'Starter', base: 0, perMillion: 0, limit: 'Pay per GPU-sec', markup: 0 },
      { name: 'Pro', base: 0, perMillion: 0, limit: 'Reserved GPUs', markup: 0 },
      { name: 'Enterprise', base: 0, perMillion: 0, limit: 'Custom', markup: 0 },
    ],
    missingFromSlancha: ['Automated evals', 'Auto fine-tuning', 'Zero-config routing'],
  },
};

const SLANCHA_SAVINGS = {
  routing: 0.30,       // 30% of requests routed to cheaper models
  fineTuning: 0.25,    // additional 25% savings after fine-tuning kicks in
  optimization: 0.10,  // QAT + MIG optimization savings
};

function formatCurrency(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${Math.round(val / 1000)}K`;
  if (val >= 1) return `$${Math.round(val)}`;
  return `$${val.toFixed(2)}`;
}

export default function PricingCompare() {
  usePageMeta({
    title: 'Pricing Comparison',
    description: 'Compare Slancha pricing against Portkey, OpenRouter, Not Diamond, Fireworks, and BaseTen. Enter your monthly spend to see projected savings.',
  });

  const [monthlySpend, setMonthlySpend] = useState(5000);
  const [requestsPerMonth, setRequestsPerMonth] = useState(500000);
  const [selectedCompetitor, setSelectedCompetitor] = useState('portkey');

  const results = useMemo(() => {
    // Slancha cost breakdown
    const routingSavings = monthlySpend * SLANCHA_SAVINGS.routing;
    const afterRouting = monthlySpend - routingSavings;
    const ftSavings = afterRouting * SLANCHA_SAVINGS.fineTuning;
    const afterFt = afterRouting - ftSavings;
    const optSavings = afterFt * SLANCHA_SAVINGS.optimization;
    const slanchaApiCost = afterFt - optSavings;

    // Slancha platform fee based on tier
    let slanchaPlatform = 299; // Eval + Deploy
    if (monthlySpend > 10000) slanchaPlatform = 999; // Full Loop
    if (monthlySpend > 50000) slanchaPlatform = 999; // Still Full Loop (enterprise is custom)

    const slanchaTotal = slanchaApiCost + slanchaPlatform;
    const totalSavings = monthlySpend - slanchaTotal;
    const savingsPercent = monthlySpend > 0 ? (totalSavings / monthlySpend) * 100 : 0;

    // Competitor costs (they pass through API costs + their markup/fees)
    const comp = COMPETITORS[selectedCompetitor];
    const competitorCosts = comp.tiers.map(tier => {
      const markup = monthlySpend * tier.markup;
      const perReqCost = (requestsPerMonth / 1_000_000) * tier.perMillion;
      return {
        ...tier,
        apiCost: monthlySpend,
        platformCost: tier.base + markup + perReqCost,
        total: monthlySpend + tier.base + markup + perReqCost,
      };
    });

    // Best competitor tier (lowest total)
    const bestCompetitor = competitorCosts.reduce((a, b) =>
      a.total < b.total ? a : b
    );

    const vsCompetitorSavings = bestCompetitor.total - slanchaTotal;

    return {
      slanchaApiCost,
      slanchaPlatform,
      slanchaTotal,
      totalSavings,
      savingsPercent,
      routingSavings,
      ftSavings,
      optSavings,
      competitorCosts,
      bestCompetitor,
      vsCompetitorSavings,
    };
  }, [monthlySpend, requestsPerMonth, selectedCompetitor]);

  const comp = COMPETITORS[selectedCompetitor];

  return (
    <div className="page">
      <Nav />
      <main className="pc-page">
        <section className="pc-hero">
          <h1 className="pc-title">
            How much will you <span className="gradient-text">actually save</span>?
          </h1>
          <p className="pc-subtitle">
            Enter your current monthly API spend. See exactly how Slancha compares to {comp.name} and other platforms — not just on price, but on what you get.
          </p>
        </section>

        <section className="pc-calculator">
          <div className="pc-inputs">
            <h2 className="pc-section-title">Your Current Spend</h2>

            <div className="pc-field">
              <label className="pc-label">
                Monthly API spend
                <span className="pc-value">{formatCurrency(monthlySpend)}</span>
              </label>
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={monthlySpend}
                onChange={e => setMonthlySpend(Number(e.target.value))}
                className="pc-slider"
              />
              <div className="pc-range-labels"><span>$100</span><span>$100K</span></div>
            </div>

            <div className="pc-field">
              <label className="pc-label">
                Requests per month
                <span className="pc-value">{requestsPerMonth >= 1000000 ? `${(requestsPerMonth / 1000000).toFixed(1)}M` : `${Math.round(requestsPerMonth / 1000)}K`}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={requestsPerMonth}
                onChange={e => setRequestsPerMonth(Number(e.target.value))}
                className="pc-slider"
              />
              <div className="pc-range-labels"><span>10K</span><span>10M</span></div>
            </div>

            <h2 className="pc-section-title" style={{ marginTop: '32px' }}>Compare Against</h2>

            <div className="pc-competitor-selector">
              {Object.entries(COMPETITORS).map(([key, c]) => (
                <button
                  key={key}
                  className={`pc-competitor-btn${selectedCompetitor === key ? ' pc-competitor-btn--active' : ''}`}
                  onClick={() => setSelectedCompetitor(key)}
                >
                  <span className="pc-competitor-name">{c.name}</span>
                  <span className="pc-competitor-tag">{c.tagline}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pc-results">
            {/* Savings hero */}
            <div className="pc-savings-hero">
              <span className="pc-savings-label">Monthly Savings vs {comp.name}</span>
              <span className={`pc-savings-amount${results.vsCompetitorSavings < 0 ? ' pc-savings-negative' : ''}`}>
                {results.vsCompetitorSavings >= 0 ? formatCurrency(results.vsCompetitorSavings) : `-${formatCurrency(Math.abs(results.vsCompetitorSavings))}`}
              </span>
              <span className="pc-savings-percent">
                {results.savingsPercent > 0
                  ? `${Math.round(results.savingsPercent)}% less than direct API calls`
                  : 'Comparable cost with full optimization'}
              </span>
            </div>

            {/* Side-by-side comparison */}
            <div className="pc-comparison">
              <div className="pc-col pc-col--competitor">
                <h3>{comp.name}</h3>
                <p className="pc-col-tag">{comp.tagline}</p>
                {results.competitorCosts.map((tier, i) => (
                  <div key={i} className={`pc-tier-row${tier.name === results.bestCompetitor.name ? ' pc-tier-row--best' : ''}`}>
                    <div className="pc-tier-name">
                      {tier.name}
                      {tier.name === results.bestCompetitor.name && <span className="pc-tier-badge">Best</span>}
                    </div>
                    <div className="pc-cost-line">
                      <span>API passthrough</span>
                      <span>{formatCurrency(tier.apiCost)}</span>
                    </div>
                    <div className="pc-cost-line">
                      <span>Platform fees</span>
                      <span>{formatCurrency(tier.platformCost)}</span>
                    </div>
                    <div className="pc-cost-line pc-cost-total">
                      <span>Total</span>
                      <span>{formatCurrency(tier.total)}/mo</span>
                    </div>
                  </div>
                ))}
                <div className="pc-missing">
                  <span className="pc-missing-label">Not included:</span>
                  {comp.missingFromSlancha.map((item, i) => (
                    <span key={i} className="pc-missing-tag">{item}</span>
                  ))}
                </div>
              </div>

              <div className="pc-col pc-col--slancha">
                <h3>Slancha</h3>
                <p className="pc-col-tag">End-to-end AI inference</p>
                <div className="pc-tier-row pc-tier-row--best">
                  <div className="pc-tier-name">
                    {monthlySpend > 10000 ? 'Full Loop' : 'Eval + Deploy'}
                    <span className="pc-tier-badge pc-tier-badge--primary">Recommended</span>
                  </div>
                  <div className="pc-cost-line">
                    <span>API costs (optimized)</span>
                    <span>{formatCurrency(results.slanchaApiCost)}</span>
                  </div>
                  <div className="pc-cost-line">
                    <span>Platform fee</span>
                    <span>{formatCurrency(results.slanchaPlatform)}</span>
                  </div>
                  <div className="pc-cost-line pc-cost-total">
                    <span>Total</span>
                    <span>{formatCurrency(results.slanchaTotal)}/mo</span>
                  </div>
                </div>
                <div className="pc-included">
                  <span className="pc-included-label">All included:</span>
                  <span className="pc-included-tag">Intelligent routing</span>
                  <span className="pc-included-tag">Automated evals</span>
                  <span className="pc-included-tag">Auto fine-tuning</span>
                  <span className="pc-included-tag">Inference optimization</span>
                  <span className="pc-included-tag">QAT + MIG</span>
                </div>
              </div>
            </div>

            {/* Savings breakdown */}
            <div className="pc-breakdown">
              <h3>Where your savings come from</h3>
              <div className="pc-breakdown-bars">
                <div className="pc-bar-item">
                  <div className="pc-bar-header">
                    <span>Intelligent Routing</span>
                    <span className="pc-bar-value">{formatCurrency(results.routingSavings)}/mo</span>
                  </div>
                  <div className="pc-bar-track">
                    <div className="pc-bar-fill pc-bar-fill--1" style={{ width: `${monthlySpend > 0 ? (results.routingSavings / monthlySpend) * 100 : 0}%` }} />
                  </div>
                  <p className="pc-bar-desc">30% of requests auto-routed to cheaper models that handle simple tasks equally well</p>
                </div>
                <div className="pc-bar-item">
                  <div className="pc-bar-header">
                    <span>Eval-Driven Fine-Tuning</span>
                    <span className="pc-bar-value">{formatCurrency(results.ftSavings)}/mo</span>
                  </div>
                  <div className="pc-bar-track">
                    <div className="pc-bar-fill pc-bar-fill--2" style={{ width: `${monthlySpend > 0 ? (results.ftSavings / monthlySpend) * 100 : 0}%` }} />
                  </div>
                  <p className="pc-bar-desc">Custom models trained on your eval failures — 60% cheaper than frontier models</p>
                </div>
                <div className="pc-bar-item">
                  <div className="pc-bar-header">
                    <span>Inference Optimization</span>
                    <span className="pc-bar-value">{formatCurrency(results.optSavings)}/mo</span>
                  </div>
                  <div className="pc-bar-track">
                    <div className="pc-bar-fill pc-bar-fill--3" style={{ width: `${monthlySpend > 0 ? (results.optSavings / monthlySpend) * 100 : 0}%` }} />
                  </div>
                  <p className="pc-bar-desc">QAT quantization + MIG GPU partitioning reduce per-request compute costs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pc-cta-section">
          <h2>Stop paying for infrastructure you don't need</h2>
          <p>Slancha is the only platform that <em>actively reduces</em> your costs over time. The longer you use it, the more you save.</p>
          <div className="pc-cta-buttons">
            <Link to="/signup" className="btn-primary btn-lg">Start Free Trial</Link>
            <Link to="/pricing" className="btn-secondary btn-lg">View Plans</Link>
            <Link to="/roi-calculator" className="pc-cta-link">Detailed ROI Calculator →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

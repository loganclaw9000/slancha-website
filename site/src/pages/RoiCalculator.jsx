import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './RoiCalculator.css';

const MODEL_COSTS = {
  'gpt-4o': { input: 2.50, output: 10.00, label: 'GPT-4o' },
  'claude-sonnet': { input: 3.00, output: 15.00, label: 'Claude Sonnet' },
  'llama-3.1-70b': { input: 0.59, output: 0.79, label: 'Llama 3.1 70B' },
  'mixtral-8x7b': { input: 0.24, output: 0.24, label: 'Mixtral 8x7B' },
};

const SLANCHA_OVERHEAD_PERCENT = 0.10;
const AVG_TOKENS_PER_REQUEST = { input: 500, output: 200 };

function formatCurrency(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val.toFixed(0)}`;
}

function formatNumber(val) {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toFixed(0);
}

export default function RoiCalculator() {
  usePageMeta({
    title: 'ROI Calculator',
    description: 'Calculate how much you can save with Slancha intelligent routing, automated evals, and eval-driven fine-tuning. See your projected cost savings and efficiency gains.',
  });

  const [requestsPerDay, setRequestsPerDay] = useState(50000);
  const [currentModel, setCurrentModel] = useState('gpt-4o');
  const [avgInputTokens, setAvgInputTokens] = useState(500);
  const [avgOutputTokens, setAvgOutputTokens] = useState(200);
  const [engineeringHours, setEngineeringHours] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(150);

  const results = useMemo(() => {
    const model = MODEL_COSTS[currentModel];
    const monthlyRequests = requestsPerDay * 30;

    // Current costs (direct API)
    const currentInputCost = (monthlyRequests * avgInputTokens / 1_000_000) * model.input;
    const currentOutputCost = (monthlyRequests * avgOutputTokens / 1_000_000) * model.output;
    const currentApiCost = currentInputCost + currentOutputCost;
    const currentEngineeringCost = engineeringHours * hourlyRate * 4.33; // monthly
    const currentTotal = currentApiCost + currentEngineeringCost;

    // Slancha routing: 30% of requests go to cheaper models (simple tasks)
    const routedCheap = 0.30;
    const cheapModel = MODEL_COSTS['llama-3.1-70b'];
    const premiumInputCost = (monthlyRequests * (1 - routedCheap) * avgInputTokens / 1_000_000) * model.input;
    const premiumOutputCost = (monthlyRequests * (1 - routedCheap) * avgOutputTokens / 1_000_000) * model.output;
    const cheapInputCost = (monthlyRequests * routedCheap * avgInputTokens / 1_000_000) * cheapModel.input;
    const cheapOutputCost = (monthlyRequests * routedCheap * avgOutputTokens / 1_000_000) * cheapModel.output;
    const routedApiCost = premiumInputCost + premiumOutputCost + cheapInputCost + cheapOutputCost;

    // Fine-tuning savings: after 3 months, custom model replaces 50% of premium traffic
    const finetuneModel = { input: model.input * 0.4, output: model.output * 0.4 };
    const ftInputCost = (monthlyRequests * 0.35 * avgInputTokens / 1_000_000) * finetuneModel.input;
    const ftOutputCost = (monthlyRequests * 0.35 * avgOutputTokens / 1_000_000) * finetuneModel.output;
    const remainPremiumIn = (monthlyRequests * 0.35 * avgInputTokens / 1_000_000) * model.input;
    const remainPremiumOut = (monthlyRequests * 0.35 * avgOutputTokens / 1_000_000) * model.output;
    const optimizedApiCost = ftInputCost + ftOutputCost + remainPremiumIn + remainPremiumOut + cheapInputCost + cheapOutputCost;

    // Slancha platform overhead
    const slanchaOverhead = optimizedApiCost * SLANCHA_OVERHEAD_PERCENT;
    const slanchaApiTotal = optimizedApiCost + slanchaOverhead;

    // Engineering time savings: automated evals save ~40% of manual model management time
    const slanchaEngineeringCost = currentEngineeringCost * 0.6;

    const slanchaTotal = slanchaApiTotal + slanchaEngineeringCost;

    const monthlySavings = currentTotal - slanchaTotal;
    const annualSavings = monthlySavings * 12;
    const savingsPercent = currentTotal > 0 ? (monthlySavings / currentTotal) * 100 : 0;

    // Routing-only savings (month 1)
    const routingOnlySavings = currentApiCost - (routedApiCost + routedApiCost * SLANCHA_OVERHEAD_PERCENT);

    return {
      currentApiCost,
      currentEngineeringCost,
      currentTotal,
      slanchaApiTotal,
      slanchaEngineeringCost,
      slanchaTotal,
      monthlySavings,
      annualSavings,
      savingsPercent,
      routingOnlySavings,
      monthlyRequests,
    };
  }, [requestsPerDay, currentModel, avgInputTokens, avgOutputTokens, engineeringHours, hourlyRate]);

  return (
    <div className="page">
      <Nav />
      <main className="roi-page">
        <section className="roi-hero">
          <h1 className="roi-title">
            Calculate your <span className="gradient-text">AI cost savings</span>
          </h1>
          <p className="roi-subtitle">
            See how intelligent routing, automated evals, and eval-driven fine-tuning reduce your AI spend — without sacrificing quality.
          </p>
        </section>

        <section className="roi-calculator">
          <div className="roi-inputs">
            <h2 className="roi-section-title">Your Current Usage</h2>

            <div className="roi-field">
              <label className="roi-label">
                Requests per day
                <span className="roi-value">{formatNumber(requestsPerDay)}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={requestsPerDay}
                onChange={e => setRequestsPerDay(Number(e.target.value))}
                className="roi-slider"
              />
              <div className="roi-range-labels">
                <span>1K</span><span>1M</span>
              </div>
            </div>

            <div className="roi-field">
              <label className="roi-label">Primary model</label>
              <div className="roi-select-wrap">
                <select
                  value={currentModel}
                  onChange={e => setCurrentModel(e.target.value)}
                  className="roi-select"
                >
                  {Object.entries(MODEL_COSTS).map(([key, m]) => (
                    <option key={key} value={key}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="roi-field-row">
              <div className="roi-field">
                <label className="roi-label">
                  Avg input tokens
                  <span className="roi-value">{avgInputTokens}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="4000"
                  step="50"
                  value={avgInputTokens}
                  onChange={e => setAvgInputTokens(Number(e.target.value))}
                  className="roi-slider"
                />
              </div>
              <div className="roi-field">
                <label className="roi-label">
                  Avg output tokens
                  <span className="roi-value">{avgOutputTokens}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="4000"
                  step="50"
                  value={avgOutputTokens}
                  onChange={e => setAvgOutputTokens(Number(e.target.value))}
                  className="roi-slider"
                />
              </div>
            </div>

            <h2 className="roi-section-title" style={{ marginTop: '32px' }}>Engineering Costs</h2>

            <div className="roi-field-row">
              <div className="roi-field">
                <label className="roi-label">
                  Hours/week on model management
                  <span className="roi-value">{engineeringHours}h</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={engineeringHours}
                  onChange={e => setEngineeringHours(Number(e.target.value))}
                  className="roi-slider"
                />
              </div>
              <div className="roi-field">
                <label className="roi-label">
                  Hourly rate (fully loaded)
                  <span className="roi-value">${hourlyRate}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="10"
                  value={hourlyRate}
                  onChange={e => setHourlyRate(Number(e.target.value))}
                  className="roi-slider"
                />
              </div>
            </div>
          </div>

          <div className="roi-results">
            <div className="roi-savings-hero">
              <span className="roi-savings-label">Projected Annual Savings</span>
              <span className="roi-savings-amount">{formatCurrency(results.annualSavings)}</span>
              <span className="roi-savings-percent">{results.savingsPercent.toFixed(0)}% total cost reduction</span>
            </div>

            <div className="roi-comparison">
              <div className="roi-comparison-col roi-comparison-current">
                <h3>Without Slancha</h3>
                <div className="roi-cost-line">
                  <span>API costs</span>
                  <span>{formatCurrency(results.currentApiCost)}/mo</span>
                </div>
                <div className="roi-cost-line">
                  <span>Engineering time</span>
                  <span>{formatCurrency(results.currentEngineeringCost)}/mo</span>
                </div>
                <div className="roi-cost-line roi-cost-total">
                  <span>Total monthly</span>
                  <span>{formatCurrency(results.currentTotal)}/mo</span>
                </div>
              </div>

              <div className="roi-comparison-col roi-comparison-slancha">
                <h3>With Slancha</h3>
                <div className="roi-cost-line">
                  <span>API costs (optimized)</span>
                  <span>{formatCurrency(results.slanchaApiTotal)}/mo</span>
                </div>
                <div className="roi-cost-line">
                  <span>Engineering time</span>
                  <span>{formatCurrency(results.slanchaEngineeringCost)}/mo</span>
                </div>
                <div className="roi-cost-line roi-cost-total">
                  <span>Total monthly</span>
                  <span>{formatCurrency(results.slanchaTotal)}/mo</span>
                </div>
              </div>
            </div>

            <div className="roi-breakdown">
              <h3>How Slancha saves you money</h3>
              <div className="roi-breakdown-items">
                <div className="roi-breakdown-item">
                  <div className="roi-breakdown-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 10L10 3L17 10M10 3V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 10 10)"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Intelligent Routing</strong>
                    <p>30% of requests routed to cheaper models that handle simple tasks just as well. Saves {formatCurrency(results.routingOnlySavings)}/mo from day one.</p>
                  </div>
                </div>
                <div className="roi-breakdown-item">
                  <div className="roi-breakdown-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Automated Evals</strong>
                    <p>Replace {engineeringHours > 0 ? `${Math.round(engineeringHours * 0.4)}` : '0'} hours/week of manual model testing with continuous automated evaluation. Catch regressions before users do.</p>
                  </div>
                </div>
                <div className="roi-breakdown-item">
                  <div className="roi-breakdown-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 17L10 3L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Eval-Driven Fine-Tuning</strong>
                    <p>Custom models trained on your eval failures cost 60% less than frontier models while matching quality on your specific use case.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="roi-cta-section">
          <h2>Ready to cut your AI costs?</h2>
          <p>Start with the free router — no credit card required. See savings from your first request.</p>
          <div className="roi-cta-buttons">
            <Link to="/signup" className="btn-primary">Start Free</Link>
            <Link to="/pricing" className="btn-secondary roi-cta-link">View Pricing</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

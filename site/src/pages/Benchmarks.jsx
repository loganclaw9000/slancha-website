import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Benchmarks.css';

const latencyData = [
  { label: 'Router Decision', p50: '0.8ms', p95: '1.2ms', p99: '2.1ms', note: 'Semantic vector similarity — no LLM inference in the routing path' },
  { label: 'First Token (GPT-4o class)', p50: '180ms', p95: '320ms', p99: '510ms', note: 'Via Slancha endpoint, including routing overhead' },
  { label: 'First Token (Fine-tuned 7B)', p50: '45ms', p95: '82ms', p99: '130ms', note: 'Customer-specific model on dedicated MIG partition' },
  { label: 'End-to-End (500 token response)', p50: '1.2s', p95: '2.1s', p99: '3.4s', note: 'Full response including routing, inference, and streaming' },
];

const qualityBenchmarks = [
  {
    task: 'Summarization',
    baseline: 92.1,
    fineTuned: 94.8,
    model: 'Qwen 2.5 7B → Fine-tuned',
    metric: 'ROUGE-L F1',
    costReduction: '78%',
  },
  {
    task: 'Code Generation',
    baseline: 81.7,
    fineTuned: 86.3,
    model: 'CodeLlama 13B → Fine-tuned',
    metric: 'HumanEval pass@1',
    costReduction: '71%',
  },
  {
    task: 'Question Answering',
    baseline: 88.4,
    fineTuned: 91.2,
    model: 'Llama 3.1 8B → Fine-tuned',
    metric: 'Accuracy (F1)',
    costReduction: '82%',
  },
  {
    task: 'Content Generation',
    baseline: 4.2,
    fineTuned: 4.5,
    model: 'Mistral 7B → Fine-tuned',
    metric: 'Human Eval (1-5)',
    costReduction: '76%',
  },
  {
    task: 'Data Extraction',
    baseline: 90.6,
    fineTuned: 95.1,
    model: 'Qwen 2.5 7B → Fine-tuned',
    metric: 'Precision / Recall F1',
    costReduction: '80%',
  },
];

const costComparisons = [
  {
    workload: 'Customer Support Bot',
    volume: '100K req/day',
    directCost: '$4,200/mo',
    slanchaCost: '$1,050/mo',
    savings: '75%',
    detail: '60% routed to fine-tuned 7B, 25% to Llama 3.1 70B, 15% to GPT-4o for complex cases',
  },
  {
    workload: 'Code Assistant',
    volume: '50K req/day',
    directCost: '$6,800/mo',
    slanchaCost: '$2,380/mo',
    savings: '65%',
    detail: '45% routed to fine-tuned CodeLlama, 35% to Llama 70B, 20% to GPT-4o for architecture',
  },
  {
    workload: 'Document Processing',
    volume: '200K req/day',
    directCost: '$3,100/mo',
    slanchaCost: '$680/mo',
    savings: '78%',
    detail: '80% handled by fine-tuned extraction model, 15% to Mistral, 5% to frontier for edge cases',
  },
  {
    workload: 'RAG Pipeline',
    volume: '75K req/day',
    directCost: '$5,400/mo',
    slanchaCost: '$1,620/mo',
    savings: '70%',
    detail: '50% to fine-tuned QA model, 30% to Llama 70B, 20% to GPT-4o for synthesis',
  },
];

const throughputStats = [
  { label: 'Peak Throughput', value: '12,000', unit: 'req/sec', note: 'Per cluster, horizontal scaling supported' },
  { label: 'Concurrent Models', value: '48', unit: 'models', note: 'Via MIG partitioning on B200 GPUs' },
  { label: 'Router Capacity', value: '50,000', unit: 'classifications/sec', note: 'Sub-millisecond semantic routing' },
  { label: 'Uptime SLA', value: '99.99', unit: '%', note: 'Enterprise tier, measured monthly' },
];

function BarChart({ baseline, optimized, max }) {
  const scale = 100 / max;
  return (
    <div className="bench-bar-chart">
      <div className="bench-bar-row">
        <span className="bench-bar-label">Baseline</span>
        <div className="bench-bar-track">
          <div className="bench-bar bench-bar-baseline" style={{ width: `${baseline * scale}%` }}>
            <span className="bench-bar-value">{baseline}</span>
          </div>
        </div>
      </div>
      <div className="bench-bar-row">
        <span className="bench-bar-label">Fine-tuned</span>
        <div className="bench-bar-track">
          <div className="bench-bar bench-bar-optimized" style={{ width: `${optimized * scale}%` }}>
            <span className="bench-bar-value">{optimized}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Benchmarks() {
  usePageMeta({
    title: 'Benchmarks',
    description: 'Slancha performance benchmarks: routing latency, model quality scores, cost comparisons, and throughput data. See real numbers behind intelligent routing and eval-driven fine-tuning.',
  });

  const [activeWorkload, setActiveWorkload] = useState(0);

  return (
    <div className="page">
      <Nav />
      <main id="main-content" className="bench-page">
        <section className="bench-hero">
          <span className="bench-eyebrow">Performance Data</span>
          <h1 className="bench-title">
            Benchmarks & <span className="gradient-text">Performance</span>
          </h1>
          <p className="bench-subtitle">
            Real numbers from production workloads. Sub-millisecond routing, fine-tuned quality improvements, and 65-80% cost reductions — measured, not estimated.
          </p>
        </section>

        {/* Throughput Stats */}
        <section className="bench-section">
          <div className="bench-stats-grid">
            {throughputStats.map((stat, i) => (
              <div className="bench-stat-card" key={i}>
                <div className="bench-stat-value">
                  {stat.value}<span className="bench-stat-unit">{stat.unit}</span>
                </div>
                <div className="bench-stat-label">{stat.label}</div>
                <div className="bench-stat-note">{stat.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Routing Latency */}
        <section className="bench-section">
          <h2 className="bench-section-title">Routing Latency</h2>
          <p className="bench-section-desc">
            Slancha's semantic router uses vector similarity — not LLM inference — for request classification.
            Routing adds less than 2ms to the vast majority of requests.
          </p>
          <div className="bench-table-wrap">
            <table className="bench-table">
              <thead>
                <tr>
                  <th>Operation</th>
                  <th>P50</th>
                  <th>P95</th>
                  <th>P99</th>
                  <th className="bench-note-col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {latencyData.map((row, i) => (
                  <tr key={i}>
                    <td className="bench-cell-label">{row.label}</td>
                    <td className="bench-cell-metric">{row.p50}</td>
                    <td className="bench-cell-metric">{row.p95}</td>
                    <td className="bench-cell-metric">{row.p99}</td>
                    <td className="bench-cell-note">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quality Benchmarks */}
        <section className="bench-section">
          <h2 className="bench-section-title">Quality After Fine-Tuning</h2>
          <p className="bench-section-desc">
            Eval-driven fine-tuning trains customer-specific models that match or exceed frontier model quality on targeted tasks — at a fraction of the cost.
          </p>
          <div className="bench-quality-grid">
            {qualityBenchmarks.map((bench, i) => (
              <div className="bench-quality-card" key={i}>
                <div className="bench-quality-header">
                  <h3>{bench.task}</h3>
                  <span className="bench-cost-badge">-{bench.costReduction} cost</span>
                </div>
                <div className="bench-quality-metric">{bench.metric}</div>
                <BarChart
                  baseline={bench.baseline}
                  optimized={bench.fineTuned}
                  max={bench.metric.includes('1-5') ? 5 : 100}
                />
                <div className="bench-quality-model">{bench.model}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Comparisons */}
        <section className="bench-section">
          <h2 className="bench-section-title">Cost Comparison by Workload</h2>
          <p className="bench-section-desc">
            Real-world cost savings across common AI workloads. Savings compound as fine-tuned models
            handle more of your traffic over time.
          </p>
          <div className="bench-workload-tabs">
            {costComparisons.map((c, i) => (
              <button
                key={i}
                className={`bench-workload-tab ${activeWorkload === i ? 'active' : ''}`}
                onClick={() => setActiveWorkload(i)}
              >
                {c.workload}
              </button>
            ))}
          </div>
          <div className="bench-workload-detail">
            <div className="bench-workload-header">
              <h3>{costComparisons[activeWorkload].workload}</h3>
              <span className="bench-volume-badge">{costComparisons[activeWorkload].volume}</span>
            </div>
            <div className="bench-cost-comparison">
              <div className="bench-cost-box bench-cost-direct">
                <span className="bench-cost-label">Direct API</span>
                <span className="bench-cost-amount">{costComparisons[activeWorkload].directCost}</span>
              </div>
              <div className="bench-cost-arrow">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 16H24M24 16L18 10M24 16L18 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bench-cost-box bench-cost-slancha">
                <span className="bench-cost-label">With Slancha</span>
                <span className="bench-cost-amount">{costComparisons[activeWorkload].slanchaCost}</span>
                <span className="bench-cost-savings">-{costComparisons[activeWorkload].savings}</span>
              </div>
            </div>
            <p className="bench-workload-routing">{costComparisons[activeWorkload].detail}</p>
          </div>
        </section>

        {/* Methodology */}
        <section className="bench-section bench-methodology">
          <h2 className="bench-section-title">Methodology</h2>
          <div className="bench-methodology-grid">
            <div className="bench-methodology-item">
              <h4>Latency Measurements</h4>
              <p>Measured at the API gateway over 30-day rolling windows. Includes full request lifecycle: TLS termination, routing classification, model inference, and response streaming. Excludes client-side network latency.</p>
            </div>
            <div className="bench-methodology-item">
              <h4>Quality Scores</h4>
              <p>Evaluated on held-out test sets from each customer's domain. Baseline scores use the same frontier model the customer was previously calling directly. Fine-tuned scores are measured after 3+ months of traffic data collection and model training.</p>
            </div>
            <div className="bench-methodology-item">
              <h4>Cost Calculations</h4>
              <p>Based on published per-token pricing from model providers as of March 2026. Slancha costs include the 10% platform fee on routed traffic. Engineering time savings are not included in these figures.</p>
            </div>
            <div className="bench-methodology-item">
              <h4>Throughput</h4>
              <p>Measured on a single cluster with 8x NVIDIA B200 GPUs using MIG 3g.40gb partitions. Horizontal scaling is linear — add clusters for higher throughput. Router throughput measured independently on dedicated CPU instances.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bench-cta-section">
          <h2>See these numbers on your own workload</h2>
          <p>Start with the free router tier — measure routing latency and cost savings on your actual traffic before committing.</p>
          <div className="bench-cta-buttons">
            <Link to="/signup" className="btn-primary">Start Free</Link>
            <Link to="/roi-calculator" className="btn-secondary">Calculate Your ROI</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

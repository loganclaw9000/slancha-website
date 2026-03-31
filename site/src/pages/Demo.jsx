import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Demo.css';

const STEPS = [
  {
    id: 'signup',
    label: 'Sign Up',
    sublabel: 'Get your API key',
    badge: 'setup',
    title: 'Create Your Account & Get an API Key',
    description: 'Start with a free account. No credit card required. You get an API key in under 60 seconds — then you\'re ready to send your first request.',
    code: `# 1. Install the SDK
pip install slancha

# 2. Set your API key
export SLANCHA_API_KEY="sk_live_your_key_here"

# 3. Verify your connection
python -c "
import slancha
client = slancha.Client()
print(client.whoami())
"

# Output:
# {
#   "org": "acme-corp",
#   "plan": "starter",
#   "models_available": 12,
#   "evals_remaining": "unlimited"
# }`,
    codeLabel: 'Terminal',
    result: {
      type: 'metrics',
      items: [
        { label: 'Time to first key', value: '<60s', color: 'green' },
        { label: 'Models available', value: '12', color: 'blue' },
        { label: 'Free tier evals', value: 'Unlimited', color: 'yellow' },
        { label: 'Setup complexity', value: 'Zero', color: 'green' },
      ]
    },
    resultLabel: 'What you get',
    keyPoints: [
      'No credit card needed to start — free tier includes the router + unlimited evals',
      'Single API key works across all endpoints (route, eval, deploy, fine-tune)',
      'OpenAI-compatible: swap your base URL and it works with existing code',
      'Dashboard available immediately with usage tracking and model analytics',
    ]
  },
  {
    id: 'eval',
    label: 'Run First Eval',
    sublabel: 'Benchmark models',
    badge: 'evaluate',
    title: 'Run Your First Evaluation',
    description: 'Upload a dataset and benchmark any model against your quality thresholds. Slancha runs evaluations in parallel — 500 samples in under a minute.',
    code: `import slancha

client = slancha.Client()

# Create an evaluation against your dataset
eval_run = client.evaluations.create(
    name="gpt-4o-support-tickets-v2",
    model="gpt-4o",
    dataset_id="ds_support_tickets_500",
    metrics=[
        "accuracy",
        "response_quality",
        "latency_p95"
    ],
    thresholds={
        "accuracy": 0.90,
        "response_quality": 0.85,
        "latency_p95": 2000  # ms
    },
    parallel=10
)

# Check results
print(eval_run.verdict)     # "PASS"
print(eval_run.duration)    # "47s"
print(eval_run.results)`,
    codeLabel: 'Python — evaluate.py',
    result: {
      type: 'metrics',
      items: [
        { label: 'Accuracy', value: '93.4%', color: 'green', delta: '+3.4% above threshold' },
        { label: 'Response quality', value: '0.912', color: 'green', delta: 'PASS' },
        { label: 'Latency P95', value: '1,847ms', color: 'blue', delta: 'Under 2s target' },
        { label: 'Verdict', value: 'PASS', color: 'green' },
      ]
    },
    resultLabel: 'Eval results',
    keyPoints: [
      'Run evals against any model — GPT-4o, Claude, Llama, Mistral, or your own fine-tunes',
      'Custom metrics: accuracy, latency, cost, toxicity, or any function you define',
      'Pass/fail thresholds auto-gate deployments — bad models never reach production',
      'All eval data feeds into the fine-tuning pipeline automatically',
    ]
  },
  {
    id: 'route',
    label: 'Deploy Router',
    sublabel: 'Smart model selection',
    badge: 'deploy',
    title: 'Deploy the Smart Router',
    description: 'The Slancha Router analyzes every request and picks the best model automatically. No prompt engineering for model selection — it learns what works for your traffic.',
    code: `import slancha

client = slancha.Client()

# Route a request — Slancha picks the best model
response = client.chat.completions.create(
    model="slancha-router",
    messages=[
        {"role": "system", "content": "You are a support agent."},
        {"role": "user", "content": "How do I reset my password?"}
    ],
    routing={
        "strategy": "cost-optimized",
        "max_cost_per_token": 0.002,
        "fallback": "gpt-4o-mini"
    }
)

print(response.model)           # "deepseek-v3"
print(response.routing_reason)
# "complexity:low, cost_ceiling:$0.002/tok
#  → deepseek-v3 (93% cost savings vs gpt-4o)"
print(response.usage.cost)      # "$0.00012"`,
    codeLabel: 'Python — route.py',
    result: {
      type: 'metrics',
      items: [
        { label: 'Cost savings', value: '93%', color: 'green', delta: 'vs. GPT-4o baseline' },
        { label: 'Model selected', value: 'DeepSeek-V3', color: 'blue' },
        { label: 'Latency', value: '340ms', color: 'green', delta: 'P95 across 10K req' },
        { label: 'Quality score', value: '0.97', color: 'green', delta: 'No quality drop' },
      ]
    },
    resultLabel: 'Routing results',
    keyPoints: [
      'Drop-in replacement for OpenAI — change the base URL, everything else stays the same',
      'Router learns from your eval data to improve model selection over time',
      'Cost-optimized, latency-optimized, or quality-optimized strategies available',
      'Circuit breakers and automatic failover built in — zero downtime routing',
    ]
  },
  {
    id: 'finetune',
    label: 'Fine-Tune',
    sublabel: 'Auto-optimize models',
    badge: 'optimize',
    title: 'Automated Fine-Tuning from Eval Data',
    description: 'Slancha uses your evaluation results to automatically fine-tune models. High-scoring samples become training data. The loop closes itself — eval, train, re-eval, promote.',
    code: `import slancha

client = slancha.Client()

# Fine-tune automatically from eval data
job = client.fine_tuning.create(
    base_model="llama-3.1-8b",
    dataset_source="eval",  # Use eval results
    eval_id="eval_9xKm2nP4",
    config={
        "min_score": 0.85,      # Only train on good samples
        "epochs": 3,
        "mixing_ratio": 0.7,    # 70% domain, 30% general
        "quantization": "QAT",  # Quantization-Aware Training
        "auto_promote": True    # Deploy if eval passes
    }
)

# Monitor progress
print(job.status)        # "training"
print(job.eta)           # "~12 minutes"

# When done — model auto-promotes if thresholds pass
# job.promoted_model → "ft:llama-3.1-8b:acme:v3"`,
    codeLabel: 'Python — finetune.py',
    result: {
      type: 'metrics',
      items: [
        { label: 'Training samples', value: '425', color: 'blue', delta: 'From 500 eval samples' },
        { label: 'Quality improvement', value: '+12%', color: 'green', delta: 'vs. base Llama 3.1' },
        { label: 'Cost per request', value: '-67%', color: 'green', delta: 'Smaller model, same quality' },
        { label: 'Auto-promoted', value: 'Yes', color: 'green', delta: 'Passed all thresholds' },
      ]
    },
    resultLabel: 'Fine-tuning results',
    keyPoints: [
      'Eval data is the training data — no separate dataset curation needed',
      'Mixing ratio balances domain expertise with general capability',
      'QAT produces quantized models that run 3x faster with minimal quality loss',
      'Auto-promote: if the fine-tuned model passes eval, it goes live. If not, it doesn\'t.',
    ]
  },
  {
    id: 'metrics',
    label: 'Monitor',
    sublabel: 'Track everything',
    badge: 'monitor',
    title: 'Real-Time Metrics Dashboard',
    description: 'Track cost, latency, quality, and routing decisions in real time. The dashboard shows how the system optimizes itself — and flags when something needs attention.',
    code: `import slancha

client = slancha.Client()

# Get usage summary for the last 7 days
usage = client.usage.summary(period="7d")

print(usage)
# {
#   "total_requests": 142847,
#   "total_cost": "$34.12",
#   "avg_latency_ms": 287,
#   "models_used": {
#     "deepseek-v3": 89234,
#     "gpt-4o-mini": 31205,
#     "ft:llama-3.1-8b:acme:v3": 18902,
#     "gpt-4o": 3506
#   },
#   "cost_savings_vs_gpt4o": "87%",
#   "quality_score_avg": 0.94,
#   "fine_tunes_deployed": 3,
#   "auto_promotions": 2,
#   "circuit_breaker_triggers": 1
# }`,
    codeLabel: 'Python — metrics.py',
    result: {
      type: 'metrics',
      items: [
        { label: 'Weekly requests', value: '142.8K', color: 'blue' },
        { label: 'Total cost', value: '$34.12', color: 'green', delta: '87% savings vs GPT-4o' },
        { label: 'Avg latency', value: '287ms', color: 'green' },
        { label: 'Quality score', value: '0.94', color: 'green', delta: 'Across all models' },
      ]
    },
    resultLabel: 'Dashboard metrics',
    keyPoints: [
      'Per-model cost breakdown shows exactly where your budget goes',
      'Quality score tracks across the route→analyze→fine-tune→optimize loop automatically',
      'Anomaly alerts notify you when latency spikes or quality drops below threshold',
      'Export metrics to Datadog, Grafana, or any observability platform via webhooks',
    ]
  },
];

export default function Demo() {
  usePageMeta('Product Demo', 'Interactive walkthrough of the Slancha platform — from signup to production deployment in 5 steps.');
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];

  return (
    <>
      <Nav />
      <main className="demo-page">
        <div className="demo-header">
          <h1>Product Walkthrough</h1>
          <p>See how Slancha takes you from signup to optimized production AI in 5 steps — no infrastructure required.</p>
        </div>

        <div className="demo-layout">
          <nav className="demo-nav">
            <div className="demo-progress">
              <div className="demo-progress-fill" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
            </div>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={`demo-nav-item${i === currentStep ? ' active' : ''}${i < currentStep ? ' completed' : ''}`}
                onClick={() => setCurrentStep(i)}
              >
                <span className="demo-nav-step">
                  {i < currentStep ? '✓' : i + 1}
                </span>
                <span className="demo-nav-label">
                  {s.label}
                  <small>{s.sublabel}</small>
                </span>
              </button>
            ))}
          </nav>

          <div className="demo-content">
            <div className="demo-step" key={step.id}>
              <div className="demo-step-header">
                <span className={`demo-step-badge ${step.badge}`}>
                  Step {currentStep + 1}: {step.badge}
                </span>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>

              <div className="demo-panels">
                <div className="demo-panel">
                  <div className="demo-panel-header">
                    <span>{'</>'}</span> {step.codeLabel}
                  </div>
                  <div className="demo-panel-body">{step.code}</div>
                </div>

                <div className="demo-panel">
                  <div className="demo-panel-header">
                    <span>📊</span> {step.resultLabel}
                  </div>
                  <div className="demo-visual">
                    <div className="demo-metric-grid">
                      {step.result.items.map((m, i) => (
                        <div className="demo-metric" key={i}>
                          <div className="demo-metric-label">{m.label}</div>
                          <div className={`demo-metric-value ${m.color}`}>{m.value}</div>
                          {m.delta && <div className="demo-metric-delta">{m.delta}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <ul className="demo-key-points">
                {step.keyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>

              <div className="demo-nav-buttons">
                <button
                  className="demo-btn demo-btn-prev"
                  onClick={() => setCurrentStep(s => s - 1)}
                  disabled={currentStep === 0}
                >
                  ← Previous
                </button>
                {currentStep < STEPS.length - 1 ? (
                  <button
                    className="demo-btn demo-btn-next"
                    onClick={() => setCurrentStep(s => s + 1)}
                  >
                    Next Step →
                  </button>
                ) : (
                  <Link to="/signup" className="demo-btn demo-btn-next" style={{ textDecoration: 'none' }}>
                    Start Free →
                  </Link>
                )}
              </div>
            </div>

            {currentStep === STEPS.length - 1 && (
              <div className="demo-cta">
                <h3>Ready to see this with your data?</h3>
                <p>Start a free pilot — bring your dataset, and we'll run the full route→analyze→fine-tune→optimize loop on your workload.</p>
                <Link to="/contact" className="demo-cta-btn">Request a Pilot</Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

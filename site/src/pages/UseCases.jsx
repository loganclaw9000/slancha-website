import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './UseCases.css';

const useCases = [
  {
    segment: 'enterprise',
    eyebrow: 'Enterprise ML Teams',
    title: 'Replace your manual model evaluation pipeline',
    challenge:
      'Your team evaluates models in notebooks, copies results into spreadsheets, and debates which model to deploy in meetings. Deployments take weeks. Post-training happens quarterly — if at all.',
    steps: [
      'Connect your eval datasets and custom metrics to Slancha',
      'Run automated head-to-head evaluations across all candidate models',
      'Deploy the winner with one click — canary, shadow, or full rollout',
      'Slancha captures production data and triggers retraining automatically',
    ],
    metrics: [
      { number: '10x', label: 'Faster eval cycles' },
      { number: '87%', label: 'Less manual work' },
      { number: '24/7', label: 'Continuous learning' },
    ],
  },
  {
    segment: 'startup',
    eyebrow: 'AI Startups',
    title: 'Ship AI features fast without building MLOps',
    challenge:
      'You have 3 engineers and need to ship AI-powered features yesterday. Building evaluation infrastructure, deployment pipelines, and monitoring from scratch would take months you don\'t have.',
    steps: [
      'Start with the free router — test models against your use case in minutes',
      'Use pre-built eval benchmarks or bring your own test cases',
      'Deploy to production with built-in A/B testing and rollback',
      'Focus on your product while Slancha handles the AI ops',
    ],
    metrics: [
      { number: '< 1 day', label: 'Time to production' },
      { number: '$0', label: 'Infrastructure cost to start' },
      { number: '3x', label: 'Faster iteration' },
    ],
  },
  {
    segment: 'research',
    eyebrow: 'Research Labs',
    title: 'Bridge the gap from experiment to production',
    challenge:
      'Your researchers train great models, but getting them into production requires a completely different skill set. Results sit in Weights & Biases dashboards while engineering rebuilds everything from scratch.',
    steps: [
      'Researchers run standardized evals through Slancha\'s Python SDK',
      'Results are directly comparable across experiments, teams, and time',
      'When a model is ready, deploy it to production from the same platform',
      'Production data automatically flows back into training pipelines',
    ],
    metrics: [
      { number: '80%', label: 'Faster research-to-prod' },
      { number: '1', label: 'Unified platform' },
      { number: '0', label: 'Lost experiments' },
    ],
  },
  {
    segment: 'platform',
    eyebrow: 'Platform Engineering Teams',
    title: 'Give every team self-service AI deployment',
    challenge:
      'Multiple product teams need AI capabilities, but each one builds their own evaluation and deployment pipeline. You\'re drowning in support requests and inconsistent practices.',
    steps: [
      'Set up Slancha as your organization\'s AI deployment platform',
      'Define org-wide evaluation standards and approval gates',
      'Product teams self-serve: evaluate, test, and deploy independently',
      'Central visibility into all models, their performance, and resource usage',
    ],
    metrics: [
      { number: '5x', label: 'More teams shipping AI' },
      { number: '1', label: 'Standard process' },
      { number: '90%', label: 'Fewer support tickets' },
    ],
  },
];

export default function UseCases() {
  return (
    <div className="page">
      <Nav />
      <main>
        <div className="usecases-page">
          <div className="usecases-header">
            <h1>Use Cases</h1>
            <p>
              See how teams use Slancha to automate model evaluation, deployment,
              and continuous learning.
            </p>
          </div>

          {useCases.map((uc) => (
            <div key={uc.segment} className="usecase-card">
              <span className={`usecase-eyebrow ${uc.segment}`}>
                {uc.eyebrow}
              </span>
              <h2>{uc.title}</h2>
              <p className="challenge">{uc.challenge}</p>
              <h3>How it works</h3>
              <ul className="usecase-steps">
                {uc.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
              <div className="usecase-result">
                {uc.metrics.map((m, i) => (
                  <div key={i} className="usecase-metric">
                    <span className="number">{m.number}</span>
                    <span className="label">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="usecases-cta">
            <h2>See Slancha in action</h2>
            <p>Start with the free tier. No credit card required.</p>
            <Link to="/signup" className="btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link to="/contact" className="btn-secondary btn-lg">
              Talk to Sales
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import './SocialProof.css';

const metrics = [
  { value: '60%', label: 'Cost Reduction', detail: 'vs. direct API calls' },
  { value: '<100ms', label: 'Routing Latency', detail: 'p99 request overhead' },
  { value: '99.9%', label: 'Uptime SLA', detail: 'enterprise guarantee' },
  { value: '0', label: 'Infrastructure', detail: 'servers to manage' },
];

const proofPoints = [
  {
    quote: 'We replaced our internal routing layer with Slancha in under a day. The auto-fine-tuning alone saved us two engineering sprints.',
    author: 'Early Access Participant',
    role: 'ML Platform Team, Series B Startup',
    initial: 'E',
  },
  {
    quote: 'The black box approach was skeptical at first, but the eval data speaks for itself — better outputs at a fraction of the cost.',
    author: 'Pilot Program Engineer',
    role: 'AI Infrastructure, Enterprise',
    initial: 'P',
  },
  {
    quote: 'Finally, something that handles model selection, optimization, and deployment without us needing a dedicated ML ops team.',
    author: 'Beta Tester',
    role: 'CTO, Seed-Stage AI Company',
    initial: 'B',
  },
];

function MetricCard({ value, label, detail }) {
  return (
    <div className="metric-card">
      <span className="metric-value">{value}</span>
      <span className="metric-label">{label}</span>
      <span className="metric-detail">{detail}</span>
    </div>
  );
}

function ProofCard({ quote, author, role, initial }) {
  return (
    <blockquote className="testimonial-card">
      <span className="quote-icon">&ldquo;</span>
      <p className="testimonial-quote">{quote}</p>
      <div className="author-block">
        <div className="author-avatar">
          <span className="initial">{initial}</span>
        </div>
        <div className="author-info">
          <cite className="author-name">{author}</cite>
          <span className="author-role">{role}</span>
        </div>
      </div>
    </blockquote>
  );
}

export default function SocialProof() {
  return (
    <section className="social-proof" aria-label="Platform metrics and feedback">
      <div className="social-proof-container">
        <div className="metrics-bar">
          <span className="social-proof-label">Platform Performance</span>
          <div className="metrics-grid">
            {metrics.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>
        </div>

        <div className="social-proof-testimonials">
          <span className="social-proof-label">From Our Early Access Program</span>
          <div className="testimonial-carousel">
            {proofPoints.map((p) => (
              <ProofCard key={p.initial} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './Features.css';

const features = [
  {
    icon: '⚡',
    title: 'Real Production Benchmarking',
    body: 'Evaluate models against your actual workloads, not synthetic benchmarks. Slancha scores cost, latency, and task accuracy on real traffic so you know which model earns its place before you deploy.',
  },
  {
    icon: '🎯',
    title: 'Multi-Target Deployment',
    body: 'Ship to API, managed hosting, or on-prem — or all three. Slancha routes traffic optimally across inference targets, adjusting in real-time as costs and latency profiles shift.',
  },
  {
    icon: '🔄',
    title: 'Post-Training Automation',
    body: 'Production signal captured during inference automatically becomes fine-tuning data. No manual exports, no data wrangling, no broken handoffs between eval and training teams.',
  },
  {
    icon: '🔗',
    title: 'Unified Data Layer',
    body: 'Eval output flows directly into fine-tuning input. Your data never leaves the platform, and every iteration builds on the signal from the last.',
  },
  {
    icon: '🤖',
    title: 'Autonomous SRE Agent',
    body: '24/7 monitoring of your inference fleet with automatic tuning of hardware allocation, cost routing, and SLA compliance. Available as an add-on to any plan.',
  },
  {
    icon: '📊',
    title: 'Cost Transparency & Optimization',
    body: 'Track cost-per-task across models, deployments, and cycles. Slancha optimizes on cost, latency, and accuracy simultaneously — not just one dimension in isolation.',
  },
];

export default function Features() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="features section-padded reveal" id="features">
      <h2 className="section-title">Everything you need to close the AI engineering loop</h2>
      <div className="features-grid">
        {features.map(f => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-body">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './Features.css';

const features = [
  {
    icon: '⚡',
    title: 'Latency‑First Optimization',
    body: 'We start with your service‑level agreement and automatically pick the right hardware, software, and scaling strategy to meet it.',
  },
  {
    icon: '🔧',
    title: 'Hardware Agnostic Deployments',
    body: 'Deploy across Amazon Inferentia, NVIDIA L40S, or custom B200 accelerators without rewriting code.',
  },
  {
    icon: '🤖',
    title: 'Autonomous SRE Agent',
    body: 'Our AI‑driven SRE agent runs the entire inference stack for you – provisioning, monitoring, scaling, and cost optimization.',
  },
  {
    icon: '📊',
    title: 'Cost Transparency & Control',
    body: 'Real‑time dashboards show performance vs. spend, letting you adjust targets on the fly.',
  },
  {
    icon: '🔗',
    title: 'Seamless Integration',
    body: 'Plug into your existing CI/CD pipelines; we handle the heavy lifting while you keep ownership of model development.',
  },
];

export default function Features() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="features section-padded reveal" id="features">
      <h2 className="section-title">Everything you need to run inference at scale</h2>
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

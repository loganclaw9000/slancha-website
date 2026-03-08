import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './TierCards.css';

const tiers = [
  {
    name: 'Managed Hosting',
    bestFor: 'Teams that want optimized inference without touching infra',
    description: 'Upload your model. We run benchmark sweeps, apply the right optimization stack, and host it at your latency target. Hourly pricing with optional placement in a specific CSP or region. You get an API endpoint. We own the uptime.',
    featured: false,
  },
  {
    name: 'Self-Hosted Deployment',
    bestFor: 'Teams with data residency or air-gap requirements',
    description: 'We convert your model into a secure NIM deployment package — optimized, containerized, and ready to run. Includes CloudFormation templates for API Gateway and auth. Deploy to your own cloud or on-prem. You control the infra; we handle the optimization.',
    featured: false,
  },
  {
    name: 'Autonomous SRE Agent',
    bestFor: 'Enterprise inference teams at scale',
    description: 'Full orchestration on top of your Kubernetes cluster. Our agent manages GPU bin-packing, autoscaling, and continuous benchmarking to hit SLAs at minimum cost. Shifts hardware dynamically — Inferentia overnight, L40S during business hours, B200 at peak demand. Currently in limited preview — contact us to join the waitlist.',
    featured: true,
  },
];

export default function TierCards() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="tier-section section-padded reveal" id="offerings">
      <h2 className="section-title">Built for inference teams with a real cloud bill</h2>
      <div className="tier-grid">
        {tiers.map(tier => (
          <div className={`tier-card${tier.featured ? ' tier-card--featured' : ''}`} key={tier.name}>
            {tier.featured && <div className="tier-badge">Enterprise Preview</div>}
            <h3 className="tier-name">{tier.name}</h3>
            <p className="tier-for">Best for: {tier.bestFor}</p>
            <hr className="tier-divider" />
            <p className="tier-body">{tier.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

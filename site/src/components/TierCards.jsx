import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './TierCards.css';

const tiers = [
  {
    name: 'Platform: Eval + Deploy',
    bestFor: 'AI engineering teams stitching together eval and inference tools today',
    description: 'Connect your production workloads, benchmark model candidates on real tasks, and deploy to API, managed hosting, or on-prem — all from one dashboard. Slancha tracks cost, latency, and accuracy across deployments so you always know which model is earning its spot.',
    price: '$2,000/month minimum',
    featured: false,
  },
  {
    name: 'Platform: Full Loop',
    bestFor: 'Teams running continuous fine-tuning or building proprietary model capabilities',
    description: 'Includes everything in Eval + Deploy, plus the post-training pipeline that closes the loop: production signal captured during inference automatically becomes fine-tuning data, prepared and fed into your training runs. Each cycle produces a more capable model at lower cost.',
    price: 'Custom pricing',
    featured: true,
  },
  {
    name: 'Enterprise: Self-Hosted',
    bestFor: 'Organizations with strict data residency, air-gap requirements, or compliance constraints',
    description: 'Deploy the full Slancha platform on your own infrastructure. You retain complete data ownership; we supply the control plane, eval framework, and fine-tuning pipeline as software.',
    price: 'One-time license fee',
    featured: false,
  },
  {
    name: 'Autonomous SRE Agent',
    bestFor: 'Enterprises running high-throughput inference at scale',
    description: 'Slancha\'s autonomous SRE agent monitors your inference fleet 24/7, tuning hardware allocation, cost routing, and SLA compliance without human intervention. Available as an add-on to any plan.',
    price: 'Limited preview',
    featured: false,
  },
];

export default function TierCards() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="tier-section section-padded reveal" id="offerings">
      <h2 className="section-title">Plans built for AI engineering teams</h2>
      <div className="tier-grid">
        {tiers.map(tier => (
          <div className={`tier-card${tier.featured ? ' tier-card--featured' : ''}`} key={tier.name}>
            {tier.featured && <div className="tier-badge">Most Popular</div>}
            <h3 className="tier-name">{tier.name}</h3>
            <p className="tier-for">Best for: {tier.bestFor}</p>
            <hr className="tier-divider" />
            <p className="tier-body">{tier.description}</p>
            <p className="tier-price">{tier.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

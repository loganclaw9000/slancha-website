import { Link } from 'react-router-dom';
import { useScrollReveal } from '../utils/useScrollReveal';
import { pricingTiers } from '../lib/stripe';
import './TierCards.css';

export default function TierCards() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="tier-section section-padded reveal" id="offerings">
      <h2 className="section-title">Plans built for AI engineering teams</h2>
      <div className="tier-grid">
        {pricingTiers.map(tier => (
          <div className={`tier-card${tier.featured ? ' tier-card--featured' : ''}`} key={tier.id}>
            {tier.featured && <div className="tier-badge">Most Popular</div>}
            <span className="tier-subtitle">{tier.subtitle}</span>
            <h3 className="tier-name">{tier.name}</h3>
            <p className="tier-for">{tier.bestFor}</p>
            <hr className="tier-divider" />
            <p className="tier-body">{tier.description}</p>
            <div className="tier-footer">
              <p className="tier-price">
                <span className="tier-amount">{tier.price}</span>
                <span className="tier-period">{tier.pricePeriod}</span>
              </p>
              <Link to="/pricing" className={`tier-cta ${tier.featured ? 'btn-primary' : 'btn-secondary'}`}>
                {tier.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

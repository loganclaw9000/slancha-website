import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { pricingTiers, handleCheckout } from '../lib/stripe';
import usePageMeta from '../hooks/usePageMeta';
import './Pricing.css';

export default function Pricing() {
  usePageMeta({ title: 'Pricing', description: 'Plans built for AI engineering teams. Free router, Platform for growing teams, and Enterprise for custom deployments. Start free, scale as you grow.' });
  return (
    <div className="page">
      <Nav />
      <main className="pricing-page">
        <section className="pricing-hero">
          <h1 className="pricing-title">
            Plans built for <span className="gradient-text">AI engineering teams</span>
          </h1>
          <p className="pricing-subtitle">
            From a smart router to full autonomous inference optimization. Start with what you need, scale when you're ready.
          </p>
        </section>

        <section className="pricing-grid-section">
          <div className="pricing-grid">
            {pricingTiers.map(tier => (
              <div className={`pricing-card${tier.featured ? ' pricing-card--featured' : ''}`} key={tier.id}>
                {tier.featured && <div className="pricing-badge">Most Popular</div>}
                <div className="pricing-card-header">
                  <span className="pricing-card-subtitle">{tier.subtitle}</span>
                  <h3 className="pricing-card-name">{tier.name}</h3>
                  <p className="pricing-card-for">{tier.bestFor}</p>
                </div>

                <div className="pricing-card-price">
                  <span className="pricing-amount">{tier.price}</span>
                  <span className="pricing-period">{tier.pricePeriod}</span>
                </div>

                <hr className="pricing-divider" />

                <ul className="pricing-features">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="pricing-feature">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pricing-check">
                        <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`pricing-cta ${tier.featured ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleCheckout(tier.id)}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-faq">
          <h2 className="pricing-faq-title">Frequently asked questions</h2>
          <div className="pricing-faq-grid">
            <div className="pricing-faq-item">
              <h3>Can I switch plans later?</h3>
              <p>Yes. Upgrade or downgrade at any time. When upgrading, you'll be prorated for the remainder of your billing cycle.</p>
            </div>
            <div className="pricing-faq-item">
              <h3>What's included in the pilot?</h3>
              <p>We'll connect your existing workloads, route traffic through Slancha, and show you cost savings and accuracy metrics before you commit.</p>
            </div>
            <div className="pricing-faq-item">
              <h3>Do you offer annual billing?</h3>
              <p>Yes. Annual plans come with a 15% discount. Contact sales for details.</p>
            </div>
            <div className="pricing-faq-item">
              <h3>How does the SRE Agent add-on work?</h3>
              <p>The SRE Agent attaches to any plan and monitors your inference fleet autonomously. It's currently in limited preview — join the waitlist to get early access.</p>
            </div>
          </div>
        </section>

        <section className="pricing-cta-section">
          <h2>Not sure which plan is right?</h2>
          <p>Talk to our team, <Link to="/pricing/compare" style={{ color: 'var(--primary-light)', textDecoration: 'underline' }}>compare us to competitors</Link>, or <Link to="/roi-calculator" style={{ color: 'var(--primary-light)', textDecoration: 'underline' }}>calculate your ROI</Link> to see how much you'll save.</p>
          <div className="pricing-cta-buttons">
            <Link to="/contact" className="btn-primary btn-lg">Talk to Sales</Link>
            <Link to="/signup" className="btn-secondary btn-lg">Start Free Trial</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { pricingTiers, tokenPricing, handleCheckout } from '../lib/stripe';
import usePageMeta from '../hooks/usePageMeta';
import { trackCtaClick } from '../lib/analytics';
import './Pricing.css';

export default function Pricing() {
  usePageMeta({ title: 'Pricing', description: 'Start free, scale as you grow. Smart routing with zero markup, automated fine-tuning that cuts costs 40–60%. Free tier included.' });
  return (
    <div className="page">
      <Nav />
      <main id="main-content" className="pricing-page">
        <section className="pricing-hero">
          <h1 className="pricing-title">
            Start free. <span className="gradient-text">Pay less than going direct.</span>
          </h1>
          <p className="pricing-subtitle">
            Zero markup on model costs. Automated fine-tuning that cuts inference costs 40–60%. Start with our free tier and scale when you see the savings.
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

                {tier.annualPrice && (
                  <div className="pricing-annual">
                    or {tier.annualPrice}{tier.annualPricePeriod}
                  </div>
                )}

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
                  onClick={() => { trackCtaClick(`pricing_${tier.id}`, 'pricing_page'); handleCheckout(tier.id); }}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-tokens">
          <h2 className="pricing-tokens-title">Transparent token pricing</h2>
          <p className="pricing-tokens-subtitle">You pay the underlying model cost — we take zero markup on routed requests. Fine-tuned models on the Scale plan deliver frontier-quality results at a fraction of the price.</p>
          <div className="pricing-tokens-grid">
            {[tokenPricing.routing, tokenPricing.fineTuned].map(group => (
              <div className="pricing-token-card" key={group.label}>
                <h3 className="pricing-token-label">{group.label}</h3>
                <p className="pricing-token-desc">{group.description}</p>
                <table className="pricing-token-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Input</th>
                      <th>Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.examples.map(ex => (
                      <tr key={ex.model}>
                        <td>{ex.model}</td>
                        <td>{ex.input}</td>
                        <td>
                          {ex.output}
                          {ex.savings && <span className="pricing-token-savings">{ex.savings}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="pricing-token-unit">per 1M tokens</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-faq">
          <h2 className="pricing-faq-title">Frequently asked questions</h2>
          <div className="pricing-faq-grid">
            <div className="pricing-faq-item">
              <h3>How does the free tier work?</h3>
              <p>Sign up, get an API key, start making requests. 10,000 requests/month with smart routing across 20+ models. No credit card required.</p>
            </div>
            <div className="pricing-faq-item">
              <h3>What does "zero markup" mean?</h3>
              <p>When Slancha routes your request to a model, you pay exactly what the model provider charges. We don't add a percentage on top. Our revenue comes from the platform fee and the savings generated by fine-tuning.</p>
            </div>
            <div className="pricing-faq-item">
              <h3>How do fine-tuned models save me money?</h3>
              <p>On the Scale plan, Slancha automatically fine-tunes smaller models on your specific tasks. A fine-tuned 7B model can match GPT-4 quality on your workloads while costing 95% less per token.</p>
            </div>
            <div className="pricing-faq-item">
              <h3>Can I switch plans anytime?</h3>
              <p>Yes. Upgrade or downgrade instantly. Upgrades are prorated. Annual plans get 20% off.</p>
            </div>
            <div className="pricing-faq-item">
              <h3>What happens when I exceed the free tier limit?</h3>
              <p>Requests are paused until the next billing cycle, or you can upgrade to Pro for unlimited requests. We'll notify you at 80% usage.</p>
            </div>
            <div className="pricing-faq-item">
              <h3>Do you offer a pilot program?</h3>
              <p>Yes. We'll connect your existing workloads, route traffic through Slancha, and show you real cost savings and accuracy metrics before you commit to a paid plan.</p>
            </div>
          </div>
        </section>

        <section className="pricing-cta-section">
          <h2>Not sure which plan is right?</h2>
          <p>Talk to our team, <Link to="/pricing/compare" style={{ color: 'var(--primary-light)', textDecoration: 'underline' }}>compare us to competitors</Link>, or <Link to="/roi-calculator" style={{ color: 'var(--primary-light)', textDecoration: 'underline' }}>calculate your ROI</Link> to see how much you'll save.</p>
          <div className="pricing-cta-buttons">
            <Link to="/contact" className="btn-primary btn-lg">Talk to Sales</Link>
            <Link to="/signup" className="btn-secondary btn-lg">Start Free</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

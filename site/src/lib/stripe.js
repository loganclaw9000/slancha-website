import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const apiUrl = import.meta.env.VITE_API_URL || '';

let stripePromise = null;

export function getStripe() {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
}

/**
 * Pricing tiers — matches the server-side product catalog.
 * Checkout flows through the API server's /stripe/create-checkout-session endpoint.
 * Falls back to Payment Links if API is not configured.
 */
export const pricingTiers = [
  {
    id: 'eval-deploy',
    name: 'Eval + Deploy',
    subtitle: 'Platform',
    bestFor: 'AI engineering teams stitching together eval and inference tools today',
    description: 'Connect your production workloads, benchmark model candidates on real tasks, and deploy to API, managed hosting, or on-prem — all from one dashboard.',
    features: [
      'Model benchmarking on production tasks',
      'Deploy to API, managed hosting, or on-prem',
      'Cost, latency, and accuracy tracking',
      'Multi-model routing dashboard',
      'Deployment rollback & canary releases',
      '50,000 API requests/month included',
    ],
    price: '$299',
    pricePeriod: '/mo + usage',
    annualPrice: '$239',
    annualPricePeriod: '/mo (billed annually)',
    paymentLink: import.meta.env.VITE_STRIPE_LINK_EVAL_DEPLOY,
    cta: 'Get Started',
    featured: false,
  },
  {
    id: 'full-loop',
    name: 'Full Loop',
    subtitle: 'Platform',
    bestFor: 'Teams running continuous fine-tuning or building proprietary model capabilities',
    description: 'The complete platform: routing, task analysis, automated fine-tuning, and inference optimization. The full closed loop — production usage automatically improves your models.',
    features: [
      'Everything in Route + Analyze',
      'Automated fine-tuning pipeline',
      'Production usage → fine-tuning data',
      'Continuous model improvement cycles',
      'Custom training run scheduling',
      'Fine-tuning data quality monitoring',
      '500,000 API requests/month included',
    ],
    price: '$999',
    pricePeriod: '/mo + usage',
    annualPrice: '$799',
    annualPricePeriod: '/mo (billed annually)',
    paymentLink: import.meta.env.VITE_STRIPE_LINK_FULL_LOOP,
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    id: 'self-hosted',
    name: 'Self-Hosted',
    subtitle: 'Enterprise',
    bestFor: 'Organizations with strict data residency, air-gap requirements, or compliance constraints',
    description: 'Deploy the full Slancha platform on your own infrastructure. Complete data ownership with our control plane, eval framework, and fine-tuning pipeline.',
    features: [
      'Full platform on your infrastructure',
      'Complete data ownership & residency',
      'Air-gap compatible deployment',
      'SOC 2 & HIPAA compliance ready',
      'Dedicated support engineer',
      'Custom SLA agreements',
    ],
    price: 'Custom',
    pricePeriod: 'one-time license',
    paymentLink: null,
    cta: 'Contact Sales',
    featured: false,
  },
  {
    id: 'sre-agent',
    name: 'Autonomous SRE Agent',
    subtitle: 'Add-on',
    bestFor: 'Enterprises running high-throughput inference at scale',
    description: 'Slancha\'s autonomous SRE agent monitors your inference fleet 24/7, tuning hardware allocation, cost routing, and SLA compliance.',
    features: [
      '24/7 autonomous fleet monitoring',
      'Hardware allocation optimization',
      'Cost-aware request routing',
      'SLA compliance enforcement',
      'Incident auto-remediation',
      'Available as add-on to any plan',
    ],
    price: 'Limited',
    pricePeriod: 'preview',
    paymentLink: null,
    cta: 'Join Waitlist',
    featured: false,
  },
];

/**
 * Start checkout flow.
 *
 * Priority:
 * 1. Stripe Checkout Session via API server (if VITE_API_URL is set)
 * 2. Stripe Payment Link (if VITE_STRIPE_LINK_* is set)
 * 3. Contact page fallback
 */
export async function handleCheckout(tierId, { interval = 'monthly', userId, email } = {}) {
  const tier = pricingTiers.find(t => t.id === tierId);
  if (!tier) return;

  // Custom pricing tiers → contact
  if (tier.price === 'Custom' || tier.price === 'Limited') {
    window.location.href = `/contact?plan=${tierId}`;
    return;
  }

  // Try Checkout Session via API server
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId, interval, userId, email }),
      });

      const data = await res.json();

      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.sessionId) {
        const stripe = await getStripe();
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
          return;
        }
      }
    } catch (err) {
      console.warn('[stripe] Checkout session failed, falling back:', err.message);
    }
  }

  // Fallback: Payment Link
  if (tier.paymentLink) {
    window.location.href = tier.paymentLink;
    return;
  }

  // Final fallback: contact page
  window.location.href = `/contact?plan=${tierId}`;
}

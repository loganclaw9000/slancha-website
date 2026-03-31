import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise = null;

export function getStripe() {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
}

/**
 * Pricing tiers with Stripe Payment Link IDs.
 * Configure VITE_STRIPE_LINK_* env vars with your Stripe Payment Links.
 * When a backend is available, switch to Checkout Sessions for more control.
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
    ],
    price: '$299',
    pricePeriod: '/mo + usage',
    paymentLink: import.meta.env.VITE_STRIPE_LINK_EVAL_DEPLOY,
    cta: 'Get Started',
    featured: false,
  },
  {
    id: 'full-loop',
    name: 'Full Loop',
    subtitle: 'Platform',
    bestFor: 'Teams running continuous fine-tuning or building proprietary model capabilities',
    description: 'Everything in Eval + Deploy, plus the post-training pipeline that closes the loop: production signal automatically becomes fine-tuning data.',
    features: [
      'Everything in Eval + Deploy',
      'Post-training pipeline automation',
      'Production signal → fine-tuning data',
      'Continuous model improvement cycles',
      'Custom training run scheduling',
      'Fine-tuning data quality monitoring',
    ],
    price: '$999',
    pricePeriod: '/mo + usage',
    paymentLink: import.meta.env.VITE_STRIPE_LINK_FULL_LOOP,
    cta: 'Contact Sales',
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
    paymentLink: import.meta.env.VITE_STRIPE_LINK_SELF_HOSTED,
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
    paymentLink: import.meta.env.VITE_STRIPE_LINK_SRE_AGENT,
    cta: 'Join Waitlist',
    featured: false,
  },
];

/**
 * Redirect to Stripe Payment Link or contact page.
 * Falls back to contact page if no payment link is configured.
 */
export function handleCheckout(tierId) {
  const tier = pricingTiers.find(t => t.id === tierId);
  if (!tier) return;

  if (tier.paymentLink) {
    window.location.href = tier.paymentLink;
  } else {
    // Fallback: redirect to contact with tier context
    window.location.href = `/contact?plan=${tierId}`;
  }
}

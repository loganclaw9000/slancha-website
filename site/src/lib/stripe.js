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
    id: 'starter',
    name: 'Starter',
    subtitle: 'Free',
    bestFor: 'Developers and small teams evaluating smart inference routing',
    description: 'Try Slancha with zero commitment. Route requests to the right model automatically and see the cost savings firsthand.',
    features: [
      'Smart model routing',
      '10,000 API requests/month',
      'Access to 20+ open-source models',
      'Usage dashboard & basic analytics',
      'Community support',
      '0% markup on model costs',
    ],
    price: 'Free',
    pricePeriod: '',
    paymentLink: null,
    cta: 'Get Started Free',
    featured: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'For growing teams',
    bestFor: 'Teams moving to production that want routing, analytics, and cost control',
    description: 'Unlimited routing with full observability. Pay only for the tokens you use — with zero markup on underlying model costs.',
    features: [
      'Everything in Starter',
      'Unlimited API requests',
      'All models (open-source + frontier)',
      'Advanced analytics & cost tracking',
      'Deployment rollback & canary releases',
      'Multi-model A/B testing',
      'Email support',
    ],
    price: '$49',
    pricePeriod: '/mo + usage',
    annualPrice: '$39',
    annualPricePeriod: '/mo (billed annually)',
    paymentLink: import.meta.env.VITE_STRIPE_LINK_PRO,
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    id: 'scale',
    name: 'Scale',
    subtitle: 'Full platform',
    bestFor: 'Teams that want automated fine-tuning and inference optimization — the full closed loop',
    description: 'The complete Slancha platform. Your production usage automatically trains task-specific models that outperform frontier at a fraction of the cost.',
    features: [
      'Everything in Pro',
      'Automated fine-tuning on your usage data',
      'Inference optimization (quantization, MIG)',
      'Continuous model improvement loop',
      'Custom model training schedules',
      'Fine-tuned models at 40–60% less than frontier',
      'Priority support + Slack channel',
    ],
    price: '$499',
    pricePeriod: '/mo + usage',
    annualPrice: '$399',
    annualPricePeriod: '/mo (billed annually)',
    paymentLink: import.meta.env.VITE_STRIPE_LINK_SCALE,
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Custom',
    bestFor: 'Organizations needing self-hosted deployment, compliance, or dedicated infrastructure',
    description: 'Deploy Slancha on your own infrastructure with complete data ownership. SOC 2, HIPAA, and air-gap ready.',
    features: [
      'Everything in Scale',
      'Self-hosted or VPC deployment',
      'Complete data ownership & residency',
      'SOC 2 & HIPAA compliance',
      'Custom SLA agreements',
      'Dedicated support engineer',
      'SSO & advanced RBAC',
    ],
    price: 'Custom',
    pricePeriod: '',
    paymentLink: null,
    cta: 'Contact Sales',
    featured: false,
  },
];

/**
 * Published token pricing — displayed on pricing page.
 * Slancha charges 0% markup on routed requests.
 * Fine-tuned model inference is 40-60% cheaper than frontier equivalents.
 */
export const tokenPricing = {
  routing: {
    label: 'Routed requests',
    description: 'Pay the underlying model cost — zero Slancha markup',
    examples: [
      { model: 'Llama 3.3 70B', input: '$0.88', output: '$0.88', unit: '/1M tokens' },
      { model: 'Mistral Small 3', input: '$0.10', output: '$0.30', unit: '/1M tokens' },
      { model: 'DeepSeek V3', input: '$0.56', output: '$1.68', unit: '/1M tokens' },
    ],
  },
  fineTuned: {
    label: 'Fine-tuned models (Scale plan)',
    description: 'Task-specific models trained on your usage — dramatically cheaper than frontier',
    examples: [
      { model: 'Your fine-tuned 7B', input: '$0.05', output: '$0.10', unit: '/1M tokens', savings: 'vs $3.00/$15.00 frontier' },
      { model: 'Your fine-tuned 14B', input: '$0.12', output: '$0.25', unit: '/1M tokens', savings: 'vs $3.00/$15.00 frontier' },
      { model: 'Your fine-tuned 70B', input: '$0.50', output: '$0.80', unit: '/1M tokens', savings: 'vs $3.00/$15.00 frontier' },
    ],
  },
};

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

  // Free tier → signup
  if (tier.price === 'Free') {
    window.location.href = '/signup';
    return;
  }

  // Custom pricing tiers → contact
  if (tier.price === 'Custom') {
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
      if (import.meta.env.DEV) console.warn('[stripe] Checkout session failed, falling back:', err.message);
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

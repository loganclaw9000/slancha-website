/**
 * Slancha Stripe Product Catalog
 *
 * Defines all products, prices, and features for the Stripe integration.
 * Use `node stripe-setup.js` to create these in your Stripe account,
 * or create them manually in the Stripe Dashboard and paste the IDs below.
 *
 * After setup, set STRIPE_PRICE_* env vars with the real price IDs.
 */

// --- Product catalog ---
export const products = {
  'eval-deploy': {
    name: 'Slancha Eval + Deploy',
    description: 'Model benchmarking, multi-model routing, and deployment management.',
    metadata: { tier: 'eval-deploy', plan_code: 'starter' },
    prices: {
      monthly: {
        amount: 29900, // $299.00
        currency: 'usd',
        interval: 'month',
        envVar: 'STRIPE_PRICE_EVAL_DEPLOY_MONTHLY',
      },
      annual: {
        amount: 287000, // $2,870.00 (~20% discount)
        currency: 'usd',
        interval: 'year',
        envVar: 'STRIPE_PRICE_EVAL_DEPLOY_ANNUAL',
      },
    },
    features: [
      'Model benchmarking on production tasks',
      'Deploy to API, managed hosting, or on-prem',
      'Cost, latency, and accuracy tracking',
      'Multi-model routing dashboard',
      'Deployment rollback & canary releases',
      '50,000 API requests/month included',
    ],
    limits: {
      requests_per_month: 50000,
      models: 10,
      team_members: 5,
    },
  },
  'full-loop': {
    name: 'Slancha Full Loop',
    description: 'Everything in Eval + Deploy, plus the post-training pipeline that closes the loop.',
    metadata: { tier: 'full-loop', plan_code: 'growth' },
    prices: {
      monthly: {
        amount: 99900, // $999.00
        currency: 'usd',
        interval: 'month',
        envVar: 'STRIPE_PRICE_FULL_LOOP_MONTHLY',
      },
      annual: {
        amount: 959000, // $9,590.00 (~20% discount)
        currency: 'usd',
        interval: 'year',
        envVar: 'STRIPE_PRICE_FULL_LOOP_ANNUAL',
      },
    },
    features: [
      'Everything in Eval + Deploy',
      'Post-training pipeline automation',
      'Production signal → fine-tuning data',
      'Continuous model improvement cycles',
      'Custom training run scheduling',
      'Fine-tuning data quality monitoring',
      '500,000 API requests/month included',
    ],
    limits: {
      requests_per_month: 500000,
      models: -1, // unlimited
      team_members: 25,
    },
  },
  'self-hosted': {
    name: 'Slancha Self-Hosted',
    description: 'Full platform on your infrastructure with complete data ownership.',
    metadata: { tier: 'self-hosted', plan_code: 'enterprise' },
    prices: null, // Custom pricing — contact sales
    features: [
      'Full platform on your infrastructure',
      'Complete data ownership & residency',
      'Air-gap compatible deployment',
      'SOC 2 & HIPAA compliance ready',
      'Dedicated support engineer',
      'Custom SLA agreements',
      'Unlimited requests',
    ],
    limits: {
      requests_per_month: -1,
      models: -1,
      team_members: -1,
    },
  },
  'sre-agent': {
    name: 'Slancha Autonomous SRE Agent',
    description: 'Autonomous SRE agent that monitors and optimizes your inference fleet 24/7.',
    metadata: { tier: 'sre-agent', plan_code: 'sre-addon' },
    prices: null, // Limited preview — join waitlist
    features: [
      '24/7 autonomous fleet monitoring',
      'Hardware allocation optimization',
      'Cost-aware request routing',
      'SLA compliance enforcement',
      'Incident auto-remediation',
    ],
    limits: null,
  },
};

// --- Price ID resolution ---
// Returns the Stripe price ID from environment variables
export function getPriceId(tierId, interval = 'monthly') {
  const product = products[tierId];
  if (!product?.prices?.[interval]) return null;
  return process.env[product.prices[interval].envVar] || null;
}

// --- Tier lookup by Stripe price ID ---
export function getTierByPriceId(priceId) {
  for (const [tierId, product] of Object.entries(products)) {
    if (!product.prices) continue;
    for (const [interval, price] of Object.entries(product.prices)) {
      if (process.env[price.envVar] === priceId) {
        return { tierId, interval, product };
      }
    }
  }
  return null;
}

// --- Plan code lookup ---
export function getPlanCode(tierId) {
  return products[tierId]?.metadata?.plan_code || 'free';
}

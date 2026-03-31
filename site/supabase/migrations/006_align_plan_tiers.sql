-- Align plan names with product pricing page tiers.
-- Old: free, starter, growth, enterprise
-- New: free, eval-deploy, full-loop, self-hosted
--
-- The SRE Agent is an add-on, not a standalone plan.

-- 1. Update plan_limits to new tier names and pricing
DELETE FROM public.plan_limits;

INSERT INTO public.plan_limits (plan, requests_per_month, models_included, max_tokens_per_request, fine_tuning_jobs, support_level, price_monthly_cents)
VALUES
  ('free',        1000,     3,   4096,  0,  'community',    0),
  ('eval-deploy', 50000,   10,  16384,  2,  'email',    29900),
  ('full-loop',  500000,   25,  32768, 10,  'priority', 99900),
  ('self-hosted',    -1,   -1,     -1, -1,  'dedicated',   -1);

-- 2. Migrate existing subscriptions to new plan names
UPDATE public.subscriptions SET plan = 'eval-deploy' WHERE plan = 'starter';
UPDATE public.subscriptions SET plan = 'full-loop'   WHERE plan = 'growth';
UPDATE public.subscriptions SET plan = 'self-hosted' WHERE plan = 'enterprise';
-- 'free' stays 'free'

-- 3. Add Stripe price ID column to plan_limits for checkout session creation
ALTER TABLE public.plan_limits ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- 4. Add index on stripe IDs for webhook lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);

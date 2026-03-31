-- Add Stripe Checkout Session fields to subscriptions table
-- Enables the /stripe/create-checkout-session → webhook → DB sync flow

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS price_id TEXT,
  ADD COLUMN IF NOT EXISTS billing_interval TEXT DEFAULT 'monthly';

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub
  ON public.subscriptions(stripe_subscription_id);

-- Update plan_limits to match product catalog pricing
-- Starter = Eval + Deploy ($299/mo), Growth = Full Loop ($999/mo)
UPDATE public.plan_limits SET price_monthly_cents = 29900 WHERE plan = 'starter';
UPDATE public.plan_limits SET price_monthly_cents = 99900 WHERE plan = 'growth';

-- Allow service role to manage subscriptions (for webhook handler)
-- RLS policy for service_role is implicit (bypasses RLS), but add update policy for completeness
CREATE POLICY "Service can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

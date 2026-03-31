-- Subscriptions table: tracks user plan and billing state
-- Synced from Stripe via webhook (stripe_customer_id, stripe_subscription_id)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',  -- free, starter, growth, enterprise
  status TEXT NOT NULL DEFAULT 'active',  -- active, canceled, past_due, trialing
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON public.subscriptions(stripe_customer_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Plan limits table: defines tier boundaries
CREATE TABLE public.plan_limits (
  plan TEXT PRIMARY KEY,
  requests_per_month INT NOT NULL,
  models_included INT NOT NULL,
  max_tokens_per_request INT NOT NULL,
  fine_tuning_jobs INT NOT NULL DEFAULT 0,
  support_level TEXT NOT NULL DEFAULT 'community',
  price_monthly_cents INT NOT NULL DEFAULT 0
);

-- Seed plan limits matching pricing page
INSERT INTO public.plan_limits (plan, requests_per_month, models_included, max_tokens_per_request, fine_tuning_jobs, support_level, price_monthly_cents)
VALUES
  ('free',       1000,     3,  4096,  0,  'community',    0),
  ('starter',   50000,    10, 16384,  2,  'email',     4900),
  ('growth',   500000,    25, 32768, 10,  'priority', 29900),
  ('enterprise', -1,      -1,    -1, -1,  'dedicated',   -1);
-- enterprise: -1 means unlimited / custom

-- Auto-create free subscription on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

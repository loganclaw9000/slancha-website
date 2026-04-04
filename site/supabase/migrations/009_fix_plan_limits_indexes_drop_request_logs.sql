-- Fix 1: Add SELECT policy to plan_limits so frontend can read plan tiers
CREATE POLICY "Anyone can view plan limits"
  ON public.plan_limits
  FOR SELECT
  USING (true);

-- Fix 2: Add missing indexes on user_id for RLS-filtered tables
CREATE INDEX idx_api_keys_user_id ON public.api_keys USING btree (user_id);
CREATE INDEX idx_webhooks_user_id ON public.webhooks USING btree (user_id);

-- Fix 3: Drop request_logs (duplicate of usage_logs, consolidated)
DROP TABLE IF EXISTS public.request_logs;

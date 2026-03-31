-- Enable INSERT on usage_logs for authenticated users (missing from 002)
CREATE POLICY "Users can insert own usage logs"
  ON public.usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Materialized view for daily usage aggregation (avoids scanning raw logs)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.usage_daily AS
SELECT
  user_id,
  date_trunc('day', created_at)::date AS day,
  COUNT(*)::int AS requests,
  SUM(tokens_in + tokens_out)::bigint AS tokens,
  SUM(cost_cents)::numeric(12,4) AS cost_cents,
  AVG(latency_ms)::int AS avg_latency_ms,
  COUNT(DISTINCT model) AS models_used,
  COUNT(*) FILTER (WHERE status_code >= 400)::int AS errors
FROM public.usage_logs
GROUP BY user_id, date_trunc('day', created_at)::date;

CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_daily_user_day
  ON public.usage_daily (user_id, day);

-- Function to refresh materialized view (call via cron or edge function)
CREATE OR REPLACE FUNCTION public.refresh_usage_daily()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.usage_daily;
END;
$$;

-- Index for faster per-user lookups on raw logs
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_model
  ON public.usage_logs (user_id, model, created_at DESC);

-- Update api_keys.last_used_at trigger
CREATE OR REPLACE FUNCTION public.update_api_key_last_used()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.api_key_id IS NOT NULL THEN
    UPDATE public.api_keys
    SET last_used_at = NEW.created_at
    WHERE id = NEW.api_key_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_usage_update_key_last_used
  AFTER INSERT ON public.usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_api_key_last_used();

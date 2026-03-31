-- Extend usage_logs with endpoint tracking, cost, and status code
ALTER TABLE public.usage_logs
  ADD COLUMN IF NOT EXISTS endpoint TEXT DEFAULT '/v1/route',
  ADD COLUMN IF NOT EXISTS cost_cents NUMERIC(10,4) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status_code INT DEFAULT 200;

-- Allow api_key_id to be nullable (some requests may not have a key, e.g. playground)
ALTER TABLE public.usage_logs ALTER COLUMN api_key_id DROP NOT NULL;

-- Better composite index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date
  ON public.usage_logs (user_id, created_at DESC);

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for fetching user subscription and plan limits from Supabase.
 * Falls back to free plan when Supabase is not configured.
 *
 * Tables required: see migrations/004_subscriptions.sql
 */

const PLAN_LIMITS_FALLBACK = {
  free:       { requests_per_month: 1000,   models_included: 3,  max_tokens_per_request: 4096,  fine_tuning_jobs: 0,  support_level: 'community',  price_monthly_cents: 0 },
  starter:    { requests_per_month: 50000,  models_included: 10, max_tokens_per_request: 16384, fine_tuning_jobs: 2,  support_level: 'email',      price_monthly_cents: 4900 },
  growth:     { requests_per_month: 500000, models_included: 25, max_tokens_per_request: 32768, fine_tuning_jobs: 10, support_level: 'priority',   price_monthly_cents: 29900 },
  enterprise: { requests_per_month: -1,     models_included: -1, max_tokens_per_request: -1,    fine_tuning_jobs: -1, support_level: 'dedicated',  price_monthly_cents: -1 },
};

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

const FREE_SUB = {
  plan: 'free',
  status: 'active',
  current_period_start: null,
  current_period_end: null,
  cancel_at_period_end: false,
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(FREE_SUB);
  const [limits, setLimits] = useState(PLAN_LIMITS_FALLBACK.free);
  const [usage, setUsage] = useState({ requests_this_month: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setSubscription(FREE_SUB);
      setLimits(PLAN_LIMITS_FALLBACK.free);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Fetch subscription
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('plan, status, current_period_start, current_period_end, cancel_at_period_end, updated_at')
        .eq('user_id', user.id)
        .single();

      if (subError && subError.code !== 'PGRST116') throw subError; // PGRST116 = no rows

      const sub = subData || FREE_SUB;
      setSubscription(sub);

      // Fetch plan limits
      const { data: limitsData } = await supabase
        .from('plan_limits')
        .select('*')
        .eq('plan', sub.plan)
        .single();

      setLimits(limitsData || PLAN_LIMITS_FALLBACK[sub.plan] || PLAN_LIMITS_FALLBACK.free);

      // Count requests this month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { count, error: countError } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', monthStart.toISOString());

      if (!countError) {
        setUsage({ requests_this_month: count || 0 });
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch subscription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isUnlimited = limits.requests_per_month === -1;
  const usagePercent = isUnlimited ? 0 : limits.requests_per_month > 0
    ? Math.min((usage.requests_this_month / limits.requests_per_month) * 100, 100)
    : 0;
  const isNearLimit = usagePercent >= 80;
  const isAtLimit = usagePercent >= 100;

  return {
    subscription,
    limits,
    usage,
    loading,
    error,
    refetch: fetchSubscription,
    isConnected: isSupabaseConfigured(),
    // Computed helpers
    planName: subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1),
    isFreePlan: subscription.plan === 'free',
    isActive: subscription.status === 'active' || subscription.status === 'trialing',
    isCanceling: subscription.cancel_at_period_end,
    isUnlimited,
    usagePercent,
    isNearLimit,
    isAtLimit,
  };
}

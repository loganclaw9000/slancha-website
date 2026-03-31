import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for fetching API usage stats from Supabase.
 * Falls back to empty state when Supabase is not configured.
 *
 * Supabase table required:
 * See migrations: 002_api_keys_and_usage.sql (base table)
 *                  003_usage_logs_extend.sql (endpoint, cost_cents, status_code)
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

function getDateRange(period) {
  const now = new Date();
  const start = new Date(now);
  switch (period) {
    case '7d':
      start.setDate(now.getDate() - 7);
      break;
    case '30d':
      start.setDate(now.getDate() - 30);
      break;
    case '90d':
      start.setDate(now.getDate() - 90);
      break;
    default:
      start.setDate(now.getDate() - 30);
  }
  return { start: start.toISOString(), end: now.toISOString() };
}

function aggregateByDay(logs) {
  const byDay = {};
  logs.forEach(log => {
    const day = log.created_at.slice(0, 10);
    if (!byDay[day]) {
      byDay[day] = { date: day, requests: 0, tokens: 0, cost: 0, latency_sum: 0 };
    }
    byDay[day].requests += 1;
    byDay[day].tokens += (log.tokens_in || 0) + (log.tokens_out || 0);
    byDay[day].cost += parseFloat(log.cost_cents || 0);
    byDay[day].latency_sum += log.latency_ms || 0;
  });

  return Object.values(byDay)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      ...d,
      avg_latency: d.requests > 0 ? Math.round(d.latency_sum / d.requests) : 0,
    }));
}

function aggregateByModel(logs) {
  const byModel = {};
  logs.forEach(log => {
    const model = log.model || 'unknown';
    if (!byModel[model]) {
      byModel[model] = { model, requests: 0, tokens: 0, cost: 0 };
    }
    byModel[model].requests += 1;
    byModel[model].tokens += (log.tokens_in || 0) + (log.tokens_out || 0);
    byModel[model].cost += parseFloat(log.cost_cents || 0);
  });

  return Object.values(byModel).sort((a, b) => b.requests - a.requests);
}

function aggregateByEndpoint(logs) {
  const byEndpoint = {};
  logs.forEach(log => {
    const ep = log.endpoint || '/v1/route';
    if (!byEndpoint[ep]) {
      byEndpoint[ep] = { endpoint: ep, requests: 0, avg_latency: 0, latency_sum: 0, errors: 0 };
    }
    byEndpoint[ep].requests += 1;
    byEndpoint[ep].latency_sum += log.latency_ms || 0;
    if (log.status_code >= 400) byEndpoint[ep].errors += 1;
  });

  return Object.values(byEndpoint)
    .sort((a, b) => b.requests - a.requests)
    .map(e => ({
      ...e,
      avg_latency: e.requests > 0 ? Math.round(e.latency_sum / e.requests) : 0,
      error_rate: e.requests > 0 ? ((e.errors / e.requests) * 100).toFixed(1) : '0.0',
    }));
}

export function useUsageStats(period = '30d') {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    avgLatency: 0,
    modelsUsed: 0,
    errorRate: '0.0',
    daily: [],
    byModel: [],
    byEndpoint: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const { start, end } = getDateRange(period);

      const { data, error: fetchError } = await supabase
        .from('usage_logs')
        .select('endpoint, model, tokens_in, tokens_out, latency_ms, cost_cents, status_code, created_at')
        .eq('user_id', user.id)
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const logs = data || [];
      const totalRequests = logs.length;
      const totalTokens = logs.reduce((s, l) => s + (l.tokens_in || 0) + (l.tokens_out || 0), 0);
      const totalCost = logs.reduce((s, l) => s + parseFloat(l.cost_cents || 0), 0);
      const totalLatency = logs.reduce((s, l) => s + (l.latency_ms || 0), 0);
      const errors = logs.filter(l => l.status_code >= 400).length;
      const models = new Set(logs.map(l => l.model_routed).filter(Boolean));

      setStats({
        totalRequests,
        totalTokens,
        totalCost: totalCost / 100, // cents to dollars
        avgLatency: totalRequests > 0 ? Math.round(totalLatency / totalRequests) : 0,
        modelsUsed: models.size,
        errorRate: totalRequests > 0 ? ((errors / totalRequests) * 100).toFixed(1) : '0.0',
        daily: aggregateByDay(logs),
        byModel: aggregateByModel(logs),
        byEndpoint: aggregateByEndpoint(logs),
      });
    } catch (err) {
      console.error('Failed to fetch usage stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    isConnected: isSupabaseConfigured(),
  };
}

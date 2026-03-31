import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for logging API usage to Supabase.
 * Call trackUsage() after each API request to record metrics.
 * Falls back silently when Supabase is not configured.
 *
 * Depends on: usage_logs table (002, 003, 008 migrations)
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

// Cost estimation per model (cents per 1K tokens)
const MODEL_COSTS = {
  'gpt-4o': { input: 0.25, output: 1.0 },
  'gpt-4o-mini': { input: 0.015, output: 0.06 },
  'claude-sonnet-4-20250514': { input: 0.3, output: 1.5 },
  'llama-3.1-70b': { input: 0.059, output: 0.079 },
  'mixtral-8x22b': { input: 0.06, output: 0.06 },
  'gemini-2.0-flash': { input: 0.01, output: 0.04 },
  'deepseek-v3': { input: 0.014, output: 0.028 },
  'slancha-router': { input: 0.1, output: 0.4 },
};

function estimateCost(model, tokensIn, tokensOut) {
  const rates = MODEL_COSTS[model] || { input: 0.1, output: 0.4 };
  return (tokensIn / 1000) * rates.input + (tokensOut / 1000) * rates.output;
}

export function useUsageTracking() {
  const { user } = useAuth();

  /**
   * Log a single API request to usage_logs.
   * @param {Object} params
   * @param {string} params.endpoint - API endpoint (e.g. '/v1/chat/completions')
   * @param {string} params.model - Model used (e.g. 'gpt-4o')
   * @param {number} params.tokensIn - Input token count
   * @param {number} params.tokensOut - Output token count
   * @param {number} params.latencyMs - Request latency in milliseconds
   * @param {number} [params.statusCode=200] - HTTP status code
   * @param {string} [params.apiKeyId] - API key UUID (optional for playground)
   * @returns {Promise<{error: string|null}>}
   */
  const trackUsage = useCallback(async ({
    endpoint,
    model,
    tokensIn = 0,
    tokensOut = 0,
    latencyMs = 0,
    statusCode = 200,
    apiKeyId = null,
  }) => {
    if (!user || !isSupabaseConfigured()) {
      return { error: null }; // silent no-op
    }

    try {
      const costCents = estimateCost(model, tokensIn, tokensOut);

      const { error: insertError } = await supabase
        .from('usage_logs')
        .insert({
          user_id: user.id,
          api_key_id: apiKeyId,
          endpoint,
          model,
          tokens_in: tokensIn,
          tokens_out: tokensOut,
          latency_ms: latencyMs,
          cost_cents: costCents,
          status_code: statusCode,
        });

      if (insertError) throw insertError;
      return { error: null };
    } catch (err) {
      console.error('Usage tracking failed:', err);
      return { error: err.message };
    }
  }, [user]);

  /**
   * Log multiple requests in a single batch insert.
   * @param {Array<Object>} entries - Array of trackUsage param objects
   * @returns {Promise<{error: string|null}>}
   */
  const trackBatch = useCallback(async (entries) => {
    if (!user || !isSupabaseConfigured() || entries.length === 0) {
      return { error: null };
    }

    try {
      const rows = entries.map(e => ({
        user_id: user.id,
        api_key_id: e.apiKeyId || null,
        endpoint: e.endpoint,
        model: e.model,
        tokens_in: e.tokensIn || 0,
        tokens_out: e.tokensOut || 0,
        latency_ms: e.latencyMs || 0,
        cost_cents: estimateCost(e.model, e.tokensIn || 0, e.tokensOut || 0),
        status_code: e.statusCode || 200,
      }));

      const { error: insertError } = await supabase
        .from('usage_logs')
        .insert(rows);

      if (insertError) throw insertError;
      return { error: null };
    } catch (err) {
      console.error('Batch usage tracking failed:', err);
      return { error: err.message };
    }
  }, [user]);

  return {
    trackUsage,
    trackBatch,
    isConnected: isSupabaseConfigured(),
  };
}

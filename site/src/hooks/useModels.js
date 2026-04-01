import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing model_pool and optimization_events via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Supabase tables required:
 *   model_pool:
 *     - id, user_id, model_name, provider_model_id
 *     - routing_weight, status (active/inactive/testing), provider
 *     - latency_avg (ms), cost_per_1k, accuracy_pct
 *     - requests_24h, last_optimized_at, created_at, updated_at
 *
 *   optimization_events:
 *     - id, user_id, model, event_type (route/finetune/pool/cost/accuracy)
 *     - description, improvement_pct (optional), created_at
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

// Demo data for local-only mode
const DEMO_MODELS = [
  {
    id: 'mdl-001',
    model_name: 'gpt-4o',
    provider_model_id: 'gpt-4o-2024-11-20',
    provider: 'OpenAI',
    status: 'active',
    routing_weight: 38,
    latency_avg: 842,
    cost_per_1k: 2.50,
    accuracy_pct: 94.2,
    requests_24h: 12840,
    last_optimized_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['general', 'reasoning'],
  },
  {
    id: 'mdl-002',
    model_name: 'claude-sonnet-4',
    provider_model_id: 'claude-sonnet-4-20250514',
    provider: 'Anthropic',
    status: 'active',
    routing_weight: 26,
    latency_avg: 1180,
    cost_per_1k: 3.00,
    accuracy_pct: 96.1,
    requests_24h: 8920,
    last_optimized_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    tags: ['analysis', 'code'],
  },
  {
    id: 'mdl-003',
    model_name: 'llama-3.3-70b',
    provider_model_id: 'llama-3.3-70b-instruct',
    provider: 'Meta (self-hosted)',
    status: 'active',
    routing_weight: 22,
    latency_avg: 234,
    cost_per_1k: 0.18,
    accuracy_pct: 88.7,
    requests_24h: 7560,
    last_optimized_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    tags: ['fast', 'simple'],
  },
  {
    id: 'mdl-004',
    model_name: 'mixtral-8x22b',
    provider_model_id: 'mixtral-8x22b-instruct-v0.1',
    provider: 'Mistral (self-hosted)',
    status: 'active',
    routing_weight: 10,
    latency_avg: 198,
    cost_per_1k: 0.12,
    accuracy_pct: 85.3,
    requests_24h: 3240,
    last_optimized_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    tags: ['fast', 'multilingual'],
  },
  {
    id: 'mdl-005',
    model_name: 'gpt-4o-ft-slancha-v3',
    provider_model_id: 'ft:gpt-4o-2024-11-20:slancha:abc123',
    provider: 'OpenAI (fine-tuned)',
    status: 'testing',
    routing_weight: 4,
    latency_avg: 780,
    cost_per_1k: 3.80,
    accuracy_pct: 97.8,
    requests_24h: 1440,
    last_optimized_at: null,
    tags: ['fine-tuned', 'high-accuracy'],
  },
];

const DEMO_OPTIMIZATION_EVENTS = [
  {
    id: 'evt-001',
    model: 'llama-3.3-70b',
    event_type: 'route',
    description: 'Route weight updated: 20% → 22% (latency improvement after QAT)',
    improvement_pct: 12,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-002',
    model: 'gpt-4o-ft-slancha-v3',
    event_type: 'finetune',
    description: 'Fine-tune started — 2,400 eval samples, targeting reasoning accuracy',
    improvement_pct: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-003',
    model: 'mixtral-8x22b',
    event_type: 'pool',
    description: 'Model added to pool — activated for multilingual routing after eval pass (85.3% accuracy)',
    improvement_pct: null,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-004',
    model: 'gpt-4o',
    event_type: 'cost',
    description: 'Shifted 8% of simple queries from gpt-4o to llama-3.3-70b — projected savings: $42/day',
    improvement_pct: 8,
    created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-005',
    model: 'claude-sonnet-4',
    event_type: 'accuracy',
    description: 'Model promoted to code/analysis primary — 96.1% on eval set',
    improvement_pct: 15,
    created_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },
];

export function useModels() {
  const { user } = useAuth();
  const [models, setModels] = useState([]);
  const [optimizationEvents, setOptimizationEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  const fetchModels = useCallback(async () => {
    if (!user) {
      setModels([]);
      setOptimizationEvents([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      let modelData;
      let eventData;

      if (!isSupabaseConfigured()) {
        setModels(DEMO_MODELS);
        setOptimizationEvents(DEMO_OPTIMIZATION_EVENTS);
        setLoading(false);
        return;
      }

      // Fetch models from model_pool
      const modelsResult = await supabase
        .from('model_pool')
        .select('*')
        .eq('user_id', user.id)
        .order('routing_weight', { ascending: false });

      if (modelsResult.error) {
        if (modelsResult.error.code === '42P01' || modelsResult.error.code === 'PGRST116') {
          if (import.meta.env.DEV) console.warn('model_pool table not found, using demo data');
          setModels(DEMO_MODELS);
          setOptimizationEvents(DEMO_OPTIMIZATION_EVENTS);
        } else {
          throw modelsResult.error;
        }
      } else {
        modelData = modelsResult.data || [];
      }

      // Fetch optimization events
      const eventsResult = await supabase
        .from('optimization_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (eventsResult.error) {
        if (eventsResult.error.code === '42P01' || eventsResult.error.code === 'PGRST116') {
          if (import.meta.env.DEV) console.warn('optimization_events table not found, using demo data');
          setOptimizationEvents(DEMO_OPTIMIZATION_EVENTS);
        } else {
          throw eventsResult.error;
        }
      } else {
        eventData = eventsResult.data || [];
      }

      setModels(modelData);
      setOptimizationEvents(eventData);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch models:', err);
      setError(err.message);
      setModels(DEMO_MODELS);
      setOptimizationEvents(DEMO_OPTIMIZATION_EVENTS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setSupabaseConfigured(isSupabaseConfigured());
    fetchModels();
  }, [fetchModels]);

  // Update routing weight for a model
  const updateRoutingWeight = async (modelId, newWeight) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setModels((prev) =>
        prev.map((m) =>
          m.id === modelId ? { ...m, routing_weight: newWeight } : m
        )
      );
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('model_pool')
        .update({ routing_weight: newWeight, updated_at: new Date().toISOString() })
        .eq('id', modelId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setModels((prev) =>
        prev.map((m) =>
          m.id === modelId ? { ...m, routing_weight: newWeight } : m
        )
      );
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update routing weight:', err);
      return { error: err.message };
    }
  };

  // Update model status
  const updateStatus = async (modelId, newStatus) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setModels((prev) =>
        prev.map((m) =>
          m.id === modelId ? { ...m, status: newStatus } : m
        )
      );
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('model_pool')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', modelId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setModels((prev) =>
        prev.map((m) => (m.id === modelId ? { ...m, status: newStatus } : m))
      );
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update status:', err);
      return { error: err.message };
    }
  };

  // Delete a model from pool
  const deleteModel = async (modelId) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setModels((prev) => prev.filter((m) => m.id !== modelId));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('model_pool')
        .delete()
        .eq('id', modelId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setModels((prev) => prev.filter((m) => m.id !== modelId));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete model:', err);
      return { error: err.message };
    }
  };

  // Add a new model to pool
  const addModel = async (params) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localModel = {
        id: `mdl-${Date.now()}`,
        model_name: params.model_name,
        provider_model_id: params.provider_model_id,
        provider: params.provider,
        status: params.status || 'active',
        routing_weight: params.routing_weight || 0,
        latency_avg: params.latency_avg || 0,
        cost_per_1k: params.cost_per_1k || 0,
        accuracy_pct: params.accuracy_pct || 0,
        requests_24h: params.requests_24h || 0,
        tags: params.tags || [],
        created_at: new Date().toISOString(),
      };
      setModels((prev) => [localModel, ...prev]);
      return { model: localModel, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('model_pool')
        .insert({
          user_id: user.id,
          model_name: params.model_name,
          provider_model_id: params.provider_model_id,
          provider: params.provider,
          status: params.status || 'active',
          routing_weight: params.routing_weight || 0,
          latency_avg: params.latency_avg || 0,
          cost_per_1k: params.cost_per_1k || 0,
          accuracy_pct: params.accuracy_pct || 0,
          requests_24h: params.requests_24h || 0,
        })
        .select('*')
        .single();

      if (insertError) throw insertError;
      setModels((prev) => [data, ...prev]);
      return { model: data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to add model:', err);
      return { model: null, error: err.message };
    }
  };

  // Compute statistics from models data
  const stats = {
    total: models.length,
    active: models.filter((m) => m.status === 'active').length,
    testing: models.filter((m) => m.status === 'testing').length,
    totalRequests: models.reduce((s, m) => s + m.requests_24h, 0),
    avgLatencyP50: models.length > 0 ? Math.round(models.reduce((s, m) => s + m.latency_avg, 0) / models.length) : 0,
    avgAccuracy: models.length > 0 ? (models.reduce((s, m) => s + m.accuracy_pct, 0) / models.length).toFixed(1) : 0,
    avgCostPerK: models.length > 0 ? (models.reduce((s, m) => s + m.cost_per_1k, 0) / models.length).toFixed(2) : 0,
    weightedAccuracy:
      models.length > 0
        ? (models.reduce((s, m) => s + m.accuracy_pct * m.requests_24h, 0) / models.reduce((s, m) => s + m.requests_24h, 0)).toFixed(1)
        : 0,
  };

  // Create a heatmap visualization data for latencies
  const latencyHeatmap = models.map((m) => ({
    name: m.model_name,
    p50: m.latency_avg,
    p99: Math.round(m.latency_avg * 2.5), // Estimate P99 as 2.5x P50
    weight: m.routing_weight,
  }));

  // Cost per 1K tokens sorted ascending
  const costComparison = [...models].sort((a, b) => a.cost_per_1k - b.cost_per_1k);

  // Provider breakdown
  const providerBreakdown = models.reduce((acc, m) => {
    acc[m.provider] = (acc[m.provider] || 0) + m.routing_weight;
    return acc;
  }, {});

  // Improvement stats from optimization events
  const improvementStats = optimizationEvents.reduce(
    (acc, e) => {
      if (e.improvement_pct) {
        acc.totalImprovements += e.improvement_pct;
        acc.eventCount++;
      }
      return acc;
    },
    { totalImprovements: 0, eventCount: 0 }
  );

  return {
    models,
    optimizationEvents,
    loading,
    error,
    supabaseConfigured,
    stats,
    latencyHeatmap,
    costComparison,
    providerBreakdown,
    improvementStats,
    updateRoutingWeight,
    updateStatus,
    deleteModel,
    addModel,
    refetch: fetchModels,
  };
}

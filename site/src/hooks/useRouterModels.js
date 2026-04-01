import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing router models + model backends via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

const DEMO_MODELS = [
  { id: 'demo-gpt4o', name: 'gpt-4o', provider_model_id: 'gpt-4o', reasoning_family: 'gpt', api_format: 'openai', pricing_prompt_per_1m: 2.50, pricing_completion_per_1m: 10.00, capabilities: ['chat', 'reasoning', 'tools', 'vision'], is_default: true, created_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-claude', name: 'claude-sonnet-4', provider_model_id: 'claude-sonnet-4-20250514', reasoning_family: null, api_format: 'anthropic', pricing_prompt_per_1m: 3.00, pricing_completion_per_1m: 15.00, capabilities: ['chat', 'reasoning', 'tools', 'vision'], is_default: false, created_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-qwen', name: 'qwen3-35b', provider_model_id: 'Qwen/Qwen3-35B', reasoning_family: 'qwen3', api_format: 'openai', pricing_prompt_per_1m: 0, pricing_completion_per_1m: 0, capabilities: ['chat', 'reasoning', 'tools'], is_default: false, created_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-flash', name: 'gemini-2.5-flash', provider_model_id: 'gemini-2.5-flash', reasoning_family: null, api_format: 'openai', pricing_prompt_per_1m: 0.15, pricing_completion_per_1m: 0.60, capabilities: ['chat', 'tools', 'vision'], is_default: false, created_at: '2026-03-01T00:00:00Z' },
];

const DEMO_BACKENDS = [
  { id: 'demo-be-1', model_id: 'demo-gpt4o', provider_id: 'demo-openai', user_id: 'demo', weight: 70, is_fallback: false, created_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-be-2', model_id: 'demo-claude', provider_id: 'demo-anthropic', user_id: 'demo', weight: 100, is_fallback: false, created_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-be-3', model_id: 'demo-qwen', provider_id: 'demo-vllm', user_id: 'demo', weight: 100, is_fallback: false, created_at: '2026-03-01T00:00:00Z' },
];

export function useRouterModels() {
  const { user } = useAuth();
  const [models, setModels] = useState([]);
  const [backends, setBackends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModels = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setModels(DEMO_MODELS);
      setBackends(DEMO_BACKENDS);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [modelsRes, backendsRes] = await Promise.all([
        supabase
          .from('router_models')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('model_backends')
          .select('*')
          .eq('user_id', user.id),
      ]);

      if (modelsRes.error) throw modelsRes.error;
      if (backendsRes.error) throw backendsRes.error;
      setModels(modelsRes.data || []);
      setBackends(backendsRes.data || []);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch models:', err);
      setError(err.message);
      setModels([]);
      setBackends([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const createModel = async (modelData) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localModel = {
        id: crypto.randomUUID(),
        user_id: user.id,
        ...modelData,
        created_at: new Date().toISOString(),
      };
      setModels(prev => [localModel, ...prev]);
      return { data: localModel, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('router_models')
        .insert({ user_id: user.id, ...modelData })
        .select('*')
        .single();

      if (insertError) throw insertError;
      setModels(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create model:', err);
      return { data: null, error: err.message };
    }
  };

  const updateModel = async (id, updates) => {
    if (!isSupabaseConfigured()) {
      setModels(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('router_models')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setModels(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update model:', err);
      return { error: err.message };
    }
  };

  const deleteModel = async (id) => {
    if (!isSupabaseConfigured()) {
      setModels(prev => prev.filter(m => m.id !== id));
      setBackends(prev => prev.filter(b => b.model_id !== id));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('router_models')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setModels(prev => prev.filter(m => m.id !== id));
      setBackends(prev => prev.filter(b => b.model_id !== id));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete model:', err);
      return { error: err.message };
    }
  };

  const addBackend = async (model_id, provider_id, weight = 100, is_fallback = false) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localBackend = {
        id: crypto.randomUUID(),
        model_id,
        provider_id,
        user_id: user.id,
        weight,
        is_fallback,
        created_at: new Date().toISOString(),
      };
      setBackends(prev => [...prev, localBackend]);
      return { data: localBackend, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('model_backends')
        .insert({ model_id, provider_id, user_id: user.id, weight, is_fallback })
        .select('*')
        .single();

      if (insertError) throw insertError;
      setBackends(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to add backend:', err);
      return { data: null, error: err.message };
    }
  };

  const removeBackend = async (id) => {
    if (!isSupabaseConfigured()) {
      setBackends(prev => prev.filter(b => b.id !== id));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('model_backends')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setBackends(prev => prev.filter(b => b.id !== id));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to remove backend:', err);
      return { error: err.message };
    }
  };

  const updateBackendWeight = async (id, weight) => {
    if (!isSupabaseConfigured()) {
      setBackends(prev => prev.map(b => b.id === id ? { ...b, weight } : b));
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('model_backends')
        .update({ weight })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setBackends(prev => prev.map(b => b.id === id ? { ...b, weight } : b));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update backend weight:', err);
      return { error: err.message };
    }
  };

  // Helper: get backends for a specific model
  const getBackendsForModel = (modelId) => backends.filter(b => b.model_id === modelId);

  return {
    models,
    backends,
    loading,
    error,
    createModel,
    updateModel,
    deleteModel,
    addBackend,
    removeBackend,
    updateBackendWeight,
    getBackendsForModel,
    refetch: fetchModels,
    isConnected: isSupabaseConfigured(),
  };
}

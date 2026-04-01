import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing LLM providers via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Uses vault RPC for secure API key storage — keys are never
 * returned to the client, only api_key_last4 for display.
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

const DEMO_PROVIDERS = [
  { id: 'demo-openai', name: 'OpenAI', provider_type: 'openai', base_url: 'https://api.openai.com/v1', api_format: 'openai', enabled: true, api_key_last4: 'sk12', config: {}, created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-anthropic', name: 'Anthropic', provider_type: 'anthropic', base_url: 'https://api.anthropic.com', api_format: 'anthropic', enabled: true, api_key_last4: 'ab34', config: {}, created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-vllm', name: 'Local vLLM', provider_type: 'vllm', base_url: 'http://127.0.0.1:8000/v1', api_format: 'openai', enabled: true, api_key_last4: null, config: {}, created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
];

export function useProviders() {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviders = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setProviders(DEMO_PROVIDERS);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('llm_providers')
        .select('id, name, provider_type, base_url, api_format, enabled, api_key_last4, config, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProviders(data || []);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch providers:', err);
      setError(err.message);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const createProvider = async ({ name, provider_type, base_url, api_format, api_key, config }) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localProvider = {
        id: crypto.randomUUID(),
        name,
        provider_type,
        base_url,
        api_format: api_format || 'openai',
        enabled: true,
        api_key_last4: api_key ? api_key.slice(-4) : null,
        config: config || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProviders(prev => [localProvider, ...prev]);
      return { data: localProvider, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('llm_providers')
        .insert({
          user_id: user.id,
          name,
          provider_type,
          base_url,
          api_format: api_format || 'openai',
          config: config || {},
        })
        .select('id, name, provider_type, base_url, api_format, enabled, api_key_last4, config, created_at, updated_at')
        .single();

      if (insertError) throw insertError;

      // Store API key in vault if provided
      if (api_key) {
        const { error: vaultError } = await supabase.rpc('store_provider_api_key', {
          p_provider_id: data.id,
          p_api_key: api_key,
        });
        if (vaultError) {
          if (import.meta.env.DEV) console.error('Failed to store API key in vault:', vaultError);
        } else {
          data.api_key_last4 = api_key.slice(-4);
        }
      }

      setProviders(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create provider:', err);
      return { data: null, error: err.message };
    }
  };

  const updateProvider = async (id, updates) => {
    if (!isSupabaseConfigured()) {
      setProviders(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
      return { error: null };
    }

    try {
      // Separate api_key from other updates — it goes through vault RPC
      const { api_key, ...dbUpdates } = updates;
      dbUpdates.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('llm_providers')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      if (api_key) {
        const { error: vaultError } = await supabase.rpc('store_provider_api_key', {
          p_provider_id: id,
          p_api_key: api_key,
        });
        if (vaultError) {
          if (import.meta.env.DEV) console.error('Failed to update API key in vault:', vaultError);
        } else {
          dbUpdates.api_key_last4 = api_key.slice(-4);
        }
      }

      setProviders(prev => prev.map(p => p.id === id ? { ...p, ...dbUpdates } : p));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update provider:', err);
      return { error: err.message };
    }
  };

  const deleteProvider = async (id) => {
    if (!isSupabaseConfigured()) {
      setProviders(prev => prev.filter(p => p.id !== id));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('llm_providers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setProviders(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete provider:', err);
      return { error: err.message };
    }
  };

  const toggleEnabled = async (id) => {
    const provider = providers.find(p => p.id === id);
    if (!provider) return { error: 'Provider not found' };
    return updateProvider(id, { enabled: !provider.enabled });
  };

  return {
    providers,
    loading,
    error,
    createProvider,
    updateProvider,
    deleteProvider,
    toggleEnabled,
    refetch: fetchProviders,
    isConnected: isSupabaseConfigured(),
  };
}

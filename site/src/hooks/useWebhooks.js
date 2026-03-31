import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing webhooks via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Supabase table required:
 *   CREATE TABLE webhooks (
 *     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 *     url text NOT NULL,
 *     events text[] NOT NULL DEFAULT '{}',
 *     secret text,
 *     active boolean DEFAULT true,
 *     created_at timestamptz DEFAULT now(),
 *     last_triggered_at timestamptz,
 *     failure_count integer DEFAULT 0
 *   );
 *   ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "Users manage own webhooks" ON webhooks
 *     FOR ALL USING (auth.uid() = user_id);
 */

const WEBHOOK_EVENTS = [
  { value: 'eval.completed', label: 'Evaluation completed', description: 'Fired when an evaluation run finishes' },
  { value: 'eval.failed', label: 'Evaluation failed', description: 'Fired when an evaluation encounters an error' },
  { value: 'model.promoted', label: 'Model promoted', description: 'Fired when a fine-tuned model is promoted to production' },
  { value: 'model.deployed', label: 'Model deployed', description: 'Fired when a deployment completes successfully' },
  { value: 'finetune.started', label: 'Fine-tune started', description: 'Fired when an automated fine-tuning job begins' },
  { value: 'finetune.completed', label: 'Fine-tune completed', description: 'Fired when a fine-tuning job finishes' },
  { value: 'finetune.failed', label: 'Fine-tune failed', description: 'Fired when a fine-tuning job encounters an error' },
  { value: 'usage.threshold', label: 'Usage threshold', description: 'Fired when usage reaches a configured threshold' },
  { value: 'router.updated', label: 'Router updated', description: 'Fired when routing rules are automatically adjusted' },
];

export { WEBHOOK_EVENTS };

function generateSecret() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let secret = 'whsec_';
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
}

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

export function useWebhooks() {
  const { user } = useAuth();
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWebhooks = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setWebhooks([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('webhooks')
        .select('id, url, events, active, created_at, last_triggered_at, failure_count')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setWebhooks(data || []);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch webhooks:', err);
      setError(err.message);
      setWebhooks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  const createWebhook = async (url, events) => {
    if (!user) return { error: 'Not authenticated' };

    const secret = generateSecret();

    if (!isSupabaseConfigured()) {
      const localWebhook = {
        id: crypto.randomUUID(),
        url,
        events,
        active: true,
        created_at: new Date().toISOString(),
        last_triggered_at: null,
        failure_count: 0,
      };
      setWebhooks(prev => [localWebhook, ...prev]);
      return { secret, data: localWebhook, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('webhooks')
        .insert({
          user_id: user.id,
          url,
          events,
          secret,
        })
        .select('id, url, events, active, created_at, last_triggered_at, failure_count')
        .single();

      if (insertError) throw insertError;
      setWebhooks(prev => [data, ...prev]);
      return { secret, data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create webhook:', err);
      return { secret: null, data: null, error: err.message };
    }
  };

  const updateWebhook = async (id, updates) => {
    if (!isSupabaseConfigured()) {
      setWebhooks(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('webhooks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setWebhooks(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update webhook:', err);
      return { error: err.message };
    }
  };

  const deleteWebhook = async (id) => {
    if (!isSupabaseConfigured()) {
      setWebhooks(prev => prev.filter(w => w.id !== id));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setWebhooks(prev => prev.filter(w => w.id !== id));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete webhook:', err);
      return { error: err.message };
    }
  };

  const toggleWebhook = async (id) => {
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return { error: 'Webhook not found' };
    return updateWebhook(id, { active: !webhook.active });
  };

  return {
    webhooks,
    loading,
    error,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    toggleWebhook,
    refetch: fetchWebhooks,
    isConnected: isSupabaseConfigured(),
  };
}

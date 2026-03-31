import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing API keys via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Supabase table required:
 *   CREATE TABLE api_keys (
 *     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 *     name text NOT NULL DEFAULT 'Untitled',
 *     key_hash text NOT NULL,
 *     key_prefix text NOT NULL,
 *     active boolean DEFAULT true,
 *     created_at timestamptz DEFAULT now(),
 *     revoked_at timestamptz
 *   );
 *   ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "Users manage own keys" ON api_keys
 *     FOR ALL USING (auth.uid() = user_id);
 */

function generateApiKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'sk-sl_';
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

async function hashKey(key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

export function useApiKeys() {
  const { user } = useAuth();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKeys = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setKeys([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('api_keys')
        .select('id, name, key_prefix, active, created_at, revoked_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setKeys(data || []);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
      setError(err.message);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createKey = async (name) => {
    if (!user) return { error: 'Not authenticated' };

    const rawKey = generateApiKey();
    const prefix = rawKey.slice(0, 16);

    if (!isSupabaseConfigured()) {
      // Local-only mode
      const localKey = {
        id: crypto.randomUUID(),
        name: name || 'Untitled',
        key_prefix: prefix,
        active: true,
        created_at: new Date().toISOString(),
        revoked_at: null,
      };
      setKeys(prev => [localKey, ...prev]);
      return { key: rawKey, data: localKey, error: null };
    }

    try {
      const keyHash = await hashKey(rawKey);
      const { data, error: insertError } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: name || 'Untitled',
          key_hash: keyHash,
          key_prefix: prefix,
        })
        .select('id, name, key_prefix, active, created_at, revoked_at')
        .single();

      if (insertError) throw insertError;
      setKeys(prev => [data, ...prev]);
      return { key: rawKey, data, error: null };
    } catch (err) {
      console.error('Failed to create API key:', err);
      return { key: null, data: null, error: err.message };
    }
  };

  const revokeKey = async (keyId) => {
    if (!isSupabaseConfigured()) {
      setKeys(prev => prev.map(k =>
        k.id === keyId ? { ...k, active: false, revoked_at: new Date().toISOString() } : k
      ));
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('api_keys')
        .update({ active: false, revoked_at: new Date().toISOString() })
        .eq('id', keyId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setKeys(prev => prev.map(k =>
        k.id === keyId ? { ...k, active: false, revoked_at: new Date().toISOString() } : k
      ));
      return { error: null };
    } catch (err) {
      console.error('Failed to revoke API key:', err);
      return { error: err.message };
    }
  };

  return {
    keys,
    loading,
    error,
    createKey,
    revokeKey,
    refetch: fetchKeys,
    isConnected: isSupabaseConfigured(),
  };
}

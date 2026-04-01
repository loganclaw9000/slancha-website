import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateRouterYaml } from '../utils/generateRouterYaml';

/**
 * Orchestrates providers, models, backends, and decisions into
 * a generated YAML config. Manages config snapshots.
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

export function useRouterConfig({ providers = [], models = [], backends = [], decisions = [] }) {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotsLoading, setSnapshotsLoading] = useState(false);

  const yaml = generateRouterYaml({ providers, models, backends, decisions });

  const fetchSnapshots = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setSnapshots([]);
      return;
    }

    try {
      setSnapshotsLoading(true);
      const { data, error } = await supabase
        .from('router_config_snapshots')
        .select('id, name, yaml_content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSnapshots(data || []);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch snapshots:', err);
    } finally {
      setSnapshotsLoading(false);
    }
  }, [user]);

  const saveSnapshot = async (name) => {
    if (!user) return { error: 'Not authenticated' };

    const snapshotName = name || `Snapshot ${new Date().toLocaleString()}`;

    if (!isSupabaseConfigured()) {
      const local = {
        id: crypto.randomUUID(),
        name: snapshotName,
        yaml_content: yaml,
        created_at: new Date().toISOString(),
      };
      setSnapshots(prev => [local, ...prev]);
      return { data: local, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('router_config_snapshots')
        .insert({
          user_id: user.id,
          name: snapshotName,
          yaml_content: yaml,
        })
        .select('id, name, yaml_content, created_at')
        .single();

      if (insertError) throw insertError;
      setSnapshots(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to save snapshot:', err);
      return { data: null, error: err.message };
    }
  };

  return {
    yaml,
    snapshots,
    snapshotsLoading,
    fetchSnapshots,
    saveSnapshot,
    isConnected: isSupabaseConfigured(),
  };
}

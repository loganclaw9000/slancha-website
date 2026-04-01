import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing deployments via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Supabase table required:
 *   - id, user_id, name, model, version
 *   - status: active|canary|rolling|stopped
 *   - region, gpu_type, traffic_pct
 *   - latency_p50, latency_p99, latency_p95
 *   - requests_per_min, error_rate, uptime
 *   - replicas, memory_mb, created_at, updated_at
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

// Demo data for local-only mode
const DEMO_DEPLOYMENTS = [
  {
    id: 'dep-018',
    model: 'gpt-4o-ft-slancha-v4',
    version: 'v4.2.1',
    status: 'active',
    traffic_pct: 65,
    latency_p50: 142,
    latency_p99: 890,
    latency_p95: 520,
    requests_per_min: 1247,
    error_rate: 0.02,
    uptime: 99.98,
    region: 'us-east-1',
    gpu_type: 'B200',
    replicas: 3,
    memory_mb: 80000,
    deployed_at: '2026-03-31T08:00:00Z',
    source: 'auto-promote',
  },
  {
    id: 'dep-019',
    model: 'claude-sonnet-ft-v1',
    version: 'v1.0.3',
    status: 'active',
    traffic_pct: 22,
    latency_p50: 210,
    latency_p99: 1100,
    latency_p95: 720,
    requests_per_min: 423,
    error_rate: 0.01,
    uptime: 99.99,
    region: 'us-east-1',
    gpu_type: 'B200',
    replicas: 2,
    memory_mb: 60000,
    deployed_at: '2026-03-30T23:15:00Z',
    source: 'auto-promote',
  },
  {
    id: 'dep-020',
    model: 'llama-3.3-70b-ft-v2',
    version: 'v2.0.0',
    status: 'canary',
    traffic_pct: 8,
    canary_target_pct: 25,
    canary_progress_pct: 32,
    latency_p50: 98,
    latency_p99: 420,
    latency_p95: 280,
    requests_per_min: 156,
    error_rate: 0.04,
    uptime: 99.95,
    region: 'us-east-1',
    gpu_type: 'B300',
    replicas: 1,
    memory_mb: 80000,
    deployed_at: '2026-03-31T10:30:00Z',
    source: 'canary-deploy',
  },
  {
    id: 'dep-017',
    model: 'mixtral-8x22b',
    version: 'v1.1.0',
    status: 'rolling',
    traffic_pct: 5,
    latency_p50: 189,
    latency_p99: 2400,
    latency_p95: 1800,
    requests_per_min: 89,
    error_rate: 1.2,
    uptime: 98.7,
    region: 'eu-west-1',
    gpu_type: 'B200',
    replicas: 1,
    memory_mb: 60000,
    deployed_at: '2026-03-29T14:00:00Z',
    source: 'manual',
    rolling_progress: 45,
  },
];

export function useDeployments() {
  const { user } = useAuth();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  const fetchDeployments = useCallback(async () => {
    if (!user) {
      setDeployments([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      let data;

      if (!isSupabaseConfigured()) {
        setDeployments(DEMO_DEPLOYMENTS);
        setLoading(false);
        return;
      }

      const result = await supabase
        .from('deployments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (result.error) {
        if (result.error.code === '42P01' || result.error.code === 'PGRST116') {
          if (import.meta.env.DEV) console.warn('deployments table not found, using demo data');
          setDeployments(DEMO_DEPLOYMENTS);
        } else {
          throw result.error;
        }
      } else {
        setDeployments(result.data || []);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch deployments:', err);
      setError(err.message);
      setDeployments(DEMO_DEPLOYMENTS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setSupabaseConfigured(isSupabaseConfigured());
    fetchDeployments();
  }, [fetchDeployments]);

  const updateTraffic = async (deploymentId, trafficPct) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === deploymentId
            ? { ...d, traffic_pct: trafficPct }
            : d
        )
      );
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('deployments')
        .update({ traffic_pct: trafficPct, updated_at: new Date().toISOString() })
        .eq('id', deploymentId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === deploymentId ? { ...d, traffic_pct: trafficPct } : d
        )
      );
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update traffic:', err);
      return { error: err.message };
    }
  };

  const updateStatus = async (deploymentId, newStatus) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === deploymentId ? { ...d, status: newStatus } : d
        )
      );
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('deployments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', deploymentId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setDeployments((prev) =>
        prev.map((d) => (d.id === deploymentId ? { ...d, status: newStatus } : d))
      );
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update status:', err);
      return { error: err.message };
    }
  };

  const scaleReplicas = async (deploymentId, newReplicas) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === deploymentId ? { ...d, replicas: newReplicas } : d
        )
      );
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('deployments')
        .update({ replicas: newReplicas, updated_at: new Date().toISOString() })
        .eq('id', deploymentId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setDeployments((prev) =>
        prev.map((d) => (d.id === deploymentId ? { ...d, replicas: newReplicas } : d))
      );
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to scale replicas:', err);
      return { error: err.message };
    }
  };

  const deleteDeployment = async (deploymentId) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setDeployments((prev) => prev.filter((d) => d.id !== deploymentId));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('deployments')
        .delete()
        .eq('id', deploymentId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setDeployments((prev) => prev.filter((d) => d.id !== deploymentId));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete deployment:', err);
      return { error: err.message };
    }
  };

  const createDeployment = async (params) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localDeployment = {
        id: `dep-${Date.now()}`,
        model: params.model,
        version: params.version,
        status: params.status || 'active',
        traffic_pct: params.traffic_pct || 0,
        region: params.region || 'us-east-1',
        gpu_type: params.gpu_type || 'B200',
        replicas: params.replicas || 1,
        deployed_at: new Date().toISOString(),
        source: 'manual',
      };
      setDeployments((prev) => [localDeployment, ...prev]);
      return { deployment: localDeployment, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('deployments')
        .insert({
          user_id: user.id,
          model: params.model,
          version: params.version,
          status: params.status || 'active',
          region: params.region || 'us-east-1',
          gpu_type: params.gpu_type || 'B200',
          replicas: params.replicas || 1,
          traffic_pct: params.traffic_pct || 0,
        })
        .select('*')
        .single();

      if (insertError) throw insertError;
      setDeployments((prev) => [data, ...prev]);
      return { deployment: data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create deployment:', err);
      return { deployment: null, error: err.message };
    }
  };

  // Computed statistics
  const stats = {
    total: deployments.length,
    active: deployments.filter((d) => d.status === 'active').length,
    canary: deployments.filter((d) => d.status === 'canary').length,
    rolling: deployments.filter((d) => d.status === 'rolling').length,
    totalTraffic: deployments.reduce((s, d) => s + d.traffic_pct, 0),
    avgLatencyP50: deployments.length > 0 ? Math.round(deployments.reduce((s, d) => s + d.latency_p50, 0) / deployments.length) : 0,
    avgUptime: deployments.length > 0 ? (deployments.reduce((s, d) => s + d.uptime, 0) / deployments.length).toFixed(2) : 0,
  };

  // Region breakdown
  const regionBreakdown = deployments.reduce((acc, d) => {
    acc[d.region] = (acc[d.region] || 0) + d.traffic_pct;
    return acc;
  }, {});

  return {
    deployments,
    loading,
    error,
    supabaseConfigured,
    stats,
    regionBreakdown,
    updateTraffic,
    updateStatus,
    scaleReplicas,
    deleteDeployment,
    createDeployment,
    refetch: fetchDeployments,
  };
}

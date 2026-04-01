import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing fine-tuning jobs via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Supabase table required:
 *   - id, user_id, name, base_model
 *   - status: queued|training|completed|failed
 *   - progress_pct, training_loss, eval_accuracy
 *   - epochs, samples, auto_promote, promotion_threshold
 *   - started_at, completed_at, failed_at, error_message
 *   - created_at, updated_at
 */
const FINE_TUNING_JOBS_SCHEMA = `CREATE TABLE fine_tuning_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  base_model text NOT NULL,
  dataset_id uuid REFERENCES datasets(id),
  status text CHECK (status IN ('queued','training','completed','failed')) NOT NULL DEFAULT 'queued',
  progress_pct integer DEFAULT 0,
  training_loss jsonb,
  eval_accuracy numeric,
  eval_scores jsonb,
  epochs integer DEFAULT 0,
  samples integer,
  auto_promote boolean DEFAULT true,
  promotion_threshold numeric DEFAULT 95.0,
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE fine_tuning_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own jobs" ON fine_tuning_jobs
  FOR ALL USING (auth.uid() = user_id);
`;

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

// Demo data for local-only mode
const DEMO_JOBS = [
  {
    id: 'ft-047',
    name: 'gpt-4o-ft-slancha-v4',
    base_model: 'gpt-4o',
    status: 'training',
    progress_pct: 72,
    epochs: 4,
    samples: 2400,
    dataset: 'reasoning-2k + code-gen-500',
    started_at: '2026-03-31T09:15:00Z',
    loss: [0.84, 0.62, 0.41, 0.33],
    accuracy: [89.2, 92.1, 94.8, 96.1],
    auto_promote: true,
    promotion_threshold: 95.0,
  },
  {
    id: 'ft-046',
    name: 'llama-3.3-70b-ft-v2',
    base_model: 'llama-3.3-70b',
    status: 'completed',
    progress_pct: 100,
    epochs: 5,
    samples: 1800,
    dataset: 'multi-qa-1k + general-5k',
    started_at: '2026-03-31T04:00:00Z',
    completed_at: '2026-03-31T06:22:00Z',
    duration: '2h 22m',
    loss: [1.12, 0.78, 0.54, 0.38, 0.31],
    accuracy: [81.4, 85.2, 88.1, 90.3, 91.7],
    auto_promote: true,
    promotion_threshold: 90.0,
    promoted: true,
    eval_score: 91.7,
  },
  {
    id: 'ft-045',
    name: 'claude-sonnet-ft-v1',
    base_model: 'claude-sonnet-4',
    status: 'completed',
    progress_pct: 100,
    epochs: 3,
    samples: 800,
    dataset: 'code-gen-500',
    started_at: '2026-03-30T22:00:00Z',
    completed_at: '2026-03-30T23:15:00Z',
    duration: '1h 15m',
    loss: [0.92, 0.55, 0.34],
    accuracy: [91.0, 94.5, 96.8],
    auto_promote: true,
    promotion_threshold: 95.0,
    promoted: true,
    eval_score: 96.8,
  },
  {
    id: 'ft-044',
    name: 'mixtral-ft-multilang-v1',
    base_model: 'mixtral-8x22b',
    status: 'completed',
    progress_pct: 100,
    epochs: 4,
    samples: 1200,
    dataset: 'multi-qa-1k',
    started_at: '2026-03-30T18:00:00Z',
    completed_at: '2026-03-30T20:40:00Z',
    duration: '2h 40m',
    loss: [1.24, 0.88, 0.61, 0.48],
    accuracy: [78.3, 82.1, 84.9, 86.4],
    auto_promote: false,
    promotion_threshold: 88.0,
    promoted: false,
    eval_score: 86.4,
  },
  {
    id: 'ft-043',
    name: 'gpt-4o-ft-slancha-v3',
    base_model: 'gpt-4o',
    status: 'completed',
    progress_pct: 100,
    epochs: 4,
    samples: 2000,
    dataset: 'reasoning-2k',
    started_at: '2026-03-30T10:00:00Z',
    completed_at: '2026-03-30T12:34:00Z',
    duration: '2h 34m',
    loss: [0.91, 0.64, 0.42, 0.29],
    accuracy: [88.5, 92.4, 95.6, 97.8],
    auto_promote: true,
    promotion_threshold: 95.0,
    promoted: true,
    eval_score: 97.8,
  },
  {
    id: 'ft-042',
    name: 'gpt-4o-ft-slancha-v2',
    base_model: 'gpt-4o',
    status: 'failed',
    progress_pct: 45,
    epochs: 5,
    samples: 3000,
    dataset: 'general-5k',
    started_at: '2026-03-29T20:00:00Z',
    failed_at: '2026-03-29T21:45:00Z',
    error_message: 'OOM: GPU memory exceeded during gradient accumulation',
    loss: [0.98, 0.71],
    accuracy: [86.1, 89.3],
    auto_promote: false,
  },
];

export function useFineTuningJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      let data;

      if (!isSupabaseConfigured()) {
        setJobs(DEMO_JOBS);
        setLoading(false);
        return;
      }

      const result = await supabase
        .from('fine_tuning_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (result.error) {
        if (result.error.code === '42P01' || result.error.code === 'PGRST116') {
          if (import.meta.env.DEV) console.warn('fine_tuning_jobs table not found, using demo data');
          setJobs(DEMO_JOBS);
        } else {
          throw result.error;
        }
      } else {
        setJobs(result.data || []);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch fine-tuning jobs:', err);
      setError(err.message);
      setJobs(DEMO_JOBS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setSupabaseConfigured(isSupabaseConfigured());
    fetchJobs();
  }, [fetchJobs]);

  const cancelJob = async (jobId) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId && j.status === 'training'
            ? { ...j, status: 'failed', error: 'Cancelled by user' }
            : j
        )
      );
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('fine_tuning_jobs')
        .update({
          status: 'failed',
          error_message: 'Cancelled by user',
          failed_at: new Date().toISOString(),
        })
        .eq('id', jobId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId && j.status === 'training'
            ? { ...j, status: 'failed', error: 'Cancelled by user' }
            : j
        )
      );
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to cancel job:', err);
      return { error: err.message };
    }
  };

  const createJob = async (params) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localJob = {
        id: `ft-${Date.now()}`,
        name: params.name,
        base_model: params.baseModel,
        status: 'queued',
        progress_pct: 0,
        epochs: params.epochs || 5,
        samples: params.samples || 1000,
        dataset: params.dataset || 'default',
        auto_promote: params.autoPromote ?? true,
        promotion_threshold: params.promotionThreshold || 95.0,
        created_at: new Date().toISOString(),
      };
      setJobs((prev) => [localJob, ...prev]);
      return { job: localJob, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('fine_tuning_jobs')
        .insert({
          user_id: user.id,
          name: params.name,
          base_model: params.baseModel,
          status: 'queued',
          epochs: params.epochs || 5,
          samples: params.samples || 1000,
          dataset_id: params.datasetId,
          auto_promote: params.autoPromote ?? true,
          promotion_threshold: params.promotionThreshold || 95.0,
        })
        .select('*')
        .single();

      if (insertError) throw insertError;
      setJobs((prev) => [data, ...prev]);
      return { job: data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create job:', err);
      return { job: null, error: err.message };
    }
  };

  return {
    jobs,
    loading,
    error,
    supabaseConfigured,
    cancelJob,
    createJob,
    refetch: fetchJobs,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing evaluation runs via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Supabase table required:
 *   - id, user_id, name, dataset_id, status
 *   - metrics: avg_score, best_score, best_model, num_samples
 *   - duration_seconds, started_at, completed_at
 *   - created_at, updated_at
 */
const EVALUATIONS_SCHEMA = `CREATE TABLE evaluations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  dataset_id uuid REFERENCES datasets(id),
  status text CHECK (status IN ('queued','running','completed','failed')) NOT NULL DEFAULT 'queued',
  metrics jsonb,
  avg_score numeric,
  best_score numeric,
  best_model text,
  num_samples integer,
  duration_seconds integer,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own evaluations" ON evaluations
  FOR ALL USING (auth.uid() = user_id);
`;

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

// Demo data for local-only mode
const DEMO_EVALS = [
  {
    id: 'eval-089',
    name: 'Reasoning Accuracy v3',
    status: 'completed',
    dataset: { id: 'ds-001', name: 'reasoning-2k', samples: 2000 },
    samples: 2000,
    models: ['gpt-4o', 'claude-sonnet-4', 'llama-3.3-70b'],
    startedAt: '2026-03-31T10:00:00Z',
    completedAt: '2026-03-31T10:12:34Z',
    duration: 754,
    avgScore: 91.4,
    bestScore: 96.1,
    bestModel: 'claude-sonnet-4',
    promoted: true,
  },
  {
    id: 'eval-088',
    name: 'Code Generation Bench',
    status: 'completed',
    dataset: { id: 'ds-002', name: 'code-gen-500', samples: 500 },
    samples: 500,
    models: ['gpt-4o', 'claude-sonnet-4', 'gpt-4o-ft-v3'],
    startedAt: '2026-03-31T08:15:00Z',
    completedAt: '2026-03-31T08:23:12Z',
    duration: 492,
    avgScore: 87.3,
    bestScore: 97.8,
    bestModel: 'gpt-4o-ft-v3',
    promoted: true,
  },
  {
    id: 'eval-087',
    name: 'Multilingual QA',
    status: 'completed',
    dataset: { id: 'ds-004', name: 'multi-qa-1k', samples: 1000 },
    samples: 1000,
    models: ['mixtral-8x22b', 'gpt-4o', 'llama-3.3-70b'],
    startedAt: '2026-03-31T06:00:00Z',
    completedAt: '2026-03-31T06:15:08Z',
    duration: 908,
    avgScore: 83.6,
    bestScore: 89.2,
    bestModel: 'mixtral-8x22b',
    promoted: false,
  },
  {
    id: 'eval-086',
    name: 'Summarization Quality',
    status: 'running',
    dataset: { id: 'ds-003', name: 'summ-3k', samples: 3000 },
    samples: 3000,
    models: ['gpt-4o', 'claude-sonnet-4', 'llama-3.3-70b', 'mixtral-8x22b'],
    startedAt: '2026-03-31T11:30:00Z',
    progress: 67,
    avgScore: null,
    bestScore: null,
    bestModel: null,
    promoted: false,
  },
  {
    id: 'eval-085',
    name: 'Latency-Accuracy Tradeoff',
    status: 'completed',
    dataset: { id: 'ds-005', name: 'general-5k', samples: 5000 },
    samples: 5000,
    models: ['gpt-4o', 'llama-3.3-70b', 'mixtral-8x22b'],
    startedAt: '2026-03-30T22:00:00Z',
    completedAt: '2026-03-30T22:28:41Z',
    duration: 1721,
    avgScore: 88.9,
    bestScore: 94.2,
    bestModel: 'gpt-4o',
    promoted: true,
  },
  {
    id: 'eval-084',
    name: 'Fine-Tune Candidate Selection',
    status: 'completed',
    dataset: { id: 'ds-006', name: 'ft-candidates-800', samples: 800 },
    samples: 800,
    models: ['gpt-4o', 'gpt-4o-ft-v2', 'gpt-4o-ft-v3'],
    startedAt: '2026-03-30T18:30:00Z',
    completedAt: '2026-03-30T18:36:55Z',
    duration: 415,
    avgScore: 93.1,
    bestScore: 97.2,
    bestModel: 'gpt-4o-ft-v3',
    promoted: true,
  },
];

// Model accuracy trend data for comparison tab
const MODEL_SCORES = [
  { model: 'gpt-4o-ft-v3', scores: [94.2, 95.1, 96.8, 97.2, 97.8], color: '#8B5CF6' },
  { model: 'claude-sonnet-4', scores: [93.0, 93.8, 94.5, 95.2, 96.1], color: '#3B82F6' },
  { model: 'gpt-4o', scores: [92.1, 92.4, 93.0, 93.5, 94.2], color: '#22C55E' },
  { model: 'llama-3.3-70b', scores: [84.2, 85.1, 86.3, 87.8, 88.7], color: '#F59E0B' },
  { model: 'mixtral-8x22b', scores: [81.5, 82.3, 83.1, 84.2, 85.3], color: '#EC4899' },
];

export function useEvaluations() {
  const { user } = useAuth();
  const [evals, setEvals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  const fetchEvals = useCallback(async () => {
    if (!user) {
      setEvals([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      let data;

      if (!isSupabaseConfigured()) {
        setEvals(DEMO_EVALS);
        setLoading(false);
        return;
      }

      const result = await supabase
        .from('evaluations')
        .select('*, dataset:dataset_id(id, name, samples)')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (result.error) {
        if (result.error.code === '42P01' || result.error.code === 'PGRST116') {
          if (import.meta.env.DEV) console.warn('evaluations table not found, using demo data');
          setEvals(DEMO_EVALS);
        } else {
          throw result.error;
        }
      } else {
        setEvals(result.data || []);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch evaluations:', err);
      setError(err.message);
      setEvals(DEMO_EVALS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setSupabaseConfigured(isSupabaseConfigured());
    fetchEvals();
  }, [fetchEvals]);

  const runEvaluation = async (params) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localEval = {
        id: `eval-${Date.now()}`,
        name: params.name,
        status: 'running',
        dataset: params.dataset,
        samples: params.samples,
        models: params.models,
        progress: 0,
        startedAt: new Date().toISOString(),
      };
      setEvals((prev) => [localEval, ...prev]);
      return { eval: localEval, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('evaluations')
        .insert({
          user_id: user.id,
          name: params.name,
          dataset_id: params.datasetId,
          status: 'running',
          num_samples: params.samples,
          metrics: { models: params.models },
        })
        .select('*')
        .single();

      if (insertError) throw insertError;
      setEvals((prev) => [data, ...prev]);
      return { eval: data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to run evaluation:', err);
      return { eval: null, error: err.message };
    }
  };

  const cancelEvaluation = async (evalId) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setEvals((prev) =>
        prev.map((e) =>
          e.id === evalId && e.status === 'running'
            ? { ...e, status: 'failed', error: 'Cancelled by user' }
            : e
        )
      );
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('evaluations')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', evalId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setEvals((prev) =>
        prev.map((e) =>
          e.id === evalId && e.status === 'running'
            ? { ...e, status: 'failed' }
            : e
        )
      );
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to cancel evaluation:', err);
      return { error: err.message };
    }
  };

  const getModelScores = () => MODEL_SCORES;

  return {
    evals,
    loading,
    error,
    supabaseConfigured,
    runEvaluation,
    cancelEvaluation,
    getModelScores,
    refetch: fetchEvals,
  };
}

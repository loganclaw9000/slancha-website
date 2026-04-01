import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing datasets via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Supabase table required:
 *   - id, user_id, name, description
 *   - format: jsonl|csv|parquet
 *   - sample_count, size_bytes, version
 *   - tags[], status: active|processing|archived
 *   - created_at, updated_at
 */
const DATASETS_SCHEMA = `CREATE TABLE datasets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  format text CHECK (format IN ('jsonl','csv','parquet')) NOT NULL,
  sample_count integer NOT NULL DEFAULT 0,
  size_bytes bigint DEFAULT 0,
  version text DEFAULT 'v1',
  status text CHECK (status IN ('active','processing','archived')) DEFAULT 'active',
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own datasets" ON datasets
  FOR ALL USING (auth.uid() = user_id);
`;

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

// Demo data for local-only mode
const DEMO_DATASETS = [
  {
    id: 'ds-001',
    name: 'reasoning-2k',
    description: 'General reasoning and logic problems across 8 categories',
    samples: 2000,
    size: '4.2 MB',
    format: 'jsonl',
    version: 'v3',
    versions: 3,
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-31T08:00:00Z',
    tags: ['reasoning', 'logic', 'math'],
    usedIn: { evals: 12, fineTunes: 3 },
    quality: { avgTokens: 342, duplicates: 0.2, langDist: { en: 95, es: 3, fr: 2 } },
    status: 'active',
  },
  {
    id: 'ds-002',
    name: 'code-gen-500',
    description: 'Code generation tasks — Python, TypeScript, Go with test cases',
    samples: 500,
    size: '1.8 MB',
    format: 'jsonl',
    version: 'v2',
    versions: 2,
    createdAt: '2026-03-18T14:30:00Z',
    updatedAt: '2026-03-30T22:00:00Z',
    tags: ['code', 'generation', 'python', 'typescript'],
    usedIn: { evals: 8, fineTunes: 2 },
    quality: { avgTokens: 580, duplicates: 0.0, langDist: { en: 100 } },
    status: 'active',
  },
  {
    id: 'ds-003',
    name: 'summ-3k',
    description: 'Summarization — news articles, technical docs, legal briefs',
    samples: 3000,
    size: '12.1 MB',
    format: 'jsonl',
    version: 'v4',
    versions: 4,
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-31T11:30:00Z',
    tags: ['summarization', 'news', 'technical', 'legal'],
    usedIn: { evals: 15, fineTunes: 5 },
    quality: { avgTokens: 1240, duplicates: 0.8, langDist: { en: 88, de: 7, fr: 5 } },
    status: 'active',
  },
  {
    id: 'ds-004',
    name: 'multi-qa-1k',
    description: 'Multilingual question answering across 12 languages',
    samples: 1000,
    size: '3.4 MB',
    format: 'jsonl',
    version: 'v2',
    versions: 2,
    createdAt: '2026-03-20T16:00:00Z',
    updatedAt: '2026-03-31T06:00:00Z',
    tags: ['multilingual', 'qa', 'retrieval'],
    usedIn: { evals: 6, fineTunes: 1 },
    quality: { avgTokens: 210, duplicates: 0.1, langDist: { en: 40, es: 15, fr: 12, de: 10, ja: 8, zh: 5, ko: 3, pt: 2, it: 2, ar: 1, hi: 1, ru: 1 } },
    status: 'active',
  },
  {
    id: 'ds-005',
    name: 'general-5k',
    description: 'General benchmark — broad coverage across all task types',
    samples: 5000,
    size: '18.7 MB',
    format: 'jsonl',
    version: 'v6',
    versions: 6,
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
    tags: ['general', 'benchmark', 'mixed'],
    usedIn: { evals: 22, fineTunes: 8 },
    quality: { avgTokens: 445, duplicates: 1.2, langDist: { en: 92, es: 4, fr: 2, de: 2 } },
    status: 'active',
  },
  {
    id: 'ds-006',
    name: 'ft-candidates-800',
    description: 'Curated fine-tuning candidates — high-quality prompt/completion pairs',
    samples: 800,
    size: '2.9 MB',
    format: 'jsonl',
    version: 'v1',
    versions: 1,
    createdAt: '2026-03-28T12:00:00Z',
    updatedAt: '2026-03-30T18:30:00Z',
    tags: ['fine-tuning', 'curated', 'high-quality'],
    usedIn: { evals: 4, fineTunes: 2 },
    quality: { avgTokens: 890, duplicates: 0.0, langDist: { en: 100 } },
    status: 'active',
  },
];

export function useDatasets() {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  const fetchDatasets = useCallback(async () => {
    if (!user) {
      setDatasets([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      let data;

      if (!isSupabaseConfigured()) {
        setDatasets(DEMO_DATASETS);
        setLoading(false);
        return;
      }

      const result = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (result.error) {
        if (result.error.code === '42P01' || result.error.code === 'PGRST116') {
          if (import.meta.env.DEV) console.warn('datasets table not found, using demo data');
          setDatasets(DEMO_DATASETS);
        } else {
          throw result.error;
        }
      } else {
        setDatasets(result.data || []);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch datasets:', err);
      setError(err.message);
      setDatasets(DEMO_DATASETS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setSupabaseConfigured(isSupabaseConfigured());
    fetchDatasets();
  }, [fetchDatasets]);

  const uploadDataset = async (params) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localDs = {
        id: `ds-${Date.now()}`,
        name: params.name,
        description: params.description,
        samples: params.samples,
        size: `${(params.size / (1024 * 1024)).toFixed(1)} MB`,
        format: params.format,
        version: 'v1',
        versions: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: params.tags || [],
        usedIn: { evals: 0, fineTunes: 0 },
        status: 'processing',
      };
      setDatasets((prev) => [localDs, ...prev]);
      return { dataset: localDs, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('datasets')
        .insert({
          user_id: user.id,
          name: params.name,
          description: params.description,
          format: params.format,
          sample_count: params.samples,
          size_bytes: params.size,
          tags: params.tags || [],
          status: 'processing',
        })
        .select('*')
        .single();

      if (insertError) throw insertError;
      setDatasets((prev) => [data, ...prev]);
      return { dataset: data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to upload dataset:', err);
      return { dataset: null, error: err.message };
    }
  };

  const deleteDataset = async (datasetId) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setDatasets((prev) => prev.filter((d) => d.id !== datasetId));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('datasets')
        .delete()
        .eq('id', datasetId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setDatasets((prev) => prev.filter((d) => d.id !== datasetId));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete dataset:', err);
      return { error: err.message };
    }
  };

  const getSummaryStats = () => {
    return {
      totalDatasets: datasets.length,
      totalSamples: datasets.reduce((s, d) => s + d.samples, 0),
      totalSize: `${(datasets.reduce((s, d) => s + parseFloat(d.size), 0)).toFixed(1)} MB`,
      autoCurated: datasets.filter(d => d.tags?.includes('auto-curated')).length,
    };
  };

  return {
    datasets,
    loading,
    error,
    supabaseConfigured,
    uploadDataset,
    deleteDataset,
    getSummaryStats,
    refetch: fetchDatasets,
  };
}

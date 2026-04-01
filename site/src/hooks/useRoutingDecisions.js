import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing routing decisions via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Table: routing_decisions (with RLS by user_id)
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

const DEMO_DECISIONS = [
  { id: 'demo-d1', name: 'math_decision', description: 'Route math queries to reasoning-capable models', priority: 10, enabled: true, rules: { operator: 'OR', conditions: [{ type: 'domain', name: 'math' }, { type: 'domain', name: 'science' }] }, model_refs: [{ model: 'demo-gpt4o', use_reasoning: true }], plugins: [{ type: 'system_prompt', configuration: { content: 'You are a math expert. Show your work step by step.' } }], created_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-d2', name: 'code_decision', description: 'Route coding tasks to Claude', priority: 20, enabled: true, rules: { operator: 'OR', conditions: [{ type: 'domain', name: 'code' }] }, model_refs: [{ model: 'demo-claude', use_reasoning: false }], plugins: [], created_at: '2026-03-01T00:00:00Z' },
  { id: 'demo-d3', name: 'fast_general', description: 'Route simple queries to fast local model', priority: 30, enabled: true, rules: { operator: 'OR', conditions: [{ type: 'domain', name: 'general' }] }, model_refs: [{ model: 'demo-qwen', use_reasoning: false }], plugins: [], created_at: '2026-03-01T00:00:00Z' },
];

export function useRoutingDecisions() {
  const { user } = useAuth();
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDecisions = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setDecisions(DEMO_DECISIONS);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('routing_decisions')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: true });

      if (fetchError) throw fetchError;
      setDecisions(data || []);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch routing decisions:', err);
      setError(err.message);
      setDecisions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  const createDecision = async ({ name, description, priority, rules, model_refs, plugins }) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const localDecision = {
        id: crypto.randomUUID(),
        name,
        description: description || '',
        priority: priority || 10,
        enabled: true,
        rules: rules || { operator: 'OR', conditions: [] },
        model_refs: model_refs || [],
        plugins: plugins || [],
        created_at: new Date().toISOString(),
      };
      setDecisions(prev => [...prev, localDecision].sort((a, b) => a.priority - b.priority));
      return { data: localDecision, error: null };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('routing_decisions')
        .insert({
          user_id: user.id,
          name,
          description: description || '',
          priority: priority || 10,
          rules: rules || { operator: 'OR', conditions: [] },
          model_refs: model_refs || [],
          plugins: plugins || [],
        })
        .select('*')
        .single();

      if (insertError) throw insertError;
      setDecisions(prev => [...prev, data].sort((a, b) => a.priority - b.priority));
      return { data, error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create routing decision:', err);
      return { data: null, error: err.message };
    }
  };

  const updateDecision = async (id, updates) => {
    if (!isSupabaseConfigured()) {
      setDecisions(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d).sort((a, b) => a.priority - b.priority));
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('routing_decisions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setDecisions(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d).sort((a, b) => a.priority - b.priority));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update routing decision:', err);
      return { error: err.message };
    }
  };

  const deleteDecision = async (id) => {
    if (!isSupabaseConfigured()) {
      setDecisions(prev => prev.filter(d => d.id !== id));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('routing_decisions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setDecisions(prev => prev.filter(d => d.id !== id));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete routing decision:', err);
      return { error: err.message };
    }
  };

  const toggleEnabled = async (id) => {
    const decision = decisions.find(d => d.id === id);
    if (!decision) return { error: 'Decision not found' };
    return updateDecision(id, { enabled: !decision.enabled });
  };

  const reorderPriority = async (reorderedIds) => {
    // reorderedIds is an array of decision IDs in the desired priority order
    const updates = reorderedIds.map((id, index) => ({ id, priority: (index + 1) * 10 }));

    if (!isSupabaseConfigured()) {
      setDecisions(prev => {
        const map = Object.fromEntries(prev.map(d => [d.id, d]));
        return updates.map(u => ({ ...map[u.id], priority: u.priority }));
      });
      return { error: null };
    }

    try {
      // Update each decision's priority
      for (const { id, priority } of updates) {
        const { error: updateError } = await supabase
          .from('routing_decisions')
          .update({ priority })
          .eq('id', id)
          .eq('user_id', user.id);
        if (updateError) throw updateError;
      }

      setDecisions(prev => {
        const map = Object.fromEntries(prev.map(d => [d.id, d]));
        return updates.map(u => ({ ...map[u.id], priority: u.priority }));
      });
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to reorder priorities:', err);
      return { error: err.message };
    }
  };

  return {
    decisions,
    loading,
    error,
    createDecision,
    updateDecision,
    deleteDecision,
    toggleEnabled,
    reorderPriority,
    refetch: fetchDecisions,
    isConnected: isSupabaseConfigured(),
  };
}

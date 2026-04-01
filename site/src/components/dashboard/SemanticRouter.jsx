import React, { useState } from 'react';
import './SemanticRouter.css';
import usePageMeta from '../../hooks/usePageMeta';
import { useProviders } from '../../hooks/useProviders';
import { useRouterModels } from '../../hooks/useRouterModels';
import { useRoutingDecisions } from '../../hooks/useRoutingDecisions';
import { useRouterConfig } from '../../hooks/useRouterConfig';
import ProviderCard from './ProviderCard';
import ProviderForm from './ProviderForm';
import ModelConfig from './ModelConfig';
import RoutingRules from './RoutingRules';
import ConfigPreview from './ConfigPreview';
import MinikubeGuide from './MinikubeGuide';

const TABS = [
  { id: 'providers', label: 'Providers' },
  { id: 'models', label: 'Models' },
  { id: 'routing', label: 'Routing' },
  { id: 'config', label: 'Config & Deploy' },
];

// Demo data fallback when Supabase is not connected
const DEMO_PROVIDERS = [
  { id: 'demo-1', name: 'OpenAI', provider_type: 'openai', base_url: 'https://api.openai.com/v1', api_format: 'openai', enabled: true, api_key_last4: 'sk42', config: {}, created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z' },
  { id: 'demo-2', name: 'Anthropic', provider_type: 'anthropic', base_url: 'https://api.anthropic.com', api_format: 'anthropic', enabled: true, api_key_last4: 'ab99', config: {}, created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z' },
  { id: 'demo-3', name: 'Local vLLM', provider_type: 'vllm', base_url: 'http://127.0.0.1:8000/v1', api_format: 'openai', enabled: true, api_key_last4: null, config: {}, created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z' },
];

const DEMO_MODELS = [
  { id: 'dm-1', name: 'gpt-4o', provider_model_id: 'gpt-4o', reasoning_family: 'gpt', api_format: 'openai', pricing_prompt_per_1m: 2.50, pricing_completion_per_1m: 10.00, capabilities: ['chat', 'tools', 'vision'], is_default: true, created_at: '2026-03-30T10:00:00Z' },
  { id: 'dm-2', name: 'claude-sonnet-4', provider_model_id: 'claude-sonnet-4-20250514', reasoning_family: null, api_format: 'anthropic', pricing_prompt_per_1m: 3.00, pricing_completion_per_1m: 15.00, capabilities: ['chat', 'reasoning', 'tools', 'vision'], is_default: false, created_at: '2026-03-30T10:00:00Z' },
  { id: 'dm-3', name: 'qwen3.5-35b', provider_model_id: 'qwen3.5-35b', reasoning_family: 'qwen3', api_format: 'openai', pricing_prompt_per_1m: 0, pricing_completion_per_1m: 0, capabilities: ['chat', 'reasoning'], is_default: false, created_at: '2026-03-30T10:00:00Z' },
  { id: 'dm-4', name: 'gpt-4o-mini', provider_model_id: 'gpt-4o-mini', reasoning_family: 'gpt', api_format: 'openai', pricing_prompt_per_1m: 0.15, pricing_completion_per_1m: 0.60, capabilities: ['chat', 'tools'], is_default: false, created_at: '2026-03-30T10:00:00Z' },
];

const DEMO_BACKENDS = [
  { id: 'db-1', model_id: 'dm-1', provider_id: 'demo-1', weight: 100, is_fallback: false, created_at: '2026-03-30T10:00:00Z' },
  { id: 'db-2', model_id: 'dm-2', provider_id: 'demo-2', weight: 100, is_fallback: false, created_at: '2026-03-30T10:00:00Z' },
  { id: 'db-3', model_id: 'dm-3', provider_id: 'demo-3', weight: 100, is_fallback: false, created_at: '2026-03-30T10:00:00Z' },
  { id: 'db-4', model_id: 'dm-4', provider_id: 'demo-1', weight: 80, is_fallback: false, created_at: '2026-03-30T10:00:00Z' },
];

const DEMO_DECISIONS = [
  { id: 'dd-1', name: 'math_decision', description: 'Route math queries to reasoning-capable models', priority: 10, enabled: true, rules: { operator: 'OR', conditions: [{ type: 'domain', name: 'math' }, { type: 'domain', name: 'science' }] }, model_refs: [{ model: 'dm-3', use_reasoning: true }], plugins: [{ type: 'system_prompt', configuration: { content: 'You are a math and science expert. Show your reasoning step by step.' } }], created_at: '2026-03-30T10:00:00Z' },
  { id: 'dd-2', name: 'code_decision', description: 'Route code tasks to Claude', priority: 20, enabled: true, rules: { operator: 'OR', conditions: [{ type: 'domain', name: 'code' }] }, model_refs: [{ model: 'dm-2', use_reasoning: false }], plugins: [], created_at: '2026-03-30T10:00:00Z' },
  { id: 'dd-3', name: 'general_fallback', description: 'Default routing for all other queries', priority: 100, enabled: true, rules: { operator: 'OR', conditions: [{ type: 'domain', name: 'general' }] }, model_refs: [{ model: 'dm-4', use_reasoning: false }], plugins: [], created_at: '2026-03-30T10:00:00Z' },
];

export default function SemanticRouter() {
  usePageMeta({ title: 'Semantic Router', description: 'Configure LLM providers, models, and intelligent routing for your vLLM deployment.' });

  const [activeTab, setActiveTab] = useState('providers');
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);

  // Hooks
  const { providers: liveProviders, loading: pLoading, createProvider, updateProvider, deleteProvider, toggleEnabled: toggleProvider, isConnected: pConnected } = useProviders();
  const { models: liveModels, backends: liveBackends, loading: mLoading, createModel, updateModel, deleteModel, addBackend, removeBackend, updateBackendWeight, isConnected: mConnected } = useRouterModels();
  const { decisions: liveDecisions, loading: dLoading, createDecision, updateDecision, deleteDecision, toggleEnabled: toggleDecision, reorderPriority, isConnected: dConnected } = useRoutingDecisions();

  const isDemo = !pConnected;
  const providers = isDemo ? DEMO_PROVIDERS : liveProviders;
  const models = isDemo ? DEMO_MODELS : liveModels;
  const backends = isDemo ? DEMO_BACKENDS : liveBackends;
  const decisions = isDemo ? DEMO_DECISIONS : liveDecisions;

  const { yaml, snapshots, snapshotsLoading, fetchSnapshots, saveSnapshot } = useRouterConfig({ providers, models, backends, decisions });

  const loading = pLoading || mLoading || dLoading;

  const handleSaveProvider = async (data) => {
    if (data.id) {
      await updateProvider(data.id, data);
    } else {
      await createProvider(data);
    }
    setShowProviderForm(false);
    setEditingProvider(null);
  };

  return (
    <div className="sr-page">
      <h1 className="dash-page-title">Semantic Router</h1>
      <p className="dash-page-subtitle">Configure LLM providers, models, and intelligent routing</p>

      {isDemo && (
        <div className="usage-demo-banner">
          Demo data — connect Supabase to configure real providers
        </div>
      )}

      {/* Tabs */}
      <div className="sr-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`sr-tab ${activeTab === tab.id ? 'sr-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="sr-content">
        {activeTab === 'providers' && (
          <div className="sr-providers">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">LLM Providers</h2>
                <p className="dash-section-desc">Add and manage your LLM provider connections. API keys are encrypted at rest via Supabase Vault.</p>
              </div>
              <button className="dash-btn-sm dash-btn-primary" onClick={() => { setEditingProvider(null); setShowProviderForm(true); }}>
                + Add Provider
              </button>
            </div>

            {providers.length === 0 && !loading && (
              <div className="dash-empty">
                <div className="dash-empty-icon">🔌</div>
                <div className="dash-empty-title">No providers configured</div>
                <div className="dash-empty-text">Add an LLM provider to get started with routing.</div>
              </div>
            )}

            <div className="sr-provider-grid">
              {providers.map(p => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  onToggle={isDemo ? () => {} : toggleProvider}
                  onEdit={(provider) => { setEditingProvider(provider); setShowProviderForm(true); }}
                  onDelete={isDemo ? () => {} : deleteProvider}
                />
              ))}
            </div>

            {showProviderForm && (
              <ProviderForm
                provider={editingProvider}
                onSave={handleSaveProvider}
                onClose={() => { setShowProviderForm(false); setEditingProvider(null); }}
              />
            )}
          </div>
        )}

        {activeTab === 'models' && (
          <ModelConfig
            models={models}
            backends={backends}
            providers={providers}
            onCreateModel={isDemo ? () => {} : createModel}
            onUpdateModel={isDemo ? () => {} : updateModel}
            onDeleteModel={isDemo ? () => {} : deleteModel}
            onAddBackend={isDemo ? () => {} : addBackend}
            onRemoveBackend={isDemo ? () => {} : removeBackend}
            onUpdateBackendWeight={isDemo ? () => {} : updateBackendWeight}
          />
        )}

        {activeTab === 'routing' && (
          <RoutingRules
            decisions={decisions}
            models={models}
            onCreateDecision={isDemo ? () => {} : createDecision}
            onUpdateDecision={isDemo ? () => {} : updateDecision}
            onDeleteDecision={isDemo ? () => {} : deleteDecision}
            onToggleEnabled={isDemo ? () => {} : toggleDecision}
            onReorderPriority={isDemo ? () => {} : reorderPriority}
          />
        )}

        {activeTab === 'config' && (
          <div className="sr-config-tab">
            <ConfigPreview
              yaml={yaml}
              snapshots={snapshots}
              snapshotsLoading={snapshotsLoading}
              onSaveSnapshot={saveSnapshot}
              onFetchSnapshots={fetchSnapshots}
            />
            <MinikubeGuide yaml={yaml} providers={providers} />
          </div>
        )}
      </div>
    </div>
  );
}

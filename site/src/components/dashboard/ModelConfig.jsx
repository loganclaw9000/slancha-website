import React, { useState } from 'react';
import { CAPABILITY_OPTIONS } from '../../utils/providerPresets';

export default function ModelConfig({ models, backends, providers, onCreateModel, onUpdateModel, onDeleteModel, onAddBackend, onRemoveBackend, onUpdateBackendWeight }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', provider_model_id: '', pricing_prompt_per_1m: '', pricing_completion_per_1m: '',
    capabilities: [], is_default: false, api_format: 'openai', reasoning_family: '',
  });

  const enabledProviders = providers.filter(p => p.enabled);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreateModel({
      ...formData,
      pricing_prompt_per_1m: parseFloat(formData.pricing_prompt_per_1m) || 0,
      pricing_completion_per_1m: parseFloat(formData.pricing_completion_per_1m) || 0,
    });
    setFormData({ name: '', provider_model_id: '', pricing_prompt_per_1m: '', pricing_completion_per_1m: '', capabilities: [], is_default: false, api_format: 'openai', reasoning_family: '' });
    setShowForm(false);
  };

  const toggleCapability = (cap) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(cap)
        ? prev.capabilities.filter(c => c !== cap)
        : [...prev.capabilities, cap],
    }));
  };

  const getModelBackends = (modelId) => backends.filter(b => b.model_id === modelId);
  const getProviderName = (providerId) => {
    const p = providers.find(pr => pr.id === providerId);
    return p ? p.name : 'Unknown';
  };

  return (
    <div>
      <div className="sr-section-header">
        <div>
          <h2 className="models-section-title">Router Models</h2>
          <p className="models-section-desc">Configure models and assign provider backends with routing weights.</p>
        </div>
        <button className="dash-btn-sm dash-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Model'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="sr-inline-form">
          <div className="sr-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Model Name</label>
              <input className="dash-form-input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="gpt-4o" required />
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">Provider Model ID</label>
              <input className="dash-form-input" value={formData.provider_model_id} onChange={e => setFormData(p => ({ ...p, provider_model_id: e.target.value }))} placeholder="gpt-4o" required />
            </div>
          </div>
          <div className="sr-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Prompt Price / 1M tokens</label>
              <input className="dash-form-input" type="number" step="0.01" value={formData.pricing_prompt_per_1m} onChange={e => setFormData(p => ({ ...p, pricing_prompt_per_1m: e.target.value }))} placeholder="2.50" />
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">Completion Price / 1M tokens</label>
              <input className="dash-form-input" type="number" step="0.01" value={formData.pricing_completion_per_1m} onChange={e => setFormData(p => ({ ...p, pricing_completion_per_1m: e.target.value }))} placeholder="10.00" />
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">Reasoning Family</label>
              <input className="dash-form-input" value={formData.reasoning_family} onChange={e => setFormData(p => ({ ...p, reasoning_family: e.target.value }))} placeholder="qwen3, gpt, deepseek..." />
            </div>
          </div>
          <div className="dash-form-group">
            <label className="dash-form-label">Capabilities</label>
            <div className="sr-caps-row">
              {CAPABILITY_OPTIONS.map(cap => (
                <label key={cap.value} className={`sr-cap-chip ${formData.capabilities.includes(cap.value) ? 'sr-cap-chip--active' : ''}`}>
                  <input type="checkbox" checked={formData.capabilities.includes(cap.value)} onChange={() => toggleCapability(cap.value)} hidden />
                  {cap.label}
                </label>
              ))}
            </div>
          </div>
          <div className="sr-form-actions">
            <label className="sr-checkbox-label">
              <input type="checkbox" checked={formData.is_default} onChange={e => setFormData(p => ({ ...p, is_default: e.target.checked }))} />
              Default model
            </label>
            <button type="submit" className="dash-btn-sm dash-btn-primary">Create Model</button>
          </div>
        </form>
      )}

      {models.length === 0 && !showForm && (
        <div className="sr-empty">No models configured. Add a model to start building your routing config.</div>
      )}

      <div className="sr-model-list">
        {models.map(model => {
          const modelBackends = getModelBackends(model.id);
          const isExpanded = expandedId === model.id;
          return (
            <div key={model.id} className={`sr-model-card ${isExpanded ? 'sr-model-card--expanded' : ''}`}>
              <div className="sr-model-header" onClick={() => setExpandedId(isExpanded ? null : model.id)}>
                <div className="sr-model-info">
                  <code className="sr-model-name">{model.name}</code>
                  {model.is_default && <span className="sr-badge sr-badge--default">Default</span>}
                  <span className="sr-model-id">{model.provider_model_id}</span>
                </div>
                <div className="sr-model-meta">
                  {model.pricing_prompt_per_1m > 0 && (
                    <span className="sr-model-price">${model.pricing_prompt_per_1m} / ${model.pricing_completion_per_1m}</span>
                  )}
                  <div className="sr-model-caps">
                    {(model.capabilities || []).map(c => <span key={c} className="models-tag">{c}</span>)}
                  </div>
                  <span className="sr-expand-icon">{isExpanded ? '▾' : '▸'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="sr-model-detail">
                  <div className="sr-backends-section">
                    <h4 className="sr-sub-title">Backend Assignments ({modelBackends.length})</h4>
                    {modelBackends.map(backend => (
                      <div key={backend.id} className="sr-backend-row">
                        <span className="sr-backend-name">{getProviderName(backend.provider_id)}</span>
                        <div className="sr-weight-control">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={backend.weight}
                            onChange={e => onUpdateBackendWeight(backend.id, parseInt(e.target.value))}
                            className="sr-weight-slider"
                          />
                          <span className="sr-weight-value">{backend.weight}%</span>
                        </div>
                        {backend.is_fallback && <span className="sr-badge sr-badge--fallback">Fallback</span>}
                        <button className="dash-btn-sm dash-btn-danger" onClick={() => onRemoveBackend(model.id, backend.id)}>Remove</button>
                      </div>
                    ))}
                    {enabledProviders.length > 0 && (
                      <div className="sr-add-backend">
                        <select
                          className="dash-form-input"
                          defaultValue=""
                          onChange={e => { if (e.target.value) { onAddBackend(model.id, e.target.value); e.target.value = ''; } }}
                        >
                          <option value="" disabled>+ Assign provider...</option>
                          {enabledProviders.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="sr-model-actions">
                    <button className="dash-btn-sm dash-btn-danger" onClick={() => onDeleteModel(model.id)}>Delete Model</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const DOMAIN_OPTIONS = [
  { value: 'math', label: 'Math', color: '#3B82F6' },
  { value: 'code', label: 'Code', color: '#8B5CF6' },
  { value: 'business', label: 'Business', color: '#F59E0B' },
  { value: 'law', label: 'Law', color: '#6366F1' },
  { value: 'creative', label: 'Creative', color: '#EC4899' },
  { value: 'health', label: 'Health', color: '#22C55E' },
  { value: 'science', label: 'Science', color: '#14B8A6' },
  { value: 'general', label: 'General', color: '#94A3B8' },
];

export default function RoutingRules({ decisions, models, onCreateDecision, onUpdateDecision, onDeleteDecision, onToggleEnabled, onReorderPriority }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: (decisions.length + 1) * 10,
    domains: [],
    model_ref: '',
    use_reasoning: false,
    system_prompt: '',
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const toggleDomain = (domain) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rules = {
      operator: 'OR',
      conditions: formData.domains.map(d => ({ type: 'domain', name: d })),
    };
    const model_refs = formData.model_ref
      ? [{ model: formData.model_ref, use_reasoning: formData.use_reasoning }]
      : [];
    const plugins = formData.system_prompt
      ? [{ type: 'system_prompt', configuration: { content: formData.system_prompt } }]
      : [];

    await onCreateDecision({
      name: formData.name,
      description: formData.description,
      priority: Number(formData.priority) || (decisions.length + 1) * 10,
      rules,
      model_refs,
      plugins,
    });

    setFormData({ name: '', description: '', priority: (decisions.length + 2) * 10, domains: [], model_ref: '', use_reasoning: false, system_prompt: '' });
    setShowForm(false);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const ids = decisions.map(d => d.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    onReorderPriority(ids);
  };

  const moveDown = (index) => {
    if (index === decisions.length - 1) return;
    const ids = decisions.map(d => d.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    onReorderPriority(ids);
  };

  const getDomainColor = (name) => {
    const opt = DOMAIN_OPTIONS.find(d => d.value === name);
    return opt ? opt.color : '#94A3B8';
  };

  return (
    <div className="dash-routing-rules">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Routing Decisions</h2>
          <p className="dash-section-desc">Define rules to route requests to specific models based on domain and task type.</p>
        </div>
        <button className="dash-btn-sm dash-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Rule'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="dash-inline-form">
          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Rule Name</label>
              <input className="dash-form-input" type="text" value={formData.name} onChange={handleChange('name')} placeholder="math_decision" required />
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">Priority</label>
              <input className="dash-form-input" type="number" value={formData.priority} onChange={handleChange('priority')} min="1" />
            </div>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Description</label>
            <input className="dash-form-input" type="text" value={formData.description} onChange={handleChange('description')} placeholder="Route math queries to reasoning models" />
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Domain Conditions</label>
            <div className="dash-capability-pills">
              {DOMAIN_OPTIONS.map(d => (
                <button
                  key={d.value}
                  type="button"
                  className={`dash-pill ${formData.domains.includes(d.value) ? 'dash-pill--active' : ''}`}
                  style={formData.domains.includes(d.value) ? { background: d.color, borderColor: d.color } : {}}
                  onClick={() => toggleDomain(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Target Model</label>
              <select className="dash-form-input" value={formData.model_ref} onChange={handleChange('model_ref')}>
                <option value="">Select a model...</option>
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label-inline" style={{ marginTop: 24 }}>
                <input type="checkbox" checked={formData.use_reasoning} onChange={(e) => setFormData(prev => ({ ...prev, use_reasoning: e.target.checked }))} />
                Enable reasoning mode
              </label>
            </div>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">System Prompt (optional)</label>
            <textarea
              className="dash-form-input dash-form-textarea"
              value={formData.system_prompt}
              onChange={handleChange('system_prompt')}
              placeholder="You are a math expert..."
              rows={3}
            />
          </div>

          <button type="submit" className="dash-btn-sm dash-btn-primary">Create Rule</button>
        </form>
      )}

      {decisions.length === 0 && !showForm && (
        <div className="dash-empty">
          <div className="dash-empty-icon">🔀</div>
          <div className="dash-empty-title">No routing rules</div>
          <div className="dash-empty-text">Add routing decisions to control how requests are routed to different models.</div>
        </div>
      )}

      <div className="dash-decision-list">
        {decisions.map((decision, index) => {
          const domains = (decision.rules?.conditions || [])
            .filter(c => c.type === 'domain')
            .map(c => c.name);
          const modelRef = (decision.model_refs || [])[0];
          const targetModel = modelRef ? models.find(m => m.id === modelRef.model) : null;
          const systemPrompt = (decision.plugins || []).find(p => p.type === 'system_prompt');

          return (
            <div key={decision.id} className={`dash-decision-card ${!decision.enabled ? 'dash-decision-card--disabled' : ''}`}>
              <div className="dash-decision-header">
                <div className="dash-decision-priority">
                  <button className="dash-btn-icon" onClick={() => moveUp(index)} disabled={index === 0} aria-label="Move up">↑</button>
                  <span className="dash-decision-priority-num">#{decision.priority}</span>
                  <button className="dash-btn-icon" onClick={() => moveDown(index)} disabled={index === decisions.length - 1} aria-label="Move down">↓</button>
                </div>

                <div className="dash-decision-info">
                  <h3 className="dash-decision-name">{decision.name}</h3>
                  {decision.description && <p className="dash-decision-desc">{decision.description}</p>}
                </div>

                <label className="dash-provider-toggle" aria-label={`Toggle ${decision.name}`}>
                  <input type="checkbox" checked={decision.enabled} onChange={() => onToggleEnabled(decision.id)} />
                  <span className="dash-provider-toggle-track" />
                </label>
              </div>

              <div className="dash-decision-body">
                {domains.length > 0 && (
                  <div className="dash-decision-domains">
                    {domains.map(d => (
                      <span key={d} className="dash-domain-pill" style={{ background: `${getDomainColor(d)}22`, color: getDomainColor(d), borderColor: `${getDomainColor(d)}44` }}>
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {targetModel && (
                  <div className="dash-decision-target">
                    → <code>{targetModel.name}</code>
                    {modelRef.use_reasoning && <span className="dash-badge dash-badge--active" style={{ marginLeft: 8 }}>Reasoning</span>}
                  </div>
                )}

                {systemPrompt && (
                  <div className="dash-decision-prompt">
                    <span className="dash-form-label">System prompt:</span>
                    <span className="dash-decision-prompt-preview">{systemPrompt.configuration?.content?.slice(0, 80)}{(systemPrompt.configuration?.content?.length || 0) > 80 ? '…' : ''}</span>
                  </div>
                )}
              </div>

              <div className="dash-decision-actions">
                <button className="dash-btn-sm dash-btn-danger" onClick={() => onDeleteDecision(decision.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

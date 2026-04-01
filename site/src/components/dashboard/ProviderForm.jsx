import React, { useState, useEffect } from 'react';
import { PROVIDER_PRESETS, getPreset } from '../../utils/providerPresets';

export default function ProviderForm({ provider, onSave, onClose }) {
  const isEdit = !!provider;
  const [formData, setFormData] = useState({
    provider_type: 'openai',
    name: '',
    base_url: '',
    api_format: 'openai',
    api_key: '',
  });

  useEffect(() => {
    if (provider) {
      setFormData({
        provider_type: provider.provider_type,
        name: provider.name,
        base_url: provider.base_url || '',
        api_format: provider.api_format || 'openai',
        api_key: '',
      });
    }
  }, [provider]);

  const handlePresetChange = (e) => {
    const preset = getPreset(e.target.value);
    setFormData(prev => ({
      ...prev,
      provider_type: preset.provider_type,
      name: prev.name || preset.name,
      base_url: preset.base_url,
      api_format: preset.api_format,
    }));
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const [saving, setSaving] = useState(false);
  const handleSaveAsync = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-header">
          <h2 className="dash-modal-title">{isEdit ? 'Edit Provider' : 'Add Provider'}</h2>
          <button className="dash-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <form onSubmit={handleSaveAsync} className="dash-modal-body">
          <div className="dash-form-group">
            <label className="dash-form-label">Provider Preset</label>
            <select
              className="dash-form-input"
              value={formData.provider_type}
              onChange={handlePresetChange}
            >
              {PROVIDER_PRESETS.map(p => (
                <option key={p.provider_type} value={p.provider_type}>
                  {p.icon} {p.name} — {p.description}
                </option>
              ))}
            </select>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Display Name</label>
            <input
              className="dash-form-input"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="e.g. My OpenAI"
              required
            />
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Base URL</label>
            <input
              className="dash-form-input"
              type="url"
              value={formData.base_url}
              onChange={handleChange('base_url')}
              placeholder="https://api.openai.com/v1"
            />
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">API Format</label>
            <select
              className="dash-form-input"
              value={formData.api_format}
              onChange={handleChange('api_format')}
            >
              <option value="openai">OpenAI-compatible</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">
              API Key {isEdit && <span className="dash-form-hint">(leave blank to keep current)</span>}
            </label>
            <input
              className="dash-form-input"
              type="password"
              value={formData.api_key}
              onChange={handleChange('api_key')}
              placeholder={isEdit ? '••••••••' : 'sk-...'}
              autoComplete="off"
            />
          </div>

          <div className="dash-modal-footer">
            <button type="button" className="dash-btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="dash-btn-sm dash-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Provider' : 'Add Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { getPresetIcon } from '../../utils/providerPresets';

export default function ProviderCard({ provider, onToggle, onEdit, onDelete }) {
  const icon = getPresetIcon(provider.provider_type);
  const keyDisplay = provider.api_key_last4 ? `••••${provider.api_key_last4}` : 'No key';

  return (
    <div className={`dash-provider-card ${!provider.enabled ? 'dash-provider-card--disabled' : ''}`}>
      <div className="dash-provider-header">
        <span className="dash-provider-icon">{icon}</span>
        <div className="dash-provider-info">
          <h3 className="dash-provider-name">{provider.name}</h3>
          <span className="dash-provider-type">{provider.provider_type}</span>
        </div>
        <label className="dash-provider-toggle" aria-label={`Toggle ${provider.name}`}>
          <input
            type="checkbox"
            checked={provider.enabled}
            onChange={() => onToggle(provider.id)}
          />
          <span className="dash-provider-toggle-track" />
        </label>
      </div>

      <div className="dash-provider-details">
        <div className="dash-provider-detail">
          <span className="dash-provider-detail-label">Endpoint</span>
          <span className="dash-provider-detail-value dash-provider-url">{provider.base_url || '—'}</span>
        </div>
        <div className="dash-provider-detail">
          <span className="dash-provider-detail-label">API Key</span>
          <span className={`dash-provider-detail-value ${provider.api_key_last4 ? 'dash-provider-key--set' : 'dash-provider-key--empty'}`}>
            {keyDisplay}
          </span>
        </div>
        <div className="dash-provider-detail">
          <span className="dash-provider-detail-label">Format</span>
          <span className="dash-provider-detail-value">{provider.api_format}</span>
        </div>
      </div>

      <div className="dash-provider-actions">
        <button className="dash-btn-sm" onClick={() => onEdit(provider)}>Edit</button>
        <button className="dash-btn-sm dash-btn-danger" onClick={() => onDelete(provider.id)}>Delete</button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWebhooks, WEBHOOK_EVENTS } from '../../hooks/useWebhooks';
import './Webhooks.css';
import usePageMeta from '../../hooks/usePageMeta';

function WebhookForm({ onSubmit, onCancel }) {
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleEvent = (event) => {
    setSelectedEvents(prev =>
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    );
  };

  const selectAll = () => {
    setSelectedEvents(
      selectedEvents.length === WEBHOOK_EVENTS.length
        ? []
        : WEBHOOK_EVENTS.map(e => e.value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim() || selectedEvents.length === 0) return;
    setSubmitting(true);
    await onSubmit(url.trim(), selectedEvents);
    setSubmitting(false);
  };

  return (
    <form className="webhook-form" onSubmit={handleSubmit}>
      <div className="webhook-form-field">
        <label htmlFor="webhook-url">Endpoint URL</label>
        <input
          id="webhook-url"
          type="url"
          placeholder="https://your-server.com/webhooks/slancha"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="webhook-form-field">
        <label>
          Events to subscribe
          <button type="button" className="webhook-select-all" onClick={selectAll}>
            {selectedEvents.length === WEBHOOK_EVENTS.length ? 'Deselect all' : 'Select all'}
          </button>
        </label>
        <div className="webhook-events-grid">
          {WEBHOOK_EVENTS.map(event => (
            <label key={event.value} className="webhook-event-option">
              <input
                type="checkbox"
                checked={selectedEvents.includes(event.value)}
                onChange={() => toggleEvent(event.value)}
              />
              <div className="webhook-event-info">
                <span className="webhook-event-label">{event.label}</span>
                <span className="webhook-event-desc">{event.description}</span>
              </div>
            </label>
          ))}
        </div>
        {selectedEvents.length === 0 && (
          <p className="webhook-form-hint">Select at least one event</p>
        )}
      </div>

      <div className="webhook-form-actions">
        <button type="submit" className="btn-primary" disabled={submitting || !url.trim() || selectedEvents.length === 0}>
          {submitting ? 'Creating...' : 'Create Webhook'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function SecretReveal({ secret, onDismiss }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="webhook-secret-banner">
      <div className="webhook-secret-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <strong>Signing secret — copy it now, it won't be shown again</strong>
      </div>
      <div className="webhook-secret-value">
        <code>{secret}</code>
        <button className="webhook-copy-btn" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="webhook-secret-hint">
        Use this secret to verify webhook payloads. Slancha signs each delivery with an HMAC-SHA256 signature in the <code>X-Slancha-Signature</code> header.
      </p>
      <button className="btn-secondary" onClick={onDismiss}>I've saved it</button>
    </div>
  );
}

function WebhookRow({ webhook, onToggle, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const eventCount = webhook.events?.length || 0;
  const lastTriggered = webhook.last_triggered_at
    ? new Date(webhook.last_triggered_at).toLocaleDateString()
    : 'Never';

  return (
    <div className={`webhook-row ${!webhook.active ? 'inactive' : ''}`}>
      <div className="webhook-row-main">
        <div className="webhook-url-line">
          <span className={`webhook-status-dot ${webhook.active ? 'active' : 'inactive'}`} />
          <code className="webhook-url">{webhook.url}</code>
        </div>
        <div className="webhook-meta">
          <span className="webhook-event-count">{eventCount} event{eventCount !== 1 ? 's' : ''}</span>
          <span className="webhook-separator">·</span>
          <span>Last triggered: {lastTriggered}</span>
          {webhook.failure_count > 0 && (
            <>
              <span className="webhook-separator">·</span>
              <span className="webhook-failures">{webhook.failure_count} failure{webhook.failure_count !== 1 ? 's' : ''}</span>
            </>
          )}
        </div>
        <div className="webhook-events-tags">
          {(webhook.events || []).map(ev => (
            <span key={ev} className="webhook-event-tag">{ev}</span>
          ))}
        </div>
      </div>
      <div className="webhook-row-actions">
        <button
          className="webhook-toggle-btn"
          onClick={() => onToggle(webhook.id)}
          title={webhook.active ? 'Disable' : 'Enable'}
        >
          {webhook.active ? 'Disable' : 'Enable'}
        </button>
        {confirming ? (
          <span className="webhook-confirm-delete">
            <span>Delete?</span>
            <button className="webhook-confirm-yes" onClick={() => { onDelete(webhook.id); setConfirming(false); }}>Yes</button>
            <button className="webhook-confirm-no" onClick={() => setConfirming(false)}>No</button>
          </span>
        ) : (
          <button className="webhook-delete-btn" onClick={() => setConfirming(true)}>Delete</button>
        )}
      </div>
    </div>
  );
}

export default function Webhooks() {
  usePageMeta({ title: 'Webhooks', description: 'Configure webhook endpoints for real-time event notifications.' });
  const { webhooks, loading, error, createWebhook, toggleWebhook, deleteWebhook, isConnected } = useWebhooks();
  const [showForm, setShowForm] = useState(false);
  const [newSecret, setNewSecret] = useState(null);

  const handleCreate = async (url, events) => {
    const result = await createWebhook(url, events);
    if (!result.error) {
      setShowForm(false);
      if (result.secret) setNewSecret(result.secret);
    }
  };

  return (
    <div>
      <div className="webhook-header">
        <div>
          <h1 className="dash-page-title">Webhooks</h1>
          <p className="dash-page-subtitle">Get notified when events happen in your Slancha pipeline.</p>
        </div>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Add Endpoint
          </button>
        )}
      </div>

      {error && (
        <div className="webhook-error">Failed to load webhooks: {error}</div>
      )}

      {newSecret && (
        <SecretReveal secret={newSecret} onDismiss={() => setNewSecret(null)} />
      )}

      {showForm && (
        <WebhookForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="webhook-loading">Loading webhooks...</div>
      ) : webhooks.length > 0 ? (
        <div className="webhook-list">
          {webhooks.map(wh => (
            <WebhookRow
              key={wh.id}
              webhook={wh}
              onToggle={toggleWebhook}
              onDelete={deleteWebhook}
            />
          ))}
        </div>
      ) : !showForm ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <h2 className="dash-empty-title">No webhooks configured</h2>
          <p className="dash-empty-text">
            Add an endpoint to receive real-time notifications when evaluations complete, models are promoted, or fine-tuning jobs finish.
            {!isConnected && (
              <span className="usage-local-note">
                <br/>Database not connected — webhooks will persist once Supabase is configured.
              </span>
            )}
          </p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add Your First Webhook</button>
        </div>
      ) : null}

      {!loading && webhooks.length > 0 && (
        <div className="webhook-docs-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Payloads are signed with HMAC-SHA256. Verify using the <code>X-Slancha-Signature</code> header.{' '}
          <Link to="/docs#webhooks">View docs</Link>
        </div>
      )}
    </div>
  );
}

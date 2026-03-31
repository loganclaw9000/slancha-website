import React, { useState } from 'react';
import { useApiKeys } from '../../hooks/useApiKeys';
import usePageMeta from '../../hooks/usePageMeta';

export default function ApiKeys() {
  usePageMeta({ title: 'API Keys', description: 'Manage your Slancha API keys. Create, revoke, and monitor key usage.' });
  const { keys, loading, error, createKey, revokeKey, isConnected } = useApiKeys();
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const handleCreate = async () => {
    setCreating(true);
    setCreateError(null);
    const { key, error: err } = await createKey(newKeyName);
    if (err) {
      setCreateError(err);
    } else {
      setCreatedKey(key);
      setShowCreate(false);
    }
    setNewKeyName('');
    setCreating(false);
  };

  const handleRevoke = async (id) => {
    await revokeKey(id);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div>
        <h1 className="dash-page-title">API Keys</h1>
        <p className="dash-page-subtitle">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 className="dash-page-title">API Keys</h1>
        <button className="btn-primary btn-sm" onClick={() => setShowCreate(true)}>Create Key</button>
      </div>
      <p className="dash-page-subtitle">Manage your API keys for the Slancha Router.</p>

      {!isConnected && (
        <div style={{ background: 'rgba(251, 191, 36, 0.06)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Running in local mode — keys are not persisted. Connect Supabase for production use.
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#EF4444' }}>
          {error}
        </div>
      )}

      {createdKey && (
        <div style={{ background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#22C55E', fontWeight: 600, marginBottom: '4px' }}>Key created — copy it now. You won't see it again.</div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-primary)' }}>{createdKey}</code>
          </div>
          <button className="dash-btn-sm" onClick={() => handleCopy(createdKey)}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}

      {createError && (
        <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#EF4444' }}>
          Failed to create key: {createError}
        </div>
      )}

      {showCreate && (
        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Key name</label>
            <input
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontSize: '14px' }}
              placeholder="e.g. Development, Production"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>
          <button className="btn-primary btn-sm" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating...' : 'Create'}
          </button>
          <button className="dash-btn-sm" onClick={() => setShowCreate(false)}>Cancel</button>
        </div>
      )}

      <table className="dash-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Created</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {keys.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                No API keys yet. Create one to get started.
              </td>
            </tr>
          ) : (
            keys.map(key => (
              <tr key={key.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{key.name}</td>
                <td className="dash-table-mono">{key.key_prefix}...</td>
                <td>{key.created_at?.split('T')[0]}</td>
                <td>
                  <span className={`dash-badge ${key.active ? 'dash-badge--active' : 'dash-badge--revoked'}`}>
                    {key.active ? 'Active' : 'Revoked'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {key.active && (
                    <button className="dash-btn-sm dash-btn-danger" onClick={() => handleRevoke(key.id)}>Revoke</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import React, { useState } from 'react';

const DEMO_KEYS = [
  { id: '1', name: 'Development', prefix: 'sk-sl_dev8x2q', created: '2026-03-29', active: true },
  { id: '2', name: 'Production', prefix: 'sk-sl_prod4kf9', created: '2026-03-28', active: true },
];

export default function ApiKeys() {
  const [keys, setKeys] = useState(DEMO_KEYS);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const fakeKey = `sk-sl_${Math.random().toString(36).slice(2, 14)}`;
    const newKey = {
      id: String(keys.length + 1),
      name: newKeyName || 'Untitled',
      prefix: fakeKey.slice(0, 16),
      created: new Date().toISOString().split('T')[0],
      active: true,
    };
    setKeys([newKey, ...keys]);
    setCreatedKey(fakeKey);
    setNewKeyName('');
    setShowCreate(false);
  };

  const handleRevoke = (id) => {
    setKeys(keys.map(k => k.id === id ? { ...k, active: false } : k));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 className="dash-page-title">API Keys</h1>
        <button className="btn-primary btn-sm" onClick={() => setShowCreate(true)}>Create Key</button>
      </div>
      <p className="dash-page-subtitle">Manage your API keys for the Slancha Router.</p>

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
          <button className="btn-primary btn-sm" onClick={handleCreate}>Create</button>
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
          {keys.map(key => (
            <tr key={key.id}>
              <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{key.name}</td>
              <td className="dash-table-mono">{key.prefix}...</td>
              <td>{key.created}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

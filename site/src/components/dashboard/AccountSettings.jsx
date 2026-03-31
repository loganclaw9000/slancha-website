import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import usePageMeta from '../../hooks/usePageMeta';
import './AccountSettings.css';

export default function AccountSettings() {
  usePageMeta({ title: 'Account Settings', description: 'Update your Slancha account profile, email, and security settings.' });
  const { user, updatePassword } = useAuth();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');
  const [company, setCompany] = useState('');
  const [saved, setSaved] = useState(false);

  const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    usage: true,
    billing: true,
    incidents: true,
    product: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleProfile = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pw.new !== pw.confirm) { setPwError('Passwords do not match.'); return; }
    if (pw.new.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    const { error } = await updatePassword(pw.new);
    if (error) { setPwError(error.message); return; }
    setPwSaved(true);
    setPw({ current: '', new: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 2000);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <h1 className="dash-page-title">Settings</h1>
      <p className="dash-page-subtitle">Manage your account, notifications, and security.</p>

      {/* Profile */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Profile</h2>
          <p>Your personal information and display preferences.</p>
        </div>
        <form className="settings-form" onSubmit={handleProfile}>
          <div className="settings-field">
            <label>Email</label>
            <input className="settings-input settings-input-disabled" value={user?.email || ''} disabled />
          </div>
          <div className="settings-row">
            <div className="settings-field">
              <label>Display name</label>
              <input className="settings-input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="settings-field">
              <label>Company</label>
              <input className="settings-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company" />
            </div>
          </div>
          <div>
            <button className="btn-primary btn-sm" type="submit">{saved ? 'Saved!' : 'Save Profile'}</button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Change Password</h2>
          <p>Update your account password. Must be at least 8 characters.</p>
        </div>
        <form className="settings-form" onSubmit={handlePassword}>
          {pwError && <div className="settings-error">{pwError}</div>}
          <div className="settings-row">
            <div className="settings-field">
              <label>New password</label>
              <input className="settings-input" type="password" value={pw.new} onChange={e => setPw({ ...pw, new: e.target.value })} placeholder="At least 8 characters" />
            </div>
            <div className="settings-field">
              <label>Confirm password</label>
              <input className="settings-input" type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} placeholder="Confirm new password" />
            </div>
          </div>
          <div>
            <button className="btn-primary btn-sm" type="submit">{pwSaved ? 'Updated!' : 'Update Password'}</button>
          </div>
        </form>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Notifications</h2>
          <p>Choose which email notifications you receive.</p>
        </div>
        <div className="settings-toggle-list">
          {[
            { key: 'usage', label: 'Usage alerts', desc: 'Get notified when you approach rate limits or usage thresholds.' },
            { key: 'billing', label: 'Billing updates', desc: 'Invoices, payment confirmations, and plan changes.' },
            { key: 'incidents', label: 'Incident reports', desc: 'Service disruptions, maintenance windows, and resolutions.' },
            { key: 'product', label: 'Product updates', desc: 'New features, model additions, and platform improvements.' },
          ].map(({ key, label, desc }) => (
            <div className="settings-toggle-row" key={key}>
              <div className="settings-toggle-info">
                <span className="settings-toggle-label">{label}</span>
                <span className="settings-toggle-desc">{desc}</span>
              </div>
              <button
                type="button"
                className={`settings-toggle${notifications[key] ? ' active' : ''}`}
                onClick={() => toggleNotification(key)}
                aria-pressed={notifications[key]}
                aria-label={`Toggle ${label}`}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Info */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>API Information</h2>
          <p>Your account identifiers for API access.</p>
        </div>
        <div className="settings-info-card">
          <div className="settings-info-row">
            <span className="settings-info-label">Account ID</span>
            <span className="settings-info-value">{user?.id?.slice(0, 12) || 'acct_...'}</span>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-label">Organization</span>
            <span className="settings-info-value">{company || 'Personal'}</span>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-label">API Base URL</span>
            <span className="settings-info-value">api.slancha.ai/v1</span>
          </div>
          <p className="settings-info-note">
            Manage your API keys on the <Link to="/dashboard/keys">API Keys</Link> page.
          </p>
        </div>
      </div>

      {/* Data Export */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Data Export</h2>
          <p>Download your account data for compliance or migration.</p>
        </div>
        <div className="settings-export-grid">
          {[
            { icon: '📊', title: 'Usage data', desc: 'Request logs, latency metrics, and cost breakdown (CSV)' },
            { icon: '🔑', title: 'API key history', desc: 'Key creation, revocation, and usage audit log (JSON)' },
            { icon: '📦', title: 'Full account export', desc: 'All account data including configs and settings (ZIP)' },
          ].map(({ icon, title, desc }) => (
            <div className="settings-export-card" key={title}>
              <span className="settings-export-icon">{icon}</span>
              <div className="settings-export-info">
                <span className="settings-export-title">{title}</span>
                <span className="settings-export-desc">{desc}</span>
              </div>
              <button className="btn-secondary btn-sm" type="button">Export</button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section settings-danger-zone">
        <div className="settings-section-header">
          <h2>Danger Zone</h2>
          <p>Irreversible actions for your account.</p>
        </div>
        <div className="settings-danger-actions">
          <div className="settings-danger-row">
            <div>
              <span className="settings-danger-title">Revoke all API keys</span>
              <span className="settings-danger-desc">Immediately invalidate all active API keys. Running applications will stop working.</span>
            </div>
            <button className="btn-danger" type="button">Revoke All</button>
          </div>
          <div className="settings-danger-row">
            <div>
              <span className="settings-danger-title">Delete account</span>
              <span className="settings-danger-desc">Permanently delete your account, API keys, and all associated data. This cannot be undone.</span>
            </div>
            <button className="btn-danger" type="button" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Account</h3>
            <p>This action is permanent and cannot be undone. All your API keys, usage data, configurations, and billing history will be permanently deleted.</p>
            <div className="settings-field">
              <label>Type <strong>DELETE</strong> to confirm</label>
              <input className="settings-input" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
            </div>
            <div className="settings-modal-actions">
              <button className="btn-secondary btn-sm" type="button" onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}>Cancel</button>
              <button className="btn-danger" type="button" disabled={deleteConfirm !== 'DELETE'}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import usePageMeta from '../../hooks/usePageMeta';

export default function AccountSettings() {
  usePageMeta({ title: 'Account Settings', description: 'Update your Slancha account profile, email, and security settings.' });
  const { user, updatePassword } = useAuth();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');
  const [company, setCompany] = useState('');
  const [saved, setSaved] = useState(false);

  const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

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

  const inputStyle = { width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontSize: '14px' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' };

  return (
    <div>
      <h1 className="dash-page-title">Settings</h1>
      <p className="dash-page-subtitle">Manage your account.</p>

      <div style={{ maxWidth: '480px' }}>
        <form onSubmit={handleProfile}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Profile</h2>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} value={user?.email || ''} disabled />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Display name</label>
            <input style={inputStyle} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Company</label>
            <input style={inputStyle} value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company" />
          </div>
          <button className="btn-primary btn-sm" type="submit">{saved ? 'Saved!' : 'Save'}</button>
        </form>

        <hr style={{ border: 'none', height: '1px', background: 'var(--glass-border)', margin: '40px 0' }} />

        <form onSubmit={handlePassword}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Change password</h2>
          {pwError && <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{pwError}</div>}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>New password</label>
            <input style={inputStyle} type="password" value={pw.new} onChange={e => setPw({ ...pw, new: e.target.value })} placeholder="At least 8 characters" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Confirm password</label>
            <input style={inputStyle} type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} placeholder="Confirm new password" />
          </div>
          <button className="btn-primary btn-sm" type="submit">{pwSaved ? 'Updated!' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
}

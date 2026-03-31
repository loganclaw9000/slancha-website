import React, { useState } from 'react';
import './TeamManagement.css';
import usePageMeta from '../../hooks/usePageMeta';

const ROLES = [
  { value: 'admin', label: 'Admin', desc: 'Full access — manage team, billing, API keys, and all settings' },
  { value: 'developer', label: 'Developer', desc: 'Create API keys, run evaluations, deploy models, view usage' },
  { value: 'viewer', label: 'Viewer', desc: 'Read-only access to dashboards, logs, and usage data' },
];

const DEMO_MEMBERS = [
  { id: 1, name: 'You', email: 'you@company.com', role: 'admin', status: 'active', lastActive: '2026-03-31T10:42:00Z', avatar: null, isYou: true },
  { id: 2, name: 'Sarah Chen', email: 'sarah@company.com', role: 'developer', status: 'active', lastActive: '2026-03-31T09:15:00Z', avatar: null },
  { id: 3, name: 'Marcus Johnson', email: 'marcus@company.com', role: 'developer', status: 'active', lastActive: '2026-03-30T16:30:00Z', avatar: null },
  { id: 4, name: 'Priya Patel', email: 'priya@company.com', role: 'viewer', status: 'active', lastActive: '2026-03-29T11:00:00Z', avatar: null },
];

const DEMO_INVITES = [
  { id: 'inv_1', email: 'alex@company.com', role: 'developer', sentAt: '2026-03-31T08:00:00Z', expiresAt: '2026-04-07T08:00:00Z' },
];

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TeamManagement() {
  usePageMeta({ title: 'Team Management', description: 'Manage team members, roles, and permissions for your Slancha organization.' });
  const [members, setMembers] = useState(DEMO_MEMBERS);
  const [invites, setInvites] = useState(DEMO_INVITES);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('developer');
  const [editingRole, setEditingRole] = useState(null);
  const [sending, setSending] = useState(false);

  const adminCount = members.filter(m => m.role === 'admin').length;
  const totalSeats = 10; // plan limit

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setSending(true);
    setTimeout(() => {
      setInvites(prev => [...prev, {
        id: `inv_${Date.now()}`,
        email: inviteEmail.trim(),
        role: inviteRole,
        sentAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      }]);
      setInviteEmail('');
      setInviteRole('developer');
      setShowInvite(false);
      setSending(false);
    }, 600);
  };

  const handleRevokeInvite = (id) => {
    setInvites(prev => prev.filter(inv => inv.id !== id));
  };

  const handleChangeRole = (memberId, newRole) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    setEditingRole(null);
  };

  const handleRemoveMember = (memberId) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  return (
    <div>
      <div className="team-header">
        <div>
          <h1 className="dash-page-title">Team</h1>
          <p className="dash-page-subtitle">Manage team members and access controls.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowInvite(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          Invite Member
        </button>
      </div>

      {/* Seats counter */}
      <div className="dash-cards" style={{ marginBottom: 24 }}>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Team Members</div>
          <div className="dash-stat-value">{members.length}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Pending Invites</div>
          <div className="dash-stat-value">{invites.length}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Available Seats</div>
          <div className="dash-stat-value">{totalSeats - members.length - invites.length}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Plan Limit</div>
          <div className="dash-stat-value">{totalSeats} seats</div>
        </div>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="team-modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="team-modal" onClick={e => e.stopPropagation()}>
            <h2 className="team-modal-title">Invite Team Member</h2>
            <form onSubmit={handleInvite}>
              <div className="team-form-group">
                <label className="team-form-label">Email address</label>
                <input
                  type="email"
                  className="team-form-input"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="team-form-group">
                <label className="team-form-label">Role</label>
                <div className="team-role-options">
                  {ROLES.map(role => (
                    <label
                      key={role.value}
                      className={`team-role-option ${inviteRole === role.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={inviteRole === role.value}
                        onChange={() => setInviteRole(role.value)}
                      />
                      <div>
                        <div className="team-role-name">{role.label}</div>
                        <div className="team-role-desc">{role.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="team-modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowInvite(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={sending || !inviteEmail.trim()}>
                  {sending ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pending invitations */}
      {invites.length > 0 && (
        <div className="team-section">
          <h2 className="team-section-title">Pending Invitations</h2>
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Sent</th>
                  <th>Expires</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invites.map(inv => (
                  <tr key={inv.id}>
                    <td className="team-email-cell">{inv.email}</td>
                    <td><span className={`team-role-badge role-${inv.role}`}>{inv.role}</span></td>
                    <td className="team-meta">{formatDate(inv.sentAt)}</td>
                    <td className="team-meta">{formatDate(inv.expiresAt)}</td>
                    <td>
                      <div className="team-actions">
                        <button className="team-action-btn" title="Resend invite">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"/>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                          </svg>
                        </button>
                        <button
                          className="team-action-btn danger"
                          title="Revoke invite"
                          onClick={() => handleRevokeInvite(inv.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Members table */}
      <div className="team-section">
        <h2 className="team-section-title">Members</h2>
        <div className="team-table-wrap">
          <table className="team-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="team-member-cell">
                      <div className="team-avatar">{getInitials(member.name)}</div>
                      <div>
                        <div className="team-member-name">
                          {member.name}
                          {member.isYou && <span className="team-you-badge">you</span>}
                        </div>
                        <div className="team-member-email">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {editingRole === member.id ? (
                      <select
                        className="team-role-select"
                        value={member.role}
                        onChange={e => handleChangeRole(member.id, e.target.value)}
                        onBlur={() => setEditingRole(null)}
                        autoFocus
                      >
                        {ROLES.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`team-role-badge role-${member.role} ${!member.isYou ? 'editable' : ''}`}
                        onClick={() => !member.isYou && setEditingRole(member.id)}
                        title={!member.isYou ? 'Click to change role' : undefined}
                      >
                        {member.role}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`team-status-dot ${member.status}`} />
                    {member.status}
                  </td>
                  <td className="team-meta">{timeAgo(member.lastActive)}</td>
                  <td>
                    {!member.isYou && (
                      <div className="team-actions">
                        <button
                          className="team-action-btn danger"
                          title="Remove member"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <line x1="18" y1="8" x2="23" y2="13"/>
                            <line x1="23" y1="8" x2="18" y2="13"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles reference */}
      <div className="team-section">
        <h2 className="team-section-title">Role Permissions</h2>
        <div className="team-permissions-grid">
          <div className="team-perm-header"></div>
          {ROLES.map(r => (
            <div key={r.value} className="team-perm-header">{r.label}</div>
          ))}
          {[
            ['View dashboards & usage', true, true, true],
            ['Create & manage API keys', true, true, false],
            ['Run evaluations', true, true, false],
            ['Deploy & manage models', true, true, false],
            ['Configure fine-tuning', true, true, false],
            ['Manage webhooks', true, true, false],
            ['View request logs', true, true, true],
            ['Invite team members', true, false, false],
            ['Change member roles', true, false, false],
            ['Manage billing', true, false, false],
            ['Delete team resources', true, false, false],
          ].map(([perm, ...vals], i) => (
            <React.Fragment key={i}>
              <div className="team-perm-label">{perm}</div>
              {vals.map((v, j) => (
                <div key={j} className={`team-perm-val ${v ? 'yes' : 'no'}`}>
                  {v ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

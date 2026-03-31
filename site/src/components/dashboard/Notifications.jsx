import React, { useState, useRef, useEffect } from 'react';
import './Notifications.css';
import usePageMeta from '../../hooks/usePageMeta';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'eval',
    title: 'Evaluation completed',
    message: 'eval-run-047 finished — GPT-4o scored 94.2%, Llama 3.1 70B scored 91.8%',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'deploy',
    title: 'Model deployed',
    message: 'Fine-tuned payments-v3 promoted to production via canary (100% traffic)',
    time: '18 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'cost',
    title: 'Cost alert',
    message: 'Daily spend reached $842 — 85% of $1,000 budget threshold',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'finetune',
    title: 'Fine-tuning complete',
    message: 'Job ft-support-chat-v4 finished in 47 min — accuracy 96.1% (+2.3%)',
    time: '2 hr ago',
    read: true,
  },
  {
    id: 5,
    type: 'route',
    title: 'Route updated',
    message: 'Auto-router shifted 15% traffic from Claude 3.5 to fine-tuned specialist (cost -22%)',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 6,
    type: 'webhook',
    title: 'Webhook failure',
    message: 'Endpoint https://api.acme.co/hooks/slancha returned 503 — 3 consecutive failures',
    time: '4 hr ago',
    read: true,
  },
  {
    id: 7,
    type: 'eval',
    title: 'Drift detected',
    message: 'Quality score for summarization dropped 4.2% over 24h — auto-eval triggered',
    time: '5 hr ago',
    read: true,
  },
  {
    id: 8,
    type: 'deploy',
    title: 'Rollback executed',
    message: 'Canary deployment fraud-detect-v2 rolled back — P99 latency exceeded 800ms threshold',
    time: '8 hr ago',
    read: true,
  },
  {
    id: 9,
    type: 'finetune',
    title: 'Fine-tuning started',
    message: 'Job ft-extraction-v6 training on 12,400 samples — ETA 52 min',
    time: '12 hr ago',
    read: true,
  },
  {
    id: 10,
    type: 'cost',
    title: 'Weekly cost report',
    message: 'Total spend: $4,218 — down 31% from last week. Top saving: routing optimization (-$1,890)',
    time: '1 day ago',
    read: true,
  },
];

const TYPE_ICONS = {
  eval: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  deploy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </svg>
  ),
  cost: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  finetune: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" />
      <path d="M1 14h6" /><path d="M9 8h6" /><path d="M17 16h6" />
    </svg>
  ),
  route: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  ),
  webhook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
};

const TYPE_COLORS = {
  eval: '#0A84FF',
  deploy: '#00D1B2',
  cost: '#FFD60A',
  finetune: '#BF5AF2',
  route: '#64D2FF',
  webhook: '#FF453A',
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'eval', label: 'Evals' },
  { key: 'deploy', label: 'Deploys' },
  { key: 'cost', label: 'Cost' },
  { key: 'finetune', label: 'Fine-tune' },
  { key: 'webhook', label: 'Webhooks' },
];

export default function Notifications() {
  usePageMeta({ title: 'Notifications', description: 'View and manage your Slancha notification preferences and history.' });
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div className="notif-wrapper">
      <button
        ref={buttonRef}
        className={`notif-bell${unreadCount > 0 ? ' has-unread' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        title="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div ref={panelRef} className="notif-panel">
          <div className="notif-header">
            <h3 className="notif-title">Notifications</h3>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-filters">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`notif-filter${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="notif-list">
            {filtered.length === 0 ? (
              <div className="notif-empty">No notifications</div>
            ) : (
              filtered.map(n => (
                <button
                  key={n.id}
                  className={`notif-item${n.read ? '' : ' unread'}`}
                  onClick={() => markRead(n.id)}
                >
                  <div className="notif-item-icon" style={{ color: TYPE_COLORS[n.type] }}>
                    {TYPE_ICONS[n.type] || TYPE_ICONS.eval}
                  </div>
                  <div className="notif-item-body">
                    <div className="notif-item-top">
                      <span className="notif-item-title">{n.title}</span>
                      <span className="notif-item-time">{n.time}</span>
                    </div>
                    <p className="notif-item-msg">{n.message}</p>
                  </div>
                  {!n.read && <div className="notif-item-dot" />}
                </button>
              ))
            )}
          </div>

          <div className="notif-footer">
            <button className="notif-view-all" onClick={() => setOpen(false)}>
              View all activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

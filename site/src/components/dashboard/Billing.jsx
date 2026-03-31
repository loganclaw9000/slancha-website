import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';

function formatNumber(n) {
  if (n === -1) return 'Unlimited';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString();
}

function formatPrice(cents) {
  if (cents === -1) return 'Custom';
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(0)}`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function UsageBar({ used, limit, label, color }) {
  const isUnlimited = limit === -1;
  const percent = isUnlimited ? 5 : limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isWarning = !isUnlimited && percent >= 80;
  const isDanger = !isUnlimited && percent >= 100;

  return (
    <div className="billing-usage-item">
      <div className="billing-usage-header">
        <span className="billing-usage-label">{label}</span>
        <span className="billing-usage-count">
          {formatNumber(used)} / {formatNumber(limit)}
        </span>
      </div>
      <div className="billing-usage-bar-bg">
        <div
          className={`billing-usage-bar-fill ${isDanger ? 'danger' : isWarning ? 'warning' : ''}`}
          style={{ width: `${Math.max(percent, 1)}%`, ...(color && !isDanger && !isWarning ? { background: color } : {}) }}
        />
      </div>
    </div>
  );
}

const PLAN_FEATURES = {
  free:       ['1K requests/month', '3 models', 'Community support'],
  starter:    ['50K requests/month', '10 models', '2 fine-tuning jobs', 'Email support'],
  growth:     ['500K requests/month', '25 models', '10 fine-tuning jobs', 'Priority support'],
  enterprise: ['Unlimited requests', 'All models', 'Unlimited fine-tuning', 'Dedicated support', 'Custom SLA'],
};

const UPGRADE_PATH = { free: 'starter', starter: 'growth', growth: 'enterprise' };

// Demo invoice history
const DEMO_INVOICES = [
  { id: 'inv_2026_03', date: '2026-03-01T00:00:00Z', amount: 29900, status: 'paid', plan: 'Growth', pdf: '#' },
  { id: 'inv_2026_02', date: '2026-02-01T00:00:00Z', amount: 29900, status: 'paid', plan: 'Growth', pdf: '#' },
  { id: 'inv_2026_01', date: '2026-01-01T00:00:00Z', amount: 29900, status: 'paid', plan: 'Growth', pdf: '#' },
  { id: 'inv_2025_12', date: '2025-12-01T00:00:00Z', amount: 4900, status: 'paid', plan: 'Starter', pdf: '#' },
  { id: 'inv_2025_11', date: '2025-11-01T00:00:00Z', amount: 4900, status: 'paid', plan: 'Starter', pdf: '#' },
  { id: 'inv_2025_10', date: '2025-10-01T00:00:00Z', amount: 0, status: 'paid', plan: 'Free', pdf: '#' },
];

// Demo usage breakdown by category
const DEMO_USAGE_BREAKDOWN = [
  { category: 'Routing', requests: 38420, percent: 76.8, cost: 187.42, color: 'linear-gradient(90deg, #3B82F6, #60A5FA)' },
  { category: 'Evaluations', requests: 6210, percent: 12.4, cost: 48.90, color: 'linear-gradient(90deg, #8B5CF6, #A78BFA)' },
  { category: 'Fine-Tuning', requests: 3840, percent: 7.7, cost: 124.60, color: 'linear-gradient(90deg, #F59E0B, #FBBF24)' },
  { category: 'Deployments', requests: 1530, percent: 3.1, cost: 12.10, color: 'linear-gradient(90deg, #22C55E, #4ADE80)' },
];

// Card icon SVG
function CardIcon() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="31" height="23" rx="3.5" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.03)" />
      <rect x="0" y="6" width="32" height="4" fill="rgba(255,255,255,0.15)" />
      <rect x="4" y="15" width="8" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="14" y="15" width="4" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="20" y="15" width="4" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="26" y="15" width="2" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function InvoiceStatusBadge({ status }) {
  const cls = status === 'paid' ? 'billing-inv-paid' : status === 'pending' ? 'billing-inv-pending' : 'billing-inv-failed';
  return <span className={`billing-inv-badge ${cls}`}>{status}</span>;
}

export default function Billing() {
  const {
    subscription, limits, usage, loading, error,
    planName, isFreePlan, isActive, isCanceling, isUnlimited, usagePercent, isNearLimit, isAtLimit,
  } = useSubscription();
  const [activeTab, setActiveTab] = useState('overview');

  const customerPortalUrl = import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL;
  const nextPlan = UPGRADE_PATH[subscription.plan];
  const features = PLAN_FEATURES[subscription.plan] || PLAN_FEATURES.free;
  const totalCategoryCost = DEMO_USAGE_BREAKDOWN.reduce((s, c) => s + c.cost, 0);

  return (
    <div className="billing-page">
      <h1 className="dash-page-title">Billing</h1>
      <p className="dash-page-subtitle">Manage your subscription, usage, and payment methods.</p>

      {error && (
        <div className="billing-error">Failed to load billing data: {error}</div>
      )}

      {/* Tab navigation */}
      <div className="billing-tabs">
        {['overview', 'usage', 'invoices', 'payment'].map(tab => (
          <button
            key={tab}
            className={`billing-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <>
          {/* Plan overview cards */}
          <div className="dash-cards">
            <div className="dash-stat-card">
              <div className="dash-stat-label">Current Plan</div>
              <div className="dash-stat-value" style={{ fontSize: 18 }}>
                {loading ? '...' : (
                  <span className={`billing-plan-badge plan-${subscription.plan}`}>
                    {planName}
                  </span>
                )}
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Status</div>
              <div className="dash-stat-value" style={{ fontSize: 18 }}>
                {loading ? '...' : (
                  <span className={`billing-status ${isActive ? 'active' : 'inactive'}`}>
                    {isCanceling ? 'Canceling' : subscription.status}
                  </span>
                )}
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Monthly Price</div>
              <div className="dash-stat-value" style={{ fontSize: 18 }}>
                {loading ? '...' : formatPrice(limits.price_monthly_cents)}
                {limits.price_monthly_cents > 0 && <span className="billing-period">/mo</span>}
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">
                {subscription.current_period_end ? 'Renews' : 'Billing Period'}
              </div>
              <div className="dash-stat-value" style={{ fontSize: 18 }}>
                {loading ? '...' : formatDate(subscription.current_period_end)}
              </div>
            </div>
          </div>

          {/* Usage against limits */}
          {!loading && (
            <div className="billing-section">
              <h2 className="billing-section-title">Usage This Month</h2>
              <UsageBar
                used={usage.requests_this_month}
                limit={limits.requests_per_month}
                label="API Requests"
              />

              {isAtLimit && (
                <div className="billing-alert danger">
                  You've reached your monthly request limit. Upgrade to continue making API calls.
                </div>
              )}
              {isNearLimit && !isAtLimit && (
                <div className="billing-alert warning">
                  You're at {Math.round(usagePercent)}% of your monthly limit. Consider upgrading to avoid interruptions.
                </div>
              )}
            </div>
          )}

          {/* Current plan features */}
          {!loading && (
            <div className="billing-section">
              <h2 className="billing-section-title">Plan Includes</h2>
              <ul className="billing-features">
                {features.map(f => (
                  <li key={f} className="billing-feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          {!loading && (
            <div className="billing-actions">
              {nextPlan && (
                <Link to="/pricing" className="btn-primary btn-lg">
                  Upgrade to {nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)}
                </Link>
              )}
              {customerPortalUrl && !isFreePlan && (
                <a
                  href={customerPortalUrl}
                  className="btn-secondary btn-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Manage Billing
                </a>
              )}
              {isFreePlan && !nextPlan && (
                <Link to="/pricing" className="btn-primary btn-lg">View Plans</Link>
              )}
            </div>
          )}

          {/* Canceling notice */}
          {isCanceling && (
            <div className="billing-alert warning" style={{ marginTop: 24 }}>
              Your subscription will be canceled at the end of the current billing period
              ({formatDate(subscription.current_period_end)}). You can reactivate from the billing portal.
            </div>
          )}
        </>
      )}

      {/* ── Usage Breakdown Tab ── */}
      {activeTab === 'usage' && (
        <>
          <div className="dash-cards">
            <div className="dash-stat-card">
              <div className="dash-stat-label">Total Requests</div>
              <div className="dash-stat-value">{formatNumber(DEMO_USAGE_BREAKDOWN.reduce((s, c) => s + c.requests, 0))}</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Total Spend</div>
              <div className="dash-stat-value">${totalCategoryCost.toFixed(2)}</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Avg Cost/Request</div>
              <div className="dash-stat-value">${(totalCategoryCost / DEMO_USAGE_BREAKDOWN.reduce((s, c) => s + c.requests, 0) * 1000).toFixed(2)}<span className="billing-period">/1K</span></div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Projected Monthly</div>
              <div className="dash-stat-value">${(totalCategoryCost * 1.08).toFixed(0)}</div>
            </div>
          </div>

          <div className="billing-section">
            <h2 className="billing-section-title">Usage by Category</h2>
            <div className="billing-breakdown">
              {DEMO_USAGE_BREAKDOWN.map(cat => (
                <div key={cat.category} className="billing-breakdown-row">
                  <div className="billing-breakdown-header">
                    <span className="billing-breakdown-category">{cat.category}</span>
                    <span className="billing-breakdown-stats">
                      {formatNumber(cat.requests)} requests &middot; ${cat.cost.toFixed(2)} &middot; {cat.percent}%
                    </span>
                  </div>
                  <div className="billing-usage-bar-bg">
                    <div
                      className="billing-usage-bar-fill"
                      style={{ width: `${cat.percent}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily usage chart (simplified bar chart) */}
          <div className="billing-section">
            <h2 className="billing-section-title">Daily Requests (Last 14 Days)</h2>
            <div className="billing-daily-chart">
              {[1820, 2140, 1960, 2380, 2560, 2890, 3120, 2740, 3340, 3580, 3210, 3890, 3650, 4120].map((val, i) => {
                const max = 4120;
                const height = Math.round((val / max) * 100);
                const day = new Date(Date.now() - (13 - i) * 86400000);
                const label = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <div key={i} className="billing-daily-bar-col" title={`${label}: ${formatNumber(val)} requests`}>
                    <div className="billing-daily-bar" style={{ height: `${height}%` }} />
                    <span className="billing-daily-label">{day.getDate()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="usage-local-note">Showing demo data. Connect your Supabase to see real usage.</p>
        </>
      )}

      {/* ── Invoices Tab ── */}
      {activeTab === 'invoices' && (
        <div className="billing-section">
          <h2 className="billing-section-title">Invoice History</h2>
          <div className="billing-invoice-table-wrap">
            <table className="dash-table billing-invoice-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Invoice ID</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {DEMO_INVOICES.map(inv => (
                  <tr key={inv.id}>
                    <td>{formatDate(inv.date)}</td>
                    <td className="dash-table-mono">{inv.id}</td>
                    <td>{inv.plan}</td>
                    <td className="dash-table-mono">{inv.amount === 0 ? 'Free' : `$${(inv.amount / 100).toFixed(2)}`}</td>
                    <td><InvoiceStatusBadge status={inv.status} /></td>
                    <td>
                      <button className="billing-inv-download" title="Download PDF">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="usage-local-note">Showing demo data. Connect Stripe to see real invoices.</p>
        </div>
      )}

      {/* ── Payment Method Tab ── */}
      {activeTab === 'payment' && (
        <>
          <div className="billing-section">
            <h2 className="billing-section-title">Payment Method</h2>
            <div className="billing-payment-card">
              <div className="billing-card-visual">
                <CardIcon />
                <div className="billing-card-details">
                  <span className="billing-card-brand">Visa</span>
                  <span className="billing-card-number">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</span>
                </div>
                <div className="billing-card-meta">
                  <span className="billing-card-exp">Expires 12/2028</span>
                  <span className="billing-card-default">Default</span>
                </div>
              </div>
              <div className="billing-card-actions">
                <button className="btn-secondary btn-sm">Update Card</button>
                <button className="btn-ghost btn-sm">Add New Method</button>
              </div>
            </div>
          </div>

          <div className="billing-section">
            <h2 className="billing-section-title">Billing Information</h2>
            <div className="billing-info-grid">
              <div className="billing-info-item">
                <span className="billing-info-label">Company</span>
                <span className="billing-info-value">Acme Corp</span>
              </div>
              <div className="billing-info-item">
                <span className="billing-info-label">Email</span>
                <span className="billing-info-value">billing@acme.dev</span>
              </div>
              <div className="billing-info-item">
                <span className="billing-info-label">Address</span>
                <span className="billing-info-value">123 Market St, San Francisco, CA 94105</span>
              </div>
              <div className="billing-info-item">
                <span className="billing-info-label">Tax ID</span>
                <span className="billing-info-value">US-EIN **-***7890</span>
              </div>
            </div>
            <button className="btn-secondary btn-sm" style={{ marginTop: 16 }}>Edit Billing Info</button>
          </div>

          <p className="usage-local-note">Showing demo data. Connect Stripe to manage real payment methods.</p>
        </>
      )}
    </div>
  );
}

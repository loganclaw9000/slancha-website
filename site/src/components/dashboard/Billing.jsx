import React from 'react';
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

function UsageBar({ used, limit, label }) {
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
          style={{ width: `${Math.max(percent, 1)}%` }}
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

export default function Billing() {
  const {
    subscription, limits, usage, loading, error,
    planName, isFreePlan, isActive, isCanceling, isUnlimited, usagePercent, isNearLimit, isAtLimit,
  } = useSubscription();

  const customerPortalUrl = import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL;
  const nextPlan = UPGRADE_PATH[subscription.plan];
  const features = PLAN_FEATURES[subscription.plan] || PLAN_FEATURES.free;

  return (
    <div>
      <h1 className="dash-page-title">Billing</h1>
      <p className="dash-page-subtitle">Manage your subscription and usage.</p>

      {error && (
        <div className="billing-error">Failed to load billing data: {error}</div>
      )}

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
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Billing() {
  const { user } = useAuth();
  const customerPortalUrl = import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL;

  return (
    <div>
      <h1 className="dash-page-title">Billing</h1>
      <p className="dash-page-subtitle">Manage your subscription and billing details.</p>

      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Current Plan</div>
          <div className="dash-stat-value" style={{ fontSize: 18 }}>Free</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Billing Period</div>
          <div className="dash-stat-value" style={{ fontSize: 18 }}>—</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Next Invoice</div>
          <div className="dash-stat-value" style={{ fontSize: 18 }}>—</div>
        </div>
      </div>

      <div className="dash-empty">
        <div className="dash-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <h2 className="dash-empty-title">No active subscription</h2>
        <p className="dash-empty-text">
          Choose a plan to unlock the full Slancha platform. All plans include a guided onboarding with your existing workloads.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/pricing" className="btn-primary btn-lg">View Plans</Link>
          {customerPortalUrl && (
            <a
              href={customerPortalUrl}
              className="btn-secondary btn-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manage Billing
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Overview() {
  return (
    <div>
      <h1 className="dash-page-title">Overview</h1>
      <p className="dash-page-subtitle">Your Slancha workspace at a glance.</p>

      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">API Keys</div>
          <div className="dash-stat-value">0</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Requests (30d)</div>
          <div className="dash-stat-value">0</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Models Used</div>
          <div className="dash-stat-value">0</div>
        </div>
      </div>

      <div className="dash-empty">
        <div className="dash-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
          </svg>
        </div>
        <h2 className="dash-empty-title">Create your first API key</h2>
        <p className="dash-empty-text">
          Get started with the Slancha Router. Create an API key and start routing requests to the best model for each job.
        </p>
        <Link to="/dashboard/keys" className="btn-primary btn-lg">Create API Key</Link>
      </div>
    </div>
  );
}

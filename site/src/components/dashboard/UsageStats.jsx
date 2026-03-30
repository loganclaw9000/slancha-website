import React from 'react';

export default function UsageStats() {
  return (
    <div>
      <h1 className="dash-page-title">Usage</h1>
      <p className="dash-page-subtitle">Request volume and model distribution.</p>

      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Requests</div>
          <div className="dash-stat-value">0</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg Latency</div>
          <div className="dash-stat-value">—</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Models Used</div>
          <div className="dash-stat-value">0</div>
        </div>
      </div>

      <div className="dash-empty">
        <div className="dash-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h2 className="dash-empty-title">No usage data yet</h2>
        <p className="dash-empty-text">
          Start sending requests through the Slancha Router to see your usage metrics here.
        </p>
      </div>
    </div>
  );
}

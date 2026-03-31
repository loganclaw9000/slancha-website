import React from 'react';
import Onboarding from './Onboarding';

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

      <Onboarding />
    </div>
  );
}

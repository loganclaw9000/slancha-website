import React from 'react';
import { useUsageStats } from '../../hooks/useUsageStats';
import { useApiKeys } from '../../hooks/useApiKeys';
import Onboarding from './Onboarding';

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export default function Overview() {
  const { stats, loading: usageLoading } = useUsageStats('30d');
  const { keys, loading: keysLoading } = useApiKeys();

  const activeKeys = keys.filter(k => k.active).length;

  return (
    <div>
      <h1 className="dash-page-title">Overview</h1>
      <p className="dash-page-subtitle">Your Slancha workspace at a glance.</p>

      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">API Keys</div>
          <div className="dash-stat-value">
            {keysLoading ? '...' : activeKeys}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Requests (30d)</div>
          <div className="dash-stat-value">
            {usageLoading ? '...' : formatNumber(stats.totalRequests)}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Models Used</div>
          <div className="dash-stat-value">
            {usageLoading ? '...' : stats.modelsUsed}
          </div>
        </div>
      </div>

      <Onboarding />
    </div>
  );
}

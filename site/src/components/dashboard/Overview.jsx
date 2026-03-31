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
  const { stats, loading: usageLoading, isDemo } = useUsageStats('30d');
  const { keys, loading: keysLoading } = useApiKeys();

  const activeKeys = isDemo ? 3 : keys.filter(k => k.active).length;

  return (
    <div>
      <h1 className="dash-page-title">Overview</h1>
      <p className="dash-page-subtitle">Your Slancha workspace at a glance.</p>

      {isDemo && (
        <div className="usage-demo-banner" style={{ marginBottom: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          Demo data — connect Supabase to see your real metrics.
        </div>
      )}

      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">API Keys</div>
          <div className="dash-stat-value">
            {keysLoading && !isDemo ? '...' : activeKeys}
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
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg Latency</div>
          <div className="dash-stat-value">
            {usageLoading ? '...' : `${stats.avgLatency}ms`}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Cost (30d)</div>
          <div className="dash-stat-value">
            {usageLoading ? '...' : `$${stats.totalCost.toFixed(2)}`}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Error Rate</div>
          <div className="dash-stat-value">
            {usageLoading ? '...' : `${stats.errorRate}%`}
          </div>
        </div>
      </div>

      <Onboarding />
    </div>
  );
}

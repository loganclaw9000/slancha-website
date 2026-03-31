import React, { useState } from 'react';
import { useUsageStats } from '../../hooks/useUsageStats';

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function DailyChart({ daily }) {
  if (!daily.length) return null;
  const maxReqs = Math.max(...daily.map(d => d.requests), 1);

  return (
    <div className="usage-chart">
      <h3 className="usage-section-title">Daily Requests</h3>
      <div className="usage-bars">
        {daily.map(d => (
          <div key={d.date} className="usage-bar-col" title={`${d.date}: ${d.requests} requests`}>
            <div
              className="usage-bar"
              style={{ height: `${Math.max((d.requests / maxReqs) * 100, 2)}%` }}
            />
            <span className="usage-bar-label">
              {d.date.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelBreakdown({ byModel }) {
  if (!byModel.length) return null;
  const maxReqs = byModel[0]?.requests || 1;

  return (
    <div className="usage-section">
      <h3 className="usage-section-title">Model Distribution</h3>
      <div className="usage-model-list">
        {byModel.map(m => (
          <div key={m.model} className="usage-model-row">
            <div className="usage-model-info">
              <span className="usage-model-name">{m.model}</span>
              <span className="usage-model-count">{formatNumber(m.requests)} requests</span>
            </div>
            <div className="usage-model-bar-bg">
              <div
                className="usage-model-bar-fill"
                style={{ width: `${(m.requests / maxReqs) * 100}%` }}
              />
            </div>
            <div className="usage-model-meta">
              <span>{formatNumber(m.tokens)} tokens</span>
              <span>${(m.cost / 100).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EndpointTable({ byEndpoint }) {
  if (!byEndpoint.length) return null;

  return (
    <div className="usage-section">
      <h3 className="usage-section-title">Endpoints</h3>
      <table className="usage-table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Requests</th>
            <th>Avg Latency</th>
            <th>Error Rate</th>
          </tr>
        </thead>
        <tbody>
          {byEndpoint.map(e => (
            <tr key={e.endpoint}>
              <td><code>{e.endpoint}</code></td>
              <td>{formatNumber(e.requests)}</td>
              <td>{e.avg_latency}ms</td>
              <td className={parseFloat(e.error_rate) > 5 ? 'usage-error-high' : ''}>
                {e.error_rate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PERIODS = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

export default function UsageStats() {
  const [period, setPeriod] = useState('30d');
  const { stats, loading, error, isConnected } = useUsageStats(period);
  const hasData = stats.totalRequests > 0;

  return (
    <div>
      <div className="usage-header">
        <div>
          <h1 className="dash-page-title">Usage</h1>
          <p className="dash-page-subtitle">Request volume, cost, and model distribution.</p>
        </div>
        <div className="usage-period-selector">
          {PERIODS.map(p => (
            <button
              key={p.value}
              className={`usage-period-btn ${period === p.value ? 'active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="usage-error">
          Failed to load usage data: {error}
        </div>
      )}

      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Requests</div>
          <div className="dash-stat-value">
            {loading ? '...' : formatNumber(stats.totalRequests)}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg Latency</div>
          <div className="dash-stat-value">
            {loading ? '...' : stats.avgLatency > 0 ? `${stats.avgLatency}ms` : '—'}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Models Used</div>
          <div className="dash-stat-value">
            {loading ? '...' : stats.modelsUsed}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Tokens</div>
          <div className="dash-stat-value">
            {loading ? '...' : formatNumber(stats.totalTokens)}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Cost</div>
          <div className="dash-stat-value">
            {loading ? '...' : stats.totalCost > 0 ? `$${stats.totalCost.toFixed(2)}` : '$0.00'}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Error Rate</div>
          <div className="dash-stat-value">
            {loading ? '...' : `${stats.errorRate}%`}
          </div>
        </div>
      </div>

      {!loading && hasData && (
        <>
          <DailyChart daily={stats.daily} />
          <ModelBreakdown byModel={stats.byModel} />
          <EndpointTable byEndpoint={stats.byEndpoint} />
        </>
      )}

      {!loading && !hasData && (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h2 className="dash-empty-title">No usage data yet</h2>
          <p className="dash-empty-text">
            Start sending requests through the Slancha Router to see your usage metrics here.
            {!isConnected && (
              <span className="usage-local-note">
                <br/>Database not connected — usage will appear once Supabase is configured.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

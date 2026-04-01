import React, { useState } from 'react';
import { useDeployments } from '../../hooks/useDeployments';
import './Deployments.css';
import usePageMeta from '../../hooks/usePageMeta';

// Chart components for visualizations
function TrafficPieChart({ regionBreakdown, totalTraffic }) {
  if (!regionBreakdown || Object.keys(regionBreakdown).length === 0) {
    return (
      <div className="deploy-empty-chart">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
        </svg>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 8 }}>No traffic data</p>
      </div>
    );
  }

  const colors = ['#3b82f6', '#22c55e', '#a78bfa', '#f59e0b', '#ec4899', '#06b6d4'];
  let currentAngle = 0;
  const total = Object.values(regionBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          {Object.entries(regionBreakdown).map(([region, pct], i) => {
            const angle = (pct / total) * 360;
            const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            const largeArc = angle > 180 ? 1 : 0;
            const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
            currentAngle += angle;
            return <path key={region} d={pathData} fill={colors[i % colors.length]} />;
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Object.entries(regionBreakdown).map(([region, pct], i) => (
          <div key={region} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <div style={{ width: 10, height: 10, background: colors[i % colors], borderRadius: 2 }} />
            <span style={{ color: 'var(--text-secondary)' }}>{region}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UptimeHistoryGraph({ deployments }) {
  const latestDeployment = deployments[0];
  if (!latestDeployment) {
    return (
      <div className="deploy-empty-chart">
        <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>No uptime data</p>
      </div>
    );
  }

  // Generate mock 30-day uptime history
  const history = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    uptime: 99.5 + Math.random() * 0.49,
  }));

  const maxUptime = 100;
  const minUptime = 99;
  const chartHeight = 60;
  const chartWidth = 200;
  const padding = 5;

  const points = history
    .map((d, i) => {
      const x = padding + (i / (history.length - 1)) * (chartWidth - padding * 2);
      const y = padding + chartHeight - ((d.uptime - minUptime) / (maxUptime - minUptime)) * (chartHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
      <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
        {/* Area fill */}
        <path
          d={`M ${padding},${chartHeight - padding} ${points} L ${padding + (history.length - 1) * ((chartWidth - padding * 2) / (history.length - 1))},${chartHeight - padding} Z`}
          fill="url(#uptimeGradient)"
          opacity="0.2"
        />
        {/* Line */}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span>{latestDeployment.uptime}% uptime</span>
        <span>30-day avg</span>
      </div>
    </div>
  );
}

function LatencyTrendTable({ deployments }) {
  if (deployments.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', fontSize: 12, textAlign: 'center' }}>No latency data</p>;
  }

  return (
    <div className="deploy-latency-table">
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>P50</th>
            <th>P95</th>
            <th>P99</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {deployments.slice(0, 5).map((dep) => {
            const trendUp = dep.latency_p50 > 100;
            const trendDown = dep.latency_p50 < 100;
            return (
              <tr key={dep.id}>
                <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dep.model}</td>
                <td>{dep.latency_p50}ms</td>
                <td>{dep.latency_p95}ms</td>
                <td>{dep.latency_p99}ms</td>
                <td>
                  {trendUp && <span style={{ color: '#ef4444' }}>↑</span>}
                  {trendDown && <span style={{ color: '#22c55e' }}>↓</span>}
                  {!trendUp && !trendDown && <span style={{ color: 'var(--text-secondary)' }}>–</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const ACTIVE_DEPLOYMENTS = [
  {
    id: 'dep-018',
    model: 'gpt-4o-ft-slancha-v4',
    version: 'v4.2.1',
    status: 'healthy',
    traffic: 65,
    latencyP50: 142,
    latencyP99: 890,
    requestsPerMin: 1247,
    errorRate: 0.02,
    uptime: 99.98,
    region: 'us-east-1',
    replicas: 3,
    gpu: 'B200',
    deployedAt: '2026-03-31T08:00:00Z',
    source: 'auto-promote',
  },
  {
    id: 'dep-019',
    model: 'claude-sonnet-ft-v1',
    version: 'v1.0.3',
    status: 'healthy',
    traffic: 22,
    latencyP50: 210,
    latencyP99: 1100,
    requestsPerMin: 423,
    errorRate: 0.01,
    uptime: 99.99,
    region: 'us-east-1',
    replicas: 2,
    gpu: 'B200',
    deployedAt: '2026-03-30T23:15:00Z',
    source: 'auto-promote',
  },
  {
    id: 'dep-020',
    model: 'llama-3.3-70b-ft-v2',
    version: 'v2.0.0',
    status: 'canary',
    traffic: 8,
    canaryTarget: 25,
    canaryProgress: 32,
    latencyP50: 98,
    latencyP99: 420,
    requestsPerMin: 156,
    errorRate: 0.04,
    uptime: 99.95,
    region: 'us-east-1',
    replicas: 1,
    gpu: 'B300',
    deployedAt: '2026-03-31T10:30:00Z',
    source: 'canary-deploy',
  },
  {
    id: 'dep-017',
    model: 'mixtral-8x22b',
    version: 'v1.1.0',
    status: 'degraded',
    traffic: 5,
    latencyP50: 189,
    latencyP99: 2400,
    requestsPerMin: 89,
    errorRate: 1.2,
    uptime: 98.7,
    region: 'eu-west-1',
    replicas: 1,
    gpu: 'B200',
    deployedAt: '2026-03-29T14:00:00Z',
    source: 'manual',
    degradedReason: 'P99 latency above threshold (>2000ms)',
  },
];

const DEPLOYMENT_HISTORY = [
  { ts: '2026-03-31T10:30:00Z', model: 'llama-3.3-70b-ft-v2', action: 'canary', status: 'in-progress', duration: '—', details: 'Canary deploy at 8% traffic, target 25%' },
  { ts: '2026-03-31T08:00:00Z', model: 'gpt-4o-ft-slancha-v4', action: 'deploy', status: 'success', duration: '3m 12s', details: 'Auto-promoted after eval score 96.1%' },
  { ts: '2026-03-30T23:15:00Z', model: 'claude-sonnet-ft-v1', action: 'deploy', status: 'success', duration: '2m 48s', details: 'Auto-promoted after eval score 96.8%' },
  { ts: '2026-03-30T20:40:00Z', model: 'mixtral-ft-multilang-v1', action: 'rollback', status: 'rolled-back', duration: '45s', details: 'Below accuracy threshold (86.4% < 88.0%)' },
  { ts: '2026-03-30T18:00:00Z', model: 'gpt-4o-ft-slancha-v3', action: 'promote', status: 'success', duration: '1m 22s', details: 'Canary → full traffic after 2h stable' },
  { ts: '2026-03-30T12:34:00Z', model: 'gpt-4o-ft-slancha-v3', action: 'canary', status: 'success', duration: '2h 00m', details: 'Canary at 10% traffic, error rate within bounds' },
  { ts: '2026-03-30T10:00:00Z', model: 'llama-3.3-70b-ft-v1', action: 'scale', status: 'success', duration: '1m 05s', details: 'Scaled from 1 → 2 replicas (load trigger)' },
  { ts: '2026-03-29T22:00:00Z', model: 'gpt-4o-ft-slancha-v2', action: 'rollback', status: 'rolled-back', duration: '30s', details: 'Training failed OOM, reverted to v1' },
];

const PIPELINE_STAGES = [
  { label: 'Eval Passed', status: 'completed' },
  { label: 'Canary Deploy', status: 'active' },
  { label: 'Traffic Ramp', status: 'pending' },
  { label: 'Full Promotion', status: 'pending' },
  { label: 'Old Version Drain', status: 'pending' },
];

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function DeploymentCard({ dep }) {
  return (
    <div className="deploy-card">
      <div className="deploy-card-top">
        <span className="deploy-model-name">{dep.model}</span>
        <span className="deploy-version">{dep.version}</span>
      </div>

      <div className="deploy-status-line">
        <span className={`deploy-status-dot ${dep.status}`} />
        <span className={`deploy-status-text ${dep.status}`}>
          {dep.status === 'canary' ? 'Canary' : dep.status.charAt(0).toUpperCase() + dep.status.slice(1)}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 'auto' }}>
          {dep.region} · {dep.replicas} replica{dep.replicas !== 1 ? 's' : ''} · {dep.gpu_type}
        </span>
      </div>

      {dep.status === 'canary' && (
        <div className="deploy-canary-bar">
          <div className="deploy-canary-header">
            <span className="deploy-canary-label">Canary rollout</span>
            <span className="deploy-canary-pct">{dep.traffic_pct}% → {dep.canary_target_pct}%</span>
          </div>
          <div className="deploy-canary-track">
            <div className="deploy-canary-fill" style={{ width: `${dep.canary_progress_pct}%` }} />
          </div>
        </div>
      )}

      <div className="deploy-metrics-row">
        <div className="deploy-metric">
          <div className="deploy-metric-value">{dep.latency_p50}ms</div>
          <div className="deploy-metric-label">P50 Latency</div>
        </div>
        <div className="deploy-metric">
          <div className="deploy-metric-value">{dep.requests_per_min.toLocaleString()}</div>
          <div className="deploy-metric-label">Req/min</div>
        </div>
        <div className="deploy-metric">
          <div className="deploy-metric-value">{dep.error_rate}%</div>
          <div className="deploy-metric-label">Error Rate</div>
        </div>
      </div>

      <div className="deploy-traffic">
        <div className="deploy-traffic-label">
          <span>Traffic share</span>
          <span>{dep.traffic_pct}%</span>
        </div>
        <div className="deploy-traffic-bar">
          <div
            className={`deploy-traffic-fill ${dep.status === 'canary' ? 'canary' : ''}`}
            style={{ width: `${dep.traffic_pct}%` }}
          />
        </div>
      </div>

      <div className="deploy-card-actions">
        {dep.status === 'canary' && (
          <button className="deploy-btn primary">Promote to Full</button>
        )}
        {dep.status === 'rolling' && (
          <button className="deploy-btn primary">View Progress</button>
        )}
        <button className="deploy-btn">Scale</button>
        <button className="deploy-btn">View Logs</button>
        {dep.status !== 'canary' && (
          <button className="deploy-btn danger">Drain</button>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ entry }) {
  return (
    <div className="deploy-history-row">
      <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        {formatTime(entry.ts)}
      </span>
      <span className="deploy-history-model">{entry.model}</span>
      <span><span className={`deploy-history-action ${entry.action}`}>{entry.action}</span></span>
      <span className={`deploy-history-status ${entry.status}`}>{entry.status.replace('-', ' ')}</span>
      <span className="deploy-history-duration">{entry.duration}</span>
    </div>
  );
}

export default function Deployments() {
  usePageMeta({ title: 'Deployments', description: 'Manage your model deployments, endpoints, and deployment metrics.' });
  const { deployments, loading, stats, regionBreakdown, supabaseConfigured } = useDeployments();
  const [tab, setTab] = useState('active');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter deployments
  const filteredDeployments = deployments.filter((dep) => {
    if (regionFilter !== 'all' && dep.region !== regionFilter) return false;
    if (statusFilter !== 'all' && dep.status !== statusFilter) return false;
    return true;
  });

  // Get unique regions for filter
  const regions = [...new Set(deployments.map((d) => d.region))];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="dash-loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="deploy-header">
        <div>
          <h1 className="dash-page-title">Deployments</h1>
          <p className="dash-page-subtitle">Manage deployed models, traffic routing, and rollout strategy.</p>
        </div>
        <button className="btn-primary">New Deployment</button>
      </div>

      {/* Summary stats */}
      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Active Models</div>
          <div className="dash-stat-value">{stats.total}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Active</div>
          <div className="dash-stat-value" style={{ color: '#22c55e' }}>{stats.active}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Canary Rollouts</div>
          <div className="dash-stat-value" style={{ color: '#a78bfa' }}>{stats.canary}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg P50 Latency</div>
          <div className="dash-stat-value">{stats.avgLatencyP50}ms</div>
        </div>
      </div>

      {/* Filters and visualizations */}
      <div className="deploy-filters-row">
        <div className="deploy-filter-group">
          <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginRight: 8 }}>Region</label>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="dash-select"
            style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: 12 }}
          >
            <option value="all">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div className="deploy-filter-group">
          <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginRight: 8 }}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dash-select"
            style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: 12 }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="canary">Canary</option>
            <option value="rolling">Rolling</option>
          </select>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Traffic by Region</span>
          <TrafficPieChart regionBreakdown={regionBreakdown} totalTraffic={stats.totalTraffic} />
        </div>
      </div>

      {/* Uptime graph */}
      <div className="deploy-uptime-graph">
        <h3 style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Uptime History (30 days)</h3>
        <UptimeHistoryGraph deployments={deployments} />
      </div>

      {/* Current deploy pipeline */}
      <div className="deploy-pipeline">
        {PIPELINE_STAGES.map((stage, i) => (
          <React.Fragment key={stage.label}>
            <div className={`deploy-pipeline-stage ${stage.status}`}>
              {stage.status === 'completed' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
              {stage.status === 'active' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              )}
              {stage.label}
            </div>
            {i < PIPELINE_STAGES.length - 1 && <span className="deploy-pipeline-arrow">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Tabs */}
      <div className="deploy-tabs">
        <button className={`deploy-tab${tab === 'active' ? ' active' : ''}`} onClick={() => setTab('active')}>
          Active ({ACTIVE_DEPLOYMENTS.length})
        </button>
        <button className={`deploy-tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>
          History ({DEPLOYMENT_HISTORY.length})
        </button>
      </div>

      {/* Active tab */}
      {tab === 'active' && (
        <>
          <div className="deploy-latency-section">
            <h3 style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>Latency Metrics</h3>
            <LatencyTrendTable deployments={filteredDeployments} />
          </div>
          <div className="deploy-grid">
            {filteredDeployments.map(dep => (
              <DeploymentCard key={dep.id} dep={dep} />
            ))}
            {filteredDeployments.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 48, color: 'var(--text-secondary)' }}>
                No deployments found matching your filters
              </div>
            )}
          </div>
        </>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <div className="deploy-history">
          <div className="deploy-history-row header">
            <span>Time</span>
            <span>Model</span>
            <span>Action</span>
            <span>Status</span>
            <span>Duration</span>
          </div>
          {DEPLOYMENT_HISTORY.map((entry, i) => (
            <HistoryRow key={i} entry={entry} />
          ))}
        </div>
      )}

      {!supabaseConfigured && (
        <p className="usage-local-note" style={{ marginTop: 24, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', padding: '12px 16px', borderRadius: 8 }}>
          🔶 Demo data — connect Supabase to configure real deployments
        </p>
      )}
    </div>
  );
}

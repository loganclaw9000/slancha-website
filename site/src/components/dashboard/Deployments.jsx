import React, { useState } from 'react';
import './Deployments.css';
import usePageMeta from '../../hooks/usePageMeta';

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
          {dep.region} · {dep.replicas} replica{dep.replicas !== 1 ? 's' : ''} · {dep.gpu}
        </span>
      </div>

      {dep.status === 'canary' && (
        <div className="deploy-canary-bar">
          <div className="deploy-canary-header">
            <span className="deploy-canary-label">Canary rollout</span>
            <span className="deploy-canary-pct">{dep.traffic}% → {dep.canaryTarget}%</span>
          </div>
          <div className="deploy-canary-track">
            <div className="deploy-canary-fill" style={{ width: `${dep.canaryProgress}%` }} />
          </div>
        </div>
      )}

      <div className="deploy-metrics-row">
        <div className="deploy-metric">
          <div className="deploy-metric-value">{dep.latencyP50}ms</div>
          <div className="deploy-metric-label">P50 Latency</div>
        </div>
        <div className="deploy-metric">
          <div className="deploy-metric-value">{dep.requestsPerMin.toLocaleString()}</div>
          <div className="deploy-metric-label">Req/min</div>
        </div>
        <div className="deploy-metric">
          <div className="deploy-metric-value">{dep.errorRate}%</div>
          <div className="deploy-metric-label">Error Rate</div>
        </div>
      </div>

      <div className="deploy-traffic">
        <div className="deploy-traffic-label">
          <span>Traffic share</span>
          <span>{dep.traffic}%</span>
        </div>
        <div className="deploy-traffic-bar">
          <div
            className={`deploy-traffic-fill ${dep.status === 'canary' ? 'canary' : ''}`}
            style={{ width: `${dep.traffic}%` }}
          />
        </div>
      </div>

      {dep.degradedReason && (
        <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 12, padding: '6px 10px', background: 'rgba(245,158,11,0.08)', borderRadius: 6 }}>
          ⚠ {dep.degradedReason}
        </div>
      )}

      <div className="deploy-card-actions">
        {dep.status === 'canary' && (
          <button className="deploy-btn primary">Promote to Full</button>
        )}
        {dep.status === 'degraded' && (
          <button className="deploy-btn primary">Rollback</button>
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
  const [tab, setTab] = useState('active');

  const healthyCt = ACTIVE_DEPLOYMENTS.filter(d => d.status === 'healthy').length;
  const canaryCt = ACTIVE_DEPLOYMENTS.filter(d => d.status === 'canary').length;
  const totalTraffic = ACTIVE_DEPLOYMENTS.reduce((s, d) => s + d.traffic, 0);
  const avgLatency = Math.round(ACTIVE_DEPLOYMENTS.reduce((s, d) => s + d.latencyP50, 0) / ACTIVE_DEPLOYMENTS.length);

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
          <div className="dash-stat-value">{ACTIVE_DEPLOYMENTS.length}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Healthy</div>
          <div className="dash-stat-value" style={{ color: '#22c55e' }}>{healthyCt}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Canary Rollouts</div>
          <div className="dash-stat-value" style={{ color: '#a78bfa' }}>{canaryCt}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg P50 Latency</div>
          <div className="dash-stat-value">{avgLatency}ms</div>
        </div>
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
        <div className="deploy-grid">
          {ACTIVE_DEPLOYMENTS.map(dep => (
            <DeploymentCard key={dep.id} dep={dep} />
          ))}
        </div>
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

      <p className="usage-local-note" style={{ marginTop: 24 }}>
        Showing demo data. Deployments will populate once your models are promoted from fine-tuning.
      </p>
    </div>
  );
}

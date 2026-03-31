import React, { useState } from 'react';
import './Optimization.css';

const OPT_TECHNIQUES = [
  {
    id: 'qat',
    name: 'Quantization-Aware Training',
    short: 'QAT',
    status: 'active',
    models: [
      { name: 'llama-3.3-70b', precision: 'INT4', accuracy: 88.4, baseAccuracy: 88.7, speedup: '2.8x', memSaved: '62%', deployed: true },
      { name: 'mixtral-8x22b', precision: 'INT4', accuracy: 84.9, baseAccuracy: 85.3, speedup: '3.1x', memSaved: '65%', deployed: true },
      { name: 'gpt-4o-ft-v3', precision: 'INT8', accuracy: 97.5, baseAccuracy: 97.8, speedup: '1.9x', memSaved: '48%', deployed: true },
    ],
    totalSavings: '$1,240/mo',
    avgDegradation: '0.3%',
    description: 'Reduces model precision while maintaining accuracy through training-time calibration',
  },
  {
    id: 'mig',
    name: 'Multi-Instance GPU',
    short: 'MIG',
    status: 'active',
    partitions: [
      { gpu: 'B200 #1', slices: [
        { id: '1g.10gb', model: 'mixtral-8x22b', utilization: 87, requests: 3240 },
        { id: '2g.20gb', model: 'llama-3.3-70b', utilization: 92, requests: 7560 },
        { id: '4g.40gb', model: 'gpt-4o-ft-v3', utilization: 78, requests: 1440 },
      ]},
      { gpu: 'B200 #2', slices: [
        { id: '3g.30gb', model: 'claude-sonnet-ft-v1', utilization: 84, requests: 8920 },
        { id: '4g.40gb', model: 'gpt-4o', utilization: 91, requests: 12840 },
      ]},
    ],
    totalUtilization: '86%',
    costPerRequest: '$0.0018',
    description: 'Partitions GPUs into isolated instances for parallel multi-model serving',
  },
  {
    id: 'mtp',
    name: 'Multi-Token Prediction',
    short: 'MTP',
    status: 'active',
    models: [
      { name: 'llama-3.3-70b', tokensPerStep: 3, speedup: '2.4x', quality: 99.1, enabled: true },
      { name: 'mixtral-8x22b', tokensPerStep: 4, speedup: '2.9x', quality: 98.7, enabled: true },
      { name: 'gpt-4o-ft-v3', tokensPerStep: 2, speedup: '1.8x', quality: 99.6, enabled: true },
      { name: 'claude-sonnet-ft-v1', tokensPerStep: 1, speedup: '1.0x', quality: 100, enabled: false },
    ],
    avgSpeedup: '2.0x',
    avgQuality: '99.4%',
    description: 'Predicts multiple tokens per forward pass for faster generation without quality loss',
  },
];

const OPT_STATS = [
  { label: 'Inference Cost', value: '$0.0018', change: '-61% vs unoptimized' },
  { label: 'Avg Latency', value: '142ms', change: '-54% after QAT + MTP' },
  { label: 'GPU Utilization', value: '86%', change: '+34% with MIG' },
  { label: 'Quality Score', value: '99.4%', change: '<1% degradation' },
];

const OPT_TIMELINE = [
  { ts: '2026-03-31T11:00:00Z', event: 'QAT deployed', detail: 'gpt-4o-ft-v3 quantized to INT8 — 97.5% accuracy (0.3% loss), 1.9x speedup', type: 'qat' },
  { ts: '2026-03-31T09:30:00Z', event: 'MIG rebalanced', detail: 'B200 #2 repartitioned: claude-sonnet 3g.30gb → 3g.30gb, freed 1g slice', type: 'mig' },
  { ts: '2026-03-31T08:15:00Z', event: 'MTP enabled', detail: 'mixtral-8x22b: 4 tokens/step — 2.9x generation speedup, 98.7% quality retention', type: 'mtp' },
  { ts: '2026-03-31T06:00:00Z', event: 'QAT completed', detail: 'llama-3.3-70b INT4 calibration done — 88.4% vs 88.7% baseline, saving $480/mo', type: 'qat' },
  { ts: '2026-03-31T04:00:00Z', event: 'MIG partition created', detail: 'B200 #1 split into 1g + 2g + 4g for mixed-model serving', type: 'mig' },
  { ts: '2026-03-30T22:00:00Z', event: 'MTP calibrated', detail: 'llama-3.3-70b multi-token predictor trained — 3 tokens/step at 99.1% quality', type: 'mtp' },
];

function TechBadge({ type }) {
  const colors = { qat: '#8B5CF6', mig: '#3B82F6', mtp: '#22C55E' };
  const labels = { qat: 'QAT', mig: 'MIG', mtp: 'MTP' };
  return <span className="opt-tech-badge" style={{ background: `${colors[type]}20`, color: colors[type], borderColor: `${colors[type]}40` }}>{labels[type]}</span>;
}

function EventIcon({ type }) {
  if (type === 'qat') return <span className="opt-event-icon opt-event--qat">Q</span>;
  if (type === 'mig') return <span className="opt-event-icon opt-event--mig">M</span>;
  return <span className="opt-event-icon opt-event--mtp">T</span>;
}

function UtilBar({ pct }) {
  const color = pct > 90 ? '#22C55E' : pct > 70 ? '#3B82F6' : '#F59E0B';
  return (
    <div className="opt-util-bar">
      <div className="opt-util-fill" style={{ width: `${pct}%`, background: color }} />
      <span className="opt-util-label">{pct}%</span>
    </div>
  );
}

function QATDetail({ technique }) {
  return (
    <div className="opt-detail-section">
      <h4>Quantized Models</h4>
      <table className="opt-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Precision</th>
            <th>Accuracy</th>
            <th>Degradation</th>
            <th>Speedup</th>
            <th>Memory Saved</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {technique.models.map(m => (
            <tr key={m.name}>
              <td className="opt-cell-name">{m.name}</td>
              <td><span className="opt-precision-badge">{m.precision}</span></td>
              <td>{m.accuracy}%</td>
              <td className="opt-cell-degradation">-{(m.baseAccuracy - m.accuracy).toFixed(1)}%</td>
              <td className="opt-cell-speedup">{m.speedup}</td>
              <td>{m.memSaved}</td>
              <td>{m.deployed ? <span className="opt-deployed-badge">deployed</span> : <span className="opt-pending-badge">pending</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="opt-detail-stats">
        <div><span className="opt-detail-label">Monthly Savings</span><span className="opt-detail-value">{technique.totalSavings}</span></div>
        <div><span className="opt-detail-label">Avg Degradation</span><span className="opt-detail-value">{technique.avgDegradation}</span></div>
      </div>
    </div>
  );
}

function MIGDetail({ technique }) {
  return (
    <div className="opt-detail-section">
      <h4>GPU Partitions</h4>
      {technique.partitions.map(gpu => (
        <div key={gpu.gpu} className="opt-gpu-card">
          <div className="opt-gpu-header">
            <span className="opt-gpu-name">{gpu.gpu}</span>
            <span className="opt-gpu-slices">{gpu.slices.length} slices</span>
          </div>
          <div className="opt-gpu-slices-grid">
            {gpu.slices.map(s => (
              <div key={s.id} className="opt-slice">
                <div className="opt-slice-header">
                  <span className="opt-slice-id">{s.id}</span>
                  <span className="opt-slice-model">{s.model}</span>
                </div>
                <UtilBar pct={s.utilization} />
                <span className="opt-slice-requests">{s.requests.toLocaleString()} req/day</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="opt-detail-stats">
        <div><span className="opt-detail-label">Total Utilization</span><span className="opt-detail-value">{technique.totalUtilization}</span></div>
        <div><span className="opt-detail-label">Cost per Request</span><span className="opt-detail-value">{technique.costPerRequest}</span></div>
      </div>
    </div>
  );
}

function MTPDetail({ technique }) {
  return (
    <div className="opt-detail-section">
      <h4>Multi-Token Models</h4>
      <table className="opt-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Tokens/Step</th>
            <th>Speedup</th>
            <th>Quality</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {technique.models.map(m => (
            <tr key={m.name}>
              <td className="opt-cell-name">{m.name}</td>
              <td className="opt-cell-tokens">{m.tokensPerStep}</td>
              <td className="opt-cell-speedup">{m.speedup}</td>
              <td>{m.quality}%</td>
              <td>{m.enabled ? <span className="opt-deployed-badge">enabled</span> : <span className="opt-pending-badge">not compatible</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="opt-detail-stats">
        <div><span className="opt-detail-label">Avg Speedup</span><span className="opt-detail-value">{technique.avgSpeedup}</span></div>
        <div><span className="opt-detail-label">Avg Quality</span><span className="opt-detail-value">{technique.avgQuality}</span></div>
      </div>
    </div>
  );
}

export default function Optimization() {
  const [activeTab, setActiveTab] = useState('qat');
  const activeTechnique = OPT_TECHNIQUES.find(t => t.id === activeTab);

  return (
    <div className="opt-page">
      <div className="opt-header">
        <div>
          <h2>Inference Optimization</h2>
          <p className="opt-subtitle">QAT, MIG partitioning, and multi-token prediction — the final layer of the closed loop</p>
        </div>
        <button className="opt-run-btn">Run Optimization Sweep</button>
      </div>

      <div className="opt-stats-row">
        {OPT_STATS.map(s => (
          <div key={s.label} className="opt-stat-card">
            <span className="opt-stat-label">{s.label}</span>
            <span className="opt-stat-value">{s.value}</span>
            <span className="opt-stat-change">{s.change}</span>
          </div>
        ))}
      </div>

      <div className="opt-tabs">
        {OPT_TECHNIQUES.map(t => (
          <button
            key={t.id}
            className={`opt-tab ${activeTab === t.id ? 'opt-tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <TechBadge type={t.id} />
            <span className="opt-tab-name">{t.short}</span>
            <span className={`opt-tab-status opt-tab-status--${t.status}`}>{t.status}</span>
          </button>
        ))}
      </div>

      <div className="opt-content">
        <div className="opt-technique-header">
          <h3>{activeTechnique.name}</h3>
          <p className="opt-technique-desc">{activeTechnique.description}</p>
        </div>

        {activeTab === 'qat' && <QATDetail technique={activeTechnique} />}
        {activeTab === 'mig' && <MIGDetail technique={activeTechnique} />}
        {activeTab === 'mtp' && <MTPDetail technique={activeTechnique} />}
      </div>

      <div className="opt-timeline">
        <h3>Optimization Activity</h3>
        <div className="opt-timeline-list">
          {OPT_TIMELINE.map((e, i) => (
            <div key={i} className="opt-timeline-item">
              <EventIcon type={e.type} />
              <div className="opt-timeline-body">
                <div className="opt-timeline-header">
                  <span className="opt-timeline-event">{e.event}</span>
                  <TechBadge type={e.type} />
                  <span className="opt-timeline-ts">{new Date(e.ts).toLocaleString()}</span>
                </div>
                <p className="opt-timeline-detail">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

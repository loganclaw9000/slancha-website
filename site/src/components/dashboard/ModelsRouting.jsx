import React, { useState } from 'react';
import './ModelsRouting.css';

const MODELS = [
  { id: 'gpt-4o', name: 'gpt-4o', provider: 'OpenAI', status: 'active', latencyP50: 842, latencyP99: 2140, accuracy: 94.2, cost: 2.50, requests: 12840, routePct: 38, lastOptimized: '2h ago', tags: ['general', 'reasoning'] },
  { id: 'claude-sonnet', name: 'claude-sonnet-4', provider: 'Anthropic', status: 'active', latencyP50: 1180, latencyP99: 2890, accuracy: 96.1, cost: 3.00, requests: 8920, routePct: 26, lastOptimized: '4h ago', tags: ['analysis', 'code'] },
  { id: 'llama-3.3-70b', name: 'llama-3.3-70b', provider: 'Meta (self-hosted)', status: 'active', latencyP50: 234, latencyP99: 580, accuracy: 88.7, cost: 0.18, requests: 7560, routePct: 22, lastOptimized: '1h ago', tags: ['fast', 'simple'] },
  { id: 'mixtral-8x22b', name: 'mixtral-8x22b', provider: 'Mistral (self-hosted)', status: 'active', latencyP50: 198, latencyP99: 420, accuracy: 85.3, cost: 0.12, requests: 3240, routePct: 10, lastOptimized: '6h ago', tags: ['fast', 'multilingual'] },
  { id: 'gpt-4o-ft', name: 'gpt-4o-ft-slancha-v3', provider: 'OpenAI (fine-tuned)', status: 'optimizing', latencyP50: 780, latencyP99: 1650, accuracy: 97.8, cost: 3.80, requests: 1440, routePct: 4, lastOptimized: 'in progress', tags: ['fine-tuned', 'high-accuracy'] },
];

const OPTIMIZATION_LOG = [
  { ts: '2026-03-31T10:30:00Z', event: 'Route weight updated', detail: 'llama-3.3-70b: 20% → 22% (latency improvement after QAT)', type: 'route' },
  { ts: '2026-03-31T09:15:00Z', event: 'Fine-tune started', detail: 'gpt-4o-ft-slancha-v3 — 2,400 eval samples, targeting reasoning accuracy', type: 'finetune' },
  { ts: '2026-03-31T08:00:00Z', event: 'Model added to pool', detail: 'mixtral-8x22b activated for multilingual routing after eval pass (85.3% accuracy)', type: 'pool' },
  { ts: '2026-03-31T06:45:00Z', event: 'Cost optimization', detail: 'Shifted 8% of simple queries from gpt-4o to llama-3.3-70b — projected savings: $42/day', type: 'cost' },
  { ts: '2026-03-31T04:00:00Z', event: 'Accuracy threshold met', detail: 'claude-sonnet-4 promoted to code/analysis primary — 96.1% on eval set', type: 'accuracy' },
];

function StatusDot({ status }) {
  const cls = status === 'active' ? 'models-dot--active' : status === 'optimizing' ? 'models-dot--optimizing' : 'models-dot--inactive';
  return <span className={`models-dot ${cls}`} />;
}

function RoutingBar({ models }) {
  const colors = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899'];
  return (
    <div className="models-routing-bar">
      {models.map((m, i) => (
        <div
          key={m.id}
          className="models-routing-segment"
          style={{ width: `${m.routePct}%`, background: colors[i % colors.length] }}
          title={`${m.name}: ${m.routePct}%`}
        >
          {m.routePct >= 10 && <span className="models-routing-label">{m.routePct}%</span>}
        </div>
      ))}
    </div>
  );
}

function EventIcon({ type }) {
  if (type === 'route') return <span className="models-event-icon models-event--route">↻</span>;
  if (type === 'finetune') return <span className="models-event-icon models-event--finetune">⚡</span>;
  if (type === 'pool') return <span className="models-event-icon models-event--pool">+</span>;
  if (type === 'cost') return <span className="models-event-icon models-event--cost">$</span>;
  return <span className="models-event-icon models-event--accuracy">✓</span>;
}

export default function ModelsRouting() {
  const [selectedModel, setSelectedModel] = useState(null);
  const totalRequests = MODELS.reduce((s, m) => s + m.requests, 0);
  const avgLatency = Math.round(MODELS.reduce((s, m) => s + m.latencyP50 * m.requests, 0) / totalRequests);
  const avgCost = (MODELS.reduce((s, m) => s + m.cost * m.requests, 0) / totalRequests).toFixed(2);
  const weightedAccuracy = (MODELS.reduce((s, m) => s + m.accuracy * m.requests, 0) / totalRequests).toFixed(1);

  return (
    <div className="models-page">
      <h1 className="dash-page-title">Models & Routing</h1>
      <p className="dash-page-subtitle">Your active model pool, routing distribution, and auto-optimization status</p>

      {/* Summary stats */}
      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Active Models</div>
          <div className="dash-stat-value">{MODELS.filter(m => m.status === 'active').length}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg Latency (P50)</div>
          <div className="dash-stat-value">{avgLatency}ms</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Weighted Accuracy</div>
          <div className="dash-stat-value">{weightedAccuracy}%</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg Cost / 1K tok</div>
          <div className="dash-stat-value">${avgCost}</div>
        </div>
      </div>

      {/* Routing distribution */}
      <div className="models-section">
        <h2 className="models-section-title">Routing Distribution</h2>
        <p className="models-section-desc">How Slancha routes your requests across models — automatically optimized based on task type, latency, and cost.</p>
        <RoutingBar models={MODELS} />
        <div className="models-routing-legend">
          {MODELS.map((m, i) => {
            const colors = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899'];
            return (
              <span key={m.id} className="models-legend-item">
                <span className="models-legend-swatch" style={{ background: colors[i % colors.length] }} />
                {m.name} ({m.routePct}%)
              </span>
            );
          })}
        </div>
      </div>

      {/* Model pool table */}
      <div className="models-section">
        <h2 className="models-section-title">Model Pool</h2>
        <div className="models-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Status</th>
                <th>P50 Latency</th>
                <th>Accuracy</th>
                <th>Cost / 1K</th>
                <th>Requests (24h)</th>
                <th>Last Optimized</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map(m => (
                <tr
                  key={m.id}
                  className={`models-row ${selectedModel === m.id ? 'models-row--selected' : ''}`}
                  onClick={() => setSelectedModel(selectedModel === m.id ? null : m.id)}
                >
                  <td>
                    <div className="models-name-cell">
                      <code className="models-model-name">{m.name}</code>
                      <span className="models-provider">{m.provider}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`models-status-badge models-status--${m.status}`}>
                      <StatusDot status={m.status} /> {m.status}
                    </span>
                  </td>
                  <td>
                    <span className={`models-latency ${m.latencyP50 > 1000 ? 'models-latency--slow' : m.latencyP50 > 500 ? 'models-latency--medium' : 'models-latency--fast'}`}>
                      {m.latencyP50}ms
                    </span>
                  </td>
                  <td>
                    <span className={`models-accuracy ${m.accuracy >= 95 ? 'models-accuracy--high' : m.accuracy >= 90 ? 'models-accuracy--mid' : 'models-accuracy--low'}`}>
                      {m.accuracy}%
                    </span>
                  </td>
                  <td><code>${m.cost.toFixed(2)}</code></td>
                  <td>{m.requests.toLocaleString()}</td>
                  <td className="models-optimized">{m.lastOptimized}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expanded model detail */}
        {selectedModel && (() => {
          const m = MODELS.find(x => x.id === selectedModel);
          if (!m) return null;
          return (
            <div className="models-detail">
              <div className="models-detail-header">
                <h3>{m.name}</h3>
                <div className="models-detail-tags">
                  {m.tags.map(t => <span key={t} className="models-tag">{t}</span>)}
                </div>
              </div>
              <div className="models-detail-grid">
                <div className="models-detail-metric">
                  <span className="models-detail-label">P50 Latency</span>
                  <span className="models-detail-value">{m.latencyP50}ms</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">P99 Latency</span>
                  <span className="models-detail-value">{m.latencyP99}ms</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">Eval Accuracy</span>
                  <span className="models-detail-value">{m.accuracy}%</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">Cost / 1K tokens</span>
                  <span className="models-detail-value">${m.cost.toFixed(2)}</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">Route Share</span>
                  <span className="models-detail-value">{m.routePct}%</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">24h Requests</span>
                  <span className="models-detail-value">{m.requests.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Optimization log */}
      <div className="models-section">
        <h2 className="models-section-title">Auto-Optimization Log</h2>
        <p className="models-section-desc">Slancha continuously optimizes your routing, fine-tuning, and cost allocation.</p>
        <div className="models-opt-log">
          {OPTIMIZATION_LOG.map((entry, i) => {
            const d = new Date(entry.ts);
            const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            return (
              <div key={i} className="models-opt-entry">
                <EventIcon type={entry.type} />
                <div className="models-opt-content">
                  <div className="models-opt-event">{entry.event} <span className="models-opt-time">{time}</span></div>
                  <div className="models-opt-detail">{entry.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import './ModelsRouting.css';
import usePageMeta from '../../hooks/usePageMeta';
import { useModels } from '../../hooks/useModels';

function StatusDot({ status }) {
  const cls = status === 'active' ? 'models-dot--active' : status === 'testing' ? 'models-dot--optimizing' : 'models-dot--inactive';
  return <span className={`models-dot ${cls}`} />;
}

function RoutingBar({ models }) {
  const colors = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899'];
  const totalWeight = models.reduce((s, m) => s + m.routing_weight, 0) || 1;
  
  return (
    <div className="models-routing-bar">
      {models.map((m, i) => {
        const pct = (m.routing_weight / totalWeight) * 100;
        return (
          <div
            key={m.id}
            className="models-routing-segment"
            style={{ width: `${pct}%`, background: colors[i % colors.length] }}
            title={`${m.model_name}: ${m.routing_weight}%`}
          >
            {pct >= 10 && <span className="models-routing-label">{m.routing_weight}%</span>}
          </div>
        );
      })}
    </div>
  );
}

function LatencyHeatmap({ data }) {
  // data: [{ name, p50, p99, weight }]
  const maxP99 = Math.max(...data.map(d => d.p99), 1);
  
  return (
    <div className="models-heatmap">
      <h3 className="models-heatmap-title">Latency Heatmap</h3>
      <p className="models-heatmap-desc">P50 (green) → P99 (red) visualization across models</p>
      <div className="models-heatmap-grid">
        {data.map((m, i) => {
          const p50Percent = (m.p50 / maxP99) * 100;
          const p99Percent = (m.p99 / maxP99) * 100;
          const colors = ['#22C55E', '#F59E0B', '#EF4444'];
          const colorIdx = m.p50 > 1000 ? 2 : m.p50 > 500 ? 1 : 0;
          
          return (
            <div key={m.name} className="models-heatmap-row">
              <div className="models-heatmap-label">{m.name.split('-').slice(0, 2).join('-')}</div>
              <div className="models-heatmap-bar">
                <div
                  className="models-heatmap-segment models-heatmap--p50"
                  style={{ width: `${p50Percent}%` }}
                  title={`P50: ${m.p50}ms`}
                />
                <div
                  className="models-heatmap-segment models-heatmap--p99"
                  style={{ width: `${p99Percent - p50Percent}%`, marginLeft: `${p50Percent}%` }}
                  title={`P99: ${m.p99}ms`}
                />
              </div>
              <div className="models-heatmap-values">
                <span className="models-heatmap-value-p50">{m.p50}ms</span>
                <span className="models-heatmap-value-p99">→ {m.p99}ms</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CostComparison({ models }) {
  // models sorted by cost ascending
  const minCost = Math.min(...models.map(m => m.cost_per_1k), 0.01);
  const maxCost = Math.max(...models.map(m => m.cost_per_1k), 1);
  const range = maxCost - minCost || 1;
  
  return (
    <div className="models-cost-comparison">
      <h3 className="models-cost-title">Cost Comparison</h3>
      <p className="models-cost-desc">Cost per 1K tokens — sorted cheapest to most expensive</p>
      <div className="models-cost-bar">
        {models.map((m, i) => {
          const widthPercent = ((m.cost_per_1k - minCost) / range) * 100;
          const color = m.cost_per_1k > 2 ? '#EF4444' : m.cost_per_1k > 1 ? '#F59E0B' : '#22C55E';
          
          return (
            <div key={m.id} className="models-cost-row">
              <div className="models-cost-label">
                <code>{m.model_name.split('-').slice(0, 2).join('-')}</code>
                <span className="models-cost-provider">{m.provider}</span>
              </div>
              <div className="models-cost-bar-container">
                <div
                  className="models-cost-bar-segment"
                  style={{ width: `${widthPercent}%`, background: color }}
                  title={`$${m.cost_per_1k}/1K`}
                />
              </div>
              <div className="models-cost-value">${m.cost_per_1k.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
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

function EventBadge({ type }) {
  const badgeClass = `models-badge models-badge--${type}`;
  const label = {
    route: 'Routing',
    finetune: 'Fine-tune',
    pool: 'Pool',
    cost: 'Cost',
    accuracy: 'Accuracy',
  }[type] || type;
  
  return <span className={badgeClass}>{label}</span>;
}

export default function ModelsRouting() {
  usePageMeta({ title: 'Models & Routing', description: 'Monitor your active model pool, routing distribution, and auto-optimization events.' });
  const [selectedModel, setSelectedModel] = useState(null);
  
  const {
    models,
    optimizationEvents,
    loading,
    stats,
    latencyHeatmap,
    costComparison,
    updateRoutingWeight,
    updateStatus,
    deleteModel,
    addModel,
  } = useModels();
  
  // Handler for routing weight slider
  const handleWeightChange = async (modelId, newWeight) => {
    const result = await updateRoutingWeight(modelId, parseInt(newWeight, 10));
    if (result.error && import.meta.env.DEV) {
      console.error('Failed to update routing weight:', result.error);
    }
  };
  
  // Handler for status toggle
  const handleStatusToggle = async (model) => {
    const newStatus = model.status === 'active' ? 'testing' : 'active';
    const result = await updateStatus(model.id, newStatus);
    if (result.error && import.meta.env.DEV) {
      console.error('Failed to update status:', result.error);
    }
  };
  
  // Handler for delete
  const handleDelete = async (modelId) => {
    if (!window.confirm('Delete this model from the pool?')) return;
    const result = await deleteModel(modelId);
    if (result.error && import.meta.env.DEV) {
      console.error('Failed to delete model:', result.error);
    } else {
      if (selectedModel === modelId) setSelectedModel(null);
    }
  };
  
  if (loading) {
    return (
      <div className="models-page">
        <h1 className="dash-page-title">Models & Routing</h1>
        <div className="models-loading">Loading model pool...</div>
      </div>
    );
  }

  return (
    <div className="models-page">
      <h1 className="dash-page-title">Models & Routing</h1>
      <p className="dash-page-subtitle">Your active model pool, routing distribution, and auto-optimization status</p>

      {/* Summary stats */}
      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Active Models</div>
          <div className="dash-stat-value">{stats.active}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Testing</div>
          <div className="dash-stat-value">{stats.testing}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg Latency (P50)</div>
          <div className="dash-stat-value">{stats.avgLatencyP50}ms</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Weighted Accuracy</div>
          <div className="dash-stat-value">{stats.weightedAccuracy}%</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg Cost / 1K tok</div>
          <div className="dash-stat-value">${stats.avgCostPerK}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Requests (24h)</div>
          <div className="dash-stat-value">{stats.totalRequests.toLocaleString()}</div>
        </div>
      </div>

      {/* Routing distribution */}
      <div className="models-section">
        <h2 className="models-section-title">Routing Distribution</h2>
        <p className="models-section-desc">How Slancha routes your requests across models — automatically optimized based on task type, latency, and cost.</p>
        <RoutingBar models={models} />
        <div className="models-routing-legend">
          {models.map((m, i) => {
            const colors = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899'];
            return (
              <span key={m.id} className="models-legend-item">
                <span className="models-legend-swatch" style={{ background: colors[i % colors.length] }} />
                {m.model_name} ({m.routing_weight}%)
              </span>
            );
          })}
        </div>
      </div>

      {/* Latency heatmap visualization */}
      <LatencyHeatmap data={latencyHeatmap} />

      {/* Cost comparison visualization */}
      <CostComparison models={costComparison} />

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
                <th>P99 Latency</th>
                <th>Accuracy</th>
                <th>Cost / 1K</th>
                <th>Requests (24h)</th>
                <th>Route Weight</th>
                <th>Last Optimized</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map(m => (
                <tr
                  key={m.id}
                  className={`models-row ${selectedModel === m.id ? 'models-row--selected' : ''}`}
                  onClick={() => setSelectedModel(selectedModel === m.id ? null : m.id)}
                >
                  <td>
                    <div className="models-name-cell">
                      <code className="models-model-name">{m.model_name}</code>
                      <span className="models-provider">{m.provider}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`models-status-badge models-status--${m.status}`}>
                      <StatusDot status={m.status} /> {m.status}
                    </span>
                  </td>
                  <td>
                    <span className={`models-latency ${m.latency_avg > 1000 ? 'models-latency--slow' : m.latency_avg > 500 ? 'models-latency--medium' : 'models-latency--fast'}`}>
                      {m.latency_avg}ms
                    </span>
                  </td>
                  <td>
                    <span className="models-latency-p99">{Math.round(m.latency_avg * 2.5)}ms</span>
                  </td>
                  <td>
                    <span className={`models-accuracy ${m.accuracy_pct >= 95 ? 'models-accuracy--high' : m.accuracy_pct >= 90 ? 'models-accuracy--mid' : 'models-accuracy--low'}`}>
                      {m.accuracy_pct}%
                    </span>
                  </td>
                  <td><code>${m.cost_per_1k.toFixed(2)}</code></td>
                  <td>{m.requests_24h.toLocaleString()}</td>
                  <td>
                    <div className="models-weight-control">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={m.routing_weight}
                        onChange={(e) => handleWeightChange(m.id, e.target.value)}
                        className="models-weight-slider"
                      />
                      <span className="models-weight-value">{m.routing_weight}%</span>
                    </div>
                  </td>
                  <td className="models-optimized">
                    {m.last_optimized_at ? new Date(m.last_optimized_at).toLocaleString() : '—'}
                  </td>
                  <td className="models-actions">
                    <button
                      className="models-btn models-btn--status"
                      onClick={(e) => { e.stopPropagation(); handleStatusToggle(m); }}
                      title={`Toggle to ${m.status === 'active' ? 'testing' : 'active'}`}
                    >
                      {m.status === 'active' ? '⏳' : '✓'}
                    </button>
                    <button
                      className="models-btn models-btn--delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                      title="Delete model"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expanded model detail */}
        {selectedModel && (() => {
          const m = models.find(x => x.id === selectedModel);
          if (!m) return null;
          return (
            <div className="models-detail">
              <div className="models-detail-header">
                <h3>{m.model_name}</h3>
                <div className="models-detail-tags">
                  {(m.tags || []).map(t => <span key={t} className="models-tag">{t}</span>)}
                  <span className="models-tag models-tag--provider">{m.provider}</span>
                </div>
              </div>
              <div className="models-detail-grid">
                <div className="models-detail-metric">
                  <span className="models-detail-label">P50 Latency</span>
                  <span className="models-detail-value">{m.latency_avg}ms</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">P99 Latency</span>
                  <span className="models-detail-value">{Math.round(m.latency_avg * 2.5)}ms</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">Eval Accuracy</span>
                  <span className="models-detail-value">{m.accuracy_pct}%</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">Cost / 1K tokens</span>
                  <span className="models-detail-value">${m.cost_per_1k.toFixed(2)}</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">Route Weight</span>
                  <span className="models-detail-value">{m.routing_weight}%</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">24h Requests</span>
                  <span className="models-detail-value">{m.requests_24h.toLocaleString()}</span>
                </div>
                <div className="models-detail-metric">
                  <span className="models-detail-label">Provider Model ID</span>
                  <code className="models-detail-value">{m.provider_model_id}</code>
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
          {optimizationEvents.length === 0 ? (
            <div className="models-empty-state">No optimization events recorded yet.</div>
          ) : (
            optimizationEvents.map((entry, i) => {
              const d = new Date(entry.created_at);
              const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
              const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              return (
                <div key={entry.id} className="models-opt-entry">
                  <EventIcon type={entry.event_type} />
                  <div className="models-opt-content">
                    <div className="models-opt-header">
                      <span className="models-opt-event">{entry.event}</span>
                      <EventBadge type={entry.event_type} />
                      <span className="models-opt-time">{date} {time}</span>
                    </div>
                    <div className="models-opt-detail">{entry.description}</div>
                    {entry.improvement_pct && (
                      <div className="models-opt-improvement">
                        <span className="models-opt-improvement-label">↑ {entry.improvement_pct}% improvement</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import './RequestLogs.css';

// Demo data — realistic API request logs
const DEMO_LOGS = [
  { id: 'req_a1b2c3', ts: '2026-03-31T10:42:18Z', endpoint: '/v1/route', model: 'gpt-4o', latency: 847, tokens_in: 1240, tokens_out: 312, status: 200, cost: 0.0186 },
  { id: 'req_d4e5f6', ts: '2026-03-31T10:41:55Z', endpoint: '/v1/route', model: 'claude-sonnet-4-20250514', latency: 1203, tokens_in: 3420, tokens_out: 890, status: 200, cost: 0.0412 },
  { id: 'req_g7h8i9', ts: '2026-03-31T10:41:32Z', endpoint: '/v1/route', model: 'llama-3.3-70b', latency: 234, tokens_in: 180, tokens_out: 45, status: 200, cost: 0.0008 },
  { id: 'req_j0k1l2', ts: '2026-03-31T10:40:58Z', endpoint: '/v1/evaluate', model: 'gpt-4o', latency: 2140, tokens_in: 5200, tokens_out: 1800, status: 200, cost: 0.0710 },
  { id: 'req_m3n4o5', ts: '2026-03-31T10:40:12Z', endpoint: '/v1/route', model: 'mixtral-8x22b', latency: 189, tokens_in: 92, tokens_out: 28, status: 200, cost: 0.0003 },
  { id: 'req_p6q7r8', ts: '2026-03-31T10:39:44Z', endpoint: '/v1/route', model: 'gpt-4o', latency: 923, tokens_in: 1580, tokens_out: 420, status: 200, cost: 0.0224 },
  { id: 'req_s9t0u1', ts: '2026-03-31T10:39:01Z', endpoint: '/v1/route', model: 'claude-sonnet-4-20250514', latency: 1450, tokens_in: 4100, tokens_out: 1200, status: 200, cost: 0.0520 },
  { id: 'req_v2w3x4', ts: '2026-03-31T10:38:22Z', endpoint: '/v1/route', model: 'llama-3.3-70b', latency: 312, tokens_in: 560, tokens_out: 142, status: 200, cost: 0.0024 },
  { id: 'req_y5z6a7', ts: '2026-03-31T10:37:55Z', endpoint: '/v1/fine-tune', model: 'gpt-4o-ft', latency: 3200, tokens_in: 0, tokens_out: 0, status: 202, cost: 0.0000 },
  { id: 'req_b8c9d0', ts: '2026-03-31T10:37:10Z', endpoint: '/v1/route', model: 'gpt-4o', latency: 780, tokens_in: 980, tokens_out: 245, status: 200, cost: 0.0148 },
  { id: 'req_e1f2g3', ts: '2026-03-31T10:36:42Z', endpoint: '/v1/route', model: 'mixtral-8x22b', latency: 0, tokens_in: 120, tokens_out: 0, status: 429, cost: 0.0000 },
  { id: 'req_h4i5j6', ts: '2026-03-31T10:36:01Z', endpoint: '/v1/evaluate', model: 'claude-sonnet-4-20250514', latency: 1890, tokens_in: 2800, tokens_out: 650, status: 200, cost: 0.0345 },
  { id: 'req_k7l8m9', ts: '2026-03-31T10:35:18Z', endpoint: '/v1/route', model: 'llama-3.3-70b', latency: 198, tokens_in: 340, tokens_out: 88, status: 200, cost: 0.0014 },
  { id: 'req_n0o1p2', ts: '2026-03-31T10:34:44Z', endpoint: '/v1/route', model: 'gpt-4o', latency: 0, tokens_in: 1800, tokens_out: 0, status: 500, cost: 0.0000 },
  { id: 'req_q3r4s5', ts: '2026-03-31T10:34:02Z', endpoint: '/v1/route', model: 'claude-sonnet-4-20250514', latency: 1100, tokens_in: 2200, tokens_out: 580, status: 200, cost: 0.0278 },
  { id: 'req_t6u7v8', ts: '2026-03-31T10:33:21Z', endpoint: '/v1/deploy', model: 'gpt-4o-ft', latency: 450, tokens_in: 0, tokens_out: 0, status: 201, cost: 0.0000 },
  { id: 'req_w9x0y1', ts: '2026-03-31T10:32:55Z', endpoint: '/v1/route', model: 'gpt-4o', latency: 856, tokens_in: 1100, tokens_out: 290, status: 200, cost: 0.0168 },
  { id: 'req_z2a3b4', ts: '2026-03-31T10:32:10Z', endpoint: '/v1/route', model: 'mixtral-8x22b', latency: 210, tokens_in: 250, tokens_out: 72, status: 200, cost: 0.0010 },
  { id: 'req_c5d6e7', ts: '2026-03-31T10:31:33Z', endpoint: '/v1/route', model: 'llama-3.3-70b', latency: 278, tokens_in: 420, tokens_out: 105, status: 200, cost: 0.0018 },
  { id: 'req_f8g9h0', ts: '2026-03-31T10:30:48Z', endpoint: '/v1/route', model: 'claude-sonnet-4-20250514', latency: 1320, tokens_in: 3800, tokens_out: 920, status: 200, cost: 0.0468 },
];

const ENDPOINTS = ['All', '/v1/route', '/v1/evaluate', '/v1/fine-tune', '/v1/deploy'];
const STATUSES = ['All', '2xx', '4xx', '5xx'];

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function StatusBadge({ status }) {
  const cls = status >= 500 ? 'logs-status--error' : status >= 400 ? 'logs-status--warn' : status === 202 || status === 201 ? 'logs-status--accepted' : 'logs-status--ok';
  return <span className={`logs-status ${cls}`}>{status}</span>;
}

function LatencyCell({ ms, status }) {
  if (status >= 400) return <span className="logs-latency logs-latency--na">—</span>;
  const cls = ms > 2000 ? 'logs-latency--slow' : ms > 1000 ? 'logs-latency--medium' : 'logs-latency--fast';
  return <span className={`logs-latency ${cls}`}>{ms}ms</span>;
}

export default function RequestLogs() {
  const [endpointFilter, setEndpointFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    return DEMO_LOGS.filter(log => {
      if (endpointFilter !== 'All' && log.endpoint !== endpointFilter) return false;
      if (statusFilter === '2xx' && (log.status < 200 || log.status >= 300)) return false;
      if (statusFilter === '4xx' && (log.status < 400 || log.status >= 500)) return false;
      if (statusFilter === '5xx' && log.status < 500) return false;
      if (search && !log.id.includes(search) && !log.model.includes(search)) return false;
      return true;
    });
  }, [endpointFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const successful = DEMO_LOGS.filter(l => l.status >= 200 && l.status < 300);
    const avgLatency = successful.length ? Math.round(successful.reduce((s, l) => s + l.latency, 0) / successful.length) : 0;
    const totalCost = DEMO_LOGS.reduce((s, l) => s + l.cost, 0);
    const errorRate = ((DEMO_LOGS.filter(l => l.status >= 400).length / DEMO_LOGS.length) * 100).toFixed(1);
    return { total: DEMO_LOGS.length, avgLatency, totalCost, errorRate };
  }, []);

  return (
    <div className="logs-page">
      <div className="usage-header">
        <div>
          <h1 className="dash-page-title">Request Logs</h1>
          <p className="dash-page-subtitle">Monitor API requests in real-time</p>
        </div>
        <div className="logs-live-indicator">
          <span className="logs-live-dot" />
          <span>Live</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Requests</div>
          <div className="dash-stat-value">{stats.total}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Avg Latency</div>
          <div className="dash-stat-value">{stats.avgLatency}ms</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Error Rate</div>
          <div className="dash-stat-value">{stats.errorRate}%</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Cost</div>
          <div className="dash-stat-value">${stats.totalCost.toFixed(2)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="logs-filters">
        <div className="logs-filter-group">
          <label className="logs-filter-label">Endpoint</label>
          <div className="usage-period-selector">
            {ENDPOINTS.map(ep => (
              <button
                key={ep}
                className={`usage-period-btn${endpointFilter === ep ? ' active' : ''}`}
                onClick={() => setEndpointFilter(ep)}
              >
                {ep === 'All' ? 'All' : ep.replace('/v1/', '')}
              </button>
            ))}
          </div>
        </div>
        <div className="logs-filter-group">
          <label className="logs-filter-label">Status</label>
          <div className="usage-period-selector">
            {STATUSES.map(s => (
              <button
                key={s}
                className={`usage-period-btn${statusFilter === s ? ' active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="logs-filter-group logs-search-group">
          <label className="logs-filter-label">Search</label>
          <input
            type="text"
            className="logs-search"
            placeholder="Request ID or model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Log table */}
      <div className="logs-table-wrap">
        <table className="dash-table logs-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Request ID</th>
              <th>Endpoint</th>
              <th>Model</th>
              <th>Latency</th>
              <th>Tokens</th>
              <th>Status</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <React.Fragment key={log.id}>
                <tr
                  className={`logs-row${expandedId === log.id ? ' expanded' : ''}`}
                  onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                >
                  <td className="dash-table-mono">{formatTime(log.ts)}</td>
                  <td className="dash-table-mono">{log.id}</td>
                  <td><span className="logs-endpoint">{log.endpoint.replace('/v1/', '')}</span></td>
                  <td className="dash-table-mono logs-model">{log.model}</td>
                  <td><LatencyCell ms={log.latency} status={log.status} /></td>
                  <td className="dash-table-mono">{log.tokens_in + log.tokens_out > 0 ? `${log.tokens_in} / ${log.tokens_out}` : '—'}</td>
                  <td><StatusBadge status={log.status} /></td>
                  <td className="dash-table-mono">{log.cost > 0 ? `$${log.cost.toFixed(4)}` : '—'}</td>
                </tr>
                {expandedId === log.id && (
                  <tr className="logs-detail-row">
                    <td colSpan={8}>
                      <div className="logs-detail">
                        <div className="logs-detail-grid">
                          <div className="logs-detail-item">
                            <span className="logs-detail-label">Request ID</span>
                            <code>{log.id}</code>
                          </div>
                          <div className="logs-detail-item">
                            <span className="logs-detail-label">Timestamp</span>
                            <code>{log.ts}</code>
                          </div>
                          <div className="logs-detail-item">
                            <span className="logs-detail-label">Endpoint</span>
                            <code>{log.endpoint}</code>
                          </div>
                          <div className="logs-detail-item">
                            <span className="logs-detail-label">Model Selected</span>
                            <code>{log.model}</code>
                          </div>
                          <div className="logs-detail-item">
                            <span className="logs-detail-label">Input Tokens</span>
                            <code>{log.tokens_in.toLocaleString()}</code>
                          </div>
                          <div className="logs-detail-item">
                            <span className="logs-detail-label">Output Tokens</span>
                            <code>{log.tokens_out.toLocaleString()}</code>
                          </div>
                          <div className="logs-detail-item">
                            <span className="logs-detail-label">Latency</span>
                            <code>{log.latency}ms</code>
                          </div>
                          <div className="logs-detail-item">
                            <span className="logs-detail-label">Cost</span>
                            <code>${log.cost.toFixed(4)}</code>
                          </div>
                        </div>
                        {log.status >= 400 && (
                          <div className="logs-detail-error">
                            {log.status === 429 ? 'Rate limit exceeded — request was throttled and will be retried automatically.' : 'Internal server error — the upstream model provider returned an error. Slancha automatically retried with a fallback model.'}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="logs-empty">No requests match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="usage-local-note">Showing demo data. Connect your API key to see live request logs.</p>
    </div>
  );
}

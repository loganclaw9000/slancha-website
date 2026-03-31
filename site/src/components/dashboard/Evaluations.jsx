import React, { useState } from 'react';
import './Evaluations.css';
import usePageMeta from '../../hooks/usePageMeta';

const EVAL_RUNS = [
  { id: 'eval-089', name: 'Reasoning Accuracy v3', status: 'completed', dataset: 'reasoning-2k', samples: 2000, models: ['gpt-4o', 'claude-sonnet-4', 'llama-3.3-70b'], startedAt: '2026-03-31T10:00:00Z', duration: '12m 34s', avgScore: 91.4, bestModel: 'claude-sonnet-4', bestScore: 96.1, promoted: true },
  { id: 'eval-088', name: 'Code Generation Bench', status: 'completed', dataset: 'code-gen-500', samples: 500, models: ['gpt-4o', 'claude-sonnet-4', 'gpt-4o-ft-v3'], startedAt: '2026-03-31T08:15:00Z', duration: '8m 12s', avgScore: 87.3, bestModel: 'gpt-4o-ft-v3', bestScore: 97.8, promoted: true },
  { id: 'eval-087', name: 'Multilingual QA', status: 'completed', dataset: 'multi-qa-1k', samples: 1000, models: ['mixtral-8x22b', 'gpt-4o', 'llama-3.3-70b'], startedAt: '2026-03-31T06:00:00Z', duration: '15m 08s', avgScore: 83.6, bestModel: 'mixtral-8x22b', bestScore: 89.2, promoted: false },
  { id: 'eval-086', name: 'Summarization Quality', status: 'running', dataset: 'summ-3k', samples: 3000, models: ['gpt-4o', 'claude-sonnet-4', 'llama-3.3-70b', 'mixtral-8x22b'], startedAt: '2026-03-31T11:30:00Z', duration: null, avgScore: null, bestModel: null, bestScore: null, promoted: false, progress: 67 },
  { id: 'eval-085', name: 'Latency-Accuracy Tradeoff', status: 'completed', dataset: 'general-5k', samples: 5000, models: ['gpt-4o', 'llama-3.3-70b', 'mixtral-8x22b'], startedAt: '2026-03-30T22:00:00Z', duration: '28m 41s', avgScore: 88.9, bestModel: 'gpt-4o', bestScore: 94.2, promoted: true },
  { id: 'eval-084', name: 'Fine-Tune Candidate Selection', status: 'completed', dataset: 'ft-candidates-800', samples: 800, models: ['gpt-4o', 'gpt-4o-ft-v2', 'gpt-4o-ft-v3'], startedAt: '2026-03-30T18:30:00Z', duration: '6m 55s', avgScore: 93.1, bestModel: 'gpt-4o-ft-v3', bestScore: 97.2, promoted: true },
];

const EVAL_METRICS = [
  { label: 'Total Runs', value: '89', change: '+12 this week' },
  { label: 'Samples Evaluated', value: '142K', change: '+18K this week' },
  { label: 'Models Promoted', value: '14', change: '+3 this week' },
  { label: 'Avg Accuracy', value: '91.4%', change: '+2.1% vs last week' },
];

const MODEL_SCORES = [
  { model: 'gpt-4o-ft-v3', scores: [94.2, 95.1, 96.8, 97.2, 97.8], color: '#8B5CF6' },
  { model: 'claude-sonnet-4', scores: [93.0, 93.8, 94.5, 95.2, 96.1], color: '#3B82F6' },
  { model: 'gpt-4o', scores: [92.1, 92.4, 93.0, 93.5, 94.2], color: '#22C55E' },
  { model: 'llama-3.3-70b', scores: [84.2, 85.1, 86.3, 87.8, 88.7], color: '#F59E0B' },
  { model: 'mixtral-8x22b', scores: [81.5, 82.3, 83.1, 84.2, 85.3], color: '#EC4899' },
];

const DATASETS = [
  { name: 'reasoning-2k', samples: 2000, lastUsed: '2h ago', runsUsing: 12, categories: ['reasoning', 'logic'] },
  { name: 'code-gen-500', samples: 500, lastUsed: '4h ago', runsUsing: 8, categories: ['code', 'generation'] },
  { name: 'multi-qa-1k', samples: 1000, lastUsed: '6h ago', runsUsing: 6, categories: ['multilingual', 'qa'] },
  { name: 'summ-3k', samples: 3000, lastUsed: 'now', runsUsing: 15, categories: ['summarization'] },
  { name: 'general-5k', samples: 5000, lastUsed: '14h ago', runsUsing: 22, categories: ['general', 'benchmark'] },
  { name: 'ft-candidates-800', samples: 800, lastUsed: '18h ago', runsUsing: 4, categories: ['fine-tuning', 'selection'] },
];

function StatusBadge({ status }) {
  const cls = status === 'completed' ? 'eval-badge--completed' : status === 'running' ? 'eval-badge--running' : 'eval-badge--failed';
  return <span className={`eval-badge ${cls}`}>{status}</span>;
}

function PromotedBadge() {
  return <span className="eval-promoted-badge">promoted</span>;
}

function ScoreBar({ score, max = 100 }) {
  const pct = (score / max) * 100;
  const color = score >= 95 ? '#22C55E' : score >= 90 ? '#3B82F6' : score >= 85 ? '#F59E0B' : '#EF4444';
  return (
    <div className="eval-score-bar">
      <div className="eval-score-fill" style={{ width: `${pct}%`, background: color }} />
      <span className="eval-score-value">{score}%</span>
    </div>
  );
}

function MiniSparkline({ scores, color }) {
  const min = Math.min(...scores) - 2;
  const max = Math.max(...scores) + 2;
  const w = 80, h = 28;
  const points = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * w;
    const y = h - ((s - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="eval-sparkline">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(scores.length - 1) / (scores.length - 1) * w} cy={h - ((scores[scores.length - 1] - min) / (max - min)) * h} r="3" fill={color} />
    </svg>
  );
}

function ProgressRing({ progress }) {
  const r = 14, c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="eval-progress-ring">
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle cx="18" cy="18" r={r} fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 18 18)" />
      <text x="18" y="19" textAnchor="middle" dominantBaseline="middle" fill="var(--text-primary)" fontSize="9" fontWeight="700">{progress}%</text>
    </svg>
  );
}

export default function Evaluations() {
  usePageMeta({ title: 'Evaluations', description: 'View evaluation runs, model comparisons, and dataset management.' });
  const [selectedRun, setSelectedRun] = useState(null);
  const [tab, setTab] = useState('runs');

  const completedRuns = EVAL_RUNS.filter(r => r.status === 'completed');
  const runningRuns = EVAL_RUNS.filter(r => r.status === 'running');

  return (
    <div className="eval-page">
      <h1 className="dash-page-title">Evaluations</h1>
      <p className="dash-page-subtitle">Run evals against your model pool, compare accuracy, and auto-promote winners to production routing</p>

      {/* Summary stats */}
      <div className="dash-cards">
        {EVAL_METRICS.map(m => (
          <div className="dash-stat-card" key={m.label}>
            <div className="dash-stat-label">{m.label}</div>
            <div className="dash-stat-value">{m.value}</div>
            <div className="eval-stat-change">{m.change}</div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="eval-tabs">
        <button className={`eval-tab ${tab === 'runs' ? 'eval-tab--active' : ''}`} onClick={() => setTab('runs')}>Eval Runs</button>
        <button className={`eval-tab ${tab === 'compare' ? 'eval-tab--active' : ''}`} onClick={() => setTab('compare')}>Model Comparison</button>
        <button className={`eval-tab ${tab === 'datasets' ? 'eval-tab--active' : ''}`} onClick={() => setTab('datasets')}>Datasets</button>
      </div>

      {tab === 'runs' && (
        <>
          {/* Running evals */}
          {runningRuns.length > 0 && (
            <div className="eval-section">
              <div className="eval-section-title">In Progress</div>
              {runningRuns.map(run => (
                <div className="eval-running-card" key={run.id}>
                  <div className="eval-running-left">
                    <ProgressRing progress={run.progress} />
                    <div>
                      <div className="eval-run-name">{run.name}</div>
                      <div className="eval-run-meta">{run.dataset} · {run.samples.toLocaleString()} samples · {run.models.length} models</div>
                    </div>
                  </div>
                  <StatusBadge status={run.status} />
                </div>
              ))}
            </div>
          )}

          {/* Completed runs */}
          <div className="eval-section">
            <div className="eval-section-title">Recent Runs</div>
            <div className="eval-section-desc">Click a run to see detailed model-by-model results</div>
            <div className="eval-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Run</th>
                    <th>Dataset</th>
                    <th>Models</th>
                    <th>Best Score</th>
                    <th>Winner</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedRuns.map(run => (
                    <tr
                      key={run.id}
                      className={`eval-row ${selectedRun === run.id ? 'eval-row--selected' : ''}`}
                      onClick={() => setSelectedRun(selectedRun === run.id ? null : run.id)}
                    >
                      <td>
                        <div className="eval-run-name-cell">
                          <span className="eval-run-id">{run.id}</span>
                          <span className="eval-run-title">{run.name}</span>
                        </div>
                      </td>
                      <td><code className="eval-dataset-code">{run.dataset}</code></td>
                      <td>{run.models.length}</td>
                      <td><ScoreBar score={run.bestScore} /></td>
                      <td>
                        <span className="eval-winner">{run.bestModel}</span>
                        {run.promoted && <PromotedBadge />}
                      </td>
                      <td className="eval-duration">{run.duration}</td>
                      <td><StatusBadge status={run.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedRun && (() => {
              const run = EVAL_RUNS.find(r => r.id === selectedRun);
              if (!run) return null;
              return (
                <div className="eval-detail">
                  <div className="eval-detail-header">
                    <div>
                      <h3>{run.name}</h3>
                      <span className="eval-detail-id">{run.id} · {run.dataset} · {run.samples.toLocaleString()} samples</span>
                    </div>
                    {run.promoted && <div className="eval-detail-promoted">Winner auto-promoted to routing</div>}
                  </div>
                  <div className="eval-detail-grid">
                    {run.models.map((model, i) => {
                      const isWinner = model === run.bestModel;
                      const score = isWinner ? run.bestScore : run.avgScore - (i * 2.3) + Math.random() * 3;
                      return (
                        <div className={`eval-model-card ${isWinner ? 'eval-model-card--winner' : ''}`} key={model}>
                          {isWinner && <div className="eval-winner-crown">Best</div>}
                          <div className="eval-model-card-name">{model}</div>
                          <div className="eval-model-card-score">{isWinner ? run.bestScore : score.toFixed(1)}%</div>
                          <ScoreBar score={isWinner ? run.bestScore : parseFloat(score.toFixed(1))} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}

      {tab === 'compare' && (
        <div className="eval-section">
          <div className="eval-section-title">Model Accuracy Over Time</div>
          <div className="eval-section-desc">Last 5 eval runs — higher is better. Models improving through fine-tuning show steeper curves.</div>
          <div className="eval-compare-table">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Current Score</th>
                  <th>Trend (5 runs)</th>
                  <th>Improvement</th>
                  <th>Evals Run</th>
                </tr>
              </thead>
              <tbody>
                {MODEL_SCORES.map(m => {
                  const improvement = (m.scores[m.scores.length - 1] - m.scores[0]).toFixed(1);
                  return (
                    <tr key={m.model}>
                      <td>
                        <div className="eval-compare-name">
                          <span className="eval-compare-swatch" style={{ background: m.color }} />
                          <code>{m.model}</code>
                        </div>
                      </td>
                      <td><ScoreBar score={m.scores[m.scores.length - 1]} /></td>
                      <td><MiniSparkline scores={m.scores} color={m.color} /></td>
                      <td className="eval-improvement">+{improvement}%</td>
                      <td>{Math.floor(Math.random() * 20) + 10}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="eval-insight-card">
            <div className="eval-insight-icon">💡</div>
            <div>
              <div className="eval-insight-title">Optimization Insight</div>
              <div className="eval-insight-text">
                <strong>gpt-4o-ft-v3</strong> has surpassed the base gpt-4o by 3.6% through 3 rounds of eval-driven fine-tuning.
                The auto-promote threshold (95%) has been met — this model now handles 4% of production traffic and climbing.
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'datasets' && (
        <div className="eval-section">
          <div className="eval-section-title">Evaluation Datasets</div>
          <div className="eval-section-desc">Datasets used across eval runs. Upload new datasets or create them from production traffic.</div>
          <div className="eval-datasets-grid">
            {DATASETS.map(ds => (
              <div className="eval-dataset-card" key={ds.name}>
                <div className="eval-dataset-header">
                  <code className="eval-dataset-name">{ds.name}</code>
                  <span className="eval-dataset-count">{ds.samples.toLocaleString()} samples</span>
                </div>
                <div className="eval-dataset-meta">
                  <span>Used in {ds.runsUsing} runs</span>
                  <span>Last used: {ds.lastUsed}</span>
                </div>
                <div className="eval-dataset-tags">
                  {ds.categories.map(c => (
                    <span className="eval-dataset-tag" key={c}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="eval-upload-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Dataset
          </button>
        </div>
      )}
    </div>
  );
}

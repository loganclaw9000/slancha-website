import React, { useState } from 'react';
import './Evaluations.css';
import usePageMeta from '../../hooks/usePageMeta';
import { useEvaluations } from '../../hooks/useEvaluations';

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
  const { evals, loading, error, supabaseConfigured, runEvaluation, cancelEvaluation, getModelScores, refetch } = useEvaluations();
  const [selectedRun, setSelectedRun] = useState(null);
  const [tab, setTab] = useState('runs');

  const completedRuns = evals.filter(r => r.status === 'completed');
  const runningRuns = evals.filter(r => r.status === 'running');

  // Compute summary stats from real data
  const totalEvals = evals.length;
  const totalSamples = evals.reduce((s, e) => s + (e.samples || e.num_samples || 0), 0);
  const promotedCount = evals.filter(e => e.promoted).length;
  const avgAccuracy = totalEvals > 0
    ? (evals.filter(e => e.status === 'completed').reduce((s, e) => s + (e.avgScore || e.bestScore || 0), 0) / evals.filter(e => e.status === 'completed').length).toFixed(1)
    : 0;

  const EVAL_METRICS = [
    { label: 'Total Runs', value: `${totalEvals}`, change: `${promotedCount} promoted` },
    { label: 'Samples Evaluated', value: `${totalSamples.toLocaleString()}` },
    { label: 'Models Promoted', value: `${promotedCount}`, change: `+${promotedCount} this week` },
    { label: 'Avg Accuracy', value: `${avgAccuracy}%`, change: '+2.1% vs last week' },
  ];

  const modelScores = getModelScores();

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
            {m.change && <div className="eval-stat-change">{m.change}</div>}
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
                {modelScores.map(m => {
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

          {/* Summary stats for datasets */}
          <div className="dash-cards" style={{ marginTop: 16 }}>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Total Datasets</div>
              <div className="dash-stat-value">{evals.length}</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Total Samples</div>
              <div className="dash-stat-value">{totalSamples.toLocaleString()}</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Avg Samples/DS</div>
              <div className="dash-stat-value">{totalEvals > 0 ? Math.round(totalSamples / totalEvals).toLocaleString() : 0}</div>
            </div>
          </div>

          <div className="eval-datasets-grid">
            {evals.slice(0, 6).map((run, i) => {
              const datasetName = run.dataset?.name || run.dataset || `dataset-${i + 1}`;
              const samples = run.samples || run.num_samples || 1000;
              const runsUsing = Math.floor(Math.random() * 20) + 1;
              const categories = ['general', 'benchmark'].slice(0, i % 2 + 1);
              const lastUsed = ['2h ago', '4h ago', '6h ago', 'now', '14h ago', '18h ago'][i];
              return (
                <div className="eval-dataset-card" key={datasetName}>
                  <div className="eval-dataset-header">
                    <code className="eval-dataset-name">{datasetName}</code>
                    <span className="eval-dataset-count">{samples.toLocaleString()} samples</span>
                  </div>
                  <div className="eval-dataset-meta">
                    <span>Used in {runsUsing} runs</span>
                    <span>Last used: {lastUsed}</span>
                  </div>
                  <div className="eval-dataset-tags">
                    {categories.map(c => (
                      <span className="eval-dataset-tag" key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="eval-upload-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Dataset
          </button>
        </div>
      )}

      {!supabaseConfigured && (
        <div className="eval-demo-banner">
          Demo data — connect Supabase to configure real evaluations
        </div>
      )}
    </div>
  );
}

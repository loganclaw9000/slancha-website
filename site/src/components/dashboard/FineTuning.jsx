import React, { useState } from 'react';
import './FineTuning.css';
import usePageMeta from '../../hooks/usePageMeta';

const FT_JOBS = [
  { id: 'ft-047', name: 'gpt-4o-ft-slancha-v4', baseModel: 'gpt-4o', status: 'training', progress: 72, epochs: { current: 3, total: 4 }, samples: 2400, dataset: 'reasoning-2k + code-gen-500', startedAt: '2026-03-31T09:15:00Z', eta: '~28 min', loss: [0.84, 0.62, 0.41, 0.33], accuracy: [89.2, 92.1, 94.8, 96.1], autoPromote: true, threshold: 95.0 },
  { id: 'ft-046', name: 'llama-3.3-70b-ft-v2', baseModel: 'llama-3.3-70b', status: 'completed', progress: 100, epochs: { current: 5, total: 5 }, samples: 1800, dataset: 'multi-qa-1k + general-5k', startedAt: '2026-03-31T04:00:00Z', completedAt: '2026-03-31T06:22:00Z', duration: '2h 22m', loss: [1.12, 0.78, 0.54, 0.38, 0.31], accuracy: [81.4, 85.2, 88.1, 90.3, 91.7], autoPromote: true, threshold: 90.0, promoted: true, evalScore: 91.7 },
  { id: 'ft-045', name: 'claude-sonnet-ft-v1', baseModel: 'claude-sonnet-4', status: 'completed', progress: 100, epochs: { current: 3, total: 3 }, samples: 800, dataset: 'code-gen-500', startedAt: '2026-03-30T22:00:00Z', completedAt: '2026-03-30T23:15:00Z', duration: '1h 15m', loss: [0.92, 0.55, 0.34], accuracy: [91.0, 94.5, 96.8], autoPromote: true, threshold: 95.0, promoted: true, evalScore: 96.8 },
  { id: 'ft-044', name: 'mixtral-ft-multilang-v1', baseModel: 'mixtral-8x22b', status: 'completed', progress: 100, epochs: { current: 4, total: 4 }, samples: 1200, dataset: 'multi-qa-1k', startedAt: '2026-03-30T18:00:00Z', completedAt: '2026-03-30T20:40:00Z', duration: '2h 40m', loss: [1.24, 0.88, 0.61, 0.48], accuracy: [78.3, 82.1, 84.9, 86.4], autoPromote: false, threshold: 88.0, promoted: false, evalScore: 86.4 },
  { id: 'ft-043', name: 'gpt-4o-ft-slancha-v3', baseModel: 'gpt-4o', status: 'completed', progress: 100, epochs: { current: 4, total: 4 }, samples: 2000, dataset: 'reasoning-2k', startedAt: '2026-03-30T10:00:00Z', completedAt: '2026-03-30T12:34:00Z', duration: '2h 34m', loss: [0.91, 0.64, 0.42, 0.29], accuracy: [88.5, 92.4, 95.6, 97.8], autoPromote: true, threshold: 95.0, promoted: true, evalScore: 97.8 },
  { id: 'ft-042', name: 'gpt-4o-ft-slancha-v2', baseModel: 'gpt-4o', status: 'failed', progress: 45, epochs: { current: 2, total: 5 }, samples: 3000, dataset: 'general-5k', startedAt: '2026-03-29T20:00:00Z', failedAt: '2026-03-29T21:45:00Z', error: 'OOM: GPU memory exceeded during gradient accumulation', loss: [0.98, 0.71], accuracy: [86.1, 89.3], autoPromote: false },
];

const FT_METRICS = [
  { label: 'Active Jobs', value: '1', change: 'gpt-4o v4 training' },
  { label: 'Models Promoted', value: '4', change: '+1 this week' },
  { label: 'Best Accuracy', value: '97.8%', change: 'gpt-4o-ft-v3' },
  { label: 'Avg Training Time', value: '2h 10m', change: '-18% vs last batch' },
];

function StatusBadge({ status }) {
  const cls = status === 'completed' ? 'ft-badge--completed' : status === 'training' ? 'ft-badge--training' : 'ft-badge--failed';
  return <span className={`ft-badge ${cls}`}>{status}</span>;
}

function PromotedBadge({ promoted, threshold, evalScore }) {
  if (promoted) return <span className="ft-promoted-badge">promoted ({evalScore}% &ge; {threshold}%)</span>;
  if (evalScore && evalScore < threshold) return <span className="ft-not-promoted-badge">below threshold ({evalScore}% &lt; {threshold}%)</span>;
  return null;
}

function LossCurve({ loss, color = '#3B82F6' }) {
  const w = 120, h = 36;
  const max = Math.max(...loss) * 1.1;
  const min = 0;
  const points = loss.map((v, i) => {
    const x = loss.length === 1 ? w / 2 : (i / (loss.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="ft-loss-curve">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((loss[loss.length - 1] - min) / (max - min)) * h} r="3" fill={color} />
    </svg>
  );
}

function AccuracyCurve({ accuracy, threshold, color = '#22C55E' }) {
  const w = 120, h = 36;
  const min = Math.min(...accuracy, threshold) - 5;
  const max = 100;
  const points = accuracy.map((v, i) => {
    const x = accuracy.length === 1 ? w / 2 : (i / (accuracy.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(' ');
  const threshY = h - ((threshold - min) / (max - min)) * h;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="ft-accuracy-curve">
      <line x1="0" y1={threshY} x2={w} y2={threshY} stroke="rgba(245,158,11,0.4)" strokeWidth="1" strokeDasharray="4,3" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((accuracy[accuracy.length - 1] - min) / (max - min)) * h} r="3" fill={color} />
    </svg>
  );
}

function ProgressBar({ progress, status }) {
  const color = status === 'failed' ? '#EF4444' : status === 'training' ? '#3B82F6' : '#22C55E';
  return (
    <div className="ft-progress-bar">
      <div className="ft-progress-fill" style={{ width: `${progress}%`, background: color }} />
    </div>
  );
}

function TrainingDetail({ job }) {
  return (
    <div className="ft-detail">
      <div className="ft-detail-grid">
        <div className="ft-detail-section">
          <h4>Training Loss</h4>
          <div className="ft-chart-container">
            <LossCurve loss={job.loss} color="#EF4444" />
            <div className="ft-chart-labels">
              <span>Start: {job.loss[0].toFixed(2)}</span>
              <span>Final: {job.loss[job.loss.length - 1].toFixed(2)}</span>
              <span className="ft-chart-delta">-{((1 - job.loss[job.loss.length - 1] / job.loss[0]) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
        <div className="ft-detail-section">
          <h4>Accuracy</h4>
          <div className="ft-chart-container">
            <AccuracyCurve accuracy={job.accuracy} threshold={job.threshold || 90} />
            <div className="ft-chart-labels">
              <span>Start: {job.accuracy[0]}%</span>
              <span>Final: {job.accuracy[job.accuracy.length - 1]}%</span>
              <span className="ft-chart-delta">+{(job.accuracy[job.accuracy.length - 1] - job.accuracy[0]).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        <div className="ft-detail-section">
          <h4>Configuration</h4>
          <div className="ft-config-list">
            <div className="ft-config-row"><span>Base Model</span><span>{job.baseModel}</span></div>
            <div className="ft-config-row"><span>Dataset</span><span>{job.dataset}</span></div>
            <div className="ft-config-row"><span>Samples</span><span>{job.samples.toLocaleString()}</span></div>
            <div className="ft-config-row"><span>Epochs</span><span>{job.epochs.current} / {job.epochs.total}</span></div>
            <div className="ft-config-row"><span>Auto-Promote</span><span>{job.autoPromote ? `Yes (threshold: ${job.threshold}%)` : 'No'}</span></div>
          </div>
        </div>
        <div className="ft-detail-section">
          <h4>Timeline</h4>
          <div className="ft-config-list">
            <div className="ft-config-row"><span>Started</span><span>{new Date(job.startedAt).toLocaleString()}</span></div>
            {job.completedAt && <div className="ft-config-row"><span>Completed</span><span>{new Date(job.completedAt).toLocaleString()}</span></div>}
            {job.failedAt && <div className="ft-config-row"><span>Failed</span><span>{new Date(job.failedAt).toLocaleString()}</span></div>}
            {job.duration && <div className="ft-config-row"><span>Duration</span><span>{job.duration}</span></div>}
            {job.eta && <div className="ft-config-row"><span>ETA</span><span>{job.eta}</span></div>}
            {job.error && <div className="ft-config-row ft-error-row"><span>Error</span><span>{job.error}</span></div>}
          </div>
        </div>
      </div>
      {job.status === 'completed' && job.autoPromote && (
        <div className={`ft-promote-banner ${job.promoted ? 'ft-promote-banner--success' : 'ft-promote-banner--below'}`}>
          {job.promoted
            ? <>Model auto-promoted to routing pool — eval score {job.evalScore}% exceeded threshold {job.threshold}%</>
            : <>Model did not meet promotion threshold — eval score {job.evalScore}% &lt; {job.threshold}%</>
          }
        </div>
      )}
    </div>
  );
}

export default function FineTuning() {
  usePageMeta({ title: 'Fine-Tuning', description: 'Monitor fine-tuning jobs, training metrics, and auto-promoted models.' });
  const [expandedId, setExpandedId] = useState(null);
  const [tab, setTab] = useState('jobs');

  const trainingJob = FT_JOBS.find(j => j.status === 'training');

  return (
    <div className="ft-page">
      <div className="ft-header">
        <div>
          <h2>Fine-Tuning</h2>
          <p className="ft-subtitle">Eval-driven fine-tuning with auto-promote to routing pool</p>
        </div>
        <button className="ft-new-btn">+ New Fine-Tune Job</button>
      </div>

      <div className="ft-stats-row">
        {FT_METRICS.map(m => (
          <div key={m.label} className="ft-stat-card">
            <div className="ft-stat-label">{m.label}</div>
            <div className="ft-stat-value">{m.value}</div>
            <div className="ft-stat-change">{m.change}</div>
          </div>
        ))}
      </div>

      {trainingJob && (
        <div className="ft-active-training">
          <div className="ft-active-left">
            <div className="ft-active-pulse" />
            <div>
              <div className="ft-active-name">{trainingJob.name}</div>
              <div className="ft-active-detail">Epoch {trainingJob.epochs.current}/{trainingJob.epochs.total} &middot; {trainingJob.samples.toLocaleString()} samples &middot; ETA {trainingJob.eta}</div>
            </div>
          </div>
          <div className="ft-active-right">
            <div className="ft-active-metrics">
              <span>Loss: {trainingJob.loss[trainingJob.loss.length - 1].toFixed(2)}</span>
              <span>Accuracy: {trainingJob.accuracy[trainingJob.accuracy.length - 1]}%</span>
            </div>
            <ProgressBar progress={trainingJob.progress} status="training" />
            <span className="ft-active-pct">{trainingJob.progress}%</span>
          </div>
        </div>
      )}

      <div className="ft-tabs">
        <button className={`ft-tab${tab === 'jobs' ? ' ft-tab--active' : ''}`} onClick={() => setTab('jobs')}>All Jobs</button>
        <button className={`ft-tab${tab === 'promoted' ? ' ft-tab--active' : ''}`} onClick={() => setTab('promoted')}>Promoted Models</button>
        <button className={`ft-tab${tab === 'config' ? ' ft-tab--active' : ''}`} onClick={() => setTab('config')}>Auto-Promote Config</button>
      </div>

      {tab === 'jobs' && (
        <div className="ft-section">
          <div className="ft-table">
            <div className="ft-table-header">
              <span>Job</span>
              <span>Base Model</span>
              <span>Status</span>
              <span>Progress</span>
              <span>Loss</span>
              <span>Accuracy</span>
              <span>Promote</span>
            </div>
            {FT_JOBS.map(job => (
              <React.Fragment key={job.id}>
                <div
                  className={`ft-table-row${expandedId === job.id ? ' ft-table-row--expanded' : ''}`}
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                >
                  <span className="ft-job-name">
                    <span className="ft-job-id">{job.id}</span>
                    {job.name}
                  </span>
                  <span className="ft-base-model">{job.baseModel}</span>
                  <span><StatusBadge status={job.status} /></span>
                  <span>
                    <ProgressBar progress={job.progress} status={job.status} />
                  </span>
                  <span>
                    <LossCurve loss={job.loss} color="#EF4444" />
                  </span>
                  <span>
                    <AccuracyCurve accuracy={job.accuracy} threshold={job.threshold || 90} />
                  </span>
                  <span>
                    {job.promoted !== undefined ? (
                      <PromotedBadge promoted={job.promoted} threshold={job.threshold} evalScore={job.evalScore} />
                    ) : job.autoPromote ? (
                      <span className="ft-auto-label">auto @ {job.threshold}%</span>
                    ) : (
                      <span className="ft-manual-label">manual</span>
                    )}
                  </span>
                </div>
                {expandedId === job.id && <TrainingDetail job={job} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {tab === 'promoted' && (
        <div className="ft-section">
          <h3 className="ft-section-title">Auto-Promoted Models</h3>
          <p className="ft-section-desc">Models that met accuracy thresholds and were automatically added to the routing pool.</p>
          <div className="ft-promoted-grid">
            {FT_JOBS.filter(j => j.promoted).map(job => (
              <div key={job.id} className="ft-promoted-card">
                <div className="ft-promoted-header">
                  <span className="ft-promoted-name">{job.name}</span>
                  <span className="ft-promoted-badge-sm">live</span>
                </div>
                <div className="ft-promoted-stats">
                  <div><span className="ft-promoted-label">Eval Score</span><span className="ft-promoted-value">{job.evalScore}%</span></div>
                  <div><span className="ft-promoted-label">Threshold</span><span className="ft-promoted-value">{job.threshold}%</span></div>
                  <div><span className="ft-promoted-label">Training</span><span className="ft-promoted-value">{job.duration}</span></div>
                  <div><span className="ft-promoted-label">Samples</span><span className="ft-promoted-value">{job.samples.toLocaleString()}</span></div>
                </div>
                <div className="ft-promoted-curves">
                  <div>
                    <span className="ft-curve-label">Loss</span>
                    <LossCurve loss={job.loss} color="#EF4444" />
                  </div>
                  <div>
                    <span className="ft-curve-label">Accuracy</span>
                    <AccuracyCurve accuracy={job.accuracy} threshold={job.threshold} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'config' && (
        <div className="ft-section">
          <h3 className="ft-section-title">Auto-Promote Configuration</h3>
          <p className="ft-section-desc">When a fine-tune job completes, it runs through the eval pipeline. If the eval score exceeds the threshold, the model is automatically promoted to the routing pool.</p>
          <div className="ft-config-cards">
            <div className="ft-config-card">
              <div className="ft-config-card-header">
                <span className="ft-config-card-title">Eval Pipeline</span>
                <span className="ft-config-enabled">enabled</span>
              </div>
              <div className="ft-config-list">
                <div className="ft-config-row"><span>Eval Dataset</span><span>Auto-select from training data</span></div>
                <div className="ft-config-row"><span>Eval Samples</span><span>20% holdout (min 200)</span></div>
                <div className="ft-config-row"><span>Metrics</span><span>accuracy, latency, cost</span></div>
                <div className="ft-config-row"><span>Compare Against</span><span>Base model + current best</span></div>
              </div>
            </div>
            <div className="ft-config-card">
              <div className="ft-config-card-header">
                <span className="ft-config-card-title">Promotion Rules</span>
                <span className="ft-config-enabled">enabled</span>
              </div>
              <div className="ft-config-list">
                <div className="ft-config-row"><span>Default Threshold</span><span>95.0% accuracy</span></div>
                <div className="ft-config-row"><span>Max Latency Increase</span><span>&le; 15% vs base model</span></div>
                <div className="ft-config-row"><span>Cost Limit</span><span>&le; 2x base model cost</span></div>
                <div className="ft-config-row"><span>Rollback</span><span>Auto-rollback if accuracy drops &gt;2% in production</span></div>
              </div>
            </div>
            <div className="ft-config-card">
              <div className="ft-config-card-header">
                <span className="ft-config-card-title">Training Defaults</span>
                <span className="ft-config-enabled">active</span>
              </div>
              <div className="ft-config-list">
                <div className="ft-config-row"><span>Method</span><span>LoRA (rank 16, alpha 32)</span></div>
                <div className="ft-config-row"><span>Learning Rate</span><span>2e-5 (cosine schedule)</span></div>
                <div className="ft-config-row"><span>Batch Size</span><span>Auto (based on GPU memory)</span></div>
                <div className="ft-config-row"><span>Quantization</span><span>QAT post-training (INT8)</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

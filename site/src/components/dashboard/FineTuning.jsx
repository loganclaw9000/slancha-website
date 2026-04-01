import React, { useState, useMemo } from 'react';
import { useFineTuningJobs } from '../../hooks/useFineTuningJobs';
import './FineTuning.css';
import usePageMeta from '../../hooks/usePageMeta';

// Metrics computed from jobs
function computeMetrics(jobs) {
  const activeJobs = jobs.filter(j => j.status === 'training').length;
  const promotedJobs = jobs.filter(j => j.promoted).length;
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const bestAccuracy = completedJobs.length > 0
    ? Math.max(...completedJobs.map(j => j.evalScore || 0))
    : 0;
  const bestJob = completedJobs.length > 0
    ? completedJobs.reduce((prev, current) =>
        (prev.evalScore || 0) > (current.evalScore || 0) ? prev : current
      )
    : null;

  // Calculate avg training time from completed jobs with duration
  const avgTime = completedJobs
    .filter(j => j.duration)
    .map(j => {
      // Parse "2h 22m" format
      const match = j.duration.match(/(\d+)h\s*(\d+)m/);
      return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : null;
    })
    .filter(t => t !== null);

  const avgMinutes = avgTime.length > 0
    ? Math.round(avgTime.reduce((a, b) => a + b, 0) / avgTime.length)
    : 0;
  const avgHours = Math.floor(avgMinutes / 60);
  const avgMins = avgMinutes % 60;

  return {
    activeJobs,
    promotedJobs,
    bestAccuracy,
    bestJob,
    avgTrainingTime: avgHours > 0 ? `${avgHours}h ${avgMins}m` : `${avgMins}m`,
  };
}

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
  // Handle both old structure (epochs: { current, total }) and new (epochs: integer)
  const epochsCurrent = job.epochs?.current || job.epochs || 1;
  const epochsTotal = job.epochs?.total || job.epochs || 5;

  return (
    <div className="ft-detail">
      <div className="ft-detail-grid">
        <div className="ft-detail-section">
          <h4>Training Loss</h4>
          <div className="ft-chart-container">
            <LossCurve loss={job.loss} color="#EF4444" />
            <div className="ft-chart-labels">
              <span>Start: {job.loss?.[0]?.toFixed(2) || '--'}</span>
              <span>Final: {job.loss?.[job.loss.length - 1]?.toFixed(2) || '--'}</span>
              {job.loss?.length > 1 && (
                <span className="ft-chart-delta">-{((1 - job.loss[job.loss.length - 1] / job.loss[0]) * 100).toFixed(0)}%</span>
              )}
            </div>
          </div>
        </div>
        <div className="ft-detail-section">
          <h4>Accuracy</h4>
          <div className="ft-chart-container">
            <AccuracyCurve accuracy={job.accuracy} threshold={job.threshold || job.promotionThreshold || 90} />
            <div className="ft-chart-labels">
              <span>Start: {job.accuracy?.[0] || '--'}%</span>
              <span>Final: {job.accuracy?.[job.accuracy.length - 1] || '--'}%</span>
              {job.accuracy?.length > 1 && (
                <span className="ft-chart-delta">+{(job.accuracy[job.accuracy.length - 1] - job.accuracy[0]).toFixed(1)}%</span>
              )}
            </div>
          </div>
        </div>
        <div className="ft-detail-section">
          <h4>Configuration</h4>
          <div className="ft-config-list">
            <div className="ft-config-row"><span>Base Model</span><span>{job.baseModel}</span></div>
            <div className="ft-config-row"><span>Dataset</span><span>{job.dataset}</span></div>
            <div className="ft-config-row"><span>Samples</span><span>{job.samples?.toLocaleString() || '--'}</span></div>
            <div className="ft-config-row"><span>Epochs</span><span>{epochsCurrent} / {epochsTotal}</span></div>
            <div className="ft-config-row"><span>Auto-Promote</span><span>{job.autoPromote ? `Yes (threshold: ${job.threshold || job.promotionThreshold}%)` : 'No'}</span></div>
          </div>
        </div>
        <div className="ft-detail-section">
          <h4>Timeline</h4>
          <div className="ft-config-list">
            <div className="ft-config-row"><span>Started</span><span>{new Date(job.startedAt || job.started_at).toLocaleString()}</span></div>
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
            ? <>Model auto-promoted to routing pool — eval score {job.evalScore}% exceeded threshold {job.threshold || job.promotionThreshold}%</>
            : <>Model did not meet promotion threshold — eval score {job.evalScore}% &lt; {job.threshold || job.promotionThreshold}%</>
          }
        </div>
      )}
    </div>
  );
}

export default function FineTuning() {
  usePageMeta({ title: 'Fine-Tuning', description: 'Monitor fine-tuning jobs, training metrics, and auto-promoted models.' });
  const { jobs, loading, error, supabaseConfigured, cancelJob, createJob } = useFineTuningJobs();
  const [expandedId, setExpandedId] = useState(null);
  const [tab, setTab] = useState('jobs');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [jobToCancel, setJobToCancel] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const metrics = useMemo(() => computeMetrics(jobs), [jobs]);
  const trainingJob = jobs.find(j => j.status === 'training');
  const promotedJobs = jobs.filter(j => j.promoted);

  const handleCancel = async () => {
    if (!jobToCancel) return;
    setConfirmingCancel(true);
    const { error } = await cancelJob(jobToCancel.id);
    if (!error) {
      setShowCancelModal(false);
      setJobToCancel(null);
    } else {
      if (import.meta.env.DEV) console.error('Cancel failed:', error);
    }
    setConfirmingCancel(false);
  };

  const openCancelModal = (job) => {
    setJobToCancel(job);
    setShowCancelModal(true);
  };

  if (loading) {
    return (
      <div className="ft-page">
        <div className="ft-header">
          <div>
            <h2>Fine-Tuning</h2>
            <p className="ft-subtitle">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ft-page">
      <div className="ft-header">
        <div>
          <h2>Fine-Tuning</h2>
          <p className="ft-subtitle">Eval-driven fine-tuning with auto-promote to routing pool</p>
        </div>
        <button className="ft-new-btn">+ New Fine-Tune Job</button>
      </div>

      {!supabaseConfigured && (
        <div style={{ background: 'rgba(251, 191, 36, 0.06)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Running in local mode — jobs are not persisted. Connect Supabase for production use.
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#EF4444' }}>
          {error}
        </div>
      )}

      <div className="ft-stats-row">
        <div className="ft-stat-card">
          <div className="ft-stat-label">Active Jobs</div>
          <div className="ft-stat-value">{metrics.activeJobs}</div>
          {metrics.activeJobs > 0 && <div className="ft-stat-change">{metrics.bestJob?.name}</div>}
        </div>
        <div className="ft-stat-card">
          <div className="ft-stat-label">Models Promoted</div>
          <div className="ft-stat-value">{metrics.promotedJobs}</div>
          <div className="ft-stat-change">{metrics.promotedJobs > 0 ? '+1 this week' : 'No promotions yet'}</div>
        </div>
        <div className="ft-stat-card">
          <div className="ft-stat-label">Best Accuracy</div>
          <div className="ft-stat-value">{metrics.bestAccuracy > 0 ? `${metrics.bestAccuracy}%` : '--'}</div>
          {metrics.bestJob && <div className="ft-stat-change">{metrics.bestJob.name}</div>}
        </div>
        <div className="ft-stat-card">
          <div className="ft-stat-label">Avg Training Time</div>
          <div className="ft-stat-value">{metrics.avgTrainingTime}</div>
          <div className="ft-stat-change">vs last batch</div>
        </div>
      </div>

      {trainingJob && (
        <div className="ft-active-training">
          <div className="ft-active-left">
            <div className="ft-active-pulse" />
            <div>
              <div className="ft-active-name">{trainingJob.name}</div>
              <div className="ft-active-detail">Epoch {trainingJob.epochs?.current || trainingJob.epochs || 1}/{trainingJob.epochs?.total || trainingJob.epochs || 5} &middot; {trainingJob.samples?.toLocaleString()} samples &middot; ETA {trainingJob.eta || '~28 min'}</div>
            </div>
          </div>
          <div className="ft-active-right">
            <div className="ft-active-metrics">
              <span>Loss: {trainingJob.loss?.[trainingJob.loss.length - 1]?.toFixed(2) || '--'}</span>
              <span>Accuracy: {trainingJob.accuracy?.[trainingJob.accuracy.length - 1] || '--'}%</span>
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
              <span>Actions</span>
            </div>
            {jobs.map(job => (
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
                    <AccuracyCurve accuracy={job.accuracy} threshold={job.threshold || job.promotionThreshold || 90} />
                  </span>
                  <span>
                    {job.promoted !== undefined ? (
                      <PromotedBadge promoted={job.promoted} threshold={job.threshold || job.promotionThreshold} evalScore={job.evalScore} />
                    ) : job.autoPromote ? (
                      <span className="ft-auto-label">auto @ {job.threshold || job.promotionThreshold}%</span>
                    ) : (
                      <span className="ft-manual-label">manual</span>
                    )}
                  </span>
                  <span>
                    {job.status === 'training' && (
                      <button
                        className="dash-btn-sm dash-btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCancelModal(job);
                        }}
                      >
                        Cancel
                      </button>
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
            {promotedJobs.map(job => (
              <div key={job.id} className="ft-promoted-card">
                <div className="ft-promoted-header">
                  <span className="ft-promoted-name">{job.name}</span>
                  <span className="ft-promoted-badge-sm">live</span>
                </div>
                <div className="ft-promoted-stats">
                  <div><span className="ft-promoted-label">Eval Score</span><span className="ft-promoted-value">{job.evalScore}%</span></div>
                  <div><span className="ft-promoted-label">Threshold</span><span className="ft-promoted-value">{job.threshold || job.promotionThreshold}%</span></div>
                  <div><span className="ft-promoted-label">Training</span><span className="ft-promoted-value">{job.duration}</span></div>
                  <div><span className="ft-promoted-label">Samples</span><span className="ft-promoted-value">{job.samples?.toLocaleString()}</span></div>
                </div>
                <div className="ft-promoted-curves">
                  <div>
                    <span className="ft-curve-label">Loss</span>
                    <LossCurve loss={job.loss} color="#EF4444" />
                  </div>
                  <div>
                    <span className="ft-curve-label">Accuracy</span>
                    <AccuracyCurve accuracy={job.accuracy} threshold={job.threshold || job.promotionThreshold} />
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

      {showCancelModal && jobToCancel && (
        <div className="ft-modal-overlay" onClick={() => !confirmingCancel && setShowCancelModal(false)}>
          <div className="ft-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ft-modal-header">
              <h3>Cancel Training Job</h3>
              <button className="dash-btn-sm" onClick={() => setShowCancelModal(false)}>×</button>
            </div>
            <div className="ft-modal-body">
              <p>Are you sure you want to cancel training for <strong>{jobToCancel.name}</strong>?</p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>This will stop the training process immediately. The partial model will not be promoted.</p>
            </div>
            <div className="ft-modal-footer">
              <button className="dash-btn-sm" onClick={() => setShowCancelModal(false)} disabled={confirmingCancel}>
                {confirmingCancel ? 'Cancelling...' : 'Keep Training'}
              </button>
              <button
                className="dash-btn-sm dash-btn-danger"
                onClick={handleCancel}
                disabled={confirmingCancel}
              >
                {confirmingCancel ? 'Cancelling...' : 'Cancel Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

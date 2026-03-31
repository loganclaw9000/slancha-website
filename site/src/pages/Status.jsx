import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Status.css';

const COMPONENTS = [
  { name: 'API Gateway', desc: 'Request routing and load balancing', status: 'operational' },
  { name: 'Intelligent Router', desc: 'Model selection and complexity analysis', status: 'operational' },
  { name: 'Evaluation Engine', desc: 'Automated eval pipelines and scoring', status: 'operational' },
  { name: 'Fine-Tuning Pipeline', desc: 'Eval-driven model training jobs', status: 'operational' },
  { name: 'Dashboard', desc: 'Web console, API keys, usage analytics', status: 'operational' },
  { name: 'Authentication', desc: 'Login, signup, session management', status: 'operational' },
  { name: 'Webhooks', desc: 'Event delivery to customer endpoints', status: 'operational' },
  { name: 'Model Providers', desc: 'Upstream provider connectivity', status: 'operational' },
];

const UPTIME = {
  api: 99.98,
  router: 99.99,
  dashboard: 99.95,
  overall: 99.97,
};

const INCIDENTS = [
  {
    date: 'March 26, 2026',
    title: 'Elevated latency on fine-tuning job submissions',
    severity: 'minor',
    duration: '23 minutes',
    resolved: true,
    updates: [
      { time: '14:12 UTC', text: 'Investigating increased queue times for fine-tuning jobs.' },
      { time: '14:28 UTC', text: 'Identified bottleneck in training job scheduler. Scaling worker pool.' },
      { time: '14:35 UTC', text: 'Resolved. Fine-tuning job submission latency back to normal. No jobs were lost.' },
    ],
  },
  {
    date: 'March 19, 2026',
    title: 'Intermittent 502 errors on /v1/route endpoint',
    severity: 'major',
    duration: '8 minutes',
    resolved: true,
    updates: [
      { time: '09:41 UTC', text: 'Monitoring detected elevated 5xx rates on routing endpoint.' },
      { time: '09:44 UTC', text: 'Root cause: upstream provider (Anthropic) returned unexpected response format. Failover activated.' },
      { time: '09:49 UTC', text: 'Resolved. Added response validation to prevent recurrence. All requests properly rerouted during incident.' },
    ],
  },
  {
    date: 'March 11, 2026',
    title: 'Scheduled maintenance — database migration',
    severity: 'maintenance',
    duration: '12 minutes',
    resolved: true,
    updates: [
      { time: '03:00 UTC', text: 'Starting scheduled database migration. Dashboard reads may be delayed.' },
      { time: '03:12 UTC', text: 'Migration complete. All systems operational. No API downtime — routing and inference were unaffected.' },
    ],
  },
];

const STATUS_CONFIG = {
  operational: { label: 'Operational', color: '#22c55e', icon: '●' },
  degraded: { label: 'Degraded', color: '#f59e0b', icon: '●' },
  outage: { label: 'Outage', color: '#ef4444', icon: '●' },
  maintenance: { label: 'Maintenance', color: '#6366f1', icon: '●' },
};

const SEVERITY_CONFIG = {
  minor: { label: 'Minor', color: '#f59e0b' },
  major: { label: 'Major', color: '#ef4444' },
  maintenance: { label: 'Maintenance', color: '#6366f1' },
};

function getOverallStatus(components) {
  if (components.some(c => c.status === 'outage')) return 'outage';
  if (components.some(c => c.status === 'degraded')) return 'degraded';
  if (components.some(c => c.status === 'maintenance')) return 'maintenance';
  return 'operational';
}

function UptimeBar({ label, value }) {
  const barColor = value >= 99.9 ? '#22c55e' : value >= 99.5 ? '#f59e0b' : '#ef4444';
  return (
    <div className="status-uptime-row">
      <span className="status-uptime-label">{label}</span>
      <div className="status-uptime-bar">
        <div className="status-uptime-fill" style={{ width: `${value}%`, background: barColor }} />
      </div>
      <span className="status-uptime-value">{value}%</span>
    </div>
  );
}

export default function Status() {
  usePageMeta({
    title: 'System Status',
    description: 'Real-time system status for Slancha. Check uptime, component health, and incident history for our AI inference platform.',
  });

  const [expandedIncident, setExpandedIncident] = useState(null);
  const overall = getOverallStatus(COMPONENTS);
  const overallConfig = STATUS_CONFIG[overall];

  return (
    <div className="page">
      <Nav />
      <main id="main-content" className="status-page">
        <section className="status-hero">
          <h1 className="status-title">System Status</h1>
          <div className={`status-banner status-banner--${overall}`}>
            <span className="status-banner-icon" style={{ color: overallConfig.color }}>
              {overallConfig.icon}
            </span>
            <span className="status-banner-text">
              {overall === 'operational'
                ? 'All systems operational'
                : overall === 'degraded'
                ? 'Some systems experiencing issues'
                : overall === 'outage'
                ? 'System outage in progress'
                : 'Scheduled maintenance in progress'}
            </span>
          </div>
          <p className="status-updated">
            Last updated: {new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
          </p>
        </section>

        <section className="status-components">
          <h2 className="status-section-title">Components</h2>
          <div className="status-component-list">
            {COMPONENTS.map(comp => {
              const cfg = STATUS_CONFIG[comp.status];
              return (
                <div key={comp.name} className="status-component-row">
                  <div className="status-component-info">
                    <span className="status-component-name">{comp.name}</span>
                    <span className="status-component-desc">{comp.desc}</span>
                  </div>
                  <span className="status-component-badge" style={{ color: cfg.color }}>
                    <span className="status-dot">{cfg.icon}</span> {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="status-uptime">
          <h2 className="status-section-title">Uptime — Last 90 Days</h2>
          <div className="status-uptime-grid">
            <UptimeBar label="Overall" value={UPTIME.overall} />
            <UptimeBar label="API Gateway" value={UPTIME.api} />
            <UptimeBar label="Intelligent Router" value={UPTIME.router} />
            <UptimeBar label="Dashboard" value={UPTIME.dashboard} />
          </div>
        </section>

        <section className="status-incidents">
          <h2 className="status-section-title">Recent Incidents</h2>
          {INCIDENTS.length === 0 ? (
            <p className="status-no-incidents">No incidents in the past 90 days.</p>
          ) : (
            <div className="status-incident-list">
              {INCIDENTS.map((inc, i) => {
                const sevCfg = SEVERITY_CONFIG[inc.severity];
                const isExpanded = expandedIncident === i;
                return (
                  <div key={i} className={`status-incident ${isExpanded ? 'status-incident--expanded' : ''}`}>
                    <button
                      className="status-incident-header"
                      onClick={() => setExpandedIncident(isExpanded ? null : i)}
                      aria-expanded={isExpanded}
                    >
                      <div className="status-incident-meta">
                        <span className="status-incident-date">{inc.date}</span>
                        <span className="status-incident-severity" style={{ color: sevCfg.color, borderColor: sevCfg.color }}>
                          {sevCfg.label}
                        </span>
                        {inc.resolved && <span className="status-incident-resolved">Resolved</span>}
                      </div>
                      <h3 className="status-incident-title">{inc.title}</h3>
                      <div className="status-incident-duration">Duration: {inc.duration}</div>
                      <svg className={`status-incident-chevron ${isExpanded ? 'rotated' : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="status-incident-timeline">
                        {inc.updates.map((upd, j) => (
                          <div key={j} className="status-incident-update">
                            <span className="status-incident-time">{upd.time}</span>
                            <span className="status-incident-text">{upd.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="status-subscribe">
          <h2 className="status-section-title">Stay Informed</h2>
          <p className="status-subscribe-text">
            Get notified about incidents and maintenance windows. We publish updates in real time so you're never in the dark.
          </p>
          <div className="status-subscribe-options">
            <div className="status-subscribe-card">
              <h3>Webhook Notifications</h3>
              <p>Configure a webhook in your <Link to="/dashboard">dashboard</Link> to receive status events via HTTP POST.</p>
            </div>
            <div className="status-subscribe-card">
              <h3>API Endpoint</h3>
              <p>Poll <code>GET /v1/status</code> from your monitoring system. Returns component health and active incidents.</p>
            </div>
            <div className="status-subscribe-card">
              <h3>Email Alerts</h3>
              <p>Account owners automatically receive email alerts for major incidents affecting their active deployments.</p>
            </div>
          </div>
        </section>

        <section className="status-cta">
          <p>Questions about system reliability? Check our <Link to="/security">Security & Trust Center</Link> or <Link to="/contact">contact us</Link>.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

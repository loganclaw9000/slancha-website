import React, { useState } from 'react';
import './Onboarding.css';

const STEPS = [
  {
    id: 'key',
    title: 'Create your API key',
    description: 'Generate a key to authenticate requests to the Slancha Router.',
    action: { label: 'Create Key', link: '/dashboard/keys' },
    code: null,
  },
  {
    id: 'install',
    title: 'Install the SDK',
    description: 'Add the Slancha Python or TypeScript SDK to your project.',
    action: null,
    code: {
      tabs: [
        { label: 'Python', lang: 'bash', content: 'pip install slancha' },
        { label: 'TypeScript', lang: 'bash', content: 'npm install @slancha/sdk' },
        { label: 'cURL', lang: 'bash', content: '# No installation needed — use any HTTP client' },
      ],
    },
  },
  {
    id: 'request',
    title: 'Make your first request',
    description: 'Send a prompt to the Router. Slancha picks the best model automatically.',
    action: null,
    code: {
      tabs: [
        {
          label: 'Python',
          lang: 'python',
          content: `from slancha import Slancha

client = Slancha(api_key="sk-sl_YOUR_KEY")

response = client.route(
    messages=[{"role": "user", "content": "Summarize this contract"}],
    task_type="auto"  # Router selects the optimal model
)

print(response.content)
print(f"Model: {response.model}, Cost: $" + f"{response.cost:.4f}")`,
        },
        {
          label: 'TypeScript',
          lang: 'typescript',
          content: `import { Slancha } from '@slancha/sdk';

const client = new Slancha({ apiKey: 'sk-sl_YOUR_KEY' });

const response = await client.route({
  messages: [{ role: 'user', content: 'Summarize this contract' }],
  taskType: 'auto', // Router selects the optimal model
});

console.log(response.content);
console.log(\`Model: \${response.model}, Cost: $\${response.cost.toFixed(4)}\`);`,
        },
        {
          label: 'cURL',
          lang: 'bash',
          content: `curl -X POST https://api.slancha.ai/v1/route \\
  -H "Authorization: Bearer sk-sl_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Summarize this contract"}],
    "task_type": "auto"
  }'`,
        },
      ],
    },
  },
  {
    id: 'result',
    title: 'See your results',
    description: 'Check the Usage dashboard to see requests, model selection, cost savings, and latency.',
    action: { label: 'View Usage', link: '/dashboard/usage' },
    code: null,
    result: {
      model: 'Qwen3-30B-A3B',
      latency: '142ms',
      cost: '$0.0003',
      saved: '68%',
    },
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="onb-copy-btn" onClick={handleCopy} title="Copy to clipboard">
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      )}
    </button>
  );
}

function CodeBlock({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const active = tabs[activeTab];

  return (
    <div className="onb-code-block">
      <div className="onb-code-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`onb-code-tab${i === activeTab ? ' active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
        <CopyButton text={active.content} />
      </div>
      <pre className="onb-code-pre"><code>{active.content}</code></pre>
    </div>
  );
}

function ResultCard({ result }) {
  return (
    <div className="onb-result-card">
      <div className="onb-result-header">Response</div>
      <div className="onb-result-grid">
        <div className="onb-result-item">
          <span className="onb-result-label">Model</span>
          <span className="onb-result-value">{result.model}</span>
        </div>
        <div className="onb-result-item">
          <span className="onb-result-label">Latency</span>
          <span className="onb-result-value onb-result-green">{result.latency}</span>
        </div>
        <div className="onb-result-item">
          <span className="onb-result-label">Cost</span>
          <span className="onb-result-value">{result.cost}</span>
        </div>
        <div className="onb-result-item">
          <span className="onb-result-label">Saved vs GPT-4o</span>
          <span className="onb-result-value onb-result-green">{result.saved}</span>
        </div>
      </div>
    </div>
  );
}

export default function Onboarding() {
  const [completed, setCompleted] = useState({});
  const [expanded, setExpanded] = useState('key');

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = Math.round((completedCount / STEPS.length) * 100);

  const toggleComplete = (id) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id) => {
    setExpanded(prev => prev === id ? null : id);
  };

  return (
    <div className="onb-container">
      <div className="onb-header">
        <div className="onb-header-text">
          <h2 className="onb-title">Get started with Slancha</h2>
          <p className="onb-subtitle">Complete these steps to start routing requests to the best model — automatically.</p>
        </div>
        <div className="onb-progress">
          <div className="onb-progress-text">{completedCount} of {STEPS.length}</div>
          <div className="onb-progress-bar">
            <div className="onb-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="onb-steps">
        {STEPS.map((step, i) => {
          const isExpanded = expanded === step.id;
          const isDone = completed[step.id];

          return (
            <div key={step.id} className={`onb-step${isDone ? ' done' : ''}${isExpanded ? ' expanded' : ''}`}>
              <div className="onb-step-header" onClick={() => toggleExpand(step.id)}>
                <button
                  className={`onb-check${isDone ? ' checked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleComplete(step.id); }}
                  aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                >
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <span className="onb-step-num">{i + 1}</span>
                  )}
                </button>
                <div className="onb-step-title-row">
                  <span className={`onb-step-title${isDone ? ' struck' : ''}`}>{step.title}</span>
                </div>
                <svg className={`onb-chevron${isExpanded ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>

              {isExpanded && (
                <div className="onb-step-body">
                  <p className="onb-step-desc">{step.description}</p>
                  {step.code && <CodeBlock tabs={step.code.tabs} />}
                  {step.result && <ResultCard result={step.result} />}
                  {step.action && (
                    <a href={step.action.link} className="btn-primary btn-sm onb-action-btn">{step.action.label}</a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {completedCount === STEPS.length && (
        <div className="onb-done-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>You're all set! Check the <a href="/dashboard/usage">Usage dashboard</a> to monitor your requests.</span>
        </div>
      )}
    </div>
  );
}

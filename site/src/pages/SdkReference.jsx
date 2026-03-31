import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './SdkReference.css';

const sdkMethods = [
  {
    category: 'Chat Completions',
    id: 'chat',
    methods: [
      {
        name: 'chat.completions.create',
        description: 'Send a prompt to Slancha\'s intelligent router. The router automatically selects the optimal model based on task complexity, latency requirements, and cost.',
        params: [
          { name: 'messages', type: 'Message[]', required: true, desc: 'Array of chat messages with role and content' },
          { name: 'model', type: 'string', required: false, desc: 'Model hint. Default: "auto" (router decides). Can override with specific model ID.' },
          { name: 'temperature', type: 'number', required: false, desc: 'Sampling temperature (0-2). Default: 1.0' },
          { name: 'max_tokens', type: 'number', required: false, desc: 'Maximum tokens to generate. Default: model-dependent' },
          { name: 'stream', type: 'boolean', required: false, desc: 'Stream response tokens. Default: false' },
          { name: 'top_p', type: 'number', required: false, desc: 'Nucleus sampling threshold. Default: 1.0' },
          { name: 'stop', type: 'string | string[]', required: false, desc: 'Stop sequences. Generation stops when encountered.' },
          { name: 'tools', type: 'Tool[]', required: false, desc: 'Tool/function definitions for tool use' },
          { name: 'response_format', type: 'object', required: false, desc: '{ type: "json_object" } for JSON mode' },
        ],
        python: `from slancha import Slancha

client = Slancha()

response = client.chat.completions.create(
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing"}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
print(f"Model used: {response.model}")
print(f"Tokens: {response.usage.total_tokens}")
print(f"Latency: {response.usage.latency_ms}ms")
print(f"Cost: \${response.usage.cost:.6f}")`,
        typescript: `import Slancha from '@slancha/sdk';

const client = new Slancha();

const response = await client.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing' },
  ],
  temperature: 0.7,
  max_tokens: 500,
});

console.log(response.choices[0].message.content);
console.log(\`Model: \${response.model}\`);
console.log(\`Cost: $\${response.usage.cost.toFixed(6)}\`);`,
        response: `{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1711843200,
  "model": "gpt-4o",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Quantum computing uses quantum bits..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 186,
    "total_tokens": 210,
    "latency_ms": 847,
    "cost": 0.00063,
    "model_selected_by": "router",
    "routing_reason": "complexity:medium, cost_optimized"
  }
}`,
      },
      {
        name: 'chat.completions.create (streaming)',
        description: 'Stream response tokens as they are generated. Returns an async iterator of server-sent events.',
        params: [
          { name: 'messages', type: 'Message[]', required: true, desc: 'Array of chat messages' },
          { name: 'stream', type: 'true', required: true, desc: 'Must be true for streaming' },
        ],
        python: `stream = client.chat.completions.create(
    messages=[{"role": "user", "content": "Write a poem"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`,
        typescript: `const stream = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Write a poem' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}`,
        response: `data: {"id":"chatcmpl-abc123","choices":[{"delta":{"content":"In"},"index":0}]}

data: {"id":"chatcmpl-abc123","choices":[{"delta":{"content":" the"},"index":0}]}

data: {"id":"chatcmpl-abc123","choices":[{"delta":{"content":" quantum"},"index":0}]}

data: [DONE]`,
      },
    ],
  },
  {
    category: 'Evaluations',
    id: 'evals',
    methods: [
      {
        name: 'evals.create',
        description: 'Run an evaluation across multiple models. Slancha automatically benchmarks models on your test cases and promotes the best performer to your routing pool.',
        params: [
          { name: 'name', type: 'string', required: true, desc: 'Evaluation run name' },
          { name: 'models', type: 'string[]', required: true, desc: 'Model IDs to evaluate' },
          { name: 'test_cases', type: 'TestCase[]', required: true, desc: 'Array of { input, expected_output } pairs' },
          { name: 'scorers', type: 'string[]', required: true, desc: 'Scoring metrics: "exact_match", "semantic_similarity", "latency", "cost", "custom"' },
          { name: 'auto_promote', type: 'boolean', required: false, desc: 'Auto-promote winner to routing pool. Default: true' },
          { name: 'threshold', type: 'number', required: false, desc: 'Minimum score to pass (0-1). Default: 0.8' },
        ],
        python: `eval_run = client.evals.create(
    name="customer-support-v3",
    models=["gpt-4o", "claude-sonnet-4-20250514", "llama-3.1-70b"],
    test_cases=[
        {
            "input": "How do I reset my password?",
            "expected_output": "Go to Settings > Security > Reset Password"
        },
        {
            "input": "What's your refund policy?",
            "expected_output": "Full refund within 30 days"
        }
    ],
    scorers=["semantic_similarity", "latency", "cost"],
    auto_promote=True,
    threshold=0.85
)

print(f"Eval ID: {eval_run.id}")
print(f"Status: {eval_run.status}")  # "running"`,
        typescript: `const evalRun = await client.evals.create({
  name: 'customer-support-v3',
  models: ['gpt-4o', 'claude-sonnet-4-20250514', 'llama-3.1-70b'],
  testCases: [
    {
      input: 'How do I reset my password?',
      expectedOutput: 'Go to Settings > Security > Reset Password',
    },
  ],
  scorers: ['semantic_similarity', 'latency', 'cost'],
  autoPromote: true,
  threshold: 0.85,
});

console.log(\`Eval ID: \${evalRun.id}\`);`,
        response: `{
  "id": "eval_run_xyz789",
  "name": "customer-support-v3",
  "status": "running",
  "models": ["gpt-4o", "claude-sonnet-4-20250514", "llama-3.1-70b"],
  "test_case_count": 2,
  "scorers": ["semantic_similarity", "latency", "cost"],
  "created_at": "2026-03-31T10:00:00Z",
  "estimated_completion": "2026-03-31T10:05:00Z"
}`,
      },
      {
        name: 'evals.get',
        description: 'Get evaluation results including per-model scores, winner, and promotion status.',
        params: [
          { name: 'eval_id', type: 'string', required: true, desc: 'Evaluation run ID' },
        ],
        python: `result = client.evals.get("eval_run_xyz789")

print(f"Winner: {result.winner}")
print(f"Promoted: {result.auto_promoted}")

for model in result.scores:
    print(f"  {model.name}: {model.overall:.2f}")`,
        typescript: `const result = await client.evals.get('eval_run_xyz789');

console.log(\`Winner: \${result.winner}\`);
for (const model of result.scores) {
  console.log(\`  \${model.name}: \${model.overall.toFixed(2)}\`);
}`,
        response: `{
  "id": "eval_run_xyz789",
  "status": "completed",
  "winner": "claude-sonnet-4-20250514",
  "auto_promoted": true,
  "scores": [
    {
      "model": "gpt-4o",
      "overall": 0.91,
      "semantic_similarity": 0.94,
      "latency_ms": 1200,
      "cost_per_1k": 0.015
    },
    {
      "model": "claude-sonnet-4-20250514",
      "overall": 0.95,
      "semantic_similarity": 0.97,
      "latency_ms": 980,
      "cost_per_1k": 0.012
    },
    {
      "model": "llama-3.1-70b",
      "overall": 0.82,
      "semantic_similarity": 0.85,
      "latency_ms": 650,
      "cost_per_1k": 0.004
    }
  ],
  "completed_at": "2026-03-31T10:04:32Z"
}`,
      },
      {
        name: 'evals.list',
        description: 'List all evaluation runs with optional filters.',
        params: [
          { name: 'status', type: 'string', required: false, desc: '"running" | "completed" | "failed"' },
          { name: 'limit', type: 'number', required: false, desc: 'Max results. Default: 20' },
        ],
        python: `runs = client.evals.list(status="completed", limit=5)
for run in runs.data:
    print(f"{run.name}: winner={run.winner}")`,
        typescript: `const runs = await client.evals.list({ status: 'completed', limit: 5 });
for (const run of runs.data) {
  console.log(\`\${run.name}: winner=\${run.winner}\`);
}`,
        response: `{
  "data": [
    { "id": "eval_run_xyz789", "name": "customer-support-v3", "winner": "claude-sonnet-4-20250514", "status": "completed" },
    { "id": "eval_run_abc456", "name": "code-gen-v2", "winner": "gpt-4o", "status": "completed" }
  ],
  "has_more": false
}`,
      },
    ],
  },
  {
    category: 'Fine-Tuning',
    id: 'fine-tuning',
    methods: [
      {
        name: 'training.create',
        description: 'Start a fine-tuning job. Slancha automatically selects the best technique (LoRA, QLoRA, full fine-tune) based on your data size and base model.',
        params: [
          { name: 'name', type: 'string', required: true, desc: 'Fine-tune job name' },
          { name: 'base_model', type: 'string', required: true, desc: 'Base model to fine-tune' },
          { name: 'training_data', type: 'TrainingSample[]', required: true, desc: 'Array of { messages } training examples' },
          { name: 'validation_split', type: 'number', required: false, desc: 'Validation set fraction. Default: 0.1' },
          { name: 'epochs', type: 'number', required: false, desc: 'Training epochs. Default: auto' },
          { name: 'auto_deploy', type: 'boolean', required: false, desc: 'Deploy to routing pool when done. Default: false' },
        ],
        python: `job = client.training.create(
    name="support-bot-v2",
    base_model="llama-3.1-8b",
    training_data=[
        {"messages": [
            {"role": "user", "content": "Reset password"},
            {"role": "assistant", "content": "Navigate to Settings..."}
        ]},
        # ... more examples
    ],
    validation_split=0.15,
    auto_deploy=True
)

print(f"Job: {job.id}, technique: {job.technique}")`,
        typescript: `const job = await client.training.create({
  name: 'support-bot-v2',
  baseModel: 'llama-3.1-8b',
  trainingData: [
    { messages: [
      { role: 'user', content: 'Reset password' },
      { role: 'assistant', content: 'Navigate to Settings...' },
    ]},
  ],
  validationSplit: 0.15,
  autoDeploy: true,
});

console.log(\`Job: \${job.id}, technique: \${job.technique}\`);`,
        response: `{
  "id": "ft_job_abc123",
  "name": "support-bot-v2",
  "base_model": "llama-3.1-8b",
  "technique": "qlora",
  "status": "training",
  "training_samples": 1500,
  "validation_samples": 265,
  "epochs": 3,
  "estimated_completion": "2026-03-31T14:00:00Z",
  "auto_deploy": true
}`,
      },
      {
        name: 'training.get',
        description: 'Check fine-tuning job status and metrics.',
        params: [
          { name: 'job_id', type: 'string', required: true, desc: 'Fine-tuning job ID' },
        ],
        python: `job = client.training.get("ft_job_abc123")
print(f"Status: {job.status}")
print(f"Loss: {job.metrics.train_loss:.4f}")
print(f"Val accuracy: {job.metrics.val_accuracy:.2%}")`,
        typescript: `const job = await client.training.get('ft_job_abc123');
console.log(\`Status: \${job.status}\`);
console.log(\`Loss: \${job.metrics.trainLoss.toFixed(4)}\`);`,
        response: `{
  "id": "ft_job_abc123",
  "status": "completed",
  "technique": "qlora",
  "metrics": {
    "train_loss": 0.3241,
    "val_loss": 0.3518,
    "val_accuracy": 0.927,
    "training_time_seconds": 7200
  },
  "output_model": "ft:llama-3.1-8b:support-bot-v2:abc123",
  "deployed": true,
  "completed_at": "2026-03-31T13:52:00Z"
}`,
      },
    ],
  },
  {
    category: 'Deployments',
    id: 'deployments',
    methods: [
      {
        name: 'deployments.create',
        description: 'Create a deployment configuration that defines routing rules, model pool, and optimization targets.',
        params: [
          { name: 'name', type: 'string', required: true, desc: 'Deployment name' },
          { name: 'routing_config', type: 'RoutingConfig', required: true, desc: 'Model pool and routing rules' },
          { name: 'optimization_target', type: 'string', required: false, desc: '"cost" | "latency" | "quality" | "balanced". Default: "balanced"' },
          { name: 'rate_limit', type: 'number', required: false, desc: 'Requests per minute. Default: 1000' },
        ],
        python: `deployment = client.deployments.create(
    name="prod-support",
    routing_config={
        "models": ["gpt-4o", "claude-sonnet-4-20250514", "ft:llama-3.1-8b:support-bot-v2"],
        "fallback": "gpt-4o",
        "rules": [
            {"if": "complexity < 0.3", "route_to": "ft:llama-3.1-8b:support-bot-v2"},
            {"if": "complexity >= 0.7", "route_to": "gpt-4o"}
        ]
    },
    optimization_target="cost",
    rate_limit=5000
)

print(f"Deployment: {deployment.id}")
print(f"Endpoint: {deployment.endpoint}")`,
        typescript: `const deployment = await client.deployments.create({
  name: 'prod-support',
  routingConfig: {
    models: ['gpt-4o', 'claude-sonnet-4-20250514', 'ft:llama-3.1-8b:support-bot-v2'],
    fallback: 'gpt-4o',
    rules: [
      { if: 'complexity < 0.3', routeTo: 'ft:llama-3.1-8b:support-bot-v2' },
      { if: 'complexity >= 0.7', routeTo: 'gpt-4o' },
    ],
  },
  optimizationTarget: 'cost',
  rateLimit: 5000,
});

console.log(\`Endpoint: \${deployment.endpoint}\`);`,
        response: `{
  "id": "deploy_prod123",
  "name": "prod-support",
  "endpoint": "https://api.slancha.ai/v1/deployments/deploy_prod123",
  "status": "active",
  "models": ["gpt-4o", "claude-sonnet-4-20250514", "ft:llama-3.1-8b:support-bot-v2"],
  "optimization_target": "cost",
  "rate_limit": 5000,
  "created_at": "2026-03-31T10:00:00Z"
}`,
      },
      {
        name: 'deployments.metrics',
        description: 'Get real-time metrics for a deployment: latency, cost, routing distribution, error rates.',
        params: [
          { name: 'deployment_id', type: 'string', required: true, desc: 'Deployment ID' },
          { name: 'period', type: 'string', required: false, desc: '"1h" | "24h" | "7d" | "30d". Default: "24h"' },
        ],
        python: `metrics = client.deployments.metrics(
    "deploy_prod123", period="24h"
)
print(f"Requests: {metrics.total_requests}")
print(f"Avg latency: {metrics.avg_latency_ms}ms")
print(f"Total cost: \${metrics.total_cost:.2f}")
print(f"Error rate: {metrics.error_rate:.2%}")`,
        typescript: `const metrics = await client.deployments.metrics(
  'deploy_prod123', { period: '24h' }
);
console.log(\`Requests: \${metrics.totalRequests}\`);
console.log(\`Avg latency: \${metrics.avgLatencyMs}ms\`);`,
        response: `{
  "deployment_id": "deploy_prod123",
  "period": "24h",
  "total_requests": 45230,
  "avg_latency_ms": 342,
  "p50_latency_ms": 280,
  "p99_latency_ms": 1850,
  "total_cost": 12.47,
  "error_rate": 0.0012,
  "routing_distribution": {
    "ft:llama-3.1-8b:support-bot-v2": 0.62,
    "claude-sonnet-4-20250514": 0.28,
    "gpt-4o": 0.10
  }
}`,
      },
    ],
  },
  {
    category: 'Datasets',
    id: 'datasets',
    methods: [
      {
        name: 'datasets.upload',
        description: 'Upload a dataset for evaluations or fine-tuning. Supports JSONL, CSV, and Parquet formats.',
        params: [
          { name: 'name', type: 'string', required: true, desc: 'Dataset name' },
          { name: 'file', type: 'file path | buffer', required: true, desc: 'Path to JSONL/CSV/Parquet file' },
          { name: 'purpose', type: 'string', required: true, desc: '"eval" | "fine-tune" | "both"' },
        ],
        python: `dataset = client.datasets.upload(
    name="support-tickets-march",
    file="./data/tickets.jsonl",
    purpose="both"
)
print(f"Uploaded: {dataset.id} ({dataset.row_count} rows)")`,
        typescript: `const dataset = await client.datasets.upload({
  name: 'support-tickets-march',
  file: fs.createReadStream('./data/tickets.jsonl'),
  purpose: 'both',
});
console.log(\`Uploaded: \${dataset.id} (\${dataset.rowCount} rows)\`);`,
        response: `{
  "id": "ds_march_tickets",
  "name": "support-tickets-march",
  "format": "jsonl",
  "row_count": 2847,
  "size_bytes": 4521088,
  "purpose": "both",
  "created_at": "2026-03-31T10:00:00Z"
}`,
      },
    ],
  },
  {
    category: 'Router',
    id: 'router',
    methods: [
      {
        name: 'router.config',
        description: 'Get or update router configuration: model pool, routing weights, fallback behavior, and optimization targets.',
        params: [
          { name: 'models', type: 'string[]', required: false, desc: 'Update active model pool' },
          { name: 'optimization_target', type: 'string', required: false, desc: '"cost" | "latency" | "quality" | "balanced"' },
          { name: 'fallback', type: 'string', required: false, desc: 'Fallback model when primary is unavailable' },
        ],
        python: `# Get current config
config = client.router.config()
print(f"Active models: {config.models}")
print(f"Target: {config.optimization_target}")

# Update config
client.router.config(
    optimization_target="latency",
    fallback="gpt-4o-mini"
)`,
        typescript: `// Get current config
const config = await client.router.config();
console.log(\`Models: \${config.models.join(', ')}\`);

// Update
await client.router.config({
  optimizationTarget: 'latency',
  fallback: 'gpt-4o-mini',
});`,
        response: `{
  "models": ["gpt-4o", "claude-sonnet-4-20250514", "llama-3.1-70b", "ft:llama-3.1-8b:support-bot-v2"],
  "optimization_target": "balanced",
  "fallback": "gpt-4o",
  "routing_version": "2026-03-31",
  "auto_learning": true,
  "learning_rate": 0.01
}`,
      },
    ],
  },
];

const errorCodes = [
  { code: 400, name: 'Bad Request', desc: 'Invalid parameters. Check the error message for details.' },
  { code: 401, name: 'Unauthorized', desc: 'Invalid or missing API key.' },
  { code: 403, name: 'Forbidden', desc: 'Your plan doesn\'t include this feature.' },
  { code: 429, name: 'Rate Limited', desc: 'Too many requests. Implement exponential backoff.' },
  { code: 500, name: 'Internal Error', desc: 'Server error. Retry with backoff. If persistent, contact support.' },
  { code: 503, name: 'Service Unavailable', desc: 'Model temporarily unavailable. Router will auto-failover.' },
];

function MethodCard({ method, lang }) {
  const [showResponse, setShowResponse] = useState(false);
  const code = lang === 'python' ? method.python : method.typescript;

  return (
    <div className="sdk-method-card" id={method.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}>
      <div className="sdk-method-header">
        <code className="sdk-method-name">{method.name}</code>
      </div>
      <p className="sdk-method-desc">{method.description}</p>

      {method.params && method.params.length > 0 && (
        <div className="sdk-params">
          <h4>Parameters</h4>
          <table className="sdk-params-table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>
            </thead>
            <tbody>
              {method.params.map(p => (
                <tr key={p.name}>
                  <td><code>{p.name}</code></td>
                  <td><code className="sdk-type">{p.type}</code></td>
                  <td>{p.required ? <span className="sdk-required">Yes</span> : <span className="sdk-optional">No</span>}</td>
                  <td>{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="sdk-code-block">
        <div className="sdk-code-header">
          <span>{lang === 'python' ? 'Python' : 'TypeScript'}</span>
        </div>
        <pre><code>{code}</code></pre>
      </div>

      <button
        className={`sdk-response-toggle ${showResponse ? 'active' : ''}`}
        onClick={() => setShowResponse(!showResponse)}
      >
        {showResponse ? 'Hide' : 'Show'} Response
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showResponse ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {showResponse && (
        <div className="sdk-code-block sdk-response">
          <div className="sdk-code-header"><span>Response</span></div>
          <pre><code>{method.response}</code></pre>
        </div>
      )}
    </div>
  );
}

export default function SdkReference() {
  usePageMeta({
    title: 'SDK Reference | Slancha',
    description: 'Complete Python and TypeScript SDK reference for Slancha. Method signatures, typed parameters, request examples, and response schemas for chat completions, evaluations, fine-tuning, deployments, and routing.',
  });

  const [lang, setLang] = useState('python');
  const [activeCategory, setActiveCategory] = useState('chat');

  return (
    <>
      <Nav />
      <main className="sdk-ref">
        <div className="sdk-ref-layout">
          {/* Sidebar navigation */}
          <aside className="sdk-sidebar">
            <div className="sdk-sidebar-header">
              <h3>API Reference</h3>
              <div className="sdk-lang-toggle">
                <button className={lang === 'python' ? 'active' : ''} onClick={() => setLang('python')}>Python</button>
                <button className={lang === 'typescript' ? 'active' : ''} onClick={() => setLang('typescript')}>TypeScript</button>
              </div>
            </div>
            <nav className="sdk-nav">
              {sdkMethods.map(cat => (
                <div key={cat.id} className="sdk-nav-group">
                  <a
                    href={`#${cat.id}`}
                    className={`sdk-nav-category ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.category}
                  </a>
                  {cat.methods.map(m => (
                    <a
                      key={m.name}
                      href={`#${m.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                      className="sdk-nav-method"
                    >
                      {m.name}
                    </a>
                  ))}
                </div>
              ))}
              <div className="sdk-nav-group">
                <a href="#errors" className="sdk-nav-category" onClick={() => setActiveCategory('errors')}>Errors</a>
              </div>
              <div className="sdk-nav-group">
                <a href="#auth" className="sdk-nav-category" onClick={() => setActiveCategory('auth')}>Authentication</a>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <div className="sdk-content">
            <div className="sdk-hero">
              <span className="sdk-eyebrow">Developer Reference</span>
              <h1>SDK Reference</h1>
              <p>Complete method reference for the Slancha Python and TypeScript SDKs. OpenAI-compatible — swap your base URL and start routing.</p>
              <div className="sdk-install-bar">
                <code>
                  {lang === 'python' ? 'pip install slancha' : 'npm install @slancha/sdk'}
                </code>
              </div>
            </div>

            {/* Authentication section */}
            <section className="sdk-section" id="auth">
              <h2>Authentication</h2>
              <p>All API requests require an API key. Set it as an environment variable or pass it directly:</p>
              <div className="sdk-code-block">
                <div className="sdk-code-header"><span>{lang === 'python' ? 'Python' : 'TypeScript'}</span></div>
                <pre><code>{lang === 'python'
? `# Option 1: Environment variable (recommended)
export SLANCHA_API_KEY="sk-sl_your_key_here"

from slancha import Slancha
client = Slancha()  # auto-reads from env

# Option 2: Direct
client = Slancha(api_key="sk-sl_your_key_here")

# Option 3: OpenAI SDK compatibility
import openai
client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-sl_your_key_here"
)`
: `// Option 1: Environment variable (recommended)
// SLANCHA_API_KEY="sk-sl_your_key_here"

import Slancha from '@slancha/sdk';
const client = new Slancha();  // auto-reads from env

// Option 2: Direct
const client = new Slancha({ apiKey: 'sk-sl_your_key_here' });

// Option 3: OpenAI SDK compatibility
import OpenAI from 'openai';
const client = new OpenAI({
  baseURL: 'https://api.slancha.ai/v1',
  apiKey: 'sk-sl_your_key_here',
});`
                }</code></pre>
              </div>
            </section>

            {/* Method sections */}
            {sdkMethods.map(cat => (
              <section key={cat.id} className="sdk-section" id={cat.id}>
                <h2>{cat.category}</h2>
                {cat.methods.map(m => (
                  <MethodCard key={m.name} method={m} lang={lang} />
                ))}
              </section>
            ))}

            {/* Error codes */}
            <section className="sdk-section" id="errors">
              <h2>Error Handling</h2>
              <p>All errors return a JSON body with <code>error.type</code>, <code>error.message</code>, and the HTTP status code.</p>
              <div className="sdk-code-block">
                <div className="sdk-code-header"><span>{lang === 'python' ? 'Python' : 'TypeScript'}</span></div>
                <pre><code>{lang === 'python'
? `from slancha import SlanchaError, RateLimitError

try:
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after}s")
except SlanchaError as e:
    print(f"Error {e.status}: {e.message}")`
: `import { SlanchaError, RateLimitError } from '@slancha/sdk';

try {
  const response = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Hello' }],
  });
} catch (e) {
  if (e instanceof RateLimitError) {
    console.log(\`Rate limited. Retry after \${e.retryAfter}s\`);
  } else if (e instanceof SlanchaError) {
    console.log(\`Error \${e.status}: \${e.message}\`);
  }
}`
                }</code></pre>
              </div>

              <table className="sdk-errors-table">
                <thead>
                  <tr><th>Code</th><th>Name</th><th>Description</th></tr>
                </thead>
                <tbody>
                  {errorCodes.map(e => (
                    <tr key={e.code}>
                      <td><code>{e.code}</code></td>
                      <td>{e.name}</td>
                      <td>{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Rate limits */}
            <section className="sdk-section" id="rate-limits">
              <h2>Rate Limits</h2>
              <table className="sdk-errors-table">
                <thead>
                  <tr><th>Plan</th><th>Requests/min</th><th>Tokens/min</th><th>Concurrent</th></tr>
                </thead>
                <tbody>
                  <tr><td>Free</td><td>60</td><td>40,000</td><td>5</td></tr>
                  <tr><td>Starter ($99/mo)</td><td>300</td><td>200,000</td><td>20</td></tr>
                  <tr><td>Growth ($299/mo)</td><td>1,000</td><td>1,000,000</td><td>50</td></tr>
                  <tr><td>Enterprise</td><td>Custom</td><td>Custom</td><td>Custom</td></tr>
                </tbody>
              </table>
            </section>

            {/* CTA */}
            <section className="sdk-cta">
              <h2>Ready to build?</h2>
              <p>Get your API key and start routing in under 5 minutes.</p>
              <div className="sdk-cta-buttons">
                <Link to="/signup" className="sdk-btn-primary">Get API Key</Link>
                <Link to="/playground" className="sdk-btn-secondary">Try Playground</Link>
                <Link to="/docs/sdks" className="sdk-btn-secondary">Quickstart Guide</Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import{u as d,r as c,j as e,N as p,L as i,F as m}from"./index-DV_9YW4V.js";const l=[{category:"Chat Completions",id:"chat",methods:[{name:"chat.completions.create",description:"Send a prompt to Slancha's intelligent router. The router automatically selects the optimal model based on task complexity, latency requirements, and cost.",params:[{name:"messages",type:"Message[]",required:!0,desc:"Array of chat messages with role and content"},{name:"model",type:"string",required:!1,desc:'Model hint. Default: "auto" (router decides). Can override with specific model ID.'},{name:"temperature",type:"number",required:!1,desc:"Sampling temperature (0-2). Default: 1.0"},{name:"max_tokens",type:"number",required:!1,desc:"Maximum tokens to generate. Default: model-dependent"},{name:"stream",type:"boolean",required:!1,desc:"Stream response tokens. Default: false"},{name:"top_p",type:"number",required:!1,desc:"Nucleus sampling threshold. Default: 1.0"},{name:"stop",type:"string | string[]",required:!1,desc:"Stop sequences. Generation stops when encountered."},{name:"tools",type:"Tool[]",required:!1,desc:"Tool/function definitions for tool use"},{name:"response_format",type:"object",required:!1,desc:'{ type: "json_object" } for JSON mode'}],python:`from slancha import Slancha

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
print(f"Cost: \${response.usage.cost:.6f}")`,typescript:`import Slancha from '@slancha/sdk';

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
console.log(\`Cost: $\${response.usage.cost.toFixed(6)}\`);`,response:`{
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
}`},{name:"chat.completions.create (streaming)",description:"Stream response tokens as they are generated. Returns an async iterator of server-sent events.",params:[{name:"messages",type:"Message[]",required:!0,desc:"Array of chat messages"},{name:"stream",type:"true",required:!0,desc:"Must be true for streaming"}],python:`stream = client.chat.completions.create(
    messages=[{"role": "user", "content": "Write a poem"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`,typescript:`const stream = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Write a poem' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}`,response:`data: {"id":"chatcmpl-abc123","choices":[{"delta":{"content":"In"},"index":0}]}

data: {"id":"chatcmpl-abc123","choices":[{"delta":{"content":" the"},"index":0}]}

data: {"id":"chatcmpl-abc123","choices":[{"delta":{"content":" quantum"},"index":0}]}

data: [DONE]`}]},{category:"Evaluations",id:"evals",methods:[{name:"evals.create",description:"Run an evaluation across multiple models. Slancha automatically benchmarks models on your test cases and promotes the best performer to your routing pool.",params:[{name:"name",type:"string",required:!0,desc:"Evaluation run name"},{name:"models",type:"string[]",required:!0,desc:"Model IDs to evaluate"},{name:"test_cases",type:"TestCase[]",required:!0,desc:"Array of { input, expected_output } pairs"},{name:"scorers",type:"string[]",required:!0,desc:'Scoring metrics: "exact_match", "semantic_similarity", "latency", "cost", "custom"'},{name:"auto_promote",type:"boolean",required:!1,desc:"Auto-promote winner to routing pool. Default: true"},{name:"threshold",type:"number",required:!1,desc:"Minimum score to pass (0-1). Default: 0.8"}],python:`eval_run = client.evals.create(
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
print(f"Status: {eval_run.status}")  # "running"`,typescript:`const evalRun = await client.evals.create({
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

console.log(\`Eval ID: \${evalRun.id}\`);`,response:`{
  "id": "eval_run_xyz789",
  "name": "customer-support-v3",
  "status": "running",
  "models": ["gpt-4o", "claude-sonnet-4-20250514", "llama-3.1-70b"],
  "test_case_count": 2,
  "scorers": ["semantic_similarity", "latency", "cost"],
  "created_at": "2026-03-31T10:00:00Z",
  "estimated_completion": "2026-03-31T10:05:00Z"
}`},{name:"evals.get",description:"Get evaluation results including per-model scores, winner, and promotion status.",params:[{name:"eval_id",type:"string",required:!0,desc:"Evaluation run ID"}],python:`result = client.evals.get("eval_run_xyz789")

print(f"Winner: {result.winner}")
print(f"Promoted: {result.auto_promoted}")

for model in result.scores:
    print(f"  {model.name}: {model.overall:.2f}")`,typescript:"const result = await client.evals.get('eval_run_xyz789');\n\nconsole.log(`Winner: ${result.winner}`);\nfor (const model of result.scores) {\n  console.log(`  ${model.name}: ${model.overall.toFixed(2)}`);\n}",response:`{
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
}`},{name:"evals.list",description:"List all evaluation runs with optional filters.",params:[{name:"status",type:"string",required:!1,desc:'"running" | "completed" | "failed"'},{name:"limit",type:"number",required:!1,desc:"Max results. Default: 20"}],python:`runs = client.evals.list(status="completed", limit=5)
for run in runs.data:
    print(f"{run.name}: winner={run.winner}")`,typescript:"const runs = await client.evals.list({ status: 'completed', limit: 5 });\nfor (const run of runs.data) {\n  console.log(`${run.name}: winner=${run.winner}`);\n}",response:`{
  "data": [
    { "id": "eval_run_xyz789", "name": "customer-support-v3", "winner": "claude-sonnet-4-20250514", "status": "completed" },
    { "id": "eval_run_abc456", "name": "code-gen-v2", "winner": "gpt-4o", "status": "completed" }
  ],
  "has_more": false
}`}]},{category:"Fine-Tuning",id:"fine-tuning",methods:[{name:"training.create",description:"Start a fine-tuning job. Slancha automatically selects the best technique (LoRA, QLoRA, full fine-tune) based on your data size and base model.",params:[{name:"name",type:"string",required:!0,desc:"Fine-tune job name"},{name:"base_model",type:"string",required:!0,desc:"Base model to fine-tune"},{name:"training_data",type:"TrainingSample[]",required:!0,desc:"Array of { messages } training examples"},{name:"validation_split",type:"number",required:!1,desc:"Validation set fraction. Default: 0.1"},{name:"epochs",type:"number",required:!1,desc:"Training epochs. Default: auto"},{name:"auto_deploy",type:"boolean",required:!1,desc:"Deploy to routing pool when done. Default: false"}],python:`job = client.training.create(
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

print(f"Job: {job.id}, technique: {job.technique}")`,typescript:`const job = await client.training.create({
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

console.log(\`Job: \${job.id}, technique: \${job.technique}\`);`,response:`{
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
}`},{name:"training.get",description:"Check fine-tuning job status and metrics.",params:[{name:"job_id",type:"string",required:!0,desc:"Fine-tuning job ID"}],python:`job = client.training.get("ft_job_abc123")
print(f"Status: {job.status}")
print(f"Loss: {job.metrics.train_loss:.4f}")
print(f"Val accuracy: {job.metrics.val_accuracy:.2%}")`,typescript:"const job = await client.training.get('ft_job_abc123');\nconsole.log(`Status: ${job.status}`);\nconsole.log(`Loss: ${job.metrics.trainLoss.toFixed(4)}`);",response:`{
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
}`}]},{category:"Deployments",id:"deployments",methods:[{name:"deployments.create",description:"Create a deployment configuration that defines routing rules, model pool, and optimization targets.",params:[{name:"name",type:"string",required:!0,desc:"Deployment name"},{name:"routing_config",type:"RoutingConfig",required:!0,desc:"Model pool and routing rules"},{name:"optimization_target",type:"string",required:!1,desc:'"cost" | "latency" | "quality" | "balanced". Default: "balanced"'},{name:"rate_limit",type:"number",required:!1,desc:"Requests per minute. Default: 1000"}],python:`deployment = client.deployments.create(
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
print(f"Endpoint: {deployment.endpoint}")`,typescript:`const deployment = await client.deployments.create({
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

console.log(\`Endpoint: \${deployment.endpoint}\`);`,response:`{
  "id": "deploy_prod123",
  "name": "prod-support",
  "endpoint": "https://api.slancha.ai/v1/deployments/deploy_prod123",
  "status": "active",
  "models": ["gpt-4o", "claude-sonnet-4-20250514", "ft:llama-3.1-8b:support-bot-v2"],
  "optimization_target": "cost",
  "rate_limit": 5000,
  "created_at": "2026-03-31T10:00:00Z"
}`},{name:"deployments.metrics",description:"Get real-time metrics for a deployment: latency, cost, routing distribution, error rates.",params:[{name:"deployment_id",type:"string",required:!0,desc:"Deployment ID"},{name:"period",type:"string",required:!1,desc:'"1h" | "24h" | "7d" | "30d". Default: "24h"'}],python:`metrics = client.deployments.metrics(
    "deploy_prod123", period="24h"
)
print(f"Requests: {metrics.total_requests}")
print(f"Avg latency: {metrics.avg_latency_ms}ms")
print(f"Total cost: \${metrics.total_cost:.2f}")
print(f"Error rate: {metrics.error_rate:.2%}")`,typescript:"const metrics = await client.deployments.metrics(\n  'deploy_prod123', { period: '24h' }\n);\nconsole.log(`Requests: ${metrics.totalRequests}`);\nconsole.log(`Avg latency: ${metrics.avgLatencyMs}ms`);",response:`{
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
}`}]},{category:"Datasets",id:"datasets",methods:[{name:"datasets.upload",description:"Upload a dataset for evaluations or fine-tuning. Supports JSONL, CSV, and Parquet formats.",params:[{name:"name",type:"string",required:!0,desc:"Dataset name"},{name:"file",type:"file path | buffer",required:!0,desc:"Path to JSONL/CSV/Parquet file"},{name:"purpose",type:"string",required:!0,desc:'"eval" | "fine-tune" | "both"'}],python:`dataset = client.datasets.upload(
    name="support-tickets-march",
    file="./data/tickets.jsonl",
    purpose="both"
)
print(f"Uploaded: {dataset.id} ({dataset.row_count} rows)")`,typescript:`const dataset = await client.datasets.upload({
  name: 'support-tickets-march',
  file: fs.createReadStream('./data/tickets.jsonl'),
  purpose: 'both',
});
console.log(\`Uploaded: \${dataset.id} (\${dataset.rowCount} rows)\`);`,response:`{
  "id": "ds_march_tickets",
  "name": "support-tickets-march",
  "format": "jsonl",
  "row_count": 2847,
  "size_bytes": 4521088,
  "purpose": "both",
  "created_at": "2026-03-31T10:00:00Z"
}`}]},{category:"Router",id:"router",methods:[{name:"router.config",description:"Get or update router configuration: model pool, routing weights, fallback behavior, and optimization targets.",params:[{name:"models",type:"string[]",required:!1,desc:"Update active model pool"},{name:"optimization_target",type:"string",required:!1,desc:'"cost" | "latency" | "quality" | "balanced"'},{name:"fallback",type:"string",required:!1,desc:"Fallback model when primary is unavailable"}],python:`# Get current config
config = client.router.config()
print(f"Active models: {config.models}")
print(f"Target: {config.optimization_target}")

# Update config
client.router.config(
    optimization_target="latency",
    fallback="gpt-4o-mini"
)`,typescript:`// Get current config
const config = await client.router.config();
console.log(\`Models: \${config.models.join(', ')}\`);

// Update
await client.router.config({
  optimizationTarget: 'latency',
  fallback: 'gpt-4o-mini',
});`,response:`{
  "models": ["gpt-4o", "claude-sonnet-4-20250514", "llama-3.1-70b", "ft:llama-3.1-8b:support-bot-v2"],
  "optimization_target": "balanced",
  "fallback": "gpt-4o",
  "routing_version": "2026-03-31",
  "auto_learning": true,
  "learning_rate": 0.01
}`}]}],u=[{code:400,name:"Bad Request",desc:"Invalid parameters. Check the error message for details."},{code:401,name:"Unauthorized",desc:"Invalid or missing API key."},{code:403,name:"Forbidden",desc:"Your plan doesn't include this feature."},{code:429,name:"Rate Limited",desc:"Too many requests. Implement exponential backoff."},{code:500,name:"Internal Error",desc:"Server error. Retry with backoff. If persistent, contact support."},{code:503,name:"Service Unavailable",desc:"Model temporarily unavailable. Router will auto-failover."}];function h({method:t,lang:r}){const[n,o]=c.useState(!1),s=r==="python"?t.python:t.typescript;return e.jsxs("div",{className:"sdk-method-card",id:t.name.replace(/[^a-z0-9]/gi,"-").toLowerCase(),children:[e.jsx("div",{className:"sdk-method-header",children:e.jsx("code",{className:"sdk-method-name",children:t.name})}),e.jsx("p",{className:"sdk-method-desc",children:t.description}),t.params&&t.params.length>0&&e.jsxs("div",{className:"sdk-params",children:[e.jsx("h4",{children:"Parameters"}),e.jsxs("table",{className:"sdk-params-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Required"}),e.jsx("th",{children:"Description"})]})}),e.jsx("tbody",{children:t.params.map(a=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:a.name})}),e.jsx("td",{children:e.jsx("code",{className:"sdk-type",children:a.type})}),e.jsx("td",{children:a.required?e.jsx("span",{className:"sdk-required",children:"Yes"}):e.jsx("span",{className:"sdk-optional",children:"No"})}),e.jsx("td",{children:a.desc})]},a.name))})]})]}),e.jsxs("div",{className:"sdk-code-block",children:[e.jsx("div",{className:"sdk-code-header",children:e.jsx("span",{children:r==="python"?"Python":"TypeScript"})}),e.jsx("pre",{children:e.jsx("code",{children:s})})]}),e.jsxs("button",{className:`sdk-response-toggle ${n?"active":""}`,onClick:()=>o(!n),children:[n?"Hide":"Show"," Response",e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",style:{transform:n?"rotate(180deg)":"none",transition:"transform 0.2s"},children:e.jsx("path",{d:"M2 4L6 8L10 4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})]}),n&&e.jsxs("div",{className:"sdk-code-block sdk-response",children:[e.jsx("div",{className:"sdk-code-header",children:e.jsx("span",{children:"Response"})}),e.jsx("pre",{children:e.jsx("code",{children:t.response})})]})]})}function g(){d({title:"SDK Reference | Slancha",description:"Complete Python and TypeScript SDK reference for Slancha. Method signatures, typed parameters, request examples, and response schemas for chat completions, evaluations, fine-tuning, deployments, and routing."});const[t,r]=c.useState("python"),[n,o]=c.useState("chat");return e.jsxs(e.Fragment,{children:[e.jsx(p,{}),e.jsx("main",{id:"main-content",className:"sdk-ref",children:e.jsxs("div",{className:"sdk-ref-layout",children:[e.jsxs("aside",{className:"sdk-sidebar",children:[e.jsxs("div",{className:"sdk-sidebar-header",children:[e.jsx("h3",{children:"API Reference"}),e.jsxs("div",{className:"sdk-lang-toggle",children:[e.jsx("button",{className:t==="python"?"active":"",onClick:()=>r("python"),children:"Python"}),e.jsx("button",{className:t==="typescript"?"active":"",onClick:()=>r("typescript"),children:"TypeScript"})]})]}),e.jsxs("nav",{className:"sdk-nav",children:[l.map(s=>e.jsxs("div",{className:"sdk-nav-group",children:[e.jsx("a",{href:`#${s.id}`,className:`sdk-nav-category ${n===s.id?"active":""}`,onClick:()=>o(s.id),children:s.category}),s.methods.map(a=>e.jsx("a",{href:`#${a.name.replace(/[^a-z0-9]/gi,"-").toLowerCase()}`,className:"sdk-nav-method",children:a.name},a.name))]},s.id)),e.jsx("div",{className:"sdk-nav-group",children:e.jsx("a",{href:"#errors",className:"sdk-nav-category",onClick:()=>o("errors"),children:"Errors"})}),e.jsx("div",{className:"sdk-nav-group",children:e.jsx("a",{href:"#auth",className:"sdk-nav-category",onClick:()=>o("auth"),children:"Authentication"})})]})]}),e.jsxs("div",{className:"sdk-content",children:[e.jsxs("div",{className:"sdk-hero",children:[e.jsx("span",{className:"sdk-eyebrow",children:"Developer Reference"}),e.jsx("h1",{children:"SDK Reference"}),e.jsx("p",{children:"Complete method reference for the Slancha Python and TypeScript SDKs. OpenAI-compatible — swap your base URL and start routing."}),e.jsx("div",{className:"sdk-install-bar",children:e.jsx("code",{children:t==="python"?"pip install slancha":"npm install @slancha/sdk"})})]}),e.jsxs("section",{className:"sdk-section",id:"auth",children:[e.jsx("h2",{children:"Authentication"}),e.jsx("p",{children:"All API requests require an API key. Set it as an environment variable or pass it directly:"}),e.jsxs("div",{className:"sdk-code-block",children:[e.jsx("div",{className:"sdk-code-header",children:e.jsx("span",{children:t==="python"?"Python":"TypeScript"})}),e.jsx("pre",{children:e.jsx("code",{children:t==="python"?`# Option 1: Environment variable (recommended)
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
)`:`// Option 1: Environment variable (recommended)
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
});`})})]})]}),l.map(s=>e.jsxs("section",{className:"sdk-section",id:s.id,children:[e.jsx("h2",{children:s.category}),s.methods.map(a=>e.jsx(h,{method:a,lang:t},a.name))]},s.id)),e.jsxs("section",{className:"sdk-section",id:"errors",children:[e.jsx("h2",{children:"Error Handling"}),e.jsxs("p",{children:["All errors return a JSON body with ",e.jsx("code",{children:"error.type"}),", ",e.jsx("code",{children:"error.message"}),", and the HTTP status code."]}),e.jsxs("div",{className:"sdk-code-block",children:[e.jsx("div",{className:"sdk-code-header",children:e.jsx("span",{children:t==="python"?"Python":"TypeScript"})}),e.jsx("pre",{children:e.jsx("code",{children:t==="python"?`from slancha import SlanchaError, RateLimitError

try:
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after}s")
except SlanchaError as e:
    print(f"Error {e.status}: {e.message}")`:`import { SlanchaError, RateLimitError } from '@slancha/sdk';

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
}`})})]}),e.jsxs("table",{className:"sdk-errors-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Code"}),e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Description"})]})}),e.jsx("tbody",{children:u.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:s.code})}),e.jsx("td",{children:s.name}),e.jsx("td",{children:s.desc})]},s.code))})]})]}),e.jsxs("section",{className:"sdk-section",id:"rate-limits",children:[e.jsx("h2",{children:"Rate Limits"}),e.jsxs("table",{className:"sdk-errors-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Plan"}),e.jsx("th",{children:"Requests/min"}),e.jsx("th",{children:"Tokens/min"}),e.jsx("th",{children:"Concurrent"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Free"}),e.jsx("td",{children:"60"}),e.jsx("td",{children:"40,000"}),e.jsx("td",{children:"5"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Starter ($99/mo)"}),e.jsx("td",{children:"300"}),e.jsx("td",{children:"200,000"}),e.jsx("td",{children:"20"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Growth ($299/mo)"}),e.jsx("td",{children:"1,000"}),e.jsx("td",{children:"1,000,000"}),e.jsx("td",{children:"50"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Enterprise"}),e.jsx("td",{children:"Custom"}),e.jsx("td",{children:"Custom"}),e.jsx("td",{children:"Custom"})]})]})]})]}),e.jsxs("section",{className:"sdk-cta",children:[e.jsx("h2",{children:"Ready to build?"}),e.jsx("p",{children:"Get your API key and start routing in under 5 minutes."}),e.jsxs("div",{className:"sdk-cta-buttons",children:[e.jsx(i,{to:"/signup",className:"sdk-btn-primary",children:"Get API Key"}),e.jsx(i,{to:"/playground",className:"sdk-btn-secondary",children:"Try Playground"}),e.jsx(i,{to:"/docs/sdks",className:"sdk-btn-secondary",children:"Quickstart Guide"})]})]})]})]})}),e.jsx(m,{})]})}export{g as default};

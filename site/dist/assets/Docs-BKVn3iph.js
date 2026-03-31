import{u as c,j as e,a as u,N as d,L as m,F as p}from"./index-CH_yvuP7.js";import{M as h}from"./index-_fkm8lbS.js";const r=[{slug:"getting-started",title:"Getting Started",section:"Introduction",order:1,body:`# Getting Started with Slancha

Welcome to Slancha — the platform that closes the AI engineering loop.

## Quick Start

### 1. Create an Account

Sign up at [slancha.ai/signup](/signup). You'll get instant access to the free router.

### 2. Create an API Key

Navigate to your [Dashboard](/dashboard) → **API Keys** → **Create Key**.

Your API key will be shown once — copy it and store it securely. Keys use the format \`sk-sl_xxxxxxxxxxxx\`.

### 3. Make Your First Request

The Slancha Router is drop-in compatible with the OpenAI API format:

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-sl_your_key_here"
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello, world!"}]
)

print(response.choices[0].message.content)
\`\`\`

### 4. Check Your Usage

Visit **Dashboard** → **Usage** to see request counts, model distribution, and latency metrics.

## What's Next?

- [Developer Quickstart](/docs/quickstart) — full tutorial: install SDK, run evals, deploy a model
- [Router Configuration](/docs/router) — customize routing rules
- [API Reference](/docs/api-reference) — full endpoint documentation
- [Models](/docs/models) — available models and their characteristics`},{slug:"quickstart",title:"Developer Quickstart",section:"Introduction",order:2,body:`# Developer Quickstart

Go from zero to a production-ready AI pipeline in 15 minutes. This guide walks you through installing the Slancha SDK, running your first evaluation, deploying a model, and closing the loop with post-training.

## Prerequisites

- Python 3.9+
- A Slancha account ([sign up free](/signup))
- An API key from your [Dashboard](/dashboard)

## Step 1: Install the SDK

\`\`\`bash
pip install slancha
\`\`\`

Set your API key as an environment variable:

\`\`\`bash
export SLANCHA_API_KEY="sk-sl_your_key_here"
\`\`\`

## Step 2: Route Your First Request

The Slancha client is drop-in compatible with the OpenAI SDK. Switch to intelligent routing with one line:

\`\`\`python
from slancha import Slancha

client = Slancha()

response = client.chat.completions.create(
    model="auto",  # router picks the best model
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Write a Python function to merge two sorted lists."}
    ]
)

print(response.choices[0].message.content)
print(f"Routed to: {response.model}")
\`\`\`

The \`auto\` model tells the router to pick the best model based on your configured latency, cost, and quality preferences.

## Step 3: Run Your First Evaluation

Evaluations measure how well models perform on your specific use case. Create an eval suite with test cases:

\`\`\`python
from slancha import Slancha

client = Slancha()

# Define your test cases
test_cases = [
    {
        "input": [{"role": "user", "content": "What is 2+2?"}],
        "expected": "4",
        "tags": ["math", "simple"]
    },
    {
        "input": [{"role": "user", "content": "Write a haiku about Python."}],
        "expected_traits": ["5-7-5 syllable structure", "mentions Python"],
        "tags": ["creative", "poetry"]
    },
    {
        "input": [{"role": "user", "content": "Explain the GIL in Python in one sentence."}],
        "expected_traits": ["mentions Global Interpreter Lock", "mentions threading"],
        "tags": ["technical", "python"]
    }
]

# Run the eval across multiple models
eval_run = client.evals.create(
    name="coding-assistant-v1",
    models=["llama-3.1-70b", "gpt-4o", "claude-sonnet-4-20250514"],
    test_cases=test_cases,
    scorers=["exact_match", "trait_check", "latency", "cost"]
)

print(f"Eval run: {eval_run.id}")
print(f"Dashboard: https://app.slancha.ai/evals/{eval_run.id}")
\`\`\`

### View Results

Results appear in your [Dashboard](/dashboard) → **Evaluations**, or fetch them programmatically:

\`\`\`python
results = client.evals.get(eval_run.id)

for model_result in results.models:
    print(f"{model_result.model}:")
    print(f"  Accuracy: {model_result.accuracy:.1%}")
    print(f"  Avg latency: {model_result.avg_latency_ms}ms")
    print(f"  Cost per 1K: \${model_result.cost_per_1k:.4f}")
\`\`\`

Example output:

\`\`\`
llama-3.1-70b:
  Accuracy: 73.3%
  Avg latency: 180ms
  Cost per 1K: $0.0012
gpt-4o:
  Accuracy: 93.3%
  Avg latency: 420ms
  Cost per 1K: $0.0075
claude-sonnet-4-20250514:
  Accuracy: 96.7%
  Avg latency: 380ms
  Cost per 1K: $0.0060
\`\`\`

## Step 4: Deploy the Winner

Once you've found the best model for your use case, deploy it as your production endpoint:

\`\`\`python
# Deploy the eval winner as a production config
deployment = client.deployments.create(
    name="coding-assistant-prod",
    routing_config={
        "primary_model": "claude-sonnet-4-20250514",
        "fallback_model": "gpt-4o",
        "latency_target_ms": 500,
        "max_cost_per_1k": 0.01
    },
    eval_id=eval_run.id  # link deployment to eval for tracking
)

print(f"Deployment live: {deployment.endpoint}")
\`\`\`

Your deployment gets its own endpoint. Route production traffic to it:

\`\`\`python
# Production requests hit your deployment config
response = client.chat.completions.create(
    model=deployment.model_alias,  # "coding-assistant-prod"
    messages=[{"role": "user", "content": "How do I use asyncio.gather?"}]
)
\`\`\`

## Step 5: Close the Loop with Post-Training

This is where Slancha is different. Failed eval cases automatically become training candidates for your next fine-tuning run:

\`\`\`python
# Get the low-scoring examples from your eval
failures = client.evals.get_failures(
    eval_id=eval_run.id,
    threshold=0.7  # examples scoring below 70%
)

print(f"Found {len(failures)} improvement candidates")

# Create a fine-tuning job from eval failures
finetune = client.training.create(
    name="coding-assistant-v2",
    base_model="llama-3.1-70b",
    training_data=failures.to_training_format(),
    eval_id=eval_run.id  # track which eval drove this training
)

print(f"Fine-tuning job: {finetune.id}")
print(f"Status: {finetune.status}")
\`\`\`

When the fine-tune completes, run the same eval suite against the improved model to measure gains:

\`\`\`python
# Re-eval with the fine-tuned model
v2_eval = client.evals.create(
    name="coding-assistant-v2-verification",
    models=["coding-assistant-v2-ft", "claude-sonnet-4-20250514"],
    test_cases=test_cases,
    scorers=["exact_match", "trait_check", "latency", "cost"],
    baseline_eval=eval_run.id  # compare against v1
)
\`\`\`

## The Full Loop

You've now completed one cycle of the Slancha loop:

1. **Route** — send requests through the intelligent router
2. **Evaluate** — measure model quality on your use cases
3. **Deploy** — put the best model in production
4. **Post-train** — use eval failures to improve the model
5. **Repeat** — each cycle starts from a higher baseline

This cycle runs continuously. Set up automated evals on a schedule, trigger fine-tuning when accuracy drops below your threshold, and auto-promote models that pass verification.

## What's Next

- [Router Configuration](/docs/router) — fine-tune routing rules and latency targets
- [Evaluations Guide](/docs/evaluations) — advanced eval patterns, custom scorers, scheduled evals
- [Deployment Guide](/docs/deployments) — A/B testing, canary rollouts, rollback
- [API Reference](/docs/api-reference) — full endpoint documentation`},{slug:"evaluations",title:"Evaluations Guide",section:"Evaluate",order:3,body:`# Evaluations Guide

Evaluations are the core of Slancha's improvement loop. They measure model performance on your specific use cases and generate the data that drives fine-tuning.

## Core Concepts

### Test Cases

A test case is an input-output pair that defines what "good" looks like:

\`\`\`python
test_case = {
    "input": [{"role": "user", "content": "Summarize this article..."}],
    "expected": "A concise summary...",           # for exact/semantic match
    "expected_traits": ["under 100 words", "mentions key finding"],  # for trait scoring
    "tags": ["summarization", "news"],            # for filtering and grouping
    "weight": 1.0                                 # importance multiplier
}
\`\`\`

### Scorers

Scorers evaluate model outputs against your test cases:

| Scorer | What it measures |
|--------|-----------------|
| \`exact_match\` | Output matches expected string exactly |
| \`semantic_match\` | Output is semantically equivalent (uses embeddings) |
| \`trait_check\` | Output satisfies listed traits (uses an LLM judge) |
| \`latency\` | Time to first token and total response time |
| \`cost\` | Token cost at current model pricing |
| \`toxicity\` | Checks for harmful or inappropriate content |
| \`json_valid\` | Output is valid JSON matching an optional schema |

### Custom Scorers

Write your own scoring logic in Python:

\`\`\`python
def code_compiles(output, test_case):
    """Check if generated code actually runs."""
    try:
        compile(output, "<eval>", "exec")
        return {"score": 1.0, "reason": "Code compiles"}
    except SyntaxError as e:
        return {"score": 0.0, "reason": f"SyntaxError: {e}"}

eval_run = client.evals.create(
    name="code-gen-eval",
    models=["gpt-4o", "llama-3.1-70b"],
    test_cases=code_test_cases,
    scorers=["latency", "cost", code_compiles]  # mix built-in + custom
)
\`\`\`

## Eval Patterns

### Scheduled Evaluations

Run evals automatically on a schedule to catch model drift:

\`\`\`python
schedule = client.evals.schedule(
    name="daily-regression",
    test_suite_id="ts_abc123",
    models=["coding-assistant-prod"],
    cron="0 6 * * *",  # daily at 6am UTC
    alert_threshold=0.85  # alert if accuracy drops below 85%
)
\`\`\`

### A/B Evaluations

Compare your current production model against a challenger:

\`\`\`python
ab_eval = client.evals.create(
    name="v1-vs-v2",
    models=["coding-assistant-v1", "coding-assistant-v2-ft"],
    test_cases=test_cases,
    scorers=["semantic_match", "trait_check", "latency", "cost"],
    statistical_test="paired_t"  # significance testing
)
\`\`\`

### Production Sampling

Evaluate a sample of live production traffic:

\`\`\`python
prod_eval = client.evals.create_from_production(
    deployment="coding-assistant-prod",
    sample_rate=0.05,  # eval 5% of traffic
    scorers=["trait_check", "toxicity"],
    duration_hours=24
)
\`\`\`

## Best Practices

1. **Start with 20-50 test cases** that cover your core use cases. Grow to 200+ as you learn where models fail.
2. **Tag everything.** Tags let you slice results by category and find systematic weaknesses.
3. **Use trait_check over exact_match** for open-ended tasks. Exact matching is too brittle for natural language.
4. **Run evals before every deployment.** Never promote a model without comparing it to the current production baseline.
5. **Review failures manually** every week. Automated scoring catches patterns, but human review catches nuance.`},{slug:"deployments",title:"Deployment Guide",section:"Deploy",order:4,body:`# Deployment Guide

Deployments are production-ready model configurations. Each deployment gets a stable endpoint, routing rules, and monitoring — connected to the eval that validated it.

## Creating a Deployment

\`\`\`python
deployment = client.deployments.create(
    name="support-bot-prod",
    routing_config={
        "primary_model": "gpt-4o",
        "fallback_model": "llama-3.1-70b",
        "latency_target_ms": 300,
        "max_cost_per_1k": 0.008
    },
    eval_id="eval_abc123"  # optional: link to validation eval
)
\`\`\`

## Routing Configuration

Each deployment supports fine-grained routing:

| Parameter | Type | Description |
|-----------|------|-------------|
| \`primary_model\` | string | First-choice model |
| \`fallback_model\` | string | Used when primary is unavailable or exceeds targets |
| \`latency_target_ms\` | integer | P99 latency ceiling |
| \`max_cost_per_1k\` | float | Maximum cost per 1,000 tokens |
| \`min_accuracy\` | float | Minimum eval accuracy (triggers fallback if degraded) |

## Canary Rollouts

Gradually shift traffic to a new model:

\`\`\`python
client.deployments.update(
    deployment_id=deployment.id,
    canary={
        "challenger_model": "coding-assistant-v2-ft",
        "traffic_percent": 10,  # start with 10%
        "auto_promote": True,   # promote if metrics hold
        "eval_threshold": 0.90  # accuracy gate
    }
)
\`\`\`

The canary monitor compares challenger performance against the primary model in real time. If the challenger meets all thresholds over 24 hours, it automatically promotes to primary.

## Rollback

If a deployment degrades, roll back instantly:

\`\`\`python
client.deployments.rollback(
    deployment_id=deployment.id,
    to_version=2  # specific version, or omit for previous
)
\`\`\`

Rollbacks are instant — they switch the routing config, not the model infrastructure.

## Monitoring

Every deployment tracks:

- **Request volume** — requests/min, token throughput
- **Latency** — P50, P95, P99 response times
- **Error rate** — 4xx and 5xx responses
- **Cost** — running spend vs. budget
- **Model distribution** — which models are handling traffic

View metrics in **Dashboard** → **Deployments** → your deployment, or query programmatically:

\`\`\`python
metrics = client.deployments.metrics(
    deployment_id=deployment.id,
    period="24h"
)

print(f"Requests: {metrics.total_requests}")
print(f"P99 latency: {metrics.p99_latency_ms}ms")
print(f"Error rate: {metrics.error_rate:.2%}")
print(f"Cost: \${metrics.total_cost:.2f}")
\`\`\`

## Best Practices

1. **Always link deployments to evals.** This creates an audit trail of why a model was deployed.
2. **Use canary rollouts** for any model change in production. Even fine-tuned models can regress on edge cases.
3. **Set alerts** on latency and error rate — catch degradation before users do.
4. **Name deployments by use case**, not model name. \`support-bot-prod\` is better than \`gpt4o-v3\` because the model behind it will change.`},{slug:"router",title:"Router Configuration",section:"Router",order:5,body:`# Router Configuration

The Slancha Router automatically selects the optimal model for each request based on your configured preferences.

## How Routing Works

When a request arrives, the router evaluates:

1. **Latency target** — your maximum acceptable response time
2. **Model preferences** — which models you've opted into or excluded
3. **Cost constraints** — your budget tolerance per request
4. **Task complexity** — estimated from the input (longer prompts, system messages, structured output requests)

The router scores available models on all four dimensions and routes to the best fit.

## Configuration

Configure your router in **Dashboard** → **Router**.

### Latency Target

Set your P99 latency target in milliseconds. The router will prefer models that consistently meet this target.

| Setting | Typical Use Case |
|---------|-----------------|
| 200ms | Real-time chat, autocomplete |
| 500ms | Interactive applications |
| 2000ms | Background processing, batch jobs |
| 5000ms+ | Cost-optimized, latency-insensitive |

### Model Preferences

You can include or exclude specific models:

\`\`\`json
{
  "preferred_models": ["gpt-4o", "claude-sonnet-4-20250514", "llama-3.1-70b"],
  "excluded_models": [],
  "fallback_model": "auto"
}
\`\`\`

Setting \`fallback_model\` to \`"auto"\` lets the router pick the best available option when preferred models can't meet your constraints.

## The \`auto\` Model

When you set \`model: "auto"\` in your API request, you're using the router's full optimization. It considers all configured preferences and current system state.

For explicit control, you can still specify any model by name — the request bypasses routing and goes directly to that model.`},{slug:"api-reference",title:"API Reference",section:"API",order:6,body:`# API Reference

The Slancha API is compatible with the OpenAI Chat Completions format. If you're already using the OpenAI SDK, switching is a one-line change.

## Base URL

\`\`\`
https://api.slancha.ai/v1
\`\`\`

## Authentication

All requests require an API key passed via the \`Authorization\` header:

\`\`\`
Authorization: Bearer sk-sl_your_key_here
\`\`\`

## Endpoints

### POST /chat/completions

Create a chat completion.

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| model | string | Yes | Model name or \`"auto"\` for router |
| messages | array | Yes | Array of message objects |
| temperature | number | No | Sampling temperature (0-2). Default: 1 |
| max_tokens | integer | No | Maximum tokens to generate |
| stream | boolean | No | Stream response chunks. Default: false |

**Example:**

\`\`\`bash
curl https://api.slancha.ai/v1/chat/completions \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "auto",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ]
  }'
\`\`\`

**Response:**

\`\`\`json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1711680000,
  "model": "llama-3.1-70b",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "The capital of France is Paris."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 8,
    "total_tokens": 33
  }
}
\`\`\`

### GET /models

List available models.

\`\`\`bash
curl https://api.slancha.ai/v1/models \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

## Rate Limits

| Tier | Requests/min | Tokens/min |
|------|-------------|------------|
| Free (Router) | 60 | 100,000 |
| Platform | 600 | 1,000,000 |
| Enterprise | Custom | Custom |

## Error Codes

| Code | Meaning |
|------|---------|
| 401 | Invalid or missing API key |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Model temporarily unavailable |`},{slug:"models",title:"Available Models",section:"API",order:7,body:`# Available Models

The Slancha Router can route to any of the following models. When using \`model: "auto"\`, the router selects the best fit. You can also specify any model by name.

## Frontier Models

| Model | Provider | Context | Best For |
|-------|----------|---------|----------|
| gpt-4o | OpenAI | 128K | Complex reasoning, analysis |
| claude-sonnet-4-20250514 | Anthropic | 200K | Long documents, coding, analysis |
| gemini-2.0-flash | Google | 1M | Large context, multimodal |

## Open-Weight Models

| Model | Parameters | Context | Best For |
|-------|-----------|---------|----------|
| llama-3.1-70b | 70B | 128K | General purpose, good balance |
| llama-3.1-8b | 8B | 128K | Fast, cost-effective |
| qwen-2.5-72b | 72B | 128K | Multilingual, coding |
| mixtral-8x7b | 46.7B (MoE) | 32K | Fast, cost-efficient |

## Specialized Models

| Model | Focus | Best For |
|-------|-------|----------|
| codellama-70b | Code generation | IDE integration, code review |
| deepseek-coder-33b | Code + reasoning | Complex coding tasks |

## Model Selection

The router considers:
- **Your latency target** — smaller models for tight latency budgets
- **Task complexity** — frontier models for complex reasoning, efficient models for simple tasks
- **Cost** — optimal cost-per-token for your quality requirements
- **Availability** — automatic failover if a model is temporarily unavailable

You can lock specific models by setting them in your [Router Configuration](/docs/router).`},{slug:"post-training",title:"Post-Training Guide",section:"Post-Train",order:8,body:`# Post-Training Guide

Post-training is what makes Slancha different. Instead of treating model evaluation and model improvement as separate workflows, Slancha connects them: eval failures become training data, fine-tuned models get re-evaluated, and the cycle repeats automatically.

## How It Works

1. You run an [evaluation](/docs/evaluations) against your production model
2. Slancha identifies the test cases where the model scored below your threshold
3. Those failures become training candidates
4. You review and approve the training set, then kick off a fine-tuning job
5. The fine-tuned model gets evaluated against the same test suite
6. If it passes, it's promoted to production via [canary rollout](/docs/deployments)

## Extracting Training Data from Evals

Every eval run generates a set of failures. These are the examples your model got wrong and the most valuable data for improvement.

\`\`\`python
from slancha import Slancha

client = Slancha()

# Get failures from a completed eval
failures = client.evals.get_failures(
    eval_id="eval_abc123",
    threshold=0.7  # examples scoring below 70%
)

print(f"Found {len(failures)} improvement candidates")

# Review individual failures
for f in failures[:5]:
    print(f"Input: {f.input[0]['content'][:80]}...")
    print(f"Expected: {f.expected[:80]}...")
    print(f"Got: {f.model_output[:80]}...")
    print(f"Score: {f.score:.2f}")
    print("---")
\`\`\`

### Filtering Training Candidates

Not all failures make good training data. Filter by tags, score ranges, or failure patterns:

\`\`\`python
# Only failures on specific task types
code_failures = client.evals.get_failures(
    eval_id="eval_abc123",
    threshold=0.7,
    tags=["coding", "debugging"]
)

# Only near-misses (model was close but not quite right)
near_misses = client.evals.get_failures(
    eval_id="eval_abc123",
    threshold=0.7,
    min_score=0.4  # between 40-70%
)
\`\`\`

## Creating a Fine-Tuning Job

\`\`\`python
finetune = client.training.create(
    name="support-bot-v2",
    base_model="llama-3.1-70b",
    training_data=failures.to_training_format(),
    config={
        "epochs": 3,
        "learning_rate": 2e-5,
        "lora_rank": 16,       # LoRA for efficient fine-tuning
        "lora_alpha": 32
    },
    eval_id="eval_abc123"  # link to the eval that generated this data
)

print(f"Job ID: {finetune.id}")
print(f"Status: {finetune.status}")
print(f"Estimated time: {finetune.estimated_minutes}min")
\`\`\`

### Monitoring Training Progress

\`\`\`python
job = client.training.get(finetune.id)
print(f"Status: {job.status}")  # queued > running > completed
print(f"Progress: {job.progress_percent}%")

if job.status == "completed":
    print(f"Final loss: {job.metrics.final_loss:.4f}")
    print(f"Training tokens: {job.metrics.total_tokens:,}")
    print(f"Model ID: {job.output_model}")
\`\`\`

## Verification Eval

Never deploy a fine-tuned model without verifying it:

\`\`\`python
verification = client.evals.create(
    name="support-bot-v2-verification",
    models=[job.output_model, "llama-3.1-70b"],  # fine-tuned vs base
    test_cases=original_test_cases,
    scorers=["semantic_match", "trait_check", "latency", "cost"],
    baseline_eval="eval_abc123"
)

results = client.evals.get(verification.id)

for model in results.models:
    print(f"{model.model}:")
    print(f"  Accuracy: {model.accuracy:.1%}")
    print(f"  vs baseline: {model.accuracy_delta:+.1%}")
\`\`\`

Example output:

\`\`\`
support-bot-v2-ft:
  Accuracy: 89.3%
  vs baseline: +16.0%
llama-3.1-70b:
  Accuracy: 73.3%
  vs baseline: +0.0%
\`\`\`

## Auto-Promote Pipeline

Set up automated fine-tuning that triggers when model quality drops:

\`\`\`python
pipeline = client.training.create_pipeline(
    name="support-bot-continuous",
    trigger={
        "type": "eval_threshold",
        "eval_schedule": "daily-regression",
        "threshold": 0.85
    },
    training_config={
        "base_model": "llama-3.1-70b",
        "epochs": 3,
        "lora_rank": 16
    },
    verification={
        "test_suite": "ts_abc123",
        "min_accuracy": 0.88,
        "min_improvement": 0.05
    },
    promotion={
        "deployment": "support-bot-prod",
        "strategy": "canary",
        "canary_percent": 10,
        "canary_duration_hours": 24
    }
)
\`\`\`

This pipeline watches scheduled evals, automatically fine-tunes when accuracy drops, verifies the result, and deploys via canary rollout.

## Training Data Management

### Augmenting with Production Data

Combine eval failures with flagged production examples:

\`\`\`python
flagged = client.production.get_flagged(
    deployment="support-bot-prod",
    period="7d"
)

combined = failures.to_training_format() + flagged.to_training_format()

finetune = client.training.create(
    name="support-bot-v3",
    base_model="llama-3.1-70b",
    training_data=combined,
    eval_id="eval_abc123"
)
\`\`\`

### Data Quality Checks

Slancha validates training data before starting a job:

\`\`\`python
quality = client.training.validate(training_data=combined)
print(f"Total examples: {quality.total}")
print(f"Duplicates removed: {quality.duplicates}")
print(f"Invalid removed: {quality.invalid}")
print(f"Contradictions flagged: {quality.contradictions}")
print(f"Clean examples: {quality.clean}")
\`\`\`

## Best Practices

1. **Start with eval-driven training.** Use eval failures to target exactly where the model is weak.
2. **Always run verification evals.** Fine-tuning can improve target tasks while regressing on others.
3. **Use LoRA for iteration speed.** Full fine-tuning is expensive and slow. LoRA lets you iterate in hours instead of days.
4. **Keep training sets under 10K examples.** Curated, high-quality examples from real failures beat large noisy datasets.
5. **Version everything.** Slancha links evals to training jobs to deployments. Use this chain to understand why any model is in production.`},{slug:"sdks",title:"SDKs & Libraries",section:"API",order:9,body:`# SDKs & Libraries

Slancha provides official SDKs for Python and JavaScript/TypeScript, plus full OpenAI SDK compatibility.

## Python SDK

\`\`\`bash
pip install slancha
\`\`\`

\`\`\`python
from slancha import Slancha

client = Slancha()  # reads SLANCHA_API_KEY from env

# Chat completions (OpenAI-compatible)
response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello!"}]
)

# Evaluations
eval_run = client.evals.create(
    name="my-eval",
    models=["gpt-4o", "llama-3.1-70b"],
    test_cases=[...],
    scorers=["exact_match", "latency"]
)

# Deployments
deployment = client.deployments.create(
    name="my-app-prod",
    routing_config={"primary_model": "gpt-4o"}
)

# Training
finetune = client.training.create(
    name="my-model-v2",
    base_model="llama-3.1-70b",
    training_data=[...]
)
\`\`\`

## JavaScript/TypeScript SDK

\`\`\`bash
npm install @slancha/sdk
\`\`\`

\`\`\`typescript
import { Slancha } from '@slancha/sdk';

const client = new Slancha(); // reads SLANCHA_API_KEY from env

// Chat completions
const response = await client.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Hello!' }],
});

// Streaming
const stream = await client.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Write a poem.' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
\`\`\`

## OpenAI SDK Compatibility

Already using the OpenAI SDK? Point it at Slancha with one line:

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-sl_your_key_here"
)

# Everything else works exactly the same
response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello!"}]
)
\`\`\`

\`\`\`typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.slancha.ai/v1',
  apiKey: 'sk-sl_your_key_here',
});
\`\`\`

## cURL

No SDK needed:

\`\`\`bash
curl https://api.slancha.ai/v1/chat/completions \\
  -H "Authorization: Bearer $SLANCHA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
\`\`\``}],g=[{name:"Introduction",slugs:["getting-started","quickstart"]},{name:"Evaluate",slugs:["evaluations"]},{name:"Deploy",slugs:["deployments"]},{name:"Post-Train",slugs:["post-training"]},{name:"Router",slugs:["router"]},{name:"API",slugs:["api-reference","models","sdks"]}];function v(){const{slug:n}=c(),s=n||"getting-started",o=r.find(t=>t.slug===s);return n&&!o?e.jsx(u,{to:"/docs",replace:!0}):e.jsxs("div",{className:"page",children:[e.jsx(d,{}),e.jsxs("div",{className:"docs-layout",children:[e.jsx("aside",{className:"docs-sidebar",children:e.jsx("div",{className:"docs-sidebar-inner",children:g.map(t=>e.jsxs("div",{className:"docs-section",children:[e.jsx("h3",{className:"docs-section-title",children:t.name}),e.jsx("ul",{className:"docs-nav-list",children:t.slugs.map(a=>{const i=r.find(l=>l.slug===a);return i?e.jsx("li",{children:e.jsx(m,{to:`/docs/${a}`,className:`docs-nav-link${s===a?" active":""}`,children:i.title})},a):null})})]},t.name))})}),e.jsx("main",{className:"docs-content",children:o&&e.jsx("article",{className:"docs-article",children:e.jsx(h,{children:o.body})})})]}),e.jsx(p,{})]})}export{v as default};

const e=[{slug:"getting-started",title:"Getting Started",section:"Introduction",order:1,body:`# Getting Started with Slancha

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
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
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

Go from zero to a production-ready AI pipeline in 15 minutes. This guide walks you through installing the Slancha SDK, sending your first request, and seeing how Slancha automatically routes, analyzes, and optimizes your inference.

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
- [API Reference](/docs/api-reference) — full endpoint documentation`},{slug:"architecture",title:"Architecture Overview",section:"Concepts",order:3,body:`# Architecture Overview

Slancha is an end-to-end AI inference platform built on four layers that work together in a continuous improvement loop. This page explains how each layer operates and how they connect.

## The Four-Layer Pipeline

Every API request flows through a pipeline that gets smarter over time:

\`\`\`
Request → [Router] → [Task Analysis] → [Fine-Tuning] → [Inference Optimization]
   ↑                                                              |
   └──────────────── continuous redeployment ──────────────────────┘
\`\`\`

The first two layers operate on every request in real time. The last two operate asynchronously in the background, continuously improving the models that serve future requests.

---

## Layer 1: The Model Router

The router is the customer-facing gateway. It receives every API request through a single endpoint and decides which model should handle it.

**How it works:**

1. Your request arrives at \`aogutyvup5m15h-8888.proxy.runpod.net/v1/chat/completions\`
2. The Semantic Router (powered by [Aurelio Labs' open-source library](https://github.com/aurelio-labs/semantic-router)) embeds the query using a fast encoder
3. It compares the embedding against pre-defined route utterances using cosine similarity
4. The best-matching route determines which model handles the request — all in **sub-millisecond** time

**Why this matters:** Most customers send a mix of easy and hard tasks to the same expensive frontier model. A book synopsis doesn't need GPT-4o. The router captures this savings immediately — no fine-tuning required.

\`\`\`python
# You send this:
response = client.chat.completions.create(
    model="auto",          # Slancha picks the best model
    messages=[{"role": "user", "content": "Summarize this document..."}]
)
# Router decides: summarization task → routes to efficient 7B model
# Result: same quality, 78% lower cost, 3x lower latency
\`\`\`

**Key technology:** [vLLM](https://github.com/vllm-project/vllm) (v0.18.0) powers the serving layer. Its PagedAttention algorithm manages GPU memory with near-zero waste, enabling continuous batching, FP8 inference on H100/Blackwell GPUs, speculative decoding, and structured outputs.

---

## Layer 2: Task Analysis & Data Curation

Behind the router, every request is analyzed and classified. This layer builds the dataset that powers fine-tuning.

**Task categories:**

| Category | Example | Typical Model Route |
|----------|---------|-------------------|
| Summarization | Document summaries, book synopses | Efficient 7B model |
| Content generation | Writing, reports, creative text | Mid-range 13-30B model |
| Code generation | Functions, refactoring, debugging | Code-specialized model |
| Question answering | Factual retrieval, knowledge queries | General-purpose model |
| Needle-in-a-haystack | Extracting specific data from long context | Long-context model |

**How data curation works:**

1. Requests are classified by task type and complexity
2. Model responses are scored against internal quality metrics
3. High-quality request-response pairs are curated into training datasets
4. Datasets are customer-specific — your data trains your models

This happens automatically. You don't upload datasets, label data, or trigger any curation process. The system learns from your real usage patterns.

---

## Layer 3: Automated Fine-Tuning

Using the curated task data, Slancha fine-tunes smaller, task-specific models for each customer's common workloads.

**The core insight:** For hard tasks (long-form code generation, complex analysis), smaller models struggle — but smaller models **fine-tuned specifically for that task** can match or outperform frontier generalist models.

**How it works:**

1. When enough high-quality examples accumulate for a task category, a fine-tuning job is triggered automatically
2. Slancha selects the optimal base model architecture (typically 7B-30B parameters)
3. LoRA-based fine-tuning runs on the curated dataset
4. The fine-tuned model is evaluated against the customer's validation set
5. If it meets or exceeds the frontier model's quality, it's promoted to production

**Automatic upgrades:** When a new open-source architecture drops (e.g., a new Llama or Qwen release), Slancha re-fine-tunes on the existing curated data. Your models get better without any action on your part.

**What you don't need:**
- No data curation team
- No fine-tuning engineers
- No hyperparameter tuning
- No model architecture selection
- No training infrastructure

---

## Layer 4: Inference Optimization

Even without fine-tuning, there's significant performance gain from optimizing how models are served.

### Quantization-Aware Training (QAT)

Models are quantized to **4-bit** (INT4/FP4) precision during training, not after. This preserves quality while reducing memory requirements by ~4x compared to FP16.

Post-training quantization (what most teams do manually) degrades quality. QAT integrates quantization into the training process so the model learns to maintain accuracy at lower precision.

### Multi-Instance GPU (MIG)

Using NVIDIA's MIG technology on Blackwell B200/B300 GPUs, a single GPU is partitioned into multiple hardware-isolated instances. Each instance has dedicated compute, memory, and cache resources.

**Result:** Multiple customer models run on a single GPU with full hardware isolation — no noisy-neighbor problems, no resource contention.

### Multi-Token Prediction

Instead of predicting one token at a time (standard autoregressive decoding), models predict multiple tokens per forward pass. This increases tokens-per-second throughput significantly.

**Combined impact:** These three techniques together deliver:
- **3-5x lower latency** compared to unoptimized serving
- **4-8x lower cost** through memory and compute efficiency
- **Full hardware isolation** between customer workloads

---

## The Closed Loop

The key differentiator is that these layers don't operate independently — they form a continuous improvement loop:

1. **Route** — Send requests to the best available model
2. **Analyze** — Classify tasks, curate training data
3. **Fine-tune** — Train task-specific models on real usage
4. **Optimize** — Quantize, partition, and accelerate inference
5. **Redeploy** — Promote improved models back into the router

The loop closes automatically. No human intervention. No model selection decisions. The longer you use Slancha, the better it gets at serving your specific workloads.

---

## What This Means for You

| If you currently... | Slancha gives you... |
|---|---|
| Send everything to GPT-4o | Automatic routing to appropriately-sized models |
| Pay per-token at frontier prices | Fine-tuned models at a fraction of the cost |
| Accept whatever latency you get | Optimized inference with 3-5x lower latency |
| Manually evaluate and select models | Continuous, automatic model improvement |
| Worry about provider price increases | Independence from any single model provider |

## Next Steps

- [Getting Started](/docs/getting-started) — Create an account and make your first API call
- [Router Configuration](/docs/router) — Customize routing rules
- [Evaluations Guide](/docs/evaluations) — Run evaluations on your workloads
- [Benchmarks](/benchmarks) — See real performance numbers`},{slug:"how-routing-works",title:"How Routing Works",section:"Concepts",order:4,body:`# How Routing Works

This page explains the technical details of Slancha's model routing — how requests are classified, how models are selected, and how routing improves over time.

## Semantic Routing vs. LLM-Based Routing

Most "AI routers" use an LLM to classify incoming requests. This is slow (100-500ms per classification) and expensive (you're paying for an inference call just to decide where to route).

Slancha uses **semantic vector routing**: incoming queries are embedded and compared against pre-computed route vectors using cosine similarity. This happens in **sub-millisecond** time with no LLM inference in the routing path.

\`\`\`
Traditional routing:
  Request → [LLM classifier] → Model selection → [Target model] → Response
  Total overhead: 100-500ms per request

Slancha routing:
  Request → [Embedding + cosine similarity] → Model selection → [Target model] → Response
  Total overhead: <1ms per request
\`\`\`

## Route Configuration

Routes map task types to model pools. Each route defines:

- **Utterances** — Example queries that characterize the task type
- **Model pool** — The set of models eligible to handle this route
- **Priority rules** — Cost, latency, or quality optimization preference

\`\`\`python
# You can customize routing via the API:
client.router.update({
    "routes": [
        {
            "name": "summarization",
            "utterances": [
                "Summarize this document",
                "Give me a brief overview",
                "TL;DR this article"
            ],
            "model_pool": ["llama-3.1-8b-ft", "qwen-2.5-7b-ft"],
            "optimize": "cost"
        },
        {
            "name": "code-generation",
            "utterances": [
                "Write a function that",
                "Debug this code",
                "Refactor this class"
            ],
            "model_pool": ["codellama-34b-ft", "deepseek-coder-33b"],
            "optimize": "quality"
        }
    ]
})
\`\`\`

## How Routes Improve

Routes are not static. The system continuously refines routing accuracy:

1. **Utterance expansion** — As more requests are classified, new representative utterances are added to each route, improving classification accuracy
2. **Model pool updates** — When fine-tuned models pass evaluation, they're automatically added to the relevant route's model pool
3. **Threshold tuning** — Confidence thresholds are adjusted based on observed routing accuracy

## Fallback Behavior

When the router can't confidently classify a request (similarity score below threshold), it falls back to a frontier model. This ensures quality is never sacrificed for cost savings.

\`\`\`
Routing decision flow:

1. Embed incoming query
2. Compute similarity against all route utterances
3. If max similarity > confidence threshold:
   → Route to matched model pool
   → Select specific model based on optimize preference
4. If max similarity < confidence threshold:
   → Fall back to frontier model (GPT-4o class)
   → Log the request for future route training
\`\`\`

Fallback requests are valuable signals — they represent task types the router hasn't learned yet. Over time, as these requests accumulate, new routes are created automatically.

## Monitoring Routing Performance

Track routing behavior through the [Dashboard](/dashboard):

- **Route distribution** — What percentage of requests go to each route
- **Fallback rate** — How often the router falls back to frontier models (lower is better)
- **Cost savings** — Per-route and aggregate cost savings vs. frontier-only
- **Latency impact** — Per-route latency compared to baseline

## OpenAI Compatibility

The router is fully compatible with the OpenAI API format. Use \`model: "auto"\` to let Slancha route automatically, or specify a model name to bypass routing:

\`\`\`python
# Auto-routing (recommended)
client.chat.completions.create(model="auto", messages=[...])

# Bypass routing — use a specific model
client.chat.completions.create(model="llama-3.1-70b", messages=[...])

# Route to a specific route by name
client.chat.completions.create(model="route:summarization", messages=[...])
\`\`\`

## Next Steps

- [Architecture Overview](/docs/architecture) — See how routing fits into the four-layer pipeline
- [Router Configuration](/docs/router) — Full API reference for router endpoints
- [Evaluations](/docs/evaluations) — Measure model performance on your workloads`},{slug:"evaluations",title:"Evaluations Guide",section:"Evaluate",order:5,body:`# Evaluations Guide

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

The Slancha API gives you programmatic access to the full platform — routing, task analysis, fine-tuning, and inference optimization. The inference endpoints are OpenAI-compatible — if you're already using the OpenAI SDK, switching is a one-line change.

> **OpenAPI Spec:** Download the full [OpenAPI 3.1 specification](/openapi.yaml) for import into Postman, Insomnia, or SDK generators.

## Base URL

\`\`\`
https://aogutyvup5m15h-8888.proxy.runpod.net/v1
\`\`\`

## Authentication

All requests require an API key passed via the \`Authorization\` header:

\`\`\`
Authorization: Bearer sk-sl_your_key_here
\`\`\`

---

## Inference

### POST /chat/completions

Create a chat completion. OpenAI-compatible format.

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| model | string | Yes | Model name or \`"auto"\` for smart router |
| messages | array | Yes | Array of message objects |
| temperature | number | No | Sampling temperature (0-2). Default: 1 |
| max_tokens | integer | No | Maximum tokens to generate |
| top_p | number | No | Nucleus sampling threshold. Default: 1 |
| stream | boolean | No | Stream response via SSE. Default: false |
| stop | string or array | No | Stop sequences |
| presence_penalty | number | No | Penalize new tokens by presence (-2 to 2) |
| frequency_penalty | number | No | Penalize new tokens by frequency (-2 to 2) |
| tools | array | No | Function/tool definitions for tool use |
| tool_choice | string or object | No | \`"auto"\`, \`"none"\`, or specific tool |

**Example:**

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/chat/completions \\
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

List all models available in your account, including deployed fine-tunes.

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/models \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

**Response:**

\`\`\`json
{
  "object": "list",
  "data": [
    {
      "id": "llama-3.1-70b",
      "object": "model",
      "owned_by": "slancha",
      "capabilities": ["chat", "function_calling"],
      "context_length": 131072
    },
    {
      "id": "ft:llama-3.1-8b:my-org:custom-v2",
      "object": "model",
      "owned_by": "user",
      "capabilities": ["chat"],
      "context_length": 131072,
      "fine_tune_id": "ft-abc123"
    }
  ]
}
\`\`\`

---

## Evaluations

### POST /evaluations

Create a new evaluation run against one or more models.

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Human-readable eval name |
| dataset | string | Yes | Dataset ID or inline test cases |
| models | array | Yes | Model IDs to evaluate |
| metrics | array | Yes | Metric names: \`"accuracy"\`, \`"latency"\`, \`"cost"\`, \`"toxicity"\`, \`"coherence"\`, \`"relevance"\`, \`"faithfulness"\` |
| judge | object | No | LLM-as-judge config. Default: GPT-4o |
| split | string | No | \`"test"\`, \`"validation"\`, or \`"all"\`. Default: \`"test"\` |
| concurrency | integer | No | Parallel requests per model. Default: 10 |

**Example:**

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/evaluations \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Customer support model comparison",
    "dataset": "ds-support-v3",
    "models": ["llama-3.1-70b", "ft:llama-3.1-8b:my-org:support-v2"],
    "metrics": ["accuracy", "latency", "cost", "relevance"],
    "judge": {
      "model": "gpt-4o",
      "rubric": "Rate the response for helpfulness and accuracy on a 1-5 scale."
    }
  }'
\`\`\`

**Response:**

\`\`\`json
{
  "id": "eval-7f3k9x",
  "object": "evaluation",
  "status": "running",
  "name": "Customer support model comparison",
  "models": ["llama-3.1-70b", "ft:llama-3.1-8b:my-org:support-v2"],
  "metrics": ["accuracy", "latency", "cost", "relevance"],
  "created_at": "2026-03-30T12:00:00Z",
  "progress": { "completed": 0, "total": 500 }
}
\`\`\`

### GET /evaluations

List all evaluation runs.

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/evaluations?status=completed&limit=10 \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

| Query Param | Type | Description |
|-------------|------|-------------|
| status | string | Filter: \`"running"\`, \`"completed"\`, \`"failed"\` |
| limit | integer | Max results (1-100). Default: 20 |
| after | string | Cursor for pagination |

### GET /evaluations/:id

Get detailed results for an evaluation run.

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/evaluations/eval-7f3k9x \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

**Response:**

\`\`\`json
{
  "id": "eval-7f3k9x",
  "object": "evaluation",
  "status": "completed",
  "name": "Customer support model comparison",
  "results": {
    "llama-3.1-70b": {
      "accuracy": 0.87,
      "latency_p50_ms": 320,
      "latency_p99_ms": 890,
      "cost_per_1k_tokens": 0.0009,
      "relevance": 4.2
    },
    "ft:llama-3.1-8b:my-org:support-v2": {
      "accuracy": 0.93,
      "latency_p50_ms": 110,
      "latency_p99_ms": 280,
      "cost_per_1k_tokens": 0.0003,
      "relevance": 4.6
    }
  },
  "winner": "ft:llama-3.1-8b:my-org:support-v2",
  "dataset_size": 500,
  "completed_at": "2026-03-30T12:04:32Z"
}
\`\`\`

### POST /evaluations/:id/promote

Promote the winning model from an eval directly to a deployment.

\`\`\`bash
curl -X POST https://aogutyvup5m15h-8888.proxy.runpod.net/v1/evaluations/eval-7f3k9x/promote \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "ft:llama-3.1-8b:my-org:support-v2",
    "deployment": "dep-prod-support",
    "strategy": "canary",
    "canary_percent": 10
  }'
\`\`\`

---

## Deployments

### POST /deployments

Create or update a model deployment.

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Deployment name (unique per org) |
| model | string | Yes | Model ID to deploy |
| min_replicas | integer | No | Minimum instances. Default: 1 |
| max_replicas | integer | No | Maximum instances for autoscaling. Default: 1 |
| gpu_type | string | No | \`"a100"\`, \`"h100"\`, \`"l40s"\`. Default: auto-selected |
| region | string | No | \`"us-east"\`, \`"us-west"\`, \`"eu-west"\`. Default: \`"us-east"\` |
| scaling_metric | string | No | \`"requests_per_second"\`, \`"gpu_utilization"\`, \`"queue_depth"\` |
| scaling_target | number | No | Target value for the scaling metric |

**Example:**

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/deployments \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "support-prod",
    "model": "ft:llama-3.1-8b:my-org:support-v2",
    "min_replicas": 2,
    "max_replicas": 8,
    "gpu_type": "h100",
    "region": "us-east",
    "scaling_metric": "requests_per_second",
    "scaling_target": 100
  }'
\`\`\`

**Response:**

\`\`\`json
{
  "id": "dep-9xk3m7",
  "object": "deployment",
  "name": "support-prod",
  "status": "provisioning",
  "model": "ft:llama-3.1-8b:my-org:support-v2",
  "endpoint": "https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
  "replicas": { "desired": 2, "ready": 0 },
  "gpu_type": "h100",
  "region": "us-east",
  "created_at": "2026-03-30T12:10:00Z"
}
\`\`\`

### GET /deployments

List all deployments.

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/deployments \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

### GET /deployments/:id

Get deployment details including live metrics.

**Response:**

\`\`\`json
{
  "id": "dep-9xk3m7",
  "object": "deployment",
  "name": "support-prod",
  "status": "running",
  "model": "ft:llama-3.1-8b:my-org:support-v2",
  "endpoint": "https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
  "replicas": { "desired": 2, "ready": 2 },
  "metrics": {
    "requests_per_second": 47.3,
    "latency_p50_ms": 95,
    "latency_p99_ms": 240,
    "gpu_utilization": 0.62,
    "uptime": "99.97%"
  }
}
\`\`\`

### DELETE /deployments/:id

Shut down a deployment and release its resources.

\`\`\`bash
curl -X DELETE https://aogutyvup5m15h-8888.proxy.runpod.net/v1/deployments/dep-9xk3m7 \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

---

## Fine-Tuning

### POST /fine-tuning/jobs

Create a fine-tuning job. Optionally driven by eval results.

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| model | string | Yes | Base model to fine-tune |
| training_file | string | Yes | Dataset ID (JSONL format) |
| validation_file | string | No | Validation dataset ID |
| hyperparameters | object | No | Override defaults (see below) |
| suffix | string | No | Custom model name suffix |
| eval_id | string | No | Link to an eval — auto-curate training data from misclassified examples |
| auto_promote | object | No | Auto-deploy if eval score exceeds threshold |

**Hyperparameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| n_epochs | integer | auto | Training epochs |
| batch_size | integer | auto | Batch size |
| learning_rate_multiplier | number | auto | Learning rate scale factor |
| lora_rank | integer | 16 | LoRA adapter rank (8, 16, 32, 64) |
| warmup_ratio | number | 0.1 | Warmup proportion of total steps |

**Example:**

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/fine-tuning/jobs \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.1-8b",
    "training_file": "ds-support-train-v3",
    "validation_file": "ds-support-val-v3",
    "suffix": "support-v3",
    "hyperparameters": {
      "n_epochs": 3,
      "lora_rank": 32
    },
    "eval_id": "eval-7f3k9x",
    "auto_promote": {
      "deployment": "dep-prod-support",
      "metric": "accuracy",
      "threshold": 0.90,
      "strategy": "canary",
      "canary_percent": 5
    }
  }'
\`\`\`

**Response:**

\`\`\`json
{
  "id": "ft-job-m4x2n8",
  "object": "fine_tuning.job",
  "status": "queued",
  "model": "llama-3.1-8b",
  "training_file": "ds-support-train-v3",
  "created_at": "2026-03-30T12:15:00Z",
  "estimated_completion": "2026-03-30T13:45:00Z",
  "hyperparameters": {
    "n_epochs": 3,
    "batch_size": 16,
    "learning_rate_multiplier": 1.0,
    "lora_rank": 32
  },
  "auto_promote": {
    "enabled": true,
    "deployment": "dep-prod-support",
    "metric": "accuracy",
    "threshold": 0.90
  }
}
\`\`\`

### GET /fine-tuning/jobs

List fine-tuning jobs.

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/fine-tuning/jobs?limit=10 \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

### GET /fine-tuning/jobs/:id

Get job details and training metrics.

**Response (completed job):**

\`\`\`json
{
  "id": "ft-job-m4x2n8",
  "object": "fine_tuning.job",
  "status": "succeeded",
  "model": "llama-3.1-8b",
  "fine_tuned_model": "ft:llama-3.1-8b:my-org:support-v3",
  "training_file": "ds-support-train-v3",
  "created_at": "2026-03-30T12:15:00Z",
  "completed_at": "2026-03-30T13:42:17Z",
  "training_metrics": {
    "train_loss": 0.42,
    "eval_loss": 0.48,
    "eval_accuracy": 0.94
  },
  "auto_promote": {
    "triggered": true,
    "eval_score": 0.94,
    "deployment": "dep-prod-support",
    "canary_percent": 5
  }
}
\`\`\`

### POST /fine-tuning/jobs/:id/cancel

Cancel a running fine-tuning job.

\`\`\`bash
curl -X POST https://aogutyvup5m15h-8888.proxy.runpod.net/v1/fine-tuning/jobs/ft-job-m4x2n8/cancel \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

---

## Datasets

### POST /datasets

Upload a dataset for evaluations or fine-tuning.

**Request:** Multipart form upload (JSONL format).

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/datasets \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -F "file=@support-train.jsonl" \\
  -F "name=support-train-v3" \\
  -F "purpose=fine-tuning"
\`\`\`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | file | Yes | JSONL file upload |
| name | string | Yes | Dataset name |
| purpose | string | Yes | \`"fine-tuning"\`, \`"evaluation"\`, or \`"both"\` |

**Response:**

\`\`\`json
{
  "id": "ds-support-train-v3",
  "object": "dataset",
  "name": "support-train-v3",
  "purpose": "fine-tuning",
  "size_bytes": 4521984,
  "num_examples": 12500,
  "created_at": "2026-03-30T11:00:00Z",
  "status": "processed"
}
\`\`\`

### GET /datasets

List uploaded datasets.

### GET /datasets/:id

Get dataset metadata and validation status.

### DELETE /datasets/:id

Delete a dataset.

---

## Router

### GET /router/config

Get current smart router configuration.

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/router/config \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

**Response:**

\`\`\`json
{
  "object": "router_config",
  "strategy": "cost_optimized",
  "rules": [
    {
      "condition": "complexity >= 0.8",
      "route_to": "llama-3.1-70b",
      "reason": "Complex queries need larger model"
    },
    {
      "condition": "complexity < 0.8",
      "route_to": "ft:llama-3.1-8b:my-org:support-v2",
      "reason": "Simple queries use fine-tuned small model"
    }
  ],
  "fallback": "llama-3.1-70b",
  "cost_savings_30d": "63%"
}
\`\`\`

### PUT /router/config

Update router rules.

\`\`\`bash
curl -X PUT https://aogutyvup5m15h-8888.proxy.runpod.net/v1/router/config \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "strategy": "quality_first",
    "rules": [
      {
        "condition": "topic == support",
        "route_to": "ft:llama-3.1-8b:my-org:support-v3"
      },
      {
        "condition": "topic == code",
        "route_to": "deepseek-coder-33b"
      }
    ],
    "fallback": "llama-3.1-70b"
  }'
\`\`\`

---

## Webhooks

### POST /webhooks

Register a webhook for event notifications.

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/webhooks \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/slancha-webhook",
    "events": ["evaluation.completed", "fine_tuning.completed", "deployment.ready", "deployment.unhealthy"],
    "secret": "whsec_your_signing_secret"
  }'
\`\`\`

**Event types:** \`evaluation.completed\`, \`evaluation.failed\`, \`fine_tuning.completed\`, \`fine_tuning.failed\`, \`deployment.ready\`, \`deployment.unhealthy\`, \`deployment.scaled\`, \`auto_promote.triggered\`

---

## Rate Limits

| Tier | Requests/min | Tokens/min | Concurrent Evals | Fine-tune Jobs |
|------|-------------|------------|-------------------|----------------|
| Free | 60 | 100,000 | 1 | 0 |
| Hobbyist | 600 | 1,000,000 | 5 | 0 |
| Pro | 3,000 | 10,000,000 | 20 | 1/mo (included) |
| Enterprise | Custom | Custom | Custom | Custom |

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Invalid request body or parameters |
| 401 | Invalid or missing API key |
| 403 | Insufficient permissions for this operation |
| 404 | Resource not found |
| 409 | Conflict (e.g., deployment name already exists) |
| 422 | Validation error (e.g., invalid dataset format) |
| 429 | Rate limit exceeded — check \`Retry-After\` header |
| 500 | Internal server error |
| 503 | Model or service temporarily unavailable |

## Pagination

List endpoints support cursor-based pagination:

\`\`\`bash
curl "https://aogutyvup5m15h-8888.proxy.runpod.net/v1/evaluations?limit=10&after=eval-abc123" \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

All list responses include \`has_more\` and a \`last_id\` field for the next page.`},{slug:"models",title:"Available Models",section:"API",order:7,body:`# Available Models

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
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
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
  baseURL: 'https://aogutyvup5m15h-8888.proxy.runpod.net/v1',
  apiKey: 'sk-sl_your_key_here',
});
\`\`\`

## cURL

No SDK needed:

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/chat/completions \\
  -H "Authorization: Bearer $SLANCHA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
\`\`\``},{slug:"migration",title:"Migration Guide",section:"Getting Started",order:10,body:`# Migration Guide

Slancha exposes a fully **OpenAI-compatible API**. If your application already uses the OpenAI SDK or any OpenAI-compatible client, migrating takes minutes — not weeks.

This guide covers migration from the most common platforms.

---

## From OpenAI

**Time to migrate: ~5 minutes**

Slancha's API is wire-compatible with OpenAI's Chat Completions endpoint. Change two values:

### Python

\`\`\`python
import openai

# Before (OpenAI)
client = openai.OpenAI(
    api_key="sk-..."
)

# After (Slancha) — change base_url and api_key
client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

# Everything else stays exactly the same
response = client.chat.completions.create(
    model="auto",  # Slancha routes to the optimal model
    messages=[{"role": "user", "content": "Summarize this document..."}],
    temperature=0.7,
    max_tokens=1024,
)
print(response.choices[0].message.content)
\`\`\`

### TypeScript / Node.js

\`\`\`typescript
import OpenAI from 'openai';

// Before
const client = new OpenAI({ apiKey: 'sk-...' });

// After
const client = new OpenAI({
  baseURL: 'https://aogutyvup5m15h-8888.proxy.runpod.net/v1',
  apiKey: 'sk-sl_your_key_here',
});

// Streaming works identically
const stream = await client.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Write a summary.' }],
  stream: true,
});
\`\`\`

### What changes

| Feature | OpenAI | Slancha |
|---|---|---|
| Endpoint | \`api.openai.com/v1\` | \`aogutyvup5m15h-8888.proxy.runpod.net/v1\` |
| API key prefix | \`sk-\` | \`sk-sl_\` |
| Model parameter | \`gpt-4o\`, \`gpt-4o-mini\`, etc. | \`auto\` (recommended) or specify a model |
| Streaming | ✅ Supported | ✅ Supported |
| Function calling | ✅ Supported | ✅ Supported |
| JSON mode | ✅ Supported | ✅ Supported |
| Response format | Identical | Identical |

**Why \`model: "auto"\`?** Slancha's router analyzes your request and picks the optimal model for accuracy, latency, and cost. You can also specify a model name if you prefer.

---

## From Anthropic (Claude API)

**Time to migrate: ~10 minutes**

Anthropic uses a different API format than OpenAI. Slancha uses the OpenAI format, so you'll switch from the Anthropic SDK to the OpenAI SDK.

### Before (Anthropic)

\`\`\`python
import anthropic

client = anthropic.Anthropic(api_key="sk-ant-...")

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Summarize this..."}]
)
print(response.content[0].text)
\`\`\`

### After (Slancha)

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

response = client.chat.completions.create(
    model="auto",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Summarize this..."}]
)
print(response.choices[0].message.content)
\`\`\`

### Key differences

- Replace \`anthropic.Anthropic()\` with \`openai.OpenAI()\`
- \`response.content[0].text\` becomes \`response.choices[0].message.content\`
- System messages go in the \`messages\` array as \`{"role": "system", ...}\` instead of the \`system\` parameter
- Tool/function calling uses OpenAI's format (\`tools\` parameter)

---

## From Portkey

**Time to migrate: ~5 minutes**

Portkey acts as a gateway that proxies to underlying providers. Since Slancha also provides a single API endpoint, migration is straightforward — you're replacing one gateway with another.

### Before (Portkey)

\`\`\`python
from portkey_ai import Portkey

client = Portkey(
    api_key="pk-...",
    virtual_key="openai-key-abc123"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### After (Slancha)

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

# No virtual keys, no provider config — just send requests
response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### What you gain

- **No provider key management** — Slancha handles model selection and serving, no virtual keys needed
- **Automatic optimization** — Portkey routes but doesn't learn from your traffic; Slancha continuously improves
- **Fine-tuned models** — Over time, Slancha creates task-specific models trained on your usage patterns
- **Simpler config** — No routing rules, fallback chains, or load balancer configs to maintain

### What to consider

- If you use Portkey's guardrails or prompt management features, you'll want to handle those at the application layer
- Portkey's observability dashboards are replaced by Slancha's built-in usage analytics

---

## From OpenRouter

**Time to migrate: ~5 minutes**

OpenRouter also exposes an OpenAI-compatible API, so this is a drop-in swap.

### Before (OpenRouter)

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="sk-or-..."
)

response = client.chat.completions.create(
    model="anthropic/claude-3.5-sonnet",  # you pick the model
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### After (Slancha)

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

response = client.chat.completions.create(
    model="auto",  # Slancha picks the optimal model
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### What you gain

- **Stop choosing models** — OpenRouter is a marketplace where you pick providers; Slancha picks the best model for each request automatically
- **Continuous improvement** — OpenRouter's routing is static; Slancha learns from your traffic and fine-tunes models for your specific workloads
- **Cost optimization** — Beyond finding cheap providers, Slancha actually creates cheaper-to-serve fine-tuned models matched to your tasks

---

## From Fireworks AI

**Time to migrate: ~10 minutes**

Fireworks provides an OpenAI-compatible API, but you may also use Fireworks-specific features.

### Before (Fireworks)

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key="fw_..."
)

response = client.chat.completions.create(
    model="accounts/fireworks/models/llama-v3p1-70b-instruct",
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### After (Slancha)

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### What you gain

- **No model management** — Fireworks requires you to select specific models and manage deployments; Slancha handles this automatically
- **Automatic fine-tuning** — Fireworks offers fine-tuning as a tool you run; Slancha runs it continuously behind the scenes based on your traffic
- **Zero ML expertise required** — Fireworks is built for sophisticated AI teams; Slancha delivers comparable outcomes without the complexity

### What to consider

- If you use Fireworks BYOW (bring-your-own-weights), contact us about importing your custom models
- Fireworks-specific features like grammar-based structured outputs use Slancha's JSON mode instead

---

## From Not Diamond

**Time to migrate: ~15 minutes**

Not Diamond uses a custom API rather than the OpenAI format.

### Before (Not Diamond)

\`\`\`python
from notdiamond import NotDiamond

client = NotDiamond(api_key="nd-...")

result, session_id, provider = client.chat.completions.create(
    messages=[{"role": "user", "content": "Hello"}],
    model=["openai/gpt-4o", "anthropic/claude-3.5-sonnet"],
    tradeoff="cost"
)
\`\`\`

### After (Slancha)

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### What you gain

- **No model list required** — Not Diamond needs you to specify which models to choose from; Slancha's router knows the full model landscape
- **No explicit evaluation data** — Not Diamond requires you to provide eval data upfront and trigger optimization; Slancha learns continuously from live traffic
- **Fine-tuned models** — Not Diamond routes to existing models; Slancha creates new task-specific models through automated fine-tuning
- **Standard API** — Not Diamond uses a custom SDK; Slancha uses the OpenAI-compatible format you already know

---

## Environment Variables

For any migration, set these environment variables:

\`\`\`bash
# Replace your existing provider key
export SLANCHA_API_KEY="sk-sl_your_key_here"

# Optional: if using the OpenAI SDK
export OPENAI_API_KEY="sk-sl_your_key_here"
export OPENAI_BASE_URL="https://aogutyvup5m15h-8888.proxy.runpod.net/v1"
\`\`\`

Setting \`OPENAI_BASE_URL\` and \`OPENAI_API_KEY\` means any code using \`openai.OpenAI()\` with no arguments will automatically hit Slancha.

---

## Framework Integration

### LangChain

\`\`\`python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here",
    model="auto",
)
\`\`\`

### LlamaIndex

\`\`\`python
from llama_index.llms.openai import OpenAI

llm = OpenAI(
    api_base="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here",
    model="auto",
)
\`\`\`

### Vercel AI SDK

\`\`\`typescript
import { createOpenAI } from '@ai-sdk/openai';

const slancha = createOpenAI({
  baseURL: 'https://aogutyvup5m15h-8888.proxy.runpod.net/v1',
  apiKey: 'sk-sl_your_key_here',
});

const model = slancha('auto');
\`\`\`

---

## Verification Checklist

After migrating, verify your integration:

1. **Basic request** — Send a simple chat completion and confirm a valid response
2. **Streaming** — If you use streaming, verify chunks arrive correctly
3. **Function calling** — If you use tools/functions, verify they work with Slancha's format
4. **Error handling** — Slancha returns standard OpenAI-format errors (400, 401, 429, 500)
5. **Check the dashboard** — Log in to [dashboard.slancha.ai](https://dashboard.slancha.ai) to see your requests, latency, and cost metrics

---

## Need Help?

- **Docs:** [slancha.ai/docs](https://slancha.ai/docs)
- **API Reference:** [slancha.ai/docs/api-reference](https://slancha.ai/docs/api-reference)
- **Email:** support@slancha.ai
- **Discord:** [discord.gg/slancha](https://discord.gg/slancha)

Our team can help with complex migrations involving custom models, fine-tuned weights, or enterprise deployments.`},{slug:"webhooks",title:"Webhooks & Events",section:"API",order:7.5,body:`# Webhooks & Events

Slancha sends webhook notifications when key events happen in your pipeline — evaluations complete, fine-tuning finishes, deployments change state, and models auto-promote. Use webhooks to trigger downstream workflows without polling.

## Registering a Webhook

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/webhooks \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/slancha-webhook",
    "events": ["evaluation.completed", "fine_tuning.completed"],
    "secret": "whsec_your_signing_secret"
  }'
\`\`\`

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | Yes | HTTPS endpoint that receives POST requests |
| events | array | Yes | Event types to subscribe to (see below) |
| secret | string | No | Signing secret for payload verification. If omitted, Slancha generates one |
| description | string | No | Human-readable label for this webhook |
| active | boolean | No | Whether the webhook is enabled. Default: true |

**Response:**

\`\`\`json
{
  "id": "whk_abc123",
  "url": "https://your-app.com/slancha-webhook",
  "events": ["evaluation.completed", "fine_tuning.completed"],
  "secret": "whsec_abc123xyz",
  "active": true,
  "created_at": "2026-03-31T12:00:00Z"
}
\`\`\`

---

## Event Types

| Event | Trigger |
|-------|---------|
| \`evaluation.completed\` | An evaluation run finishes successfully with scores |
| \`evaluation.failed\` | An evaluation run fails (timeout, invalid dataset, model error) |
| \`fine_tuning.started\` | A fine-tuning job begins training |
| \`fine_tuning.completed\` | A fine-tuning job finishes and the model is ready |
| \`fine_tuning.failed\` | A fine-tuning job fails (OOM, data error, training divergence) |
| \`deployment.ready\` | A deployment is live and serving traffic |
| \`deployment.unhealthy\` | A deployment fails health checks (latency spike, error rate) |
| \`deployment.scaled\` | A deployment auto-scales up or down |
| \`auto_promote.triggered\` | A fine-tuned model automatically promoted to production based on eval scores |

Use \`["*"]\` to subscribe to all event types.

---

## Payload Format

Every webhook delivery is a POST request with a JSON body. All payloads share this envelope:

\`\`\`json
{
  "id": "evt_abc123",
  "type": "evaluation.completed",
  "created_at": "2026-03-31T14:30:00Z",
  "api_version": "2026-03-01",
  "data": { ... }
}
\`\`\`

| Field | Description |
|-------|-------------|
| id | Unique event ID. Use this for idempotency checks |
| type | Event type string |
| created_at | ISO 8601 timestamp |
| api_version | API version the payload conforms to |
| data | Event-specific payload (see below) |

---

### evaluation.completed

\`\`\`json
{
  "id": "evt_eval_001",
  "type": "evaluation.completed",
  "created_at": "2026-03-31T14:30:00Z",
  "api_version": "2026-03-01",
  "data": {
    "evaluation_id": "eval-abc123",
    "name": "support-bot-v2-eval",
    "dataset_id": "ds-xyz789",
    "models": [
      {
        "model": "gpt-4o",
        "scores": { "accuracy": 0.921, "latency_p50_ms": 320, "cost_per_1k": 0.045 }
      },
      {
        "model": "llama-3.1-70b",
        "scores": { "accuracy": 0.894, "latency_p50_ms": 180, "cost_per_1k": 0.012 }
      }
    ],
    "winner": "gpt-4o",
    "duration_seconds": 142,
    "sample_count": 500
  }
}
\`\`\`

### evaluation.failed

\`\`\`json
{
  "id": "evt_eval_002",
  "type": "evaluation.failed",
  "created_at": "2026-03-31T15:00:00Z",
  "api_version": "2026-03-01",
  "data": {
    "evaluation_id": "eval-def456",
    "name": "code-gen-nightly",
    "error": {
      "code": "DATASET_INVALID",
      "message": "Dataset ds-bad789 contains 3 rows with missing 'expected' field",
      "details": { "invalid_rows": [12, 45, 89] }
    }
  }
}
\`\`\`

### fine_tuning.started

\`\`\`json
{
  "id": "evt_ft_001",
  "type": "fine_tuning.started",
  "created_at": "2026-03-31T16:00:00Z",
  "api_version": "2026-03-01",
  "data": {
    "job_id": "ft-abc123",
    "base_model": "llama-3.1-8b",
    "dataset_id": "ds-train456",
    "training_samples": 2400,
    "estimated_duration_minutes": 45,
    "hyperparameters": {
      "epochs": 3,
      "learning_rate": 2e-5,
      "lora_rank": 16,
      "lora_alpha": 32
    }
  }
}
\`\`\`

### fine_tuning.completed

\`\`\`json
{
  "id": "evt_ft_002",
  "type": "fine_tuning.completed",
  "created_at": "2026-03-31T16:45:00Z",
  "api_version": "2026-03-01",
  "data": {
    "job_id": "ft-abc123",
    "base_model": "llama-3.1-8b",
    "fine_tuned_model": "ft:llama-3.1-8b:acme:support-v2:abc123",
    "training_samples": 2400,
    "duration_seconds": 2640,
    "final_loss": 0.342,
    "eval_scores": {
      "accuracy": 0.948,
      "improvement_over_base": "+5.4%"
    }
  }
}
\`\`\`

### fine_tuning.failed

\`\`\`json
{
  "id": "evt_ft_003",
  "type": "fine_tuning.failed",
  "created_at": "2026-03-31T17:00:00Z",
  "api_version": "2026-03-01",
  "data": {
    "job_id": "ft-def456",
    "base_model": "qwen-2.5-7b",
    "error": {
      "code": "TRAINING_DIVERGED",
      "message": "Loss exceeded threshold at epoch 2 (loss: 4.21, threshold: 3.0)",
      "suggestion": "Reduce learning rate or increase training data volume"
    }
  }
}
\`\`\`

### deployment.ready

\`\`\`json
{
  "id": "evt_dep_001",
  "type": "deployment.ready",
  "created_at": "2026-03-31T17:30:00Z",
  "api_version": "2026-03-01",
  "data": {
    "deployment_id": "dep-abc123",
    "name": "support-bot-prod",
    "model": "ft:llama-3.1-8b:acme:support-v2:abc123",
    "replicas": 2,
    "gpu_type": "B200",
    "mig_partition": "3g.40gb",
    "endpoint": "https://aogutyvup5m15h-8888.proxy.runpod.net/v1/deployments/dep-abc123/infer",
    "health_check_url": "https://aogutyvup5m15h-8888.proxy.runpod.net/v1/deployments/dep-abc123/health"
  }
}
\`\`\`

### deployment.unhealthy

\`\`\`json
{
  "id": "evt_dep_002",
  "type": "deployment.unhealthy",
  "created_at": "2026-03-31T18:00:00Z",
  "api_version": "2026-03-01",
  "data": {
    "deployment_id": "dep-abc123",
    "name": "support-bot-prod",
    "issue": {
      "type": "LATENCY_SPIKE",
      "p99_latency_ms": 4200,
      "threshold_ms": 2000,
      "error_rate": 0.02,
      "since": "2026-03-31T17:55:00Z"
    },
    "action_taken": "Traffic rerouted to fallback model (llama-3.1-70b)"
  }
}
\`\`\`

### deployment.scaled

\`\`\`json
{
  "id": "evt_dep_003",
  "type": "deployment.scaled",
  "created_at": "2026-03-31T19:00:00Z",
  "api_version": "2026-03-01",
  "data": {
    "deployment_id": "dep-abc123",
    "name": "support-bot-prod",
    "previous_replicas": 2,
    "new_replicas": 4,
    "reason": "Request queue depth exceeded threshold (150 > 100)",
    "estimated_cost_change": "+$0.12/hr"
  }
}
\`\`\`

### auto_promote.triggered

\`\`\`json
{
  "id": "evt_ap_001",
  "type": "auto_promote.triggered",
  "created_at": "2026-03-31T20:00:00Z",
  "api_version": "2026-03-01",
  "data": {
    "fine_tuned_model": "ft:llama-3.1-8b:acme:support-v3:def456",
    "previous_model": "ft:llama-3.1-8b:acme:support-v2:abc123",
    "deployment_id": "dep-abc123",
    "promotion_reason": "Eval scores exceeded threshold",
    "eval_comparison": {
      "accuracy": { "previous": 0.948, "new": 0.962 },
      "latency_p50_ms": { "previous": 48, "new": 45 },
      "cost_per_1k": { "previous": 0.008, "new": 0.008 }
    },
    "rollback_window_hours": 24
  }
}
\`\`\`

---

## Verifying Webhook Signatures

Every webhook request includes a signature header so you can verify it came from Slancha. The signature uses HMAC-SHA256 with the signing secret from your webhook registration.

**Headers sent with every delivery:**

| Header | Description |
|--------|-------------|
| \`X-Slancha-Signature\` | HMAC-SHA256 hex digest of the raw request body |
| \`X-Slancha-Event\` | Event type (e.g., \`evaluation.completed\`) |
| \`X-Slancha-Delivery\` | Unique delivery ID for this attempt |
| \`X-Slancha-Timestamp\` | Unix timestamp of when the request was sent |

**Verification algorithm:**

1. Concatenate the timestamp and raw body: \`{timestamp}.{body}\`
2. Compute HMAC-SHA256 using your webhook secret as the key
3. Compare the hex digest with the \`X-Slancha-Signature\` header
4. Reject if the timestamp is more than 5 minutes old (replay protection)

### Python

\`\`\`python
import hmac
import hashlib
import time

def verify_webhook(request, secret):
    signature = request.headers.get("X-Slancha-Signature")
    timestamp = request.headers.get("X-Slancha-Timestamp")
    body = request.get_data(as_text=True)

    # Replay protection
    if abs(time.time() - int(timestamp)) > 300:
        return False

    expected = hmac.new(
        secret.encode(),
        f"{timestamp}.{body}".encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected)
\`\`\`

### TypeScript / Node.js

\`\`\`typescript
import crypto from 'crypto';

function verifyWebhook(req: Request, secret: string): boolean {
  const signature = req.headers['x-slancha-signature'] as string;
  const timestamp = req.headers['x-slancha-timestamp'] as string;
  const body = req.body;

  // Replay protection
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(\`\${timestamp}.\${body}\`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
\`\`\`

---

## Retry Policy

If your endpoint returns a non-2xx status code or times out, Slancha retries with exponential backoff:

| Attempt | Delay | Total elapsed |
|---------|-------|--------------|
| 1st retry | 30 seconds | 30s |
| 2nd retry | 2 minutes | 2.5 min |
| 3rd retry | 10 minutes | 12.5 min |
| 4th retry | 30 minutes | 42.5 min |
| 5th retry | 2 hours | 2h 42min |

After 5 failed retries, the delivery is marked as failed. Failed deliveries are visible in your dashboard under **Webhooks → Delivery Log**.

**Timeout:** Your endpoint must respond within **30 seconds**. For long-running workflows, return \`200\` immediately and process asynchronously.

**Idempotency:** Deliveries may arrive more than once. Use the \`id\` field in the event payload to deduplicate.

---

## Example: Full Webhook Handler

### Python (Flask)

\`\`\`python
from flask import Flask, request, jsonify
import hmac, hashlib, time

app = Flask(__name__)
WEBHOOK_SECRET = "whsec_your_signing_secret"

@app.route("/slancha-webhook", methods=["POST"])
def handle_webhook():
    # 1. Verify signature
    sig = request.headers.get("X-Slancha-Signature")
    ts = request.headers.get("X-Slancha-Timestamp")
    body = request.get_data(as_text=True)

    if abs(time.time() - int(ts)) > 300:
        return jsonify({"error": "stale timestamp"}), 401

    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        f"{ts}.{body}".encode(),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(sig, expected):
        return jsonify({"error": "invalid signature"}), 401

    # 2. Parse event
    event = request.json
    event_type = event["type"]
    data = event["data"]

    # 3. Handle by type
    if event_type == "evaluation.completed":
        winner = data["winner"]
        print(f"Eval done — winner: {winner}")
        # Trigger deployment pipeline

    elif event_type == "fine_tuning.completed":
        model = data["fine_tuned_model"]
        print(f"Fine-tuning done — model: {model}")
        # Run eval suite on new model

    elif event_type == "deployment.unhealthy":
        print(f"Alert: {data['name']} is unhealthy — {data['issue']['type']}")
        # Page oncall, open incident

    elif event_type == "auto_promote.triggered":
        print(f"Auto-promoted: {data['fine_tuned_model']}")
        # Log promotion, notify team

    return jsonify({"received": True}), 200
\`\`\`

### TypeScript (Express)

\`\`\`typescript
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

const WEBHOOK_SECRET = 'whsec_your_signing_secret';

app.post('/slancha-webhook', (req, res) => {
  const sig = req.headers['x-slancha-signature'] as string;
  const ts = req.headers['x-slancha-timestamp'] as string;
  const body = req.rawBody.toString();

  if (Math.abs(Date.now() / 1000 - parseInt(ts)) > 300) {
    return res.status(401).json({ error: 'stale timestamp' });
  }

  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(\`\${ts}.\${body}\`)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return res.status(401).json({ error: 'invalid signature' });
  }

  const { type, data } = req.body;

  switch (type) {
    case 'evaluation.completed':
      console.log(\`Eval done — winner: \${data.winner}\`);
      break;
    case 'fine_tuning.completed':
      console.log(\`Fine-tuning done — model: \${data.fine_tuned_model}\`);
      break;
    case 'deployment.unhealthy':
      console.log(\`Alert: \${data.name} unhealthy — \${data.issue.type}\`);
      break;
    case 'auto_promote.triggered':
      console.log(\`Auto-promoted: \${data.fine_tuned_model}\`);
      break;
  }

  res.json({ received: true });
});

app.listen(3000);
\`\`\`

---

## Managing Webhooks

### List Webhooks

\`\`\`bash
curl https://aogutyvup5m15h-8888.proxy.runpod.net/v1/webhooks \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

### Update a Webhook

\`\`\`bash
curl -X PATCH https://aogutyvup5m15h-8888.proxy.runpod.net/v1/webhooks/whk_abc123 \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "events": ["evaluation.completed", "auto_promote.triggered"],
    "active": true
  }'
\`\`\`

### Delete a Webhook

\`\`\`bash
curl -X DELETE https://aogutyvup5m15h-8888.proxy.runpod.net/v1/webhooks/whk_abc123 \\
  -H "Authorization: Bearer sk-sl_your_key_here"
\`\`\`

### Test a Webhook

Send a test event to verify your endpoint is receiving and processing correctly:

\`\`\`bash
curl -X POST https://aogutyvup5m15h-8888.proxy.runpod.net/v1/webhooks/whk_abc123/test \\
  -H "Authorization: Bearer sk-sl_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{ "event_type": "evaluation.completed" }'
\`\`\`

---

## Best Practices

- **Respond quickly.** Return \`200\` within 30 seconds and process asynchronously. Long-running handlers will time out and trigger retries.
- **Implement idempotency.** Store processed event IDs and skip duplicates. Retries and network issues can cause repeated deliveries.
- **Verify signatures.** Always validate the \`X-Slancha-Signature\` header before processing. This prevents spoofed requests.
- **Use specific events.** Subscribe only to events you handle. Subscribing to \`["*"]\` creates unnecessary load.
- **Monitor delivery health.** Check your webhook delivery log in the dashboard. If success rate drops below 95%, investigate your endpoint.
- **Handle unknown events gracefully.** New event types may be added. Return \`200\` for unrecognized types instead of erroring.

## Related

- [API Reference](/docs/api-reference) — full endpoint docs including webhook registration
- [Dashboard Webhooks](/dashboard/webhooks) — manage webhooks and view delivery logs
- [Evaluations](/docs/evaluations) — understand eval events
- [Deployments](/docs/deployments) — understand deployment lifecycle events`},{slug:"tutorial-support-bot",title:"Build a Customer Support Bot",section:"Tutorials",order:11,body:`# Tutorial: Build a Customer Support Bot

Build an AI customer support bot that starts with frontier models and automatically improves over time — routing simple queries to fast, cheap fine-tuned models while escalating complex issues to powerful ones.

**Time:** 30 minutes
**Prerequisites:** Slancha account, Python 3.9+, \`pip install openai\`

---

## What You'll Build

A support bot that:
1. Answers customer questions using Slancha's intelligent router
2. Logs interactions for automatic evaluation
3. Automatically routes simple queries (password reset, order status) to fast 7B models
4. Escalates complex queries (billing disputes, technical bugs) to frontier models
5. Continuously improves as Slancha fine-tunes models on your traffic

---

## Step 1: Set Up the Client

\`\`\`python
import openai
import json
from datetime import datetime

client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

SYSTEM_PROMPT = """You are a helpful customer support agent for Acme Corp.
You handle questions about orders, billing, accounts, and product issues.
Be concise, empathetic, and solution-oriented.
If you can't resolve an issue, offer to escalate to a human agent."""
\`\`\`

## Step 2: Build the Chat Handler

\`\`\`python
def handle_support_query(user_message: str, conversation_history: list = None):
    """Handle a single support query with full conversation context."""
    if conversation_history is None:
        conversation_history = []

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *conversation_history,
        {"role": "user", "content": user_message}
    ]

    response = client.chat.completions.create(
        model="auto",  # Slancha picks the optimal model
        messages=messages,
        temperature=0.3,  # Lower temperature for consistent support answers
        max_tokens=512,
    )

    assistant_message = response.choices[0].message.content

    # Log for analytics
    log_interaction(user_message, assistant_message, response)

    return assistant_message, response


def log_interaction(query, response_text, raw_response):
    """Log interaction for evaluation and fine-tuning data."""
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "query": query,
        "response": response_text,
        "model": raw_response.model,
        "tokens": {
            "prompt": raw_response.usage.prompt_tokens,
            "completion": raw_response.usage.completion_tokens,
        },
        "latency_ms": getattr(raw_response, '_response_ms', None),
    }
    # Append to JSONL file for eval dataset
    with open("support_interactions.jsonl", "a") as f:
        f.write(json.dumps(log_entry) + "\\n")
\`\`\`

## Step 3: Add Category Detection

Categorize queries so you can track what types of questions the bot handles:

\`\`\`python
CATEGORIES = {
    "order_status": "Order tracking, delivery updates, shipping questions",
    "billing": "Payment issues, refunds, invoice questions, subscription changes",
    "account": "Password reset, login issues, profile updates, account deletion",
    "product": "Feature questions, how-to guides, bug reports, compatibility",
    "escalation": "Complex complaints, legal requests, VIP customers",
}

def classify_and_handle(user_message: str, conversation_history: list = None):
    """Classify the query, then handle it."""
    # Use Slancha to classify — the router will pick a fast model for this
    classification = client.chat.completions.create(
        model="auto",
        messages=[{
            "role": "user",
            "content": f"Classify this support query into exactly one category: "
                       f"{', '.join(CATEGORIES.keys())}\\n\\n"
                       f"Query: {user_message}\\n\\nCategory:"
        }],
        max_tokens=20,
        temperature=0,
    )

    category = classification.choices[0].message.content.strip().lower()

    # Handle the actual query
    response_text, raw_response = handle_support_query(
        user_message, conversation_history
    )

    return {
        "category": category,
        "response": response_text,
        "model_used": raw_response.model,
    }
\`\`\`

## Step 4: Add Streaming for Real-Time Responses

\`\`\`python
def handle_support_streaming(user_message: str, conversation_history: list = None):
    """Stream responses for real-time chat UI."""
    if conversation_history is None:
        conversation_history = []

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *conversation_history,
        {"role": "user", "content": user_message}
    ]

    stream = client.chat.completions.create(
        model="auto",
        messages=messages,
        temperature=0.3,
        max_tokens=512,
        stream=True,
    )

    full_response = ""
    for chunk in stream:
        if chunk.choices[0].delta.content:
            token = chunk.choices[0].delta.content
            full_response += token
            print(token, end="", flush=True)  # Real-time output

    print()  # Newline after stream completes
    return full_response
\`\`\`

## Step 5: Create an Evaluation Dataset

After collecting interactions, create an eval to measure quality:

\`\`\`python
import json

def create_eval_dataset(interactions_file="support_interactions.jsonl", output="eval_dataset.jsonl"):
    """Convert logged interactions into an evaluation dataset."""
    eval_entries = []

    with open(interactions_file) as f:
        for line in f:
            entry = json.loads(line)
            eval_entries.append({
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": entry["query"]},
                    {"role": "assistant", "content": entry["response"]},
                ],
                "metadata": {
                    "category": entry.get("category", "unknown"),
                    "model": entry["model"],
                }
            })

    with open(output, "w") as f:
        for entry in eval_entries:
            f.write(json.dumps(entry) + "\\n")

    print(f"Created eval dataset with {len(eval_entries)} entries")
    return output
\`\`\`

Then upload it to Slancha:

\`\`\`python
# Upload eval dataset
dataset = client.post(
    "/v1/datasets",
    files={"file": open("eval_dataset.jsonl", "rb")},
    data={"name": "support-bot-evals", "type": "evaluation"}
)

# Create evaluation
evaluation = client.post("/v1/evaluations", json={
    "dataset_id": dataset["id"],
    "metrics": ["accuracy", "helpfulness", "conciseness"],
    "auto_promote": True  # Automatically trigger fine-tuning if quality threshold met
})
\`\`\`

## Step 6: Monitor and Improve

Once your bot is live, Slancha's improvement loop kicks in automatically:

1. **Week 1:** All traffic routes through frontier models (GPT-4o, Claude). You get high quality but pay full price.

2. **Week 2-3:** Slancha's eval engine analyzes your traffic patterns. It identifies that ~60% of queries are simple (password resets, order lookups) and can be handled by a smaller model.

3. **Month 1:** Slancha fine-tunes a 7B model on your traffic data. Simple queries start routing to this model — same quality, 80% cheaper.

4. **Ongoing:** The router continuously adjusts. New query types start on frontier models, then get absorbed into fine-tuned models as data accumulates.

\`\`\`
# Check your optimization progress in the dashboard
curl -H "Authorization: Bearer $SLANCHA_API_KEY" \\
  https://aogutyvup5m15h-8888.proxy.runpod.net/v1/deployments/metrics

# Response shows routing distribution:
# {
#   "routing": {
#     "fine_tuned_7b": 0.62,    # 62% of traffic
#     "llama_70b": 0.23,         # 23% of traffic
#     "gpt_4o": 0.15             # 15% of traffic (complex only)
#   },
#   "cost_savings": "74%",
#   "quality_score": 0.94
# }
\`\`\`

## Full Example: Flask API

\`\`\`python
from flask import Flask, request, jsonify, Response
import openai
import json

app = Flask(__name__)
client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

SYSTEM_PROMPT = "You are a helpful customer support agent for Acme Corp."

@app.route("/api/support", methods=["POST"])
def support():
    data = request.json
    user_message = data["message"]
    history = data.get("history", [])

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": user_message}
    ]

    response = client.chat.completions.create(
        model="auto",
        messages=messages,
        temperature=0.3,
        max_tokens=512,
    )

    return jsonify({
        "response": response.choices[0].message.content,
        "model": response.model,
        "tokens_used": response.usage.total_tokens,
    })

@app.route("/api/support/stream", methods=["POST"])
def support_stream():
    data = request.json
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *data.get("history", []),
        {"role": "user", "content": data["message"]}
    ]

    def generate():
        stream = client.chat.completions.create(
            model="auto",
            messages=messages,
            temperature=0.3,
            stream=True,
        )
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {json.dumps({'token': chunk.choices[0].delta.content})}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return Response(generate(), mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(port=5000)
\`\`\`

## What's Next

- [Cost Optimization Guide](/docs/tutorial-cost-optimization) — maximize savings across workloads
- [RAG Pipeline Tutorial](/docs/tutorial-rag-pipeline) — add intelligent routing to retrieval-augmented generation
- [Evaluations](/docs/evaluations) — deep dive into eval metrics and auto-promotion
- [API Reference](/docs/api-reference) — full endpoint documentation`},{slug:"tutorial-rag-pipeline",title:"Smart RAG Pipeline",section:"Tutorials",order:12,body:`# Tutorial: Smart RAG Pipeline with Intelligent Routing

Build a retrieval-augmented generation pipeline that uses Slancha's router to pick the right model for each query — fast models for simple lookups, powerful models for complex synthesis.

**Time:** 25 minutes
**Prerequisites:** Slancha account, Python 3.9+, \`pip install openai chromadb\`

---

## Why Smart Routing for RAG?

Most RAG pipelines send every query to the same model. But not all queries need the same level of reasoning:

| Query Type | Example | Ideal Model | Why |
|---|---|---|---|
| Simple lookup | "What's our refund policy?" | Fast 7B | Answer is directly in the docs |
| Multi-hop reasoning | "Compare our enterprise and team plans, including hidden costs" | Frontier | Needs to synthesize across multiple chunks |
| Summarization | "Summarize the Q3 product updates" | Mid-range 13B | Moderate complexity |
| Creative | "Write a customer-facing announcement about this feature" | Frontier | Quality matters most |

Slancha handles this automatically — you just send requests with \`model: "auto"\`.

---

## Step 1: Set Up Vector Store

\`\`\`python
import chromadb
import openai

# Slancha client
client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

# Local vector store (swap for Pinecone, Weaviate, etc. in production)
chroma = chromadb.Client()
collection = chroma.create_collection("knowledge_base")
\`\`\`

## Step 2: Index Your Documents

\`\`\`python
def chunk_document(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """Split document into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
    return chunks


def index_documents(documents: list[dict]):
    """Index documents into the vector store.

    Each document: {"title": "...", "content": "...", "source": "..."}
    """
    all_chunks = []
    all_ids = []
    all_metadata = []

    for doc in documents:
        chunks = chunk_document(doc["content"])
        for i, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_ids.append(f"{doc['title']}_{i}")
            all_metadata.append({
                "title": doc["title"],
                "source": doc["source"],
                "chunk_index": i,
            })

    collection.add(
        documents=all_chunks,
        ids=all_ids,
        metadatas=all_metadata,
    )
    print(f"Indexed {len(all_chunks)} chunks from {len(documents)} documents")


# Example: index your docs
index_documents([
    {
        "title": "Refund Policy",
        "content": "Acme Corp offers a 30-day money-back guarantee on all plans...",
        "source": "help-center/refunds"
    },
    {
        "title": "Enterprise Plan",
        "content": "The Enterprise plan includes SSO, dedicated support, custom SLAs...",
        "source": "pricing/enterprise"
    },
    # Add your documents here
])
\`\`\`

## Step 3: Build the RAG Query Function

\`\`\`python
def rag_query(question: str, n_results: int = 5) -> dict:
    """Answer a question using RAG with Slancha's intelligent routing."""

    # 1. Retrieve relevant chunks
    results = collection.query(
        query_texts=[question],
        n_results=n_results,
    )

    # 2. Build context from retrieved chunks
    context_chunks = []
    sources = set()
    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i]
        context_chunks.append(f"[{meta['title']}]\\n{doc}")
        sources.add(f"{meta['title']} ({meta['source']})")

    context = "\\n\\n---\\n\\n".join(context_chunks)

    # 3. Generate answer with Slancha — router picks the right model
    response = client.chat.completions.create(
        model="auto",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a knowledgeable assistant. Answer the user's question "
                    "based ONLY on the provided context. If the context doesn't contain "
                    "enough information, say so clearly. Cite sources when possible."
                )
            },
            {
                "role": "user",
                "content": f"Context:\\n{context}\\n\\n---\\n\\nQuestion: {question}"
            }
        ],
        temperature=0.2,
        max_tokens=1024,
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": list(sources),
        "model_used": response.model,
        "tokens": response.usage.total_tokens,
    }
\`\`\`

## Step 4: Add Streaming RAG

\`\`\`python
def rag_query_stream(question: str, n_results: int = 5):
    """Stream a RAG response for real-time UIs."""

    results = collection.query(query_texts=[question], n_results=n_results)
    context = "\\n\\n---\\n\\n".join(results["documents"][0])

    stream = client.chat.completions.create(
        model="auto",
        messages=[
            {
                "role": "system",
                "content": "Answer based ONLY on the provided context. Be concise and cite sources."
            },
            {
                "role": "user",
                "content": f"Context:\\n{context}\\n\\nQuestion: {question}"
            }
        ],
        temperature=0.2,
        max_tokens=1024,
        stream=True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
\`\`\`

## Step 5: Evaluate RAG Quality

Create an eval dataset from real queries and measure answer quality:

\`\`\`python
def evaluate_rag(test_questions: list[dict]):
    """Run evaluation on RAG pipeline.

    Each entry: {"question": "...", "expected_answer": "...", "category": "..."}
    """
    results = []

    for test in test_questions:
        result = rag_query(test["question"])

        # Use Slancha to judge answer quality
        judgment = client.chat.completions.create(
            model="auto",
            messages=[{
                "role": "user",
                "content": (
                    f"Rate this answer on a scale of 1-5 for accuracy and completeness.\\n\\n"
                    f"Question: {test['question']}\\n"
                    f"Expected: {test['expected_answer']}\\n"
                    f"Actual: {result['answer']}\\n\\n"
                    f"Score (just the number):"
                )
            }],
            max_tokens=5,
            temperature=0,
        )

        score = float(judgment.choices[0].message.content.strip())
        results.append({
            "question": test["question"],
            "score": score,
            "model": result["model_used"],
            "category": test.get("category", "general"),
        })

    avg_score = sum(r["score"] for r in results) / len(results)
    print(f"Average quality score: {avg_score:.2f}/5.0")
    print(f"Models used: {set(r['model'] for r in results)}")

    return results
\`\`\`

## Step 6: Production FastAPI Server

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    question: str
    n_results: int = 5

@app.post("/api/ask")
async def ask(query: Query):
    result = rag_query(query.question, query.n_results)
    return result

@app.post("/api/ask/stream")
async def ask_stream(query: Query):
    async def generate():
        for token in rag_query_stream(query.question, query.n_results):
            yield f"data: {json.dumps({'token': token})}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
\`\`\`

## How Slancha Optimizes This Over Time

1. **Week 1:** The router learns your query patterns — which questions are simple lookups vs. complex synthesis
2. **Week 2-4:** Simple factual queries route to fast, cheap models (sub-50ms). Complex queries stay on frontier models
3. **Month 2+:** Slancha fine-tunes domain-specific models on your RAG interactions, improving answer quality while reducing cost

The result: your RAG pipeline gets faster, cheaper, and more accurate — without any code changes.

## What's Next

- [Customer Support Bot Tutorial](/docs/tutorial-support-bot) — build a full support agent
- [Cost Optimization Guide](/docs/tutorial-cost-optimization) — maximize cost savings
- [Router Configuration](/docs/router) — customize routing behavior
- [Evaluations](/docs/evaluations) — set up automated quality monitoring`},{slug:"tutorial-cost-optimization",title:"Cost Optimization Guide",section:"Tutorials",order:13,body:`# Tutorial: Cost Optimization Guide

A practical playbook for reducing AI inference costs by 60-80% using Slancha's intelligent routing and automated fine-tuning — without sacrificing quality.

**Time:** 20 minutes
**Prerequisites:** Slancha account with at least 1 week of traffic data

---

## The Cost Problem

Most teams overspend on AI inference because they use one model for everything:

\`\`\`
❌ Typical setup:
   ALL requests → GPT-4o → $15/M input tokens, $60/M output tokens

✅ With Slancha:
   Simple queries (60%) → Fine-tuned 7B → $0.20/M tokens
   Medium queries (25%) → Llama 70B     → $0.90/M tokens
   Complex queries (15%) → GPT-4o       → $15/$60/M tokens

   Result: 70-80% cost reduction, same quality
\`\`\`

---

## Step 1: Baseline Your Current Costs

Before optimizing, understand what you're spending:

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-sl_your_key_here"
)

# Check current usage via API
usage = client.get("/v1/usage/summary?period=30d")
print(f"Total requests: {usage['total_requests']:,}")
print(f"Total tokens: {usage['total_tokens']:,}")
print(f"Total cost: \${usage['total_cost']:.2f}")
print(f"Avg cost per request: \${usage['avg_cost_per_request']:.4f}")
print(f"Model distribution: {usage['model_distribution']}")
\`\`\`

Or check the [Dashboard → Usage](/dashboard/usage) for a visual breakdown.

## Step 2: Understand Your Traffic Mix

Slancha automatically categorizes your requests. Check which types dominate:

\`\`\`python
# Get routing analytics
analytics = client.get("/v1/deployments/analytics?period=7d")

for category in analytics["categories"]:
    print(f"{category['name']:25} {category['percentage']:5.1f}%  "
          f"avg_tokens: {category['avg_tokens']:5}  "
          f"complexity: {category['complexity']}")

# Typical output:
# simple_lookup               42.3%  avg_tokens:   180  complexity: low
# summarization               18.7%  avg_tokens:   450  complexity: medium
# code_generation             15.2%  avg_tokens:   680  complexity: high
# creative_writing             8.4%  avg_tokens:   520  complexity: medium
# multi_step_reasoning         7.1%  avg_tokens:   890  complexity: high
# classification               8.3%  avg_tokens:    45  complexity: low
\`\`\`

## Step 3: Configure Cost-Optimized Routing

Tell the router your cost preferences:

\`\`\`python
# Set routing preferences
client.put("/v1/router/config", json={
    "strategy": "cost_optimized",  # Options: balanced, quality_first, cost_optimized
    "quality_threshold": 0.90,      # Minimum quality score (0-1) before downgrading
    "max_latency_ms": 2000,         # Maximum acceptable latency
    "fallback_model": "gpt-4o",     # Use for requests the router can't classify
})
\`\`\`

**Strategy options:**

| Strategy | Behavior | Best For |
|---|---|---|
| \`quality_first\` | Always pick the most capable model | Critical applications, low volume |
| \`balanced\` (default) | Optimize cost while maintaining quality | Most workloads |
| \`cost_optimized\` | Aggressively route to cheaper models | High volume, cost-sensitive |

## Step 4: Accelerate Fine-Tuning

Slancha fine-tunes automatically, but you can speed it up:

\`\`\`python
# Upload your existing data to bootstrap fine-tuning
with open("historical_conversations.jsonl", "rb") as f:
    dataset = client.post("/v1/datasets", files={"file": f}, data={
        "name": "historical-support-data",
        "type": "training",
    })

# Trigger fine-tuning job manually (usually Slancha does this automatically)
fine_tune = client.post("/v1/fine-tuning", json={
    "dataset_id": dataset["id"],
    "base_model": "qwen-2.5-7b",
    "task_type": "customer_support",
    "auto_promote": True,     # Deploy automatically if quality checks pass
    "eval_split": 0.1,        # Hold out 10% for evaluation
})

print(f"Fine-tuning job: {fine_tune['id']}")
print(f"Estimated completion: {fine_tune['estimated_completion']}")
\`\`\`

## Step 5: Set Up Cost Alerts

\`\`\`python
# Configure cost alerts and budgets
client.put("/v1/settings/billing", json={
    "monthly_budget": 500,          # Hard cap in USD
    "alert_thresholds": [0.5, 0.8, 0.95],  # Alert at 50%, 80%, 95%
    "alert_webhook": "https://your-app.com/webhooks/cost-alert",
    "overage_behavior": "throttle",  # Options: throttle, block, notify_only
})
\`\`\`

## Step 6: Optimize Prompt Length

Shorter prompts = lower costs. Use the eval engine to find the minimum effective prompt:

\`\`\`python
# Example: test progressively shorter system prompts
prompts = [
    # Original (long)
    "You are a helpful, knowledgeable customer support agent for Acme Corp. "
    "You should always be polite, professional, and empathetic. When answering "
    "questions, provide clear step-by-step instructions. If you cannot resolve "
    "an issue, offer to escalate to a human agent...",  # 400 tokens

    # Compressed
    "You are Acme Corp support. Be concise and helpful. "
    "Offer escalation if you can't resolve the issue.",  # 25 tokens

    # Minimal
    "Acme Corp support agent. Be concise. Escalate if needed.",  # 12 tokens
]

# Test each against your eval dataset
for i, prompt in enumerate(prompts):
    eval_result = client.post("/v1/evaluations", json={
        "dataset_id": "support-eval-dataset",
        "system_prompt": prompt,
        "metrics": ["accuracy", "helpfulness"],
    })
    print(f"Prompt {i+1} ({len(prompt.split())} words): "
          f"accuracy={eval_result['scores']['accuracy']:.3f}, "
          f"helpfulness={eval_result['scores']['helpfulness']:.3f}")

# Often the compressed version scores within 2% of the original
# but uses 94% fewer prompt tokens
\`\`\`

## Cost Optimization Checklist

Use this checklist to maximize savings:

### Quick Wins (Day 1)
- [ ] Switch to \`model: "auto"\` instead of hardcoding a model
- [ ] Set routing strategy to \`"balanced"\` or \`"cost_optimized"\`
- [ ] Set a monthly budget and cost alerts
- [ ] Remove unnecessary instructions from system prompts

### Medium Term (Week 1-2)
- [ ] Upload historical data to bootstrap fine-tuning
- [ ] Run prompt compression experiments
- [ ] Review model distribution in dashboard — ensure simple queries aren't hitting frontier models
- [ ] Enable \`auto_promote\` for fine-tuning jobs

### Long Term (Month 1+)
- [ ] Monitor fine-tuned model coverage — target 60%+ of traffic on fine-tuned models
- [ ] Review eval scores quarterly — quality should hold steady as costs drop
- [ ] Test new base models when released (Slancha adds them automatically)
- [ ] Consider dedicated MIG partitions for high-volume, stable workloads

## Expected Savings Timeline

| Timeframe | Typical Savings | What's Happening |
|---|---|---|
| Day 1 | 10-20% | Smart routing avoids over-provisioning |
| Week 2 | 30-40% | Router learns your traffic patterns |
| Month 1 | 50-65% | First fine-tuned models deployed |
| Month 3 | 65-80% | Multiple fine-tuned models, optimized routing |
| Month 6+ | 75-85% | Mature routing + MIG optimization + multi-token prediction |

## What's Next

- [Benchmarks](/benchmarks) — see real performance data
- [ROI Calculator](/roi-calculator) — model savings for your specific workload
- [Customer Support Bot Tutorial](/docs/tutorial-support-bot) — build a support bot
- [RAG Pipeline Tutorial](/docs/tutorial-rag-pipeline) — optimize your RAG pipeline
- [API Reference](/docs/api-reference) — full endpoint documentation`}],t=[{name:"Introduction",slugs:["getting-started","quickstart"]},{name:"Concepts",slugs:["architecture","how-routing-works"]},{name:"Evaluate",slugs:["evaluations"]},{name:"Deploy",slugs:["deployments"]},{name:"Post-Train",slugs:["post-training"]},{name:"Router",slugs:["router"]},{name:"API",slugs:["api-reference","models","sdks"]},{name:"Migrate",slugs:["migration"]},{name:"Tutorials",slugs:["tutorial-support-bot","tutorial-rag-pipeline","tutorial-cost-optimization"]}];export{t as a,e as d};

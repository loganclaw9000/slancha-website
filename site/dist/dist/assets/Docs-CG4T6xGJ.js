import{u as c,j as e,a as u,N as d,L as m,F as p}from"./index-BkqLfvLU.js";import{M as h}from"./index-BtIwARWC.js";const i=[{slug:"getting-started",title:"Getting Started",section:"Introduction",order:1,body:`# Getting Started with Slancha

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

- [Router Configuration](/docs/router) — customize routing rules
- [API Reference](/docs/api-reference) — full endpoint documentation
- [Models](/docs/models) — available models and their characteristics`},{slug:"router",title:"Router Configuration",section:"Router",order:2,body:`# Router Configuration

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

For explicit control, you can still specify any model by name — the request bypasses routing and goes directly to that model.`},{slug:"api-reference",title:"API Reference",section:"API",order:3,body:`# API Reference

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
| 503 | Model temporarily unavailable |`},{slug:"models",title:"Available Models",section:"API",order:4,body:`# Available Models

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

You can lock specific models by setting them in your [Router Configuration](/docs/router).`}],g=[{name:"Introduction",slugs:["getting-started"]},{name:"Router",slugs:["router"]},{name:"API",slugs:["api-reference","models"]}];function b(){const{slug:a}=c(),r=a||"getting-started",s=i.find(t=>t.slug===r);return a&&!s?e.jsx(u,{to:"/docs",replace:!0}):e.jsxs("div",{className:"page",children:[e.jsx(d,{}),e.jsxs("div",{className:"docs-layout",children:[e.jsx("aside",{className:"docs-sidebar",children:e.jsx("div",{className:"docs-sidebar-inner",children:g.map(t=>e.jsxs("div",{className:"docs-section",children:[e.jsx("h3",{className:"docs-section-title",children:t.name}),e.jsx("ul",{className:"docs-nav-list",children:t.slugs.map(o=>{const n=i.find(l=>l.slug===o);return n?e.jsx("li",{children:e.jsx(m,{to:`/docs/${o}`,className:`docs-nav-link${r===o?" active":""}`,children:n.title})},o):null})})]},t.name))})}),e.jsx("main",{className:"docs-content",children:s&&e.jsx("article",{className:"docs-article",children:e.jsx(h,{children:s.body})})})]}),e.jsx(p,{})]})}export{b as default};

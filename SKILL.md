# Slancha AI Inference

## Description
World-class AI inference shouldn't require a world-class infrastructure team. Slancha closes that gap. OpenAI-compatible API with intelligent model routing, automated fine-tuning on your usage data, inference optimization (quantization, MIG GPU packing), and continuous redeployment.

## Authentication
Bearer token with `sk-sl_` prefix. Get a free key at https://slancha.ai/signup (no credit card required, 10K requests/month hard cap on Free tier).

## Quick Start

### Python
```python
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-sl_YOUR_KEY",
)

response = client.chat.completions.create(
    model="auto",  # Slancha routes to the best model for the task
    messages=[{"role": "user", "content": "Summarize this quarterly report..."}],
)
print(response.choices[0].message.content)
```

### JavaScript
```javascript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.slancha.ai/v1",
  apiKey: "sk-sl_YOUR_KEY",
});

const response = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "Summarize this quarterly report..." }],
});
console.log(response.choices[0].message.content);
```

### cURL
```bash
curl https://api.slancha.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-sl_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "auto", "messages": [{"role": "user", "content": "Hello"}]}'
```

## Capabilities
- **inference**: Send chat completions with intelligent model routing (`model: "auto"` or specify a model)
- **evaluations**: Benchmark models against custom datasets and metrics
- **fine-tuning**: LoRA fine-tuning on your production usage data with auto-promotion
- **deployments**: Deploy and scale model endpoints with canary releases
- **router**: Configure routing strategy, cost/quality tradeoffs, and model preferences
- **datasets**: Upload and manage training/evaluation datasets
- **webhooks**: Subscribe to events (deployment, fine-tuning, evaluation completion)

## Pricing
- **Free**: $0 (10K requests/month hard cap, no overage, BYOK routing, community support)
- **Hobbyist**: $9/month (50K routed requests included, then $0.50 per 1K, full dashboard, email support)
- **Pro**: $249/month (100K routed requests included, then $0.40 per 1K, plus 2 LoRA adapters + 1 training run/mo up to 10M tokens and 16B, SLA, priority queue, Slack)
- **Enterprise**: $2,000+/month, rates negotiable (volume routing, unlimited fine-tuning deploys at $500 small/$2,000 large base, SOC 2, HIPAA, SSO, VPC, dedicated CSM)

## API Specification
https://slancha.ai/openapi.yaml

## Documentation
https://slancha.ai/llms.txt

# Slancha AI Inference

## Description
End-to-end AI inference platform with an OpenAI-compatible API. Intelligent model routing, automated fine-tuning on your usage data, inference optimization (quantization, MIG GPU packing), and continuous redeployment. One endpoint, zero configuration.

## Authentication
Bearer token with `sk-sl_` prefix. Get a free key at https://slancha.ai/signup (no credit card required, 10K requests/month on Starter tier).

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
- **Starter**: Free (10K requests/month, 20+ models, zero markup)
- **Pro**: $49/month (unlimited requests, all models, analytics)
- **Scale**: $499/month (automated fine-tuning, inference optimization, 40-60% cheaper than frontier)
- **Enterprise**: Custom (self-hosted, SOC 2, HIPAA, dedicated support)

## API Specification
https://slancha.ai/openapi.yaml

## Documentation
https://slancha.ai/llms.txt

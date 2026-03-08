# Slancha — Product & Brand Brief

## Positioning

**The Databricks of AI Inference**

Core principle: customers make one decision — how fast do I need responses. They pick a P99 latency target. Slancha works backward from that to determine model optimization, infrastructure, and cost. We charge a premium on cloud savings.

## Offerings

### Short-Term: Model Optimization Agent

**Option 1 — Managed Hosting**
Customer uploads their model. Slancha optimizes it to hit the latency target and hosts it at an hourly rate. Optional premium for specific CSP/region placement.

**Option 2 — Self-Hosted Deployment**
Customer uploads their model. Slancha converts it to a NIM + secure deployment package (NIM + CloudFormation templates for API Gateway, auth, etc.). Customers self-host on CSP-of-choice or air-gapped on-prem.

### Long-Term: Autonomous SRE Agent

Full orchestration layer built on NIMs, targeting large customers. Manages Kubernetes autoscaling and GPU bin-packing to reduce infra costs while maintaining latency SLAs. Performs continuous benchmarking and dynamic hardware selection — e.g. Inferentia overnight, L40S during business hours, B200 during peak demand.

## Technology Stack

Slancha wraps industry-standard tools behind a single latency-driven interface:

- **Runtimes**: PyTorch, ONNX, TensorRT, TensorRT-LLM, vLLM
- **Optimization**: onnx-graphsurgeon, NVIDIA Model Optimizer, llmcompressor (pruning, quantization, distillation)
- **Orchestration**: Slancha proprietary control plane — selects transformations, runtime, hardware config

We turn a fragmented toolchain into a coherent system that automatically selects, composes, and operates these technologies to meet explicit latency SLAs.

## Competitive Landscape

**Direct competitors**: OctoML (compiler-centric, not SLA-centric), Baseten (strong UX, weaker deep infra), Fireworks AI (serving only, no E2E optimization), Together AI (marketplace, not system-of-record)

**Tooling**: NVIDIA (best components, failed to productize the abstraction layer), Hugging Face (inference is a feature not the core system)

**Hyperscalers**: AWS/GCP/Azure — opinionated toward own hardware, poor cross-cloud and on-prem symmetry

## Ideal Customer (Pilot Target)

Running production AI inference in the cloud with meaningful CSP spend. Feeling pressure on gross margin or unit economics. Likely have optimization headroom in model serving, infra, or scaling. Do NOT already have a serious inference optimization team.

**Priority verticals**: inference API vendors, voice AI, contact center AI, conversational AI, AI-enabled vertical SaaS, meeting/transcription tools, knowledge assistants, healthcare admin AI, legal workflow AI

**Good signs**: AI product live, cloud bill rising with usage, inference is a meaningful cost center, team is small and moving fast, founders would rather buy optimization than hire for it

**Pilot contact**: contact@slancha.ai

## Tone

B2B enterprise, technical audience (founders + CTOs). Confident, direct, no fluff. Databricks-level credibility. Not a chatbot wrapper — a serious infrastructure platform.

## Slancha AI Overview

**Ideal Customer Profile:**
- Companies with significant cloud inference spend looking to reduce costs.
- Need two inputs: latency target and model choice.
- Slancha optimizes stack (model optimization, runtime tuning, right‑sizing) for lowest cost while meeting performance goals.
- Seeking pilot partners with real production workloads and meaningful CSP bills.

**Contact:** contact@slancha.ai

**Best‑Fit Portfolio Companies:**
- Running production AI inference in the cloud
- Meaningful CSP spend
- Pressure to improve gross margin/unit economics
- Optimization headroom in model serving, infra, or scaling
- No dedicated inference optimization/platform team

**Priority Verticals:**
- Inference API vendors
- Voice AI / contact‑center AI
- Conversational AI
- AI‑enabled vertical SaaS (meeting transcription, summarization)
- Knowledge assistants / enterprise search
- Healthcare admin AI
- Legal workflow AI

**Good Signs:**
- AI product already live
- Cloud bill rising with usage
- Inference becoming a cost center
- Small, fast‑moving team
- Founders prefer buying optimization over hiring
- Likely waste in provisioning, runtime choice, batching, autoscaling

**Bad Fits:**
- Pre‑production or prototype stage
- Low inference spend
- Workloads too small/sporadic
- Very sophisticated infra teams
- Large enterprise procurement drag

---

## Slancha – The DataBricks of AI Inference

### Core Principle
Customers make a single decision: *How fast do I need responses?* They specify a target P99 latency, and Slancha works backward to determine model optimization, infrastructure, and cost. We charge a premium on cloud savings.

### Packaging Options
**Short‑Term Offering – Model Optimization Agent**
1. **Managed Hosting** – Customers upload their model; we optimize it for the latency target and host it at an hourly rate (optional premium for specific CSP/region).
2. **Self‑Hosted Deployment** – We convert the model into a NIM or secure endpoint with CloudFormation templates. Customers pay a premium to run it themselves on any CSP or air‑gapped on‑prem.

**Long‑Term Offering – Autonomous SRE Agent**
A full orchestration layer built on top of NIMs for large customers. It manages Kubernetes autoscaling and GPU bin‑packing, continuously benchmarking and dynamically selecting hardware (e.g., Inferentia at night, L40S during business hours, B200 at peak) to meet latency SLAs while reducing costs.

### Technology Stack
- **Core Frameworks & Runtimes**: PyTorch, ONNX
- **Graph Optimization / Model Transformation**: onnx‑graphsurgeon, NVIDIA Model Optimizer, llmcompressor (pruning, quantization, distillation)
- **Inference Engines**: TensorRT, TensorRT‑LLM, vLLM
- **Orchestration Layer (Slancha IP)** – decides transformations, runtime targets, and optimal hardware configuration.

### Competitive Landscape
| Direct / Adjacent Competitors | Notes |
|---|---|
| OctoML | Compiler‑centric model optimization; less SLA focus |
| Baseten | Managed inference with good UX; weaker deep infra orchestration |
| Fireworks AI | High‑performance LLM serving; no end‑to‑end optimization |
| Together AI | Cost‑optimized inference marketplace; not a full system of record |

### Tooling Context (Not Products)
- **NVIDIA**: Triton, TensorRT, Model Navigator – best‑in‑class components but historically lacked the abstraction layer customers want.
- **Hugging Face**: Inference Endpoints – excellent ecosystem, inference is a feature rather than core.

### Hyperscaler Native Options (Competitive Pressure)
- Amazon SageMaker / Inferentia
- Google Vertex AI
- Microsoft Azure AI
These are powerful but opinionated toward their own hardware/clouds and lack cross‑cloud/on‑prem symmetry.

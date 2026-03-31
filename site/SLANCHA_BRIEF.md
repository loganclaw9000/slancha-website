# Slancha: Platform Brief

**Purpose:** This document is the source-of-truth brief for the agent building out the Slancha website and company copy. All positioning, technical architecture, and competitive framing should be grounded in this document.

---

## 1. What Slancha Is

Slancha is an **end-to-end AI inference platform**. The core proposition is a **black box approach**: customers do not need to benchmark, evaluate, select, or manage open-source models. They get a single API endpoint. Slancha handles everything behind that endpoint.

Specifically, Slancha:

1. Benchmarks and weighs models against customer validation sets to find the right balance of accuracy, latency, and cost.
2. Routes requests through a router that continuously gets better.
3. Optimizes inference using quantization and GPU efficiency techniques.
4. Fine-tunes task-specific models on customer usage data and continuously redeploys them.

The platform constantly improves. That's the deal.

---

## 2. Technical Architecture (Four Layers)

### 2.1 Layer 1: The Model Router (Customer Gateway)

- Customers get a **single API endpoint**. They no longer pick models by name. All requests go to a single LLM router.
- **Initial implementation:** vLLM + Aurelio Semantic Router.
  - **vLLM** (v0.18.0 as of March 2026) is the dominant open-source LLM serving engine, originally developed at UC Berkeley's Sky Computing Lab. Its core innovation, PagedAttention, manages key-value caches with near-zero memory waste. It supports continuous batching, FP8 inference on H100/Blackwell GPUs, speculative decoding, structured outputs (JSON schema enforcement), multi-modal inputs, and multi-LoRA serving. It exposes an OpenAI-compatible API. Baseten, Fireworks, and most major inference providers use vLLM or comparable engines under the hood.
  - **Semantic Router** (by Aurelio Labs, MIT licensed) is a decision-making layer that routes requests using semantic vector similarity rather than LLM inference. It embeds incoming queries and compares them against pre-defined route utterances using cosine similarity / k-nearest neighbor classification. Routing decisions happen in sub-millisecond time, orders of magnitude faster than using an LLM to classify intent. It supports encoders from OpenAI, Cohere, HuggingFace, and FastEmbed, and can run fully locally.
- **Future evolution:** Fine-tune the task classification model under the hood. Explore novel online learning and optimization techniques to improve routing capability over time. The semantic router's utterance-based routes can be continuously updated as Slancha learns more about each customer's task distribution.
- The router itself, even before any fine-tuning or optimization kicks in, saves customers money by routing requests to appropriately-sized models. Many customers don't even know model routers exist.

### 2.2 Layer 2: Task Analysis and Data Curation

Behind the router, Slancha performs ongoing analysis of the tasks customers are sending to models. Task categories include:

- **Summarization** (e.g., book synopsis, document summaries)
- **Content/text generation** (e.g., writing, book reports, poetry)
- **Code generation** (short-form and long-form)
- **Question answering (QA)** (general knowledge, factual retrieval)
- **Needle-in-a-haystack retrieval** (extracting specific information from very large context windows)

As more requests flow through the router from a specific customer, Slancha curates training data from those actual usage patterns. This data curation happens automatically based on real requests, not from customer-provided datasets.

### 2.3 Layer 3: Automated Fine-Tuning

Using the curated task data, Slancha fine-tunes **smaller, task-specific models** for each customer's common workloads.

- Customers don't see or manage this process. It happens behind the scenes.
- The goal is to migrate customers off expensive frontier cloud-hosted models and onto their own fine-tuned models that match or outperform the frontier models on their specific tasks.
- As open-source model architectures improve, Slancha quietly re-fine-tunes on the new state-of-the-art architecture using the existing curated data. Customers get an automatic upgrade in performance.
- This eliminates the need for customers to build or hire a team that knows how to fine-tune LLMs: data curation, distributed fine-tuning, hyperparameter selection, model architecture selection. All of it is hidden.

### 2.4 Layer 4: Inference Optimization

Even setting fine-tuning aside, there is significant work in optimizing how models are served:

- **Quantization-aware training (QAT):** Models are quantized to **4-bit** (INT4/FP4) precision during training, so they can be served in 4-bit without post-hoc quality degradation. This dramatically reduces memory requirements, often by 4x or more compared to FP16.
- **Multi-Instance GPU (MIG):** Using NVIDIA's MIG technology on Blackwell **B200/B300** GPUs to partition a single GPU into multiple isolated instances, enabling Slancha to pack multiple customer LLMs onto a single GPU. MIG provides hardware-level isolation between workloads with dedicated compute, memory, and cache resources per instance.
- **Multi-token prediction:** An inference technique where the model predicts multiple tokens per forward pass, improving tokens-per-second throughput beyond standard autoregressive decoding.

The inference optimization layer has a major impact on throughput and cost, independent of the fine-tuning benefits.

---

## 3. The Thesis (Why This Matters Now)

Two macro beliefs underpin Slancha, both increasingly supported by market data:

### A. API inference costs are structurally unstable.

The current per-token pricing from frontier providers is subsidized. OpenAI reportedly spent $8.7 billion on Azure inference alone in the first three quarters of 2025, and the company posted a $5 billion loss on $3.7 billion in revenue. Frontier providers are engaged in a pricing war funded by venture capital and hyperscaler cross-subsidies. Per-token costs have dropped roughly 280x over two years, yet total enterprise AI spending is rising because usage is growing even faster than costs are falling.

This dynamic is unsustainable. As one Slancha customer put it: "We're already spending so much money on this, and I know the company is selling this at a loss. At some point they're going to have to raise prices, and then we're really screwed."

Slancha saves customers money today. If frontier providers raise prices (or capital discipline returns to the sector), those savings multiply.

### B. The market is moving from large generalist models to specialist fine-tuned models.

The mixture-of-experts (MoE) architecture is now dominant at the frontier: DeepSeek V3, Mixtral, Qwen 2.5-Max, and Meta's Llama 4 (Scout 17B-16E, Maverick 17B-128E) all use MoE, activating only a fraction of total parameters per token and delivering 3-5x lower compute cost per token than equivalent dense models. The industry is converging on a "multi-model future" where organizations run many task-specific models rather than routing everything through one massive generalist.

Slancha democratizes this approach for teams that don't have specialized AI engineers. Instead of requiring customers to evaluate architectures, curate datasets, and run fine-tuning jobs, Slancha does it automatically based on observed usage patterns.

Inference now accounts for roughly two-thirds of all AI compute demand (up from about one-third in 2023), and analyst estimates project this ratio will continue to grow. The companies that win will be those with the most disciplined inference strategies, not necessarily those with the largest models.

---

## 4. The Core Technical Insight

A critical insight drives the whole platform:

- **For easy tasks (e.g., summarization):** Even a generalized smaller model performs almost identically to a massive frontier model. A small model writing a two-paragraph book synopsis will match GPT-4-class output. Routing alone captures this savings.
- **For hard tasks (e.g., long-form text generation, long-form code generation):** Smaller models struggle, BUT smaller models that are **fine-tuned specifically for that task** can match or outperform frontier generalist models.

The router captures the easy wins. The fine-tuning captures the hard wins. Together, they cover the full spectrum.

---

## 5. Customer Benefits

1. **Cost savings (immediate):** The router sends requests to appropriately-sized models instead of always hitting the most expensive frontier model.
2. **Cost savings (compounding):** Fine-tuned smaller models are cheaper to serve and more efficient than frontier models.
3. **Latency improvement:** Smaller models, quantized and optimized, are faster.
4. **Accuracy improvement:** Task-specific fine-tuned models can match or outperform generalist frontier models on the customer's actual workloads.
5. **Zero technical overhead:** No model selection, no benchmarking, no fine-tuning teams, no hyperparameter tuning, no data curation, no architecture decisions. Customers just use the API.
6. **Automatic upgrades:** When new open-source architectures drop, Slancha re-fine-tunes on existing data. Performance improves without customer action.
7. **Future-proofing against price increases:** If frontier providers raise prices, Slancha customers are already on optimized, fine-tuned models.

---

## 6. Who It's For

Teams using LLM APIs that want to reduce cost and improve performance without building specialized AI/ML infrastructure or hiring fine-tuning engineers.

Slancha delivers the same class of benefits (cost savings, latency optimization) that a team would get from platforms like Fireworks or BaseTen, but **without requiring the sophistication** to understand all the levers. Teams that aren't deeply technical with AI get those benefits without needing to know how.

---

## 7. Competitive Landscape

### Portkey
- **What they are:** AI gateway and production control plane. Recently raised a $15M Series A (Feb 2026, Elevation Capital + Lightspeed). Open-sourced their full gateway in March 2026. Processes 1T+ tokens and 120M+ requests daily across 24,000+ organizations, managing $180M+ in annualized AI spend.
- **What they do well:** Routing across 1,600+ LLMs with sub-millisecond latency. Observability, guardrails, governance, prompt management, cost controls, MCP Gateway for agentic AI. Enterprise governance (policy-as-code, data residency, audit trails).
- **Where Slancha differs:** Portkey is an operations and governance layer. It routes, monitors, and controls. It does not learn, fine-tune, or optimize inference for you. Customers still choose models. Portkey makes multi-model management reliable; Slancha makes it invisible.

### OpenRouter
- **What they are:** A unified API for accessing and routing requests across multiple LLM providers. Abstracts provider-specific APIs and billing behind a single endpoint.
- **What they do:** Scouts for lowest prices and best latencies across dozens of providers. Lets customers choose how to prioritize cost, latency, and throughput. Users can let the router auto-select or pick models manually.
- **Where Slancha differs:** OpenRouter aggregates access and optimizes for price/latency, but it's still a marketplace. It exposes choice. It doesn't analyze task patterns, fine-tune models, or improve over time. It's a smarter switchboard, not an optimization engine.

### Not Diamond
- **What they are:** An AI model router that acts as a "meta-model," recommending the best LLM for each query in under 50ms. Founded on the philosophy that "the future is multi-model." Uses client-side execution (not a proxy; customer data and keys never leave their control).
- **What they do well:** Per-query model recommendation across multiple providers. Supports custom router training with customer evaluation data. Optimizes for quality, cost, or latency. Has prompt adaptation/optimization features. Claims up to 25% accuracy improvement and up to 10x cost reduction through intelligent routing.
- **Where Slancha differs:** Not Diamond is the closest competitor in philosophy but differs in execution model. Not Diamond requires customers to explicitly provide evaluation data up front, pay to optimize, and trigger optimization jobs via API. It runs offline and operates as a recommendation layer. Slancha learns continuously from live traffic with no explicit action required. More critically, Not Diamond routes to existing models; Slancha creates new ones through automated fine-tuning and serves them with optimized inference. The closed loop (route → analyze → fine-tune → optimize → redeploy) is what separates Slancha from a routing-only solution.

### Fireworks AI
- **What they are:** A high-performance inference platform for open-source models. Valued at $4B after raising $254M. Processes 13T+ tokens daily at ~180K requests/sec. Founded by the team that built PyTorch at Meta. Recently acquired Hathora (March 2026) for global compute orchestration. Gold sponsor at GTC 2026. Partnered with Microsoft Foundry.
- **What they do well:** Blazing fast inference via their proprietary FireAttention engine (4x higher throughput, 50% lower latency vs. open-source baselines). Fine-tuning support including reinforcement learning, quantization-aware tuning, and adaptive speculation. Bring-your-own-weights (BYOW). SOC 2 Type II, HIPAA, GDPR compliant.
- **Where Slancha differs:** Fireworks is a platform for sophisticated AI teams. Their CEO explicitly said "We actually are automated customization. That's what we're building, not just inference," which validates the thesis but positions Fireworks as a tool for engineers who understand the levers. Slancha delivers comparable outcomes without requiring that sophistication. Fireworks customers choose models, configure fine-tuning jobs, and manage deployment. Slancha customers just use an API endpoint.

### BaseTen
- **What they are:** An AI inference infrastructure company. Raised $300M at a $5B valuation in January 2026 (IVP, CapitalG, NVIDIA invested $150M). Calls itself "the AWS of inference." Series C, founded 2019, San Francisco.
- **What they do well:** Optimized inference stack with custom kernel optimizations, multi-cloud deployment, 99.99% uptime, auto-scaling with sub-10-second cold starts. Supports vLLM, TensorRT-LLM, and SGLang. Achieved 225% better cost-performance for high-throughput inference on NVIDIA Blackwell. Strong enterprise focus on open runtimes and no model lock-in.
- **Where Slancha differs:** BaseTen is infrastructure. It provides the GPU compute, runtime optimization, and deployment tooling. Customers still need to select models, run their own fine-tuning, and architect their inference pipeline. BaseTen's philosophy is explicitly "we don't believe in black boxes." Slancha's philosophy is the opposite: the black box is the product. BaseTen is a potential infrastructure partner, not a direct competitor at the product layer.

### Competitive Summary

| Capability | Portkey | OpenRouter | Not Diamond | Fireworks | BaseTen | **Slancha** |
|---|---|---|---|---|---|---|
| Unified API endpoint | Yes | Yes | Yes | Yes | Yes | **Yes** |
| Model routing | Config-based | Price/latency | ML-based per-query | Manual selection | Manual selection | **Automatic, continuous** |
| Task analysis | No | No | No | No | No | **Yes** |
| Automated fine-tuning | No | No | No | Customer-driven | No | **Yes, behind the scenes** |
| Inference optimization | No | No | No | Yes (manual) | Yes (manual) | **Yes, automatic** |
| Continuous redeployment | No | No | No | No | No | **Yes** |
| Requires ML expertise | Low | Low | Medium | High | High | **None** |

**The differentiator across all competitors:** No one else closes the loop from routing → task analysis → automated fine-tuning → inference optimization → continuous redeployment. Existing routers sit on top of available models. Inference platforms give engineers powerful tools. Slancha learns, fine-tunes, optimizes, and redeploys, all behind a single endpoint, with zero customer involvement.

---

## 8. Stickiness and Defensibility

The platform becomes stickier over time:

- **Data accumulation:** The longer a customer uses Slancha, the more task data is curated, the better their fine-tuned models get. This creates a compounding advantage that is customer-specific and cannot be replicated by switching to a competitor.
- **Engineering effort to replicate:** If a customer wanted to leave and do this themselves, they'd need to replicate routing, task classification, data curation, fine-tuning pipelines, quantization-aware training, MIG-based serving, and continuous redeployment. That's a full ML engineering team's worth of work. For context, Fireworks (valued at $4B) and BaseTen (valued at $5B) have spent years and hundreds of millions building subsets of this stack.
- **Continuous improvement:** Models get better automatically. Leaving means giving up automatic upgrades when new architectures drop.

---

## 9. Summary Positioning

**What Slancha is:** An end-to-end AI inference platform that gives customers a single API endpoint. Behind that endpoint, Slancha automatically routes requests to the right model, fine-tunes task-specific models on customer usage data, optimizes inference with quantization and GPU efficiency techniques, and continuously redeploys improved models. Customers get better accuracy, lower latency, and lower cost without making any technical decisions.

**Who it's for:** Teams using LLM APIs that want to reduce cost and improve performance without building specialized AI/ML infrastructure or hiring fine-tuning engineers.

**Why now:** Frontier model API pricing is subsidized and structurally unstable. The industry is shifting from large generalist models to smaller specialist models. Inference now accounts for two-thirds of all AI compute. Most teams can't capture this shift on their own. Slancha makes it automatic.

**Why Slancha over alternatives:** Existing routers expose choice and don't improve. Existing optimization tools require upfront work and explicit triggers. Existing inference platforms are tools for engineers. Slancha is the only platform that closes the full loop: route → analyze → fine-tune → optimize → redeploy, continuously, behind the scenes, with no ML expertise required.

---

## 10. Key Terminology Reference

| Term | Definition | Context in Slancha |
|---|---|---|
| **vLLM** | Open-source high-throughput LLM serving engine (UC Berkeley). Core innovation: PagedAttention for memory-efficient KV cache management. Supports continuous batching, FP8, speculative decoding, multi-modal, structured outputs. v0.18.0 as of March 2026. | Powers the initial serving layer |
| **Semantic Router** | Open-source library (Aurelio Labs, MIT license) that routes requests using semantic embedding similarity rather than LLM inference. Sub-millisecond routing decisions via cosine similarity / kNN over pre-defined route utterances. | Powers the initial task classification/routing layer |
| **Quantization** | Reducing model weight precision (e.g., from FP16 to INT4/FP4) to reduce memory and increase speed. QAT (quantization-aware training) preserves quality better than post-training quantization. | Slancha applies QAT so models are served in 4-bit |
| **MIG (Multi-Instance GPU)** | NVIDIA technology that partitions a single GPU into multiple hardware-isolated instances with dedicated compute, memory, and cache | Enables packing multiple customer LLMs onto a single GPU |
| **B200 / B300** | NVIDIA Blackwell-generation GPUs. B200 succeeds H200/H100. | Target hardware for Slancha's inference serving |
| **Multi-token prediction** | Inference technique that predicts multiple tokens per forward pass to increase throughput beyond standard autoregressive decoding | Applied as part of inference optimization |
| **Mixture of experts (MoE)** | Architecture where different "expert" sub-networks activate for different inputs. Only a fraction of total parameters fire per token, delivering 3-5x lower compute cost vs. equivalent dense models. Used by DeepSeek V3, Mixtral, Qwen 2.5, Llama 4. | Aligns with the industry trend Slancha is riding |
| **Fine-tuning** | Training an existing model on task-specific data to improve performance on that task. Includes SFT (supervised fine-tuning), DPO, RLHF, and other post-training methods. | Core to Slancha's automated improvement loop |
| **Frontier models** | The largest, most capable (and most expensive) commercial LLMs (GPT-4/5, Claude, Gemini, etc.). Currently sold at a loss by most providers. | What Slancha moves customers away from for most tasks |
| **Needle-in-a-haystack** | Retrieval task: finding a specific piece of information in a very large context window | One of the task categories Slancha classifies |
| **Tokens per second** | Standard throughput metric for LLM inference | Directly improved by Slancha's optimization layer |
| **PagedAttention** | vLLM's core memory management technique. Treats GPU KV cache like virtual memory pages, enabling near-zero waste and larger batch sizes. | Inherited from vLLM in Slancha's serving layer |
| **Speculative decoding** | Using a small "draft" model to predict tokens, verified by the larger model. Reduces latency for specific model pairs. | Available as an inference optimization technique |

---

## 11. Founding Team

- **Paul Logan:** Co-founder. Positioning, GTM, investor narrative, website direction.
- **James Maki:** Co-founder / technical lead. Architecture, fine-tuning pipeline, inference optimization strategy.

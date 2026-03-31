export const posts = [
  {
    slug: 'slancha-vs-databricks-ai-infrastructure-comparison',
    title: 'Slancha vs. Databricks: The AI Infrastructure Showdown',
    date: '2026-03-31',
    author: 'Slancha Team',
    excerpt: 'Databricks gives you the tools. Slancha does the work. A detailed comparison of two fundamentally different approaches to AI infrastructure — full control vs. automatic results.',
    tags: ['comparison', 'infrastructure', 'enterprise'],
    body: `## The Quick Answer

**Databricks** is a general-purpose AI platform for building, training, and deploying ML models at enterprise scale. It's powerful, flexible, and requires a dedicated ML team to operate.

**Slancha** is a black-box AI inference platform that gives you a single API endpoint. Behind it, we route, analyze, fine-tune, optimize, and redeploy automatically. You get better, faster, cheaper inference without making any technical decisions.

**Choose Databricks if:** You have a sophisticated ML engineering team, you need full control over your infrastructure, and you're building custom ML workflows that require extensive customization.

**Choose Slancha if:** You're using LLM APIs, you want to reduce cost and improve performance, and you don't want to build or manage ML infrastructure.

---

## The Fundamental Difference

### Databricks: The Full Control Platform

Databricks is built for teams that want to own their entire ML stack. You get model training infrastructure (Spark-based distributed training), model registry and versioning, MLOps pipelines for deployment, custom infrastructure configuration, and full visibility into every layer of the stack.

But "full control" means you're the one making decisions. You select models. You configure fine-tuning. You manage deployment. You optimize inference. You hire the team that knows how to do all of this.

### Slancha: The Black Box Platform

Slancha is built for teams that want results without the work. A single API endpoint, automatic model routing, continuous task analysis, automated fine-tuning, inference optimization (quantization, MIG, multi-token prediction), and automatic model upgrades. The loop closes automatically: route → analyze → fine-tune → optimize → redeploy.

---

## Feature Comparison

| Feature | Databricks | Slancha |
|---------|------------|---------|
| **Unified API endpoint** | Yes (but you configure it) | Yes (plug and play) |
| **Model selection** | Your choice (or bring your own) | Ours (automatic) |
| **Model routing** | Manual configuration | Automatic, continuous |
| **Task analysis** | No (you build it) | Yes (built-in) |
| **Fine-tuning** | You run the jobs | Yes (automatic) |
| **Inference optimization** | Manual (you configure) | Yes (automatic) |
| **Quantization** | You enable it | Yes (QAT, 4-bit) |
| **GPU partitioning (MIG)** | You configure | Yes (automatic) |
| **ML expertise required** | High | None |
| **Team size** | 5-10+ ML engineers | 0 |
| **Time to production** | Weeks to months | Hours to days |

---

## Cost Comparison

### Databricks Pricing Model

Databricks charges for compute clusters ($2-8/hour per node), storage, jobs runtime, serverless SQL per DBU, and enterprise support starting at ~$50K/year.

**Hidden costs:** ML engineering salaries ($150K-300K/year per engineer), infrastructure management overhead, fine-tuning job costs (GPU hours), inference optimization effort, and model selection/benchmarking time.

### Slancha Pricing Model

Slancha charges per 1M tokens processed, with usage tiers based on monthly volume. No cluster overhead, no ML team required.

**Savings:** 30-50% immediate cost reduction from model routing. Compounding savings from fine-tuned models. Zero infrastructure management. Zero ML team.

**The reality:** A team using Databricks for LLM workloads typically needs 3-5 ML engineers. That's $500K-1.5M/year in salaries alone. Slancha eliminates that cost entirely.

---

## When Databricks Makes Sense

1. **You have a sophisticated ML team** — 10+ ML engineers who know how to train, fine-tune, and deploy at scale
2. **You need full infrastructure control** — on-prem deployment, custom hardware, specific compliance requirements
3. **You're building custom ML workflows** — novel architectures, domain-specific pipelines
4. **You have a long-term ML roadmap** — multi-year initiative with proprietary model development

---

## When Slancha Makes Sense

1. **You're using LLM APIs today** — paying for OpenAI, Anthropic, or other frontier model APIs and frustrated by costs
2. **You don't have an ML team** — application developers who know APIs but not fine-tuning
3. **You want automatic improvements** — inference that gets better over time without action on your part
4. **You need speed to production** — deploy LLM inference today, not in months

---

## Migration Path: From Databricks to Slancha

**What you change:** Swap your Databricks endpoint for Slancha's single endpoint. Stop selecting models, running fine-tuning jobs, and managing serving infrastructure.

**What stays the same:** Your application code (OpenAI-compatible API), your existing training data, your business logic.

**Timeline:** 1 month — integrate in parallel (week 1), compare performance (week 2), gradual traffic shift (week 3), full migration (week 4).

---

## Bottom Line

**Databricks** is for teams that want to build their own AI infrastructure — a platform for ML engineers who need full control and are willing to do the work.

**Slancha** is for teams that want to use AI infrastructure without building it — a product for application developers who want results without the work.

Choose based on what you actually need, not what sounds cool on a pitch deck.

---

*Need inference that just works? [Request a pilot](/contact) and see the difference.*`,
  },
  {
    slug: 'from-prototype-to-production-ai-deployment-checklist',
    title: 'From Prototype to Production: The AI Deployment Checklist',
    date: '2026-03-30',
    author: 'Slancha Team',
    excerpt: 'Most AI projects that "work" in prototype never make it to production. This checklist covers what actually breaks and how to fix it — routing, data curation, quantization, GPU efficiency, and more.',
    tags: ['production', 'deployment', 'checklist', 'engineering'],
    body: `## The Gap Nobody Talks About

You've trained your model. It works on your validation set. The accuracy looks good. So you deploy it to production, right?

Wrong. Most AI projects that "work" in prototype never make it to production — not because the model is bad, but because teams don't understand what production actually requires. A notebook that returns the right answer when you click "run" is fundamentally different from a system that serves the right answer to 10,000 users simultaneously.

---

## 1. The Router Problem: You're Using the Wrong Model

Most teams start with one model, then deploy that same model for everything. Customer support summarization, code generation, and marketing copy all hit the same model. Three different workloads, three different optimal models, three different cost profiles.

**Production fix:** Implement model routing. A router that analyzes incoming requests and sends them to the appropriate model saves 30-50% on inference costs before you even fine-tune anything.

**What to measure:** Average latency per task type, cost per request by task type, accuracy variance, router decision time (<1ms).

---

## 2. Data That Actually Matters

Your model was trained on static data. But production doesn't stay static. Users ask questions you didn't predict. They push edge cases.

**Production fix:** Curate training data from actual usage, not from a dataset you downloaded. The models that win in production are the ones that get fine-tuned on actual user requests.

The loop: Route → Analyze task patterns → Curate training data → Fine-tune task-specific models → Optimize inference → Redeploy → Repeat.

---

## 3. Quantization: The 4x Memory Savings You're Ignoring

A 7B parameter model at FP16 takes ~14GB for weights. A 70B model takes ~140GB. You're spending more on GPU memory than you need to.

**Production fix:** Apply quantization-aware training (QAT). Train with quantization built in for 4-bit INT4/FP4 models that maintain accuracy but use 4x less memory. That's 4x the traffic on the same hardware.

**What to measure:** Size before/after, accuracy drop (<1-2% with QAT), throughput improvement, memory usage under load.

---

## 4. GPU Efficiency: Stop Wasting Hardware

You bought a B200 GPU for $30,000 with 192GB of memory. And you're running one model on it.

**Production fix:** Use Multi-Instance GPU (MIG) to partition your GPU. Each instance gets dedicated compute, memory, and cache resources. Pack multiple fine-tuned models onto one GPU with hardware-level isolation.

That B200 isn't $30,000 per model. It's $30,000 divided by however many models you can fit.

---

## 5. Multi-Token Prediction: Speed Up Without Training

Standard autoregressive decoding predicts one token per forward pass. Multi-token prediction predicts multiple tokens per pass. Go from 1 to 4 tokens/pass and you've increased throughput by 4x without changing the model architecture.

**What to measure:** Tokens per second before/after, quality degradation (negligible), memory impact per batch, latency distribution.

---

## 6. Latency Targets: Know Your SLA

500ms average latency — is that good? Depends. User-facing chat? Terrible. Batch summarization overnight? Perfect.

**Production fix:** Define latency SLAs for each workload and route accordingly. Real-time chat needs <200ms. Document summarization can take 2-3 seconds. Code generation might be fine at 500ms.

**What to measure:** P50, P95, P99 latency per task type, SLA compliance rate, latency vs. cost tradeoffs.

---

## 7. The Upgrade Problem: Models Get Better Automatically

Llama 3.2 drops with 15% better performance. Your customers expect that improvement. But you don't want to re-fine-tune everything manually.

**Production fix:** Automate model upgrades. When a new architecture drops, re-fine-tune on your existing curated data. Customers get automatic improvements without any action on their part.

---

## 8. The Black Box Option: Do It All

Building a production AI deployment system that routes, analyzes, fine-tunes, quantizes, partitions GPUs, and automatically upgrades is a full-time job for a team of ML engineers.

**Production fix:** Use a platform that does this automatically. Slancha gives you a single API endpoint — automatic routing, continuous analysis, automated fine-tuning, quantization-aware serving, GPU partitioning, and model upgrades. The loop closes itself.

---

## Checklist Summary

- [ ] Implement model routing based on task type
- [ ] Set up task analysis and data curation pipeline
- [ ] Apply quantization-aware training for 4-bit serving
- [ ] Configure GPU partitioning (MIG) for efficiency
- [ ] Enable multi-token prediction for throughput
- [ ] Define latency SLAs per workload
- [ ] Automate model upgrades
- [ ] Evaluate platform vs. DIY for ongoing maintenance

---

*Need help deploying AI at scale? Slancha gives you all of this behind a single API endpoint. [Request a pilot](/contact).*`,
  },
  {
    slug: 'building-a-production-ai-router-architecture-patterns',
    title: 'Building a Production AI Router: Architecture Patterns That Scale',
    date: '2026-03-31',
    author: 'Slancha Team',
    excerpt: 'Routing requests to the right model is the easy part. The hard part is doing it at scale with sub-millisecond overhead, graceful degradation, and zero downtime deploys. Here are the architecture patterns that make it work.',
    tags: ['router', 'architecture', 'infrastructure', 'engineering'],
    body: `You've decided to stop sending every request to GPT-4. Smart. But there's a gap between "we should route requests" and "we have a production-grade routing system." This post covers the architecture patterns that bridge that gap — the patterns we built Slancha's router on.

## Pattern 1: Embedding-Based Classification Over LLM Classification

The most common mistake in building a router is using an LLM to classify requests. It works in prototypes. It fails in production.

**Why:** An LLM classifier adds 200-800ms of latency per request. For a routing decision that's supposed to *save* time, you're immediately underwater. Worse, you're now paying for two LLM calls per request — the classifier and the actual completion.

**The production pattern:** Use semantic embeddings for classification. Pre-compute embedding vectors for each route category, then classify incoming requests via cosine similarity against those vectors.

\`\`\`python
# How Slancha's semantic router works internally
import numpy as np
from slancha.router import SemanticClassifier

classifier = SemanticClassifier(
    encoder="fastembed-bge-small-en-v1.5",  # 33M params, runs on CPU
    routes={
        "simple_qa": {
            "utterances": [
                "What is the capital of France?",
                "How many days in a year?",
                "Define photosynthesis",
                # 50-100 representative utterances per route
            ],
            "target_model": "qwen-2.5-7b"
        },
        "code_generation": {
            "utterances": [
                "Write a Python function that sorts a list",
                "Implement a binary search tree in TypeScript",
                "Create a REST API endpoint in Go",
            ],
            "target_model": "qwen-2.5-72b"
        },
        "complex_reasoning": {
            "utterances": [
                "Analyze the trade-offs between microservices and monoliths",
                "Compare three approaches to distributed consensus",
                "Design a system that handles 10M events per second",
            ],
            "target_model": "claude-sonnet"
        }
    }
)

# Classification: ~0.5ms on CPU, ~0.1ms on GPU
route = classifier.classify("Explain how TCP handles congestion control")
# → "complex_reasoning" (similarity: 0.87)
\`\`\`

**Performance characteristics:**

| Method | Latency | Cost per classification | Accuracy |
|--------|---------|----------------------|----------|
| LLM classifier (GPT-4o) | 400-800ms | $0.002-0.008 | 94% |
| LLM classifier (small) | 80-200ms | $0.0002-0.001 | 88% |
| Semantic embedding | 0.3-2ms | ~$0 (CPU) | 91% |
| Semantic embedding (tuned) | 0.3-2ms | ~$0 (CPU) | 93% |

The semantic approach matches LLM accuracy after route utterance tuning, at 200-1000x lower latency and near-zero marginal cost. At 100K requests/day, that's $200-800/month saved on classification alone.

## Pattern 2: Circuit Breakers Per Model Endpoint

In a multi-model system, individual model endpoints fail independently. A router without circuit breakers will keep sending traffic to a degraded endpoint, turning a partial outage into a full one.

**The pattern:** Implement per-endpoint circuit breakers with three states:

\`\`\`
CLOSED (normal) ──── error rate > 20% ────▶ OPEN (blocked)
      ▲                                          │
      │                                    after 30 seconds
      │                                          │
      │                                          ▼
      └──── 3 consecutive successes ◀──── HALF-OPEN (probing)
\`\`\`

\`\`\`python
class ModelCircuitBreaker:
    """Per-endpoint circuit breaker with automatic fallback."""

    def __init__(self, endpoint, fallback_chain):
        self.endpoint = endpoint
        self.fallback_chain = fallback_chain  # ordered list of alternatives
        self.state = "closed"
        self.failure_count = 0
        self.last_failure_time = None
        self.success_streak = 0

    async def route(self, request):
        if self.state == "open":
            if time.time() - self.last_failure_time > 30:
                self.state = "half-open"
            else:
                return await self._fallback(request)

        try:
            response = await self.endpoint.complete(request)
            self._record_success()
            return response
        except (TimeoutError, ServiceUnavailable) as e:
            self._record_failure()
            return await self._fallback(request)

    async def _fallback(self, request):
        for alt in self.fallback_chain:
            if alt.circuit_breaker.state != "open":
                return await alt.complete(request)
        raise AllEndpointsDown()
\`\`\`

**Key design decisions:**

- **Error rate threshold (20%):** Too low and you'll trip on normal variance. Too high and degraded endpoints absorb too much traffic before tripping.
- **Recovery probe interval (30s):** Short enough to recover quickly, long enough to let transient issues resolve.
- **Fallback chain order:** Route to the next-best model for the request category, not just any available model. A code generation request should fall back to another code-capable model, not a general-purpose one.

## Pattern 3: Shadow Traffic for Route Validation

How do you know your routing decisions are correct? You can't A/B test routing in the traditional sense — the user only sees one response. The pattern is shadow traffic.

\`\`\`python
async def route_with_shadow(request, primary_model, shadow_model, sample_rate=0.05):
    """Route to primary, optionally also send to shadow for comparison."""

    # Always send to the routed model
    primary_response = await primary_model.complete(request)

    # 5% of the time, also send to a reference model
    if random.random() < sample_rate:
        # Fire-and-forget — doesn't affect user latency
        asyncio.create_task(
            shadow_eval(request, primary_response, shadow_model)
        )

    return primary_response

async def shadow_eval(request, primary_response, shadow_model):
    """Compare primary response against shadow reference."""
    shadow_response = await shadow_model.complete(request)

    # Score both responses
    scores = await eval_pair(
        request=request,
        response_a=primary_response,
        response_b=shadow_response,
        dimensions=["accuracy", "completeness"]
    )

    # Log for analysis — if the cheaper model consistently matches
    # the expensive one, routing is working. If not, recalibrate.
    await metrics.log_shadow_comparison(
        route=request.routed_to,
        primary_score=scores["a"],
        shadow_score=scores["b"],
        cost_saved=shadow_model.cost - primary_model.cost
    )
\`\`\`

**What shadow traffic tells you:**

- **Route accuracy:** If requests routed to cheap models score within 5% of the frontier model, routing is calibrated correctly.
- **Route drift:** If the gap widens over time, your route utterances need updating — the distribution of incoming requests has shifted.
- **Model degradation:** If a specific model's shadow scores drop, something changed in that model's behavior (provider update, capacity issues).

Run shadow traffic at 3-5% sample rate. Below 3%, you don't get statistically meaningful data fast enough. Above 10%, you're spending too much on shadow calls.

## Pattern 4: Request-Aware Load Balancing

Standard load balancers distribute requests round-robin or by least connections. Neither works for LLM inference because requests have wildly different costs — a 50-token completion takes 200ms while a 4000-token generation takes 8 seconds.

**The pattern:** Weight balancing decisions by estimated request cost, not request count.

\`\`\`python
class CostAwareBalancer:
    """Distribute load by estimated compute cost, not request count."""

    def __init__(self, endpoints):
        self.endpoints = endpoints
        # Track in-flight compute cost per endpoint
        self.inflight_cost = {ep: 0.0 for ep in endpoints}

    def estimate_cost(self, request):
        """Estimate relative compute cost of a request."""
        input_tokens = estimate_tokens(request.messages)
        expected_output = min(request.max_tokens, input_tokens * 1.5)

        # Rough cost model: input is cheap, output is expensive
        return input_tokens * 0.1 + expected_output * 1.0

    async def route(self, request):
        cost = self.estimate_cost(request)

        # Pick the endpoint with lowest in-flight cost
        target = min(self.endpoints, key=lambda ep: self.inflight_cost[ep])

        self.inflight_cost[target] += cost
        try:
            response = await target.complete(request)
            return response
        finally:
            self.inflight_cost[target] -= cost
\`\`\`

This prevents the scenario where one endpoint gets three 4000-token requests while another gets three 50-token requests — they'd both show "3 connections" to a standard balancer, but one is doing 80x more work.

## Pattern 5: Hot-Swap Model Deployment

Model updates shouldn't require downtime. The pattern is blue-green deployment at the model level:

\`\`\`
                    ┌──────────────────┐
                    │   Route Table    │
                    │                  │
                    │  "code" → v2.1   │◀── atomic swap
                    │  "qa"   → v1.3   │
                    │  "chat" → v3.0   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
         │ code v2.1│   │ qa v1.3 │   │chat v3.0│  ← active
         │(serving) │   │(serving)│   │(serving)│
         └─────────┘   └─────────┘   └─────────┘
         ┌─────────┐
         │ code v2.2│  ← warming up (loaded, not receiving traffic)
         │(standby) │
         └─────────┘
\`\`\`

\`\`\`python
class ModelRegistry:
    """Hot-swap models without dropping requests."""

    async def deploy_model(self, route, new_version):
        # 1. Load new model into memory (takes 30-120s for large models)
        new_endpoint = await self.load_model(new_version)

        # 2. Health check — run 10 test prompts
        await self.validate_endpoint(new_endpoint, route.test_cases)

        # 3. Canary: send 5% of traffic to new version
        route.add_canary(new_endpoint, weight=0.05)
        await asyncio.sleep(300)  # 5 minutes of canary traffic

        # 4. Check canary metrics
        canary_metrics = await self.get_metrics(new_endpoint, window="5m")
        if canary_metrics.error_rate > 0.02 or canary_metrics.p99_latency > route.sla:
            route.remove_canary(new_endpoint)
            await self.unload_model(new_endpoint)
            raise DeploymentFailed(f"Canary failed: {canary_metrics}")

        # 5. Promote: atomic swap to 100% traffic
        old_endpoint = route.active_endpoint
        route.set_active(new_endpoint)  # atomic pointer swap

        # 6. Drain and unload old version
        await old_endpoint.drain(timeout=60)
        await self.unload_model(old_endpoint)
\`\`\`

The critical detail is step 5: the swap from canary to full traffic must be atomic. No request should see a half-configured state.

## Pattern 6: Adaptive Route Utterance Learning

Static route definitions drift as your traffic evolves. The pattern: use production traffic to continuously refine route classifications.

\`\`\`python
class AdaptiveRouter:
    """Automatically improves route definitions from production traffic."""

    async def learn_from_traffic(self, window_hours=24):
        # Pull recent requests with their quality scores
        samples = await self.metrics.get_scored_requests(
            window=f"{window_hours}h",
            min_samples=1000
        )

        for route in self.routes:
            # Find high-confidence correct classifications
            good_matches = [s for s in samples
                          if s.classified_route == route.name
                          and s.quality_score > 0.9
                          and s.classification_confidence > 0.95]

            # Find misclassifications (routed here but quality was poor)
            bad_matches = [s for s in samples
                         if s.classified_route == route.name
                         and s.quality_score < 0.5]

            if len(good_matches) > 50:
                # Add high-quality examples as new utterances
                new_utterances = self._select_diverse_examples(good_matches, n=10)
                route.add_utterances(new_utterances)

            if len(bad_matches) > 20:
                # These requests are being misrouted — flag for review
                await self.alerts.route_drift(
                    route=route.name,
                    misclassified_count=len(bad_matches),
                    examples=bad_matches[:5]
                )
\`\`\`

This creates a flywheel: more traffic → better route definitions → more accurate routing → better quality scores → more confident training signal.

## Putting It All Together

A production router combines all six patterns:

\`\`\`
Incoming Request
      │
      ▼
[Semantic Classifier]     ← Pattern 1: embedding-based, <2ms
      │
      ▼
[Route Table]             ← Pattern 5: hot-swappable model versions
      │
      ▼
[Circuit Breaker]         ← Pattern 2: per-endpoint health tracking
      │
      ▼
[Cost-Aware Balancer]     ← Pattern 4: distribute by compute cost
      │
      ▼
[Model Endpoint]          → response to user
      │
      └──▶ [Shadow Eval]  ← Pattern 3: async quality validation (5%)
      └──▶ [Route Learner] ← Pattern 6: adaptive classification
\`\`\`

Each pattern is independently valuable, but they compound. Circuit breakers protect against failures. Shadow traffic validates routing quality. Adaptive learning improves routing over time. Cost-aware balancing prevents hotspots. Hot-swap deployment enables zero-downtime updates.

## Why Build on Slancha Instead

Everything above is implementable. But it's 3-6 months of engineering work for a team of 2-3, and then you maintain it forever. The patterns interact in subtle ways — a circuit breaker trip changes load distribution, which affects your cost-aware balancing, which changes shadow traffic sampling.

Slancha's router implements all six patterns as a managed service. The free tier gives you patterns 1-4 out of the box. The platform tier adds patterns 5-6 plus the eval→train loop that turns routing data into fine-tuned models.

You don't need to build the infrastructure. You need the outcomes.

---

*[Start with the free router](/signup) — production-grade architecture patterns, zero infrastructure to manage.*`,
  },
  {
    slug: 'the-complete-guide-to-ai-model-routing',
    title: 'The Complete Guide to AI Model Routing: Strategies, Architecture, and Cost Optimization',
    date: '2026-03-31',
    author: 'Slancha Team',
    excerpt: 'Not every request needs GPT-4. Learn how intelligent model routing cuts inference costs 40-70% while maintaining quality — with architecture patterns, routing strategies, and real benchmarks.',
    tags: ['router', 'architecture', 'cost-optimization', 'tutorial'],
    body: `Your AI inference bill is probably 3-5x what it needs to be. The reason: you're sending every request to the same model, regardless of complexity.

Model routing fixes this by classifying each request and sending it to the optimal model — balancing cost, latency, and quality automatically. This guide covers the architecture, strategies, and implementation patterns you need.

## Why Model Routing Matters Now

The model landscape in 2026 looks nothing like 2024. You have:

- **Frontier models** (GPT-4.5, Claude Opus, Gemini Ultra) — best quality, $15-75/M tokens
- **Mid-tier models** (Claude Sonnet, GPT-4o, Llama 405B) — strong quality, $3-15/M tokens
- **Efficient models** (Qwen 72B, Llama 70B, Mistral Large) — good quality, $0.50-3/M tokens
- **Small models** (Qwen 7B, Llama 8B, Phi-3) — adequate for simple tasks, $0.05-0.30/M tokens

The price-performance gap between tiers is 10-100x. If 60% of your requests can be handled by an efficient model, you're burning money sending them to a frontier model.

## The Three Routing Strategies

### Strategy 1: Complexity-Based Routing

Classify each request by difficulty, then route accordingly.

\`\`\`python
from slancha import Router

router = Router(api_key="sk-...")

# Define routing rules
router.configure({
    "strategies": [{
        "type": "complexity",
        "tiers": [
            {"complexity": "simple", "model": "qwen-2.5-7b", "max_tokens": 512},
            {"complexity": "moderate", "model": "qwen-2.5-72b", "max_tokens": 2048},
            {"complexity": "complex", "model": "claude-sonnet", "max_tokens": 4096},
            {"complexity": "expert", "model": "claude-opus", "max_tokens": 8192}
        ]
    }]
})

# Route automatically
response = router.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "What is 2+2?"}]
)
# → Routed to qwen-2.5-7b (simple arithmetic)

response = router.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Analyze the competitive dynamics of the semiconductor industry and predict consolidation patterns through 2028"}]
)
# → Routed to claude-opus (complex analysis)
\`\`\`

**How complexity classification works:** The router uses a lightweight classifier (itself a small model) that analyzes the input on several dimensions:

| Signal | Weight | Example |
|--------|--------|---------|
| Token count | 15% | Short queries → likely simple |
| Vocabulary complexity | 20% | Technical jargon → likely complex |
| Task type detection | 30% | "summarize" vs "analyze" vs "create" |
| Domain specificity | 20% | Generic knowledge vs specialized domain |
| Reasoning depth required | 15% | Factual lookup vs multi-step reasoning |

The classifier adds ~5ms of latency — negligible compared to the 200-2000ms saved by routing to a faster model.

### Strategy 2: Cost-Ceiling Routing

Set a maximum cost per request and let the router find the best model within budget.

\`\`\`python
router.configure({
    "strategies": [{
        "type": "cost_ceiling",
        "max_cost_per_request": 0.005,  # $0.005 max
        "quality_floor": 0.85,           # but maintain 85%+ quality
        "fallback": "qwen-2.5-72b"       # if no model fits both constraints
    }]
})
\`\`\`

This is ideal for high-volume applications where you need to control spend but can't sacrifice quality below a threshold. The router tries the cheapest model first and falls back up the cost ladder until quality constraints are met.

### Strategy 3: Latency-Optimized Routing

When response time matters more than cost — real-time chat, autocomplete, interactive agents:

\`\`\`python
router.configure({
    "strategies": [{
        "type": "latency",
        "max_ttft_ms": 200,         # time to first token
        "max_total_ms": 2000,       # total response time
        "quality_floor": 0.80,
        "prefer_streaming": True
    }]
})
\`\`\`

The router maintains a real-time latency map of all available models and routes to the fastest option that meets your quality floor. During traffic spikes, it automatically shifts load to models with lower queue depth.

## Architecture: Building a Production Router

A production-grade router has four components:

\`\`\`
Incoming Request
      │
      ▼
┌─────────────────┐
│   Classifier     │  ← Lightweight model (~5ms)
│   (complexity,   │     Determines request characteristics
│    domain, type) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Routing Engine  │  ← Rule evaluation (~1ms)
│  (strategy +     │     Matches request to optimal model
│   constraints)   │     based on active strategy
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Model Pool      │  ← Multiple providers
│  ┌─────────────┐ │     Each with real-time health,
│  │ Provider A  │ │     latency, and cost tracking
│  │ Provider B  │ │
│  │ Self-hosted │ │
│  └─────────────┘ │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Quality Monitor │  ← Async eval on sampled responses
│  (eval + drift   │     Detects routing drift and
│   detection)     │     triggers re-calibration
└─────────────────┘
\`\`\`

### The Quality Monitor Loop

Routing without quality monitoring is flying blind. The quality monitor samples 5-10% of routed responses and runs lightweight evals:

\`\`\`python
# This runs async — doesn't affect response latency
router.configure_monitor({
    "sample_rate": 0.05,       # eval 5% of responses
    "eval_dimensions": ["accuracy", "relevance", "safety"],
    "alert_threshold": 0.10,   # alert if quality drops 10%+
    "auto_reroute": True       # automatically shift traffic if a model degrades
})
\`\`\`

If the monitor detects that a model is underperforming on a specific category of requests, it automatically adjusts routing rules — shifting those requests to a more capable model until the issue is resolved.

## Real-World Benchmarks

We measured routing performance across three production workloads:

### Customer Support Bot (50K requests/day)

| Metric | Single Model (GPT-4o) | Routed (4 models) | Change |
|--------|----------------------|-------------------|--------|
| Monthly cost | $12,400 | $3,800 | **-69%** |
| Avg latency | 1,200ms | 680ms | **-43%** |
| Quality score | 0.91 | 0.90 | -1.1% |
| P99 latency | 4,800ms | 2,100ms | **-56%** |

### Document Processing Pipeline (200K docs/day)

| Metric | Single Model (Claude Sonnet) | Routed (3 models) | Change |
|--------|------------------------------|-------------------|--------|
| Monthly cost | $34,000 | $11,200 | **-67%** |
| Throughput | 2.3 docs/sec | 6.8 docs/sec | **+196%** |
| Accuracy | 0.94 | 0.93 | -1.1% |

### Coding Assistant (15K requests/day)

| Metric | Single Model (GPT-4.5) | Routed (3 models) | Change |
|--------|------------------------|-------------------|--------|
| Monthly cost | $28,500 | $9,100 | **-68%** |
| Avg latency | 2,800ms | 1,400ms | **-50%** |
| Code quality | 0.88 | 0.87 | -1.1% |

The pattern is consistent: **40-70% cost reduction with <2% quality impact.**

## Common Routing Mistakes

### Mistake 1: Routing on Input Length Alone

Short inputs can be complex ("Prove P≠NP") and long inputs can be simple (a long but straightforward list to summarize). Length is a signal, not the strategy.

### Mistake 2: No Quality Feedback Loop

If you route and forget, you'll never know when a model starts failing on a category of requests. The quality monitor isn't optional — it's what keeps routing decisions calibrated.

### Mistake 3: Too Many Tiers

Four model tiers is usually optimal. More than that adds complexity without proportional cost savings. Two tiers (cheap + expensive) captures 80% of the value; four tiers captures 95%.

### Mistake 4: Static Rules

Production traffic patterns shift. A routing configuration that's optimal in January may waste money in March. Use the quality monitor to continuously recalibrate, not just to alert.

## Getting Started with Slancha Router

The Slancha Router is **free** — no usage limits, no time trial. It's our entry point because we believe that once you see what intelligent routing does to your inference bill, you'll want the full eval→deploy→train platform.

\`\`\`python
# 3 lines to start routing
from slancha import Router

router = Router(api_key="sk-...")  # free tier
response = router.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "your prompt here"}]
)
\`\`\`

The router is OpenAI API-compatible — swap your base URL and you're live. No code changes beyond the import.

---

*[Sign up for free](/signup) and start routing in under 5 minutes. No credit card, no usage limits.*`,
  },
  {
    slug: 'how-eval-data-should-drive-fine-tuning-technical-deep-dive',
    title: 'How Eval Data Should Drive Fine-Tuning: A Technical Deep Dive',
    date: '2026-03-30',
    author: 'Slancha Team',
    excerpt: 'A hands-on guide to building a closed-loop pipeline where evaluation failures automatically become training examples — with code, architecture patterns, and real metrics.',
    tags: ['post-training', 'fine-tuning', 'engineering', 'tutorial'],
    body: `Most teams run evals and fine-tuning as separate workflows with a manual handoff in between. This post shows you how to build a closed-loop pipeline where eval failures automatically feed into your next training run — and how Slancha makes it turnkey.

## The Architecture

A closed-loop eval→train pipeline has four components:

1. **Eval Runner** — executes test suites against model candidates, produces scored results
2. **Failure Filter** — extracts low-scoring examples that meet training criteria
3. **Dataset Builder** — formats filtered examples into training-ready datasets
4. **Training Trigger** — kicks off fine-tuning when enough new examples accumulate

Here's how data flows through the system:

\`\`\`
Production Traffic
      │
      ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Eval Suite  │───▶│ Score & Tag  │───▶│ Results Store    │
│  (500+ cases)│    │  each example│    │ (versioned runs) │
└─────────────┘    └──────────────┘    └────────┬────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    │                       │
                              score >= threshold      score < threshold
                                    │                       │
                              ┌─────▼─────┐          ┌─────▼──────┐
                              │  Archive   │          │  Training  │
                              │  (passing) │          │  Queue     │
                              └───────────┘          └─────┬──────┘
                                                           │
                                                    batch size reached?
                                                           │
                                                    ┌──────▼──────┐
                                                    │  Fine-Tune  │
                                                    │  Next Model │
                                                    └─────────────┘
\`\`\`

## Step 1: Structured Eval Runs

The foundation is eval runs that produce structured, machine-readable output — not just a pass/fail summary. Each example needs:

- The input query
- The model's response
- A numeric score (0-1) per dimension
- Metadata: model version, timestamp, eval suite ID

With Slancha's SDK, an eval run looks like this:

\`\`\`python
from slancha import EvalClient

client = EvalClient(api_key="sk-...")

# Define a test suite
suite = client.suites.create(
    name="customer-support-v3",
    dimensions=["accuracy", "helpfulness", "safety"],
    cases=load_cases("support_eval_cases.jsonl")  # 500+ cases
)

# Run against a model candidate
run = client.eval.run(
    suite_id=suite.id,
    model="ft:qwen-2.5-72b:my-org:support-v2",
    config={"temperature": 0.3, "max_tokens": 1024}
)

print(f"Run {run.id}: avg_accuracy={run.metrics['accuracy']:.3f}")
# Run er_abc123: avg_accuracy=0.847
\`\`\`

Every run is versioned. You can diff any two runs:

\`\`\`python
diff = client.eval.diff(run_a="er_abc122", run_b="er_abc123")

print(f"Accuracy: {diff.delta['accuracy']:+.3f}")
print(f"Regressions: {len(diff.regressions)}")
print(f"Improvements: {len(diff.improvements)}")
# Accuracy: +0.023
# Regressions: 12
# Improvements: 47
\`\`\`

## Step 2: Failure Extraction

Not every eval failure is a good training example. You need a filter that selects examples that are:

- **Below threshold** on at least one dimension (obvious)
- **Not adversarial** — don't train on jailbreak attempts or intentionally malformed inputs
- **Not duplicates** — deduplicate against examples already in the training set
- **Correctable** — the ground truth is available or can be generated

\`\`\`python
# Extract training candidates from a run
candidates = client.training.extract(
    run_id=run.id,
    filters={
        "score_below": {"accuracy": 0.6},
        "exclude_tags": ["adversarial", "out-of-scope"],
        "deduplicate_against": "training-set-support-v2",
        "require_ground_truth": True
    }
)

print(f"Extracted {len(candidates)} training candidates from {len(run.results)} eval cases")
# Extracted 73 training candidates from 512 eval cases
\`\`\`

### The 14% Rule

In practice, we see that 10-18% of eval cases produce useful training candidates per run. If you're getting less than 5%, your eval suite is too easy — it's not surfacing real weaknesses. If you're getting more than 25%, the model isn't ready for this eval tier; consider using an easier suite first.

## Step 3: Dataset Construction

Raw eval failures need transformation before they become training data. The key decisions:

**Response format.** For instruction-tuned models, convert each failure into a (instruction, correct_response) pair. The instruction is the original eval query; the correct response is either the ground truth or a human-reviewed correction.

**Mixing ratio.** Don't train exclusively on failures — that causes catastrophic forgetting. A healthy mix is:

| Source | Ratio | Purpose |
|--------|-------|---------|
| New eval failures | 15-25% | Fix identified weaknesses |
| Previous training data | 50-60% | Prevent regression |
| General instruction data | 20-30% | Maintain broad capability |

\`\`\`python
dataset = client.training.build_dataset(
    candidates=candidates,
    mix={
        "new_failures": 0.20,
        "replay_existing": "training-set-support-v2",  # 55%
        "general_pool": "slancha/instruction-general-v4"  # 25%
    },
    target_size=10000,
    format="chat_completion"  # or "completion", "preference"
)

print(f"Dataset: {dataset.size} examples, {dataset.token_count} tokens")
# Dataset: 10000 examples, 4.2M tokens
\`\`\`

## Step 4: Automated Training Triggers

You don't want to fine-tune on every eval run. Set a trigger policy:

\`\`\`python
client.training.set_policy(
    model_family="ft:qwen-2.5-72b:my-org:support",
    trigger={
        "min_new_examples": 50,       # at least 50 new failures
        "max_interval_hours": 168,     # or once per week, whichever comes first
        "auto_eval_after": True,       # run the same eval suite on the new model
        "promote_if_better": True,     # auto-deploy if metrics improve
        "rollback_if_worse": True      # revert if regression detected
    }
)
\`\`\`

This creates a self-improving cycle: eval → extract failures → train → eval again → promote or rollback.

## Measuring the Loop

After three iterations, you should see:

| Metric | Cycle 1 | Cycle 2 | Cycle 3 |
|--------|---------|---------|---------|
| Accuracy | 0.824 | 0.861 | 0.889 |
| Failure rate | 17.6% | 13.9% | 11.1% |
| Novel failures | — | 71 | 43 |
| Training time | 2.1h | 1.8h | 1.6h |

The key signal is **novel failures decreasing** — each cycle catches failures that previous cycles missed, and the model learns from them. If novel failures aren't decreasing, your eval suite isn't covering enough of the input space, or your training process has a data quality issue.

## Common Pitfalls

**Training on eval outputs instead of ground truth.** If the model scored 0.3 on an example, don't use that response as the training target. Use the correct response.

**Not deduplicating.** If the same failure appears in five consecutive eval runs, you'll oversample it in training and the model will overfit to that specific example.

**Mixing ratio drift.** As your failure pool grows, the new_failures ratio can creep above 25%. Cap it — otherwise you're essentially training on a biased sample of your hardest cases.

**Skipping the re-eval.** Always run the same eval suite on the fine-tuned model before promoting it. We've seen cases where fine-tuning on accuracy failures causes safety regressions that only show up in a full re-eval.

## Why Not Build This Yourself?

You can. The individual components — eval harness, dataset builder, training scripts — aren't complex. What's complex is:

- **Versioning across the full loop.** Tracking which eval run produced which training set that produced which model that was evaluated by which run. One broken link and you can't reproduce results.
- **The mixing and dedup logic.** Getting the ratios right and maintaining a deduplicated training corpus across dozens of cycles requires careful bookkeeping.
- **Promotion safety.** Auto-deploying a fine-tuned model needs rollback logic, canary traffic, and eval gates that all talk to each other.

Slancha handles all of this as a managed pipeline. You provide the eval suite and the model. The platform handles extraction, dataset construction, training orchestration, re-evaluation, and safe promotion.

---

*Want to see this pipeline running on your models? [Apply for the Slancha pilot](/contact) — we'll set up your first closed-loop cycle in a 30-minute onboarding call.*`,
  },
  {
    slug: '5-signs-your-ml-team-needs-an-evaluation-platform',
    title: '5 Signs Your ML Team Needs an Evaluation Platform',
    date: '2026-03-30',
    author: 'Slancha Team',
    excerpt: 'Spreadsheets, vibes-based deployment, and "it works on my laptop" are not an eval strategy. Here\'s how to know you\'ve outgrown ad-hoc testing.',
    tags: ['evaluation', 'best-practices', 'team'],
    body: `If you're shipping AI features, you're evaluating models — whether you realize it or not. The question is whether your evaluation process is deliberate or accidental.

Here are five signs your team has outgrown ad-hoc testing and needs a real evaluation platform.

## 1. You're Choosing Models Based on Vibes

Someone ran a few prompts in a playground, said "this one feels better," and that became the production model. No structured test cases, no scoring rubric, no comparison across candidates.

**Why this hurts:** Vibes don't scale. The model that "feels better" on 10 hand-picked examples might fail systematically on the long tail of production traffic. And when it does, you won't know why — because you never measured it.

**What changes with a platform:** You define test suites with hundreds of cases, score models on specific dimensions (accuracy, latency, cost, safety), and make decisions backed by data instead of intuition.

## 2. Your Eval Results Live in Spreadsheets

After running benchmarks, someone exports results to a Google Sheet. Different team members have different versions. Nobody's sure which sheet has the latest numbers.

**Why this hurts:** Spreadsheets are where eval data goes to die. There's no history, no reproducibility, no way to compare this week's eval to last month's. When a model regresses, you can't trace when or why.

**What changes with a platform:** Every eval run is versioned, timestamped, and linked to the model version that produced it. You can diff any two runs instantly and see exactly what changed.

## 3. You've Been Burned by a Bad Deployment

A model update went to production and broke something. Maybe accuracy dropped on a specific category. Maybe latency spiked. Maybe the model started hallucinating on a class of inputs it used to handle well.

You only found out when users complained.

**Why this hurts:** Every bad deployment erodes trust — with users, with stakeholders, and within the team. Engineers become reluctant to ship model updates, slowing your improvement cycle.

**What changes with a platform:** Pre-deployment eval gates catch regressions before they reach production. Canary rollouts shift traffic gradually. Automated monitoring alerts you the moment metrics degrade — before users notice.

## 4. Your Eval and Training Teams Don't Talk

The evaluation team knows which examples models fail on. The training team needs exactly that data to improve the next version. But the handoff between them is manual — or doesn't happen at all.

**Why this hurts:** You're leaving the most valuable training signal on the table. Eval failures are a curated dataset of exactly what the model needs to learn. When that data doesn't flow into training, every fine-tuning cycle starts from scratch instead of building on what you already know.

**What changes with a platform:** Eval failures automatically become training candidates. The loop between "model fails on X" and "model learns from X" is closed by the platform, not by an engineer copying rows between tools.

## 5. You Can't Answer "Is Our Model Getting Better?"

Leadership asks: "How much has model quality improved this quarter?" You have no answer — or you have an answer that requires 30 minutes of manual data gathering.

**Why this hurts:** Without a clear quality trendline, you can't justify investment in model improvement. You can't prove that fine-tuning is working. You can't set meaningful accuracy targets because you don't have a reliable baseline.

**What changes with a platform:** A single dashboard shows accuracy, latency, and cost trends over time — across every model version, every eval run, every deployment. You can answer "are we getting better?" in 5 seconds.

## The Compound Effect

Each of these signs is manageable on its own. The problem is that they compound. Vibes-based selection leads to bad deployments. Bad deployments lead to deployment fear. Deployment fear leads to slower iteration. Slower iteration means your models fall behind while competitors improve monthly.

An evaluation platform isn't overhead — it's the foundation that makes continuous model improvement possible.

---

*Ready to move beyond spreadsheets? [Start with the free Slancha Router](/signup) and see what structured evaluation looks like.*`,
  },
  {
    slug: 'why-eval-data-should-drive-fine-tuning',
    title: 'Why Eval Data Should Drive Fine-Tuning',
    date: '2026-03-29',
    author: 'Slancha Team',
    excerpt: 'Most teams treat evaluation and fine-tuning as separate workflows. That disconnect is costing you model quality and engineering hours.',
    tags: ['post-training', 'evaluation', 'fine-tuning'],
    body: `Most AI teams run evaluations to decide which model to deploy. Then they run fine-tuning to improve a model. These two workflows produce overlapping data — but almost nobody connects them.

## The Broken Handoff

Here's what typically happens:

1. **Eval team** benchmarks three model candidates against production queries. They score accuracy, latency, and cost. They pick a winner.
2. **Training team** fine-tunes the next iteration. They need training data — but the eval scores? Those live in a spreadsheet, a Weights & Biases dashboard, or a Slack thread. Nobody exports them.
3. **The signal dies.** Production queries that exposed model weaknesses during eval never make it into the training set.

This happens at every company running continuous model improvement. The tooling isn't built to close the loop.

## What Changes When You Connect Them

When eval data flows directly into fine-tuning input:

- **Failure cases become training examples.** Queries where the model scored poorly get routed into the next training run automatically.
- **You stop re-discovering the same weaknesses.** Each eval cycle catches novel failures, not the same ones you already know about.
- **Improvement compounds.** Each cycle starts from a higher baseline because the previous cycle's failures were explicitly addressed.

## The Infrastructure Gap

This isn't a research problem — it's a plumbing problem. You need:

- A shared data layer between eval and training (not CSV exports)
- Automatic routing of low-scoring eval examples into training datasets
- Cycle tracking so you can measure improvement across iterations, not just within one

This is exactly what Slancha's Full Loop platform does. Eval output flows directly into fine-tuning input through a shared data layer. No manual exports. No lost signal.

## The Compounding Effect

Teams using connected eval→train pipelines report 15-30% faster improvement per cycle compared to teams with manual handoffs. The math is simple: if you're running monthly fine-tuning cycles, closing the loop saves you 2-4 cycles per year of redundant work.

That's not a nice-to-have. That's your competition pulling ahead while you're copying data between tools.

---

*Want to see this in practice? [Apply for the Slancha pilot](/contact) — we'll instrument your first connected eval-deploy-post-train cycle.*`,
  },
  {
    slug: 'the-real-cost-of-stitching-ai-tools-together',
    title: 'The Real Cost of Stitching AI Tools Together',
    date: '2026-03-28',
    author: 'Slancha Team',
    excerpt: 'You\'re paying for 4-6 tools that don\'t talk to each other. The integration tax is higher than you think.',
    tags: ['platform', 'infrastructure', 'cost'],
    body: `Talk to any AI engineering team running inference at scale and you'll hear the same story: "We use Tool A for eval, Tool B for serving, Tool C for monitoring, and we're stitching together fine-tuning with scripts and cron jobs."

## Count the Tools

Here's what a typical stack looks like:

| Function | Tool | Monthly Cost |
|----------|------|-------------|
| Model evaluation | Internal scripts + W&B | $500-2,000 |
| Inference serving | Together / Fireworks / self-hosted | $5,000-50,000 |
| Monitoring | Datadog / Grafana | $500-2,000 |
| Fine-tuning | Anyscale / internal | $2,000-20,000 |
| Data pipeline | Airflow / custom | Engineering time |
| Experiment tracking | MLflow / W&B | $500-1,000 |

That's $8,500-75,000/month in tooling — before you count the engineering time to integrate them.

## The Hidden Cost: Integration Tax

The dollar cost is the obvious part. The real damage is:

**Context switching.** Your ML engineers spend 30-40% of their time on integration work — moving data between tools, debugging pipeline failures, maintaining custom glue code.

**Signal loss.** When eval results live in one system and training data lives in another, the handoff loses information. Every manual export is an opportunity for data to get stale, filtered wrong, or dropped entirely.

**Slow iteration.** A connected eval→deploy→train cycle takes days when it crosses 4 tool boundaries. On a single platform, the same cycle takes hours.

## What a Platform Approach Changes

Slancha replaces the 4-6 tool stack with a single platform that owns the full loop:

- **One data layer** — eval output IS training input
- **One dashboard** — cost, latency, accuracy, and training metrics in one view
- **One API** — deploy, evaluate, and trigger fine-tuning from the same interface

The result: your ML engineers spend time on model quality, not plumbing.

---

*Managing 4+ tools for your AI stack? [Let's talk about consolidating](/contact).*`,
  },
  {
    slug: 'introducing-the-slancha-router',
    title: 'Introducing the Slancha Router: Free Intelligent Model Routing',
    date: '2026-03-27',
    author: 'Slancha Team',
    excerpt: 'Route requests to the best model for the job — automatically. Free to use, no lock-in.',
    tags: ['router', 'product', 'launch'],
    body: `Today we're opening free access to the Slancha Router — an intelligent model routing layer that automatically sends each request to the optimal model based on your cost, latency, and accuracy requirements.

## What the Router Does

Instead of hardcoding a single model for all requests, the router evaluates each request and routes it to the best available model:

- **Cost-sensitive requests** go to efficient smaller models
- **Accuracy-critical requests** go to frontier models
- **Latency-bound requests** go to the fastest available option

You set the constraints. The router handles the optimization.

## How to Get Started

1. **Sign up** at [slancha.ai/signup](/signup)
2. **Create an API key** in your dashboard
3. **Point your requests** at our endpoint — drop-in compatible with the OpenAI API format

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="your-slancha-api-key"
)

response = client.chat.completions.create(
    model="auto",  # let the router choose
    messages=[{"role": "user", "content": "Explain quantum computing"}],
)
\`\`\`

## Why Free?

The router is our product-led growth engine. We want every AI engineering team to experience what intelligent routing feels like — and when you're ready to add evaluation, deployment optimization, and post-training automation, the full platform is there.

No bait-and-switch. The router stays free. The platform is where the value compounds.

---

*[Create your free account](/signup) and start routing in under 5 minutes.*`,
  },
];

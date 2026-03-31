export const posts = [
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

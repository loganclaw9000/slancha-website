import{f as l,u,j as e,g as d,N as m,R as h,L as s,F as p}from"./index-vpsT3n-B.js";const i={portkey:{name:"Portkey",tagline:"AI Gateway & Governance",funding:"$15M Series A (Feb 2026)",heroTitle:"Slancha vs Portkey",heroSubtitle:"Portkey governs your AI. Slancha optimizes it.",metaDescription:"Compare Slancha vs Portkey. See how an AI optimization engine differs from an AI gateway — automated fine-tuning, continuous learning, and zero model selection vs governance and routing controls.",overview:"Portkey is an AI gateway and production control plane. It routes across 1,600+ LLMs with sub-millisecond latency, provides observability, guardrails, governance, prompt management, and cost controls. It processes 1T+ tokens daily across 24,000+ organizations.",philosophy:{theirs:"Make multi-model management reliable through governance, guardrails, and observability. Customers configure routing rules and choose models.",ours:"Make multi-model management invisible. No model selection, no governance configuration. The platform learns, optimizes, and redeploys automatically."},comparison:[{feature:"Model routing",theirs:"Config-based rules across 1,600+ LLMs",ours:"Automatic, continuous — learns from your traffic"},{feature:"Task analysis",theirs:"Not included",ours:"Automatic task classification and data curation"},{feature:"Fine-tuning",theirs:"Not included",ours:"Automated, behind the scenes"},{feature:"Inference optimization",theirs:"Not included",ours:"QAT, MIG, multi-token prediction"},{feature:"Governance",theirs:"Policy-as-code, audit trails, guardrails",ours:"Compliance-ready (SOC 2, HIPAA, GDPR)"},{feature:"Observability",theirs:"Full request/response logging, traces",ours:"Usage analytics and performance metrics"},{feature:"ML expertise required",theirs:"Low — but you still choose models",ours:"None — fully autonomous"}],strengths:["Routing across 1,600+ LLMs","Enterprise governance (policy-as-code)","Open-sourced gateway","MCP Gateway for agentic AI","Sub-millisecond routing latency"],whenToChooseThem:"Choose Portkey when you need fine-grained governance controls, policy-as-code enforcement, or want to keep full model selection control with observability into every request.",whenToChooseUs:"Choose Slancha when you want to stop managing models entirely. Slancha learns from your traffic, fine-tunes task-specific models, and continuously improves — no configuration or model expertise required.",migrationCode:{before:`# Portkey — configure routing rules manually
from portkey_ai import Portkey

client = Portkey(api_key="pk-...")
client.config = {
    "strategy": {"mode": "loadbalance"},
    "targets": [
        {"provider": "openai", "model": "gpt-4o"},
        {"provider": "anthropic", "model": "claude-3.5"},
    ]
}

response = client.chat.completions.create(
    messages=[{"role": "user", "content": prompt}]
)`,after:`# Slancha — one endpoint, zero configuration
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-slancha-..."
)

response = client.chat.completions.create(
    model="auto",  # Slancha routes automatically
    messages=[{"role": "user", "content": prompt}]
)
# No model selection. No routing rules. It just works.`},bottomLine:"Portkey manages complexity. Slancha eliminates it."},openrouter:{name:"OpenRouter",tagline:"Unified LLM API Marketplace",funding:"Private",heroTitle:"Slancha vs OpenRouter",heroSubtitle:"OpenRouter is a marketplace. Slancha is an optimization engine.",metaDescription:"Compare Slancha vs OpenRouter. See why an AI optimization engine that learns and fine-tunes beats a model marketplace that just routes to the cheapest provider.",overview:"OpenRouter is a unified API for accessing and routing requests across multiple LLM providers. It aggregates providers behind a single endpoint and scouts for lowest prices and best latencies. Users can let the router auto-select or pick models manually.",philosophy:{theirs:"Aggregate model access and optimize for price and latency. Expose choice so developers can pick the right model for each use case.",ours:"Remove choice entirely. Learn from your traffic patterns, build task-specific models, and deliver better results at lower cost — automatically."},comparison:[{feature:"Model routing",theirs:"Price/latency optimization across providers",ours:"Automatic, learns task patterns over time"},{feature:"Model selection",theirs:"Manual or auto (price/latency-based)",ours:"Fully automatic — you never pick a model"},{feature:"Fine-tuning",theirs:"Not included",ours:"Automated, uses your actual traffic data"},{feature:"Cost optimization",theirs:"Finds cheapest provider for a given model",ours:"Builds cheaper task-specific models for you"},{feature:"Inference optimization",theirs:"Not included",ours:"QAT, MIG, multi-token prediction"},{feature:"Improves over time",theirs:"No — same routing logic regardless of usage",ours:"Yes — continuously learns and redeploys"},{feature:"ML expertise required",theirs:"Low",ours:"None"}],strengths:["Wide model selection across providers","Price/latency optimization","Simple unified API","Community-driven model rankings","Transparent pricing"],whenToChooseThem:"Choose OpenRouter when you want manual control over model selection, need access to specific niche models, or prefer to shop for the cheapest provider for a known model.",whenToChooseUs:"Choose Slancha when you want costs to go down automatically over time. OpenRouter finds you the best price today. Slancha builds you the best model over time — fine-tuned on your actual workloads.",migrationCode:{before:`# OpenRouter — select model and route by price
import openai

client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="or-..."
)

response = client.chat.completions.create(
    model="openai/gpt-4o",  # You pick the model
    messages=[{"role": "user", "content": prompt}],
    extra_body={"transforms": ["middle-out"]}
)`,after:`# Slancha — drop-in replacement, automatic optimization
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-slancha-..."
)

response = client.chat.completions.create(
    model="auto",  # Slancha handles everything
    messages=[{"role": "user", "content": prompt}]
)
# Same API format. Better results over time.`},bottomLine:"OpenRouter finds you the best price today. Slancha builds you the best model over time."},"not-diamond":{name:"Not Diamond",tagline:"ML-Based Model Router",funding:"Private",heroTitle:"Slancha vs Not Diamond",heroSubtitle:"Not Diamond recommends. Slancha builds.",metaDescription:"Compare Slancha vs Not Diamond. Both believe in multi-model AI — but Slancha goes further with automated fine-tuning, inference optimization, and continuous redeployment.",overview:'Not Diamond is an AI model router that acts as a "meta-model," recommending the best LLM for each query in under 50ms. It supports custom router training with customer evaluation data and uses client-side execution so data stays local.',philosophy:{theirs:"Route each query to the best existing model using ML-based recommendations. Customers provide evaluation data to train custom routers.",ours:"Go beyond routing — learn from live traffic, fine-tune new task-specific models, optimize inference, and continuously redeploy. No explicit data upload required."},comparison:[{feature:"Routing approach",theirs:"ML meta-model, per-query recommendation",ours:"Semantic routing + continuous learning"},{feature:"Data requirements",theirs:"Explicit eval data upload required",ours:"Learns from live traffic — no action needed"},{feature:"Fine-tuning",theirs:"Not included — routes to existing models",ours:"Creates new task-specific models automatically"},{feature:"Inference optimization",theirs:"Not included",ours:"QAT, MIG, multi-token prediction"},{feature:"Execution model",theirs:"Offline — batch optimization jobs",ours:"Continuous — always learning and improving"},{feature:"Data privacy",theirs:"Client-side execution (data stays local)",ours:"Server-side with SOC 2, HIPAA, GDPR compliance"},{feature:"ML expertise required",theirs:"Medium — eval data curation needed",ours:"None — fully autonomous"}],strengths:["Per-query model recommendation","Client-side execution (data stays local)","Custom router training","Up to 25% accuracy improvement claims","Prompt optimization features"],whenToChooseThem:"Choose Not Diamond when you need client-side execution where data never leaves your infrastructure, or when you have curated evaluation datasets and want explicit control over router training.",whenToChooseUs:"Choose Slancha when you want the optimization to happen automatically. Not Diamond requires you to provide eval data and trigger optimization jobs. Slancha learns from live traffic and creates entirely new fine-tuned models — not just routes to existing ones.",migrationCode:{before:`# Not Diamond — provide eval data, train router
from notdiamond import NotDiamond

client = NotDiamond(api_key="nd-...")

# Must upload evaluation data first
client.train_router(
    eval_data="path/to/evals.jsonl",
    models=["gpt-4o", "claude-3.5", "llama-3.1"]
)

response = client.chat.completions.create(
    messages=[{"role": "user", "content": prompt}],
    model=["gpt-4o", "claude-3.5", "llama-3.1"]
)`,after:`# Slancha — no eval data needed, learns automatically
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-slancha-..."
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": prompt}]
)
# No eval data upload. No router training.
# Slancha learns from your actual usage and fine-tunes
# new models — not just routes to existing ones.`},bottomLine:"Not Diamond optimizes which existing model to call. Slancha builds you a better one."},fireworks:{name:"Fireworks AI",tagline:"High-Performance Inference Platform",funding:"$254M raised, $4B valuation",heroTitle:"Slancha vs Fireworks AI",heroSubtitle:"Fireworks is for AI engineers. Slancha is for everyone else.",metaDescription:"Compare Slancha vs Fireworks AI. See why teams that want results without ML complexity choose Slancha over a platform built for sophisticated AI engineers.",overview:"Fireworks AI is a high-performance inference platform founded by the team that built PyTorch at Meta. They process 13T+ tokens daily with their proprietary FireAttention engine, achieving 4x higher throughput and 50% lower latency vs. open-source baselines.",philosophy:{theirs:"Give sophisticated AI teams powerful tools — fast inference, fine-tuning, quantization, BYOW. Engineers configure and optimize their stack.",ours:"Deliver comparable outcomes without requiring sophistication. One API endpoint, automatic optimization, zero configuration."},comparison:[{feature:"Target user",theirs:"AI/ML engineers with deep expertise",ours:"Any team using LLM APIs"},{feature:"Model selection",theirs:"Manual — customers choose and deploy",ours:"Automatic — Slancha handles everything"},{feature:"Fine-tuning",theirs:"Customer-driven (RLHF, SFT, DPO)",ours:"Automatic, behind the scenes"},{feature:"Inference engine",theirs:"Proprietary FireAttention (4x throughput)",ours:"vLLM + QAT + MIG + multi-token prediction"},{feature:"Deployment",theirs:"Customer manages model deployment",ours:"Continuous automatic redeployment"},{feature:"Custom weights",theirs:"BYOW (bring your own weights)",ours:"Models built and managed for you"},{feature:"ML expertise required",theirs:"High",ours:"None"}],strengths:["FireAttention engine (4x throughput)","Fine-tuning + RLHF support","SOC 2 Type II / HIPAA / GDPR","BYOW (bring your own weights)","13T+ tokens processed daily"],whenToChooseThem:"Choose Fireworks when your team has dedicated ML engineers who want full control over model selection, fine-tuning configuration, and deployment. Fireworks gives experts powerful levers.",whenToChooseUs:"Choose Slancha when you want the same results — lower costs, better performance — without needing ML expertise. Slancha automates the entire optimization pipeline that Fireworks customers do manually.",migrationCode:{before:`# Fireworks — deploy, configure, and manage manually
from fireworks.client import Fireworks

client = Fireworks(api_key="fw-...")

# Fine-tune a model (manual)
job = client.fine_tuning.create(
    model="llama-v3p1-70b",
    dataset="my-dataset-id",
    hyperparameters={"epochs": 3, "lr": 2e-5}
)

# Deploy and serve (manual)
response = client.chat.completions.create(
    model="accounts/my-org/models/my-fine-tuned",
    messages=[{"role": "user", "content": prompt}]
)`,after:`# Slancha — same results, zero configuration
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-slancha-..."
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": prompt}]
)
# Fine-tuning happens automatically behind the scenes.
# No dataset curation. No hyperparameter tuning.
# No model deployment. Just use the API.`},bottomLine:"Fireworks gives engineers powerful tools. Slancha gives teams powerful results."},baseten:{name:"BaseTen",tagline:"AI Inference Infrastructure",funding:"$300M Series C, $5B valuation (NVIDIA invested $150M)",heroTitle:"Slancha vs BaseTen",heroSubtitle:"BaseTen builds infrastructure. Slancha builds the product on top.",metaDescription:'Compare Slancha vs BaseTen. See why teams that want outcomes — not GPU infrastructure — choose an AI optimization platform over "the AWS of inference."',overview:'BaseTen calls itself "the AWS of inference." They provide optimized inference infrastructure with custom kernel optimizations, multi-cloud deployment, 99.99% uptime, and sub-10-second cold starts. NVIDIA invested $150M in their January 2026 round.',philosophy:{theirs:`"We don't believe in black boxes." Give infrastructure teams full control over GPU compute, runtime selection, and deployment architecture.`,ours:"The black box IS the product. Customers get outcomes (lower cost, better performance) without touching infrastructure."},comparison:[{feature:"Abstraction level",theirs:"Infrastructure (GPU compute, runtimes)",ours:"Product (single API endpoint)"},{feature:"Model selection",theirs:"Customer chooses and deploys",ours:"Automatic"},{feature:"Fine-tuning",theirs:"Not included — customer's responsibility",ours:"Automated, behind the scenes"},{feature:"Infrastructure management",theirs:"Multi-cloud, auto-scaling, cold starts",ours:"Fully managed — no infrastructure decisions"},{feature:"Runtime support",theirs:"vLLM, TensorRT-LLM, SGLang",ours:"vLLM + QAT + MIG (abstracted away)"},{feature:"GPU optimization",theirs:"225% better cost-perf on Blackwell",ours:"Automatic via QAT + MIG partitioning"},{feature:"ML expertise required",theirs:"High",ours:"None"}],strengths:["225% better cost-performance on Blackwell","Sub-10-second cold starts","Multi-cloud with no model lock-in","vLLM + TensorRT-LLM + SGLang support","NVIDIA strategic investment ($150M)"],whenToChooseThem:"Choose BaseTen when your team wants to own the infrastructure stack — select runtimes, manage GPU resources, deploy custom models across clouds with fine-grained control.",whenToChooseUs:"Choose Slancha when you want the benefits of optimized inference (cost savings, performance) without managing infrastructure. BaseTen is a potential layer underneath Slancha, not a replacement for it.",migrationCode:{before:`# BaseTen — deploy and manage infrastructure
import baseten

# Deploy a model (manual)
model = baseten.deploy(
    model_id="llama-3.1-70b",
    config={
        "runtime": "vllm",
        "gpu": "a100",
        "min_replicas": 2,
        "max_replicas": 10
    }
)

# Call your deployed model
response = model.predict({
    "messages": [{"role": "user", "content": prompt}],
    "max_tokens": 1024
})`,after:`# Slancha — no infrastructure to manage
import openai

client = openai.OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-slancha-..."
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": prompt}]
)
# No GPU selection. No runtime configuration.
# No replica management. No cold starts to worry about.
# Slancha handles the infrastructure for you.`},bottomLine:"BaseTen gives you infrastructure. Slancha gives you outcomes."}},r=["Route","Analyze","Fine-tune","Optimize","Redeploy"];function f(){const{competitor:n}=l(),t=i[n];if(u({title:t?t.heroTitle:"Compare",description:t?t.metaDescription:"See how Slancha compares."}),!t)return e.jsx(d,{to:"/vs-competitors",replace:!0});const c=Object.entries(i).filter(([o])=>o!==n).map(([o,a])=>({slug:o,name:a.name,tagline:a.tagline}));return e.jsxs("div",{className:"page",children:[e.jsx(m,{}),e.jsxs("main",{className:"cc-page",children:[e.jsxs("section",{className:"cc-hero",children:[e.jsx("span",{className:"cc-badge",children:"Comparison"}),e.jsx("h1",{className:"cc-title",children:t.heroTitle}),e.jsx("p",{className:"cc-subtitle",children:t.heroSubtitle}),e.jsxs("div",{className:"cc-hero-meta",children:[e.jsx("span",{className:"cc-meta-item",children:t.name}),e.jsx("span",{className:"cc-meta-sep",children:"vs"}),e.jsx("span",{className:"cc-meta-item cc-meta-slancha",children:"Slancha"})]})]}),e.jsxs("section",{className:"cc-section",children:[e.jsxs("h2",{className:"cc-section-title",children:["What is ",t.name,"?"]}),e.jsx("p",{className:"cc-overview",children:t.overview}),t.funding&&e.jsxs("p",{className:"cc-funding",children:["Funding: ",t.funding]})]}),e.jsxs("section",{className:"cc-section",children:[e.jsx("h2",{className:"cc-section-title",children:"Different philosophies"}),e.jsxs("div",{className:"cc-philosophy-grid",children:[e.jsxs("div",{className:"cc-philosophy-card",children:[e.jsx("h3",{children:t.name}),e.jsx("p",{children:t.philosophy.theirs})]}),e.jsxs("div",{className:"cc-philosophy-card cc-philosophy-slancha",children:[e.jsx("h3",{children:"Slancha"}),e.jsx("p",{children:t.philosophy.ours})]})]})]}),e.jsxs("section",{className:"cc-section",children:[e.jsx("h2",{className:"cc-section-title",children:"Feature-by-feature comparison"}),e.jsx("div",{className:"cc-table-wrap",children:e.jsxs("table",{className:"cc-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Capability"}),e.jsx("th",{children:t.name}),e.jsx("th",{className:"cc-slancha-col",children:"Slancha"})]})}),e.jsx("tbody",{children:t.comparison.map((o,a)=>e.jsxs("tr",{children:[e.jsx("td",{className:"cc-feature-name",children:o.feature}),e.jsx("td",{children:o.theirs}),e.jsx("td",{className:"cc-slancha-cell",children:o.ours})]},a))})]})})]}),e.jsxs("section",{className:"cc-section cc-loop-section",children:[e.jsxs("h2",{className:"cc-section-title",children:["The closed loop ",t.name," doesn't have"]}),e.jsx("p",{className:"cc-loop-desc",children:"Slancha is the only platform that closes the full optimization loop — continuously and automatically."}),e.jsxs("div",{className:"cc-loop",children:[r.map((o,a)=>e.jsxs(h.Fragment,{children:[e.jsx("span",{className:"cc-loop-step",children:o}),a<r.length-1&&e.jsx("span",{className:"cc-loop-arrow",children:"→"})]},o)),e.jsx("span",{className:"cc-loop-arrow cc-loop-return",children:"&hookleftarrow;"})]})]}),e.jsx("section",{className:"cc-section",children:e.jsxs("div",{className:"cc-choose-grid",children:[e.jsxs("div",{className:"cc-choose-card",children:[e.jsxs("h3",{children:["When to choose ",t.name]}),e.jsx("p",{children:t.whenToChooseThem}),e.jsxs("h4",{children:[t.name,"'s strengths"]}),e.jsx("ul",{children:t.strengths.map((o,a)=>e.jsx("li",{children:o},a))})]}),e.jsxs("div",{className:"cc-choose-card cc-choose-slancha",children:[e.jsx("h3",{children:"When to choose Slancha"}),e.jsx("p",{children:t.whenToChooseUs}),e.jsx("h4",{children:"Slancha's advantage"}),e.jsx("p",{className:"cc-bottom-line",children:t.bottomLine})]})]})}),e.jsxs("section",{className:"cc-section",children:[e.jsx("h2",{className:"cc-section-title",children:"Migration is simple"}),e.jsx("p",{className:"cc-migration-desc",children:"Slancha uses the OpenAI-compatible API format. Switching takes minutes, not weeks."}),e.jsxs("div",{className:"cc-code-grid",children:[e.jsxs("div",{className:"cc-code-block",children:[e.jsx("div",{className:"cc-code-header",children:e.jsxs("span",{className:"cc-code-label",children:["Before: ",t.name]})}),e.jsx("pre",{children:e.jsx("code",{children:t.migrationCode.before})})]}),e.jsxs("div",{className:"cc-code-block cc-code-slancha",children:[e.jsx("div",{className:"cc-code-header",children:e.jsx("span",{className:"cc-code-label",children:"After: Slancha"})}),e.jsx("pre",{children:e.jsx("code",{children:t.migrationCode.after})})]})]})]}),e.jsxs("section",{className:"cc-cta",children:[e.jsxs("h2",{children:["Ready to switch from ",t.name,"?"]}),e.jsx("p",{children:"Start with the free router. See cost savings from your first request. No credit card required."}),e.jsxs("div",{className:"cc-cta-buttons",children:[e.jsx(s,{to:"/signup",className:"btn-primary",children:"Start Free"}),e.jsx(s,{to:"/docs/quickstart",className:"btn-secondary",children:"Read the Quickstart"})]})]}),e.jsxs("section",{className:"cc-section cc-others",children:[e.jsx("h2",{className:"cc-section-title",children:"Other comparisons"}),e.jsxs("div",{className:"cc-others-grid",children:[c.map(o=>e.jsxs(s,{to:`/vs/${o.slug}`,className:"cc-other-card",children:[e.jsxs("span",{className:"cc-other-name",children:["vs ",o.name]}),e.jsx("span",{className:"cc-other-tagline",children:o.tagline})]},o.slug)),e.jsxs(s,{to:"/vs-competitors",className:"cc-other-card",children:[e.jsx("span",{className:"cc-other-name",children:"Full Comparison"}),e.jsx("span",{className:"cc-other-tagline",children:"All competitors side-by-side"})]})]})]})]}),e.jsx(p,{})]})}export{f as default};

import{u as n,r as d,j as e,N as c,L as r,F as u}from"./index-DwKy98Dm.js";const o=[{id:"signup",label:"Sign Up",sublabel:"Get your API key",badge:"setup",title:"Create Your Account & Get an API Key",description:"Start with a free account. No credit card required. You get an API key in under 60 seconds — then you're ready to send your first request.",code:`# 1. Install the SDK
pip install slancha

# 2. Set your API key
export SLANCHA_API_KEY="sk_live_your_key_here"

# 3. Verify your connection
python -c "
import slancha
client = slancha.Client()
print(client.whoami())
"

# Output:
# {
#   "org": "acme-corp",
#   "plan": "starter",
#   "models_available": 12,
#   "evals_remaining": "unlimited"
# }`,codeLabel:"Terminal",result:{type:"metrics",items:[{label:"Time to first key",value:"<60s",color:"green"},{label:"Models available",value:"12",color:"blue"},{label:"Free tier evals",value:"Unlimited",color:"yellow"},{label:"Setup complexity",value:"Zero",color:"green"}]},resultLabel:"What you get",keyPoints:["No credit card needed to start — free tier includes the router + unlimited evals","Single API key works across all endpoints (route, eval, deploy, fine-tune)","OpenAI-compatible: swap your base URL and it works with existing code","Dashboard available immediately with usage tracking and model analytics"]},{id:"eval",label:"Run First Eval",sublabel:"Benchmark models",badge:"evaluate",title:"Run Your First Evaluation",description:"Upload a dataset and benchmark any model against your quality thresholds. Slancha runs evaluations in parallel — 500 samples in under a minute.",code:`import slancha

client = slancha.Client()

# Create an evaluation against your dataset
eval_run = client.evaluations.create(
    name="gpt-4o-support-tickets-v2",
    model="gpt-4o",
    dataset_id="ds_support_tickets_500",
    metrics=[
        "accuracy",
        "response_quality",
        "latency_p95"
    ],
    thresholds={
        "accuracy": 0.90,
        "response_quality": 0.85,
        "latency_p95": 2000  # ms
    },
    parallel=10
)

# Check results
print(eval_run.verdict)     # "PASS"
print(eval_run.duration)    # "47s"
print(eval_run.results)`,codeLabel:"Python — evaluate.py",result:{type:"metrics",items:[{label:"Accuracy",value:"93.4%",color:"green",delta:"+3.4% above threshold"},{label:"Response quality",value:"0.912",color:"green",delta:"PASS"},{label:"Latency P95",value:"1,847ms",color:"blue",delta:"Under 2s target"},{label:"Verdict",value:"PASS",color:"green"}]},resultLabel:"Eval results",keyPoints:["Run evals against any model — GPT-4o, Claude, Llama, Mistral, or your own fine-tunes","Custom metrics: accuracy, latency, cost, toxicity, or any function you define","Pass/fail thresholds auto-gate deployments — bad models never reach production","All eval data feeds into the fine-tuning pipeline automatically"]},{id:"route",label:"Deploy Router",sublabel:"Smart model selection",badge:"deploy",title:"Deploy the Smart Router",description:"The Slancha Router analyzes every request and picks the best model automatically. No prompt engineering for model selection — it learns what works for your traffic.",code:`import slancha

client = slancha.Client()

# Route a request — Slancha picks the best model
response = client.chat.completions.create(
    model="slancha-router",
    messages=[
        {"role": "system", "content": "You are a support agent."},
        {"role": "user", "content": "How do I reset my password?"}
    ],
    routing={
        "strategy": "cost-optimized",
        "max_cost_per_token": 0.002,
        "fallback": "gpt-4o-mini"
    }
)

print(response.model)           # "deepseek-v3"
print(response.routing_reason)
# "complexity:low, cost_ceiling:$0.002/tok
#  → deepseek-v3 (93% cost savings vs gpt-4o)"
print(response.usage.cost)      # "$0.00012"`,codeLabel:"Python — route.py",result:{type:"metrics",items:[{label:"Cost savings",value:"93%",color:"green",delta:"vs. GPT-4o baseline"},{label:"Model selected",value:"DeepSeek-V3",color:"blue"},{label:"Latency",value:"340ms",color:"green",delta:"P95 across 10K req"},{label:"Quality score",value:"0.97",color:"green",delta:"No quality drop"}]},resultLabel:"Routing results",keyPoints:["Drop-in replacement for OpenAI — change the base URL, everything else stays the same","Router learns from your eval data to improve model selection over time","Cost-optimized, latency-optimized, or quality-optimized strategies available","Circuit breakers and automatic failover built in — zero downtime routing"]},{id:"finetune",label:"Fine-Tune",sublabel:"Auto-optimize models",badge:"optimize",title:"Automated Fine-Tuning from Eval Data",description:"Slancha uses your evaluation results to automatically fine-tune models. High-scoring samples become training data. The loop closes itself — eval, train, re-eval, promote.",code:`import slancha

client = slancha.Client()

# Fine-tune automatically from eval data
job = client.fine_tuning.create(
    base_model="llama-3.1-8b",
    dataset_source="eval",  # Use eval results
    eval_id="eval_9xKm2nP4",
    config={
        "min_score": 0.85,      # Only train on good samples
        "epochs": 3,
        "mixing_ratio": 0.7,    # 70% domain, 30% general
        "quantization": "QAT",  # Quantization-Aware Training
        "auto_promote": True    # Deploy if eval passes
    }
)

# Monitor progress
print(job.status)        # "training"
print(job.eta)           # "~12 minutes"

# When done — model auto-promotes if thresholds pass
# job.promoted_model → "ft:llama-3.1-8b:acme:v3"`,codeLabel:"Python — finetune.py",result:{type:"metrics",items:[{label:"Training samples",value:"425",color:"blue",delta:"From 500 eval samples"},{label:"Quality improvement",value:"+12%",color:"green",delta:"vs. base Llama 3.1"},{label:"Cost per request",value:"-67%",color:"green",delta:"Smaller model, same quality"},{label:"Auto-promoted",value:"Yes",color:"green",delta:"Passed all thresholds"}]},resultLabel:"Fine-tuning results",keyPoints:["Eval data is the training data — no separate dataset curation needed","Mixing ratio balances domain expertise with general capability","QAT produces quantized models that run 3x faster with minimal quality loss","Auto-promote: if the fine-tuned model passes eval, it goes live. If not, it doesn't."]},{id:"metrics",label:"Monitor",sublabel:"Track everything",badge:"monitor",title:"Real-Time Metrics Dashboard",description:"Track cost, latency, quality, and routing decisions in real time. The dashboard shows how the system optimizes itself — and flags when something needs attention.",code:`import slancha

client = slancha.Client()

# Get usage summary for the last 7 days
usage = client.usage.summary(period="7d")

print(usage)
# {
#   "total_requests": 142847,
#   "total_cost": "$34.12",
#   "avg_latency_ms": 287,
#   "models_used": {
#     "deepseek-v3": 89234,
#     "gpt-4o-mini": 31205,
#     "ft:llama-3.1-8b:acme:v3": 18902,
#     "gpt-4o": 3506
#   },
#   "cost_savings_vs_gpt4o": "87%",
#   "quality_score_avg": 0.94,
#   "fine_tunes_deployed": 3,
#   "auto_promotions": 2,
#   "circuit_breaker_triggers": 1
# }`,codeLabel:"Python — metrics.py",result:{type:"metrics",items:[{label:"Weekly requests",value:"142.8K",color:"blue"},{label:"Total cost",value:"$34.12",color:"green",delta:"87% savings vs GPT-4o"},{label:"Avg latency",value:"287ms",color:"green"},{label:"Quality score",value:"0.94",color:"green",delta:"Across all models"}]},resultLabel:"Dashboard metrics",keyPoints:["Per-model cost breakdown shows exactly where your budget goes","Quality score tracks across the eval→deploy→fine-tune loop automatically","Anomaly alerts notify you when latency spikes or quality drops below threshold","Export metrics to Datadog, Grafana, or any observability platform via webhooks"]}];function p(){n("Product Demo");const[l,i]=d.useState(0),t=o[l];return e.jsxs(e.Fragment,{children:[e.jsx(c,{}),e.jsxs("main",{className:"demo-page",children:[e.jsxs("div",{className:"demo-header",children:[e.jsx("h1",{children:"Product Walkthrough"}),e.jsx("p",{children:"See how Slancha takes you from signup to optimized production AI in 5 steps — no infrastructure required."})]}),e.jsxs("div",{className:"demo-layout",children:[e.jsxs("nav",{className:"demo-nav",children:[e.jsx("div",{className:"demo-progress",children:e.jsx("div",{className:"demo-progress-fill",style:{width:`${(l+1)/o.length*100}%`}})}),o.map((a,s)=>e.jsxs("button",{className:`demo-nav-item${s===l?" active":""}${s<l?" completed":""}`,onClick:()=>i(s),children:[e.jsx("span",{className:"demo-nav-step",children:s<l?"✓":s+1}),e.jsxs("span",{className:"demo-nav-label",children:[a.label,e.jsx("small",{children:a.sublabel})]})]},a.id))]}),e.jsxs("div",{className:"demo-content",children:[e.jsxs("div",{className:"demo-step",children:[e.jsxs("div",{className:"demo-step-header",children:[e.jsxs("span",{className:`demo-step-badge ${t.badge}`,children:["Step ",l+1,": ",t.badge]}),e.jsx("h2",{children:t.title}),e.jsx("p",{children:t.description})]}),e.jsxs("div",{className:"demo-panels",children:[e.jsxs("div",{className:"demo-panel",children:[e.jsxs("div",{className:"demo-panel-header",children:[e.jsx("span",{children:"</>"})," ",t.codeLabel]}),e.jsx("div",{className:"demo-panel-body",children:t.code})]}),e.jsxs("div",{className:"demo-panel",children:[e.jsxs("div",{className:"demo-panel-header",children:[e.jsx("span",{children:"📊"})," ",t.resultLabel]}),e.jsx("div",{className:"demo-visual",children:e.jsx("div",{className:"demo-metric-grid",children:t.result.items.map((a,s)=>e.jsxs("div",{className:"demo-metric",children:[e.jsx("div",{className:"demo-metric-label",children:a.label}),e.jsx("div",{className:`demo-metric-value ${a.color}`,children:a.value}),a.delta&&e.jsx("div",{className:"demo-metric-delta",children:a.delta})]},s))})})]})]}),e.jsx("ul",{className:"demo-key-points",children:t.keyPoints.map((a,s)=>e.jsx("li",{children:a},s))}),e.jsxs("div",{className:"demo-nav-buttons",children:[e.jsx("button",{className:"demo-btn demo-btn-prev",onClick:()=>i(a=>a-1),disabled:l===0,children:"← Previous"}),l<o.length-1?e.jsx("button",{className:"demo-btn demo-btn-next",onClick:()=>i(a=>a+1),children:"Next Step →"}):e.jsx(r,{to:"/signup",className:"demo-btn demo-btn-next",style:{textDecoration:"none"},children:"Start Free →"})]})]},t.id),l===o.length-1&&e.jsxs("div",{className:"demo-cta",children:[e.jsx("h3",{children:"Ready to see this with your data?"}),e.jsx("p",{children:"Start a free pilot — bring your dataset, and we'll run the full eval→deploy→optimize loop on your workload."}),e.jsx(r,{to:"/contact",className:"demo-cta-btn",children:"Request a Pilot"})]})]})]})]}),e.jsx(u,{})]})}export{p as default};

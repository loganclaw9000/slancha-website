import{u as j,r as c,j as e,N as v,L as u,F as b}from"./index-C8iDOYtc.js";const r="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",p=[{resource:"Chat Completions",id:"chat",description:"Core inference endpoint. Send messages and Slancha's router automatically selects the optimal model.",endpoints:[{method:"POST",path:"/v1/chat/completions",summary:"Create a chat completion",description:"Send a conversation to Slancha's intelligent router. It analyzes task complexity, latency requirements, and cost constraints to select the optimal model — no model selection required.",auth:!0,requestBody:{type:"object",fields:[{name:"messages",type:"Message[]",required:!0,desc:'Array of message objects with role ("system", "user", "assistant") and content.'},{name:"model",type:"string",required:!1,desc:'Model hint. Default: "auto" (router decides). Override with a specific model ID to bypass routing.'},{name:"temperature",type:"number",required:!1,desc:"Sampling temperature (0-2). Higher = more creative. Default: 1.0"},{name:"max_tokens",type:"integer",required:!1,desc:"Maximum tokens to generate. Default: model-dependent."},{name:"stream",type:"boolean",required:!1,desc:"Enable server-sent events streaming. Default: false"},{name:"top_p",type:"number",required:!1,desc:"Nucleus sampling threshold. Default: 1.0"},{name:"stop",type:"string | string[]",required:!1,desc:"Stop sequences. Generation halts when encountered."},{name:"tools",type:"Tool[]",required:!1,desc:"Function/tool definitions for tool use. See Tool Use docs."},{name:"response_format",type:"object",required:!1,desc:'{ type: "json_object" } to force valid JSON output.'},{name:"frequency_penalty",type:"number",required:!1,desc:"Penalize repeated tokens (-2.0 to 2.0). Default: 0"},{name:"presence_penalty",type:"number",required:!1,desc:"Penalize tokens already in context (-2.0 to 2.0). Default: 0"}]},responseBody:{type:"object",fields:[{name:"id",type:"string",desc:'Unique completion ID (e.g., "sl-chat-abc123")'},{name:"object",type:"string",desc:'"chat.completion"'},{name:"created",type:"integer",desc:"Unix timestamp"},{name:"model",type:"string",desc:"Model that was actually used (selected by router)"},{name:"choices",type:"Choice[]",desc:"Array of completion choices"},{name:"usage",type:"Usage",desc:"Token counts, latency, and cost breakdown"},{name:"routing",type:"Routing",desc:"Router decision metadata — why this model was selected"}]},statuses:[{code:200,desc:"Successful completion"},{code:400,desc:"Invalid request (malformed messages, bad parameters)"},{code:401,desc:"Invalid or missing API key"},{code:429,desc:"Rate limit exceeded. Check Retry-After header."},{code:500,desc:"Internal server error"}],curl:`curl -X POST ${r}/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in 2 sentences."}
    ],
    "temperature": 0.7,
    "max_tokens": 200
  }'`,responseExample:`{
  "id": "sl-chat-7f3k9x",
  "object": "chat.completion",
  "created": 1711900800,
  "model": "qwen-2.5-72b-instruct",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing uses quantum bits (qubits) that can exist in superposition..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 28,
    "completion_tokens": 42,
    "total_tokens": 70,
    "latency_ms": 340,
    "cost": 0.000084
  },
  "routing": {
    "strategy": "auto",
    "reason": "simple_factual_query",
    "candidates_evaluated": 3,
    "selection_time_ms": 12
  }
}`}]},{resource:"Models",id:"models",description:"List and inspect models available in your routing pool.",endpoints:[{method:"GET",path:"/v1/models",summary:"List available models",description:"Returns all models currently in your routing pool, including their capabilities, cost per token, and current route share percentage.",auth:!0,queryParams:[{name:"capability",type:"string",required:!1,desc:'Filter by capability: "chat", "code", "reasoning", "vision"'},{name:"provider",type:"string",required:!1,desc:'Filter by provider: "openai", "anthropic", "meta", "google", "qwen"'}],statuses:[{code:200,desc:"List of models"},{code:401,desc:"Invalid API key"}],curl:`curl ${r}/models \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "object": "list",
  "data": [
    {
      "id": "qwen-2.5-72b-instruct",
      "object": "model",
      "provider": "qwen",
      "capabilities": ["chat", "code", "reasoning"],
      "context_window": 131072,
      "cost_per_1k_input": 0.0006,
      "cost_per_1k_output": 0.0018,
      "route_share": 0.42,
      "status": "active"
    },
    {
      "id": "llama-3.1-70b-instruct",
      "object": "model",
      "provider": "meta",
      "capabilities": ["chat", "code"],
      "context_window": 131072,
      "cost_per_1k_input": 0.0005,
      "cost_per_1k_output": 0.0015,
      "route_share": 0.28,
      "status": "active"
    }
  ]
}`},{method:"GET",path:"/v1/models/{model_id}",summary:"Get model details",description:"Returns detailed information about a specific model including performance metrics, routing statistics, and fine-tuned variants.",auth:!0,pathParams:[{name:"model_id",type:"string",required:!0,desc:"The model identifier"}],statuses:[{code:200,desc:"Model details"},{code:404,desc:"Model not found"}],curl:`curl ${r}/models/qwen-2.5-72b-instruct \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "id": "qwen-2.5-72b-instruct",
  "object": "model",
  "provider": "qwen",
  "capabilities": ["chat", "code", "reasoning"],
  "context_window": 131072,
  "cost_per_1k_input": 0.0006,
  "cost_per_1k_output": 0.0018,
  "route_share": 0.42,
  "status": "active",
  "metrics": {
    "avg_latency_ms": 280,
    "p99_latency_ms": 890,
    "accuracy_score": 0.91,
    "requests_24h": 14200
  },
  "fine_tuned_variants": [
    { "id": "qwen-2.5-72b-instruct-ft-abc", "dataset": "customer-support-v3", "accuracy_delta": "+0.04" }
  ]
}`}]},{resource:"Evaluations",id:"evaluations",description:"Run model evaluations to benchmark performance before and after routing changes or fine-tuning.",endpoints:[{method:"POST",path:"/v1/evaluations",summary:"Create an evaluation run",description:"Start a new evaluation comparing multiple models against a dataset. Results drive automatic routing updates and fine-tuning decisions.",auth:!0,requestBody:{type:"object",fields:[{name:"dataset_id",type:"string",required:!0,desc:"ID of the dataset to evaluate against"},{name:"models",type:"string[]",required:!1,desc:"Specific models to evaluate. Default: all models in routing pool."},{name:"metrics",type:"string[]",required:!1,desc:'Metrics to compute: "accuracy", "latency", "cost", "toxicity", "coherence". Default: all.'},{name:"auto_promote",type:"boolean",required:!1,desc:"Automatically update routing weights based on results. Default: false"},{name:"name",type:"string",required:!1,desc:"Human-readable name for this eval run"}]},statuses:[{code:201,desc:"Evaluation created and queued"},{code:400,desc:"Invalid dataset or parameters"},{code:404,desc:"Dataset not found"}],curl:`curl -X POST ${r}/evaluations \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset_id": "ds-customer-support-v3",
    "metrics": ["accuracy", "latency", "cost"],
    "auto_promote": true,
    "name": "Weekly routing eval"
  }'`,responseExample:`{
  "id": "eval-8k2m4n",
  "object": "evaluation",
  "status": "running",
  "name": "Weekly routing eval",
  "dataset_id": "ds-customer-support-v3",
  "models": ["qwen-2.5-72b-instruct", "llama-3.1-70b-instruct", "claude-3.5-sonnet"],
  "metrics": ["accuracy", "latency", "cost"],
  "auto_promote": true,
  "created": 1711900800,
  "progress": { "completed": 0, "total": 500 }
}`},{method:"GET",path:"/v1/evaluations/{eval_id}",summary:"Get evaluation results",description:"Retrieve the status and results of an evaluation run, including per-model scores and routing recommendations.",auth:!0,pathParams:[{name:"eval_id",type:"string",required:!0,desc:"The evaluation run ID"}],statuses:[{code:200,desc:"Evaluation details and results"},{code:404,desc:"Evaluation not found"}],curl:`curl ${r}/evaluations/eval-8k2m4n \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "id": "eval-8k2m4n",
  "object": "evaluation",
  "status": "completed",
  "results": {
    "qwen-2.5-72b-instruct": { "accuracy": 0.91, "avg_latency_ms": 280, "cost_per_1k": 0.0024 },
    "llama-3.1-70b-instruct": { "accuracy": 0.87, "avg_latency_ms": 220, "cost_per_1k": 0.0020 },
    "claude-3.5-sonnet": { "accuracy": 0.94, "avg_latency_ms": 450, "cost_per_1k": 0.0180 }
  },
  "recommendation": {
    "action": "update_routing",
    "changes": [
      { "model": "qwen-2.5-72b-instruct", "route_share": 0.42, "prev": 0.38 },
      { "model": "llama-3.1-70b-instruct", "route_share": 0.33, "prev": 0.35 }
    ]
  },
  "promoted": true,
  "completed_at": 1711904400
}`},{method:"GET",path:"/v1/evaluations",summary:"List evaluation runs",description:"List all evaluation runs with optional status filtering.",auth:!0,queryParams:[{name:"status",type:"string",required:!1,desc:'Filter: "running", "completed", "failed"'},{name:"limit",type:"integer",required:!1,desc:"Results per page (1-100). Default: 20"},{name:"after",type:"string",required:!1,desc:"Cursor for pagination"}],statuses:[{code:200,desc:"List of evaluations"}],curl:`curl "${r}/evaluations?status=completed&limit=5" \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "object": "list",
  "data": [
    { "id": "eval-8k2m4n", "status": "completed", "name": "Weekly routing eval", "created": 1711900800 },
    { "id": "eval-3j7p2q", "status": "completed", "name": "Post-finetune check", "created": 1711814400 }
  ],
  "has_more": true
}`}]},{resource:"Fine-Tuning",id:"fine-tuning",description:"Create and manage fine-tuning jobs. Slancha automatically handles data preparation, training, and deployment.",endpoints:[{method:"POST",path:"/v1/fine-tuning/jobs",summary:"Create a fine-tuning job",description:"Start a fine-tuning job. Slancha automatically selects the optimal base model, applies LoRA adapters, and runs QAT quantization. The fine-tuned model is auto-deployed to your routing pool when ready.",auth:!0,requestBody:{type:"object",fields:[{name:"dataset_id",type:"string",required:!0,desc:"Training dataset ID"},{name:"base_model",type:"string",required:!1,desc:"Base model to fine-tune. Default: auto-selected based on dataset."},{name:"method",type:"string",required:!1,desc:'"lora" (default), "qlora", or "full". LoRA recommended for most cases.'},{name:"hyperparameters",type:"object",required:!1,desc:"{ epochs, learning_rate, lora_rank, lora_alpha }. Auto-tuned if omitted."},{name:"validation_split",type:"number",required:!1,desc:"Fraction of data for validation (0-0.5). Default: 0.1"},{name:"auto_deploy",type:"boolean",required:!1,desc:"Deploy to routing pool when training completes. Default: true"},{name:"name",type:"string",required:!1,desc:"Human-readable name for this job"}]},statuses:[{code:201,desc:"Fine-tuning job created"},{code:400,desc:"Invalid dataset or parameters"}],curl:`curl -X POST ${r}/fine-tuning/jobs \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset_id": "ds-customer-support-v3",
    "method": "lora",
    "hyperparameters": {
      "epochs": 3,
      "lora_rank": 16
    },
    "auto_deploy": true,
    "name": "Support model v4"
  }'`,responseExample:`{
  "id": "ft-9x3k7m",
  "object": "fine_tuning.job",
  "status": "queued",
  "name": "Support model v4",
  "base_model": "qwen-2.5-72b-instruct",
  "method": "lora",
  "dataset_id": "ds-customer-support-v3",
  "hyperparameters": { "epochs": 3, "learning_rate": 2e-4, "lora_rank": 16, "lora_alpha": 32 },
  "auto_deploy": true,
  "created": 1711900800,
  "estimated_completion": 1711915200
}`},{method:"GET",path:"/v1/fine-tuning/jobs/{job_id}",summary:"Get fine-tuning job status",description:"Check the status and progress of a fine-tuning job, including training metrics and deployed model ID.",auth:!0,pathParams:[{name:"job_id",type:"string",required:!0,desc:"The fine-tuning job ID"}],statuses:[{code:200,desc:"Job details"},{code:404,desc:"Job not found"}],curl:`curl ${r}/fine-tuning/jobs/ft-9x3k7m \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "id": "ft-9x3k7m",
  "object": "fine_tuning.job",
  "status": "completed",
  "base_model": "qwen-2.5-72b-instruct",
  "fine_tuned_model": "qwen-2.5-72b-instruct-ft-9x3k7m",
  "training_metrics": {
    "final_loss": 0.82,
    "eval_accuracy": 0.93,
    "training_tokens": 2400000
  },
  "deployed": true,
  "deployed_at": 1711915200
}`},{method:"POST",path:"/v1/fine-tuning/jobs/{job_id}/cancel",summary:"Cancel a fine-tuning job",description:"Cancel a running or queued fine-tuning job. Already-completed jobs cannot be cancelled.",auth:!0,pathParams:[{name:"job_id",type:"string",required:!0,desc:"The fine-tuning job ID"}],statuses:[{code:200,desc:"Job cancelled"},{code:400,desc:"Job already completed"}],curl:`curl -X POST ${r}/fine-tuning/jobs/ft-9x3k7m/cancel \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "id": "ft-9x3k7m",
  "status": "cancelled",
  "cancelled_at": 1711904400
}`}]},{resource:"Datasets",id:"datasets",description:"Upload and manage datasets for evaluations and fine-tuning.",endpoints:[{method:"POST",path:"/v1/datasets",summary:"Upload a dataset",description:"Upload a JSONL dataset for evaluations or fine-tuning. Each line should contain a prompt-completion pair or a multi-turn conversation.",auth:!0,requestBody:{type:"multipart/form-data",fields:[{name:"file",type:"file",required:!0,desc:"JSONL file. Max 500MB."},{name:"name",type:"string",required:!0,desc:"Dataset name"},{name:"purpose",type:"string",required:!0,desc:'"fine-tuning" or "evaluation"'},{name:"description",type:"string",required:!1,desc:"Description of the dataset contents"}]},statuses:[{code:201,desc:"Dataset uploaded and validated"},{code:400,desc:"Invalid file format or validation error"},{code:413,desc:"File too large (>500MB)"}],curl:`curl -X POST ${r}/datasets \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -F "file=@training-data.jsonl" \\
  -F "name=Customer Support v3" \\
  -F "purpose=fine-tuning"`,responseExample:`{
  "id": "ds-customer-support-v3",
  "object": "dataset",
  "name": "Customer Support v3",
  "purpose": "fine-tuning",
  "status": "validated",
  "num_samples": 4200,
  "size_bytes": 8400000,
  "created": 1711900800
}`},{method:"GET",path:"/v1/datasets",summary:"List datasets",description:"List all uploaded datasets with their validation status and sample counts.",auth:!0,queryParams:[{name:"purpose",type:"string",required:!1,desc:'Filter: "fine-tuning" or "evaluation"'},{name:"limit",type:"integer",required:!1,desc:"Results per page. Default: 20"}],statuses:[{code:200,desc:"List of datasets"}],curl:`curl "${r}/datasets?purpose=fine-tuning" \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "object": "list",
  "data": [
    { "id": "ds-customer-support-v3", "name": "Customer Support v3", "purpose": "fine-tuning", "num_samples": 4200, "status": "validated" },
    { "id": "ds-eval-general-v1", "name": "General Eval Suite", "purpose": "evaluation", "num_samples": 500, "status": "validated" }
  ]
}`},{method:"DELETE",path:"/v1/datasets/{dataset_id}",summary:"Delete a dataset",description:"Permanently delete a dataset. Cannot delete datasets referenced by active fine-tuning jobs.",auth:!0,pathParams:[{name:"dataset_id",type:"string",required:!0,desc:"The dataset ID"}],statuses:[{code:200,desc:"Dataset deleted"},{code:409,desc:"Dataset in use by active job"}],curl:`curl -X DELETE ${r}/datasets/ds-old-data \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "id": "ds-old-data",
  "deleted": true
}`}]},{resource:"Deployments",id:"deployments",description:"Manage model deployments and their infrastructure configuration.",endpoints:[{method:"POST",path:"/v1/deployments",summary:"Create a deployment",description:"Deploy a model (base or fine-tuned) with specific infrastructure configuration. Slancha handles GPU allocation, quantization, and scaling.",auth:!0,requestBody:{type:"object",fields:[{name:"model",type:"string",required:!0,desc:"Model ID to deploy"},{name:"min_replicas",type:"integer",required:!1,desc:"Minimum replicas. Default: 1"},{name:"max_replicas",type:"integer",required:!1,desc:"Maximum replicas for auto-scaling. Default: 3"},{name:"quantization",type:"string",required:!1,desc:'"none", "int8", "int4", "qat". Default: auto-selected.'},{name:"gpu_type",type:"string",required:!1,desc:'"b200", "b300", "a100". Default: auto-selected.'},{name:"add_to_router",type:"boolean",required:!1,desc:"Add to routing pool immediately. Default: true"}]},statuses:[{code:201,desc:"Deployment created"},{code:400,desc:"Invalid configuration"},{code:402,desc:"Insufficient quota"}],curl:`curl -X POST ${r}/deployments \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen-2.5-72b-instruct-ft-9x3k7m",
    "min_replicas": 1,
    "max_replicas": 5,
    "quantization": "qat",
    "add_to_router": true
  }'`,responseExample:`{
  "id": "dep-4n8k2m",
  "object": "deployment",
  "model": "qwen-2.5-72b-instruct-ft-9x3k7m",
  "status": "provisioning",
  "replicas": { "min": 1, "max": 5, "current": 0 },
  "quantization": "qat",
  "gpu_type": "b200",
  "add_to_router": true,
  "created": 1711900800,
  "estimated_ready": 1711901100
}`},{method:"GET",path:"/v1/deployments",summary:"List deployments",description:"List all model deployments with their current status and metrics.",auth:!0,statuses:[{code:200,desc:"List of deployments"}],curl:`curl ${r}/deployments \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "object": "list",
  "data": [
    {
      "id": "dep-4n8k2m",
      "model": "qwen-2.5-72b-instruct-ft-9x3k7m",
      "status": "active",
      "replicas": { "min": 1, "max": 5, "current": 2 },
      "metrics": { "requests_per_min": 120, "avg_latency_ms": 240, "gpu_utilization": 0.73 }
    }
  ]
}`},{method:"DELETE",path:"/v1/deployments/{deployment_id}",summary:"Delete a deployment",description:"Remove a deployment and release its GPU resources. Removes the model from the routing pool.",auth:!0,pathParams:[{name:"deployment_id",type:"string",required:!0,desc:"The deployment ID"}],statuses:[{code:200,desc:"Deployment deleted"},{code:404,desc:"Deployment not found"}],curl:`curl -X DELETE ${r}/deployments/dep-4n8k2m \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "id": "dep-4n8k2m",
  "deleted": true,
  "removed_from_router": true
}`}]},{resource:"Router",id:"router",description:"View and configure the intelligent routing layer.",endpoints:[{method:"GET",path:"/v1/router/config",summary:"Get router configuration",description:"View the current routing configuration including model weights, strategy, and constraints.",auth:!0,statuses:[{code:200,desc:"Current router config"}],curl:`curl ${r}/router/config \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "strategy": "auto",
  "optimization_target": "balanced",
  "models": [
    { "id": "qwen-2.5-72b-instruct", "weight": 0.42, "enabled": true },
    { "id": "llama-3.1-70b-instruct", "weight": 0.33, "enabled": true },
    { "id": "claude-3.5-sonnet", "weight": 0.25, "enabled": true }
  ],
  "constraints": {
    "max_latency_ms": 2000,
    "max_cost_per_request": 0.05,
    "fallback_model": "qwen-2.5-72b-instruct"
  },
  "auto_rebalance": true,
  "last_rebalance": "2026-03-31T14:00:00Z"
}`},{method:"PUT",path:"/v1/router/config",summary:"Update router configuration",description:"Modify routing strategy, model weights, or constraints. Changes take effect immediately.",auth:!0,requestBody:{type:"object",fields:[{name:"optimization_target",type:"string",required:!1,desc:'"cost", "quality", "latency", or "balanced" (default)'},{name:"models",type:"ModelConfig[]",required:!1,desc:"Array of { id, weight, enabled } to update model routing"},{name:"constraints",type:"object",required:!1,desc:"Update max_latency_ms, max_cost_per_request, fallback_model"},{name:"auto_rebalance",type:"boolean",required:!1,desc:"Enable automatic weight rebalancing from eval results"}]},statuses:[{code:200,desc:"Config updated"},{code:400,desc:"Invalid configuration"}],curl:`curl -X PUT ${r}/router/config \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "optimization_target": "cost",
    "constraints": {
      "max_latency_ms": 1000,
      "max_cost_per_request": 0.02
    }
  }'`,responseExample:`{
  "strategy": "auto",
  "optimization_target": "cost",
  "constraints": {
    "max_latency_ms": 1000,
    "max_cost_per_request": 0.02,
    "fallback_model": "qwen-2.5-72b-instruct"
  },
  "updated_at": "2026-03-31T15:30:00Z"
}`}]},{resource:"Webhooks",id:"webhooks",description:"Subscribe to real-time events for evaluations, fine-tuning, and routing changes.",endpoints:[{method:"POST",path:"/v1/webhooks",summary:"Create a webhook",description:"Register a webhook endpoint to receive event notifications. Events are signed with HMAC-SHA256.",auth:!0,requestBody:{type:"object",fields:[{name:"url",type:"string",required:!0,desc:"HTTPS endpoint URL to receive events"},{name:"events",type:"string[]",required:!0,desc:'Events: "evaluation.completed", "fine_tuning.completed", "routing.updated", "deployment.ready", "usage.threshold"'},{name:"secret",type:"string",required:!1,desc:"Signing secret. Auto-generated if omitted."}]},statuses:[{code:201,desc:"Webhook created"},{code:400,desc:"Invalid URL or events"}],curl:`curl -X POST ${r}/webhooks \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/slancha",
    "events": ["evaluation.completed", "fine_tuning.completed", "routing.updated"]
  }'`,responseExample:`{
  "id": "wh-7m3k9x",
  "url": "https://your-app.com/webhooks/slancha",
  "events": ["evaluation.completed", "fine_tuning.completed", "routing.updated"],
  "secret": "whsec_abc123...",
  "status": "active",
  "created": 1711900800
}`}]},{resource:"Usage",id:"usage",description:"Track API usage, costs, and performance metrics.",endpoints:[{method:"GET",path:"/v1/usage",summary:"Get usage statistics",description:"Retrieve aggregated usage data including request counts, token usage, costs, and latency percentiles.",auth:!0,queryParams:[{name:"start_date",type:"string",required:!1,desc:"ISO 8601 date. Default: 30 days ago"},{name:"end_date",type:"string",required:!1,desc:"ISO 8601 date. Default: now"},{name:"granularity",type:"string",required:!1,desc:'"hourly", "daily" (default), "weekly", "monthly"'},{name:"model",type:"string",required:!1,desc:"Filter by specific model"}],statuses:[{code:200,desc:"Usage data"}],curl:`curl "${r}/usage?start_date=2026-03-01&granularity=daily" \\
  -H "Authorization: Bearer sk-your-api-key"`,responseExample:`{
  "object": "usage",
  "period": { "start": "2026-03-01", "end": "2026-03-31" },
  "totals": {
    "requests": 142000,
    "prompt_tokens": 28400000,
    "completion_tokens": 14200000,
    "total_cost": 42.60,
    "avg_latency_ms": 310,
    "p99_latency_ms": 920
  },
  "daily": [
    {
      "date": "2026-03-31",
      "requests": 5200,
      "tokens": 1560000,
      "cost": 1.56,
      "avg_latency_ms": 290
    }
  ],
  "by_model": [
    { "model": "qwen-2.5-72b-instruct", "requests": 59640, "cost": 14.31, "share": 0.42 },
    { "model": "llama-3.1-70b-instruct", "requests": 46860, "cost": 9.37, "share": 0.33 }
  ]
}`}]}],x={GET:"#22c55e",POST:"#6c5ce7",PUT:"#f59e0b",DELETE:"#ef4444",PATCH:"#06b6d4"};function y({text:t}){const[i,d]=c.useState(!1),o=()=>{navigator.clipboard.writeText(t),d(!0),setTimeout(()=>d(!1),2e3)};return e.jsx("button",{className:"api-copy-btn",onClick:o,title:"Copy",children:i?"✓":"Copy"})}function _({ep:t}){const[i,d]=c.useState(!1),o=[...(t.pathParams||[]).map(s=>({...s,location:"path"})),...(t.queryParams||[]).map(s=>({...s,location:"query"}))];return e.jsxs("div",{className:`api-endpoint ${i?"expanded":""}`,id:t.path.replace(/[/{}]/g,"-").replace(/^-/,""),children:[e.jsxs("button",{className:"api-endpoint-header",onClick:()=>d(!i),children:[e.jsxs("div",{className:"api-endpoint-left",children:[e.jsx("span",{className:"api-method-badge",style:{background:x[t.method]},children:t.method}),e.jsx("code",{className:"api-path",children:t.path})]}),e.jsxs("div",{className:"api-endpoint-right",children:[e.jsx("span",{className:"api-endpoint-summary",children:t.summary}),e.jsx("span",{className:`api-expand-arrow ${i?"open":""}`,children:"▾"})]})]}),i&&e.jsxs("div",{className:"api-endpoint-body",children:[e.jsx("p",{className:"api-endpoint-desc",children:t.description}),t.auth&&e.jsxs("div",{className:"api-auth-notice",children:[e.jsx("span",{className:"api-auth-icon",children:"🔒"}),"Requires ",e.jsx("code",{children:"Authorization: Bearer sk-your-api-key"})," header"]}),o.length>0&&e.jsxs("div",{className:"api-section",children:[e.jsx("h4",{children:"Parameters"}),e.jsxs("table",{className:"api-params-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"In"}),e.jsx("th",{children:"Required"}),e.jsx("th",{children:"Description"})]})}),e.jsx("tbody",{children:o.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:s.name})}),e.jsx("td",{children:e.jsx("code",{className:"api-type",children:s.type})}),e.jsx("td",{children:s.location}),e.jsx("td",{children:s.required?e.jsx("span",{className:"api-required",children:"Required"}):"Optional"}),e.jsx("td",{children:s.desc})]},s.name))})]})]}),t.requestBody&&e.jsxs("div",{className:"api-section",children:[e.jsxs("h4",{children:["Request Body ",e.jsx("code",{className:"api-type-small",children:t.requestBody.type})]}),e.jsxs("table",{className:"api-params-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Field"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Required"}),e.jsx("th",{children:"Description"})]})}),e.jsx("tbody",{children:t.requestBody.fields.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:s.name})}),e.jsx("td",{children:e.jsx("code",{className:"api-type",children:s.type})}),e.jsx("td",{children:s.required?e.jsx("span",{className:"api-required",children:"Required"}):"Optional"}),e.jsx("td",{children:s.desc})]},s.name))})]})]}),t.statuses&&e.jsxs("div",{className:"api-section",children:[e.jsx("h4",{children:"Response Codes"}),e.jsx("div",{className:"api-statuses",children:t.statuses.map(s=>e.jsxs("div",{className:`api-status ${s.code<300?"success":s.code<500?"client-error":"server-error"}`,children:[e.jsx("code",{children:s.code}),e.jsx("span",{children:s.desc})]},s.code))})]}),e.jsxs("div",{className:"api-section",children:[e.jsx("h4",{children:"Example Request"}),e.jsxs("div",{className:"api-code-block",children:[e.jsxs("div",{className:"api-code-header",children:[e.jsx("span",{children:"cURL"}),e.jsx(y,{text:t.curl})]}),e.jsx("pre",{children:e.jsx("code",{children:t.curl})})]})]}),t.responseExample&&e.jsxs("div",{className:"api-section",children:[e.jsx("h4",{children:"Example Response"}),e.jsxs("div",{className:"api-code-block response",children:[e.jsxs("div",{className:"api-code-header",children:[e.jsx("span",{children:"JSON"}),e.jsx(y,{text:t.responseExample})]}),e.jsx("pre",{children:e.jsx("code",{children:t.responseExample})})]})]})]})]})}function k(){j({title:"API Reference | Slancha",description:"Complete REST API reference for Slancha — endpoints for chat completions, evaluations, fine-tuning, deployments, datasets, routing, webhooks, and usage tracking."});const[t,i]=c.useState(""),[d,o]=c.useState(null),s=c.useRef(null),m=t?p.map(a=>({...a,endpoints:a.endpoints.filter(n=>n.path.toLowerCase().includes(t.toLowerCase())||n.summary.toLowerCase().includes(t.toLowerCase())||n.method.toLowerCase().includes(t.toLowerCase()))})).filter(a=>a.endpoints.length>0):p,g=a=>{o(a);const n=document.getElementById(`resource-${a}`);n&&n.scrollIntoView({behavior:"smooth",block:"start"})};c.useEffect(()=>{const a=new IntersectionObserver(n=>{for(const l of n)l.isIntersecting&&o(l.target.id.replace("resource-",""))},{rootMargin:"-100px 0px -60% 0px"});return document.querySelectorAll(".api-resource-section").forEach(n=>a.observe(n)),()=>a.disconnect()},[]);const f=p.reduce((a,n)=>a+n.endpoints.length,0);return e.jsxs("div",{className:"api-ref",children:[e.jsx(v,{}),e.jsxs("main",{id:"main-content",className:"api-ref-layout",children:[e.jsxs("aside",{className:"api-sidebar",children:[e.jsxs("div",{className:"api-sidebar-header",children:[e.jsx("h3",{children:"API Reference"}),e.jsx("span",{className:"api-version-badge",children:"v1"})]}),e.jsx("div",{className:"api-sidebar-search",children:e.jsx("input",{type:"text",placeholder:"Filter endpoints...","aria-label":"Filter API endpoints",value:t,onChange:a=>i(a.target.value)})}),e.jsxs("div",{className:"api-sidebar-info",children:[e.jsx("code",{className:"api-base-url",children:"aogutyvup5m15h-8888.proxy.runpod.net/v1"}),e.jsxs("span",{className:"api-endpoint-count",children:[f," endpoints"]})]}),e.jsx("nav",{className:"api-sidebar-nav",children:m.map(a=>e.jsxs("div",{className:"api-nav-group",children:[e.jsxs("button",{className:`api-nav-resource ${d===a.id?"active":""}`,onClick:()=>g(a.id),children:[a.resource,e.jsx("span",{className:"api-nav-count",children:a.endpoints.length})]}),e.jsx("div",{className:"api-nav-endpoints",children:a.endpoints.map(n=>e.jsxs("button",{className:"api-nav-endpoint",onClick:()=>{var h;const l=n.path.replace(/[/{}]/g,"-").replace(/^-/,"");(h=document.getElementById(l))==null||h.scrollIntoView({behavior:"smooth"})},children:[e.jsx("span",{className:"api-nav-method",style:{color:x[n.method]},children:n.method}),e.jsx("span",{className:"api-nav-path",children:n.path.split("/").pop().replace("{",":").replace("}","")})]},n.path+n.method))})]},a.id))}),e.jsxs("div",{className:"api-sidebar-links",children:[e.jsx(u,{to:"/developers/sdk",children:"SDK Reference"}),e.jsx(u,{to:"/docs/api-reference",children:"Quickstart Guide"}),e.jsx(u,{to:"/playground",children:"API Playground"})]})]}),e.jsxs("div",{className:"api-content",ref:s,children:[e.jsxs("div",{className:"api-hero",children:[e.jsx("h1",{children:"REST API Reference"}),e.jsx("p",{children:"Complete HTTP API for Slancha's AI inference platform. OpenAI-compatible chat completions endpoint plus evaluations, fine-tuning, routing, and more."}),e.jsxs("div",{className:"api-hero-details",children:[e.jsxs("div",{className:"api-hero-item",children:[e.jsx("span",{className:"api-hero-label",children:"Base URL"}),e.jsx("code",{children:"https://aogutyvup5m15h-8888.proxy.runpod.net/v1"})]}),e.jsxs("div",{className:"api-hero-item",children:[e.jsx("span",{className:"api-hero-label",children:"Auth"}),e.jsx("code",{children:"Authorization: Bearer sk-..."})]}),e.jsxs("div",{className:"api-hero-item",children:[e.jsx("span",{className:"api-hero-label",children:"Format"}),e.jsx("code",{children:"application/json"})]})]})]}),e.jsxs("section",{className:"api-auth-section",children:[e.jsx("h2",{children:"Authentication"}),e.jsxs("p",{children:["All API requests require a Bearer token in the ",e.jsx("code",{children:"Authorization"})," header. Create API keys from your ",e.jsx(u,{to:"/dashboard",children:"Dashboard"}),"."]}),e.jsxs("div",{className:"api-code-block",children:[e.jsx("div",{className:"api-code-header",children:e.jsx("span",{children:"Header"})}),e.jsx("pre",{children:e.jsx("code",{children:"Authorization: Bearer sk-your-api-key"})})]}),e.jsxs("p",{className:"api-auth-note",children:["API keys have two types: ",e.jsx("strong",{children:"Live"})," (production, rate-limited by plan) and ",e.jsx("strong",{children:"Test"})," (sandbox, free, lower limits). Keys beginning with ",e.jsx("code",{children:"sk-live-"})," are production keys; ",e.jsx("code",{children:"sk-test-"})," are sandbox."]})]}),e.jsxs("section",{className:"api-errors-section",children:[e.jsx("h2",{children:"Error Handling"}),e.jsx("p",{children:"Errors return a consistent JSON structure with a human-readable message and machine-readable code:"}),e.jsxs("div",{className:"api-code-block",children:[e.jsx("div",{className:"api-code-header",children:e.jsx("span",{children:"Error Response"})}),e.jsx("pre",{children:e.jsx("code",{children:`{
  "error": {
    "type": "rate_limit_exceeded",
    "message": "You've exceeded 1000 requests/min. Upgrade your plan or retry after 3 seconds.",
    "code": 429,
    "retry_after": 3
  }
}`})})]}),e.jsxs("div",{className:"api-error-codes",children:[e.jsxs("div",{className:"api-error-code",children:[e.jsx("code",{children:"400"})," Bad Request — invalid parameters"]}),e.jsxs("div",{className:"api-error-code",children:[e.jsx("code",{children:"401"})," Unauthorized — invalid or missing API key"]}),e.jsxs("div",{className:"api-error-code",children:[e.jsx("code",{children:"402"})," Payment Required — plan quota exceeded"]}),e.jsxs("div",{className:"api-error-code",children:[e.jsx("code",{children:"404"})," Not Found — resource doesn't exist"]}),e.jsxs("div",{className:"api-error-code",children:[e.jsx("code",{children:"429"})," Rate Limited — check ",e.jsx("code",{children:"Retry-After"})," header"]}),e.jsxs("div",{className:"api-error-code",children:[e.jsx("code",{children:"500"})," Server Error — retry with exponential backoff"]})]})]}),e.jsxs("section",{className:"api-rate-section",children:[e.jsx("h2",{children:"Rate Limits"}),e.jsxs("table",{className:"api-rate-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Plan"}),e.jsx("th",{children:"Requests/min"}),e.jsx("th",{children:"Tokens/min"}),e.jsx("th",{children:"Concurrent"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Free"}),e.jsx("td",{children:"60"}),e.jsx("td",{children:"40,000"}),e.jsx("td",{children:"5"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Hobbyist ($9/mo)"}),e.jsx("td",{children:"500"}),e.jsx("td",{children:"200,000"}),e.jsx("td",{children:"20"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Pro ($249/mo)"}),e.jsx("td",{children:"2,000"}),e.jsx("td",{children:"1,000,000"}),e.jsx("td",{children:"50"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Enterprise"}),e.jsx("td",{children:"Custom"}),e.jsx("td",{children:"Custom"}),e.jsx("td",{children:"Custom"})]})]})]}),e.jsxs("p",{className:"api-rate-note",children:["Rate limit headers are included in every response: ",e.jsx("code",{children:"X-RateLimit-Remaining"}),", ",e.jsx("code",{children:"X-RateLimit-Reset"}),"."]})]}),m.map(a=>e.jsxs("section",{className:"api-resource-section",id:`resource-${a.id}`,children:[e.jsxs("div",{className:"api-resource-header",children:[e.jsx("h2",{children:a.resource}),e.jsx("p",{children:a.description})]}),a.endpoints.map(n=>e.jsx(_,{ep:n},n.path+n.method))]},a.id)),e.jsxs("section",{className:"api-openai-section",children:[e.jsx("h2",{children:"OpenAI Compatibility"}),e.jsxs("p",{children:["Slancha's ",e.jsx("code",{children:"/v1/chat/completions"})," endpoint is fully OpenAI-compatible. Point any OpenAI SDK at Slancha by changing the base URL:"]}),e.jsxs("div",{className:"api-code-block",children:[e.jsx("div",{className:"api-code-header",children:e.jsx("span",{children:"Python — Drop-in replacement"})}),e.jsx("pre",{children:e.jsx("code",{children:`from openai import OpenAI

# Just change base_url and api_key
client = OpenAI(
    base_url="https://aogutyvup5m15h-8888.proxy.runpod.net/v1",
    api_key="sk-your-slancha-key"
)

response = client.chat.completions.create(
    model="auto",  # Slancha routes automatically
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`})})]})]})]})]}),e.jsx(b,{})]})}export{k as default};

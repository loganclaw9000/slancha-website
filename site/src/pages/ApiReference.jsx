import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './ApiReference.css';

const BASE_URL = 'https://api.slancha.ai/v1';

const endpoints = [
  {
    resource: 'Chat Completions',
    id: 'chat',
    description: 'Core inference endpoint. Send messages and Slancha\'s router automatically selects the optimal model.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/chat/completions',
        summary: 'Create a chat completion',
        description: 'Send a conversation to Slancha\'s intelligent router. It analyzes task complexity, latency requirements, and cost constraints to select the optimal model — no model selection required.',
        auth: true,
        requestBody: {
          type: 'object',
          fields: [
            { name: 'messages', type: 'Message[]', required: true, desc: 'Array of message objects with role ("system", "user", "assistant") and content.' },
            { name: 'model', type: 'string', required: false, desc: 'Model hint. Default: "auto" (router decides). Override with a specific model ID to bypass routing.' },
            { name: 'temperature', type: 'number', required: false, desc: 'Sampling temperature (0-2). Higher = more creative. Default: 1.0' },
            { name: 'max_tokens', type: 'integer', required: false, desc: 'Maximum tokens to generate. Default: model-dependent.' },
            { name: 'stream', type: 'boolean', required: false, desc: 'Enable server-sent events streaming. Default: false' },
            { name: 'top_p', type: 'number', required: false, desc: 'Nucleus sampling threshold. Default: 1.0' },
            { name: 'stop', type: 'string | string[]', required: false, desc: 'Stop sequences. Generation halts when encountered.' },
            { name: 'tools', type: 'Tool[]', required: false, desc: 'Function/tool definitions for tool use. See Tool Use docs.' },
            { name: 'response_format', type: 'object', required: false, desc: '{ type: "json_object" } to force valid JSON output.' },
            { name: 'frequency_penalty', type: 'number', required: false, desc: 'Penalize repeated tokens (-2.0 to 2.0). Default: 0' },
            { name: 'presence_penalty', type: 'number', required: false, desc: 'Penalize tokens already in context (-2.0 to 2.0). Default: 0' },
          ],
        },
        responseBody: {
          type: 'object',
          fields: [
            { name: 'id', type: 'string', desc: 'Unique completion ID (e.g., "sl-chat-abc123")' },
            { name: 'object', type: 'string', desc: '"chat.completion"' },
            { name: 'created', type: 'integer', desc: 'Unix timestamp' },
            { name: 'model', type: 'string', desc: 'Model that was actually used (selected by router)' },
            { name: 'choices', type: 'Choice[]', desc: 'Array of completion choices' },
            { name: 'usage', type: 'Usage', desc: 'Token counts, latency, and cost breakdown' },
            { name: 'routing', type: 'Routing', desc: 'Router decision metadata — why this model was selected' },
          ],
        },
        statuses: [
          { code: 200, desc: 'Successful completion' },
          { code: 400, desc: 'Invalid request (malformed messages, bad parameters)' },
          { code: 401, desc: 'Invalid or missing API key' },
          { code: 429, desc: 'Rate limit exceeded. Check Retry-After header.' },
          { code: 500, desc: 'Internal server error' },
        ],
        curl: `curl -X POST ${BASE_URL}/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in 2 sentences."}
    ],
    "temperature": 0.7,
    "max_tokens": 200
  }'`,
        responseExample: `{
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
}`,
      },
    ],
  },
  {
    resource: 'Models',
    id: 'models',
    description: 'List and inspect models available in your routing pool.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/models',
        summary: 'List available models',
        description: 'Returns all models currently in your routing pool, including their capabilities, cost per token, and current route share percentage.',
        auth: true,
        queryParams: [
          { name: 'capability', type: 'string', required: false, desc: 'Filter by capability: "chat", "code", "reasoning", "vision"' },
          { name: 'provider', type: 'string', required: false, desc: 'Filter by provider: "openai", "anthropic", "meta", "google", "qwen"' },
        ],
        statuses: [
          { code: 200, desc: 'List of models' },
          { code: 401, desc: 'Invalid API key' },
        ],
        curl: `curl ${BASE_URL}/models \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
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
}`,
      },
      {
        method: 'GET',
        path: '/v1/models/{model_id}',
        summary: 'Get model details',
        description: 'Returns detailed information about a specific model including performance metrics, routing statistics, and fine-tuned variants.',
        auth: true,
        pathParams: [
          { name: 'model_id', type: 'string', required: true, desc: 'The model identifier' },
        ],
        statuses: [
          { code: 200, desc: 'Model details' },
          { code: 404, desc: 'Model not found' },
        ],
        curl: `curl ${BASE_URL}/models/qwen-2.5-72b-instruct \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
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
}`,
      },
    ],
  },
  {
    resource: 'Evaluations',
    id: 'evaluations',
    description: 'Run model evaluations to benchmark performance before and after routing changes or fine-tuning.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/evaluations',
        summary: 'Create an evaluation run',
        description: 'Start a new evaluation comparing multiple models against a dataset. Results drive automatic routing updates and fine-tuning decisions.',
        auth: true,
        requestBody: {
          type: 'object',
          fields: [
            { name: 'dataset_id', type: 'string', required: true, desc: 'ID of the dataset to evaluate against' },
            { name: 'models', type: 'string[]', required: false, desc: 'Specific models to evaluate. Default: all models in routing pool.' },
            { name: 'metrics', type: 'string[]', required: false, desc: 'Metrics to compute: "accuracy", "latency", "cost", "toxicity", "coherence". Default: all.' },
            { name: 'auto_promote', type: 'boolean', required: false, desc: 'Automatically update routing weights based on results. Default: false' },
            { name: 'name', type: 'string', required: false, desc: 'Human-readable name for this eval run' },
          ],
        },
        statuses: [
          { code: 201, desc: 'Evaluation created and queued' },
          { code: 400, desc: 'Invalid dataset or parameters' },
          { code: 404, desc: 'Dataset not found' },
        ],
        curl: `curl -X POST ${BASE_URL}/evaluations \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset_id": "ds-customer-support-v3",
    "metrics": ["accuracy", "latency", "cost"],
    "auto_promote": true,
    "name": "Weekly routing eval"
  }'`,
        responseExample: `{
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
}`,
      },
      {
        method: 'GET',
        path: '/v1/evaluations/{eval_id}',
        summary: 'Get evaluation results',
        description: 'Retrieve the status and results of an evaluation run, including per-model scores and routing recommendations.',
        auth: true,
        pathParams: [
          { name: 'eval_id', type: 'string', required: true, desc: 'The evaluation run ID' },
        ],
        statuses: [
          { code: 200, desc: 'Evaluation details and results' },
          { code: 404, desc: 'Evaluation not found' },
        ],
        curl: `curl ${BASE_URL}/evaluations/eval-8k2m4n \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
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
}`,
      },
      {
        method: 'GET',
        path: '/v1/evaluations',
        summary: 'List evaluation runs',
        description: 'List all evaluation runs with optional status filtering.',
        auth: true,
        queryParams: [
          { name: 'status', type: 'string', required: false, desc: 'Filter: "running", "completed", "failed"' },
          { name: 'limit', type: 'integer', required: false, desc: 'Results per page (1-100). Default: 20' },
          { name: 'after', type: 'string', required: false, desc: 'Cursor for pagination' },
        ],
        statuses: [
          { code: 200, desc: 'List of evaluations' },
        ],
        curl: `curl "${BASE_URL}/evaluations?status=completed&limit=5" \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
  "object": "list",
  "data": [
    { "id": "eval-8k2m4n", "status": "completed", "name": "Weekly routing eval", "created": 1711900800 },
    { "id": "eval-3j7p2q", "status": "completed", "name": "Post-finetune check", "created": 1711814400 }
  ],
  "has_more": true
}`,
      },
    ],
  },
  {
    resource: 'Fine-Tuning',
    id: 'fine-tuning',
    description: 'Create and manage fine-tuning jobs. Slancha automatically handles data preparation, training, and deployment.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/fine-tuning/jobs',
        summary: 'Create a fine-tuning job',
        description: 'Start a fine-tuning job. Slancha automatically selects the optimal base model, applies LoRA adapters, and runs QAT quantization. The fine-tuned model is auto-deployed to your routing pool when ready.',
        auth: true,
        requestBody: {
          type: 'object',
          fields: [
            { name: 'dataset_id', type: 'string', required: true, desc: 'Training dataset ID' },
            { name: 'base_model', type: 'string', required: false, desc: 'Base model to fine-tune. Default: auto-selected based on dataset.' },
            { name: 'method', type: 'string', required: false, desc: '"lora" (default), "qlora", or "full". LoRA recommended for most cases.' },
            { name: 'hyperparameters', type: 'object', required: false, desc: '{ epochs, learning_rate, lora_rank, lora_alpha }. Auto-tuned if omitted.' },
            { name: 'validation_split', type: 'number', required: false, desc: 'Fraction of data for validation (0-0.5). Default: 0.1' },
            { name: 'auto_deploy', type: 'boolean', required: false, desc: 'Deploy to routing pool when training completes. Default: true' },
            { name: 'name', type: 'string', required: false, desc: 'Human-readable name for this job' },
          ],
        },
        statuses: [
          { code: 201, desc: 'Fine-tuning job created' },
          { code: 400, desc: 'Invalid dataset or parameters' },
        ],
        curl: `curl -X POST ${BASE_URL}/fine-tuning/jobs \\
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
  }'`,
        responseExample: `{
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
}`,
      },
      {
        method: 'GET',
        path: '/v1/fine-tuning/jobs/{job_id}',
        summary: 'Get fine-tuning job status',
        description: 'Check the status and progress of a fine-tuning job, including training metrics and deployed model ID.',
        auth: true,
        pathParams: [
          { name: 'job_id', type: 'string', required: true, desc: 'The fine-tuning job ID' },
        ],
        statuses: [
          { code: 200, desc: 'Job details' },
          { code: 404, desc: 'Job not found' },
        ],
        curl: `curl ${BASE_URL}/fine-tuning/jobs/ft-9x3k7m \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
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
}`,
      },
      {
        method: 'POST',
        path: '/v1/fine-tuning/jobs/{job_id}/cancel',
        summary: 'Cancel a fine-tuning job',
        description: 'Cancel a running or queued fine-tuning job. Already-completed jobs cannot be cancelled.',
        auth: true,
        pathParams: [
          { name: 'job_id', type: 'string', required: true, desc: 'The fine-tuning job ID' },
        ],
        statuses: [
          { code: 200, desc: 'Job cancelled' },
          { code: 400, desc: 'Job already completed' },
        ],
        curl: `curl -X POST ${BASE_URL}/fine-tuning/jobs/ft-9x3k7m/cancel \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
  "id": "ft-9x3k7m",
  "status": "cancelled",
  "cancelled_at": 1711904400
}`,
      },
    ],
  },
  {
    resource: 'Datasets',
    id: 'datasets',
    description: 'Upload and manage datasets for evaluations and fine-tuning.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/datasets',
        summary: 'Upload a dataset',
        description: 'Upload a JSONL dataset for evaluations or fine-tuning. Each line should contain a prompt-completion pair or a multi-turn conversation.',
        auth: true,
        requestBody: {
          type: 'multipart/form-data',
          fields: [
            { name: 'file', type: 'file', required: true, desc: 'JSONL file. Max 500MB.' },
            { name: 'name', type: 'string', required: true, desc: 'Dataset name' },
            { name: 'purpose', type: 'string', required: true, desc: '"fine-tuning" or "evaluation"' },
            { name: 'description', type: 'string', required: false, desc: 'Description of the dataset contents' },
          ],
        },
        statuses: [
          { code: 201, desc: 'Dataset uploaded and validated' },
          { code: 400, desc: 'Invalid file format or validation error' },
          { code: 413, desc: 'File too large (>500MB)' },
        ],
        curl: `curl -X POST ${BASE_URL}/datasets \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -F "file=@training-data.jsonl" \\
  -F "name=Customer Support v3" \\
  -F "purpose=fine-tuning"`,
        responseExample: `{
  "id": "ds-customer-support-v3",
  "object": "dataset",
  "name": "Customer Support v3",
  "purpose": "fine-tuning",
  "status": "validated",
  "num_samples": 4200,
  "size_bytes": 8400000,
  "created": 1711900800
}`,
      },
      {
        method: 'GET',
        path: '/v1/datasets',
        summary: 'List datasets',
        description: 'List all uploaded datasets with their validation status and sample counts.',
        auth: true,
        queryParams: [
          { name: 'purpose', type: 'string', required: false, desc: 'Filter: "fine-tuning" or "evaluation"' },
          { name: 'limit', type: 'integer', required: false, desc: 'Results per page. Default: 20' },
        ],
        statuses: [
          { code: 200, desc: 'List of datasets' },
        ],
        curl: `curl "${BASE_URL}/datasets?purpose=fine-tuning" \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
  "object": "list",
  "data": [
    { "id": "ds-customer-support-v3", "name": "Customer Support v3", "purpose": "fine-tuning", "num_samples": 4200, "status": "validated" },
    { "id": "ds-eval-general-v1", "name": "General Eval Suite", "purpose": "evaluation", "num_samples": 500, "status": "validated" }
  ]
}`,
      },
      {
        method: 'DELETE',
        path: '/v1/datasets/{dataset_id}',
        summary: 'Delete a dataset',
        description: 'Permanently delete a dataset. Cannot delete datasets referenced by active fine-tuning jobs.',
        auth: true,
        pathParams: [
          { name: 'dataset_id', type: 'string', required: true, desc: 'The dataset ID' },
        ],
        statuses: [
          { code: 200, desc: 'Dataset deleted' },
          { code: 409, desc: 'Dataset in use by active job' },
        ],
        curl: `curl -X DELETE ${BASE_URL}/datasets/ds-old-data \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
  "id": "ds-old-data",
  "deleted": true
}`,
      },
    ],
  },
  {
    resource: 'Deployments',
    id: 'deployments',
    description: 'Manage model deployments and their infrastructure configuration.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/deployments',
        summary: 'Create a deployment',
        description: 'Deploy a model (base or fine-tuned) with specific infrastructure configuration. Slancha handles GPU allocation, quantization, and scaling.',
        auth: true,
        requestBody: {
          type: 'object',
          fields: [
            { name: 'model', type: 'string', required: true, desc: 'Model ID to deploy' },
            { name: 'min_replicas', type: 'integer', required: false, desc: 'Minimum replicas. Default: 1' },
            { name: 'max_replicas', type: 'integer', required: false, desc: 'Maximum replicas for auto-scaling. Default: 3' },
            { name: 'quantization', type: 'string', required: false, desc: '"none", "int8", "int4", "qat". Default: auto-selected.' },
            { name: 'gpu_type', type: 'string', required: false, desc: '"b200", "b300", "a100". Default: auto-selected.' },
            { name: 'add_to_router', type: 'boolean', required: false, desc: 'Add to routing pool immediately. Default: true' },
          ],
        },
        statuses: [
          { code: 201, desc: 'Deployment created' },
          { code: 400, desc: 'Invalid configuration' },
          { code: 402, desc: 'Insufficient quota' },
        ],
        curl: `curl -X POST ${BASE_URL}/deployments \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen-2.5-72b-instruct-ft-9x3k7m",
    "min_replicas": 1,
    "max_replicas": 5,
    "quantization": "qat",
    "add_to_router": true
  }'`,
        responseExample: `{
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
}`,
      },
      {
        method: 'GET',
        path: '/v1/deployments',
        summary: 'List deployments',
        description: 'List all model deployments with their current status and metrics.',
        auth: true,
        statuses: [
          { code: 200, desc: 'List of deployments' },
        ],
        curl: `curl ${BASE_URL}/deployments \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
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
}`,
      },
      {
        method: 'DELETE',
        path: '/v1/deployments/{deployment_id}',
        summary: 'Delete a deployment',
        description: 'Remove a deployment and release its GPU resources. Removes the model from the routing pool.',
        auth: true,
        pathParams: [
          { name: 'deployment_id', type: 'string', required: true, desc: 'The deployment ID' },
        ],
        statuses: [
          { code: 200, desc: 'Deployment deleted' },
          { code: 404, desc: 'Deployment not found' },
        ],
        curl: `curl -X DELETE ${BASE_URL}/deployments/dep-4n8k2m \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
  "id": "dep-4n8k2m",
  "deleted": true,
  "removed_from_router": true
}`,
      },
    ],
  },
  {
    resource: 'Router',
    id: 'router',
    description: 'View and configure the intelligent routing layer.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/router/config',
        summary: 'Get router configuration',
        description: 'View the current routing configuration including model weights, strategy, and constraints.',
        auth: true,
        statuses: [
          { code: 200, desc: 'Current router config' },
        ],
        curl: `curl ${BASE_URL}/router/config \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
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
}`,
      },
      {
        method: 'PUT',
        path: '/v1/router/config',
        summary: 'Update router configuration',
        description: 'Modify routing strategy, model weights, or constraints. Changes take effect immediately.',
        auth: true,
        requestBody: {
          type: 'object',
          fields: [
            { name: 'optimization_target', type: 'string', required: false, desc: '"cost", "quality", "latency", or "balanced" (default)' },
            { name: 'models', type: 'ModelConfig[]', required: false, desc: 'Array of { id, weight, enabled } to update model routing' },
            { name: 'constraints', type: 'object', required: false, desc: 'Update max_latency_ms, max_cost_per_request, fallback_model' },
            { name: 'auto_rebalance', type: 'boolean', required: false, desc: 'Enable automatic weight rebalancing from eval results' },
          ],
        },
        statuses: [
          { code: 200, desc: 'Config updated' },
          { code: 400, desc: 'Invalid configuration' },
        ],
        curl: `curl -X PUT ${BASE_URL}/router/config \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "optimization_target": "cost",
    "constraints": {
      "max_latency_ms": 1000,
      "max_cost_per_request": 0.02
    }
  }'`,
        responseExample: `{
  "strategy": "auto",
  "optimization_target": "cost",
  "constraints": {
    "max_latency_ms": 1000,
    "max_cost_per_request": 0.02,
    "fallback_model": "qwen-2.5-72b-instruct"
  },
  "updated_at": "2026-03-31T15:30:00Z"
}`,
      },
    ],
  },
  {
    resource: 'Webhooks',
    id: 'webhooks',
    description: 'Subscribe to real-time events for evaluations, fine-tuning, and routing changes.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/webhooks',
        summary: 'Create a webhook',
        description: 'Register a webhook endpoint to receive event notifications. Events are signed with HMAC-SHA256.',
        auth: true,
        requestBody: {
          type: 'object',
          fields: [
            { name: 'url', type: 'string', required: true, desc: 'HTTPS endpoint URL to receive events' },
            { name: 'events', type: 'string[]', required: true, desc: 'Events: "evaluation.completed", "fine_tuning.completed", "routing.updated", "deployment.ready", "usage.threshold"' },
            { name: 'secret', type: 'string', required: false, desc: 'Signing secret. Auto-generated if omitted.' },
          ],
        },
        statuses: [
          { code: 201, desc: 'Webhook created' },
          { code: 400, desc: 'Invalid URL or events' },
        ],
        curl: `curl -X POST ${BASE_URL}/webhooks \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/slancha",
    "events": ["evaluation.completed", "fine_tuning.completed", "routing.updated"]
  }'`,
        responseExample: `{
  "id": "wh-7m3k9x",
  "url": "https://your-app.com/webhooks/slancha",
  "events": ["evaluation.completed", "fine_tuning.completed", "routing.updated"],
  "secret": "whsec_abc123...",
  "status": "active",
  "created": 1711900800
}`,
      },
    ],
  },
  {
    resource: 'Usage',
    id: 'usage',
    description: 'Track API usage, costs, and performance metrics.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/usage',
        summary: 'Get usage statistics',
        description: 'Retrieve aggregated usage data including request counts, token usage, costs, and latency percentiles.',
        auth: true,
        queryParams: [
          { name: 'start_date', type: 'string', required: false, desc: 'ISO 8601 date. Default: 30 days ago' },
          { name: 'end_date', type: 'string', required: false, desc: 'ISO 8601 date. Default: now' },
          { name: 'granularity', type: 'string', required: false, desc: '"hourly", "daily" (default), "weekly", "monthly"' },
          { name: 'model', type: 'string', required: false, desc: 'Filter by specific model' },
        ],
        statuses: [
          { code: 200, desc: 'Usage data' },
        ],
        curl: `curl "${BASE_URL}/usage?start_date=2026-03-01&granularity=daily" \\
  -H "Authorization: Bearer sk-your-api-key"`,
        responseExample: `{
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
}`,
      },
    ],
  },
];

const methodColors = {
  GET: '#22c55e',
  POST: '#6c5ce7',
  PUT: '#f59e0b',
  DELETE: '#ef4444',
  PATCH: '#06b6d4',
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="api-copy-btn" onClick={copy} title="Copy">
      {copied ? '✓' : 'Copy'}
    </button>
  );
}

function EndpointCard({ ep }) {
  const [expanded, setExpanded] = useState(false);
  const allParams = [
    ...(ep.pathParams || []).map(p => ({ ...p, location: 'path' })),
    ...(ep.queryParams || []).map(p => ({ ...p, location: 'query' })),
  ];

  return (
    <div className={`api-endpoint ${expanded ? 'expanded' : ''}`} id={ep.path.replace(/[/{}]/g, '-').replace(/^-/, '')}>
      <button className="api-endpoint-header" onClick={() => setExpanded(!expanded)}>
        <div className="api-endpoint-left">
          <span className="api-method-badge" style={{ background: methodColors[ep.method] }}>{ep.method}</span>
          <code className="api-path">{ep.path}</code>
        </div>
        <div className="api-endpoint-right">
          <span className="api-endpoint-summary">{ep.summary}</span>
          <span className={`api-expand-arrow ${expanded ? 'open' : ''}`}>▾</span>
        </div>
      </button>

      {expanded && (
        <div className="api-endpoint-body">
          <p className="api-endpoint-desc">{ep.description}</p>

          {ep.auth && (
            <div className="api-auth-notice">
              <span className="api-auth-icon">🔒</span>
              Requires <code>Authorization: Bearer sk-your-api-key</code> header
            </div>
          )}

          {allParams.length > 0 && (
            <div className="api-section">
              <h4>Parameters</h4>
              <table className="api-params-table">
                <thead>
                  <tr><th>Name</th><th>Type</th><th>In</th><th>Required</th><th>Description</th></tr>
                </thead>
                <tbody>
                  {allParams.map(p => (
                    <tr key={p.name}>
                      <td><code>{p.name}</code></td>
                      <td><code className="api-type">{p.type}</code></td>
                      <td>{p.location}</td>
                      <td>{p.required ? <span className="api-required">Required</span> : 'Optional'}</td>
                      <td>{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {ep.requestBody && (
            <div className="api-section">
              <h4>Request Body <code className="api-type-small">{ep.requestBody.type}</code></h4>
              <table className="api-params-table">
                <thead>
                  <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
                </thead>
                <tbody>
                  {ep.requestBody.fields.map(f => (
                    <tr key={f.name}>
                      <td><code>{f.name}</code></td>
                      <td><code className="api-type">{f.type}</code></td>
                      <td>{f.required ? <span className="api-required">Required</span> : 'Optional'}</td>
                      <td>{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {ep.statuses && (
            <div className="api-section">
              <h4>Response Codes</h4>
              <div className="api-statuses">
                {ep.statuses.map(s => (
                  <div key={s.code} className={`api-status ${s.code < 300 ? 'success' : s.code < 500 ? 'client-error' : 'server-error'}`}>
                    <code>{s.code}</code>
                    <span>{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="api-section">
            <h4>Example Request</h4>
            <div className="api-code-block">
              <div className="api-code-header">
                <span>cURL</span>
                <CopyButton text={ep.curl} />
              </div>
              <pre><code>{ep.curl}</code></pre>
            </div>
          </div>

          {ep.responseExample && (
            <div className="api-section">
              <h4>Example Response</h4>
              <div className="api-code-block response">
                <div className="api-code-header">
                  <span>JSON</span>
                  <CopyButton text={ep.responseExample} />
                </div>
                <pre><code>{ep.responseExample}</code></pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiReference() {
  usePageMeta({
    title: 'API Reference | Slancha',
    description: 'Complete REST API reference for Slancha — endpoints for chat completions, evaluations, fine-tuning, deployments, datasets, routing, webhooks, and usage tracking.',
    keywords: 'Slancha API, REST API, API reference, AI inference API, LLM API, chat completions, fine-tuning API',
  });

  const [search, setSearch] = useState('');
  const [activeResource, setActiveResource] = useState(null);
  const contentRef = useRef(null);

  const filteredEndpoints = search
    ? endpoints.map(r => ({
        ...r,
        endpoints: r.endpoints.filter(e =>
          e.path.toLowerCase().includes(search.toLowerCase()) ||
          e.summary.toLowerCase().includes(search.toLowerCase()) ||
          e.method.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(r => r.endpoints.length > 0)
    : endpoints;

  const scrollToResource = (id) => {
    setActiveResource(id);
    const el = document.getElementById(`resource-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveResource(entry.target.id.replace('resource-', ''));
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );
    document.querySelectorAll('.api-resource-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const totalEndpoints = endpoints.reduce((sum, r) => sum + r.endpoints.length, 0);

  return (
    <div className="api-ref">
      <Nav />
      <div className="api-ref-layout">
        <aside className="api-sidebar">
          <div className="api-sidebar-header">
            <h3>API Reference</h3>
            <span className="api-version-badge">v1</span>
          </div>
          <div className="api-sidebar-search">
            <input
              type="text"
              placeholder="Filter endpoints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="api-sidebar-info">
            <code className="api-base-url">api.slancha.ai/v1</code>
            <span className="api-endpoint-count">{totalEndpoints} endpoints</span>
          </div>
          <nav className="api-sidebar-nav">
            {filteredEndpoints.map(r => (
              <div key={r.id} className="api-nav-group">
                <button
                  className={`api-nav-resource ${activeResource === r.id ? 'active' : ''}`}
                  onClick={() => scrollToResource(r.id)}
                >
                  {r.resource}
                  <span className="api-nav-count">{r.endpoints.length}</span>
                </button>
                <div className="api-nav-endpoints">
                  {r.endpoints.map(e => (
                    <button
                      key={e.path + e.method}
                      className="api-nav-endpoint"
                      onClick={() => {
                        const id = e.path.replace(/[/{}]/g, '-').replace(/^-/, '');
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span className="api-nav-method" style={{ color: methodColors[e.method] }}>{e.method}</span>
                      <span className="api-nav-path">{e.path.split('/').pop().replace('{', ':').replace('}', '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="api-sidebar-links">
            <Link to="/developers/sdk">SDK Reference</Link>
            <Link to="/docs/api-reference">Quickstart Guide</Link>
            <Link to="/playground">API Playground</Link>
          </div>
        </aside>

        <main className="api-content" ref={contentRef}>
          <div className="api-hero">
            <h1>REST API Reference</h1>
            <p>
              Complete HTTP API for Slancha's AI inference platform. OpenAI-compatible chat completions
              endpoint plus evaluations, fine-tuning, routing, and more.
            </p>
            <div className="api-hero-details">
              <div className="api-hero-item">
                <span className="api-hero-label">Base URL</span>
                <code>https://api.slancha.ai/v1</code>
              </div>
              <div className="api-hero-item">
                <span className="api-hero-label">Auth</span>
                <code>Authorization: Bearer sk-...</code>
              </div>
              <div className="api-hero-item">
                <span className="api-hero-label">Format</span>
                <code>application/json</code>
              </div>
            </div>
          </div>

          <section className="api-auth-section">
            <h2>Authentication</h2>
            <p>
              All API requests require a Bearer token in the <code>Authorization</code> header.
              Create API keys from your <Link to="/dashboard">Dashboard</Link>.
            </p>
            <div className="api-code-block">
              <div className="api-code-header"><span>Header</span></div>
              <pre><code>Authorization: Bearer sk-your-api-key</code></pre>
            </div>
            <p className="api-auth-note">
              API keys have two types: <strong>Live</strong> (production, rate-limited by plan) and <strong>Test</strong> (sandbox, free, lower limits).
              Keys beginning with <code>sk-live-</code> are production keys; <code>sk-test-</code> are sandbox.
            </p>
          </section>

          <section className="api-errors-section">
            <h2>Error Handling</h2>
            <p>Errors return a consistent JSON structure with a human-readable message and machine-readable code:</p>
            <div className="api-code-block">
              <div className="api-code-header"><span>Error Response</span></div>
              <pre><code>{`{
  "error": {
    "type": "rate_limit_exceeded",
    "message": "You've exceeded 1000 requests/min. Upgrade your plan or retry after 3 seconds.",
    "code": 429,
    "retry_after": 3
  }
}`}</code></pre>
            </div>
            <div className="api-error-codes">
              <div className="api-error-code"><code>400</code> Bad Request — invalid parameters</div>
              <div className="api-error-code"><code>401</code> Unauthorized — invalid or missing API key</div>
              <div className="api-error-code"><code>402</code> Payment Required — plan quota exceeded</div>
              <div className="api-error-code"><code>404</code> Not Found — resource doesn't exist</div>
              <div className="api-error-code"><code>429</code> Rate Limited — check <code>Retry-After</code> header</div>
              <div className="api-error-code"><code>500</code> Server Error — retry with exponential backoff</div>
            </div>
          </section>

          <section className="api-rate-section">
            <h2>Rate Limits</h2>
            <table className="api-rate-table">
              <thead><tr><th>Plan</th><th>Requests/min</th><th>Tokens/min</th><th>Concurrent</th></tr></thead>
              <tbody>
                <tr><td>Free</td><td>60</td><td>40,000</td><td>5</td></tr>
                <tr><td>Starter ($99/mo)</td><td>500</td><td>200,000</td><td>20</td></tr>
                <tr><td>Growth ($299/mo)</td><td>2,000</td><td>1,000,000</td><td>50</td></tr>
                <tr><td>Enterprise</td><td>Custom</td><td>Custom</td><td>Custom</td></tr>
              </tbody>
            </table>
            <p className="api-rate-note">Rate limit headers are included in every response: <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>.</p>
          </section>

          {filteredEndpoints.map(resource => (
            <section key={resource.id} className="api-resource-section" id={`resource-${resource.id}`}>
              <div className="api-resource-header">
                <h2>{resource.resource}</h2>
                <p>{resource.description}</p>
              </div>
              {resource.endpoints.map(ep => (
                <EndpointCard key={ep.path + ep.method} ep={ep} />
              ))}
            </section>
          ))}

          <section className="api-openai-section">
            <h2>OpenAI Compatibility</h2>
            <p>
              Slancha's <code>/v1/chat/completions</code> endpoint is fully OpenAI-compatible.
              Point any OpenAI SDK at Slancha by changing the base URL:
            </p>
            <div className="api-code-block">
              <div className="api-code-header"><span>Python — Drop-in replacement</span></div>
              <pre><code>{`from openai import OpenAI

# Just change base_url and api_key
client = OpenAI(
    base_url="https://api.slancha.ai/v1",
    api_key="sk-your-slancha-key"
)

response = client.chat.completions.create(
    model="auto",  # Slancha routes automatically
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`}</code></pre>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

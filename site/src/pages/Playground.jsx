import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import { useUsageTracking } from '../hooks/useUsageTracking';
import './Playground.css';

const ENDPOINTS = [
  {
    id: 'route',
    label: 'Route',
    method: 'POST',
    path: '/v1/chat/completions',
    description: 'Send a prompt through the Slancha Router. It automatically selects the best model based on complexity, cost ceiling, and latency requirements — no config needed.',
    request: JSON.stringify({
      model: "slancha-router",
      messages: [
        { role: "system", content: "You are a helpful coding assistant." },
        { role: "user", content: "Write a Python function to merge two sorted arrays in O(n) time." }
      ],
      max_tokens: 512,
      routing: {
        strategy: "cost-optimized",
        max_cost_per_token: 0.002,
        fallback: "gpt-4o-mini"
      }
    }, null, 2),
    response: JSON.stringify({
      id: "chatcmpl-sla_8x7kQ2mN",
      object: "chat.completion",
      model: "deepseek-v3",
      routed_by: "slancha-router",
      routing_reason: "complexity:medium, cost_ceiling:$0.002/tok → deepseek-v3 (93% cost savings vs gpt-4o)",
      usage: { prompt_tokens: 42, completion_tokens: 187, total_tokens: 229, cost: "$0.00012" },
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: "def merge_sorted(a, b):\n    result = []\n    i = j = 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            result.append(a[i])\n            i += 1\n        else:\n            result.append(b[j])\n            j += 1\n    result.extend(a[i:])\n    result.extend(b[j:])\n    return result"
        },
        finish_reason: "stop"
      }]
    }, null, 2),
    latency: 1200
  },
  {
    id: 'eval',
    label: 'Create Eval',
    method: 'POST',
    path: '/v1/evaluations',
    description: 'Create an evaluation run that benchmarks a model against your dataset. Results include per-sample scores, aggregate metrics, and pass/fail against your thresholds.',
    request: JSON.stringify({
      name: "gpt-4o-coding-eval-v3",
      model: "gpt-4o",
      dataset_id: "ds_coding_challenges_500",
      metrics: ["pass@1", "code_correctness", "latency_p95"],
      thresholds: {
        "pass@1": 0.85,
        "code_correctness": 0.90,
        "latency_p95": 2000
      },
      samples: 500,
      parallel: 10
    }, null, 2),
    response: JSON.stringify({
      id: "eval_9xKm2nP4",
      status: "completed",
      model: "gpt-4o",
      dataset: "ds_coding_challenges_500",
      duration_seconds: 47,
      results: {
        "pass@1": { score: 0.892, threshold: 0.85, passed: true },
        "code_correctness": { score: 0.934, threshold: 0.90, passed: true },
        "latency_p95": { score: 1847, threshold: 2000, passed: true }
      },
      verdict: "PASS",
      promoted: false,
      promote_url: "/v1/evaluations/eval_9xKm2nP4/promote",
      samples_url: "/v1/evaluations/eval_9xKm2nP4/samples"
    }, null, 2),
    latency: 800
  },
  {
    id: 'deploy',
    label: 'Deploy Model',
    method: 'POST',
    path: '/v1/deployments',
    description: 'Deploy a model to production with auto-scaling, health checks, and traffic splitting. Slancha manages the infrastructure — you just specify the config.',
    request: JSON.stringify({
      name: "coding-assistant-prod",
      model: "ft:gpt-4o:slancha:coding-v3",
      from_evaluation: "eval_9xKm2nP4",
      config: {
        min_replicas: 2,
        max_replicas: 8,
        target_latency_ms: 500,
        gpu_type: "A100",
        region: "us-east-1"
      },
      traffic: {
        canary_percent: 10,
        promote_after: "1h",
        rollback_on: { error_rate: 0.05, latency_p99: 3000 }
      }
    }, null, 2),
    response: JSON.stringify({
      id: "deploy_Km8nQ2x4",
      status: "active",
      name: "coding-assistant-prod",
      model: "ft:gpt-4o:slancha:coding-v3",
      endpoint: "https://api.slancha.com/v1/serve/coding-assistant-prod",
      replicas: { current: 2, min: 2, max: 8 },
      traffic: { canary_percent: 10, production_percent: 90 },
      health: { status: "healthy", uptime: "99.97%", requests_per_minute: 0 },
      created_at: "2026-03-30T14:22:00Z"
    }, null, 2),
    latency: 1500
  },
  {
    id: 'finetune',
    label: 'Fine-Tune',
    method: 'POST',
    path: '/v1/fine-tuning/jobs',
    description: 'Start a fine-tuning job using eval failures as training data. Slancha auto-generates training pairs from failed samples and mixes them with your existing data.',
    request: JSON.stringify({
      base_model: "gpt-4o",
      training_data: {
        source: "eval_failures",
        evaluation_id: "eval_9xKm2nP4",
        mix_ratio: 0.3,
        augment: true
      },
      hyperparameters: {
        epochs: 3,
        learning_rate: 1e-5,
        batch_size: 8
      },
      auto_eval: true,
      auto_promote: {
        enabled: true,
        threshold: { "pass@1": 0.90, "code_correctness": 0.95 }
      }
    }, null, 2),
    response: JSON.stringify({
      id: "ft_job_Qx4nM8k2",
      status: "succeeded",
      base_model: "gpt-4o",
      fine_tuned_model: "ft:gpt-4o:slancha:coding-v3",
      training_samples: 847,
      duration_minutes: 23,
      metrics: {
        training_loss: 0.0342,
        validation_loss: 0.0451,
        improvement_vs_base: "+6.2% pass@1"
      },
      auto_eval_result: {
        evaluation_id: "eval_auto_Px9nK3",
        verdict: "PASS",
        promoted: true,
        deployment_id: "deploy_Km8nQ2x4"
      }
    }, null, 2),
    latency: 1000
  },
  {
    id: 'dataset',
    label: 'Upload Dataset',
    method: 'POST',
    path: '/v1/datasets',
    description: 'Upload evaluation datasets in JSONL format. Slancha validates schema, deduplicates, and indexes for fast retrieval during eval runs.',
    request: JSON.stringify({
      name: "coding_challenges_500",
      format: "jsonl",
      schema: {
        input: "string",
        expected_output: "string",
        metadata: { difficulty: "string", language: "string" }
      },
      file: "coding_challenges_500.jsonl",
      tags: ["coding", "python", "evaluation", "v2"]
    }, null, 2),
    response: JSON.stringify({
      id: "ds_coding_challenges_500",
      name: "coding_challenges_500",
      samples: 500,
      size_bytes: 284672,
      schema_valid: true,
      duplicates_removed: 3,
      tags: ["coding", "python", "evaluation", "v2"],
      created_at: "2026-03-30T10:15:00Z"
    }, null, 2),
    latency: 600
  }
];

function syntaxHighlight(json) {
  return json.replace(
    /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")\s*:/g,
    '<span class="json-key">$1</span>:'
  ).replace(
    /:\s*("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")/g,
    ': <span class="json-string">$1</span>'
  ).replace(
    /:\s*(-?\d+\.?\d*(?:e[+-]?\d+)?)/gi,
    ': <span class="json-number">$1</span>'
  ).replace(
    /:\s*(true|false)/g,
    ': <span class="json-bool">$1</span>'
  ).replace(
    /:\s*(null)/g,
    ': <span class="json-null">$1</span>'
  );
}

export default function Playground() {
  usePageMeta({
    title: 'API Playground — Slancha',
    description: 'Try the Slancha API interactively. Explore endpoints for routing, evaluation, deployment, fine-tuning, and datasets with live request/response demos.'
  });

  const [activeTab, setActiveTab] = useState('route');
  const [running, setRunning] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [typedResponse, setTypedResponse] = useState('');
  const [typing, setTyping] = useState(false);
  const typingRef = useRef(null);
  const { trackUsage } = useUsageTracking();

  const endpoint = ENDPOINTS.find(e => e.id === activeTab);

  const handleRun = useCallback(() => {
    if (running) return;
    setRunning(true);
    setShowResponse(false);
    setTypedResponse('');
    setTyping(false);

    if (typingRef.current) clearTimeout(typingRef.current);

    const startTime = Date.now();

    // Simulate network delay then type out response
    setTimeout(() => {
      setShowResponse(true);
      setTyping(true);
      const fullText = endpoint.response;
      let i = 0;
      const chunkSize = 8;

      // Track this playground request (fire-and-forget)
      const responseObj = JSON.parse(endpoint.response);
      const usage = responseObj.usage || {};
      trackUsage({
        endpoint: endpoint.path,
        model: responseObj.model || endpoint.id,
        tokensIn: usage.prompt_tokens || 0,
        tokensOut: usage.completion_tokens || 0,
        latencyMs: Date.now() - startTime,
        statusCode: 200,
      });

      function typeNext() {
        if (i < fullText.length) {
          i = Math.min(i + chunkSize, fullText.length);
          setTypedResponse(fullText.slice(0, i));
          typingRef.current = setTimeout(typeNext, 12);
        } else {
          setTyping(false);
          setRunning(false);
        }
      }
      typeNext();
    }, endpoint.latency);
  }, [running, endpoint, trackUsage]);

  const handleTabChange = (id) => {
    if (typingRef.current) clearTimeout(typingRef.current);
    setActiveTab(id);
    setRunning(false);
    setShowResponse(false);
    setTypedResponse('');
    setTyping(false);
  };

  return (
    <div className="page">
      <Nav />
      <main id="main-content" className="playground-page">
        <div className="playground-header">
          <h1>API Playground</h1>
          <p>
            Explore the Slancha API. Pick an endpoint, hit Run, and see exactly what you get back.
          </p>
        </div>

        <div className="playground-tabs">
          {ENDPOINTS.map(ep => (
            <button
              key={ep.id}
              className={`playground-tab${activeTab === ep.id ? ' active' : ''}`}
              onClick={() => handleTabChange(ep.id)}
            >
              <span className={`tab-method ${ep.method.toLowerCase()}`}>{ep.method}</span>
              {ep.label}
            </button>
          ))}
        </div>

        <div className="playground-description">
          {endpoint.description}
        </div>

        <div className="playground-run-bar">
          <div className="endpoint-url">
            <span className={`endpoint-method ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
            <span className="endpoint-path">https://api.slancha.com{endpoint.path}</span>
          </div>
          <button
            className={`btn-run${running ? ' running' : ''}`}
            onClick={handleRun}
            disabled={running}
          >
            {running ? 'Running...' : 'Run'}
          </button>
        </div>

        <div className="playground-endpoint">
          <div className="playground-panel">
            <div className="panel-header">
              <span className="panel-title">Request</span>
              <span className="panel-badge request">JSON</span>
            </div>
            <div className="panel-code">
              <pre dangerouslySetInnerHTML={{ __html: syntaxHighlight(endpoint.request) }} />
            </div>
          </div>

          <div className="playground-panel">
            <div className="panel-header">
              <span className="panel-title">Response</span>
              <span className={`panel-badge ${showResponse ? 'response' : 'request'}`}>
                {showResponse ? '200 OK' : 'Waiting...'}
              </span>
            </div>
            <div className="panel-code">
              {showResponse ? (
                <pre className={typing ? 'response-typing' : ''}>
                  <span dangerouslySetInnerHTML={{ __html: syntaxHighlight(typedResponse) }} />
                  {typing && <span className="cursor" />}
                </pre>
              ) : (
                <pre style={{ color: 'var(--text-secondary, #94a3b8)' }}>
                  {'// Click "Run" to see the response'}
                </pre>
              )}
            </div>
          </div>
        </div>

        <div className="playground-info">
          <p>
            This is a demo playground. Sign up for free to get your API key and start making real requests.
          </p>
          <div className="playground-cta-row">
            <Link to="/signup" className="btn-cta-primary">Get Your API Key</Link>
            <Link to="/docs/api-reference" className="btn-cta-secondary">Full API Reference</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React, { useState } from 'react';
import { generateMinikubeBundle } from '../../utils/generateMinikubeBundle';

const STEPS = [
  { title: 'Start Minikube', cmd: 'minikube start --cpus=4 --memory=8g', desc: 'Launch a local Kubernetes cluster with enough resources for vLLM.' },
  { title: 'Configure API Keys', cmd: 'cp .env.template .env && nano .env', desc: 'Copy the template and fill in your actual API keys.' },
  { title: 'Create Secrets', cmd: 'kubectl create secret generic slancha-router-secrets --from-env-file=.env', desc: 'Load your API keys as Kubernetes secrets.' },
  { title: 'Deploy Config', cmd: 'kubectl apply -f k8s/', desc: 'Apply the ConfigMap, Deployment, and Service manifests.' },
  { title: 'Install vLLM Stack (optional)', cmd: 'helm repo add vllm https://vllm-project.github.io/production-stack && helm install vllm-stack vllm/vllm-stack -f values.yaml', desc: 'Deploy the vLLM production stack with Helm.' },
  { title: 'Port-forward & Test', cmd: 'kubectl port-forward svc/slancha-router 8080:8080 && bash test.sh', desc: 'Forward the router port and run the test script.' },
];

export default function MinikubeGuide({ yaml, providers }) {
  const [expanded, setExpanded] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await generateMinikubeBundle({ yaml, providers });
    } catch (err) {
      if (import.meta.env.DEV) console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="dash-minikube-guide">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Local Testing with Minikube</h2>
          <p className="dash-section-desc">Deploy your Semantic Router configuration to a local Kubernetes cluster.</p>
        </div>
        <button className="dash-btn-sm dash-btn-primary" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Generating...' : 'Export Minikube Bundle'}
        </button>
      </div>

      <button
        className="dash-btn-sm"
        onClick={() => setExpanded(!expanded)}
        style={{ marginBottom: 16 }}
      >
        {expanded ? 'Hide' : 'Show'} Step-by-Step Guide
      </button>

      {expanded && (
        <div className="dash-minikube-steps">
          {STEPS.map((step, i) => (
            <div key={i} className="dash-minikube-step">
              <div className="dash-minikube-step-num">{i + 1}</div>
              <div className="dash-minikube-step-content">
                <h4 className="dash-minikube-step-title">{step.title}</h4>
                <p className="dash-minikube-step-desc">{step.desc}</p>
                <pre className="dash-minikube-step-cmd"><code>{step.cmd}</code></pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './Integrations.css';

const categories = [
  {
    title: 'Model Providers',
    icon: '\u2731',
    integrations: [
      { name: 'OpenAI', desc: 'GPT-4o, o3, and all chat/completion models', badge: 'native' },
      { name: 'Anthropic', desc: 'Claude 4.5 Sonnet, Opus, and Haiku models', badge: 'native' },
      { name: 'Meta Llama', desc: 'Llama 4 Scout, Maverick, and custom fine-tunes', badge: 'native' },
      { name: 'Mistral', desc: 'Mistral Large, Medium, and open-weight models', badge: 'native' },
      { name: 'Google Gemini', desc: 'Gemini 2.5 Pro, Flash, and embedding models', badge: 'native' },
      { name: 'Cohere', desc: 'Command R+, Embed, and Rerank models', badge: 'sdk' },
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    icon: '\u2601',
    integrations: [
      { name: 'AWS', desc: 'SageMaker, Bedrock, Lambda, S3 for model artifacts', badge: 'native' },
      { name: 'Google Cloud', desc: 'Vertex AI, GKE, Cloud Run, GCS storage', badge: 'native' },
      { name: 'Microsoft Azure', desc: 'Azure OpenAI, AKS, Azure ML, Blob Storage', badge: 'native' },
      { name: 'Docker', desc: 'Containerized deployments with pre-built images', badge: 'native' },
      { name: 'Kubernetes', desc: 'Helm charts for self-hosted inference clusters', badge: 'sdk' },
      { name: 'Terraform', desc: 'IaC modules for automated infrastructure setup', badge: 'sdk' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    icon: '\u2699',
    integrations: [
      { name: 'LangChain', desc: 'Drop-in evaluator and deployment callbacks', badge: 'native' },
      { name: 'LlamaIndex', desc: 'RAG pipeline evaluation and index deployment', badge: 'native' },
      { name: 'Hugging Face', desc: 'Hub model imports, Transformers eval harness', badge: 'sdk' },
      { name: 'vLLM', desc: 'High-throughput inference engine integration', badge: 'compatible' },
      { name: 'TensorRT-LLM', desc: 'NVIDIA optimized inference backend support', badge: 'compatible' },
      { name: 'OpenAI SDK', desc: 'Compatible API — swap your base URL, done', badge: 'native' },
    ],
  },
  {
    title: 'Data & Observability',
    icon: '\u2261',
    integrations: [
      { name: 'Weights & Biases', desc: 'Sync eval runs, metrics, and model lineage', badge: 'native' },
      { name: 'MLflow', desc: 'Import experiments, export deployment artifacts', badge: 'sdk' },
      { name: 'Datadog', desc: 'Forward inference metrics and deployment events', badge: 'webhook' },
      { name: 'Grafana', desc: 'Pre-built dashboards for model performance', badge: 'webhook' },
      { name: 'Snowflake', desc: 'Query eval results and usage data directly', badge: 'sdk' },
      { name: 'BigQuery', desc: 'Export eval datasets and production logs', badge: 'sdk' },
    ],
  },
  {
    title: 'CI/CD & DevOps',
    icon: '\u2192',
    integrations: [
      { name: 'GitHub Actions', desc: 'Run evals on every PR, gate merges on quality', badge: 'native' },
      { name: 'GitLab CI', desc: 'Pipeline integration with eval quality gates', badge: 'sdk' },
      { name: 'Jenkins', desc: 'Plugin for eval-gated model promotion', badge: 'sdk' },
      { name: 'Argo Workflows', desc: 'Orchestrate training-eval-deploy pipelines', badge: 'compatible' },
    ],
  },
  {
    title: 'Communication & Alerts',
    icon: '\u2709',
    integrations: [
      { name: 'Slack', desc: 'Deployment notifications, eval alerts, approvals', badge: 'native' },
      { name: 'PagerDuty', desc: 'Alert on model degradation or failed deployments', badge: 'webhook' },
      { name: 'Webhooks', desc: 'Custom HTTP callbacks for any event in Slancha', badge: 'native' },
    ],
  },
];

const badgeLabels = { native: 'Native', sdk: 'SDK', compatible: 'Compatible', webhook: 'Webhook' };

export default function Integrations() {
  return (
    <div className="page">
      <Nav />
      <main>
        <div className="integrations-page">
          <div className="integrations-header">
            <h1>Integrations</h1>
            <p>
              Slancha connects with the tools your team already uses — from model
              providers and cloud platforms to CI/CD and observability.
            </p>
          </div>

          {categories.map((cat) => (
            <div key={cat.title} className="integrations-category">
              <h2>
                <span className="cat-icon">{cat.icon}</span>
                {cat.title}
              </h2>
              <div className="integrations-grid">
                {cat.integrations.map((int) => (
                  <div key={int.name} className="integration-card">
                    <div className="int-name">{int.name}</div>
                    <div className="int-desc">{int.desc}</div>
                    <span className={`int-badge ${int.badge}`}>
                      {badgeLabels[int.badge]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="integrations-cta">
            <h2>Don't see your stack?</h2>
            <p>
              Our REST API and Python/TypeScript SDKs work with any tool.
              Need a custom integration? Let's talk.
            </p>
            <Link to="/docs" className="btn-primary btn-lg">
              View API Docs
            </Link>
            <Link to="/contact" className="btn-secondary btn-lg">
              Request Integration
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

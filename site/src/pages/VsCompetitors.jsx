import usePageMeta from '../hooks/usePageMeta';
import '../components/VsCompetitors.css';

const sections = [
  {
    title: 'Vs. Databricks & Snowflake',
    keyMessage: 'Databricks manages your data. Slancha manages your AI.',
    paragraphs: [
      "Databricks and Snowflake are data platforms that handle ETL, warehouses, and analytics. They're excellent at managing your data infrastructure.",
      "Slancha is the AI engineering platform. We handle model evaluation, deployment, and continuous learning. We're built for AI teams, not data teams.",
      "Most enterprise customers use both: Databricks for data, Slancha for AI. They're complementary, not competing."
    ],
    callout: {
      icon: '💡',
      text: "Most enterprise customers use both: Databricks for data, Slancha for AI. They're complementary, not competing."
    }
  },
  {
    title: 'Vs. Cloud Providers (AWS SageMaker, GCP Vertex, Azure ML)',
    keyMessage: 'Cloud providers give you infrastructure. Slancha gives you an automated loop.',
    paragraphs: [
      'SageMaker, Vertex, and Azure ML give you tools to build your own MLOps pipeline. You still need to build the evaluation, deployment, and post-training manually.',
      "Slancha gives you the finished product. Automated evaluation, one-click deployment, and continuous learning out of the box.",
      'The choice: Build your own loop (6-12 months of engineering) or use Slancha and ship faster.'
    ],
    callout: {
      icon: '⏱️',
      text: 'Build your own MLOps pipeline: 6-12 months vs. Slancha: Hours'
    }
  },
  {
    title: 'Vs. Infrastructure Players (CoreWeave, Lambda, Modal)',
    keyMessage: 'Infrastructure is just the foundation. Slancha builds the house.',
    paragraphs: [
      "CoreWeave, Lambda, and Modal give you GPU access. They're essential infrastructure, but you still need to build the platform on top of it.",
      "Slancha works on any cloud — AWS, GCP, Azure, CoreWeave, Lambda, or your own infrastructure. We're cloud-agnostic; they're cloud-specific.",
      'We provide: The platform to evaluate, deploy, and improve models on that infrastructure.'
    ],
    callout: {
      icon: '☁️',
      text: 'Works on any cloud provider or your own infrastructure'
    }
  },
  {
    title: 'Vs. Framework Managers (Anyscale, Hugging Face)',
    keyMessage: 'Frameworks are tools. Slancha is the platform.',
    paragraphs: [
      "Anyscale manages Ray. Hugging Face manages models. They're excellent tools, but they're framework-specific and don't own the full model lifecycle.",
      "Slancha manages your entire AI engineering workflow — evaluation, deployment, data capture, and post-training.",
      "We support all major frameworks (PyTorch, TensorFlow, Hugging Face, Ray). We're framework-agnostic and work with your existing tools."
    ],
    callout: {
      icon: '🔧',
      text: "Framework-agnostic: Works with PyTorch, TensorFlow, Ray, Hugging Face, and more"
    }
  },
  {
    title: 'Vs. Building In-House',
    keyMessage: 'You could build this. Should you?',
    paragraphs: [
      'Top AI teams spend 6-12 months building automated evaluation, deployment, and post-training pipelines.',
      'Build cost: 10 engineers × 12 months = $12M+ (salaries, infrastructure, opportunity cost)',
      'Slancha cost: $499-$2,499/month (depending on scale)',
      'Break-even: 2-3 months of using Slancha',
      'ROI: 10x more than it costs, starting month one.'
    ],
    callout: null,
    showCostComparison: true
  }
];

const features = [
  { feature: 'Automated Evaluation', slancha: '✅', databricks: '❌', aws: '⚠️', coreweave: '❌', build: '✅' },
  { feature: 'A/B Testing', slancha: '✅', databricks: '❌', aws: '⚠️', coreweave: '❌', build: '✅' },
  { feature: 'One-Click Deploy', slancha: '✅', databricks: '⚠️', aws: '⚠️', coreweave: '❌', build: '✅' },
  { feature: 'Data Capture', slancha: '✅', databricks: '❌', aws: '❌', coreweave: '❌', build: '✅' },
  { feature: 'Auto Post-Training', slancha: '✅', databricks: '❌', aws: '⚠️', coreweave: '❌', build: '✅' },
  { feature: 'Continuous Loop', slancha: '✅', databricks: '❌', aws: '❌', coreweave: '❌', build: '✅' },
  { feature: 'GPU Infrastructure', slancha: '✅', databricks: '⚠️', aws: '✅', coreweave: '✅', build: '✅' },
  { feature: 'Time to Value', slancha: 'Hours', databricks: 'Weeks', aws: 'Months', coreweave: 'Weeks', build: '6-12m' }
];

function ComparisonSection({ title, keyMessage, paragraphs, callout, showCostComparison }) {
  return (
    <div className="comparison-section">
      <h2>{title}</h2>
      <h3 className="key-message">{keyMessage}</h3>
      <div className="comparison-text">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
      {callout && (
        <div className="callout-box">
          <span className="callout-icon">{callout.icon}</span>
          <span className="callout-text">{callout.text}</span>
        </div>
      )}
      {showCostComparison && <CostComparison />}
    </div>
  );
}

function CostComparison() {
  return (
    <div className="cost-comparison">
      <div className="cost-column build">
        <h4>Build In-House</h4>
        <div className="cost-detail">
          <span className="cost-label">Engineers</span>
          <span className="cost-value">10</span>
        </div>
        <div className="cost-detail">
          <span className="cost-label">Timeline</span>
          <span className="cost-value">12 months</span>
        </div>
        <div className="cost-total">
          <span className="cost-label">Total</span>
          <span className="cost-value">$12M+</span>
        </div>
        <div className="cost-year">
          <span className="cost-label">First year</span>
          <span className="cost-value">$12,000,000+</span>
        </div>
      </div>
      <div className="cost-divider" />
      <div className="cost-column slancha">
        <h4>Slancha</h4>
        <div className="cost-detail">
          <span className="cost-label">Monthly</span>
          <span className="cost-value">$499-$2,499</span>
        </div>
        <div className="cost-detail">
          <span className="cost-label">Break-even</span>
          <span className="cost-value">2-3 months</span>
        </div>
        <div className="cost-roi">
          <span className="cost-label">ROI</span>
          <span className="cost-value">10x</span>
        </div>
        <div className="cost-year">
          <span className="cost-label">First year example</span>
          <span className="cost-value">$6,000</span>
        </div>
      </div>
    </div>
  );
}

function FeatureTable() {
  return (
    <div className="feature-table-container">
      <h2>Feature Comparison</h2>
      <div className="feature-table">
        <table>
          <thead>
            <tr>
              <th>Capability</th>
              <th>Slancha</th>
              <th>Databricks</th>
              <th>AWS SageMaker</th>
              <th>CoreWeave</th>
              <th>Build</th>
            </tr>
          </thead>
          <tbody>
            {features.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'zebra' : ''}>
                <td className="feature-name">{row.feature}</td>
                <td className="slancha-col">{row.slancha}</td>
                <td className="databricks-col">{row.databricks}</td>
                <td className="aws-col">{row.aws}</td>
                <td className="coreweave-col">{row.coreweave}</td>
                <td className="build-col">{row.build}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="table-footer">
                Bottom line: Only Slancha owns the complete automated loop. Everything else requires you to build pieces.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default function VsCompetitors() {
  usePageMeta({ title: 'How We Compare', description: 'See how Slancha compares to Databricks, Together AI, Anyscale, Modal, and other platforms. The only tool that closes the eval-deploy-train loop.' });
  return (
    <div className="vs-competitors-page">
      <div className="vs-header">
        <h1>How We Compare</h1>
        <p>See why AI teams choose Slancha</p>
      </div>

      <div className="vs-content">
        {sections.map((section, idx) => (
          <ComparisonSection
            key={idx}
            title={section.title}
            keyMessage={section.keyMessage}
            paragraphs={section.paragraphs}
            callout={section.callout}
            showCostComparison={section.showCostComparison}
          />
        ))}
        <FeatureTable />
      </div>
    </div>
  );
}

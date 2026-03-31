import { Link, useParams, Navigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './VerticalLanding.css';

const verticals = {
  fintech: {
    name: 'Fintech',
    headline: 'AI inference built for financial services',
    subheadline: 'Reduce LLM costs by 60% while meeting SOC 2, PCI-DSS, and regulatory requirements. No ML team required.',
    heroMetrics: [
      { value: '60%', label: 'Cost reduction' },
      { value: '<50ms', label: 'P95 latency' },
      { value: '99.99%', label: 'Uptime SLA' },
      { value: 'SOC 2', label: 'Compliant' },
    ],
    painPoints: [
      {
        title: 'Compliance slows everything down',
        desc: 'Every new model deployment requires security review, compliance approval, and audit trails. Your team spends more time on governance than building features.',
      },
      {
        title: 'Frontier API costs are unpredictable',
        desc: 'You\'re spending $50K–$200K/month on GPT-4 and Claude APIs. Costs scale linearly with transaction volume, and you have no control over pricing.',
      },
      {
        title: 'You can\'t hire ML engineers fast enough',
        desc: 'Building fine-tuning pipelines, model evaluation, and inference optimization in-house requires 3–5 specialized engineers you don\'t have.',
      },
    ],
    useCases: [
      {
        title: 'Fraud detection narratives',
        desc: 'Generate human-readable explanations for flagged transactions. Slancha routes simple alerts to small models and complex cases to fine-tuned specialists — 4x faster, 70% cheaper.',
        icon: '🛡️',
      },
      {
        title: 'Document processing & KYC',
        desc: 'Extract structured data from financial documents, ID verification, and compliance forms. Fine-tuned models trained on your document formats outperform generic OCR+LLM pipelines.',
        icon: '📄',
      },
      {
        title: 'Customer support automation',
        desc: 'Handle account inquiries, transaction disputes, and product questions. Routing sends simple FAQs to fast models while escalating complex regulatory questions to specialized models.',
        icon: '💬',
      },
      {
        title: 'Risk assessment & reporting',
        desc: 'Generate risk summaries, portfolio analysis, and regulatory reports. Task-specific fine-tuned models produce more accurate financial language than frontier generalists.',
        icon: '📊',
      },
    ],
    compliance: [
      { title: 'SOC 2 Type II', desc: 'Annual audit with continuous monitoring' },
      { title: 'PCI-DSS Ready', desc: 'Cardholder data handling compliant' },
      { title: 'Data Residency', desc: 'US, EU, or customer-specified region' },
      { title: 'Encryption', desc: 'AES-256 at rest, TLS 1.3 in transit' },
      { title: 'Audit Trails', desc: 'Full request/response logging with retention controls' },
      { title: 'VPC Deployment', desc: 'Run in your own cloud environment' },
    ],
    caseStudy: {
      title: 'How a digital bank cut inference costs by 62%',
      before: '$127K/month on frontier APIs for fraud narratives, KYC extraction, and customer support',
      after: '$48K/month — router handles 70% of requests with small models, fine-tuned specialists handle the rest',
      timeline: '4 weeks from integration to full optimization',
    },
    metaTitle: 'Slancha for Fintech — AI Inference Platform for Financial Services',
    metaDesc: 'Reduce LLM API costs by 60% while meeting SOC 2 and PCI-DSS requirements. Single API endpoint with automatic model routing, fine-tuning, and optimization.',
  },
  healthtech: {
    name: 'Healthtech',
    headline: 'AI inference designed for healthcare',
    subheadline: 'HIPAA-ready AI inference that improves accuracy on clinical tasks while cutting costs. Zero ML infrastructure to manage.',
    heroMetrics: [
      { value: '55%', label: 'Cost reduction' },
      { value: 'HIPAA', label: 'Ready (BAA available)' },
      { value: '3x', label: 'Faster processing' },
      { value: '0', label: 'PHI exposure risk' },
    ],
    painPoints: [
      {
        title: 'HIPAA makes model adoption slow',
        desc: 'Every LLM provider needs a BAA. Every deployment needs a privacy impact assessment. Your legal team reviews each model change, adding weeks to every update.',
      },
      {
        title: 'Clinical accuracy can\'t be compromised',
        desc: 'Generic frontier models hallucinate on medical terminology, drug interactions, and clinical protocols. You need models that understand your domain — but fine-tuning in-house requires an ML team.',
      },
      {
        title: 'Data sensitivity limits your options',
        desc: 'Patient data can\'t be sent to every API provider. You need inference that runs in a controlled environment with audit trails and data residency guarantees.',
      },
    ],
    useCases: [
      {
        title: 'Clinical note summarization',
        desc: 'Summarize patient encounters, discharge notes, and referral letters. Fine-tuned models trained on clinical language outperform general-purpose LLMs on medical terminology accuracy.',
        icon: '🏥',
      },
      {
        title: 'Prior authorization automation',
        desc: 'Generate prior auth requests from clinical documentation. Routing sends routine requests to fast models while complex multi-condition cases go to specialized models.',
        icon: '📋',
      },
      {
        title: 'Medical coding assistance',
        desc: 'Suggest ICD-10, CPT, and HCPCS codes from clinical notes. Task-specific fine-tuning dramatically improves coding accuracy vs. generic LLMs.',
        icon: '🔢',
      },
      {
        title: 'Patient communication',
        desc: 'Generate patient-friendly explanations of diagnoses, treatment plans, and medication instructions. Routing ensures appropriate reading levels and medical accuracy.',
        icon: '💊',
      },
    ],
    compliance: [
      { title: 'HIPAA Compliant', desc: 'BAA available, PHI handling safeguards' },
      { title: 'SOC 2 Type II', desc: 'Annual audit with continuous monitoring' },
      { title: 'Data Isolation', desc: 'Dedicated compute, no data sharing' },
      { title: 'Encryption', desc: 'AES-256 at rest, TLS 1.3 in transit' },
      { title: 'Audit Logging', desc: 'Complete access and usage audit trails' },
      { title: 'On-Premises Option', desc: 'Air-gapped deployment for sensitive environments' },
    ],
    caseStudy: {
      title: 'How a telehealth platform improved clinical accuracy by 23%',
      before: 'GPT-4 generating clinical summaries with 12% terminology error rate, $89K/month API spend',
      after: 'Fine-tuned models achieving 2.8% error rate, $40K/month — 55% cost savings with better quality',
      timeline: '6 weeks from integration to fine-tuned model deployment',
    },
    metaTitle: 'Slancha for Healthtech — HIPAA-Ready AI Inference Platform',
    metaDesc: 'HIPAA-compliant AI inference with automatic model routing and fine-tuning for clinical tasks. Improve accuracy on medical terminology while cutting LLM costs by 55%.',
  },
  ecommerce: {
    name: 'E-Commerce',
    headline: 'AI inference that scales with your catalog',
    subheadline: 'Handle millions of product descriptions, recommendations, and customer interactions at a fraction of frontier API costs.',
    heroMetrics: [
      { value: '65%', label: 'Cost reduction' },
      { value: '10M+', label: 'Requests/day' },
      { value: '<100ms', label: 'Response time' },
      { value: '0', label: 'Infrastructure to manage' },
    ],
    painPoints: [
      {
        title: 'API costs scale with your catalog',
        desc: 'Product descriptions, search enhancement, and personalization across 100K+ SKUs means millions of API calls. At frontier pricing, this eats your margin.',
      },
      {
        title: 'Generic models don\'t know your products',
        desc: 'GPT-4 doesn\'t understand your brand voice, product taxonomy, or customer personas. You need domain-specific models but can\'t justify an ML team for content generation.',
      },
      {
        title: 'Seasonal spikes break your budget',
        desc: 'Black Friday, Prime Day, and holiday surges 5–10x your normal API volume. Per-token pricing means your AI costs spike exactly when your margins are tightest.',
      },
    ],
    useCases: [
      {
        title: 'Product description generation',
        desc: 'Generate SEO-optimized product descriptions at scale. Fine-tuned models learn your brand voice and product taxonomy — consistent tone across millions of SKUs.',
        icon: '🛍️',
      },
      {
        title: 'Search & recommendation',
        desc: 'Enhance product search with natural language understanding. Route simple keyword queries to fast models and complex "help me find" queries to specialized models.',
        icon: '🔍',
      },
      {
        title: 'Customer support at scale',
        desc: 'Handle order status, returns, product questions, and size/fit recommendations. Routing automatically escalates complex issues while handling routine queries instantly.',
        icon: '🎧',
      },
      {
        title: 'Review summarization & insights',
        desc: 'Aggregate customer reviews into product insights, sentiment analysis, and feature highlights. Process millions of reviews with optimized small models.',
        icon: '⭐',
      },
    ],
    compliance: [
      { title: 'SOC 2 Type II', desc: 'Annual audit with continuous monitoring' },
      { title: 'GDPR Ready', desc: 'EU data handling compliant' },
      { title: 'Auto-Scaling', desc: 'Handle 10x traffic spikes automatically' },
      { title: 'Multi-Region', desc: 'Deploy close to your customers globally' },
      { title: '99.99% Uptime', desc: 'Enterprise SLA with credits' },
      { title: 'API Compatible', desc: 'Drop-in OpenAI API replacement' },
    ],
    caseStudy: {
      title: 'How a marketplace cut content generation costs by 68%',
      before: '$210K/month generating descriptions for 2M+ products with GPT-4, 3-second average response time',
      after: '$67K/month with fine-tuned models, 200ms average response — brand-consistent descriptions at scale',
      timeline: '3 weeks from integration to optimized model serving',
    },
    metaTitle: 'Slancha for E-Commerce — AI Inference at Catalog Scale',
    metaDesc: 'Generate product descriptions, power search, and automate support across millions of SKUs. Cut LLM costs by 65% with automatic model routing and fine-tuning.',
  },
};

const otherVerticals = {
  fintech: ['healthtech', 'ecommerce'],
  healthtech: ['fintech', 'ecommerce'],
  ecommerce: ['fintech', 'healthtech'],
};

export default function VerticalLanding() {
  const { vertical } = useParams();
  const data = verticals[vertical];

  usePageMeta(
    data ? data.metaTitle : 'Slancha — Industry Solutions',
    data ? data.metaDesc : 'AI inference optimized for your industry.'
  );

  if (!data) return <Navigate to="/use-cases" replace />;

  const others = otherVerticals[vertical].map(k => ({ slug: k, ...verticals[k] }));

  return (
    <>
      <Nav />
      <main className="vertical-page">
        {/* Hero */}
        <section className="vertical-hero">
          <span className="vertical-badge">{data.name}</span>
          <h1>{data.headline}</h1>
          <p className="vertical-sub">{data.subheadline}</p>
          <div className="vertical-hero-metrics">
            {data.heroMetrics.map(m => (
              <div key={m.label} className="vertical-hero-metric">
                <span className="vhm-value">{m.value}</span>
                <span className="vhm-label">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="vertical-hero-cta">
            <Link to="/signup" className="btn-primary">Start Free</Link>
            <Link to="/demo" className="btn-secondary">See Demo</Link>
          </div>
        </section>

        {/* Pain Points */}
        <section className="vertical-section">
          <h2 className="vertical-section-title">The challenges you're facing</h2>
          <div className="vertical-pains">
            {data.painPoints.map((p, i) => (
              <div key={i} className="vertical-pain-card">
                <div className="pain-number">{i + 1}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How Slancha Solves It */}
        <section className="vertical-section">
          <h2 className="vertical-section-title">How Slancha solves it</h2>
          <p className="vertical-section-desc">
            One API endpoint. Behind it, Slancha automatically routes requests to the right model,
            fine-tunes task-specific models on your usage data, optimizes inference, and continuously
            redeploys improved models.
          </p>
          <div className="vertical-pipeline">
            {['Route', 'Analyze', 'Fine-Tune', 'Optimize'].map((step, i) => (
              <div key={step} className="pipeline-step">
                <div className="pipeline-number">{i + 1}</div>
                <span>{step}</span>
                {i < 3 && <span className="pipeline-arrow">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="vertical-section">
          <h2 className="vertical-section-title">{data.name} use cases</h2>
          <div className="vertical-usecases">
            {data.useCases.map((uc, i) => (
              <div key={i} className="vertical-uc-card">
                <span className="uc-icon">{uc.icon}</span>
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Case Study */}
        <section className="vertical-section">
          <div className="vertical-case-study">
            <h2>{data.caseStudy.title}</h2>
            <div className="case-comparison">
              <div className="case-before">
                <span className="case-label">Before Slancha</span>
                <p>{data.caseStudy.before}</p>
              </div>
              <div className="case-arrow">→</div>
              <div className="case-after">
                <span className="case-label">After Slancha</span>
                <p>{data.caseStudy.after}</p>
              </div>
            </div>
            <p className="case-timeline">{data.caseStudy.timeline}</p>
          </div>
        </section>

        {/* Compliance */}
        <section className="vertical-section">
          <h2 className="vertical-section-title">Security & compliance</h2>
          <div className="vertical-compliance">
            {data.compliance.map((c, i) => (
              <div key={i} className="compliance-item">
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section className="vertical-section">
          <h2 className="vertical-section-title">Integration in 3 lines</h2>
          <div className="vertical-code">
            <pre><code>{`import slancha

client = slancha.Client(api_key="sk-...")
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Your ${data.name.toLowerCase()} prompt here"}]
)
# Slancha automatically routes, optimizes, and improves over time`}</code></pre>
          </div>
        </section>

        {/* CTA */}
        <section className="vertical-cta">
          <h2>Ready to optimize your {data.name.toLowerCase()} AI inference?</h2>
          <p>Start free — no credit card required. See cost savings within the first week.</p>
          <div className="vertical-cta-buttons">
            <Link to="/signup" className="btn-primary">Get Started Free</Link>
            <Link to="/contact" className="btn-secondary">Talk to Sales</Link>
            <Link to="/roi-calculator" className="btn-ghost">Calculate Your Savings</Link>
          </div>
        </section>

        {/* Other Verticals */}
        <section className="vertical-section vertical-others">
          <h2 className="vertical-section-title">Explore other industries</h2>
          <div className="vertical-other-cards">
            {others.map(o => (
              <Link key={o.slug} to={`/solutions/${o.slug}`} className="vertical-other-card">
                <h3>{o.name}</h3>
                <p>{o.headline}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

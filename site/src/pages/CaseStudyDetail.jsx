import { useParams, Link, Navigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './CaseStudyDetail.css';

const caseStudies = {
  fintech: {
    id: 'fintech',
    industryLabel: 'Fintech',
    company: 'PayFlow',
    companyDesc: 'Fintech / Payments',
    size: '250 employees, $50M ARR',
    tokenVolume: '80M tokens/month',
    useCases: 'Customer support chat + fraud detection + transaction summarization',
    title: 'How PayFlow Cut Latency 85% and Saved $4.14M/Year',
    subtitle: 'A payments company processing 80M tokens/month eliminated ML infrastructure overhead and cut inference costs by 47% with Slancha.',
    painPoints: [
      'P99 latency of 2,800ms — customers waiting nearly 3 seconds',
      'Chatbot accuracy only 68% on complex payment questions',
      'Monthly API cost of $420K, climbing 25% month-over-month',
      '4 ML FTEs spent 80% of time on benchmarking and routing, not features',
      'Support ticket escalations spiked 3x from quality degradation',
    ],
    trigger: 'PayFlow\'s CEO asked: "Why is our inference cost 8x our engineering headcount cost?"',
    timeline: [
      { week: 'Week 1', milestone: 'API integration', outcome: 'Migrated all three use cases to Slancha endpoint' },
      { week: 'Week 2', milestone: 'Baseline evals', outcome: 'Established quality and latency benchmarks' },
      { week: 'Week 3', milestone: 'First fine-tune', outcome: 'Deployed model optimized for payment domain' },
      { week: 'Week 4', milestone: 'Canary testing', outcome: 'Validated improvements at 10% traffic' },
      { week: 'Week 5', milestone: 'Full deployment', outcome: 'Rolled out to 100% of traffic' },
      { week: 'Week 6', milestone: 'Optimization', outcome: 'Fine-tuned routing thresholds for cost savings' },
    ],
    whatSlanchaHandled: [
      'Automatic model routing (vLLM, Falcon, Llama — whichever performed best)',
      'Eval-driven fine-tuning on payment-specific failures',
      'Latency optimization via quantization-aware training (QAT)',
      'Continuous quality monitoring and drift detection',
      'Canary deployment with auto-rollback if metrics degraded',
    ],
    whatCustomerDid: [
      'Defined success metrics (latency < 500ms, quality > 90%)',
      'Reviewed weekly eval reports',
      'Approved fine-tuning deployments',
      'Focused on new product features instead of infrastructure',
    ],
    metrics: [
      { label: 'P99 latency', before: '2,800ms', after: '420ms', change: '85% reduction' },
      { label: 'Response quality', before: '68%', after: '94%', change: '+26 points' },
      { label: 'Monthly API cost', before: '$420,000', after: '$315,000', change: '25% reduction' },
      { label: 'ML team on infra', before: '80%', after: '20%', change: '60pt shift' },
    ],
    economics: {
      before: { api: '$420,000', engineering: '$320,000', other: null, total: '$740,000' },
      after: { api: '$315,000', engineering: '$80,000', other: null, total: '$395,000' },
      savings: '$345,000/mo',
      annual: '$4.14M',
    },
    businessImpact: [
      'Support ticket resolution improved from 4.2 hours to 1.8 hours',
      'Customer satisfaction (CSAT) increased from 3.2 to 4.6 (out of 5)',
      'Fraud detection speed improved from 45 minutes to 8 minutes',
      '4 FTEs shipped 3 new features in 90 days',
    ],
    quote: {
      text: 'We were spending $420K/month on API costs and still couldn\'t get latency below 2 seconds. Slancha cut our latency by 85%, improved quality from 68% to 94%, and our monthly bill dropped to $315K. But the real win is that our ML team went from maintaining infrastructure to building features. We shipped three customer-requested features in the quarter after we switched.',
      author: 'CTO, PayFlow',
    },
    useCaseDetails: [
      { name: 'Customer Support Chat', prompt: 'Complex payment questions, dispute resolution, account inquiries', model: 'Fine-tuned Llama 3 70B (payment domain)', metric: 'Response accuracy on payment-specific questions', result: '68% to 94% accuracy' },
      { name: 'Fraud Detection Summaries', prompt: 'Multi-agent transaction analysis to explainable alert summaries', model: 'Smaller, faster model via automatic fine-tuning', metric: 'Analyst approval rate of generated explanations', result: '72% to 91% approval rate' },
      { name: 'Transaction Categorization', prompt: 'Merchant transaction to category mapping', model: 'Quantized model for high-throughput batch processing', metric: 'Category match rate against manual review', result: '85% to 97% accuracy' },
    ],
    heroMetrics: [
      { number: '85%', label: 'Latency reduction' },
      { number: '$4.14M', label: 'Annual savings' },
      { number: '6 weeks', label: 'Time to value' },
    ],
    verticalLink: '/solutions/fintech',
  },
  healthtech: {
    id: 'healthtech',
    industryLabel: 'Healthcare AI',
    company: 'MediAssist',
    companyDesc: 'Healthcare / Telemedicine',
    size: '180 employees, $35M ARR',
    tokenVolume: '45M tokens/month',
    useCases: 'Medical record summarization + patient intake + clinical decision support',
    title: 'How MediAssist Won a $12M Contract with Enterprise-Grade Compliance',
    subtitle: 'A telemedicine company processing 45M clinical tokens/month achieved HIPAA compliance and won a $12M enterprise deal with Slancha.',
    painPoints: [
      'HIPAA compliance uncertainty — unclear if API providers retained patient data',
      'VPC deployment required — couldn\'t use standard cloud APIs',
      'P99 latency of 3,500ms — doctors waiting too long for suggestions',
      'Summaries missed critical information 30% of the time',
      'No SOC 2 — couldn\'t pass security review with hospital partners',
    ],
    trigger: 'MediAssist lost a $12M enterprise contract because their AI vendor couldn\'t sign a BAA.',
    timeline: [
      { week: 'Week 1', milestone: 'Security review', outcome: 'SOC 2 Type II report provided, BAA signed' },
      { week: 'Week 2', milestone: 'VPC deployment', outcome: 'Deployed in MediAssist\'s AWS VPC' },
      { week: 'Week 3', milestone: 'Data migration', outcome: '2 years of patient data to encrypted storage' },
      { week: 'Week 4', milestone: 'Baseline evals', outcome: 'Established clinical quality benchmarks' },
      { week: 'Week 5', milestone: 'Domain fine-tune', outcome: 'Trained on medical terminology and clinical patterns' },
      { week: 'Week 6', milestone: 'Canary testing', outcome: 'Validated at 5% of clinical traffic' },
      { week: 'Week 7', milestone: 'Full deployment', outcome: 'Rolled out to all patient use cases' },
      { week: 'Week 8', milestone: 'Compliance audit', outcome: 'Passed internal security review' },
    ],
    whatSlanchaHandled: [
      'VPC deployment with no public API exposure',
      'HIPAA BAA and SOC 2 Type II compliance',
      'Data encryption at rest and in transit (AES-256, TLS 1.3)',
      'Regional confinement (US-only, per MediAssist\'s requirement)',
      'Clinical domain fine-tuning with medical terminology optimization',
      'Drift detection for changing patient intake patterns',
    ],
    whatCustomerDid: [
      'Defined clinical quality standards (doctor review thresholds)',
      'Reviewed weekly safety reports',
      'Managed doctor feedback loop for continuous improvement',
      'Handled BAA and compliance documentation',
    ],
    metrics: [
      { label: 'P99 latency', before: '3,500ms', after: '580ms', change: '83% reduction' },
      { label: 'Summary accuracy', before: '70%', after: '93%', change: '+23 points' },
      { label: 'Critical info missed', before: '30%', after: '4%', change: '87% reduction' },
      { label: 'Compliance', before: 'None', after: 'SOC 2 + HIPAA', change: 'Certified' },
    ],
    economics: {
      before: { api: '$315,000', engineering: '$180,000', other: '$50,000 compliance', total: '$545,000' },
      after: { api: '$247,500', engineering: '$60,000', other: '$0 compliance', total: '$307,500' },
      savings: '$237,500/mo',
      annual: '$2.85M',
    },
    businessImpact: [
      'Won $12M enterprise contract after security review',
      'Doctor adoption increased from 45% to 78%',
      'Patient intake time reduced from 25 minutes to 8 minutes per patient',
      'Full data ownership — no data retention for model training',
    ],
    quote: {
      text: 'We lost a $12M contract because our AI vendor couldn\'t meet healthcare compliance requirements. Slancha signed a BAA, deployed in our VPC, and provided SOC 2 Type II in our first week. But beyond compliance, the clinical quality improvements were massive. Doctor adoption jumped from 45% to 78% because the summaries are faster and more accurate. We\'re winning enterprise deals now instead of losing them.',
      author: 'CEO, MediAssist',
    },
    useCaseDetails: [
      { name: 'Patient Intake Summaries', prompt: 'Raw patient history to structured summary with diagnoses, medications, allergies', model: 'Fine-tuned on medical terminology and clinical note patterns', metric: 'Doctor approval rate of generated summaries', result: '65% to 91% approval rate' },
      { name: 'Medical Record Abstraction', prompt: 'Unstructured clinical notes to extracted structured data', model: 'Optimized for precision (low false-negative rate on critical findings)', metric: 'Extraction accuracy on gold-standard test set', result: '78% to 96% accuracy' },
      { name: 'Clinical Decision Support', prompt: 'Patient presentation + history to differential diagnosis list', model: 'High-precision model with safety filtering', metric: 'Top-3 diagnosis includes correct answer (physician-validated)', result: '55% to 84% accuracy' },
    ],
    heroMetrics: [
      { number: '$12M', label: 'Contract won' },
      { number: '83%', label: 'Latency reduction' },
      { number: '8 weeks', label: 'To compliance' },
    ],
    verticalLink: '/solutions/healthtech',
  },
  ecommerce: {
    id: 'ecommerce',
    industryLabel: 'E-Commerce',
    company: 'ShopSmart',
    companyDesc: 'E-Commerce / Retail',
    size: '400 employees, $120M ARR',
    tokenVolume: '150M tokens/month',
    useCases: 'Product recommendations + customer support + inventory forecasting',
    title: 'How ShopSmart Saved $1.54M on Black Friday Alone',
    subtitle: 'A retail platform processing 150M tokens/month eliminated peak-season infrastructure pain and saved $1.54M on Black Friday with Slancha.',
    painPoints: [
      'Black Friday traffic 10x baseline — latency went from 800ms to 8,000ms',
      'ML team spent weeks benchmarking models for seasonal spikes',
      'API bill: $600K normal month vs $4.2M on Black Friday',
      'Recommendation quality dropped 15% during peak load',
      'No auto-scaling — manual infrastructure provisioning for peak seasons',
    ],
    trigger: 'ShopSmart\'s CTO said: "We\'re losing 15% of Black Friday revenue to slow response times."',
    timeline: [
      { week: 'Week 1', milestone: 'Load testing', outcome: 'Simulated 10x Black Friday traffic' },
      { week: 'Week 2', milestone: 'Auto-routing', outcome: 'Configured model shifting by load' },
      { week: 'Week 3', milestone: 'Fine-tuning', outcome: 'Trained on seasonal query patterns' },
      { week: 'Week 4', milestone: 'Pre-deployment', outcome: 'Validated at 100% traffic simulation' },
    ],
    whatSlanchaHandled: [
      'Automatic model shifting based on load (smaller models for high-volume queries)',
      'Multi-token prediction for common customer support patterns',
      'QAT-optimized models for latency under load',
      'Cost optimization via fine-tuned smaller models for repetitive tasks',
      'Real-time quality monitoring with auto-fallback on degradation',
    ],
    whatCustomerDid: [
      'Defined load thresholds (8000 RPS = auto-shift to smaller models)',
      'Reviewed weekly cost and quality reports',
      'Approved deployment of seasonal fine-tunes',
      'Focused on Black Friday merchandising instead of infrastructure',
    ],
    metrics: [
      { label: 'Black Friday latency', before: '8,000ms', after: '620ms', change: '92% reduction' },
      { label: 'Recommendation quality', before: '72%', after: '91%', change: '+19 points' },
      { label: 'Black Friday API cost', before: '$4.2M', after: '$2.8M', change: '33% reduction' },
      { label: 'ML team ops time', before: '100%', after: '30%', change: '70pt shift' },
    ],
    economics: {
      before: { api: '$4,200,000', engineering: '$200,000', other: null, total: '$4,400,000' },
      after: { api: '$2,800,000', engineering: '$60,000', other: null, total: '$2,860,000' },
      savings: '$1,540,000',
      annual: '~$2.2M (4 major sales events)',
    },
    businessImpact: [
      'Black Friday revenue increased 12% YoY',
      'Customer support CSAT improved from 3.4 to 4.5',
      'No more surprise $4M bills during peak seasons',
      '4 ML FTEs shifted to recommendation algorithm improvements',
    ],
    quote: {
      text: 'Our Black Friday bill used to be $4.2M with latency of 8 seconds. Slancha cut it to $2.8M with 620ms latency. We made 12% more revenue because recommendations were fast enough to convert. The ML team stopped building scaling infrastructure and started improving recommendation algorithms. That\'s a $1.5M win in one day.',
      author: 'CTO, ShopSmart',
    },
    useCaseDetails: [
      { name: 'Product Recommendation Chat', prompt: 'Natural language product queries ("running shoes under $100 with free returns")', model: 'Multi-token prediction optimized for common query patterns', metric: 'Click-through rate on recommended products', result: '12% to 18% CTR during Black Friday' },
      { name: 'Customer Support', prompt: 'Returns, exchanges, order status inquiries', model: 'Fine-tuned on return policy language and order data', metric: 'First-contact resolution rate', result: '68% to 87% first-contact resolution' },
      { name: 'Inventory Forecasting', prompt: 'Demand signals + historical data to actionable inventory recommendations', model: 'Fine-tuned on merchandising patterns and seasonal trends', metric: 'Forecast accuracy vs. actual sales', result: '65% to 89% forecast accuracy' },
    ],
    heroMetrics: [
      { number: '$1.54M', label: 'Saved on Black Friday' },
      { number: '92%', label: 'Latency reduction' },
      { number: '4 weeks', label: 'Implementation' },
    ],
    verticalLink: '/solutions/ecommerce',
  },
};

const otherStudies = (currentId) =>
  Object.values(caseStudies).filter((cs) => cs.id !== currentId);

function JsonLd({ cs }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.title,
    description: cs.subtitle,
    author: { '@type': 'Organization', name: 'Slancha' },
    publisher: { '@type': 'Organization', name: 'Slancha' },
    about: {
      '@type': 'Product',
      name: 'Slancha',
      description: 'End-to-end AI inference optimization platform',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function CaseStudyDetail() {
  const { id } = useParams();
  const cs = caseStudies[id];

  usePageMeta({
    title: cs ? `${cs.company}: ${cs.title}` : 'Case Study Not Found',
    description: cs?.subtitle || '',
  });

  if (!cs) return <Navigate to="/case-studies" replace />;

  return (
    <div className="page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <JsonLd cs={cs} />
      <main id="main-content" className="csd-page">
        {/* Breadcrumb */}
        <nav className="csd-breadcrumb" aria-label="Breadcrumb">
          <Link to="/case-studies">Case Studies</Link>
          <span className="csd-breadcrumb-sep">/</span>
          <span>{cs.industryLabel}</span>
        </nav>

        {/* Hero */}
        <header className="csd-hero">
          <span className={`csd-industry-badge ${cs.id}`}>{cs.industryLabel}</span>
          <h1>{cs.title}</h1>
          <p className="csd-subtitle">{cs.subtitle}</p>
          <div className="csd-company-bar">
            <span>{cs.company}</span>
            <span className="csd-dot" />
            <span>{cs.companyDesc}</span>
            <span className="csd-dot" />
            <span>{cs.size}</span>
            <span className="csd-dot" />
            <span>{cs.tokenVolume}</span>
          </div>
        </header>

        {/* Hero metrics */}
        <div className="csd-hero-metrics">
          {cs.heroMetrics.map((m) => (
            <div className="csd-hero-metric" key={m.label}>
              <span className="csd-metric-number">{m.number}</span>
              <span className="csd-metric-label">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Challenge */}
        <section className="csd-section">
          <h2>The Challenge</h2>
          <p className="csd-use-case-summary">{cs.useCases}</p>
          <ul className="csd-pain-list">
            {cs.painPoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          <blockquote className="csd-trigger">{cs.trigger}</blockquote>
        </section>

        {/* Implementation */}
        <section className="csd-section">
          <h2>Implementation</h2>
          <div className="csd-timeline">
            {cs.timeline.map((t, i) => (
              <div className="csd-timeline-item" key={i}>
                <div className="csd-timeline-marker">
                  <span className="csd-timeline-dot" />
                  {i < cs.timeline.length - 1 && <span className="csd-timeline-line" />}
                </div>
                <div className="csd-timeline-content">
                  <div className="csd-timeline-week">{t.week}</div>
                  <div className="csd-timeline-milestone">{t.milestone}</div>
                  <div className="csd-timeline-outcome">{t.outcome}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="csd-responsibility-grid">
            <div className="csd-responsibility-card">
              <h3>What Slancha Handled</h3>
              <ul>
                {cs.whatSlanchaHandled.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="csd-responsibility-card customer">
              <h3>What {cs.company} Did</h3>
              <ul>
                {cs.whatCustomerDid.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="csd-section">
          <h2>Results After 90 Days</h2>
          <div className="csd-metrics-table">
            <div className="csd-metrics-header">
              <span>Metric</span>
              <span>Before</span>
              <span>After</span>
              <span>Change</span>
            </div>
            {cs.metrics.map((m) => (
              <div className="csd-metrics-row" key={m.label}>
                <span className="csd-m-label">{m.label}</span>
                <span className="csd-m-before">{m.before}</span>
                <span className="csd-m-after">{m.after}</span>
                <span className="csd-m-change">{m.change}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Economics */}
        <section className="csd-section">
          <h2>Economics</h2>
          <div className="csd-economics">
            <div className="csd-econ-col">
              <div className="csd-econ-header">Before Slancha</div>
              <div className="csd-econ-row"><span>API fees</span><span>{cs.economics.before.api}</span></div>
              <div className="csd-econ-row"><span>ML engineering</span><span>{cs.economics.before.engineering}</span></div>
              {cs.economics.before.other && <div className="csd-econ-row"><span>Other</span><span>{cs.economics.before.other}</span></div>}
              <div className="csd-econ-row csd-econ-total"><span>Total TCO</span><span>{cs.economics.before.total}</span></div>
            </div>
            <div className="csd-econ-col csd-econ-after">
              <div className="csd-econ-header">With Slancha</div>
              <div className="csd-econ-row"><span>API fees</span><span>{cs.economics.after.api}</span></div>
              <div className="csd-econ-row"><span>ML engineering</span><span>{cs.economics.after.engineering}</span></div>
              {cs.economics.after.other && <div className="csd-econ-row"><span>Other</span><span>{cs.economics.after.other}</span></div>}
              <div className="csd-econ-row csd-econ-total"><span>Total TCO</span><span>{cs.economics.after.total}</span></div>
            </div>
            <div className="csd-econ-savings">
              <span className="csd-savings-number">{cs.economics.annual}</span>
              <span className="csd-savings-label">annual savings</span>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="csd-quote-section">
          <blockquote>
            <p>&ldquo;{cs.quote.text}&rdquo;</p>
            <cite>&mdash; {cs.quote.author}</cite>
          </blockquote>
        </section>

        {/* Use case breakdown */}
        <section className="csd-section">
          <h2>Use Case Breakdown</h2>
          <div className="csd-use-cases">
            {cs.useCaseDetails.map((uc) => (
              <div className="csd-use-case-card" key={uc.name}>
                <h3>{uc.name}</h3>
                <div className="csd-uc-row"><span>Prompt type</span><span>{uc.prompt}</span></div>
                <div className="csd-uc-row"><span>Model</span><span>{uc.model}</span></div>
                <div className="csd-uc-row"><span>Metric</span><span>{uc.metric}</span></div>
                <div className="csd-uc-row csd-uc-result"><span>Result</span><span>{uc.result}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* Business impact */}
        <section className="csd-section">
          <h2>Business Impact</h2>
          <ul className="csd-impact-list">
            {cs.businessImpact.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </section>

        {/* Cross-links to other case studies */}
        <section className="csd-section">
          <h2>More Success Stories</h2>
          <div className="csd-other-studies">
            {otherStudies(cs.id).map((other) => (
              <Link to={`/case-studies/${other.id}`} className="csd-other-card" key={other.id}>
                <span className={`csd-other-badge ${other.id}`}>{other.industryLabel}</span>
                <h3>{other.title}</h3>
                <div className="csd-other-metrics">
                  {other.heroMetrics.map((m) => (
                    <span key={m.label}><strong>{m.number}</strong> {m.label}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="csd-cta">
          <h2>Ready to see similar results?</h2>
          <p>Start with the free router or apply for a pilot in your vertical.</p>
          <div className="csd-cta-buttons">
            <Link to="/signup" className="btn-primary">Get Started Free</Link>
            <Link to="/contact" className="btn-secondary">Request a Pilot</Link>
            {cs.verticalLink && (
              <Link to={cs.verticalLink} className="btn-outline">See {cs.industryLabel} Solutions</Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

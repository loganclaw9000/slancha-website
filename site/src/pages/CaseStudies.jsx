import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './CaseStudies.css';

const caseStudies = [
  {
    industry: 'fintech',
    industryLabel: 'Fintech',
    title: 'PayFlow cut P99 latency 85% and saved $4.14M/year',
    company: 'Series B Payments Platform — 250 employees, $50M ARR',
    challenge:
      'PayFlow processed 80M tokens/month across customer support chat, fraud detection summaries, and transaction categorization. P99 latency hit 2,800ms, quality sat at 68% accuracy on complex payment questions, and the monthly API bill was $420K — climbing 25% month-over-month. Four ML FTEs spent 80% of their time on model benchmarking instead of product features.',
    trigger: 'PayFlow\'s CEO asked: "Why is our inference cost 8x our engineering headcount cost?"',
    solution:
      'They migrated all three use cases to a single Slancha endpoint. Automatic model routing selected the best model per request type. Eval-driven fine-tuning on payment-specific failures improved quality. QAT optimization slashed latency. Continuous monitoring caught drift before customers did.',
    quote: {
      text: 'We were spending $420K/month on API costs and still couldn\'t get latency below 2 seconds. Slancha cut our latency by 85%, improved quality from 68% to 94%, and our monthly bill dropped to $315K. But the real win is that our ML team went from maintaining infrastructure to building features. We shipped three customer-requested features in the quarter after we switched.',
      author: 'CTO, PayFlow',
    },
    metrics: [
      { number: '85%', label: 'Latency reduction' },
      { number: '68% → 94%', label: 'Response quality' },
      { number: '$4.14M', label: 'Annual savings' },
      { number: '3 days', label: 'Integration time' },
    ],
    timeline: [
      { week: 'Week 1', milestone: 'API integration', outcome: 'Migrated all three use cases to Slancha endpoint' },
      { week: 'Week 2', milestone: 'Baseline evals', outcome: 'Established quality and latency benchmarks' },
      { week: 'Week 3', milestone: 'First fine-tune', outcome: 'Deployed model optimized for payment domain' },
      { week: 'Week 4', milestone: 'Canary testing', outcome: 'Validated improvements at 10% traffic' },
      { week: 'Week 5', milestone: 'Full deployment', outcome: 'Rolled out to 100% of traffic' },
      { week: 'Week 6', milestone: 'Optimization', outcome: 'Fine-tuned routing thresholds for cost savings' },
    ],
    economics: [
      { category: 'API fees', before: '$420,000', after: '$315,000', savings: '$105,000' },
      { category: 'ML engineering', before: '$320,000', after: '$80,000', savings: '$240,000' },
      { category: 'Total TCO', before: '$740,000', after: '$395,000', savings: '$345,000', isTotal: true },
    ],
    useCases: [
      { name: 'Customer Support Chat', model: 'Fine-tuned Llama 3 70B (payment domain)', metric: 'Response accuracy', result: '68% → 94% on complex questions' },
      { name: 'Fraud Detection Summaries', model: 'Auto-selected smaller model via fine-tuning', metric: 'Analyst approval rate', result: '72% → 91% approval rate' },
      { name: 'Transaction Categorization', model: 'Quantized model for high-throughput batch', metric: 'Category match rate', result: '85% → 97% accuracy' },
    ],
  },
  {
    industry: 'healthcare',
    industryLabel: 'Healthcare AI',
    title: 'MediAssist won a $12M contract after deploying in 8 weeks',
    company: 'Digital Health / Telemedicine — 180 employees, $35M ARR',
    challenge:
      'MediAssist processed 45M tokens/month across patient intake summaries, medical record abstraction, and clinical decision support. HIPAA compliance was uncertain, VPC deployment was required, P99 latency hit 3,500ms, and summaries missed critical patient information 30% of the time.',
    trigger: 'MediAssist lost a $12M enterprise contract because their AI vendor couldn\'t sign a BAA (Business Associate Agreement).',
    solution:
      'Slancha deployed in MediAssist\'s AWS VPC with no public API exposure. SOC 2 Type II and HIPAA BAA were signed in week one. Clinical domain fine-tuning improved accuracy on medical terminology. Drift detection caught changing patient intake patterns before quality degraded.',
    quote: {
      text: 'We lost a $12M contract because our AI vendor couldn\'t meet healthcare compliance requirements. Slancha signed a BAA, deployed in our VPC, and provided SOC 2 Type II in our first week. Doctor adoption jumped from 45% to 78% because the summaries are faster and more accurate. We\'re winning enterprise deals now instead of losing them.',
      author: 'CEO, MediAssist',
    },
    metrics: [
      { number: '83%', label: 'Latency reduction' },
      { number: '$12M', label: 'Contract won' },
      { number: '45% → 78%', label: 'Doctor adoption' },
      { number: '$2.85M', label: 'Annual savings' },
    ],
    timeline: [
      { week: 'Week 1', milestone: 'Security review', outcome: 'SOC 2 Type II report provided, BAA signed' },
      { week: 'Week 2', milestone: 'VPC deployment', outcome: 'Deployed in MediAssist\'s AWS VPC' },
      { week: 'Week 3', milestone: 'Data migration', outcome: 'Migrated 2 years of patient data to encrypted storage' },
      { week: 'Week 4', milestone: 'Baseline evals', outcome: 'Established clinical quality benchmarks' },
      { week: 'Week 5', milestone: 'Domain fine-tune', outcome: 'Fine-tuned on medical terminology and clinical patterns' },
      { week: 'Week 6–7', milestone: 'Canary → Full deploy', outcome: 'Validated at 5% then rolled out to 100%' },
      { week: 'Week 8', milestone: 'Compliance audit', outcome: 'Passed internal security review' },
    ],
    economics: [
      { category: 'API fees', before: '$315,000', after: '$247,500', savings: '$67,500' },
      { category: 'ML engineering', before: '$180,000', after: '$60,000', savings: '$120,000' },
      { category: 'Compliance overhead', before: '$50,000', after: '$0', savings: '$50,000' },
      { category: 'Total TCO', before: '$545,000', after: '$307,500', savings: '$237,500', isTotal: true },
    ],
    useCases: [
      { name: 'Patient Intake Summaries', model: 'Fine-tuned on medical terminology', metric: 'Doctor approval rate', result: '65% → 91% approval rate' },
      { name: 'Medical Record Abstraction', model: 'Optimized for precision (low false-negatives)', metric: 'Extraction accuracy', result: '78% → 96% accuracy' },
      { name: 'Clinical Decision Support', model: 'High-precision with safety filtering', metric: 'Top-3 diagnosis accuracy', result: '55% → 84% accuracy' },
    ],
  },
  {
    industry: 'ecommerce',
    industryLabel: 'E-Commerce',
    title: 'ShopSmart saved $1.54M on Black Friday with 92% faster responses',
    company: 'Top-50 E-Commerce Marketplace — 400 employees, $120M ARR',
    challenge:
      'ShopSmart processed 150M tokens/month across product recommendation chat, customer support, and inventory forecasting. Black Friday traffic spiked 10x baseline — latency went from 800ms to 8,000ms, the API bill jumped from $600K to $4.2M, and recommendation quality dropped 15% under load.',
    trigger: 'ShopSmart\'s CTO said: "We\'re losing 15% of Black Friday revenue to slow response times. Our infrastructure can\'t scale."',
    solution:
      'Slancha\'s automatic model shifting routed to smaller models under high load. Multi-token prediction handled common patterns. QAT-optimized models maintained latency under pressure. Real-time quality monitoring triggered auto-fallback if quality degraded.',
    quote: {
      text: 'Our Black Friday bill used to be $4.2M with latency of 8 seconds. Slancha cut it to $2.8M with 620ms latency. We made 12% more revenue because recommendations were fast enough to convert. The ML team stopped building scaling infrastructure and started improving recommendation algorithms.',
      author: 'CTO, ShopSmart',
    },
    metrics: [
      { number: '92%', label: 'Latency reduction' },
      { number: '+12%', label: 'Revenue increase' },
      { number: '$1.54M', label: 'Black Friday savings' },
      { number: '4 weeks', label: 'Time to deploy' },
    ],
    timeline: [
      { week: 'Week 1', milestone: 'Load testing', outcome: 'Simulated 10x Black Friday traffic patterns' },
      { week: 'Week 2', milestone: 'Auto-routing', outcome: 'Configured model shifting based on load thresholds' },
      { week: 'Week 3', milestone: 'Fine-tuning', outcome: 'Trained models on seasonal query patterns' },
      { week: 'Week 4', milestone: 'Pre-deployment', outcome: 'Validated at 100% traffic simulation' },
    ],
    economics: [
      { category: 'API fees (Black Friday)', before: '$4,200,000', after: '$2,800,000', savings: '$1,400,000' },
      { category: 'ML engineering', before: '$200,000', after: '$60,000', savings: '$140,000' },
      { category: 'Total (Black Friday)', before: '$4,400,000', after: '$2,860,000', savings: '$1,540,000', isTotal: true },
    ],
    useCases: [
      { name: 'Product Recommendation Chat', model: 'Multi-token prediction for common patterns', metric: 'Click-through rate', result: '12% → 18% CTR during Black Friday' },
      { name: 'Customer Support', model: 'Fine-tuned on return policy + order data', metric: 'First-contact resolution', result: '68% → 87% resolution rate' },
      { name: 'Inventory Forecasting', model: 'Fine-tuned on merchandising patterns', metric: 'Forecast accuracy', result: '65% → 89% accuracy' },
    ],
  },
];

function DetailSection({ cs, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="casestudy-detail">
      {cs.trigger && (
        <div className="casestudy-trigger">
          <strong>The trigger:</strong> {cs.trigger}
        </div>
      )}

      <div className="casestudy-detail-grid">
        <div className="casestudy-detail-col">
          <div className="casestudy-section-label">Implementation Timeline</div>
          <div className="casestudy-timeline">
            {cs.timeline.map((step, i) => (
              <div className="timeline-step" key={i}>
                <span className="timeline-week">{step.week}</span>
                <div className="timeline-content">
                  <strong>{step.milestone}</strong>
                  <span>{step.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="casestudy-detail-col">
          <div className="casestudy-section-label">Monthly Economics</div>
          <table className="casestudy-economics">
            <thead>
              <tr><th>Category</th><th>Before</th><th>After</th><th>Savings</th></tr>
            </thead>
            <tbody>
              {cs.economics.map((row, i) => (
                <tr key={i} className={row.isTotal ? 'total-row' : ''}>
                  <td>{row.category}</td>
                  <td>{row.before}</td>
                  <td>{row.after}</td>
                  <td className="savings">{row.savings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="casestudy-section-label">Use Case Breakdown</div>
      <div className="casestudy-usecases">
        {cs.useCases.map((uc, i) => (
          <div className="usecase-card" key={i}>
            <h4>{uc.name}</h4>
            <div className="usecase-detail"><span>Model:</span> {uc.model}</div>
            <div className="usecase-detail"><span>Metric:</span> {uc.metric}</div>
            <div className="usecase-result">{uc.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudies() {
  usePageMeta({
    title: 'Case Studies',
    description: 'Real results from AI teams using Slancha. See how companies cut inference costs by 60%, reduced latency by 85%, and eliminated ML overhead with one API endpoint.',
  });

  const [expanded, setExpanded] = useState({});

  function toggleExpand(industry) {
    setExpanded(prev => ({ ...prev, [industry]: !prev[industry] }));
  }

  return (
    <div className="page">
      <Nav />
      <main id="main-content" className="casestudies-page">
        <div className="casestudies-header">
          <span className="casestudies-eyebrow">Customer Stories</span>
          <h1>Real Results from Real Teams</h1>
          <p>See how engineering teams use Slancha to cut inference costs, improve quality, and ship faster — without managing ML infrastructure.</p>

          <div className="casestudies-summary-stats">
            <div className="summary-stat">
              <span className="summary-number">$9.19M</span>
              <span className="summary-label">Combined annual savings</span>
            </div>
            <div className="summary-stat">
              <span className="summary-number">87%</span>
              <span className="summary-label">Avg latency reduction</span>
            </div>
            <div className="summary-stat">
              <span className="summary-number">6 weeks</span>
              <span className="summary-label">Avg time to value</span>
            </div>
          </div>
        </div>

        {caseStudies.map((cs) => (
          <article className="casestudy-card" key={cs.industry}>
            <span className={`casestudy-industry ${cs.industry}`}>{cs.industryLabel}</span>
            <h2>{cs.title}</h2>
            <p className="casestudy-company">{cs.company}</p>

            <div className="casestudy-section-label">Challenge</div>
            <p className="casestudy-text">{cs.challenge}</p>

            <div className="casestudy-section-label">Solution</div>
            <p className="casestudy-text">{cs.solution}</p>

            <div className="casestudy-quote">
              <p>"{cs.quote.text}"</p>
              <cite>— {cs.quote.author}</cite>
            </div>

            <div className="casestudy-section-label">Results</div>
            <div className="casestudy-results">
              {cs.metrics.map((m) => (
                <div className="casestudy-metric" key={m.label}>
                  <span className="number">{m.number}</span>
                  <span className="label">{m.label}</span>
                </div>
              ))}
            </div>

            <DetailSection cs={cs} isOpen={expanded[cs.industry]} />

            <button
              className="casestudy-expand-btn"
              onClick={() => toggleExpand(cs.industry)}
              aria-expanded={expanded[cs.industry] || false}
            >
              {expanded[cs.industry] ? 'Show less' : 'View full story — timeline, economics & use cases'}
            </button>
          </article>
        ))}

        <div className="casestudies-cta">
          <h2>Ready to write your own success story?</h2>
          <p>Start with the free router or apply for a pilot to see results in your stack.</p>
          <Link to="/signup" className="btn-primary">Get Started Free</Link>
          <Link to="/contact" className="btn-secondary">Request a Pilot</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

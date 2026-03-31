import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './CaseStudies.css';

const caseStudies = [
  {
    industry: 'fintech',
    industryLabel: 'Fintech',
    title: 'From 6-week eval cycles to continuous deployment',
    company: 'Series B fraud detection startup — 12-person ML team',
    challenge:
      'Their fraud detection models required manual evaluation against 40,000+ labeled transactions before every deployment. The process took 6 weeks, involved 3 teams, and relied on spreadsheets for result tracking. By the time a model shipped, the fraud patterns had already shifted.',
    solution:
      'They connected their transaction eval suite to Slancha, automated scoring across 12 metrics, and set up deployment gates with automatic rollback. Eval failures now flow directly into their fine-tuning pipeline, so each model iteration starts from a higher baseline.',
    quote: {
      text: 'We went from quarterly model updates to weekly. The same team that used to spend 6 weeks on eval now ships in 3 days — and catches more fraud because the models are always current.',
      author: 'Head of ML, Series B Fraud Detection Startup',
    },
    metrics: [
      { number: '6 wks → 3 days', label: 'Eval cycle time' },
      { number: '23%', label: 'Fewer false positives' },
      { number: '4x', label: 'More model updates/quarter' },
    ],
  },
  {
    industry: 'healthcare',
    industryLabel: 'Healthcare AI',
    title: 'Closing the loop on clinical NLP model quality',
    company: 'Digital health platform — 50M+ patient interactions/year',
    challenge:
      'Their clinical NLP models extract medication names, dosages, and conditions from doctor notes. Accuracy is critical — a missed interaction can affect patient safety. But their eval process was disconnected from training: the team running evals and the team fine-tuning models used different tools and rarely shared data.',
    solution:
      'Slancha unified their eval and training pipelines. Eval failures on edge cases — rare drug names, ambiguous abbreviations — automatically become training examples for the next fine-tuning cycle. A single dashboard tracks accuracy across 8 entity types with per-category drill-down.',
    quote: {
      text: 'The biggest win wasn\'t speed — it was signal. We stopped re-discovering the same failure modes every quarter because the platform remembers what the model got wrong and makes sure it learns from it.',
      author: 'VP of Engineering, Digital Health Platform',
    },
    metrics: [
      { number: '94% → 98.2%', label: 'Entity extraction accuracy' },
      { number: '70%', label: 'Fewer repeated failure modes' },
      { number: '2x', label: 'Faster fine-tuning cycles' },
    ],
  },
  {
    industry: 'ecommerce',
    industryLabel: 'E-Commerce',
    title: 'Cutting model serving costs 60% with intelligent routing',
    company: 'Top-50 e-commerce marketplace — 2M+ API calls/day',
    challenge:
      'They were sending every request to GPT-4 — product descriptions, search queries, customer support, recommendations. Their monthly inference bill exceeded $180K. They knew smaller models could handle simpler tasks, but had no systematic way to route or measure quality tradeoffs.',
    solution:
      'The Slancha Router now classifies each request by complexity and routes it to the optimal model. Simple product lookups go to a fine-tuned 8B model. Complex support queries go to frontier models. Slancha\'s eval layer continuously validates that routing decisions maintain quality thresholds.',
    quote: {
      text: 'We saved $110K/month on inference without any measurable quality drop. The router paid for itself in the first week.',
      author: 'CTO, Top-50 E-Commerce Marketplace',
    },
    metrics: [
      { number: '60%', label: 'Inference cost reduction' },
      { number: '< 0.3%', label: 'Quality variance' },
      { number: '< 1 week', label: 'Time to ROI' },
    ],
  },
];

export default function CaseStudies() {
  usePageMeta({ title: 'Case Studies', description: 'Real results from AI teams using Slancha. See how companies reduced eval cycles, cut costs, and improved model accuracy with the eval-deploy-train loop.' });
  return (
    <div className="page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" className="casestudies-page">
        <div className="casestudies-header">
          <h1>Case Studies</h1>
          <p>How engineering teams use Slancha to ship better models, faster.</p>
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

import { useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import '../components/Faq.css';

const faqData = [
  {
    category: 'General',
    questions: [
      {
        q: 'We already use Databricks. Do we need Slancha?',
        a: "Most enterprise customers use both. Databricks manages your data infrastructure (ETL, warehouses, analytics), while Slancha manages your AI engineering workflow (model evaluation, deployment, continuous learning). They're complementary — Databricks handles data; Slancha handles AI."
      },
      {
        q: 'What frameworks do you support?',
        a: 'All major frameworks: PyTorch, TensorFlow, Hugging Face, Ray, and more. Our Python SDK works with your existing models. Just drop in the Slancha evaluation wrapper, run tests, and deploy with one command.'
      },
      {
        q: 'Can we customize the evaluation metrics?',
        a: 'Yes. Use our 50+ pre-built benchmarks, or define your own custom metrics and datasets. Our SDK makes it easy to integrate your proprietary evals.'
      },
      {
        q: 'How does auto post-training work?',
        a: 'Slancha automatically captures production data, triggers model retraining when performance degrades or new data accumulates, and deploys improved models with A/B testing to ensure quality. No manual pipelines required.'
      },
      {
        q: 'What kind of latency can we expect for evaluations?',
        a: 'Typical model evaluations complete in minutes to hours, depending on model size and dataset complexity. Parallel evaluation of multiple models keeps total time low.'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'How does A/B testing work?',
        a: 'Deploy multiple model versions simultaneously. Slancha automatically tracks performance metrics, calculates statistical significance, and tells you which model wins. Roll back instantly if needed.'
      },
      {
        q: 'Where is data stored?',
        a: 'All data is encrypted at rest and in transit. Enterprise customers can deploy in their own VPC. We support SOC 2, GDPR, and can sign custom BAAs for healthcare customers.'
      },
      {
        q: 'Do you have API access?',
        a: 'Yes. Full REST and gRPC APIs for all operations. SDK available for Python. CLI tools for common tasks.'
      }
    ]
  },
  {
    category: 'Pricing',
    questions: [
      {
        q: 'How is usage-based pricing calculated?',
        a: 'Based on model evaluations (per model), deployments (per model per month), and data capture (GB/month). We provide a usage calculator on the pricing page.'
      },
      {
        q: 'Can we upgrade or downgrade anytime?',
        a: 'Yes. Changes take effect immediately. Prorated credits apply for mid-cycle upgrades.'
      },
      {
        q: 'Do you offer discounts for annual commitments?',
        a: 'Yes. 20% off for annual commitments on Full Loop plan. Custom enterprise discounts available.'
      }
    ]
  },
  {
    category: 'Security & Compliance',
    questions: [
      {
        q: 'Is Slancha SOC 2 compliant?',
        a: 'Yes. SOC 2 Type II certified. Full audit logs available for enterprise customers.'
      },
      {
        q: 'Can we use Slancha with our own models?',
        a: 'Absolutely. Slancha works with any model — your own fine-tuned models, open-weight models, or commercial API models.'
      },
      {
        q: 'What about data privacy?',
        a: "Your data never leaves your environment unless you choose to share it. We don't train on customer data. All models are evaluated in isolation."
      },
      {
        q: 'Do you offer SSO?',
        a: 'Yes. SAML SSO available on Full Loop and Enterprise plans. SCIM provisioning for Enterprise.'
      }
    ]
  },
  {
    category: 'Migration',
    questions: [
      {
        q: 'How do we migrate from our current setup?',
        a: 'Our SDK works with your existing models. Drop in the Slancha evaluation wrapper, run tests, and deploy with one command. Most teams are live within a day.'
      },
      {
        q: 'Can we self-host?',
        a: 'Enterprise customers can self-host Slancha on their own infrastructure. Contact sales for details.'
      },
      {
        q: 'What about support?',
        a: 'Eval + Deploy: Email support, 48-hour response | Full Loop: Priority email + chat, 4-hour response | Enterprise: Dedicated success manager, 1-hour response, SLA-backed'
      }
    ]
  }
];

function AccordionItem({ question, answer, isOpen, onToggle, hasSeparator }) {
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button
        className="accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="accordion-question">Q: {question}</span>
        <svg
          className="accordion-arrow"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        id={`answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
        className="accordion-content"
      >
        <div className="accordion-answer">
          {answer.split('\n').map((line, idx) => {
            if (line === '---') {
              return <hr key={idx} className="separator" />;
            }
            if (line.includes('|')) {
              return (
                <p key={idx} className="support-list">
                  {line.split(' | ').map((item, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {item.trim()}
                    </span>
                  ))}
                </p>
              );
            }
            return <p key={idx}>{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  usePageMeta({ title: 'FAQ', description: 'Frequently asked questions about Slancha. Learn about pricing, supported frameworks, security, migration, and how Slancha compares to existing tools.' });
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>
          Can't find what you're looking for?{' '}
          <a href="/contact">Contact our team</a>
        </p>
      </div>

      <div className="faq-content">
        {faqData.map((category, catIdx) => (
          <div key={category.category} className="faq-category">
            <h2>{category.category}</h2>
            {category.questions.map((item, qIdx) => {
              const globalIndex = catIdx * 10 + qIdx;
              return (
                <AccordionItem
                  key={globalIndex}
                  question={item.q}
                  answer={item.a}
                  isOpen={openIndex === globalIndex}
                  onToggle={() => handleToggle(globalIndex)}
                  hasSeparator={item.a.includes('---')}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

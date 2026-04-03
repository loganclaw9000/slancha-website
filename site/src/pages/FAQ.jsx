import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import '../components/Faq.css';

const faqData = [
  {
    category: 'General',
    questions: [
      {
        q: 'We already use Databricks. Do we need Slancha?',
        a: "Most enterprise customers use both. Databricks manages your data infrastructure (ETL, warehouses, analytics), while Slancha manages your AI inference — routing, automated fine-tuning, and inference optimization behind a single API endpoint. They're complementary: Databricks handles data; Slancha handles AI inference."
      },
      {
        q: 'How do we integrate Slancha?',
        a: 'Point your API calls to Slancha\'s endpoint. That\'s it. Our API is OpenAI-compatible, so you can swap in one line of code. Python and TypeScript SDKs are available for convenience.'
      },
      {
        q: 'Do we need to choose or manage models?',
        a: 'No. That\'s the point. Slancha automatically routes requests to the right model, fine-tunes task-specific models on your usage data, and optimizes inference — all behind the scenes. You just use the API.'
      },
      {
        q: 'How does automated fine-tuning work?',
        a: 'Slancha continuously analyzes your task patterns, curates training data from real usage, and fine-tunes smaller task-specific models that match or outperform frontier models on your workloads. When new model architectures drop, Slancha re-fine-tunes automatically. No manual pipelines required.'
      },
      {
        q: 'What kind of latency can we expect?',
        a: 'Slancha optimizes for low latency using quantization-aware training (4-bit inference), multi-instance GPU serving, and multi-token prediction. Most customers see sub-100ms response times. Performance improves over time as models are fine-tuned for your specific tasks.'
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
        a: 'Based on API requests and tokens processed through your endpoint. Simple per-token pricing with volume discounts. We provide a usage calculator on the pricing page.'
      },
      {
        q: 'Can we upgrade or downgrade anytime?',
        a: 'Yes. Changes take effect immediately. Prorated credits apply for mid-cycle upgrades.'
      },
      {
        q: 'Do you offer discounts for annual commitments?',
        a: 'Yes. 20% off for annual commitments on Pro and Scale plans. Custom enterprise discounts available.'
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
        a: 'Yes. SAML SSO available on Scale and Enterprise plans. SCIM provisioning for Enterprise.'
      }
    ]
  },
  {
    category: 'Migration',
    questions: [
      {
        q: 'How do we migrate from our current setup?',
        a: 'Swap your LLM provider endpoint for Slancha\'s OpenAI-compatible API. One line of code. Slancha starts routing and optimizing immediately — no configuration, no model selection, no pipeline setup. Most teams are live within an hour.'
      },
      {
        q: 'Can we self-host?',
        a: 'Enterprise customers can self-host Slancha on their own infrastructure. Contact sales for details.'
      },
      {
        q: 'What about support?',
        a: 'Starter: Email support, 48-hour response | Growth: Priority email + chat, 4-hour response | Enterprise: Dedicated success manager, 1-hour response, SLA-backed'
      }
    ]
  }
];

function FaqJsonLd({ faqData }) {
  const allQuestions = faqData.flatMap(cat => cat.questions);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQuestions.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

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
    <div className="page">
      <FaqJsonLd faqData={faqData} />
      <Nav />
      <main id="main-content" className="faq-page">
        <div className="faq-header">
          <span className="faq-eyebrow">Support</span>
          <h1>Frequently Asked Questions</h1>
          <p>
            Can't find what you're looking for?{' '}
            <Link to="/contact">Contact our team</Link>
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

        <section className="faq-cta">
          <h2>Still have questions?</h2>
          <p>Our team is ready to help you evaluate whether Slancha is the right fit for your AI infrastructure.</p>
          <div className="faq-cta-buttons">
            <Link to="/contact" className="btn-primary">Contact Sales</Link>
            <Link to="/docs" className="btn-secondary">Read the Docs</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

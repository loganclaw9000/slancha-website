import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Glossary.css';

const glossaryTerms = [
  {
    term: 'Automated Fine-Tuning',
    abbr: null,
    definition: 'A process where models are continuously retrained on task-specific data without human intervention. In Slancha\'s pipeline, eval failures automatically trigger fine-tuning jobs — the system identifies weak patterns, curates training data, and retrains the model to eliminate recurring failure modes.',
    tags: ['fine-tuning', 'automation'],
    links: [
      { label: 'Post-Training Guide', to: '/docs/post-training' },
      { label: 'How Eval Data Drives Fine-Tuning', to: '/blog/eval-driven-fine-tuning-technical-deep-dive' },
    ],
  },
  {
    term: 'Black Box Inference',
    abbr: null,
    definition: 'An approach where the inference platform handles all model selection, routing, optimization, and deployment decisions internally. Users send requests to a single endpoint and receive optimized responses without needing to know which model, configuration, or optimization strategy was used. Slancha\'s core philosophy.',
    tags: ['architecture', 'slancha'],
    links: [
      { label: 'Why the Black Box Wins', to: '/blog/zero-config-ai-inference' },
      { label: 'How It Works', to: '/demo' },
    ],
  },
  {
    term: 'Circuit Breaker',
    abbr: null,
    definition: 'A fault-tolerance pattern that prevents cascading failures by monitoring error rates on model endpoints. When a model exceeds an error threshold, the circuit "opens" and traffic is rerouted to healthy alternatives. The circuit periodically tests the failing model and restores traffic when it recovers.',
    tags: ['reliability', 'routing'],
    links: [
      { label: 'Production Router Patterns', to: '/blog/production-ai-router-architecture-patterns' },
    ],
  },
  {
    term: 'Closed-Loop Optimization',
    abbr: null,
    definition: 'A system where output quality metrics feed back into the pipeline to improve future performance. In AI inference, this means eval results drive fine-tuning, which improves routing decisions, which produces better outputs — creating a continuous improvement cycle without manual intervention.',
    tags: ['optimization', 'architecture'],
    links: [
      { label: 'Demo Walkthrough', to: '/demo' },
      { label: 'How It Works', to: '/#how-it-works' },
    ],
  },
  {
    term: 'Cost-Aware Routing',
    abbr: null,
    definition: 'A routing strategy that factors in per-token costs alongside quality and latency when selecting models. Simple tasks get routed to cheaper, smaller models while complex tasks use more capable (and expensive) ones — optimizing total cost without sacrificing output quality where it matters.',
    tags: ['routing', 'cost-optimization'],
    links: [
      { label: 'Reduce LLM API Costs by 60%', to: '/blog/reduce-llm-api-costs-60-percent' },
      { label: 'ROI Calculator', to: '/roi-calculator' },
    ],
  },
  {
    term: 'Embedding-Based Classification',
    abbr: null,
    definition: 'A technique for routing incoming requests by converting them to vector embeddings and comparing against known task clusters. Faster and more nuanced than keyword matching — a 384-dim embedding model can classify requests in <2ms, enabling sub-millisecond routing decisions at scale.',
    tags: ['routing', 'embeddings'],
    links: [
      { label: 'Production Router Patterns', to: '/blog/production-ai-router-architecture-patterns' },
    ],
  },
  {
    term: 'Eval-Driven Development',
    abbr: null,
    definition: 'A methodology where model evaluation scores are the primary signal for all pipeline decisions — which model to deploy, when to fine-tune, what data to collect. Instead of manually benchmarking models, evals run continuously and automatically trigger downstream actions.',
    tags: ['evaluation', 'methodology'],
    links: [
      { label: 'Deep Dive: Eval-Driven Fine-Tuning', to: '/blog/eval-driven-fine-tuning-technical-deep-dive' },
      { label: 'API: Evaluations', to: '/docs/api-reference' },
    ],
  },
  {
    term: 'GPTQ',
    abbr: 'Generalized Post-Training Quantization',
    definition: 'A one-shot weight quantization method that compresses model weights to lower precision (typically 4-bit) after training. GPTQ uses approximate second-order information to minimize quantization error. It\'s fast to apply but can degrade quality on complex tasks compared to QAT.',
    tags: ['quantization', 'optimization'],
    links: [
      { label: 'Inference Optimization Guide', to: '/blog/ai-inference-optimization-qat-mig-multi-token-prediction' },
    ],
  },
  {
    term: 'Inference Optimization',
    abbr: null,
    definition: 'Techniques that reduce the cost, latency, or resource consumption of running trained models in production. Includes quantization (reducing precision), batching (processing multiple requests together), caching (storing repeated results), and hardware-level optimizations like MIG partitioning.',
    tags: ['optimization', 'performance'],
    links: [
      { label: 'Cut Latency in Half', to: '/blog/cut-llm-inference-latency-in-half' },
      { label: 'Benchmarks', to: '/benchmarks' },
    ],
  },
  {
    term: 'JSON-LD',
    abbr: 'JavaScript Object Notation for Linked Data',
    definition: 'A structured data format used in web pages to help search engines understand content semantically. For AI platforms, adding Article, SoftwareApplication, and Organization schemas improves search visibility and enables rich snippets in results.',
    tags: ['seo', 'web'],
    links: [],
  },
  {
    term: 'KV Cache',
    abbr: 'Key-Value Cache',
    definition: 'A memory optimization in transformer models that stores previously computed attention key and value tensors. During autoregressive generation, the KV cache avoids recomputing attention for all prior tokens — reducing compute from O(n²) to O(n) per token. Critical for low-latency inference.',
    tags: ['performance', 'transformers'],
    links: [
      { label: 'Cut Latency in Half', to: '/blog/cut-llm-inference-latency-in-half' },
    ],
  },
  {
    term: 'LoRA',
    abbr: 'Low-Rank Adaptation',
    definition: 'A parameter-efficient fine-tuning technique that freezes the base model weights and trains small rank-decomposition matrices alongside them. LoRA adapters are typically <1% of the base model size, enabling multiple task-specific variants without duplicating the full model. Slancha uses LoRA for automated fine-tuning.',
    tags: ['fine-tuning', 'efficiency'],
    links: [
      { label: 'Post-Training Guide', to: '/docs/post-training' },
      { label: 'API: Fine-Tuning', to: '/docs/api-reference' },
    ],
  },
  {
    term: 'MIG',
    abbr: 'Multi-Instance GPU',
    definition: 'An NVIDIA technology (available on A100, H100, B200, B300) that partitions a single GPU into up to 7 isolated instances, each with dedicated compute, memory, and bandwidth. MIG enables running multiple smaller models on one GPU with hardware-level isolation — no noisy-neighbor effects.',
    tags: ['hardware', 'optimization', 'nvidia'],
    links: [
      { label: 'Inference Optimization Guide', to: '/blog/ai-inference-optimization-qat-mig-multi-token-prediction' },
    ],
  },
  {
    term: 'Model Registry',
    abbr: null,
    definition: 'A versioned catalog of trained models with metadata (accuracy scores, training data, deployment status). In a closed-loop system, the registry tracks which model version is active, which are candidates for promotion, and the eval scores that triggered each transition.',
    tags: ['infrastructure', 'mlops'],
    links: [
      { label: 'Enterprise Features', to: '/enterprise' },
      { label: 'API: Deployments', to: '/docs/api-reference' },
    ],
  },
  {
    term: 'Multi-Token Prediction',
    abbr: 'MTP',
    definition: 'A technique where the model predicts multiple future tokens simultaneously instead of one at a time. By generating 2-4 tokens per forward pass, MTP can achieve 2-3x throughput improvements with minimal quality loss. Requires model architecture support and speculative decoding verification.',
    tags: ['performance', 'optimization'],
    links: [
      { label: 'Inference Optimization Guide', to: '/blog/ai-inference-optimization-qat-mig-multi-token-prediction' },
      { label: 'Cut Latency in Half', to: '/blog/cut-llm-inference-latency-in-half' },
    ],
  },
  {
    term: 'PagedAttention',
    abbr: null,
    definition: 'A memory management technique (pioneered by vLLM) that manages KV cache in non-contiguous memory blocks, similar to virtual memory paging in operating systems. Eliminates memory fragmentation and enables near-zero waste — increasing GPU memory utilization from ~50% to ~95% for batched inference.',
    tags: ['performance', 'vllm'],
    links: [
      { label: 'SDKs & Libraries', to: '/docs/sdks' },
    ],
  },
  {
    term: 'PLG',
    abbr: 'Product-Led Growth',
    definition: 'A go-to-market strategy where the product itself drives acquisition, activation, and expansion. For AI inference platforms, this means offering a free tier with enough value that developers adopt organically, then upgrade as usage grows. Slancha\'s free Router tier follows this model.',
    tags: ['business', 'growth'],
    links: [
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    term: 'QAT',
    abbr: 'Quantization-Aware Training',
    definition: 'A technique that simulates low-precision arithmetic during training so the model learns to compensate for quantization errors. Unlike post-training quantization (PTQ), QAT produces models that maintain near-full-precision quality at INT4/INT8 — typically within 0.5% of the original on standard benchmarks.',
    tags: ['quantization', 'optimization'],
    links: [
      { label: 'Inference Optimization Guide', to: '/blog/ai-inference-optimization-qat-mig-multi-token-prediction' },
      { label: 'Reduce Costs by 60%', to: '/blog/reduce-llm-api-costs-60-percent' },
    ],
  },
  {
    term: 'Quantization',
    abbr: null,
    definition: 'The process of reducing the numerical precision of model weights and activations (e.g., from FP32 to INT8 or INT4). This shrinks model size, reduces memory bandwidth requirements, and increases throughput — often 2-4x — with a controlled quality trade-off.',
    tags: ['optimization', 'performance'],
    links: [
      { label: 'Inference Optimization Guide', to: '/blog/ai-inference-optimization-qat-mig-multi-token-prediction' },
    ],
  },
  {
    term: 'RLS',
    abbr: 'Row-Level Security',
    definition: 'A database security feature (used in Supabase/PostgreSQL) that restricts which rows a user can access based on policies. For multi-tenant AI platforms, RLS ensures each customer can only see their own API keys, usage data, and model configurations — enforced at the database level.',
    tags: ['security', 'database'],
    links: [
      { label: 'Security & Compliance', to: '/security' },
    ],
  },
  {
    term: 'Router',
    abbr: null,
    definition: 'The component that receives incoming inference requests and selects the optimal model, provider, or configuration to handle each one. Slancha\'s router uses semantic classification via vLLM and Aurelio Semantic Router to match requests to specialized models based on task type, complexity, and cost constraints.',
    tags: ['routing', 'architecture', 'slancha'],
    links: [
      { label: 'Production Router Patterns', to: '/blog/production-ai-router-architecture-patterns' },
      { label: 'API: Router Config', to: '/docs/api-reference' },
    ],
  },
  {
    term: 'Semantic Router',
    abbr: null,
    definition: 'A routing layer that classifies requests by meaning rather than keywords. Uses embedding similarity to map incoming prompts to predefined task categories (code generation, summarization, creative writing, etc.), then routes to the model best suited for that category.',
    tags: ['routing', 'nlp'],
    links: [
      { label: 'How Slancha Routes', to: '/demo' },
    ],
  },
  {
    term: 'Shadow Traffic',
    abbr: null,
    definition: 'A deployment strategy where new model versions receive a copy of production requests without serving responses to users. The shadow model\'s outputs are evaluated against the live model to validate quality before promotion. Enables risk-free model upgrades in production.',
    tags: ['deployment', 'testing'],
    links: [
      { label: 'Production Router Patterns', to: '/blog/production-ai-router-architecture-patterns' },
    ],
  },
  {
    term: 'Speculative Decoding',
    abbr: null,
    definition: 'An inference acceleration technique that uses a small "draft" model to generate candidate tokens quickly, then verifies them in parallel with the larger target model. Accepted tokens are kept, rejected ones are regenerated. Can achieve 2-3x speedup when the draft model has high acceptance rates.',
    tags: ['performance', 'optimization'],
    links: [
      { label: 'Cut Latency in Half', to: '/blog/cut-llm-inference-latency-in-half' },
    ],
  },
  {
    term: 'Task Analysis',
    abbr: null,
    definition: 'The second stage of Slancha\'s pipeline — after routing, the system analyzes each request to understand its complexity, required capabilities, and quality expectations. This analysis informs downstream decisions about which optimizations to apply and what eval criteria to use.',
    tags: ['architecture', 'slancha'],
    links: [
      { label: 'Demo: 5-Step Walkthrough', to: '/demo' },
    ],
  },
  {
    term: 'TCO',
    abbr: 'Total Cost of Ownership',
    definition: 'The complete cost of running AI inference including API fees, GPU compute, engineering time for model management, monitoring, fine-tuning infrastructure, and incident response. TCO analysis often reveals that "cheaper" per-token pricing hides significant operational costs.',
    tags: ['business', 'cost-optimization'],
    links: [
      { label: 'ROI Calculator', to: '/roi-calculator' },
      { label: 'Pricing Comparison', to: '/pricing/compare' },
    ],
  },
  {
    term: 'Tensor Parallelism',
    abbr: 'TP',
    definition: 'A model parallelism strategy that splits individual layers across multiple GPUs. Each GPU holds a slice of every weight matrix and computes a portion of each operation. Reduces per-GPU memory requirements and enables serving models larger than a single GPU\'s memory.',
    tags: ['hardware', 'performance'],
    links: [
      { label: 'Enterprise Deployment', to: '/enterprise' },
    ],
  },
  {
    term: 'vLLM',
    abbr: null,
    definition: 'An open-source, high-throughput inference engine for large language models. Known for PagedAttention (efficient KV cache management), continuous batching, and OpenAI-compatible API. Slancha uses vLLM as the core inference backend for its routing layer.',
    tags: ['infrastructure', 'open-source', 'slancha'],
    links: [
      { label: 'SDKs & Libraries', to: '/docs/sdks' },
      { label: 'Integrations', to: '/integrations' },
    ],
  },
  {
    term: 'Webhook',
    abbr: null,
    definition: 'An HTTP callback that sends real-time notifications when events occur — model deployment completed, eval threshold exceeded, fine-tuning job finished. Webhooks enable event-driven architectures where downstream systems react to pipeline changes without polling.',
    tags: ['api', 'integration'],
    links: [
      { label: 'API: Webhooks', to: '/docs/api-reference' },
      { label: 'Dashboard: Webhooks', to: '/dashboard/webhooks' },
    ],
  },
  {
    term: 'Zero-Shot Routing',
    abbr: null,
    definition: 'The ability to route requests to appropriate models without task-specific training data. Uses pre-trained embedding similarity or LLM-based classification to make routing decisions on novel request types. Essential for handling the long tail of user queries in production.',
    tags: ['routing', 'ml'],
    links: [
      { label: 'How Slancha Routes', to: '/demo' },
    ],
  },
];

// Sort alphabetically
const sortedTerms = [...glossaryTerms].sort((a, b) =>
  a.term.toLowerCase().localeCompare(b.term.toLowerCase())
);

function GlossaryJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'AI Inference Glossary',
    description: 'Comprehensive glossary of AI inference, model optimization, and MLOps terminology.',
    url: 'https://slancha.ai/glossary',
    hasDefinedTerm: sortedTerms.map(t => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      url: `https://slancha.ai/glossary#${t.term.toLowerCase().replace(/\s+/g, '-')}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Glossary() {
  usePageMeta({
    title: 'AI Inference Glossary',
    description: `${sortedTerms.length} essential AI inference terms defined — QAT, MIG, LoRA, vLLM, semantic routing, and more. Technical definitions with links to guides and documentation.`,
  });

  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState(null);

  const filtered = useMemo(() => {
    let items = sortedTerms;
    if (activeLetter) {
      items = items.filter(t => t.term[0].toUpperCase() === activeLetter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        (t.abbr && t.abbr.toLowerCase().includes(q)) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return items;
  }, [search, activeLetter]);

  const grouped = useMemo(() => {
    const groups = {};
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    }
    return groups;
  }, [filtered]);

  const availableLetters = useMemo(() => {
    const letters = new Set(sortedTerms.map(t => t.term[0].toUpperCase()));
    return letters;
  }, []);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="page">
      <GlossaryJsonLd />
      <Nav />
      <main id="main-content" className="glossary-page">
        <div className="glossary-header">
          <h1>AI Inference Glossary</h1>
          <p>
            {sortedTerms.length} essential terms for AI inference, model optimization, and production ML — from quantization to semantic routing.
          </p>
        </div>

        <div className="glossary-controls">
          <div className="glossary-search">
            <input
              type="text"
              placeholder="Search terms, definitions, or tags..."
              aria-label="Search glossary terms"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveLetter(null); }}
            />
          </div>
          <div className="glossary-alpha">
            <button
              className={`alpha-btn ${!activeLetter ? 'active' : ''}`}
              onClick={() => setActiveLetter(null)}
            >
              All
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                className={`alpha-btn ${activeLetter === letter ? 'active' : ''} ${!availableLetters.has(letter) ? 'disabled' : ''}`}
                onClick={() => availableLetters.has(letter) && setActiveLetter(activeLetter === letter ? null : letter)}
                disabled={!availableLetters.has(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="glossary-count">
          {filtered.length === sortedTerms.length
            ? `${sortedTerms.length} terms`
            : `${filtered.length} of ${sortedTerms.length} terms`}
        </div>

        {filtered.length === 0 ? (
          <div className="glossary-empty">
            <p>No terms match "{search}". Try a different search or clear filters.</p>
          </div>
        ) : (
          Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, terms]) => (
              <div key={letter} className="glossary-group" id={`letter-${letter}`}>
                <h2 className="glossary-letter">{letter}</h2>
                {terms.map(t => (
                  <div
                    key={t.term}
                    className="glossary-term"
                    id={t.term.toLowerCase().replace(/\s+/g, '-')}
                  >
                    <h3 className="term-name">
                      {t.term}
                      {t.abbr && <span className="term-abbr">({t.abbr})</span>}
                    </h3>
                    <p className="term-def">{t.definition}</p>
                    {t.links.length > 0 && (
                      <div className="term-links">
                        {t.links.map(link => (
                          <Link key={link.to} to={link.to} className="term-link">
                            → {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                    {t.tags.length > 0 && (
                      <div className="term-tags">
                        {t.tags.map(tag => (
                          <span key={tag} className="term-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
        )}

        <div className="glossary-cta">
          <h2>Ready to see these concepts in action?</h2>
          <p>Slancha handles routing, fine-tuning, quantization, and optimization behind a single API endpoint.</p>
          <Link to="/demo" className="btn-primary">See the Demo</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

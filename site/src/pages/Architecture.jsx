import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Architecture.css';

const layers = [
  {
    id: 'router',
    num: 'Layer 1',
    icon: '\u2194\uFE0F',
    title: 'Model Router',
    short: 'Routes every request to the optimal model in sub-millisecond time. No model selection required.',
    tagline: 'Customer Gateway \u2014 single API endpoint for all inference',
    desc: [
      'Every customer gets a single API endpoint. Requests are classified using semantic embedding similarity \u2014 not LLM inference \u2014 so routing decisions happen in sub-millisecond time, orders of magnitude faster than classification-based routers.',
      'The router matches incoming queries against pre-defined route utterances using cosine similarity and k-nearest neighbor classification. As more data flows through, the router\'s utterance-based routes are continuously updated to better reflect each customer\'s actual task distribution.',
      'Even before fine-tuning kicks in, the router saves money by sending simple tasks (summarization, basic QA) to smaller, cheaper models instead of defaulting to expensive frontier models.'
    ],
    tech: [
      { label: 'vLLM', detail: 'High-throughput serving engine with PagedAttention for memory-efficient KV cache management' },
      { label: 'Semantic Router', detail: 'Aurelio Labs library \u2014 embedding-based routing via cosine similarity, fully local' },
      { label: 'OpenAI-compatible API', detail: 'Drop-in replacement \u2014 change one line to migrate from any provider' },
      { label: 'Continuous batching', detail: 'Maximizes GPU utilization by processing requests as they arrive' }
    ],
    badgeClass: 'arch-layer-badge-1'
  },
  {
    id: 'analysis',
    num: 'Layer 2',
    icon: '\uD83D\uDD0D',
    title: 'Task Analysis',
    short: 'Classifies every request and curates training data from live usage patterns automatically.',
    tagline: 'Data Curation \u2014 learning from live traffic, not uploaded datasets',
    desc: [
      'Behind the router, Slancha performs ongoing analysis of every request. Tasks are classified into categories: summarization, content generation, code generation (short and long-form), question answering, and needle-in-a-haystack retrieval.',
      'As requests flow through from a specific customer, Slancha automatically curates training data from their actual usage patterns. This is not from customer-provided datasets \u2014 it happens automatically based on real production requests.',
      'This continuous data curation is what enables the fine-tuning layer to build task-specific models that match each customer\'s actual workload distribution.'
    ],
    tech: [
      { label: 'Task classification', detail: 'Summarization, code gen, QA, retrieval, content generation \u2014 auto-detected' },
      { label: 'Usage pattern analysis', detail: 'Request volume, task distribution, latency sensitivity per customer' },
      { label: 'Automatic data curation', detail: 'Training data built from live traffic \u2014 no customer action required' },
      { label: 'Quality scoring', detail: 'Filters training candidates by response quality and task representativeness' }
    ],
    badgeClass: 'arch-layer-badge-2'
  },
  {
    id: 'finetuning',
    num: 'Layer 3',
    icon: '\u2699\uFE0F',
    title: 'Automated Fine-Tuning',
    short: 'Fine-tunes smaller, task-specific models on each customer\'s usage data \u2014 behind the scenes.',
    tagline: 'Model Factory \u2014 custom models without ML teams',
    desc: [
      'Using the curated task data, Slancha fine-tunes smaller, task-specific models for each customer\'s common workloads. Customers don\'t see or manage this process \u2014 it happens entirely behind the scenes.',
      'The goal: migrate customers off expensive frontier models and onto their own fine-tuned models that match or outperform the frontier on their specific tasks. A fine-tuned 7B model on summarization can match GPT-4-class output at a fraction of the cost.',
      'When new open-source architectures are released, Slancha automatically re-fine-tunes on the latest architecture using existing curated data. Customers get a free performance upgrade without any action.'
    ],
    tech: [
      { label: 'SFT / DPO / RLHF', detail: 'Multiple fine-tuning strategies selected per task type automatically' },
      { label: 'Hyperparameter optimization', detail: 'Learning rate, epochs, batch size, LoRA rank \u2014 all auto-tuned' },
      { label: 'Architecture selection', detail: 'Picks the optimal base model size and architecture per workload' },
      { label: 'Auto-redeployment', detail: 'New models promoted to production when they beat the incumbent on eval metrics' }
    ],
    badgeClass: 'arch-layer-badge-3'
  },
  {
    id: 'optimization',
    num: 'Layer 4',
    icon: '\u26A1',
    title: 'Inference Optimization',
    short: 'QAT, MIG partitioning, and multi-token prediction squeeze maximum performance from hardware.',
    tagline: 'Hardware Efficiency \u2014 4x memory reduction, multi-GPU packing',
    desc: [
      'Even beyond fine-tuning, significant performance gains come from how models are served. Quantization-aware training (QAT) reduces models to 4-bit precision during training \u2014 not as a post-hoc approximation \u2014 preserving quality while cutting memory requirements by 4x or more.',
      'NVIDIA Multi-Instance GPU (MIG) technology on Blackwell B200/B300 GPUs partitions a single GPU into multiple hardware-isolated instances. This enables packing multiple customer LLMs onto a single GPU with dedicated compute, memory, and cache per instance.',
      'Multi-token prediction generates multiple output tokens per forward pass, increasing throughput beyond standard autoregressive decoding. Combined with speculative decoding and continuous batching, these techniques deliver dramatic cost and latency improvements.'
    ],
    tech: [
      { label: 'QAT (INT4/FP4)', detail: 'Quantization during training \u2014 4-bit serving with no quality degradation' },
      { label: 'MIG on B200/B300', detail: 'Hardware-isolated GPU partitions for multi-tenant serving' },
      { label: 'Multi-token prediction', detail: 'Multiple tokens per forward pass for higher throughput' },
      { label: 'Speculative decoding', detail: 'Draft model + verification for latency reduction on specific model pairs' }
    ],
    badgeClass: 'arch-layer-badge-4'
  }
];

const dataFlow = [
  { title: 'API Request Arrives', desc: 'Customer sends a prompt to their single Slancha endpoint. Standard OpenAI-compatible format \u2014 no SDK changes needed.', time: '0ms' },
  { title: 'Semantic Classification', desc: 'The router embeds the query and classifies it against known route utterances using cosine similarity. No LLM inference \u2014 sub-millisecond decision.', time: '<1ms' },
  { title: 'Model Selection', desc: 'Based on task type, latency requirements, and available fine-tuned models, the router selects the optimal model. Simple tasks hit smaller models; complex tasks hit specialized fine-tuned models.', time: '<1ms' },
  { title: 'Optimized Inference', desc: 'The selected model runs on QAT-quantized weights, MIG-partitioned GPU instances, with continuous batching and multi-token prediction. Maximum hardware efficiency.', time: '50-500ms' },
  { title: 'Response + Data Capture', desc: 'Response streams back to the customer. Simultaneously, the request-response pair is captured for task analysis and training data curation.', time: 'Streaming' },
  { title: 'Background: Analyze & Fine-Tune', desc: 'Asynchronously, Slancha analyzes accumulated data, curates training sets, fine-tunes task-specific models, and promotes improved models to production. The loop closes.', time: 'Continuous' }
];

export default function Architecture() {
  const [activeLayer, setActiveLayer] = useState(null);

  usePageMeta({
    title: 'Architecture',
    description: 'Deep dive into Slancha\'s four-layer closed-loop architecture: Model Router, Task Analysis, Automated Fine-Tuning, and Inference Optimization. Learn how the platform continuously improves behind a single API endpoint.'
  });

  return (
    <div className="arch-page">
      <Nav />

      {/* Hero */}
      <section className="arch-hero">
        <p className="arch-hero-eyebrow">Technical Architecture</p>
        <h1>Four Layers. One Endpoint. Continuous Improvement.</h1>
        <p className="arch-hero-sub">
          Slancha is not a model marketplace or an inference proxy. It's a closed-loop system
          that routes, analyzes, fine-tunes, optimizes, and redeploys &mdash; continuously,
          behind a single API endpoint. Here's how it works under the hood.
        </p>
      </section>

      {/* Loop Diagram */}
      <section className="arch-loop">
        <h2 className="arch-loop-title">The Closed Loop</h2>
        <p className="arch-loop-subtitle">
          Each layer feeds the next. The system gets better with every request.
        </p>
        <div className="arch-loop-diagram">
          <div className="arch-loop-center">
            <svg className="arch-loop-center-icon" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="1.5">
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          </div>
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`arch-loop-node ${activeLayer === layer.id ? 'active' : ''}`}
              onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveLayer(activeLayer === layer.id ? null : layer.id)}
              aria-expanded={activeLayer === layer.id}
            >
              <span className="arch-loop-node-number">{layer.num}</span>
              <div className="arch-loop-node-icon">{layer.icon}</div>
              <h3>{layer.title}</h3>
              <p>{layer.short}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layer Deep Dives */}
      <section className="arch-layers">
        {layers.map((layer) => (
          <div key={layer.id} className="arch-layer" id={layer.id}>
            <div className="arch-layer-header">
              <div className={`arch-layer-badge ${layer.badgeClass}`}>
                {layer.num.split(' ')[1]}
              </div>
              <div className="arch-layer-header-text">
                <h2>{layer.title}</h2>
                <p className="arch-layer-tagline">{layer.tagline}</p>
              </div>
            </div>
            <div className="arch-layer-body">
              <div className="arch-layer-desc">
                {layer.desc.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="arch-layer-tech">
                <h4>Key Technologies</h4>
                {layer.tech.map((t, i) => (
                  <div key={i} className="arch-tech-item">
                    <span className="arch-tech-dot" />
                    <span><strong>{t.label}:</strong> {t.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Core Insight */}
      <section className="arch-insight">
        <div className="arch-insight-card">
          <h2>The Core Technical Insight</h2>
          <p>
            The router captures easy wins. Fine-tuning captures hard wins. Together,
            they cover the full spectrum of customer workloads.
          </p>
          <div className="arch-insight-grid">
            <div className="arch-insight-item">
              <h4>Easy Tasks (Summarization, QA)</h4>
              <p>
                Even a generalized smaller model performs identically to frontier models.
                Routing alone captures these savings &mdash; no fine-tuning needed.
              </p>
            </div>
            <div className="arch-insight-item">
              <h4>Hard Tasks (Long-form Code, Generation)</h4>
              <p>
                Smaller models struggle out of the box, but fine-tuned specifically for the task,
                they match or outperform frontier generalists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="arch-flow">
        <h2>Request Lifecycle</h2>
        <div className="arch-flow-steps">
          {dataFlow.map((step, i) => (
            <div key={i} className="arch-flow-step">
              <div className="arch-flow-line">
                <div className="arch-flow-dot" />
                {i < dataFlow.length - 1 && <div className="arch-flow-connector" />}
              </div>
              <div className="arch-flow-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                <div className="arch-flow-time">{step.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section className="arch-code">
        <h2>One Endpoint. That's It.</h2>
        <p className="arch-code-sub">
          All four layers work behind a standard OpenAI-compatible API. No SDK changes needed.
        </p>
        <div className="arch-code-block">
          <div className="arch-code-header">
            <span className="arch-code-dot" />
            <span className="arch-code-dot" />
            <span className="arch-code-dot" />
            <span className="arch-code-lang">Python</span>
          </div>
          <div className="arch-code-body">
            <pre>{`\
`}<span className="keyword">import</span>{` openai\n\n`}<span className="comment">{`# Point to Slancha — everything else stays the same`}</span>{`\nclient = openai.OpenAI(\n    base_url=`}<span className="string">"https://api.slancha.ai/v1"</span>{`,\n    api_key=`}<span className="string">"sk-your-slancha-key"</span>{`\n)\n\n`}<span className="comment">{`# Slancha handles: routing, model selection, optimization`}</span>{`\nresponse = client.chat.completions.`}<span className="func">create</span>{`(\n    model=`}<span className="string">"auto"</span>{`,  `}<span className="comment">{`# Slancha picks the best model for this task`}</span>{`\n    messages=[{`}<span className="string">"role"</span>{`: `}<span className="string">"user"</span>{`, `}<span className="string">"content"</span>{`: prompt}]\n)\n\n`}<span className="comment">{`# Behind the scenes: semantic classification, task-specific\n# fine-tuned model, QAT-quantized, MIG-partitioned GPU,\n# multi-token prediction. You see none of it.`}</span>{`\nprint(response.choices[0].message.content)`}</pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="arch-cta">
        <h2>See It In Action</h2>
        <p>
          The architecture does the work. You just use the API.
          Start with the free router tier &mdash; fine-tuning kicks in automatically as your usage grows.
        </p>
        <div className="arch-cta-buttons">
          <Link to="/signup" className="arch-cta-primary">Start Free</Link>
          <Link to="/docs/quickstart" className="arch-cta-secondary">Read the Docs</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

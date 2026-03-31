import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './Features.css';

const features = [
  {
    icon: '⚡',
    title: 'Intelligent Model Routing',
    body: 'Every request goes to the right-sized model. Easy tasks hit efficient models. Hard tasks hit capable ones. The router uses semantic similarity for sub-millisecond classification — no LLM overhead.',
  },
  {
    icon: '🔍',
    title: 'Automatic Task Analysis',
    body: 'Slancha continuously analyzes what you send — summarization, code gen, QA, retrieval. This task data becomes the foundation for everything that follows.',
  },
  {
    icon: '🔄',
    title: 'Behind-the-Scenes Fine-Tuning',
    body: 'Task-specific models are fine-tuned on your actual usage patterns. Smaller models that match or outperform frontier generalists on your workloads. You never see it happen.',
  },
  {
    icon: '🚀',
    title: 'Inference Optimization',
    body: 'Quantization-aware training to 4-bit precision. Multi-Instance GPU packing on B200/B300 hardware. Multi-token prediction. More throughput, less cost.',
  },
  {
    icon: '♻️',
    title: 'Continuous Redeployment',
    body: 'When new open-source architectures drop, Slancha re-fine-tunes using your existing curated data. Performance improves automatically. Zero action required.',
  },
  {
    icon: '🔒',
    title: 'Future-Proof Against Price Hikes',
    body: 'Frontier providers are selling at a loss. When prices rise, Slancha customers are already on optimized, fine-tuned models that cost a fraction of frontier inference.',
  },
];

export default function Features() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="features section-padded reveal" id="features">
      <h2 className="section-title">The full loop, behind one endpoint</h2>
      <div className="features-grid">
        {features.map(f => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-body">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

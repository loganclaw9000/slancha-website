import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './HowItWorks.css';

const steps = [
  {
    num: '01',
    title: 'Route',
    body: 'Your request hits the Slancha API endpoint. A semantic router classifies the task in sub-millisecond time and sends it to the right-sized model — no frontier pricing for simple tasks.',
  },
  {
    num: '02',
    title: 'Analyze',
    body: 'Behind the scenes, Slancha categorizes your traffic: summarization, code gen, QA, retrieval. This builds a picture of your actual workloads and curates training data from real usage.',
  },
  {
    num: '03',
    title: 'Fine-tune',
    body: 'Task-specific models are automatically fine-tuned on your curated data. Smaller models that match or outperform frontier generalists — on your tasks specifically. You never lift a finger.',
  },
  {
    num: '04',
    title: 'Optimize & Redeploy',
    body: 'Quantization-aware training, MIG GPU packing, multi-token prediction. Your fine-tuned models are optimized and redeployed continuously. New architectures drop? Auto-upgrade.',
  },
];

export default function HowItWorks() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="how-it-works section-padded reveal" id="how-it-works">
      <h2 className="section-title">Route. Analyze. Fine-tune. Optimize. Repeat.</h2>
      <div className="step-grid">
        {steps.map(step => (
          <div className="step-card" key={step.num}>
            <div className="step-num">{step.num}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-body">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

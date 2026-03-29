import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './HowItWorks.css';

const steps = [
  {
    num: '01',
    title: 'Evaluate',
    body: 'Benchmark models against your real production workloads. Slancha evaluates cost, latency, and task accuracy on actual traffic — not synthetic benchmarks. Compare candidates side-by-side before you commit.',
  },
  {
    num: '02',
    title: 'Deploy',
    body: 'Ship the winner to the right inference layer: API, managed hosting, or on-prem. Slancha handles routing, scaling, and optimization across all three dimensions simultaneously.',
  },
  {
    num: '03',
    title: 'Post-train',
    body: 'Production signal captured during inference automatically becomes fine-tuning data. No manual exports, no data wrangling, no broken handoffs between eval and training teams.',
  },
  {
    num: '04',
    title: 'Repeat',
    body: 'Run the loop again with a better model. Track accuracy gains and cost-per-task across cycles. The compounding effect starts immediately — and widens the longer you run.',
  },
];

export default function HowItWorks() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="how-it-works section-padded reveal" id="how-it-works">
      <h2 className="section-title">Eval. Deploy. Post-train. Repeat.</h2>
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

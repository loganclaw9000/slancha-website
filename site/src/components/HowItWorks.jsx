import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './HowItWorks.css';

const steps = [
  {
    num: '01',
    title: 'Set Latency Target',
    body: 'Choose the exact latency (P99) you need for your inference workload. Our UI lets you specify a target in milliseconds, so you know precisely what performance means for your users.',
  },
  {
    num: '02',
    title: 'Optimize Model',
    body: 'We automatically apply state‑of‑the‑art techniques—quantization, pruning, and TensorRT acceleration—to squeeze the best speed out of any model while preserving accuracy.',
  },
  {
    num: '03',
    title: 'Deploy & Save Costs',
    body: 'Slancha provisions the optimal hardware stack, deploys your tuned model, and shows you a clear cost estimate. You get predictable latency without over‑provisioning.',
  },
];

export default function HowItWorks() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="how-it-works section-padded reveal" id="how-it-works">
      <h2 className="section-title">One number in. Optimized system out.</h2>
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

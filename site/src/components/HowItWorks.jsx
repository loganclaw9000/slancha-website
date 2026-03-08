import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './HowItWorks.css';

const steps = [
  {
    num: '01',
    title: 'Set your latency target',
    body: 'Tell us your P99 requirement. That number is your contract with us — every downstream decision is made to meet it. No SLA negotiation, no vague benchmarks. You pick the number; we\'re accountable to it.',
  },
  {
    num: '02',
    title: 'We optimize your model',
    body: 'Quantization, pruning, TensorRT compilation — we select and compose the right transformations automatically. Our control plane runs benchmark sweeps across your model to find the configuration that hits your target at the lowest cost.',
  },
  {
    num: '03',
    title: 'Ship to prod, cut your bill',
    body: 'Deploy to our managed hosting or receive a self-contained NIM package with CloudFormation templates for your own cloud. We charge a premium on the cost savings we generate — if we don\'t save you money, we don\'t win.',
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

import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';

const props = [
  {
    title: 'Stop losing signal between tools.',
    body: 'Slancha captures production signal during inference and routes it directly into your fine-tuning pipeline — no manual exports, no lost context, no broken handoffs between eval and training teams.',
  },
  {
    title: 'Optimize across three dimensions simultaneously.',
    body: 'Benchmark cost, latency, and accuracy against your real workloads, then deploy across API, hosted, or on-prem inference. Slancha optimizes on all three at once, not just one.',
  },
  {
    title: 'Compounding improvement by design.',
    body: 'Each eval → deploy → post-train cycle produces a better model at lower cost. Slancha tracks gains across cycles so you see the compounding effect — not just snapshot metrics.',
  },
];

export default function ValueProps() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="features section-padded reveal" id="value-props">
      <div className="features-grid">
        {props.map(p => (
          <div className="feature-card" key={p.title}>
            <h3 className="feature-title">{p.title}</h3>
            <p className="feature-body">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

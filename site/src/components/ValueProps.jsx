import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';

const props = [
  {
    title: 'Instant cost savings.',
    body: 'The router sends every request to the right-sized model. Stop paying frontier prices for tasks a smaller model handles identically.',
  },
  {
    title: 'Compounding improvement.',
    body: 'Slancha fine-tunes task-specific models on your actual usage data. The longer you use it, the better and cheaper it gets. Automatically.',
  },
  {
    title: 'Zero technical overhead.',
    body: 'No model selection. No benchmarking. No fine-tuning teams. No architecture decisions. You just use the API.',
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

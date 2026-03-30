import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';

const props = [
  {
    title: 'Latency‑first, cost‑smart.',
    body: 'We start with your SLA target and work backward, delivering the lowest‑cost inference that still meets latency goals.',
  },
  {
    title: 'Hardware‑agnostic mastery.',
    body: 'Whether you run on AWS Inferentia, NVIDIA L40S, or a B200, Slancha auto‑selects the optimal stack so you never worry about vendor lock‑in.',
  },
  {
    title: 'Zero‑team inference ops.',
    body: 'No dedicated ML engineers needed – our platform becomes your inference team, handling scaling, tuning, and monitoring for you.',
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

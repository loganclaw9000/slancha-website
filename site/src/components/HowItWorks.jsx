import React from 'react';
import './HowItWorks.css';

// COPY_PENDING: replace placeholder steps with actual copy from site/copy/how-it-works.md
const steps = [
  { num: '01', title: 'Step One', body: 'Description for step one.' },
  { num: '02', title: 'Step Two', body: 'Description for step two.' },
  { num: '03', title: 'Step Three', body: 'Description for step three.' },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works section-padded" id="how-it-works">
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


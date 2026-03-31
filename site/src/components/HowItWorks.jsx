import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import PipelineViz from './PipelineViz';
import './HowItWorks.css';

export default function HowItWorks() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="how-it-works section-padded reveal" id="how-it-works">
      <h2 className="section-title">Route. Analyze. Fine-tune. Optimize. Repeat.</h2>
      <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 8px', fontSize: 16, lineHeight: 1.6 }}>
        One API call triggers a continuous optimization loop. Click any stage to learn more.
      </p>
      <PipelineViz />
    </section>
  );
}

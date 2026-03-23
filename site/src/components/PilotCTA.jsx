import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../utils/useScrollReveal';
import './PilotCTA.css';

export default function PilotCTA() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="pilot-cta reveal">
      <div className="pilot-cta-inner">
        <h2 className="pilot-cta-headline">Running production inference with a growing cloud bill? Let's talk.</h2>
        <p className="pilot-cta-body">
          If you're scaling AI workloads and need cost‑effective latency, our pilot gets you started fast.
          We'll assess your stack, set up a proof‑of‑concept, and show savings in weeks.
        </p>
        <Link to="/contact" className="btn-primary btn-lg">Start My Pilot</Link>
        <a href="mailto:contact@slancha.ai" className="pilot-cta-email">contact@slancha.ai</a>
      </div>
    </section>
  );
}

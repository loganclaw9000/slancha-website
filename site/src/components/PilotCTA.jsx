import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../utils/useScrollReveal';
import './PilotCTA.css';

export default function PilotCTA() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="pilot-cta reveal">
      <div className="pilot-cta-inner">
        <h2 className="pilot-cta-headline">Paying frontier prices for every request? There's a better way.</h2>
        <p className="pilot-cta-body">
          Slancha gives you a single API endpoint that continuously gets smarter, faster, and cheaper.
          No model selection. No fine-tuning teams. No infrastructure decisions. Just better inference.
        </p>
        <Link to="/signup" className="btn-primary btn-lg">Get Your Endpoint</Link>
        <a href="mailto:contact@slancha.ai" className="pilot-cta-email">contact@slancha.ai</a>
      </div>
    </section>
  );
}

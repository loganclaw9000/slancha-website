import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../utils/useScrollReveal';
import './PilotCTA.css';

export default function PilotCTA() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="pilot-cta reveal">
      <div className="pilot-cta-inner">
        <h2 className="pilot-cta-headline">Running your AI engineering loop across 4+ tools? There's a better way.</h2>
        <p className="pilot-cta-body">
          If your team is manually stitching together eval, inference, and fine-tuning today, our pilot program
          is built for you. We'll instrument your existing workloads, run your first eval-deploy-post-train cycle,
          and show you the baseline metrics before you commit to anything.
        </p>
        <Link to="/signup" className="btn-primary btn-lg">Create Your Account</Link>
        <a href="mailto:contact@slancha.ai" className="pilot-cta-email">contact@slancha.ai</a>
      </div>
    </section>
  );
}

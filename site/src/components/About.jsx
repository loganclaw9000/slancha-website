import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './About.css';

export default function About() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="about section-padded reveal" id="about">
      <div className="about-inner">
        <h2 className="section-title">The platform that closes the AI engineering loop.</h2>
        <div className="about-body">
          <p>
            Mature AI teams run the same cycle manually: benchmark models against production workloads, deploy the winner, collect signal, fine-tune, and repeat. The problem isn't that they don't know the process — it's that their tools don't talk to each other. Eval data doesn't reach fine-tuning. Deployment decisions aren't backed by real benchmarks. Signal gets lost at every handoff.
          </p>
          <p>
            Slancha owns the full cycle through a single platform with a shared data layer: evaluate, deploy, post-train, repeat. Every iteration makes your models better and cheaper to run.
          </p>
          <ul className="about-reasons">
            <li><strong>The full loop, not point tools</strong> — one platform covers eval, inference, and post-training with data flowing natively between them.</li>
            <li><strong>No dedicated inference team required</strong> — Slancha handles hardware selection, cost routing, and SLA compliance automatically.</li>
            <li><strong>Compounding improvement by design</strong> — your models get better over time without manual intervention.</li>
          </ul>
          <p>
            If you're managing 4–6 tools to approximate what Slancha does natively, let's talk.
          </p>
        </div>
      </div>
    </section>
  );
}

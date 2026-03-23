import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './About.css';

export default function About() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="about section-padded reveal" id="about">
      <div className="about-inner">
        <h2 className="section-title">Built for teams who ship</h2>
        <div className="about-body">
          <p>
            Slancha empowers developers and enterprises to run inference workloads at the edge of latency and cost. We combine cutting‑edge hardware selection, automated optimization, and a managed control plane so you can focus on building models—not managing infrastructure.
          </p>
          <p>
            Our platform continuously evaluates your workload, picks the right hardware—from NVIDIA L40S to AWS Inferentia—sets the optimal batch size, and scales in real time. The result: lower latency, predictable costs, and no need for an internal inference ops team.
          </p>
          <p>
            Whether you're a startup launching a new AI product or a large organization scaling existing services, Slancha delivers a seamless, latency‑first experience that lets you ship faster and stay competitive.
          </p>
        </div>
      </div>
    </section>
  );
}

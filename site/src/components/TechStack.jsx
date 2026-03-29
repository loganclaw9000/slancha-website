import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './TechStack.css';

const pills = ["vLLM", "NVIDIA Triton", "PyTorch", "Axolotl", "Shared Data Layer"];

export default function TechStack() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="tech-stack reveal">
      <p className="tech-label">BUILT ON</p>
      <h2 className="tech-heading">Best-in-class open infrastructure</h2>
      <p className="tech-body">
        Slancha's platform is built on best-in-class open infrastructure at every layer: vLLM and NVIDIA Triton
        for inference serving, PyTorch and Axolotl for post-training, plus a shared data layer that connects eval
        output directly to fine-tuning input. You bring the models and the production workloads. We handle the
        infrastructure decisions — which backend, which hardware, which fine-tuning config — so your team stays
        focused on the task scores, not the tooling.
      </p>
      <div className="tech-pills">
        {pills.map(tool => (
          <span className="tech-pill" key={tool}>{tool}</span>
        ))}
      </div>
      <p className="tech-footer">You bring the workloads. We handle the infrastructure.</p>
    </section>
  );
}

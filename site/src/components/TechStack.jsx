import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './TechStack.css';

const pills = ["TensorRT", "TensorRT-LLM", "vLLM", "ONNX", "llmcompressor"];

export default function TechStack() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="tech-stack reveal">
      <p className="tech-label">BUILT ON</p>
      <h2 className="tech-heading">Best‑in‑class inference toolchain</h2>
      <p className="tech-body">
        Slancha's control plane orchestrates inference across a best‑in‑class toolchain—think NVIDIA TensorRT,
        AWS Inferentia, and Google Cloud TPU—so you never have to juggle hardware specifics. It automatically
        selects the optimal runtime, scaling policies, and cost‑performance trade‑offs based on your latency target.
      </p>
      <div className="tech-pills">
        {pills.map(tool => (
          <span className="tech-pill" key={tool}>{tool}</span>
        ))}
      </div>
      <p className="tech-footer">You pick the latency target. We pick the stack.</p>
    </section>
  );
}

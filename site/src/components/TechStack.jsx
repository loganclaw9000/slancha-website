import React from 'react';
import { Link } from 'react-router-dom';
import '../components/TechStack.css';

// Placeholder copy – replace with actual content from site/copy/tech-stack.md when available
const heading = "Built on cutting‑edge AI infrastructure";
const body = "Leverage the latest tools in machine learning to deliver unparalleled performance and scalability.";
const pills = ["TensorRT", "TensorRT-LLM", "vLLM", "ONNX", "llmcompressor"];

export default function TechStack() {
  return (
    <section className="tech-stack">
      <p className="tech-label">BUILT ON</p>
      <h2 className="tech-heading">{heading}</h2>
      <p className="tech-body">{body}</p>
      <div className="tech-pills">
        {pills.map(tool => (
          <span className="tech-pill" key={tool}>{tool}</span>
        ))}
      </div>
      <p className="tech-footer">Slancha's control plane selects and composes these automatically.</p>
    </section>
  );
}

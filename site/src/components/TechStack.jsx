import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';
import './TechStack.css';

const HEADING = 'Best-in-class toolchain. Zero configuration.';
const BODY = "Slancha's control plane makes optimization decisions across TensorRT-LLM, vLLM, and llmcompressor — so you don't have to evaluate, configure, or maintain any of it. You pick the latency target. We pick the stack.";
const PILLS = ['TensorRT', 'TensorRT-LLM', 'vLLM', 'ONNX', 'llmcompressor'];

export default function TechStack() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="tech-stack reveal">
      <p className="tech-label">BUILT ON</p>
      <h2 className="tech-heading">{HEADING}</h2>
      <p className="tech-body">{BODY}</p>
      <div className="tech-pills">
        {PILLS.map(tool => (
          <span className="tech-pill" key={tool}>{tool}</span>
        ))}
      </div>
      <p className="tech-footer">Slancha's control plane selects and composes these automatically.</p>
    </section>
  );
}

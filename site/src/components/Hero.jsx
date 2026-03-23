import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => (
  <section className="hero" id="hero">
    <p className="hero-eyebrow">Inference Optimization Platform</p>
    <h1 className="hero-h1">The Databricks of<br /><span className="hero-accent">AI Inference</span></h1>
    <p className="hero-subtitle">Slancha lets you set precise latency targets and instantly delivers optimized models—no jargon, no guesswork. We handle quantization, pruning, and hardware selection so you get predictable performance without hiring a specialist.</p>
    <div className="hero-cta">
      <Link to="/contact" className="btn-primary btn-lg">Request a Pilot</Link>
      <a href="#how-it-works" className="btn-secondary btn-lg">See How It Works</a>
    </div>
  </section>
);

export default Hero;

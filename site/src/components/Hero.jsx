import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => (
  <section className="hero" id="hero">
    <h1 className="hero-h1">The Databricks of<br /><span className="hero-accent">AI Engineering.</span></h1>
    <p className="hero-subtitle">The only platform that owns the full loop: benchmark models against your production workloads, deploy the winner, post-train on what you learn, and repeat. Eval data flows directly into fine-tuning. No manual exports. No lost signal.</p>
    <div className="hero-cta">
      <Link to="/contact" className="btn-primary btn-lg">Apply for the Pilot</Link>
      <a href="#how-it-works" className="btn-secondary btn-lg">See How It Works</a>
    </div>
  </section>
);

export default Hero;

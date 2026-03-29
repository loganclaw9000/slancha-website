import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => (
  <section className="hero" id="hero">
    <div className="hero-triskele-wrap" aria-hidden="true">
      <svg className="hero-triskele" viewBox="0 0 100 100" width="500" height="500" fill="none" strokeWidth="2" strokeLinecap="round">
        <defs>
          <linearGradient id="hero-tg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A84FF" />
            <stop offset="100%" stopColor="#00D1B2" />
          </linearGradient>
        </defs>
        <g stroke="url(#hero-tg)">
          <path d="M50 50 Q50 28 35 12 Q22 22 22 40 Q22 50 50 50" />
          <path d="M50 50 Q69 59 87 52 Q85 36 72 28 Q63 24 50 50" />
          <path d="M50 50 Q31 63 28 85 Q43 92 56 82 Q65 75 50 50" />
        </g>
      </svg>
    </div>
    <h1 className="hero-h1">The Databricks of<br /><span className="gradient-text">AI Engineering.</span></h1>
    <p className="hero-subtitle">The only platform that owns the full loop: benchmark models against your production workloads, deploy the winner, post-train on what you learn, and repeat. Eval data flows directly into fine-tuning. No manual exports. No lost signal.</p>
    <div className="hero-cta">
      <Link to="/signup" className="btn-primary btn-lg hero-cta-primary">Get Started Free</Link>
      <a href="#how-it-works" className="btn-secondary btn-lg">See How It Works</a>
    </div>
  </section>
);

export default Hero;

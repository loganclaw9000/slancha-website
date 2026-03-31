import React from 'react';
import { Link } from 'react-router-dom';
import { ParticleBackground } from './ParticleBackground';
import './Hero.css';

const Hero = () => (
  <section className="hero" id="hero">
    <ParticleBackground />
    
    <div className="hero-content">
      {/* Eyebrow */}
      <div className="hero-eyebrow">
        AI Engineering Platform
      </div>

      {/* Headline */}
      <h1 className="hero-h1">
        Evaluate models. <br />
        Deploy the winner. <br />
        <span className="gradient-text">Repeat.</span>
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle">
        Automated model evaluation, one-click deployment, and continuous 
        post-training for AI teams shipping production systems.
      </p>

      {/* CTAs */}
      <div className="hero-cta">
        <Link to="/signup" className="btn-primary btn-lg hero-cta-primary">
          Start Free Trial
        </Link>
        <a href="#how-it-works" className="btn-secondary btn-lg">
          Watch 2-Min Demo
        </a>
      </div>

      {/* Micro-proof */}
      <div className="hero-proof">
        <p>Trusted by AI teams at</p>
        <div className="customer-logos">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="customer-logo">
              Customer {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

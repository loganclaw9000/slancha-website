import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const EYEBROW = 'INFERENCE OPTIMIZATION PLATFORM';
const H1_LINE1 = 'Pick your latency.';
const H1_LINE2 = 'We handle the rest.';
const SUBTITLE = 'The inference optimization platform for teams running production AI. Set a P99 latency target — we optimize your model, select the hardware, and manage costs automatically.';
const PRIMARY_CTA = 'Request a Pilot';
const SECONDARY_CTA = 'See how it works';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <p className="hero-eyebrow">{EYEBROW}</p>
      <h1 className="hero-h1">
        {H1_LINE1}<br />
        <span className="hero-accent">{H1_LINE2}</span>
      </h1>
      <p className="hero-subtitle">{SUBTITLE}</p>
      <div className="hero-cta">
        <Link to="/contact" className="btn-primary btn-lg">{PRIMARY_CTA}</Link>
        <a href="#how-it-works" className="btn-secondary btn-lg">{SECONDARY_CTA}</a>
      </div>
    </section>
  );
}

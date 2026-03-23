import React from 'react';
import { Link } from 'react-router-dom';
import '../components/PilotCTA.css';

// Placeholder copy – replace with actual content from site/copy/pilot-cta.md when available
const headline = "Join the Pilot Program";
const body = "Experience Slancha early and shape its future. Get exclusive support and pricing.";
const ctaText = "Apply Now";

export default function PilotCTA() {
  return (
    <section className="pilot-cta">
      <div className="pilot-cta-inner">
        <h2 className="pilot-cta-headline">{headline}</h2>
        <p className="pilot-cta-body">{body}</p>
        <Link to="/contact" className="btn-primary btn-lg">{ctaText}</Link>
        <a href="mailto:contact@slancha.ai" className="pilot-cta-email">contact@slancha.ai</a>
      </div>
    </section>
  );
}

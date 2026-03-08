import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../utils/useScrollReveal';
import './PilotCTA.css';

const HEADLINE = 'Running production inference with a growing cloud bill? Let\'s talk.';
const BODY = "We work with teams that have an AI product in production and feel the cost pressure. If your inference spend is a line item that's hard to justify, that's exactly what we're built for.";
const CTA_TEXT = 'Request a Pilot';

export default function PilotCTA() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="pilot-cta reveal">
      <div className="pilot-cta-inner">
        <h2 className="pilot-cta-headline">{HEADLINE}</h2>
        <p className="pilot-cta-body">{BODY}</p>
        <Link to="/contact" className="btn-primary btn-lg">{CTA_TEXT}</Link>
        <a href="mailto:contact@slancha.ai" className="pilot-cta-email">contact@slancha.ai</a>
      </div>
    </section>
  );
}

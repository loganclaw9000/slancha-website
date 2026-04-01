import React from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import SocialProof from "../components/SocialProof";
import HowItWorks from "../components/HowItWorks";
import TierCards from "../components/TierCards";
import TechStack from "../components/TechStack";
import PilotCTA from "../components/PilotCTA";
import Footer from "../components/Footer";
import { useABTest, trackABTestEvent } from "../ab";

/**
 * Homepage Variant B - Testimonial-Focused
 * 
 * Emphasizes social proof and customer success stories.
 * Social proof section moved up to build trust early.
 */
export default function HomepageVariantB() {
  const variation = "variant-b";

  return (
    <div className="page">
      <Nav />
      <Hero />
      <hr className="section-divider" />
      <SocialProof /> {/* Testimonials moved up */}
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      <TierCards />
      <TechStack />
      <PilotCTA 
        message="Join 1,200+ teams optimizing AI inference"
        ctaText="View Demo"
        onClick={() => trackABTestEvent('demo_cta_click', { variation })}
      />
      <Footer />
    </div>
  );
}

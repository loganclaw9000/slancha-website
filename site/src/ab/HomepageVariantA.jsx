import React from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import TierCards from "../components/TierCards";
import SocialProof from "../components/SocialProof";
import TechStack from "../components/TechStack";
import PilotCTA from "../components/PilotCTA";
import Footer from "../components/Footer";
import { useABTest, trackABTestEvent } from "../ab";

/**
 * Homepage Variant A - Pricing-Focused
 * 
 * Emphasizes cost savings and value proposition upfront.
 * Pricing section placed earlier in the flow.
 */
export default function HomepageVariantA() {
  const variation = "variant-a";

  return (
    <div className="page">
      <Nav />
      <Hero />
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      <TierCards /> {/* Pricing moved up */}
      <SocialProof />
      <TechStack />
      <PilotCTA 
        message="Get 40% cost savings starting day one"
        ctaText="See Pricing"
        onClick={() => trackABTestEvent('pricing_cta_click', { variation })}
      />
      <Footer />
    </div>
  );
}

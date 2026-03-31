import React from 'react';
import usePageMeta from '../hooks/usePageMeta';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import TierCards from '../components/TierCards';
import TechStack from '../components/TechStack';
import SocialProof from '../components/SocialProof';
import About from '../components/About';
import Waitlist from '../components/Waitlist';
import PilotCTA from '../components/PilotCTA';
import Footer from '../components/Footer';

export default function Home() {
  usePageMeta({
    description: 'Slancha closes the AI engineering loop: evaluate models against production workloads, deploy the winner, post-train on what you learn, and repeat. One API, zero infrastructure overhead.',
  });
  return (
    <div className="page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content">
        <Hero />
        <ValueProps />
        <SocialProof />
        <hr className="section-divider" />
        <Features />
        <hr className="section-divider" />
        <HowItWorks />
        <hr className="section-divider" />
        <TierCards />
        <TechStack />
        <hr className="section-divider" />
        <About />
        <Waitlist />
        <PilotCTA />
      </main>
      <Footer />
    </div>
  );
}

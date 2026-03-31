import React from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import TierCards from '../components/TierCards';
import TechStack from '../components/TechStack';
import About from '../components/About';
import PilotCTA from '../components/PilotCTA';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta();
  return (
    <div className="page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content">
        <Hero />
        <ValueProps />
        <SocialProof />
        <Features />
        <hr className="section-divider" />
        <HowItWorks />
        <hr className="section-divider" />
        <TierCards />
        <TechStack />
        <hr className="section-divider" />
        <About />
        <PilotCTA />
      </main>
      <Footer />
    </div>
  );
}

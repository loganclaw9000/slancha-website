import React from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import TechStack from '../components/TechStack';
import About from '../components/About';
import Waitlist from '../components/Waitlist';
import PilotCTA from '../components/PilotCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content">
        <Hero />
        <ValueProps />
        <hr className="section-divider" />
        <Features />
        <hr className="section-divider" />
        <HowItWorks />
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

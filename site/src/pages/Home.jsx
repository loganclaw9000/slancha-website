import React from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import TierCards from '../components/TierCards';
import TechStack from '../components/TechStack';
import About from '../components/About';
import PilotCTA from '../components/PilotCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="page">
      <Nav />
      <Hero />
      <hr className="section-divider" />
      <Features />
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      <TierCards />
      <TechStack />
      <hr className="section-divider" />
      <About />
      <PilotCTA />
      <Footer />
    </div>
  );
}

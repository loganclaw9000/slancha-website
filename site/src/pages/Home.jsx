import React from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import TierCards from '../components/TierCards';
import TechStack from '../components/TechStack';
import PilotCTA from '../components/PilotCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="page">
      <Nav />
      <Hero />
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      <TierCards />
      <TechStack />
      <PilotCTA />
      <Footer />
    </div>
  );
}

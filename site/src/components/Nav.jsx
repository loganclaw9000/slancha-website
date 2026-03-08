import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

export default function Nav({ backLink = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(o => !o);

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Slancha</Link>
        {backLink ? (
          <Link to="/" className="nav-link">← Back to home</Link>
        ) : (
          <div className="nav-links">
            <a href="/#how-it-works" className="nav-link">How it works</a>
            <a href="/#offerings" className="nav-link">Offerings</a>
            <Link to="/contact" className="btn-primary btn-sm">Talk to us</Link>
          </div>
        )}
        {!backLink && (
          <button className="nav-hamburger" onClick={toggleMenu} aria-label="Menu">
            <span /><span /><span />
          </button>
        )}
      </nav>
      {menuOpen && (
        <div className="nav-overlay" onClick={closeMenu}>
          <a href="/#how-it-works" className="nav-overlay-link" onClick={closeMenu}>How it works</a>
          <a href="/#offerings" className="nav-overlay-link" onClick={closeMenu}>Offerings</a>
          <Link to="/contact" className="nav-overlay-link" onClick={closeMenu}>Talk to us</Link>
        </div>
      )}
    </>
  );
}

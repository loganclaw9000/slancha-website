import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Nav.css';

export default function Nav({ backLink = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(o => !o);

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Slancha</Link>
        {backLink ? (
          <Link to="/" className="nav-link">&#8592; Back to home</Link>
        ) : (
          <div className="nav-links">
            <a href="/#how-it-works" className="nav-link">How it works</a>
            <a href="/#offerings" className="nav-link">Offerings</a>
            {user ? (
              <>
                <Link to="/dashboard" className="btn-primary btn-sm">Dashboard</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Sign in</Link>
                <Link to="/signup" className="btn-primary btn-sm">Get Started</Link>
              </>
            )}
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
          {user ? (
            <>
              <Link to="/dashboard" className="nav-overlay-link" onClick={closeMenu}>Dashboard</Link>
              <button className="nav-overlay-link" onClick={handleSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-overlay-link" onClick={closeMenu}>Sign in</Link>
              <Link to="/signup" className="nav-overlay-link" onClick={closeMenu}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

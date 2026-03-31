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
        <Link to="/" className="nav-logo">
          <svg className="nav-triskele" viewBox="0 0 100 100" width="24" height="24" fill="none" strokeWidth="6" strokeLinecap="round">
            <defs>
              <linearGradient id="nav-tg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A84FF" />
                <stop offset="100%" stopColor="#00D1B2" />
              </linearGradient>
            </defs>
            <g stroke="url(#nav-tg)">
              <path d="M50 50 Q50 28 35 12 Q22 22 22 40 Q22 50 50 50" />
              <path d="M50 50 Q69 59 87 52 Q85 36 72 28 Q63 24 50 50" />
              <path d="M50 50 Q31 63 28 85 Q43 92 56 82 Q65 75 50 50" />
            </g>
          </svg>
          Slancha
        </Link>
        {backLink ? (
          <Link to="/" className="nav-link">&#8592; Back to home</Link>
        ) : (
          <div className="nav-links">
            <a href="/#how-it-works" className="nav-link">How It Works</a>
            <Link to="/docs" className="nav-link">Docs</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
            {user ? (
              <Link to="/dashboard" className="btn-primary btn-sm">Dashboard</Link>
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
          <a href="/#how-it-works" className="nav-overlay-link" onClick={closeMenu}>How It Works</a>
          <Link to="/docs" className="nav-overlay-link" onClick={closeMenu}>Docs</Link>
          <Link to="/blog" className="nav-overlay-link" onClick={closeMenu}>Blog</Link>
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

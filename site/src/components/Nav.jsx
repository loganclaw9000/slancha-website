import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Nav.css';

const dropdowns = {
  Product: [
    { to: '/#how-it-works', label: 'How It Works', desc: 'The eval→deploy→optimize loop', anchor: true },
    { to: '/integrations', label: 'Integrations', desc: '31 platforms supported' },
    { to: '/demo', label: 'Product Demo', desc: '5-step interactive walkthrough' },
    { to: '/playground', label: 'API Playground', desc: 'Try the API interactively' },
    { to: '/benchmarks', label: 'Benchmarks', desc: 'Latency, quality & cost data' },
    { to: '/security', label: 'Security', desc: 'SOC 2, HIPAA, GDPR ready' },
    { to: '/changelog', label: 'Changelog', desc: 'Latest releases & updates' },
    { to: '/status', label: 'Status', desc: 'Real-time system health' },
  ],
  Solutions: [
    { to: '/use-cases', label: 'Use Cases', desc: 'By industry & team size' },
    { to: '/case-studies', label: 'Case Studies', desc: 'Real customer results' },
    { to: '/enterprise', label: 'Enterprise', desc: 'Cloud, VPC, or on-prem' },
    { to: '/roi-calculator', label: 'ROI Calculator', desc: 'Estimate your savings' },
    { to: '/vs-competitors', label: 'Compare', desc: 'See how we stack up' },
  ],
  Developers: [
    { to: '/docs', label: 'Documentation', desc: 'Guides, API ref, SDKs' },
    { to: '/docs/quickstart', label: 'Quickstart', desc: 'First API call in 5 min' },
    { to: '/blog', label: 'Blog', desc: 'Technical deep dives' },
    { to: '/faq', label: 'FAQ', desc: 'Common questions answered' },
  ],
};

function DropdownMenu({ label, items, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeout = useRef(null);

  const handleEnter = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <div
      className="nav-dropdown"
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="nav-link nav-dropdown-trigger"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <svg className="nav-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="nav-dropdown-panel">
          {items.map(item => (
            item.anchor ? (
              <a
                key={item.to}
                href={item.to}
                className="nav-dropdown-item"
                onClick={() => { setOpen(false); onNavigate?.(); }}
              >
                <span className="nav-dropdown-label">{item.label}</span>
                <span className="nav-dropdown-desc">{item.desc}</span>
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="nav-dropdown-item"
                onClick={() => { setOpen(false); onNavigate?.(); }}
              >
                <span className="nav-dropdown-label">{item.label}</span>
                <span className="nav-dropdown-desc">{item.desc}</span>
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}

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
            {Object.entries(dropdowns).map(([label, items]) => (
              <DropdownMenu key={label} label={label} items={items} />
            ))}
            <Link to="/pricing" className="nav-link">Pricing</Link>
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
          <div className="nav-overlay-inner" onClick={e => e.stopPropagation()}>
            {Object.entries(dropdowns).map(([label, items]) => (
              <div key={label} className="nav-overlay-section">
                <span className="nav-overlay-heading">{label}</span>
                {items.map(item => (
                  item.anchor ? (
                    <a key={item.to} href={item.to} className="nav-overlay-link" onClick={closeMenu}>{item.label}</a>
                  ) : (
                    <Link key={item.to} to={item.to} className="nav-overlay-link" onClick={closeMenu}>{item.label}</Link>
                  )
                ))}
              </div>
            ))}
            <div className="nav-overlay-section">
              <Link to="/pricing" className="nav-overlay-link" onClick={closeMenu}>Pricing</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="nav-overlay-link" onClick={closeMenu}>Dashboard</Link>
                  <button className="nav-overlay-link" onClick={handleSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit', textAlign: 'center' }}>Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-overlay-link" onClick={closeMenu}>Sign in</Link>
                  <Link to="/signup" className="nav-overlay-link nav-overlay-cta" onClick={closeMenu}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

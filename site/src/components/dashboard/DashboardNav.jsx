import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardNav.css';

export default function DashboardNav() {
  const { user, signOut } = useAuth();
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="dash-nav">
      <Link to="/" className="dash-nav-logo">
        <svg viewBox="0 0 100 100" width="22" height="22" fill="none" strokeWidth="6" strokeLinecap="round">
          <defs>
            <linearGradient id="dash-tg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A84FF" />
              <stop offset="100%" stopColor="#00D1B2" />
            </linearGradient>
          </defs>
          <g stroke="url(#dash-tg)">
            <path d="M50 50 Q50 28 35 12 Q22 22 22 40 Q22 50 50 50" />
            <path d="M50 50 Q69 59 87 52 Q85 36 72 28 Q63 24 50 50" />
            <path d="M50 50 Q31 63 28 85 Q43 92 56 82 Q65 75 50 50" />
          </g>
        </svg>
        Slancha
      </Link>
      <div className="dash-nav-right">
        <span className="dash-nav-user">{displayName}</span>
        <button className="dash-nav-signout" onClick={signOut}>Sign out</button>
      </div>
    </nav>
  );
}

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <div className="page">
      <Nav />
      <main style={{ paddingTop: 80, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, padding: '0 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(0, 209, 178, 0.1)', border: '2px solid rgba(0, 209, 178, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00D1B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
            You're all set!
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
            Your subscription is active. Head to the dashboard to create your first API key and start routing requests.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn-primary btn-lg">Go to Dashboard</Link>
            <Link to="/docs" className="btn-secondary btn-lg">Read the Docs</Link>
          </div>
          {sessionId && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 24 }}>
              Reference: {sessionId}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

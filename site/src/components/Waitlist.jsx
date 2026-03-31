import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useScrollReveal } from '../utils/useScrollReveal';
import { trackWaitlistJoined } from '../lib/analytics';
import './Waitlist.css';

export default function Waitlist() {
  const ref = useScrollReveal();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('submitting');
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: email.trim().toLowerCase(), source: 'homepage' }]);

      if (error) {
        if (error.code === '23505') {
          // Duplicate — treat as success
          setStatus('success');
          trackWaitlistJoined(email.split('@')[1] || 'unknown');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        trackWaitlistJoined(email.split('@')[1] || 'unknown');
      }
    } catch (err) {
      console.error('Waitlist error:', err);
      setStatus('error');
      setErrorMsg('Something went wrong. Try again or email us directly.');
    }
  };

  return (
    <section ref={ref} className="waitlist reveal" id="waitlist">
      <div className="waitlist-inner">
        <div className="waitlist-badge">Early Access</div>
        <h2 className="waitlist-headline">
          Get early access to Slancha
        </h2>
        <p className="waitlist-body">
          Join the waitlist to be among the first teams to get a self-optimizing API endpoint.
          No credit card required. We'll reach out when your slot opens.
        </p>

        {status === 'success' ? (
          <div className="waitlist-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>You're on the list! We'll be in touch soon.</span>
          </div>
        ) : (
          <form className="waitlist-form" onSubmit={handleSubmit}>
            <div className="waitlist-input-wrap">
              <input
                type="email"
                className="waitlist-input"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'submitting'}
                aria-label="Email address"
              />
              <button
                type="submit"
                className="waitlist-btn"
                disabled={status === 'submitting' || !email}
              >
                {status === 'submitting' ? (
                  <span className="waitlist-spinner" />
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </div>
            {status === 'error' && (
              <p className="waitlist-error">{errorMsg}</p>
            )}
          </form>
        )}

        <p className="waitlist-note">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

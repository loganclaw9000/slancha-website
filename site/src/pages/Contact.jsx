import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#121212',
    color: '#E5E7EB',
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 64px',
    borderBottom: '1px solid #262626',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#E5E7EB',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  },
  container: {
    maxWidth: '560px',
    margin: '80px auto',
    padding: '0 32px',
  },
  heading: {
    fontSize: '36px',
    fontWeight: 600,
    lineHeight: 1.3,
    marginBottom: '16px',
  },
  subtext: {
    color: '#A0AEC0',
    fontSize: '18px',
    lineHeight: 1.6,
    marginBottom: '48px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#A0AEC0',
    marginBottom: '8px',
    letterSpacing: '0.03em',
  },
  input: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '12px 16px',
    color: '#E5E7EB',
    fontSize: '16px',
    marginBottom: '24px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '12px 16px',
    color: '#E5E7EB',
    fontSize: '16px',
    marginBottom: '32px',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '120px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  btnPrimary: {
    backgroundColor: '#0A84FF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
  backLink: {
    color: '#A0AEC0',
    textDecoration: 'none',
    fontSize: '14px',
  },
  successBox: {
    backgroundColor: '#1F1F1F',
    border: '1px solid #262626',
    borderRadius: '8px',
    padding: '32px',
    textAlign: 'center',
  },
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Try Formspree if VITE_FORM_ENDPOINT is set, otherwise fall back to mailto.
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;

    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Form API error');
      } catch (err) {
        // Fallback to mailto on API failure
        console.error('Form submission failed, falling back to mailto:', err);
        const subject = encodeURIComponent(`Pilot request from ${form.company || form.name}`);
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\n${form.message}`
        );
        window.location.href = `mailto:contact@slancha.ai?subject=${subject}&body=${body}`;
        return;
      }
    } else {
      // No API endpoint configured — open mail client
      const subject = encodeURIComponent(`Pilot request from ${form.company || form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\n${form.message}`
      );
      window.location.href = `mailto:contact@slancha.ai?subject=${subject}&body=${body}`;
    }

    setSubmitted(true);
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>Slancha</Link>
        <Link to="/" style={styles.backLink}>← Back to home</Link>
      </nav>

      <div style={styles.container}>
        {submitted ? (
          <div style={styles.successBox}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>We'll be in touch.</h2>
            <p style={{ color: '#A0AEC0', lineHeight: 1.6 }}>
              {/* PLACEHOLDER */}
              Thanks for reaching out. We review pilot requests within one business day and reach out to qualified teams directly.
            </p>
          </div>
        ) : (
          <>
            <h1 style={styles.heading}>
              {/* PLACEHOLDER — Copywriter: revise heading */}
              Talk to us about a pilot
            </h1>
            <p style={styles.subtext}>
              {/* PLACEHOLDER — Copywriter: revise subtext */}
              If you're running production AI inference and want to reduce cost or hit tighter latency targets, we'd like to hear about your stack.
            </p>

            <form onSubmit={handleSubmit}>
              <label style={styles.label} htmlFor="name">Name</label>
              <input
                style={styles.input}
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                value={form.name}
                onChange={handleChange}
              />

              <label style={styles.label} htmlFor="email">Work email</label>
              <input
                style={styles.input}
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                value={form.email}
                onChange={handleChange}
              />

              <label style={styles.label} htmlFor="company">Company</label>
              <input
                style={styles.input}
                id="company"
                name="company"
                type="text"
                placeholder="Your company"
                value={form.company}
                onChange={handleChange}
              />

              <label style={styles.label} htmlFor="message">What are you working on? (optional)</label>
              <textarea
                style={styles.textarea}
                id="message"
                name="message"
                placeholder="Tell us about your inference stack, latency requirements, or what's driving costs..."
                value={form.message}
                onChange={handleChange}
              />

              <button style={styles.btnPrimary} type="submit">Request a pilot</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import '../components/Contact.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address.';
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
        console.error('Form submission failed, falling back to mailto:', err);
        const subject = encodeURIComponent(form.subject || `Pilot request from ${form.name}`);
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`
        );
        window.location.href = `mailto:contact@slancha.ai?subject=${subject}&body=${body}`;
        return;
      }
    } else {
      const subject = encodeURIComponent(form.subject || `Pilot request from ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`
      );
      window.location.href = `mailto:contact@slancha.ai?subject=${subject}&body=${body}`;
    }

    setSubmitted(true);
  };

  return (
    <div className="page">
      <Nav backLink />
      <main>
      {/* Hero Banner */}
      <div className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <h1 className="contact-hero-heading">Talk to us about your AI engineering stack.</h1>
          <p className="contact-hero-sub">If your team is managing 4–6 tools to approximate what Slancha does natively, let's talk. We're onboarding pilots through Q2 2026.</p>
        </div>
      </div>

      {/* Main two-column section */}
      <div className="contact-main" aria-live="polite">
        {submitted ? (
          <div className="contact-success">
            <div className="contact-success-icon">✓</div>
            <h2 className="contact-success-heading">Thanks — we'll be in touch.</h2>
            <p className="contact-success-body">
              We review all pilot applications within 48 hours. If your use case fits, we'll schedule a technical deep dive to instrument your first eval-deploy-post-train cycle.
            </p>
          </div>
        ) : (
          <>
            {/* Left: Form */}
            <div className="contact-form-col">
              <form onSubmit={handleSubmit} noValidate>
                <div className="contact-field">
                  <label className="contact-label" htmlFor="name">Name</label>
                  <input
                    className={`contact-input${errors.name ? ' contact-input--error' : ''}`}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    aria-required="true"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span id="name-error" className="contact-error" role="alert">{errors.name}</span>}
                </div>

                <div className="contact-field">
                  <label className="contact-label" htmlFor="email">Email</label>
                  <input
                    className={`contact-input${errors.email ? ' contact-input--error' : ''}`}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    aria-required="true"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span id="email-error" className="contact-error" role="alert">{errors.email}</span>}
                </div>

                <div className="contact-field">
                  <label className="contact-label" htmlFor="subject">Subject <span className="contact-optional">(optional)</span></label>
                  <input
                    className="contact-input"
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-field">
                  <label className="contact-label" htmlFor="message">Message</label>
                  <textarea
                    className={`contact-textarea${errors.message ? ' contact-input--error' : ''}`}
                    id="message"
                    name="message"
                    placeholder="What tools are you using today? (eval, inference, fine-tuning, monitoring)"
                    required
                    aria-required="true"
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    value={form.message}
                    onChange={handleChange}
                  />
                  {errors.message && <span id="message-error" className="contact-error" role="alert">{errors.message}</span>}
                </div>

                <button className="contact-submit-btn" type="submit">Send Message</button>
              </form>
            </div>

            {/* Right: Contact Info */}
            <div className="contact-info-col">
              <h2 className="contact-info-heading">Contact Info</h2>
              <ul className="contact-info-list">
                <li className="contact-info-item">
                  <span className="contact-info-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <span>contact@slancha.ai</span>
                </li>
                <li className="contact-info-item">
                  <span className="contact-info-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </span>
                  <span>We respond within 1 business day</span>
                </li>
                <li className="contact-info-item">
                  <span className="contact-info-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      </main>

      <Footer />
    </div>
  );
}

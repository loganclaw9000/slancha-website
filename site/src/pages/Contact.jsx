import React, { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import '../components/Contact.css';

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
        console.error('Form submission failed, falling back to mailto:', err);
        const subject = encodeURIComponent(`Pilot request from ${form.company || form.name}`);
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\n${form.message}`
        );
        window.location.href = `mailto:contact@slancha.ai?subject=${subject}&body=${body}`;
        return;
      }
    } else {
      const subject = encodeURIComponent(`Pilot request from ${form.company || form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\n${form.message}`
      );
      window.location.href = `mailto:contact@slancha.ai?subject=${subject}&body=${body}`;
    }

    setSubmitted(true);
  };

  return (
    <div className="page">
      <Nav backLink />

      <div className="contact-container">
        {submitted ? (
          <div className="contact-success">
            <div className="contact-success-icon">✓</div>
            <h2 className="contact-success-heading">We'll be in touch.</h2>
            <p className="contact-success-body">
              Thanks for reaching out. We review pilot requests within one business day and reach out to qualified teams directly. Expect a response from contact@slancha.ai.
            </p>
          </div>
        ) : (
          <>
            <h1 className="contact-heading">Talk to us about a pilot</h1>
            <p className="contact-subtext">
              If you're running production AI inference and want to cut costs or hit tighter latency targets, tell us about your stack. We review pilot requests within one business day.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="contact-label" htmlFor="name">Name</label>
              <input
                className="contact-input"
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                value={form.name}
                onChange={handleChange}
              />

              <label className="contact-label" htmlFor="email">Work email</label>
              <input
                className="contact-input"
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                value={form.email}
                onChange={handleChange}
              />

              <label className="contact-label" htmlFor="company">Company</label>
              <input
                className="contact-input"
                id="company"
                name="company"
                type="text"
                placeholder="Your company"
                value={form.company}
                onChange={handleChange}
              />

              <label className="contact-label" htmlFor="message">Describe your inference stack (optional)</label>
              <textarea
                className="contact-textarea"
                id="message"
                name="message"
                placeholder="Tell us about your model, your current cloud spend, and what's driving your latency requirements..."
                value={form.message}
                onChange={handleChange}
              />

              <button className="btn-primary contact-submit" type="submit">Request a Pilot</button>
            </form>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

// PLACEHOLDER — Copywriter/Designer: replace with final copy & design
import React from 'react';
import { Link } from 'react-router-dom';

// Design tokens from site/design/system.md
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
  navLink: {
    color: '#A0AEC0',
    textDecoration: 'none',
    fontSize: '16px',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '96px 32px 64px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  eyebrow: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#0A84FF',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  h1: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: '24px',
    color: '#E5E7EB',
  },
  subtitle: {
    fontSize: '20px',
    color: '#A0AEC0',
    lineHeight: 1.6,
    marginBottom: '40px',
    maxWidth: '600px',
  },
  ctaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#0A84FF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    color: '#E5E7EB',
    border: '1px solid #5E6C84',
    borderRadius: '4px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  section: {
    padding: '80px 64px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 600,
    lineHeight: 1.3,
    marginBottom: '48px',
    textAlign: 'center',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1F1F1F',
    border: '1px solid #262626',
    borderRadius: '8px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '12px',
    color: '#E5E7EB',
  },
  cardBody: {
    fontSize: '16px',
    color: '#A0AEC0',
    lineHeight: 1.6,
  },
  accent: {
    color: '#0A84FF',
  },
  divider: {
    borderColor: '#262626',
    margin: '0 64px',
  },
  footer: {
    padding: '32px 64px',
    borderTop: '1px solid #262626',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#A0AEC0',
    fontSize: '14px',
  },
};

export default function Home() {
  return (
    <div style={styles.page}>
      {/* Nav */}
      <nav style={styles.nav}>
        <a href="/" style={styles.logo}>Slancha</a>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#how-it-works" style={styles.navLink}>How it works</a>
          <a href="#offerings" style={styles.navLink}>Offerings</a>
          <Link to="/contact" style={styles.btnPrimary}>Talk to us</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>AI Inference Infrastructure</p>
        <h1 style={styles.h1}>
          Pick your latency. <br />
          <span style={styles.accent}>We handle the rest.</span>
        </h1>
        <p style={styles.subtitle}>
          {/* PLACEHOLDER — Copywriter: revise this subtitle */}
          Slancha is the inference optimization platform for teams running production AI. Set a P99 latency target. We optimize your model, select the right hardware, and manage costs automatically.
        </p>
        <div style={styles.ctaRow}>
          <Link to="/contact" style={styles.btnPrimary}>Request a pilot</Link>
          <a href="#how-it-works" style={styles.btnSecondary}>See how it works</a>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* How it works */}
      <section id="how-it-works" style={styles.section}>
        <h2 style={styles.sectionTitle}>One number in. Optimized system out.</h2>
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>01</div>
            <h3 style={styles.cardTitle}>Set your latency target</h3>
            <p style={styles.cardBody}>
              {/* PLACEHOLDER — Copywriter: short punchy description */}
              Tell us your P99 requirement. That single number drives every decision downstream.
            </p>
          </div>
          <div style={styles.card}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>02</div>
            <h3 style={styles.cardTitle}>We optimize your model</h3>
            <p style={styles.cardBody}>
              {/* PLACEHOLDER — Copywriter: short punchy description */}
              Quantization, pruning, distillation, TensorRT compilation — we select and compose the right transformations automatically.
            </p>
          </div>
          <div style={styles.card}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>03</div>
            <h3 style={styles.cardTitle}>Ship to prod, save on infra</h3>
            <p style={styles.cardBody}>
              {/* PLACEHOLDER — Copywriter: short punchy description */}
              Managed hosting or self-hosted NIM deployment. We charge a premium on the cloud savings we generate.
            </p>
          </div>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* Offerings */}
      <section id="offerings" style={styles.section}>
        <h2 style={styles.sectionTitle}>Built for inference teams with real cloud bills</h2>
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Managed Hosting</h3>
            <p style={styles.cardBody}>
              {/* PLACEHOLDER */}
              Upload your model. We optimize it and host it at your latency target. Hourly pricing, with optional CSP/region placement.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Self-Hosted Deployment</h3>
            <p style={styles.cardBody}>
              {/* PLACEHOLDER */}
              We convert your model to a NIM + secure deployment package. CloudFormation templates included. Deploy to your cloud or on-prem.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Autonomous SRE Agent <span style={{ fontSize: '12px', color: '#5E6C84' }}>Coming soon</span></h3>
            <p style={styles.cardBody}>
              {/* PLACEHOLDER */}
              Full Kubernetes orchestration with GPU bin-packing, continuous benchmarking, and dynamic hardware selection to hit SLAs at minimum cost.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>© 2026 Slancha. All rights reserved.</span>
        <span>
          <a href="mailto:contact@slancha.ai" style={{ color: '#0A84FF', textDecoration: 'none' }}>contact@slancha.ai</a>
        </span>
      </footer>
    </div>
  );
}

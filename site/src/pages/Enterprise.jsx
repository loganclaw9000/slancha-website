import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Enterprise.css';

const capabilities = [
  {
    icon: '\u{1F512}',
    title: 'Single-Tenant Isolation',
    desc: 'Dedicated compute, storage, and networking. Your data never shares infrastructure with other customers.',
  },
  {
    icon: '\u{1F6E1}\uFE0F',
    title: 'Private Model Registry',
    desc: 'Host proprietary and fine-tuned models in your own registry. Full control over versioning, access, and rollback.',
  },
  {
    icon: '\u{1F50C}',
    title: 'Custom Integrations',
    desc: 'Deep integrations with your existing MLOps stack\u2014Weights & Biases, MLflow, Kubeflow, Airflow, and more.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Advanced Analytics',
    desc: 'Custom dashboards, usage breakdowns by team/project, cost attribution, and exportable reports.',
  },
  {
    icon: '\u{1F465}',
    title: 'Team Management',
    desc: 'RBAC with custom roles, SSO (SAML/OIDC), SCIM provisioning, and granular API key permissions per team.',
  },
  {
    icon: '\u2699\uFE0F',
    title: 'Managed Fine-Tuning',
    desc: 'Dedicated GPU clusters for training. Eval-driven auto-promote pipelines with human-in-the-loop approval gates.',
  },
];

const deployOptions = [
  {
    title: 'Slancha Cloud',
    desc: 'Fully managed on our infrastructure. SOC 2 compliant, encrypted at rest and in transit. Fastest time to value.',
  },
  {
    title: 'Virtual Private Cloud',
    desc: 'Slancha runs in a dedicated VPC in your preferred cloud provider (AWS, GCP, Azure). Your network, our management.',
    featured: true,
    badge: 'Most Popular',
  },
  {
    title: 'On-Premises',
    desc: 'Deploy Slancha entirely within your data center. Air-gapped support available for regulated industries.',
  },
];

const securityItems = [
  { title: 'SOC 2 Type II', desc: 'Annual audit with continuous monitoring. Reports available under NDA.' },
  { title: 'HIPAA Ready', desc: 'BAA available. PHI handling compliant with HIPAA technical safeguards.' },
  { title: 'GDPR Compliant', desc: 'EU data residency options, DPA included, right-to-deletion support.' },
  { title: 'Encryption', desc: 'AES-256 at rest, TLS 1.3 in transit. Customer-managed keys (BYOK) supported.' },
  { title: 'Audit Logging', desc: 'Every API call, model access, and config change logged with tamper-proof retention.' },
  { title: 'Penetration Testing', desc: 'Quarterly third-party pentests. Results shared with enterprise customers.' },
  { title: 'Network Security', desc: 'VPC peering, private endpoints, IP allowlisting, and firewall rules.' },
  { title: 'Incident Response', desc: '24-hour SLA on security incidents. Dedicated security contact for enterprise accounts.' },
];

const slaStats = [
  { number: '99.99%', label: 'Uptime SLA' },
  { number: '<50ms', label: 'P99 Routing Latency' },
  { number: '15min', label: 'Incident Response' },
  { number: '24/7', label: 'Enterprise Support' },
];

export default function Enterprise() {
  usePageMeta({
    title: 'Enterprise',
    description: 'Slancha Enterprise: self-hosted or VPC deployment, SOC 2 Type II, HIPAA, SSO/SAML, dedicated support, and 99.99% uptime SLA for AI engineering at scale.',
  });

  return (
    <div className="page">
      <Nav />
      <main className="enterprise-page">
        {/* Hero */}
        <section className="enterprise-hero">
          <h1>
            AI engineering infrastructure<br />
            <span className="gradient-text">built for the enterprise</span>
          </h1>
          <p>
            Deploy Slancha in your cloud, your data center, or ours. Enterprise-grade security,
            compliance, and support for teams that can't compromise on control.
          </p>
          <div className="enterprise-hero-ctas">
            <Link to="/contact" className="btn-primary btn-lg">Talk to Sales</Link>
            <Link to="/pricing" className="btn-secondary btn-lg">Compare Plans</Link>
          </div>
        </section>

        {/* Trusted by */}
        <section className="enterprise-logos">
          <p>Trusted by AI teams at</p>
          <div className="enterprise-logo-grid">
            <span>Fortune 500 Bank</span>
            <span>Top-5 Health System</span>
            <span>Series D Fintech</span>
            <span>Federal Agency</span>
            <span>Global Automaker</span>
          </div>
        </section>

        {/* Capabilities */}
        <section className="enterprise-capabilities">
          <h2>Enterprise capabilities</h2>
          <p>Everything in Platform, plus the control and security your org requires.</p>
          <div className="enterprise-cap-grid">
            {capabilities.map((cap, i) => (
              <div className="enterprise-cap-card" key={i}>
                <span className="enterprise-cap-icon">{cap.icon}</span>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deployment Options */}
        <section className="enterprise-deploy">
          <h2>Deployment flexibility</h2>
          <p>Run Slancha where your data lives. Same platform, your rules.</p>
          <div className="enterprise-deploy-grid">
            {deployOptions.map((opt, i) => (
              <div className={`enterprise-deploy-card${opt.featured ? ' featured' : ''}`} key={i}>
                {opt.badge && <div className="enterprise-deploy-badge">{opt.badge}</div>}
                <h3>{opt.title}</h3>
                <p>{opt.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="enterprise-security">
          <h2>Security & compliance</h2>
          <p>We take security seriously so you can focus on building. <Link to="/security" className="enterprise-security-link">Visit our Trust Center &rarr;</Link></p>
          <div className="enterprise-security-grid">
            {securityItems.map((item, i) => (
              <div className="enterprise-security-item" key={i}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="enterprise-security-check">
                  <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SLA Stats */}
        <section className="enterprise-sla">
          <h2>Enterprise SLA guarantees</h2>
          <div className="enterprise-sla-grid">
            {slaStats.map((stat, i) => (
              <div className="enterprise-sla-stat" key={i}>
                <span className="enterprise-sla-number">{stat.number}</span>
                <span className="enterprise-sla-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="enterprise-cta-section">
          <h2>Ready to scale your AI operations?</h2>
          <p>Get a custom deployment plan, pricing, and a dedicated onboarding team for your organization.</p>
          <div className="enterprise-cta-buttons">
            <Link to="/contact" className="btn-primary btn-lg">Schedule a Demo</Link>
            <Link to="/case-studies" className="btn-secondary btn-lg">Read Case Studies</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

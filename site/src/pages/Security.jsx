import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import './Security.css';

const certifications = [
  {
    badge: 'SOC 2',
    title: 'SOC 2 Type II',
    desc: 'Annual audit by an independent third party with continuous monitoring controls. Covers security, availability, and confidentiality trust service criteria. Reports available under NDA.',
    status: 'Certified',
  },
  {
    badge: 'HIPAA',
    title: 'HIPAA Compliance',
    desc: 'Business Associate Agreement (BAA) available. PHI handling meets HIPAA technical safeguards including access controls, audit logging, and encryption requirements.',
    status: 'Ready',
  },
  {
    badge: 'GDPR',
    title: 'GDPR Compliant',
    desc: 'EU data residency options with processing in Frankfurt and Dublin. Data Processing Agreement (DPA) included. Full support for right-to-deletion, data portability, and consent management.',
    status: 'Compliant',
  },
  {
    badge: 'CCPA',
    title: 'CCPA Compliant',
    desc: 'Full compliance with California Consumer Privacy Act requirements including data access requests, deletion rights, and opt-out mechanisms for data sale.',
    status: 'Compliant',
  },
];

const infraSecurity = [
  {
    title: 'Encryption at Rest',
    desc: 'All data encrypted with AES-256. Customer-managed encryption keys (BYOK) supported via AWS KMS, GCP Cloud KMS, or Azure Key Vault.',
  },
  {
    title: 'Encryption in Transit',
    desc: 'TLS 1.3 enforced on all connections. Certificate pinning available for enterprise deployments. HSTS enabled with preload.',
  },
  {
    title: 'Network Isolation',
    desc: 'VPC peering, AWS PrivateLink, and GCP Private Service Connect supported. IP allowlisting and firewall rules for API access.',
  },
  {
    title: 'Single-Tenant Option',
    desc: 'Dedicated compute, storage, and networking for enterprise customers. No shared infrastructure — your data never co-locates with other tenants.',
  },
  {
    title: 'Secrets Management',
    desc: 'API keys hashed with bcrypt before storage. Secrets rotated automatically. No plaintext credentials in logs, traces, or error messages.',
  },
  {
    title: 'DDoS Protection',
    desc: 'Multi-layer DDoS mitigation with rate limiting, IP reputation filtering, and automatic traffic scrubbing at the edge.',
  },
];

const dataHandling = [
  {
    title: 'No Training on Your Data',
    desc: 'Your inference inputs and outputs are never used to train models. Zero data retention for inference requests unless you explicitly enable logging.',
  },
  {
    title: 'Data Residency',
    desc: 'Choose where your data is processed and stored. Available regions: US-East, US-West, EU-Frankfurt, EU-Dublin, AP-Tokyo, AP-Sydney.',
  },
  {
    title: 'Data Retention Controls',
    desc: 'Configure retention periods per project. Automatic purging after expiration. Immediate deletion available via API or dashboard.',
  },
  {
    title: 'Model Isolation',
    desc: 'Fine-tuned models are stored in isolated, encrypted namespaces. Model weights are never shared across customers or accessible outside your account.',
  },
];

const securityPractices = [
  {
    title: 'Penetration Testing',
    desc: 'Quarterly third-party penetration tests by certified security firms. Results and remediation timelines shared with enterprise customers on request.',
  },
  {
    title: 'Vulnerability Management',
    desc: 'Continuous automated scanning of infrastructure and dependencies. Critical vulnerabilities patched within 24 hours. CVE tracking with SLA commitments.',
  },
  {
    title: 'Incident Response',
    desc: '24-hour SLA on security incident acknowledgment. Dedicated security contact for enterprise accounts. Post-incident reports within 72 hours.',
  },
  {
    title: 'Bug Bounty Program',
    desc: 'Responsible disclosure program for security researchers. Rewards based on severity. Submit findings to security@slancha.ai.',
  },
  {
    title: 'Employee Security',
    desc: 'Background checks for all employees. Mandatory security training. Principle of least privilege for production access. Hardware security keys required.',
  },
  {
    title: 'Audit Logging',
    desc: 'Every API call, model access, configuration change, and authentication event logged with tamper-proof retention. Exportable to your SIEM.',
  },
];

const accessControl = [
  { feature: 'SSO (SAML 2.0 / OIDC)', tiers: ['Enterprise'] },
  { feature: 'SCIM Provisioning', tiers: ['Enterprise'] },
  { feature: 'Role-Based Access Control', tiers: ['Platform', 'Enterprise'] },
  { feature: 'API Key Scoping (per-project)', tiers: ['Platform', 'Enterprise'] },
  { feature: 'Multi-Factor Authentication', tiers: ['All'] },
  { feature: 'Session Management', tiers: ['All'] },
  { feature: 'IP Allowlisting', tiers: ['Enterprise'] },
  { feature: 'Custom Roles & Permissions', tiers: ['Enterprise'] },
];

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="security-check-icon">
      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="security-shield-icon">
      <path d="M24 4L6 12V22C6 33.1 13.7 43.3 24 46C34.3 43.3 42 33.1 42 22V12L24 4Z" stroke="url(#shield-gradient)" strokeWidth="2.5" fill="none"/>
      <path d="M17 24L22 29L31 19" stroke="url(#shield-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="shield-gradient" x1="6" y1="4" x2="42" y2="46">
          <stop offset="0%" stopColor="#0A84FF"/>
          <stop offset="100%" stopColor="#00D1B2"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Security() {
  usePageMeta({
    title: 'Security & Trust',
    description: 'Slancha Security & Trust Center: SOC 2 Type II, HIPAA, GDPR compliance, AES-256 encryption, audit logging, penetration testing, and enterprise access controls.',
  });

  return (
    <div className="page">
      <Nav />
      <main id="main-content" className="security-page">
        {/* Hero */}
        <section className="security-hero">
          <ShieldIcon />
          <h1>
            Security & Trust<br />
            <span className="gradient-text">Center</span>
          </h1>
          <p>
            Security is foundational to everything we build. Your data, your models, and your
            customers' trust are protected by enterprise-grade security at every layer.
          </p>
          <div className="security-hero-ctas">
            <Link to="/contact" className="btn-primary btn-lg">Request Security Review</Link>
            <Link to="/enterprise" className="btn-secondary btn-lg">Enterprise Plans</Link>
          </div>
        </section>

        {/* Compliance Certifications */}
        <section className="security-section">
          <h2>Compliance & certifications</h2>
          <p className="security-section-sub">
            Industry-standard certifications and regulatory compliance, audited and maintained continuously.
          </p>
          <div className="security-cert-grid">
            {certifications.map((cert, i) => (
              <div className="security-cert-card" key={i}>
                <div className="security-cert-header">
                  <span className="security-cert-badge">{cert.badge}</span>
                  <span className="security-cert-status">{cert.status}</span>
                </div>
                <h3>{cert.title}</h3>
                <p>{cert.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Infrastructure Security */}
        <section className="security-section">
          <h2>Infrastructure security</h2>
          <p className="security-section-sub">
            Defense in depth from the network edge to the application layer.
          </p>
          <div className="security-grid-3">
            {infraSecurity.map((item, i) => (
              <div className="security-item-card" key={i}>
                <CheckIcon />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Handling */}
        <section className="security-section security-data-section">
          <h2>Data handling & privacy</h2>
          <p className="security-section-sub">
            Your data belongs to you. We never train on customer data and give you full control over retention and residency.
          </p>
          <div className="security-grid-2">
            {dataHandling.map((item, i) => (
              <div className="security-data-card" key={i}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Practices */}
        <section className="security-section">
          <h2>Security practices</h2>
          <p className="security-section-sub">
            Proactive security operations with continuous monitoring, testing, and improvement.
          </p>
          <div className="security-grid-3">
            {securityPractices.map((item, i) => (
              <div className="security-item-card" key={i}>
                <CheckIcon />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Access Controls Table */}
        <section className="security-section">
          <h2>Access controls by plan</h2>
          <p className="security-section-sub">
            Granular identity and access management across all tiers.
          </p>
          <div className="security-table-wrap">
            <table className="security-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {accessControl.map((row, i) => (
                  <tr key={i}>
                    <td>{row.feature}</td>
                    <td>
                      {row.tiers.map((tier) => (
                        <span className={`security-tier-badge ${tier.toLowerCase()}`} key={tier}>
                          {tier}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="security-cta-section">
          <h2>Need more details?</h2>
          <p>
            Request our SOC 2 report, schedule a security review with our team,
            or reach out to discuss your specific compliance requirements.
          </p>
          <div className="security-cta-buttons">
            <Link to="/contact" className="btn-primary btn-lg">Contact Security Team</Link>
            <a href="mailto:security@slancha.ai" className="btn-secondary btn-lg">security@slancha.ai</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

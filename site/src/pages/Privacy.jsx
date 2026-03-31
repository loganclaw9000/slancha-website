import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './Legal.css';

export default function Privacy() {
  usePageMeta({ title: 'Privacy Policy', description: 'Slancha Privacy Policy. Learn how we collect, use, and protect your data when you use the Slancha AI inference platform.' });

  return (
    <>
      <Nav />
      <div className="legal-page">
        <h1>Privacy Policy</h1>
        <p className="legal-effective">Effective Date: March 30, 2026</p>

        <p>This Privacy Policy describes how Slancha, Inc. ("Slancha," "we," "us," or "our") collects, uses, and protects information when you use our platform, API, and related services (the "Service").</p>

        <h2>1. Information We Collect</h2>
        <p><strong>Account Information:</strong> When you create an account, we collect your name, email address, and organization name. If you subscribe to a paid plan, we collect billing information through our payment processor (Stripe).</p>
        <p><strong>Usage Data:</strong> We collect information about how you use the Service, including API call volumes, endpoint usage patterns, error rates, and performance metrics. This data is used to operate and improve the Service.</p>
        <p><strong>Customer Data:</strong> Data you submit through the API for model evaluation, fine-tuning, or inference. This includes prompts, model outputs, evaluation datasets, and fine-tuning data.</p>
        <p><strong>Technical Data:</strong> Browser type, IP address, device information, and cookies necessary for the Service to function.</p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li><strong>Provide the Service:</strong> Process API requests, run evaluations, manage deployments, and execute fine-tuning jobs</li>
          <li><strong>Billing:</strong> Process payments and manage your subscription</li>
          <li><strong>Communication:</strong> Send service updates, security alerts, and support responses</li>
          <li><strong>Improve the Service:</strong> Analyze aggregate usage patterns to optimize performance and develop new features</li>
          <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
        </ul>

        <h2>3. Customer Data Protection</h2>
        <p>We take the protection of your Customer Data seriously:</p>
        <ul>
          <li><strong>No cross-customer training:</strong> We never use your Customer Data to train models for other customers</li>
          <li><strong>Encryption:</strong> All Customer Data is encrypted at rest (AES-256) and in transit (TLS 1.3)</li>
          <li><strong>Isolation:</strong> Enterprise customers can deploy in isolated environments (VPC or on-premises)</li>
          <li><strong>Retention:</strong> Customer Data is retained only as long as needed to provide the Service. Upon account termination, data is deleted within 30 days</li>
          <li><strong>Access controls:</strong> Access to Customer Data is limited to authorized personnel on a need-to-know basis</li>
        </ul>

        <h2>4. Data Sharing</h2>
        <p>We do not sell your personal information. We share data only in the following circumstances:</p>
        <ul>
          <li><strong>Service providers:</strong> With trusted third parties who help us operate the Service (cloud hosting, payment processing, analytics)</li>
          <li><strong>Legal requirements:</strong> When required by law, regulation, or legal process</li>
          <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>With your consent:</strong> When you explicitly authorize sharing</li>
        </ul>

        <h2>5. Cookies and Tracking</h2>
        <p>We use essential cookies to maintain your session and preferences. We use privacy-focused analytics (Plausible) that does not use cookies or collect personal data. We do not use third-party advertising trackers.</p>

        <h2>6. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate personal data</li>
          <li>Delete your personal data</li>
          <li>Export your data in a portable format</li>
          <li>Object to or restrict processing of your data</li>
          <li>Withdraw consent where processing is based on consent</li>
        </ul>
        <p>To exercise these rights, contact us at <a href="mailto:privacy@slancha.ai">privacy@slancha.ai</a>.</p>

        <h2>7. GDPR Compliance</h2>
        <p>For users in the European Economic Area (EEA), we process personal data on the following legal bases: contract performance (providing the Service), legitimate interests (improving the Service and security), and consent (marketing communications). We offer Data Processing Agreements (DPAs) for enterprise customers.</p>

        <h2>8. CCPA Compliance</h2>
        <p>For California residents: we do not sell personal information. You have the right to know what personal information we collect, request deletion, and opt out of any future sale. We will not discriminate against you for exercising these rights.</p>

        <h2>9. Security</h2>
        <p>We implement industry-standard security measures including:</p>
        <ul>
          <li>SOC 2 Type II certification</li>
          <li>Regular penetration testing and security audits</li>
          <li>Role-based access controls and audit logging</li>
          <li>Incident response procedures with 24-hour notification</li>
        </ul>

        <h2>10. Data Retention</h2>
        <p>We retain account information for the duration of your account plus 30 days. Usage data is retained for 12 months in aggregate form. Customer Data is deleted within 30 days of account termination. Billing records are retained as required by tax law.</p>

        <h2>11. Children's Privacy</h2>
        <p>The Service is not directed to children under 18. We do not knowingly collect personal information from children.</p>

        <h2>12. International Transfers</h2>
        <p>Data may be processed in the United States. For EEA users, we rely on Standard Contractual Clauses for international data transfers.</p>

        <h2>13. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the Service at least 30 days before the changes take effect.</p>

        <h2>14. Contact</h2>
        <p>For privacy questions or to exercise your data rights, contact us at <a href="mailto:privacy@slancha.ai">privacy@slancha.ai</a> or through our <Link to="/contact">Contact page</Link>.</p>

        <div className="legal-nav">
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

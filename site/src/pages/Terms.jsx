import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './Legal.css';

export default function Terms() {
  usePageMeta({ title: 'Terms of Service', description: 'Slancha Terms of Service. Read about the terms governing your use of the Slancha AI inference platform, API, and related services.' });

  return (
    <>
      <Nav />
      <div className="legal-page">
        <h1>Terms of Service</h1>
        <p className="legal-effective">Effective Date: March 30, 2026</p>

        <p>These Terms of Service ("Terms") govern your access to and use of the Slancha platform, API, SDKs, documentation, and related services (collectively, the "Service") provided by Slancha, Inc. ("Slancha," "we," "us," or "our"). By accessing or using the Service, you agree to be bound by these Terms.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By creating an account or using the Service, you represent that you are at least 18 years old and have the legal authority to enter into these Terms. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.</p>

        <h2>2. Description of Service</h2>
        <p>Slancha provides an end-to-end AI inference platform that includes:</p>
        <ul>
          <li>Intelligent model routing and optimization</li>
          <li>Model evaluation and benchmarking tools</li>
          <li>Automated fine-tuning and post-training pipelines</li>
          <li>Inference optimization and deployment management</li>
          <li>API access, SDKs, and developer tools</li>
        </ul>

        <h2>3. Account Registration</h2>
        <p>You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials, including API keys. You are responsible for all activity that occurs under your account.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any illegal purpose or in violation of any applicable laws</li>
          <li>Attempt to gain unauthorized access to the Service or its related systems</li>
          <li>Interfere with or disrupt the integrity or performance of the Service</li>
          <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
          <li>Use the Service to develop a competing product or service</li>
          <li>Exceed your plan's rate limits or usage quotas through automated means</li>
          <li>Share API keys or account credentials with unauthorized third parties</li>
          <li>Submit content that is harmful, offensive, or violates third-party rights</li>
        </ul>

        <h2>5. API Usage and Rate Limits</h2>
        <p>API access is subject to rate limits and usage quotas based on your subscription tier. We reserve the right to throttle or suspend API access if usage patterns indicate abuse or could degrade service for other users. Current rate limits are published in our <Link to="/docs">documentation</Link>.</p>

        <h2>6. Data and Privacy</h2>
        <p>Your use of the Service is also governed by our <Link to="/privacy">Privacy Policy</Link>. You retain ownership of all data you submit to the Service ("Customer Data"). We process Customer Data only as necessary to provide the Service. We do not use Customer Data to train models for other customers.</p>

        <h2>7. Intellectual Property</h2>
        <p>The Service, including all software, APIs, documentation, and content, is owned by Slancha and protected by intellectual property laws. Your subscription grants you a limited, non-exclusive, non-transferable license to use the Service in accordance with these Terms.</p>
        <p>You retain all rights to your Customer Data and any models you create or fine-tune using the Service.</p>

        <h2>8. Subscription and Payment</h2>
        <p>Paid subscriptions are billed in advance on a monthly or annual basis. Usage-based charges are billed in arrears. All fees are non-refundable except as required by law. We may change pricing with 30 days' notice. Current pricing is available on our <Link to="/pricing">Pricing page</Link>.</p>

        <h2>9. Service Level Agreement</h2>
        <p>Enterprise customers may be eligible for a Service Level Agreement (SLA) with uptime guarantees. Standard SLA terms provide 99.9% API uptime. SLA credits are the sole remedy for service disruptions. Details are available in your enterprise agreement.</p>

        <h2>10. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Slancha's total liability for any claims arising from or related to the Service shall not exceed the amount you paid to Slancha in the twelve (12) months preceding the claim. Slancha shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>

        <h2>11. Indemnification</h2>
        <p>You agree to indemnify and hold harmless Slancha from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.</p>

        <h2>12. Termination</h2>
        <p>Either party may terminate the subscription at any time. Upon termination, your access to the Service will cease. We will retain your Customer Data for 30 days after termination, during which you may export it. After 30 days, Customer Data will be permanently deleted.</p>

        <h2>13. Modifications to Terms</h2>
        <p>We may update these Terms from time to time. We will notify you of material changes via email or through the Service. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>

        <h2>14. Governing Law</h2>
        <p>These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Delaware.</p>

        <h2>15. Contact</h2>
        <p>For questions about these Terms, contact us at <a href="mailto:legal@slancha.ai">legal@slancha.ai</a> or through our <Link to="/contact">Contact page</Link>.</p>

        <div className="legal-nav">
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

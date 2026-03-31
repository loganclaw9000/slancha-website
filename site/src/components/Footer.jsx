import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Slancha</Link>
          <p className="footer-tagline">AI inference that improves itself.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <Link to="/pricing" className="footer-link">Pricing</Link>
            <Link to="/integrations" className="footer-link">Integrations</Link>
            <Link to="/playground" className="footer-link">API Playground</Link>
            <Link to="/roi-calculator" className="footer-link">ROI Calculator</Link>
            <Link to="/benchmarks" className="footer-link">Benchmarks</Link>
            <Link to="/changelog" className="footer-link">Changelog</Link>
            <Link to="/security" className="footer-link">Security</Link>
            <Link to="/status" className="footer-link">Status</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Solutions</h4>
            <Link to="/use-cases" className="footer-link">Use Cases</Link>
            <Link to="/case-studies" className="footer-link">Case Studies</Link>
            <Link to="/enterprise" className="footer-link">Enterprise</Link>
            <Link to="/vs-competitors" className="footer-link">Compare</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Developers</h4>
            <Link to="/docs" className="footer-link">Documentation</Link>
            <Link to="/docs/quickstart" className="footer-link">Quickstart</Link>
            <Link to="/blog" className="footer-link">Blog</Link>
            <Link to="/faq" className="footer-link">FAQ</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <Link to="/contact" className="footer-link">Contact</Link>
            <a href="mailto:contact@slancha.ai" className="footer-link">contact@slancha.ai</a>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">&copy; 2026 Slancha. All rights reserved.</span>
      </div>
    </footer>
  );
}

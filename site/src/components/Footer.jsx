import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Slancha</Link>
          <p className="footer-tagline">The Databricks of AI Engineering.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <Link to="/pricing" className="footer-link">Pricing</Link>
            <Link to="/roi-calculator" className="footer-link">ROI Calculator</Link>
            <Link to="/docs" className="footer-link">Docs</Link>
            <Link to="/blog" className="footer-link">Blog</Link>
            <Link to="/changelog" className="footer-link">Changelog</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <Link to="/contact" className="footer-link">Contact</Link>
            <a href="mailto:contact@slancha.ai" className="footer-link">contact@slancha.ai</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">&copy; 2026 Slancha. All rights reserved.</span>
      </div>
    </footer>
  );
}

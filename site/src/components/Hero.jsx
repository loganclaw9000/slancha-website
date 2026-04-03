import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { trackCtaClick } from '../lib/analytics';
import './Hero.css';

const CODE_LINES = [
  { text: 'import slancha', color: 'keyword' },
  { text: '', color: '' },
  { text: 'response = slancha.complete(', color: 'fn' },
  { text: '    prompt="Summarize this quarterly report",', color: 'string' },
  { text: '    # No model selection. No config. Just results.', color: 'comment' },
  { text: ')', color: 'fn' },
];

const RESPONSE_LINES = [
  '{ "status": "ok",',
  '  "model": "auto-selected",',
  '  "latency_ms": 142,',
  '  "cost_saved": "47%",',
  '  "result": "Q3 revenue grew 34% YoY..." }',
];

function HeroTerminal() {
  const [codeIndex, setCodeIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const termRef = useRef(null);

  useEffect(() => {
    if (codeIndex < CODE_LINES.length) {
      const timer = setTimeout(() => setCodeIndex(i => i + 1), 400);
      return () => clearTimeout(timer);
    }
    if (!showResponse) {
      const timer = setTimeout(() => setShowResponse(true), 600);
      return () => clearTimeout(timer);
    }
  }, [codeIndex, showResponse]);

  useEffect(() => {
    if (showResponse && responseIndex < RESPONSE_LINES.length) {
      const timer = setTimeout(() => setResponseIndex(i => i + 1), 200);
      return () => clearTimeout(timer);
    }
  }, [showResponse, responseIndex]);

  return (
    <div className="hero-terminal" aria-hidden="true" ref={termRef}>
      <div className="hero-terminal-bar">
        <span className="hero-terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="hero-terminal-dot" style={{ background: '#febc2e' }} />
        <span className="hero-terminal-dot" style={{ background: '#28c840' }} />
        <span className="hero-terminal-title">slancha_demo.py</span>
      </div>
      <pre className="hero-terminal-code">
        {CODE_LINES.slice(0, codeIndex).map((line, i) => (
          <div key={i} className={`hero-code-line hero-code-${line.color}`}>{line.text}</div>
        ))}
        {codeIndex >= CODE_LINES.length && !showResponse && (
          <div className="hero-code-line hero-code-cursor">▌</div>
        )}
      </pre>
      {showResponse && (
        <div className="hero-terminal-response">
          <div className="hero-response-label">⚡ Response (142ms)</div>
          <pre className="hero-terminal-output">
            {RESPONSE_LINES.slice(0, responseIndex).map((line, i) => (
              <div key={i} className="hero-output-line">{line}</div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

const Hero = () => (
  <section className="hero" id="hero">
    <div className="hero-triskele-wrap" aria-hidden="true">
      <svg className="hero-triskele" viewBox="0 0 100 100" width="500" height="500" fill="none" strokeWidth="2" strokeLinecap="round">
        <defs>
          <linearGradient id="hero-tg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A84FF" />
            <stop offset="100%" stopColor="#00D1B2" />
          </linearGradient>
        </defs>
        <g stroke="url(#hero-tg)">
          <path d="M50 50 Q50 28 35 12 Q22 22 22 40 Q22 50 50 50" />
          <path d="M50 50 Q69 59 87 52 Q85 36 72 28 Q63 24 50 50" />
          <path d="M50 50 Q31 63 28 85 Q43 92 56 82 Q65 75 50 50" />
        </g>
      </svg>
    </div>
    <h1 className="hero-h1">World-class AI inference.<br /><span className="gradient-text">No infrastructure team required.</span></h1>
    <p className="hero-subtitle">Slancha closes the gap between what your AI could do and what your team can build. One API endpoint that routes, fine-tunes, optimizes, and redeploys — continuously, behind the scenes. Better accuracy, lower latency, lower cost.</p>
    <div className="hero-cta">
      <Link to="/signup" className="btn-primary btn-lg hero-cta-primary" onClick={() => trackCtaClick('hero_get_endpoint', 'homepage')}>Get Your API Endpoint</Link>
      <a href="#how-it-works" className="btn-secondary btn-lg" onClick={() => trackCtaClick('hero_how_it_works', 'homepage')}>See How It Works</a>
    </div>
    <HeroTerminal />
  </section>
);

export default Hero;

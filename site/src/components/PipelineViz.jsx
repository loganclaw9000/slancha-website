import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PipelineViz.css';

const stages = [
  {
    id: 'route',
    icon: '⚡',
    label: 'Route',
    sub: 'Instant routing decisions',
    title: 'Your requests go to the right model, automatically',
    body: 'Every request hits one API endpoint. Slancha instantly classifies what you\'re asking and sends it to the optimal model — no model selection, no benchmarking required.',
    tech: ['One API key', 'Instant routing', 'Simple → efficient, complex → powerful'],
  },
  {
    id: 'analyze',
    icon: '🔍',
    label: 'Analyze',
    sub: 'Your usage improves your models',
    title: 'Your usage patterns improve your models',
    body: 'Behind the scenes, Slancha watches what you\'re doing — summarization, code, QA, retrieval — and automatically builds better training data from your real production usage.',
    tech: ['Automatic learning', 'No datasets needed', 'Privacy-focused'],
  },
  {
    id: 'finetune',
    icon: '🧬',
    label: 'Fine-tune',
    sub: 'Custom models for your work',
    title: 'Smaller models that beat frontier on your work',
    body: 'Slancha fine-tunes custom models on your specific tasks. The result: models that match or outperform expensive frontier models, but cost a fraction. Zero manual work.',
    tech: ['Custom models', 'Better performance', 'Automatic upgrades'],
  },
  {
    id: 'optimize',
    icon: '🚀',
    label: 'Optimize',
    sub: 'Faster, cheaper, continuously',
    title: 'Faster responses, dramatically lower cost',
    body: 'Every fine-tuned model gets optimized before serving. The outcome: snappier responses and significantly lower costs, with continuous improvement as we redeploy better versions.',
    tech: ['4-bit optimization', 'Smart GPU packing', 'Continuous redeployment'],
  },
];

/* Node positions (percentage-based for responsiveness) */
const layout = {
  desktop: [
    { x: '50%', y: '4%' },   // Route (top center)
    { x: '92%', y: '38%' },  // Analyze (right)
    { x: '50%', y: '72%' },  // Fine-tune (bottom center)
    { x: '8%', y: '38%' },   // Optimize (left)
  ],
  mobile: [
    { x: '50%', y: '2%' },
    { x: '50%', y: '28%' },
    { x: '50%', y: '54%' },
    { x: '50%', y: '80%' },
  ],
};

/* Build elliptical SVG path connecting all four nodes in a loop */
function getEllipsePath(w, h, isMobile) {
  if (isMobile) {
    // Vertical line path for mobile
    const cx = w / 2;
    const pts = [0.08, 0.32, 0.58, 0.84].map(p => p * h);
    let d = `M ${cx} ${pts[0]}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${cx} ${pts[i]}`;
    d += ` L ${cx} ${pts[0]}`;
    return d;
  }
  // Ellipse via 4 bezier arcs
  const cx = w / 2, cy = h * 0.44;
  const rx = w * 0.38, ry = h * 0.34;
  return `M ${cx} ${cy - ry}
    A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}
    A ${rx} ${ry} 0 0 1 ${cx} ${cy + ry}
    A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}
    A ${rx} ${ry} 0 0 1 ${cx} ${cy - ry} Z`;
}

export default function PipelineViz() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const autoRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-rotate through stages
  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % 4);
    }, 3500);
  }, []);

  useEffect(() => {
    startAuto();
    return () => clearInterval(autoRef.current);
  }, [startAuto]);

  const handleClick = (i) => {
    setActive(i);
    clearInterval(autoRef.current);
    // Resume auto after 8 seconds of inactivity
    setTimeout(startAuto, 8000);
  };

  const pos = isMobile ? layout.mobile : layout.desktop;

  return (
    <div className="pipeline-viz-wrapper">
      <div className="pipeline-viz" role="figure" aria-label="Slancha four-stage pipeline: Route, Analyze, Fine-tune, Optimize in a continuous loop">
        {/* SVG connections + animated particle */}
        <svg className="pipeline-svg" ref={svgRef} viewBox={isMobile ? '0 0 340 500' : '0 0 720 400'} preserveAspectRatio="xMidYMid meet">
          <path
            ref={pathRef}
            className="pipeline-path"
            d={getEllipsePath(isMobile ? 340 : 720, isMobile ? 500 : 400, isMobile)}
          />
          {/* Animated particles */}
          {[0, 1, 2].map(i => (
            <circle key={i} className="pipeline-particle" r="3.5">
              <animateMotion
                dur="6s"
                begin={`${i * 2}s`}
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath href="#pipelinePath" />
              </animateMotion>
            </circle>
          ))}
          {/* Hidden path for animateMotion mpath reference */}
          <path
            id="pipelinePath"
            d={getEllipsePath(isMobile ? 340 : 720, isMobile ? 500 : 400, isMobile)}
            fill="none"
            stroke="none"
          />
        </svg>

        {/* Nodes */}
        <div className="pipeline-nodes">
          {stages.map((s, i) => (
            <div
              key={s.id}
              className={`pv-node${active === i ? ' active' : ''}`}
              style={{
                left: pos[i].x,
                top: pos[i].y,
                transform: `translate(-50%, 0)${active === i ? ' scale(1.06)' : ''}`,
              }}
              onClick={() => handleClick(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(i)}
              aria-pressed={active === i}
              aria-label={`${s.label}: ${s.sub}`}
            >
              <div className="pv-icon">{s.icon}</div>
              <div className="pv-label">{s.label}</div>
              <div className="pv-sublabel">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Center loop indicator */}
        <div className="pv-center">
          <div className="pv-center-icon">♻️</div>
          <div className="pv-center-label">Closed Loop</div>
        </div>
      </div>

      {/* Detail card below */}
      <div className="pv-detail" key={active}>
        <div className="pv-detail-title">{stages[active].title}</div>
        <div className="pv-detail-body">{stages[active].body}</div>
        <div className="pv-detail-tech">
          {stages[active].tech.map(t => (
            <span className="pv-tech-tag" key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

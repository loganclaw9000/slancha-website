/* Reusable halftone sigmoid mark — renders into a given <svg><g>.
 * Matches the geometry from the design system's SigmoidLogo. */
(function (global) {
  function render(groupEl, opts) {
    opts = opts || {};
    const W = opts.W || 120;
    const H = opts.H || 150;
    const sp = opts.sp || 4.2;
    const sw = opts.sw || 0.32;
    const sageFill = opts.sageFill || 'url(#sageDot)';
    const goldFill = opts.goldFill || 'url(#goldDot)';

    function sample(ny) {
      const k = 14, amp = 0.38;
      const s1 = 1 / (1 + Math.exp(-k * (ny - 0.28)));
      const s2 = 1 / (1 + Math.exp(-k * (ny - 0.50)));
      const s3 = 1 / (1 + Math.exp(-k * (ny - 0.72)));
      return 0.5 + amp * 0.9 * (1 - 2 * s1 + 2 * s2 - 2 * s3);
    }
    const svgNS = 'http://www.w3.org/2000/svg';
    for (let y = 0; y < H; y += sp) {
      for (let x = 0; x < W; x += sp) {
        const ny = y / H, nx = x / W;
        const sd = Math.abs(nx - sample(ny));
        const inside = 1 - sd / sw;
        if (inside < 0.05) continue;
        const r = sp * 0.42 * inside;
        const c = document.createElementNS(svgNS, 'circle');
        c.setAttribute('cx', x.toFixed(2));
        c.setAttribute('cy', y.toFixed(2));
        c.setAttribute('r', r.toFixed(2));
        c.setAttribute('fill', ny < 0.5 ? sageFill : goldFill);
        groupEl.appendChild(c);
      }
    }
  }

  function buildInto(container, opts) {
    opts = opts || {};
    const W = opts.W || 120;
    const H = opts.H || 150;
    const id = opts.id || ('sig-' + Math.random().toString(36).slice(2, 8));
    const sageId = id + '-sage';
    const goldId = id + '-gold';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.innerHTML = `
      <defs>
        <radialGradient id="${sageId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#7D9B76" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#7D9B76" stop-opacity="0.35"/>
        </radialGradient>
        <radialGradient id="${goldId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#D4A853" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#D4A853" stop-opacity="0.35"/>
        </radialGradient>
      </defs>
      <g data-sigmoid-dots></g>
    `;
    const g = svg.querySelector('[data-sigmoid-dots]');
    render(g, { W, H, sp: opts.sp, sw: opts.sw, sageFill: `url(#${sageId})`, goldFill: `url(#${goldId})` });
    container.appendChild(svg);
  }

  function autoInit() {
    document.querySelectorAll('[data-sigmoid]').forEach((el) => {
      if (el.dataset.sigmoidRendered) return;
      el.dataset.sigmoidRendered = '1';
      const W = parseFloat(el.dataset.w) || 120;
      const H = parseFloat(el.dataset.h) || 150;
      const sp = parseFloat(el.dataset.sp) || 4.2;
      buildInto(el, { W, H, sp });
    });
  }

  global.SigmoidMark = { render, buildInto, autoInit };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})(window);

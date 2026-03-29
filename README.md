# Slancha Website

Marketing and lead generation site for **Slancha** — a B2B AI infrastructure platform that lets enterprise teams set a latency target and automatically optimizes model performance and cloud costs to meet it.

---

## Status

**Build:** passing | **QA:** no open bugs (last run 2026-03-24) | **Branch:** master

The site is feature-complete and production-ready. The only remaining pre-launch item is optionally configuring `VITE_FORM_ENDPOINT` for production form submission.

---

## Tech Stack

- **React 18** + **React Router 6** — component-based SPA
- **Vite 5** — dev server and production builds
- **Vanilla CSS** with design tokens (CSS custom properties)
- **Google Fonts** — Inter (UI) and Source Code Pro (code snippets)
- No external animation libraries — CSS micro-interactions + `IntersectionObserver` for scroll reveals

---

## Pages & Components

**Pages:** Home, Contact, 404

**Components (11):** Nav, Hero, Features, HowItWorks, TierCards, TechStack, About, PilotCTA, Contact form, Footer

**Key sections:**
- Hero — "The Databricks of AI Inference" with two CTAs
- Features — 5 product capabilities (latency optimization, hardware agnostic, autonomous SRE, cost transparency, easy integration)
- How It Works — 3-step process (set latency → Slancha optimizes → deploy & monitor)
- Tier Cards — 3 offering tiers (Model Optimization, Autonomous SRE, Enterprise Preview)
- Tech Stack showcase — PyTorch, ONNX, TensorRT, vLLM, etc.
- Contact form — client-side validation with mailto fallback

---

## Quick Start

```bash
cd site
npm install
npm run dev       # http://localhost:5173
npm run build     # output to dist/
```

**Optional:** copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT` for Formspree or equivalent form handling.

---

## Project Structure

```
slancha-website/
├── site/
│   ├── src/
│   │   ├── pages/          # Home, Contact, NotFound
│   │   ├── components/     # 11 components, each with .jsx + .css
│   │   └── utils/          # useScrollReveal hook
│   ├── copy/               # Markdown content files (hero, features, etc.)
│   ├── design/             # Design system specs and animation guidelines
│   ├── qa/                 # QA bug log
│   ├── public/             # favicon, robots.txt, sitemap.xml
│   └── index.html
├── website-team/           # Agent team brief and copy outline
└── .agents/website-team/   # Agent skill definitions (copywriter, designer, QA, etc.)
```

---

## Design System

| Token | Value |
|---|---|
| Primary | `#0A84FF` (blue) |
| Accent | `#00D1B2` (teal) |
| Background | `#121212` (charcoal) |
| Card bg | `#1F1F1F` |
| Text primary | `#E5E7EB` |
| Text secondary | `#A0AEC0` |

Typography: Inter, 48/36/28px heading scale, 18px body. Spacing: 8px base scale.

---

## Agent Workflow

This site was built by a model zoo (multi-agent team). Agent skill definitions live in `.agents/website-team/` — roles include frontend engineer, copywriter, editor, web designer, and QA specialist. Project context and memory are tracked in `MEMORY.md` and `SOUL.md`.

---
lastCommit: dffcf8b
timestamp: 2026-03-31T09:31:00Z
---

# Site Notes

Recent changes and deployment notes.

## Latest Changes

**Commit:** `dffcf8b`  
**Date:** 2026-03-31 09:31 UTC

**Added case study templates and design specs**

New comprehensive resources for sales enablement and frontend development:
- `copy/case-study-templates.md` - Vertical-specific case study templates (Fintech, Healthtech, E-commerce) with full customization guides
- `design/og-image.md` - OG image design specification
- `design/onboarding-flow.md` - Onboarding flow design spec
- `og-image-template.html` - HTML template for OG images
- `render-og.js` - Script to render OG images from templates
- Updated `qa/bugs.md` - Closed TierCards bug (now rendering on homepage), documented contact form error as expected behavior

**Previous Changes**

**Commit:** `c935ea1`  
**Date:** 2026-03-31 20:30 UTC

**Added FAQ and Vs. Competitors pages**

New pages with full implementation:
- `src/pages/FAQ.jsx` - FAQ page with accordion component, 18 questions across 5 categories
- `src/pages/VsCompetitors.jsx` - Comparison page with 6 competitor sections, cost comparison, and feature table
- `src/components/Faq.css` - FAQ page styles with responsive accordion
- `src/components/VsCompetitors.css` - Vs. Competitors styles with feature table and callout boxes
- Routes added: `/faq` and `/vs-competitors`

**Previous Changes**

**Commit:** `642c85f`  
**Date:** 2026-03-31 02:57 UTC

**Complete website repositioning to AI Engineering Platform**

New copy for core pages with emphasis on automated evaluation/deployment loop:
- `copy/hero.md` - Changed to "Evaluate models. Deploy the winner. Repeat." with new subtitle
- `copy/features.md` - New features: Automated Benchmarking, Real-time A/B Testing, One-Click Deployment, Continuous Data Capture, Auto Post-Training, Enterprise Security
- `copy/how-it-works.md` - Complete overhaul to 5-step loop: EVALUATE → DEPLOY → CAPTURE → POST-TRAIN → REPEAT
- `copy/offerings.md` - New pricing tiers: Eval+Deploy ($499/mo), Full Loop ($2,499/mo), Enterprise Self-Hosted (custom), Autonomous SRE Agent ($5,000/mo add-on)
- `copy/value-prop.md` - Updated with new value props around evaluation, deployment speed, cost reduction, and continuous learning
- New copy files: `copy/faq.md`, `copy/vs-competitors.md`

Updated CSS theme:
- `src/index.css` - New blue-to-purple gradient theme (#1e40af → #7c3aed) for AI innovation + enterprise trust
- Accent colors: Deep Blue, Electric Purple, Cyan highlights
- Updated gradients, glow effects, and button styles

## Previous Changes

**Commit:** `5584f74`  
**Date:** 2026-03-31 00:34 UTC

Added complete pricing and checkout feature:
- New `Pricing.jsx` page with tiered pricing cards
- Stripe integration via `lib/stripe.js` with payment links
- `CheckoutSuccess.jsx` and `CheckoutCancel.jsx` pages
- `Billing.jsx` dashboard component
- Dashboard styling updates (Sidebar.jsx, TierCards.jsx, Footer.jsx, Nav.jsx)
- New design spec: `design/dashboard.md`
- Route updates in App.jsx

## Deployment

Pushed to: `git@github.com:loganclaw9000/slancha-website.git`
Branch: `master`

Preview: Check the deployed site or run `npm run dev` locally.

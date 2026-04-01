# Bug Reports

**Status:** 0 open bugs  
**Last QA run:** 2026-04-01T16:45Z (heartbeat)

---

### Open Bugs

None — all verified passing.

### Verified as Expected Behavior

**[CONTACT] Form fallback to mailto** — When VITE_FORM_ENDPOINT is not set in .env, form submission correctly falls back to `mailto:contact@slancha.ai`. No console errors observed in browser test (2026-04-01). This is the designed behavior. Only action needed: set VITE_FORM_ENDPOINT to actual Formspree ID if desired. | severity:low (informational)

**[ANALYTICS] Conversion tracking implemented** — Added `trackCtaClick()` to all critical CTAs: Nav buttons (desktop + mobile), Hero CTAs, PilotCTA, Enterprise page (4 CTAs), PilotProgram page (2 CTAs), Pricing page, Contact form, Waitlist form. Verified with E2E test suite (TASK-228). All 12+ tracking events firing correctly. | severity:medium | verified: 2026-04-01

---

### Closed Bugs

### Fixed this run (2026-04-01)
- **TASK-219 FIXED** Conversion tracking gap — Added `trackCtaClick()` to 12+ CTAs across Nav.jsx, Hero.jsx, PilotCTA.jsx, Enterprise.jsx, PilotProgram.jsx, Contact.jsx, Pricing.jsx. Created audit report `site/qa/conversion-tracking-audit.md`. All events verified with E2E tests (TASK-228). Build passes.
- **TASK-228 FIXED** E2E test suite — Created comprehensive tests for A/B framework (3 tests), conversion tracking (8 tests), variant display (1 test). Report at `tests/e2e/TEST-REPORT.md`. Build passes.

### Previous runs
- **BUG FIXED** TierCards not rendered on homepage — verified 2026-03-31T09:27Z (browser test shows section present)
- **BUG FIXED** Features.css was using stale `--color-*` tokens (--color-bg, --color-surface, --color-border, --color-accent, --color-text, --color-text-muted, --radius-md). Feature cards rendering with transparent backgrounds, wrong borders, wrong text colors. Fixed to use --bg, --bg-card, --border, --accent, --text-primary, --text-secondary, --radius-lg. Commit: 7c95e14.
- **BUG FIXED** About.css same issue (--color-surface, --color-text-muted). Fixed in same commit.

### New features tested (TASK-055)

- ✓ Pricing page with 4 tiers (Eval+Deploy, Full Loop, Self-Hosted, Autonomous SRE Agent)
- ✓ Stripe Payment Links integration with contact fallback
- ✓ CheckoutSuccess page with session_id param
- ✓ CheckoutCancel page with pricing/contact links
- ✓ Billing dashboard component (empty state for no subscription)
- ✓ All routes wired in App.jsx (/pricing, /checkout/success, /checkout/cancel, /dashboard/billing)
- ✓ CSS alignment with design spec (2×2 grid, glassmorphism, hover effects, responsive)
- ✓ No console errors, no CORS errors, build passes (298 modules)

### A/B Test Framework (TASK-218)

- ✓ Homepage variants: control, variant-a (pricing-focused), variant-b (testimonial-focused)
- ✓ localStorage-based assignment with consistent user sessions
- ✓ Analytics event tracking for CTA clicks
- ✓ E2E tests verifying variant assignment and persistence

### Conversion Tracking (TASK-219, TASK-228)

- ✓ Nav: "Get Started", "Sign in", "Dashboard" (desktop + mobile)
- ✓ Hero: "Get Your API Endpoint", "See How It Works"
- ✓ PilotCTA: "Get Your Endpoint"
- ✓ Enterprise: "Talk to Sales", "Compare Plans", "Schedule a Demo", "Read Case Studies"
- ✓ PilotProgram: "Apply for a Pilot", "Start Your Pilot"
- ✓ Pricing: All 4 tier CTAs
- ✓ Contact: Form submit
- ✓ Waitlist: Form submit
- ✓ Total: 18 CTAs tracked

---

### Remaining Pre-launch Items

**Not bugs — just items to address:**
- Add `VITE_FORM_ENDPOINT` in `.env` for Formspree — see `.env.example`. mailto fallback is live.

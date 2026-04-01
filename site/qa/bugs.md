# Bug Reports

## Status: 0 open bugs

Last QA run: 2026-04-01T05:25Z (heartbeat)

---

### Open Bugs

None — all verified passing.

### Verified as Expected Behavior

**[CONTACT] Form fallback to mailto** — When VITE_FORM_ENDPOINT is not set in .env, form submission correctly falls back to `mailto:contact@slancha.ai`. No console errors observed in browser test (2026-04-01). This is the designed behavior. Only action needed: set VITE_FORM_ENDPOINT to actual Formspree ID if desired. | severity:low (informational)

---

### Closed Bugs

### Fixed this run (2026-03-31)
- **BUG FIXED** TierCards not rendered on homepage — verified 2026-03-31T09:27Z (browser test shows section present)

### Previous runs
- **BUG FIXED** Features.css was using stale `--color-*` tokens (--color-bg, --color-surface, --color-border, --color-accent, --color-text, --color-text-muted, --radius-md) not defined in the design system. Feature cards were rendering with transparent backgrounds, wrong borders, and wrong text colors. Fixed to use --bg, --bg-card, --border, --accent, --text-primary, --text-secondary, --radius-lg. Commit: 7c95e14.
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

### Checks performed

### Checks performed

- ✓ Build passes (290 modules, vite 5.4.21)
- ✓ Homepage sections present (Nav, Hero, ValueProps, SocialProof, Features, HowItWorks, TierCards, TechStack, About, PilotCTA, Footer)
- ✓ SocialProof component verified (logo grid + 3 testimonial cards)
- ✓ SocialProof CSS implementation matches spec
- ✓ About section present on homepage
- ✓ Features section present on homepage with 6 feature cards
- ✓ Contact page with form (4 fields: name, email, subject, message)
- ✓ Form validation working (client-side)
- ✓ Form submission with VITE_FORM_ENDPOINT + mailto fallback
- ✓ No placeholder/COPY_PENDING comments
- ✓ No JS console errors
- ✓ No CORS errors
- ✓ Nav has 5 links
- ✓ Mobile responsive (responsive breakpoints verified in CSS)

### Checks performed

- ✓ Build passes (56 modules, vite 5.4.21)
- ✓ All sections present (Nav, Hero, Features, HowItWorks, TierCards, TechStack, About, PilotCTA, Footer, Contact page)
- ✓ No inline style objects in any component
- ✓ No PLACEHOLDER or COPY_PENDING comments remaining
- ✓ All copy files exist in site/copy/
- ✓ Featured card treatment on Autonomous SRE (tier-card--featured class + Enterprise Preview badge)
- ✓ Nav has scroll behavior (scrolled class + backdrop-filter in Nav.css)
- ✓ CSS variables defined (13 var() references in index.css)
- ✓ scroll-behavior: smooth in index.css
- ✓ Mobile breakpoints in 8 CSS files
- ✓ IntersectionObserver scroll-reveal in useScrollReveal.js (Features, HowItWorks, TierCards, TechStack, About, PilotCTA)
- ✓ Contact form has 4 fields (name, email, subject, message) with client-side validation
- ✓ Contact form has mailto:contact@slancha.ai fallback
- ✓ index.html has correct title, meta description, OG tags, Inter font, lang="en"
- ✓ Features.css and About.css now use correct design tokens (fixed 2026-03-24)

### Fixed this run (2026-03-24)
- **BUG FIXED** Features.css was using stale `--color-*` tokens (--color-bg, --color-surface, --color-border, --color-accent, --color-text, --color-text-muted, --radius-md) not defined in the design system. Feature cards were rendering with transparent backgrounds, wrong borders, and wrong text colors. Fixed to use --bg, --bg-card, --border, --accent, --text-primary, --text-secondary, --radius-lg. Commit: 7c95e14.
- **BUG FIXED** About.css same issue (--color-surface, --color-text-muted). Fixed in same commit.

### Remaining pre-launch item (not a bug)
- Add VITE_FORM_ENDPOINT in .env for Formspree — see .env.example. mailto fallback is live.

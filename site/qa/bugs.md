# Bug Reports

## Status: No open bugs

Last QA run: 2026-03-08T02:20Z

### Checks performed

- ✓ Build passes (52 modules, vite 5.4.21)
- ✓ All 7 homepage sections present (Nav, Hero, HowItWorks, TierCards, TechStack, PilotCTA, Footer)
- ✓ No inline style objects in Home.jsx or Contact.jsx
- ✓ No PLACEHOLDER comments remaining
- ✓ All 8 copy files exist in site/copy/
- ✓ Featured card treatment on Autonomous SRE (tier-card--featured class + Enterprise Preview badge)
- ✓ Nav has scroll behavior (scrolled class + backdrop-filter in Nav.css)
- ✓ CSS variables defined (13 var() references in index.css)
- ✓ scroll-behavior: smooth in index.css
- ✓ Mobile breakpoints in 8 CSS files
- ✓ IntersectionObserver scroll-reveal in useScrollReveal.js
- ✓ Contact form has 4 fields (name, email, company, message)
- ✓ Contact form has mailto:contact@slancha.ai fallback
- ✓ index.html has correct title, meta description, OG tags, Inter font, lang="en"

### Remaining pre-launch item (not a bug)
- Add VITE_FORM_ENDPOINT in .env for Formspree — see .env.example. mailto fallback is live.

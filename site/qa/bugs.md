# Bug Reports

## Status: No open bugs

Last QA run: 2026-03-26T21:16Z

### Checks performed

- ✓ Build passes (58 modules, vite 5.4.21)
- ✓ All sections present (Nav, Hero, Features, HowItWorks, TierCards, TechStack, About, PilotCTA, Footer, Contact page, NotFound 404 page)
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
- ✓ index.html has correct title, meta description, OG tags, Twitter card, canonical link, Inter font, lang="en"
- ✓ Features.css and About.css use correct design tokens (fixed 2026-03-24)
- ✓ 404 NotFound page — correct CSS tokens (--accent, --accent-hover, --text-primary, --text-secondary, --font-mono, --radius-lg all defined in index.css), Nav+Footer present, skip-to-content link, catches all routes via App.jsx catch-all route
- ✓ Accessibility: <main id="main-content"> on Home, Contact, NotFound; skip-to-content link on all three; aria-label="Site footer" on footer
- ✓ robots.txt and sitemap.xml in public/
- ✓ favicon.svg in public/

### Fixed previously
- **BUG FIXED** Features.css was using stale `--color-*` tokens. Fixed commit: 7c95e14.
- **BUG FIXED** About.css same issue. Fixed commit: 7c95e14.
- **BUG FIXED** Hero.jsx had scroll-reveal class causing invisible hero. Fixed commit: 5f5297d.

### Remaining pre-launch item (not a bug)
- Add VITE_FORM_ENDPOINT in .env for Formspree — see .env.example. mailto fallback is live.

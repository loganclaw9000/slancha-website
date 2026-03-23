Build status: ✓ passing
Build date: 2026-03-23T17:07Z
Commit: 93950f2 (2026-03-23 17:07 UTC)

Components: Nav, Hero, Features, HowItWorks, TierCards, TechStack, About, PilotCTA, Footer, Contact
Missing copy (COPY_PENDING): none — all copy written and embedded in components
Scroll-reveal: Features ✓, HowItWorks ✓, TierCards ✓, TechStack ✓, PilotCTA ✓, About ✓ (Hero excluded per animations spec)

Copy files:
- site/copy/homepage-hero.md ✓ (applied to Hero.jsx)
- site/copy/hero.md ✓ (same as homepage-hero.md)
- site/copy/how-it-works.md ✓ (applied to HowItWorks.jsx)
- site/copy/offerings.md ✓
- site/copy/value-prop.md ✓
- site/copy/pilot-cta.md ✓ (applied to PilotCTA.jsx)
- site/copy/tech-stack.md ✓ (applied to TechStack.jsx)
- site/copy/contact.md ✓
- site/copy/meta.md ✓ (applied to index.html)
- site/copy/features.md ✓ (applied to Features.jsx)
- site/copy/about.md ✓ (applied to About.jsx)

Design specs:
- site/design/system.md ✓
- site/design/offerings.md ✓
- site/design/pilot-cta.md ✓
- site/design/tech-stack.md ✓
- site/design/nav.md ✓
- site/design/contact.md ✓ (redesigned — hero + two-column layout implemented)
- site/design/animations.md ✓

Next steps before launch:
- [ ] Add VITE_FORM_ENDPOINT (.env) for Formspree or equivalent — mailto fallback is live but a real form API is better for deliverability
- [ ] SSH deploy key needed for git push from agent sessions

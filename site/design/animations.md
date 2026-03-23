# Design Spec — Micro-interactions and Animations

## Page Entrance
No dramatic animation. Sections render immediately. No GSAP or Framer Motion — CSS only.

## Scroll-reveal
- Initial state: `opacity: 0; transform: translateY(20px)`
- Trigger: IntersectionObserver with `threshold: 0.15`
- On intersect: add class `.revealed`
- Revealed state: `opacity: 1; transform: translateY(0)`
- Duration: 400ms, easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Apply to: HowItWorks, TierCards, TechStack, PilotCTA sections

## Button Hover
- Primary button: `transform: scale(1.02)`, transition 150ms + color change
- Nav CTA: color change only, no scale
- Pilot CTA button: scale + glow `box-shadow: 0 0 20px rgba(10,132,255,0.4)`

## Card Hover
- `transform: translateY(-2px)`, transition 200ms ease
- Border-color change on non-featured cards: → #5E6C84

## Nav
- Scroll effect: background + backdrop-filter transition 200ms ease
- Link hover: color transition 150ms

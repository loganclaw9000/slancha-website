# Homepage Layout Spec

## Overview
A full‑page, scrollable layout that guides the visitor from brand introduction to pilot sign‑up. The design follows a dark tech aesthetic with high contrast accents.

### Sections (top → bottom)
1. **Nav** – sticky, transparent background, dark text on hover, CTA button highlighted with accent color.
2. **Hero** – large headline, sub‑headline, primary CTA button ("Join Pilot"). Background: subtle animated gradient overlay on a dark image.
3. **Value Props** – three equal‑width cards/bullets stacked horizontally on desktop, stacked vertically on mobile. Each card shows an icon, short title, one‑sentence benefit.
4. **Offerings** – tier cards (Managed Hosting, Self‑Hosted, Autonomous SRE). Cards side‑by‑side, same width; the middle tier gets a slight elevation and accent border to draw focus.
5. **Tech Stack** – minimal row of logos with brief caption; dark background, light icons.
6. **Pilot CTA** – high‑contrast section (dark background, bright accent button). Short copy + testimonial quote.
7. **Footer** – logo left, navigation links centered, social icons right. Dark background, muted text.

## Layout Details
### Nav
- Height: 64px on desktop, 56px mobile.
- Logo left, max‑height 40px.
- Links spaced 24px apart, hover underline.
- CTA button: accent background, white text, rounded (4px).
- Mobile: hamburger menu that expands to full‑screen overlay.

### Hero
- Full viewport height (100vh) minus nav.
- Headline: font size 48px desktop / 32px mobile, weight 700, letter‑spacing -0.5px.
- Sub‑headline: 20px, weight 400, opacity 0.8.
- Primary CTA button: width auto, padding 12px 24px, background accent, hover darken 10%.
- Background image: dark overlay (rgba(0,0,0,0.5)) + subtle gradient animation.

### Value Props
- Container max‑width: 1200px, centered.
- Card width: 33.3% desktop, 100% mobile.
- Icon size: 48px, accent color.
- Title: 24px bold.
- Text: 16px regular, line‑height 1.5.

### Offerings Tier Cards
- Container grid: three columns (1fr) on desktop, single column stacked on mobile.
- Card padding: 32px.
- Visual emphasis: middle card gets a 2px accent border and slight lift (box‑shadow).
- Each card includes:
  - Tier name (28px bold)
  - Price line (large, accent color)
  - Feature list (bulleted, small icons)
  - CTA button (secondary for outer cards, primary for middle).

### Tech Stack
- Row of 6‑8 logo images, evenly spaced.
- Caption text: "Built on trusted infrastructure" – 18px, centered.

### Pilot CTA Section
- Background: dark gradient with accent accent‑color overlay (10% opacity).
- Copy: short headline (24px), supporting line (16px).
- Button: large, full‑width on mobile, fixed width 200px desktop, primary accent.
- Optional testimonial block: italic text, muted color, right‑aligned.

### Footer
- Height: 120px.
- Text size: 14px, opacity 0.6.
- Links hover underline, color accent.
- Social icons (svg) size 24px.

## Visual Hierarchy & Spacing
- Global spacing scale: 8 | 16 | 24 | 32 | 48 | 64 px.
- Section margins: 96px top/bottom on desktop, 48px mobile.
- Consistent left/right padding: 24px desktop, 16px mobile.

## Animations / Effects
- Nav background fade‑in on scroll (0→1 opacity over 200ms).
- Hero headline slide‑up on load (translateY 20px → 0).
- Card hover elevation: translateY -4px, shadow increase.
- CTA button ripple effect on click.

## Deliverables
- This spec file (`homepage.md`).
- Corresponding component sketches can be derived by the Frontend from these descriptions.

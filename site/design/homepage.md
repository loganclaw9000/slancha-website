# Homepage Layout Spec

## Overview
A full‑page, scrollable layout that guides the visitor from brand introduction to pilot sign‑up. The design follows a dark tech aesthetic with high contrast accents.

### Sections (top → bottom)
1. **Nav** – sticky, transparent background, dark text on hover, CTA button highlighted with accent color.
2. **Hero** – large headline, sub‑headline, primary CTA button ("Join Pilot"). Background: subtle animated gradient overlay on a dark image.
3. **Value Props** – three equal‑width feature cards stacked horizontally on desktop, stacked vertically on mobile. Each card shows bold title, supporting text. Section class: `features`.
4. **Social Proof** – "Trusted By" logo row (6 logos) + testimonial carousel (3 cards). Background: surface color with border-top/bottom. See `social-proof.md` for full spec.
5. **How It Works** – 4‑step grid layout with step numbers (01‑04), titles, and body text. Section class: `how-it-works`, ID: `how-it-works`.
6. **Offerings** – 4‑tier card grid (2x2 on desktop: 2 per row), cards side‑by‑side; featured tier gets elevation and accent border. Section class: `tier-section`, ID: `offerings`.
7. **Tech Stack** – tool name pills (TensorRT, vLLM, etc.) with brief caption; dark background, monospace pills.
8. **Pilot CTA** – high‑contrast section (dark background, bright accent button). Short copy + contact email.
9. **Footer** – logo left, navigation links centered, social icons right. Dark background, muted text.

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

### Value Props (Features Grid)
- Container max‑width: 1200px, centered.
- Grid layout: 3 columns on desktop (1fr 1fr 1fr), single column on mobile.
- Card padding: 24px.
- Title: 20px bold, color #E5E7EB, margin-bottom 12px.
- Text: 15px regular, color #A0AEC0, line-height 1.6.
- Section class: `features`, ID: `value-props`.
- Card component: `<div className="feature-card">` with `<h3 className="feature-title">` and `<p className="feature-body">`.

### How It Works (4‑Step Grid)
- Container max‑width: 1200px, centered.
- Grid layout: 4 columns on desktop (1fr 1fr 1fr 1fr), single column on mobile.
- Section class: `how-it-works`, ID: `how-it-works`, section title: "Eval. Deploy. Post-train. Repeat."
- Step card padding: 32px.
- Step number: 32px bold, accent color, margin-bottom 16px, class: `step-num`.
- Step title: 18px bold, color #E5E7EB, margin-bottom 8px, class: `step-title`.
- Step body: 14px regular, color #A0AEC0, line-height 1.6, class: `step-body`.
- Step card: `<div className="step-card">` with step number, title, and body.

### Offerings Tier Cards (4 Tiers)
- Container grid: 2 columns × 2 rows on desktop (2 per row), single column stacked on mobile.
- Max-width 1200px, centered.
- Gap: 24px between cards.
- Card padding: 32px.
- Card dimensions: min-width 280px, min-height 320px.
- Featured card (Platform: Full Loop): accent border (#0A84FF), glow effect, "Most Popular" badge.
- Each card includes:
  - Tier name (22px bold, class: `tier-name`)
  - "Best for:" line (13px regular, class: `tier-for`)
  - Divider (1px solid #262626)
  - Description text (15px regular, class: `tier-body`)
  - Price line (18px accent color, class: `tier-price`)
- Section class: `tier-section`, ID: `offerings`, section title: "Plans built for AI engineering teams".

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

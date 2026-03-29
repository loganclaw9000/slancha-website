# About Page Spec

**Goal:** Provide a clean, informative overview of Slancha with brand consistency.

## Layout
- Single‑column layout, max‑width **800px**, centered horizontally.
- Top margin **80px** to give breathing room from the nav.
- Section padding **64px** (desktop) / **32px** (mobile).

## Typography
- **Heading (H1):** 48px, weight 700, color `#E5E7EB`.
- **Sub‑heading:** 24px, weight 500, color `#A0AEC0`.
- **Body text:** 16px, line‑height 1.6, color `#A0AEC0`.

## Content Blocks
1. **Hero block** – large heading + brief tagline + optional illustration on the right (desktop) or below (mobile).
2. **Mission statement** – centered paragraph, max‑width 600px.
3. **Team showcase** – horizontal flex row of team‑member cards:
   - Card size: 200px × auto height, padding 24px, background `#1F1F1F`, border `1px solid #262626`.
   - Avatar circle (80px) at top, name **H4** 18px weight 600, role **small caps** 12px `#5E6C84`.
   - Hover: subtle box‑shadow `0 2px 8px rgba(10,132,255,0.15)`.
4. **Values grid** – three columns on desktop (≥1024px), one column stack on mobile:
   - Each value card: icon (24px) top, title bold 20px, description 14px `#A0AEC0`.

## Visual Details
- Background color for the page: `#111111`.
- Divider between sections: `1px solid #262626`, margin **48px 0**.
- Links: default `#0A84FF`, hover darken to `#0070E0`.

## Accessibility
- All text meets WCAG AA contrast against the background.
- Focus outlines visible (`outline: 2px solid #0A84FF`).

---
*Spec ready for Frontend implementation.*
# Design System – Dark Tech Aesthetic

## Visual Theme
- **Mood**: Modern infrastructure product, dark‑mode first, clean lines, subtle gradients.
- **Primary Color**: #0A84FF (Vercel blue) – used for CTA buttons, links, active states.
- **Accent Colors**:
  - Secondary: #5E6C84 (muted slate) – secondary icons, borders.
  - Highlight: #00D1B2 (teal) – hover/interactive highlights.
- **Background**: #121212 (deep charcoal) for main surfaces; cards use #1F1F1F.
- **Text Colors**:
  - Primary: #E5E7EB (light gray) for body copy.
  - Secondary: #A0AEC0 (soft gray) for subtitles.
  - Inverse (on primary buttons): #FFFFFF.

## Typography
- **Font Stack**: "Inter", system UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif.
- **Headings**:
  - H1: 48px, weight 700, line‑height 1.2.
  - H2: 36px, weight 600, line‑height 1.3.
  - H3: 28px, weight 500, line‑height 1.4.
- **Body**: 18px, weight 400, line‑height 1.6.
- **Code/Monospace** (for tech snippets): "Source Code Pro", monospace; 16px, weight 400.

## Spacing Scale
| Step | px |
|------|----|
| 0    | 0 |
| 1    | 4 |
| 2    | 8 |
| 3    | 12 |
| 4    | 16 |
| 5    | 24 |
| 6    | 32 |
| 7    | 48 |
| 8    | 64 |

Use the scale for margins, paddings, and gap utilities.

## Component Tokens (examples)
- **Button**: background primary, border none, radius 4px, padding `spacing‑5` vertical × `spacing‑6` horizontal. Hover → accent highlight.
- **Card**: background #1F1F1F, border 1px solid #262626, radius 8px, shadow `0 2px 8px rgba(0,0,0,0.4)`.
- **Input**: background #1A1A1A, border 1px solid #333, focus ring primary color.

All specs are stored in this file for reference by the frontend team.

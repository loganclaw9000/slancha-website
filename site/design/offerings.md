# Design Spec — Offerings / Tier Cards

## Layout
- 3-column grid on desktop (≥1024px), single column on mobile
- Max-width 1100px, centered
- Gap 24px between cards
- Card min-height 260px, padding 32px

## Card Base Style
- Background: #1F1F1F
- Border: 1px solid #262626
- Border-radius: 8px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.4)
- Position: relative
- Hover (non-featured): border-color transitions to #5E6C84; transition: border-color 150ms ease
- Hover (all): transform translateY(-2px); transition: transform 200ms ease

## Featured Card Treatment — Autonomous SRE Agent
**Decision: Option B — border + glow + badge**

- Border: 1px solid #0A84FF
- Box-shadow: 0 0 0 1px #0A84FF, 0 4px 24px rgba(10,132,255,0.15)
- "Enterprise Preview" badge in top-right corner:
  - Position: absolute, top 16px, right 16px
  - Background: rgba(10,132,255,0.1)
  - Border: 1px solid #0A84FF
  - Color: #0A84FF
  - Font-size: 11px, font-weight 500, letter-spacing 0.03em
  - Padding: 2px 10px
  - Border-radius: 20px
  - Text: "Enterprise Preview"

## Card Header
- Tier name: font-size 22px, font-weight 600, color #E5E7EB, margin-bottom 6px
- "Best for:" line: font-size 13px, color #5E6C84, margin-bottom 0

## Divider
- 1px solid #262626
- Margin: 16px 0

## Body Text
- Font-size 15px, color #A0AEC0, line-height 1.6

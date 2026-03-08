# Design Spec — Pilot CTA Section

## Background
**Decision: subtle radial gradient**
Background: radial-gradient(ellipse at top center, #0A0A0F 0%, #121212 60%)
This reads distinctly darker than the page background without being jarring.

## Borders
- Border-top: 1px solid #1A1A1A
- Border-bottom: 1px solid #1A1A1A

## Padding
- Desktop: 96px 64px
- Mobile (≤768px): 64px 24px

## Content Layout
- Centered, max-width 640px, margin 0 auto
- Flex column, align-items center, text-align center
- Gap 24px between elements (headline → body → button → email)

## Headline
- Desktop: font-size 40px, font-weight 700, line-height 1.25, color #E5E7EB
- Mobile: font-size 28px

## Body Text
- Font-size 18px, color #A0AEC0, line-height 1.6, max-width 480px

## CTA Button
- Same primary button style from system.md
- Min-width: 200px
- Hover: box-shadow 0 0 20px rgba(10,132,255,0.4) in addition to color change

## Email Link
- Display: contact@slancha.ai → mailto:contact@slancha.ai
- Font-size 14px, color #A0AEC0, text-decoration none
- Hover: color #E5E7EB

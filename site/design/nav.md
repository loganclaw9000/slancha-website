# Design Spec — Navigation

## Desktop
- Position: sticky, top 0, z-index 100
- Height: 72px, padding 0 64px
- Display: flex, justify-content space-between, align-items center
- Background: transparent initially
- Transition: background 200ms ease, backdrop-filter 200ms ease

## Scroll behavior
- Trigger at window.scrollY > 20px
- When scrolled: background rgba(18,18,18,0.85), backdrop-filter blur(12px), border-bottom 1px solid #262626

## Logo
- Text: "Slancha"
- Font-size 22px, font-weight 700, letter-spacing -0.5px, color #E5E7EB, no underline

## Nav Links
- "How it works" → /#how-it-works (anchor)
- "Offerings" → /#offerings (anchor)
- Font-size 15px, color #A0AEC0, text-decoration none
- Hover: color #E5E7EB, transition 150ms

## CTA Button
- Text: "Talk to us" → Link to /contact
- Background #0A84FF, color #fff, border-radius 4px, padding 8px 20px, font-size 14px, font-weight 600
- Hover: background #0070E0

## Mobile (≤768px)
- Padding: 0 24px
- Hide nav links and CTA
- Show hamburger: 3 horizontal spans, 18px wide, 2px height each, 4px gap, color #A0AEC0
- On click: fullscreen overlay (position fixed, inset 0, background rgba(18,18,18,0.97), z-index 200)
  - Links vertically stacked, centered, font-size 28px, font-weight 600
  - Close on link click or outside tap

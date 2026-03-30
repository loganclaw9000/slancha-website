# Design Spec — Value Props (Feature Cards)

## Overview
A 3-column feature grid section showcasing the three core value propositions of Slancha: signal capture between tools, 3-dimension optimization, and compounding improvement.

## Layout
- **Section class:** `features`
- **Section ID:** `value-props`
- **Grid:** 3 columns on desktop (≥1024px), single column stacked on mobile
- **Container max-width:** 1200px, centered
- **Gap:** 24px between feature cards
- **Padding:** 96px top/bottom on desktop, 48px mobile
- **Background:** Dark (#0A0A0A or inherited)

## Feature Card Style
- **Background:** #1F1F1F
- **Border:** 1px solid #262626
- **Border-radius:** 8px
- **Padding:** 24px
- **Hover:** transform translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.5); transition: all 200ms ease

## Feature Title
- **Font-size:** 20px
- **Font-weight:** 700
- **Color:** #E5E7EB
- **Margin-bottom:** 12px
- **Class:** `feature-title`

## Feature Body
- **Font-size:** 15px
- **Font-weight:** 400
- **Color:** #A0AEC0
- **Line-height:** 1.6
- **Class:** `feature-body`

## 3 Value Props

### Prop 1 — Stop losing signal between tools
**Title:** Stop losing signal between tools.  
**Body:** Slancha captures production signal during inference and routes it directly into your fine-tuning pipeline — no manual exports, no lost context, no broken handoffs between eval and training teams.

### Prop 2 — Optimize across three dimensions simultaneously
**Title:** Optimize across three dimensions simultaneously.  
**Body:** Benchmark cost, latency, and accuracy against your real workloads, then deploy across API, hosted, or on-prem inference. Slancha optimizes on all three at once, not just one.

### Prop 3 — Compounding improvement by design
**Title:** Compounding improvement by design.  
**Body:** Each eval → deploy → post-train cycle produces a better model at lower cost. Slancha tracks gains across cycles so you see the compounding effect — not just snapshot metrics.

## Animations / Effects
- **Reveal on scroll:** section has `reveal` class for scroll-triggered animation
- **Card reveal:** each feature card fades in with translateY(20px) → 0 animation
- **Hover elevation:** cards lift 4px on hover with shadow increase

## Deliverables
- This spec file (`value-props.md`)
- Component implementation in `src/components/ValueProps.jsx`
- CSS in `src/components/TierCards.css` (shared grid styles)

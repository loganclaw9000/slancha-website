# Design Spec — Value Props (Feature Cards)

## Overview
A 3-column feature grid section showcasing the three core value propositions of Slancha: latency-first cost optimization, hardware-agnostic deployment, and zero-team operations.

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

### Prop 1 — Latency‑first, cost‑smart
**Title:** Latency‑first, cost‑smart.  
**Body:** We start with your SLA target and work backward, delivering the lowest‑cost inference that still meets latency goals.

### Prop 2 — Hardware‑agnostic mastery
**Title:** Hardware‑agnostic mastery.  
**Body:** Whether you run on AWS Inferentia, NVIDIA L40S, or a B200, Slancha auto‑selects the optimal stack so you never worry about vendor lock‑in.

### Prop 3 — Zero‑team inference ops
**Title:** Zero‑team inference ops.  
**Body:** No dedicated ML engineers needed – our platform becomes your inference team, handling scaling, tuning, and monitoring for you.

## Animations / Effects
- **Reveal on scroll:** section has `reveal` class for scroll-triggered animation
- **Card reveal:** each feature card fades in with translateY(20px) → 0 animation
- **Hover elevation:** cards lift 4px on hover with shadow increase

## Deliverables
- This spec file (`value-props.md`)
- Component implementation in `src/components/ValueProps.jsx`
- CSS in `src/components/TierCards.css` (shared grid styles)

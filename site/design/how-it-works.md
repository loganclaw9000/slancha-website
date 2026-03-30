# Design Spec — How It Works (4‑Step Grid)

## Overview
A 4‑step horizontal grid layout showing the Slancha workflow: Evaluate → Deploy → Post-train → Repeat. Each step has a numbered card with title and descriptive body text.

## Layout
- **Section class:** `how-it-works`
- **Section ID:** `how-it-works`
- **Section title:** "Eval. Deploy. Post-train. Repeat." (class: `section-title`)
- **Grid:** 4 columns on desktop (≥1024px), single column on mobile
- **Container max-width:** 1200px, centered
- **Gap:** 24px between step cards
- **Padding:** 96px top/bottom on desktop, 48px mobile

## Step Card Style
- **Background:** #1F1F1F
- **Border:** 1px solid #262626
- **Border-radius:** 8px
- **Padding:** 32px
- **Hover:** transform translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.5); transition: all 200ms ease

## Step Number
- **Font-size:** 32px
- **Font-weight:** 700
- **Color:** #0A84FF (accent)
- **Margin-bottom:** 16px
- **Class:** `step-num`

## Step Title
- **Font-size:** 18px
- **Font-weight:** 600
- **Color:** #E5E7EB
- **Margin-bottom:** 8px
- **Class:** `step-title`

## Step Body
- **Font-size:** 14px
- **Font-weight:** 400
- **Color:** #A0AEC0
- **Line-height:** 1.6
- **Class:** `step-body`

## Steps Content

### Step 01 — Evaluate
**Title:** Evaluate  
**Body:** Benchmark models against your real production workloads. Slancha evaluates cost, latency, and task accuracy on actual traffic — not synthetic benchmarks. Compare candidates side-by-side before you commit.

### Step 02 — Deploy
**Title:** Deploy  
**Body:** Ship the winner to the right inference layer: API, managed hosting, or on-prem. Slancha handles routing, scaling, and optimization across all three dimensions simultaneously.

### Step 03 — Post-train
**Title:** Post-train  
**Body:** Production signal captured during inference automatically becomes fine-tuning data. No manual exports, no data wrangling, no broken handoffs between eval and training teams.

### Step 04 — Repeat
**Title:** Repeat  
**Body:** Run the loop again with a better model. Track accuracy gains and cost-per-task across cycles. The compounding effect starts immediately — and widens the longer you run.

## Animations / Effects
- **Reveal on scroll:** section has `reveal` class for scroll-triggered animation
- **Card reveal:** each step card fades in with translateY(20px) → 0 animation
- **Hover elevation:** cards lift 4px on hover with shadow increase

## Deliverables
- This spec file (`how-it-works.md`)
- Component implementation in `src/components/HowItWorks.jsx`
- CSS in `src/components/HowItWorks.css`

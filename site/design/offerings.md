# Design Spec — Offerings / Tier Cards

## Layout
- 2×2 grid on desktop (2 columns × 2 rows, ≥1024px), single column stacked on mobile
- Max-width 1200px, centered
- Gap 24px between cards
- Card min-width 280px, min-height 320px, padding 32px

## Card Base Style
- Background: #1F1F1F
- Border: 1px solid #262626
- Border-radius: 8px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.4)
- Position: relative
- Hover (non-featured): border-color transitions to #5E6C84; transition: border-color 150ms ease
- Hover (all): transform translateY(-2px); transition: transform 200ms ease

## Featured Card Treatment — Platform: Full Loop
**Decision: Option B — border + glow + badge**

- Border: 1px solid #0A84FF
- Box-shadow: 0 0 0 1px #0A84FF, 0 4px 24px rgba(10,132,255,0.15)
- "Most Popular" badge in top-right corner:
  - Position: absolute, top 16px, right 16px
  - Background: rgba(10,132,255,0.1)
  - Border: 1px solid #0A84FF
  - Color: #0A84FF
  - Font-size: 11px, font-weight 500, letter-spacing 0.03em
  - Padding: 2px 10px
  - Border-radius: 20px
  - Text: "Most Popular"

## Card Header
- Tier name: font-size 22px, font-weight 600, color #E5E7EB, margin-bottom 6px, class: `tier-name`
- "Best for:" line: font-size 13px, color #5E6C84, margin-bottom 0, class: `tier-for`

## Divider
- 1px solid #262626
- Margin: 16px 0

## Body Text
- Font-size 15px, color #A0AEC0, line-height 1.6, class: `tier-body`

## Price Text
- Font-size 18px, color #0A84FF (accent), weight 500, class: `tier-price`

## 4 Tiers (Desktop Grid Order: Top→Bottom, Left→Right)

### Tier 1 — Platform: Eval + Deploy
- **Best for:** AI engineering teams stitching together eval and inference tools today
- **Description:** Connect your production workloads, benchmark model candidates on real tasks, and deploy to API, managed hosting, or on-prem — all from one dashboard. Slancha tracks cost, latency, and accuracy across deployments so you always know which model is earning its spot.
- **Price:** $2,000/month minimum

### Tier 2 — Platform: Full Loop (Featured)
- **Best for:** Teams running continuous fine-tuning or building proprietary model capabilities
- **Description:** Includes everything in Eval + Deploy, plus the post-training pipeline that closes the loop: production signal captured during inference automatically becomes fine-tuning data, prepared and fed into your training runs. Each cycle produces a more capable model at lower cost.
- **Price:** Custom pricing

### Tier 3 — Enterprise: Self-Hosted
- **Best for:** Organizations with strict data residency, air-gap requirements, or compliance constraints
- **Description:** Deploy the full Slancha platform on your own infrastructure. You retain complete data ownership; we supply the control plane, eval framework, and fine-tuning pipeline as software.
- **Price:** One-time license fee

### Tier 4 — Autonomous SRE Agent
- **Best for:** Enterprises running high-throughput inference at scale
- **Description:** Slancha's autonomous SRE agent monitors your inference fleet 24/7, tuning hardware allocation, cost routing, and SLA compliance without human intervention. Available as an add-on to any plan.
- **Price:** Limited preview

## Section Title
- Text: "Plans built for AI engineering teams"
- Class: `section-title`

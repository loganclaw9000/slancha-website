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

## Featured Card Treatment — Autonomous SRE Agent
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

### Tier 1 — Managed Hosting
- **Best for:** Companies that want a fully managed, hassle‑free inference platform
- **Description:** Our team runs Slancha's control plane on your behalf, handling hardware provisioning, scaling, and SLA monitoring. You provide your model and data; we deliver ultra‑low latency inference with predictable costs. Pricing is subscription‑based, starting at $2,500 /mo for up to 5 M inferences.
- **Price:** $2,500/mo (up to 5M inferences)

### Tier 2 — Self-Hosted Deployment
- **Best for:** Teams that need full control over their infrastructure while leveraging Slancha's optimization engine
- **Description:** Deploy the Slancha stack on your own servers or cloud instances. You retain ownership of all hardware and data, yet benefit from automatic model placement across GPUs, TPUs, or custom ASICs. Pricing is a one‑time license fee of $12,000 plus optional support contracts.
- **Price:** $12,000 one-time + optional support

### Tier 3 — Autonomous SRE Agent (Featured)
- **Best for:** Enterprises that require an AI‑driven operations layer to manage inference workloads at scale
- **Description:** The Autonomous SRE Agent continuously monitors performance, auto‑tunes resources, and resolves incidents before they impact users. You supply the models; we provide a self‑optimizing, latency‑first execution environment with enterprise‑grade SLAs. Currently in limited preview — contact us for early access.
- **Price:** Custom (limited preview)

### Tier 4 — PromptForge (Router)
- **Best for:** Teams running multiple LLMs who want automatic prompt optimization without manual tuning
- **Description:** The System Intelligence Layer for Prompt Quality. Auto-discovers optimal prompts for every model, achieves near-zero marginal cost at scale, and self-improves from every production request. Deploys with zero downtime, co-designed with the serving layer to reduce latency.
- **Price:** Included with all plans (premium add-on)

## Section Title
- Text: "Plans built for AI engineering teams"
- Class: `section-title`

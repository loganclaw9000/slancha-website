# Design Spec — Vertical Landing Page: E-commerce

## Purpose
A dedicated landing page for e-commerce companies and D2C brands. This page speaks directly to e-commerce pain points: handling traffic spikes (Black Friday, Prime Day), scaling inference costs linearly with traffic, and the need for high-throughput, low-latency AI at scale.

**Target ICP:** ICP-A (AI-Native E-commerce Startups) and ICP-B/C (Mid-Market & Enterprise E-commerce)
**URL Pattern:** `slancha.ai/ecommerce`
**Conversion Goal:** Start free trial or book scaling demo

---

## Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   SLANCHA LOGO                      [Nav: Products, Pricing,  │ │
│                                     Docs, Login, [Start Free]]│ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   AI Inference, Built for Scale                                 │
│                                                                 │
│   Handle 10x traffic spikes without 10x cost increases.        │
│   Auto-scale inference with task-specific fine-tuned models.   │
│                                                                 │
│   [Start Free Trial]  →  See Black Friday Results             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   The E-commerce Inference Problem                              │
│                                                                 │
│   [3-column cards: Black Friday Cost Spikes, Linear Scaling,  │
│    Engineering Overload]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   How Slancha Solves It                                         │
│                                                                 │
│   [Left: Scale diagram / traffic flow]   [Right: 3 benefits]   │
│                                                                 │
│   • Auto-scales with traffic (no provisioning)                 │
│   • Simple queries → small models → 70% cost savings           │
│   • Multi-token prediction → 2x throughput                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   E-commerce Use Cases                                          │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │  Customer    │  │  Product     │  │  Reviews     │         │
│   │  Support     │  │  Descriptions│  │  Summarization│        │
│   │              │  │              │  │              │         │
│   │  ↓70% cost   │  │  ↓50% cost   │  │  ↓60% cost   │         │
│   │  ↑30% CSAT   │  │  ↑40% CTR    │  │  ↑25% engagement│       │
│   │              │  │              │  │              │         │
│   │  Small model │  │  Fine-tuned  │  │  Auto-summarize│       │
│   │  handles     │  │  on catalog  │  │  top 100     │         │
│   │  80% of FAQs │  │  data        │  │  reviews     │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Black Friday Results                                          │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │   Normal     │  │   Peak       │  │   Savings    │         │
│   │   Traffic    │  │   Traffic    │  │   vs.        │         │
│   │              │  │   (3x load)  │  │   Competitors│         │
│   │   $52K/month │  │   $142K      │  │              │         │
│   │              │  │              │  │   $416K      │         │
│   │              │  │              │  │   saved      │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Results                                                         │
│                                                                 │
│   "During Black Friday we handled 3x traffic without 3x costs.  │
│    Slancha saved us $416K vs. our previous setup."              │
│   — VP of Engineering, E-commerce Platform                      │
│                                                                 │
│   [3 stats: 68% cost reduction, 133% higher throughput, 50%    │
│    lower P99 latency]                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Pricing for E-commerce Teams                                  │
│                                                                 │
│   [Tier cards: Pro ($499/mo), Team ($999/mo), Enterprise       │
│    (custom)]                                                     │
│   • All tiers: Auto-scaling included                            │
│   • Enterprise: Priority support, custom SLA                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   FAQ: E-commerce-Specific Questions                            │
│                                                                 │
│   • How does pricing scale with traffic?                        │
│   • Can you handle Black Friday-level traffic?                  │
│   • How do you maintain low latency at scale?                   │
│   • What's the migration process?                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Ready to Scale Your AI Inference?                             │
│                                                                 │
│   Start your 14-day trial. Auto-scales with your traffic.      │
│                                                                 │
│   [Start Free Trial]                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header / Nav

Uses existing global nav (`site/design/nav.md`). No modifications needed.

---

### Hero Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   AI Inference, Built for Scale                                  │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   Handle 10x traffic spikes without 10x cost increases.         │
│   Auto-scale inference with task-specific fine-tuned models.    │
│                                                                  │
│   ┌────────────────────┐  ┌──────────────────────────────────┐  │
│   │ [Start Free       │  │  →  See Black Friday Results     │  │
│   │   Trial]           │  │                                  │  │
│   └────────────────────┘  └──────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Background | `linear-gradient(180deg, #0A0A0A 0%, #1a1a2e 100%)` |
| Max-width | 1200px, centered |
| Padding | 96px 24px |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Headline | H1 | 56px | 700 | `#ffffff` |
| Subheadline | Body | 20px | 400 | `#b0b0b0` |
| CTA Primary | Button | 16px | 600 | `#ffffff` on `#0A84FF` |
| CTA Secondary | Link | 16px | 600 | `#f5576c` (e-commerce red) |

**Buttons:**

- **Primary (Start Free Trial):** 160px × 52px, `border-radius: 8px`, `background: #0A84FF`, hover: `scale(1.02)`, `box-shadow: 0 8px 24px rgba(10,132,255,0.4)`
- **Secondary (See Black Friday Results):** text link with right arrow icon, `color: #f5576c`

**Responsive:**

- **Mobile (≤599px):** H1: 36px, H2: 24px, padding: 64px 20px, buttons stacked full-width
- **Tablet (600-899px):** H1: 48px, padding: 80px 24px, buttons side-by-side
- **Desktop (≥900px):** H1: 56px, padding: 96px 24px, buttons side-by-side

---

### Problem Section (3-Column Cards)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   The E-commerce Inference Problem                               │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ 📈           │  │ 💸           │  │ ⚙️           │          │
│   │ Black Friday │  │ Linear       │  │ Engineering  │          │
│   │ Cost Spikes  │  │ Scaling      │  │ Overload     │          │
│   │              │  │              │  │              │          │
│   │ 3x traffic   │  │ Every extra  │  │ Vendor       │          │
│   │ = 3x costs   │  │ request =    │  │ management   │          │
│   │              │  │ extra cost   │  │ eats into    │          │
│   │ Last Black   │  │              │  │ engineering  │          │
│   │ Friday we    │  │ No way to    │  │ time         │          │
│   │ spent $186K  │  │ differentiate│  │                │          │
│   │ on API calls │  │ high-value   │  │                │          │
│   │ (would have  │  │ from low-    │  │                │          │
│   │ been $558K)  │  │ value queries│  │                │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Section padding | 64px 24px |
| Card background | `#1a1a2e` |
| Card border | `1px solid #2a2a4a` |
| Card border-radius | 12px |
| Card padding | 32px |
| Icon size | 48px × 48px |
| Icon background | Circle, gradient per card |

**Card Gradient Colors:**

| Card | Gradient |
|------|----------|
| Black Friday Cost Spikes | `linear-gradient(135deg, #f5576c 0%, #f093fb 100%)` |
| Linear Scaling | `linear-gradient(135deg, #f5576c 0%, #f5576c 100%)` |
| Engineering Overload | `linear-gradient(135deg, #fa709a 0%, #fee140 100%)` |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section title | H2 | 36px | 700 | `#ffffff` |
| Card title | H3 | 20px | 600 | `#ffffff` |
| Card body | Body | 15px | 400 | `#b0b0b0` |

**Hover:** `translateY(-8px)`, `box-shadow: 0 12px 32px rgba(0,0,0,0.3)`, border: `1px solid #f5576c`

**Responsive:**

- **Mobile:** Cards stacked (1 column)
- **Tablet/Desktop:** Cards in 3-column grid, gap 24px

---

### Solution Section (Left Diagram / Right Benefits)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   How Slancha Solves It                                          │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────────┐  ┌─────────────────────────────────────┐ │
│   │                  │  │  Auto-scales                        │ │
│   │  [Scale diagram  │  │  → no infrastructure provisioning   │ │
│   │   / traffic flow]│  │                                     │ │
│   │                  │  │  Simple queries →                 │ │
│   │  Normal →        │  │  small models → 70% savings        │ │
│   │  Peak (3x) →     │  │                                     │ │
│   │  Slancha         │  │  Multi-token                        │ │
│   │  handles it      │  │  prediction → 2x throughput         │ │
│   │  (cost doesn't   │  │                                     │ │
│   │   scale linearly)│  │  Router auto-                       │ │
│   │                  │  │  distributes load                   │ │
│   └──────────────────┘  └─────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Section padding | 64px 24px |
| Max-width | 1200px, centered |
| Background | `#0f0f1a` |

**Left Diagram:**

- **Format:** SVG scale/traffic flow diagram
- **Components:** Normal traffic box, Peak traffic box, Slancha box
- **Arrows:** Show traffic flow with non-linear cost curve
- **Accent color:** `#f5576c` for e-commerce theme
- **Size:** 480px × 360px (desktop), full-width on mobile

**Right Benefits:**

- **List style:** 3-item bulleted list
- **Icon per item:** ✓ checkmark in accent color circle
- **Font:** Body, 16px, `#b0b0b0`
- **Line-height:** 1.8
- **Margin per item:** 16px

**Responsive:**

- **Mobile:** Diagram top (full-width), benefits bottom
- **Desktop:** Diagram left (480px), benefits right (flex: 1)

---

### Use Cases Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   E-commerce Use Cases                                           │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ 💬           │  │ 🛍️           │  │ ⭐           │          │
│   │ Customer     │  │ Product      │  │ Reviews      │          │
│   │ Support      │  │ Descriptions │  │ Summarization│          │
│   │              │  │              │  │              │          │
│   │  ↓70% cost   │  │  ↓50% cost   │  │  ↓60% cost   │          │
│   │  ↑30% CSAT   │  │  ↑40% CTR    │  │  ↑25% engagement│       │
│   │              │  │              │  │              │         │
│   │  Small model │  │  Fine-tuned  │  │  Auto-summarize│      │
│   │  handles     │  │  on catalog  │  │  top 100     │          │
│   │  80% of FAQs │  │  data        │  │  reviews     │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Section padding | 64px 24px |
| Max-width | 1200px, centered |
| Background | `#1a1a2e` |

**Card Specs:**

| Element | Style |
|---------|-------|
| Card background | `#0f0f1a` |
| Card border | `1px solid #2a2a4a` |
| Card border-radius | 12px |
| Card padding | 32px |
| Icon size | 56px × 56px |
| Icon background | Circle, gradient |

**Icon Gradients:**

| Use Case | Gradient |
|----------|----------|
| Customer Support | `linear-gradient(135deg: #fa709a 0%, #fee140 100%)` |
| Product Descriptions | `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` |
| Reviews Summarization | `linear-gradient(135deg, #f5576c 0%, #f093fb 100%)` |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Card title | H3 | 24px | 600 | `#ffffff` |
| Metric (cost) | Metric | 32px | 700 | `#0A84FF` |
| Metric (engagement) | Metric | 20px | 600 | `#43e97b` |
| Card body | Body | 15px | 400 | `#b0b0b0` |

**Hover:** `translateY(-4px)`, `border: 1px solid #f5576c`, `box-shadow: 0 8px 24px rgba(245,87,108,0.2)`

**Responsive:**

- **Mobile:** Cards stacked (1 column)
- **Tablet:** 2-column grid (third card spans full-width)
- **Desktop:** 3-column grid, equal width

---

### Black Friday Results Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Black Friday Results                                           │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │   Normal     │  │   Peak       │  │   Savings    │          │
│   │   Traffic    │  │   Traffic    │  │   vs.        │          │
│   │              │  │   (3x load)  │  │   Competitors│          │
│   │              │  │              │  │              │          │
│   │   $52K       │  │   $142K      │  │              │          │
│   │              │  │              │  │   $416K      │          │
│   │              │  │              │  │   saved      │          │
│   │              │  │              │  │              │          │
│   │   50K reqs   │  │   150K reqs  │  │              │          │
│   │              │  │              │  │              │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│   Previous setup would have cost: $558K (3x baseline)           │
│   Slancha cost: $142K (24% reduction from baseline)             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Section padding | 64px 24px |
| Max-width | 1200px, centered |
| Background | `#1a1a2e` |

**Card Specs:**

| Element | Style |
|---------|-------|
| Card background | `#0f0f1a` |
| Card border | `1px solid #2a2a4a` |
| Card border-radius | 12px |
| Card padding | 32px |
| Icon size | 40px × 40px |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Card title | H3 | 20px | 600 | `#ffffff` |
| Metric (cost) | Metric | 48px | 700, `#f5576c` |
| Metric (savings) | Metric | 36px | 700, `#43e97b` |
| Subtext | Body | 14px | 400, `#b0b0b0` |

**Summary Box (below cards):**

| Element | Style |
|---------|-------|
| Background | `#162a3a` (accented with red) |
| Border | `1px solid #f5576c` |
| Border-radius | 8px |
| Padding | 16px 24px |
| Font | Body, 14px, `#b0b0b0` |

**Responsive:**

- **Mobile:** Cards stacked (1 column), summary below
- **Tablet:** 2-column (third card full-width), summary below
- **Desktop:** 3-column grid, summary below

---

### Results/Testimonial Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Results                                                        │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  "During Black Friday we handled 3x traffic without 3x   │   │
│   │   costs. Slancha saved us $416K vs. our previous setup." │   │
│   │                                                           │   │
│   │  — [Name], VP of Engineering                             │   │
│   │  [E-commerce Co.]                                        │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │   68%        │  │   133%       │  │   50%        │          │
│   │   Cost       │  │   Higher     │  │   Lower      │          │
│   │   Reduction  │  │   Throughput │  │   P99 Latency │         │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Section padding | 64px 24px |
| Max-width | 1000px, centered |
| Background | `#1a1a2e` |

**Testimonial Box:**

| Element | Style |
|---------|-------|
| Background | `#162a3a` (blue-tinted) |
| Border | `1px solid #2a4a6a` |
| Border-radius | 12px |
| Padding | 32px |
| Quote font | Body, 18px, italic, `#ffffff` |
| Attribution font | Body, 14px, semibold, `#f5576c` |

**Metric Cards:**

| Element | Style |
|---------|-------|
| Card background | `#0f0f1a` |
| Card border | `1px solid #2a2a4a` |
| Metric value font | Display, 48px, 700, `#f5576c` |
| Metric label font | Body, 14px, 600, `#b0b0b0` |
| Padding | 32px |
| Border-radius | 12px |

**Animations:**

- Metric values animate from 0 on scroll (count-up)
- Duration: 2 seconds
- Easing: `ease-out`

**Responsive:**

- **Mobile:** Testimonial full-width, metrics stacked
- **Desktop:** Testimonial top, metrics 3-column grid

---

### Pricing Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Pricing for E-commerce Teams                                   │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ Pro          │  │ Team         │  │ Enterprise   │          │
│   │              │  │              │  │              │          │
│   │ $499/mo      │  │ $999/mo      │  │ Custom       │          │
│   │              │  │              │  │              │          │
│   │ ✓ All Pro    │  │ ✓ All Team   │  │ ✓ All        │          │
│   │   features   │  │   features   │  │   Enterprise │          │
│   │ ✓ 50K reqs   │  │ ✓ 200K reqs  │  │   features   │          │
│   │ ✓ Auto-scale │  │ ✓ Auto-scale │  │ ✓ Unlimited  │          │
│   │   included   │  │   included   │  │   requests   │          │
│   │ ✓ Basic      │  │ ✓ Priority   │  │ ✓ Custom     │          │
│   │   support    │  │   support    │  │   SLA        │          │
│   │              │  │              │  │ ✓ Dedicated  │          │
│   │ [Start Free  │  │ [Start Free  │  │   support    │          │
│   │   Trial]     │  │   Trial]     │  │ [Contact Sales]│        │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│   Note: All tiers include auto-scaling. Enterprise plan adds   │
│   custom SLA, dedicated support, and priority routing.          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Section padding | 64px 24px |
| Max-width | 1200px, centered |
| Background | `#0f0f1a` |

**Card Styling:**

| Element | Pro | Team | Enterprise |
|---------|-----|------|------------|
| Border | `1px solid #2a2a4a` | `1px solid #0A84FF` | `1px solid #f5576c` (e-commerce accent) |
| Background | `#1a1a2e` | `#1a1a2e` | `#1a1a2e` |
| Title | 28px, 700, `#ffffff` | 28px, 700, `#ffffff` | 28px, 700, `#ffffff` |
| Price | 36px, 700, `#0A84FF` | 36px, 700, `#0A84FF` | 36px, 700, `#f5576c` |
| Features list | 15px, `#b0b0b0` | 15px, `#b0b0b0` | 15px, `#b0b0b0` |

**Button Styling:**

| Element | Pro | Team | Enterprise |
|---------|-----|------|------------|
| Primary button | `#0A84FF`, white text | `#0A84FF`, white text | `#f5576c`, white text |
| Button text | Start Free Trial | Start Free Trial | Contact Sales |
| Button size | 140px × 48px | 140px × 48px | 160px × 48px |

**Responsive:**

- **Mobile:** Cards stacked (1 column)
- **Tablet:** 2-column grid (Enterprise spans full-width)
- **Desktop:** 3-column grid, equal width

---

### FAQ Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   FAQ: E-commerce-Specific Questions                             │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ How does pricing scale with traffic?       [+]             │ │
│   └────────────────────────────────────────────────────────────┘ │
│   Pricing scales with request volume, not linearly. Simple     │
│   queries routed to small models cost 70% less. Our fine-      │
│   tuned models handle routine queries at a fraction of the     │
│   cost of frontier models. Peak traffic doesn't mean peak cost.│
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Can you handle Black Friday-level traffic?     [+]         │ │
│   └────────────────────────────────────────────────────────────┘ │
│   Yes — auto-scaling is built-in. We've handled 3x traffic     │
│   spikes for e-commerce customers without infrastructure       │
│   provisioning. The cost doesn't scale linearly either.        │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Maintain low latency at scale?         [+]                 │ │
│   └────────────────────────────────────────────────────────────┘ │
│   Multi-token prediction and quantization give us 2x throughput│
│   and 50% lower P99 latency vs. standard setups. Router        │
│   distributes load across optimal models automatically.        │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Migration process?             [+]                         │ │
│   └────────────────────────────────────────────────────────────┘ │
│   One API endpoint change (OpenAI-compatible). Typical         │
│   migration: 1 week. We provide SDKs for Python, TypeScript,   │
│   and cURL. Our team can help with the transition.             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Section padding | 64px 24px |
| Max-width | 800px, centered |
| Background | `#1a1a2e` |

**Accordion Card:**

| Element | Style |
|---------|-------|
| Background | `#0f0f1a` |
| Border | `1px solid #2a2a4a` |
| Border-radius | 8px |
| Padding | 20px 24px |
| Hover background | `#162a3a` |

**Accordion Header:**

| Element | Style |
|---------|-------|
| Question font | Body, 16px, 600, `#ffffff` |
| Expand icon | + / -, 20px, right-aligned |
| Cursor | pointer |

**Accordion Body:**

| Element | Style |
|---------|-------|
| Font | Body, 15px, 400, `#b0b0b0` |
| Padding | 16px 0 0 0 |
| Max-height | 0 (collapsed), 500px (expanded) |
| Transition | max-height 300ms ease |

**Responsive:**

- **Mobile:** Full-width accordion, inline expansion
- **Desktop:** Max-width 800px, same behavior

---

### Footer CTA

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Ready to Scale Your AI Inference?                              │
│                                                                  │
│   Start your 14-day trial. Auto-scales with your traffic.       │
│                                                                  │
│   ┌────────────────────┐                                        │
│   │ [Start Free       │                                        │
│   │   Trial]           │                                        │
│   └────────────────────┘                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Background | `linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)` |
| Max-width | 600px, centered |
| Padding | 64px 24px |
| Text-align | center |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Headline | H2 | 36px | 700 | `#ffffff` |
| Subheadline | Body | 16px | 400 | `#b0b0b0` |
| Button | Button | 16px | 600 | `#ffffff` on `#0A84FF` |

**Button:**

- Size: 200px × 56px
- Border-radius: 8px
- Background: `#0A84FF`
- Hover: `scale(1.02)`, `box-shadow: 0 8px 24px rgba(10,132,255,0.4)`

**Responsive:**

- **Mobile:** Button full-width, padding: 48px 20px
- **Desktop:** Button 200px width

---

## Visual Hierarchy

1. **Hero Headline** — Primary attention (H1, 56px, 700)
2. **Primary CTA** — High contrast, accent color
3. **Use Case Cards** — Second level (H3, icons, metrics)
4. **Black Friday Results** — Social proof (large savings numbers)
5. **Results Metrics** — Performance proof
6. **Pricing Cards** — Conversion point
7. **Footer CTA** — Final conversion push

---

## Color Palette

| Element | E-commerce-Specific | Notes |
|---------|--------------------|-------|
| Page background | `#0f0f1a` | Primary dark |
| Section backgrounds | `#1a1a2e` | Cards, boxes |
| Text primary | `#ffffff` | Headlines |
| Text secondary | `#b0b0b0` | Body |
| Accent blue | `#0A84FF` | Primary (consistent) |
| E-commerce red | `#f5576c` | E-commerce-specific accent |
| Success green | `#43e97b` | Savings/performance metrics |
| Borders | `#2a2a4a` | Card borders |
| Teal tint | `#162a3a` | Testimonial background |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | ≤599px | Single column, stacked cards, full-width buttons |
| Tablet | 600-899px | 2-column grids, larger fonts |
| Desktop | ≥900px | 3-column grids, max-width 1200px |

**Font Size Adjustments:**

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| H1 | 36px | 48px | 56px |
| H2 | 28px | 32px | 36px |
| H3 | 20px | 24px | 24px |
| Body | 15px | 16px | 16px |
| Metric | 32px | 40px | 48px |

---

## CSS Class Reference

| Element | Class Name | Notes |
|---------|------------|-------|
| Section | `.vertical-ecommerce` | Page wrapper |
| Hero | `.hero` | Hero section |
| Problem cards | `.problem-cards` | 3-column |
| Card | `.card` | Base card |
| Use cases | `.use-cases` | Use case grid |
| Black Friday | `.black-friday-results` | Scale comparison |
| Testimonial | `.testimonial` | Quote box |
| Metrics | `.metrics-grid` | Results metrics |
| Pricing | `.pricing-cards` | Pricing section |
| FAQ | `.faq-accordion` | FAQ section |
| CTA | `.footer-cta` | Footer callout |

---

## Animations

### Scroll Reveal
- Sections fade in + slide up 20px
- Duration: 600ms
- Easing: `ease-out`
- Trigger: 15% of section visible

### Metric Counters
- Numbers animate from 0 to final value
- Duration: 2000ms
- Easing: `ease-out`
- Trigger: Section enters viewport

### Hover Effects
- Problem cards: `translateY(-8px)`
- Use case cards: `translateY(-4px)` + border accent
- Pricing cards: Same as use cases
- Button: `scale(1.02)` + shadow

### Scale Diagram
- Animated traffic flow arrows
- Cost curve visualization
- Duration: 3s loop

---

## JavaScript Components

### MetricCounter (reused from use-cases.md)
```jsx
interface MetricCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}
```

### Accordion (for FAQ)
```jsx
interface AccordionProps {
  question: string;
  children: React.ReactNode;
}

function Accordion({ question, children }: AccordionProps)
```

### ScaleDiagram (new)
```jsx
function ScaleDiagram() {
  // Animated traffic flow: Normal → Peak
  // Non-linear cost curve visualization
  // Duration: 3s loop
  // Use SVG with CSS animations or Framer Motion
}
```

---

## QA Checklist

- [ ] Hero headline and CTA render correctly
- [ ] All 3 problem cards present with icons
- [ ] Scale diagram renders on all devices
- [ ] All 3 use case cards with metrics
- [ ] Black Friday results cards display correctly
- [ ] Metrics animate on scroll
- [ ] Testimonial displays correctly
- [ ] All 3 pricing cards with correct features
- [ ] FAQ accordion expands/collapses smoothly
- [ ] Footer CTA button wired to sign-up
- [ ] Responsive at 375px, 768px, 1024px
- [ ] No console errors
- [ ] Lighthouse performance >90
- [ ] E-commerce red (`#f5576c`) used consistently

---

## Copy Dependencies

This spec assumes the following copy files will be created:

**Hero:**
- `site/copy/verticals/ecommerce-hero-title.md` — "AI Inference, Built for Scale"
- `site/copy/verticals/ecommerce-hero-subtitle.md` — "Handle 10x traffic spikes..."
- `site/copy/verticals/ecommerce-cta-primary.md` — "Start Free Trial"
- `site/copy/verticals/ecommerce-cta-secondary.md` — "See Black Friday Results"

**Problem Section:**
- `site/copy/verticals/ecommerce-problem-title.md` — "The E-commerce Inference Problem"
- `site/copy/verticals/ecommerce-problem-1-title.md` — "Black Friday Cost Spikes"
- `site/copy/verticals/ecommerce-problem-1-body.md`
- `site/copy/verticals/ecommerce-problem-2-title.md` — "Linear Scaling"
- `site/copy/verticals/ecommerce-problem-2-body.md`
- `site/copy/verticals/ecommerce-problem-3-title.md` — "Engineering Overload"
- `site/copy/verticals/ecommerce-problem-3-body.md`

**Solution Section:**
- `site/copy/verticals/ecommerce-solution-title.md` — "How Slancha Solves It"
- `site/copy/verticals/ecommerce-solution-benefits.md` — 3 benefit items

**Use Cases:**
- `site/copy/verticals/ecommerce-usecases-title.md` — "E-commerce Use Cases"
- `site/copy/verticals/ecommerce-support-title.md`, `-body.md`, `-metrics.md`
- `site/copy/verticals/ecommerce-product-title.md`, `-body.md`, `-metrics.md`
- `site/copy/verticals/ecommerce-reviews-title.md`, `-body.md`, `-metrics.md`

**Black Friday Results:**
- `site/copy/verticals/ecommerce-bf-title.md` — "Black Friday Results"
- `site/copy/verticals/ecommerce-bf-normal.md` — Normal traffic card
- `site/copy/verticals/ecommerce-bf-peak.md` — Peak traffic card
- `site/copy/verticals/ecommerce-bf-savings.md` — Savings card
- `site/copy/verticals/ecommerce-bf-summary.md` — Summary box text

**Results:**
- `site/copy/verticals/ecommerce-results-title.md` — "Results"
- `site/copy/verticals/ecommerce-testimonial-quote.md`
- `site/copy/verticals/ecommerce-testimonial-author.md`
- `site/copy/verticals/ecommerce-metric-1.md`, `metric-2.md`, `metric-3.md`

**Pricing:**
- `site/copy/verticals/ecommerce-pricing-title.md` — "Pricing for E-commerce Teams"
- `site/copy/verticals/ecommerce-pricing-pro.md`
- `site/copy/verticals/ecommerce-pricing-team.md`
- `site/copy/verticals/ecommerce-pricing-enterprise.md`
- `site/copy/verticals/ecommerce-pricing-note.md`

**FAQ:**
- `site/copy/verticals/ecommerce-faq-title.md` — "FAQ: E-commerce-Specific Questions"
- `site/copy/verticals/ecommerce-faq-1.md` through `faq-4.md`

**Footer CTA:**
- `site/copy/verticals/ecommerce-cta-title.md` — "Ready to Scale Your AI Inference?"
- `site/copy/verticals/ecommerce-cta-subtitle.md`
- `site/copy/verticals/ecommerce-cta-button.md` — "Start Free Trial"

---

## Next Steps for Frontend

1. Create `VerticalEcommercePage.jsx` component
2. Create `ScaleDiagram.jsx` component
3. Implement `MetricCounter` component (reuse from use-cases)
4. Implement `Accordion` component for FAQ
5. Wire copy from copy files
6. Apply scroll reveal animations
7. Test responsive breakpoints
8. QA animations and hover states
9. Integrate with global nav and footer
10. Set up routing: `/ecommerce`

---

## Notes for Design/Frontend Collaboration

- **Consistency:** This page uses the same design system as the rest of the site (colors, typography, components)
- **E-commerce Differentiation:** The ecommerce page is distinguished by e-commerce red accent (`#f5576c`), scale/traffic messaging, and Black Friday results
- **Component Reuse:** Most components (cards, buttons, accordions) are shared with other pages
- **Animation Budget:** Keep animations performant — e-commerce buyers expect speed, not bloat
- **Performance:** Scale diagram should be SVG with CSS animations (no heavy JS libraries)
- **Real Data:** If possible, use real Black Friday data from actual customers (even if anonymized)

---

## Related Specs

- `site/design/homepage.md` — Global design system reference
- `site/design/nav.md` — Navigation component
- `site/design/offerings.md` — Pricing tier cards
- `site/design/faq.md` — FAQ accordion pattern
- `site/design/use-cases.md` — Use case cards pattern
- `site/design/vertical-fintech.md` — Similar vertical page
- `site/design/vertical-healthcare.md` — Similar vertical page

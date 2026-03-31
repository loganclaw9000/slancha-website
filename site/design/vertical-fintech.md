# Design Spec — Vertical Landing Page: Fintech

## Purpose
A dedicated landing page for fintech companies considering Slancha. This page speaks directly to fintech pain points: compliance, cost predictability, fraud detection accuracy, and the need to reduce ML ops overhead without sacrificing security.

**Target ICP:** ICP-A (AI-Native Fintech Startups) and ICP-B/C (Mid-Market & Enterprise Fintech)
**URL Pattern:** `slancha.ai/fintech`
**Conversion Goal:** Book pilot demo or start free trial

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
│   AI Inference, Optimized for Fintech                           │
│                                                                 │
│   Cut API costs by 60%+ while improving fraud detection        │
│   accuracy. Zero-config inference with SOC 2 compliance.       │
│                                                                 │
│   [Start Your Free Pilot]  →  See How It Works                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   The Fintech Inference Problem                                 │
│                                                                 │
│   [3-column cards: Rising Costs, Compliance Burden,            │
│    Model Benchmarking Drains]                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   How Slancha Solves It                                         │
│                                                                 │
│   [Left: Product diagram / architecture]   [Right: 3 benefits]  │
│                                                                 │
│   • One API endpoint → auto-routes to optimal model            │
│   • Auto-fine-tune on production data → better fraud detection │
│   • SOC 2 Type II in progress + enterprise security            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Use Cases                                                       │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │  Fraud       │  │  KYC         │  │  Customer    │         │
│   │  Detection   │  │  Verification│  │  Support     │         │
│   │  ↓70% cost   │  │  ↓60% cost   │  │  ↓80% cost   │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Compliance-First Architecture                                 │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │  SOC 2       │  │  Data        │  │  Audit       │         │
│   │  Ready       │  │  Isolation   │  │  Trails      │         │
│   │  Type II     │  │  VPC         │  │  Full logging│         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Results                                                         │
│                                                                 │
│   "We cut API costs from $42K/month to $13.7K/month —            │
│    67% savings while improving fraud detection accuracy."       │
│   — CTO, Series B Fintech                                       │
│                                                                 │
│   [3 stats: 67% cost reduction, 53% faster latency, 90% less    │
│    engineering time]                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Pricing for Fintech Teams                                     │
│                                                                 │
│   [Tier cards: Pro ($499/mo), Team ($999/mo), Enterprise       │
│    (custom)]                                                     │
│   • All tiers include SOC 2 compliance features                 │
│   • Enterprise: BAA, on-prem, SLA                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   FAQ: Fintech-Specific Questions                               │
│                                                                 │
│   • Is Slancha SOC 2 compliant?                                 │
│   • Can I deploy in my own VPC?                                 │
│   • How do you handle data for fine-tuning?                    │
│   • What's the migration process from OpenAI/Anthropic?        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Ready to Cut Your Inference Costs?                            │
│                                                                 │
│   Start your 14-day pilot. No credit card required.             │
│                                                                 │
│   [Start Your Free Pilot]                                       │
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
│   AI Inference, Optimized for Fintech                            │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   Cut API costs by 60%+ while improving fraud detection          │
│   accuracy. Zero-config inference with SOC 2 compliance.         │
│                                                                  │
│   ┌────────────────────┐  ┌──────────────────────────────────┐  │
│   │ [Start Your Free   │  │  →  See How It Works             │  │
│   │   Pilot]           │  │                                  │  │
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
| CTA Secondary | Link | 16px | 600 | `#0A84FF` |

**Buttons:**

- **Primary (Start Free Pilot):** 160px × 52px, `border-radius: 8px`, `background: #0A84FF`, hover: `scale(1.02)`, `box-shadow: 0 8px 24px rgba(10,132,255,0.4)`
- **Secondary (See How It Works):** text link with right arrow icon, no background

**Responsive:**

- **Mobile (≤599px):** H1: 36px, H2 (if exists): 24px, padding: 64px 20px, buttons stacked full-width
- **Tablet (600-899px):** H1: 48px, padding: 80px 24px, buttons side-by-side
- **Desktop (≥900px):** H1: 56px, padding: 96px 24px, buttons side-by-side

---

### Problem Section (3-Column Cards)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   The Fintech Inference Problem                                  │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ 📈           │  │ 🔒           │  │ ⏱️           │          │
│   │ Rising Costs │  │ Compliance   │  │ Benchmarking │          │
│   │              │  │ Burden       │  │ Drains       │          │
│   │ API bills    │  │              │  │ Engineering  │          │
│   │ exploding    │  │ SOC 2, HIPAA,│  │ time on      │          │
│   │ with usage   │  │ audit trails │  │ model eval   │          │
│   │              │  │ slow down    │  │ instead of   │          │
│   │ OpenAI at    │  │ shipping     │  │ shipping     │          │
│   │ $5B loss on  │  │              │  │ features       │          │
│   │ inference    │  │              │  │                │          │
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
| Rising Costs | `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` |
| Compliance Burden | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` |
| Benchmarking Drains | `linear-gradient(135deg, #fa709a 0%, #fee140 100%)` |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section title | H2 | 36px | 700 | `#ffffff` |
| Card title | H3 | 20px | 600 | `#ffffff` |
| Card body | Body | 15px | 400 | `#b0b0b0` |

**Hover:** `translateY(-8px)`, `box-shadow: 0 12px 32px rgba(0,0,0,0.3)`, border: `1px solid #0A84FF`

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
│   │                  │  │  One API endpoint                   │ │
│   │  [Architecture   │  │  → auto-routes to optimal model     │ │
│   │   diagram]       │  │                                     │ │
│   │                  │  │  Auto-fine-tune                     │ │
│   │  Router →        │  │  → better fraud detection           │ │
│   │  Fine-tune →     │  │                                     │ │
│   │  Optimize loop   │  │  SOC 2 Type II                      │ │
│   │  (automatic)     │  │  + enterprise security              │ │
│   │                  │  │                                     │ │
│   └──────────────────┘  │  Zero-config:                       │ │
│                         │  → no model selection                 │ │
│                         │  → no eval framework setup            │ │
│                         │  → no dedicated ML team needed        │ │
│                         └─────────────────────────────────────┘ │
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

- **Format:** SVG architecture diagram
- **Components:** Router box, Fine-tune box, Optimize loop box
- **Arrows:** Animated flow (→)
- **Accent color:** `#0A84FF` for Slancha branding
- **Size:** 480px × 360px (desktop), full-width on mobile

**Right Benefits:**

- **List style:** 5-item bulleted list
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
│   Use Cases                                                      │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ 🎯           │  │ 📄           │  │ 💬           │          │
│   │ Fraud        │  │ KYC          │  │ Customer     │          │
│   │ Detection    │  │ Verification │  │ Support      │          │
│   │              │  │              │  │              │          │
│   │ ↓70% cost    │  │ ↓60% cost    │  │ ↓80% cost    │          │
│   │ ↑15% accuracy│  │ ↑25% speed   │  │ ↑30% CSAT    │          │
│   │              │  │              │  │              │          │
│   │ Fine-tuned   │  │ SOC 2-ready  │  │ Small model  │          │
│   │ models match │  │ compliance   │  │ handles 80%  │          │
│   │ GPT-4 at 1/5 │  │ auto-applied │  │ of queries   │          │
│   │ the cost     │  │              │  │              │          │
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
| Fraud Detection | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` |
| KYC Verification | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` |
| Customer Support | `linear-gradient(135deg, #fa709a 0%, #fee140 100%)` |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Card title | H3 | 24px | 600 | `#ffffff` |
| Metric (cost) | Metric | 32px | 700 | `#0A84FF` |
| Metric (accuracy) | Metric | 20px | 600 | `#43e97b` |
| Card body | Body | 15px | 400 | `#b0b0b0` |

**Hover:** `translateY(-4px)`, `border: 1px solid #0A84FF`, `box-shadow: 0 8px 24px rgba(10,132,255,0.2)`

**Responsive:**

- **Mobile:** Cards stacked (1 column)
- **Tablet:** 2-column grid (third card spans full-width)
- **Desktop:** 3-column grid, equal width

---

### Compliance Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Compliance-First Architecture                                  │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ 🔐           │  │ 🏢           │  │ 📋           │          │
│   │ SOC 2        │  │ Data         │  │ Audit        │          │
│   │ Ready        │  │ Isolation    │  │ Trails       │          │
│   │              │  │              │  │              │          │
│   │ Type II in   │  │ VPC-only     │  │ Full request │          │
│   │ progress     │  │ deployment   │  │ /response    │          │
│   │ (expected    │  │ option       │  │ logging with │          │
│   │ Q2 2026)     │  │              │  │ model        │          │
│   │              │  │ Data never   │  │ attribution  │          │
│   │ Our security │  │ leaves your  │  │              │          │
│   │ team is      │  │ VPC without  │  │ Every API    │          │
│   │ auditing     │  │ consent      │  │ call is      │          │
│   │ against      │  │              │  │ logged with  │          │
│   │ SOC 2 Type II│  │              │  │ which model  │          │
│   │ criteria     │  │              │  │ processed it │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Section padding | 64px 24px |
| Max-width | 1200px, centered |
| Background | `#0f0f1a` |

**Card Styling:** Same as Use Cases section, but with compliance-specific icons:

- **SOC 2:** Lock icon 🔐
- **Data Isolation:** Building/VPC icon 🏢
- **Audit Trails:** Document/checklist icon 📋

**Interactive Element:**

- Click each card to expand with more detail (accordion style)
- **SOC 2 expansion:** SOC 2 Type II checklist, expected audit date, what's covered
- **Data Isolation expansion:** VPC peering details, data residency options, BAA info
- **Audit Trails expansion:** Log retention policy, export formats, integration with SIEM

**Responsive:**

- **Mobile:** Cards stacked with accordion expansion inline
- **Desktop:** Cards side-by-side, expansion in modal or slide-out panel

---

### Results/Testimonial Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Results                                                        │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  "We cut API costs from $42K/month to $13.7K/month —     │   │
│   │   67% savings while improving fraud detection accuracy." │   │
│   │                                                           │   │
│   │  — [Name], CTO                                           │   │
│   │  [Fintech Co.] (Series B)                                │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │   67%        │  │   53%        │  │   90%        │          │
│   │   Cost       │  │   Faster     │  │   Less       │          │
│   │   Reduction  │  │   Latency    │  │   Eng. Time  │          │
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
| Attribution font | Body, 14px, semibold, `#0A84FF` |

**Metric Cards:**

| Element | Style |
|---------|-------|
| Card background | `#0f0f1a` |
| Card border | `1px solid #2a2a4a` |
| Metric value font | Display, 48px, 700, `#0A84FF` |
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
│   Pricing for Fintech Teams                                      │
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
│   │ ✓ Basic      │  │ ✓ Priority   │  │ ✓ Unlimited  │          │
│   │   support    │  │   support    │  │   requests   │          │
│   │              │  │              │  │ ✓ Custom     │          │
│   │ [Start Free  │  │ [Start Free  │  │   VPC deploy │          │
│   │   Trial]     │  │   Trial]     │  │ ✓ BAA + SLA  │          │
│   │              │  │              │  │ ✓ Dedicated  │          │
│   │              │  │              │  │   support    │          │
│   │              │  │              │  │ [Contact Sales]│        │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│   Note: All tiers include SOC 2 compliance features.             │
│   Enterprise plan includes BAA, on-prem deployment, SLA.         │
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
| Border | `1px solid #2a2a4a` | `1px solid #0A84FF` (accent) | `1px solid #2a2a4a` |
| Background | `#1a1a2e` | `#1a1a2e` | `#1a1a2e` |
| Title | 28px, 700, `#ffffff` | 28px, 700, `#ffffff` | 28px, 700, `#ffffff` |
| Price | 36px, 700, `#0A84FF` | 36px, 700, `#0A84FF` | 36px, 700, `#ffffff` |
| Features list | 15px, `#b0b0b0` | 15px, `#b0b0b0` | 15px, `#b0b0b0` |

**Button Styling:**

| Element | Pro | Team | Enterprise |
|---------|-----|------|------------|
| Primary button | `#0A84FF`, white text | `#0A84FF`, white text | Border `#0A84FF`, text `#0A84FF` |
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
│   FAQ: Fintech-Specific Questions                                │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Is Slancha SOC 2 compliant?      [+]                       │ │
│   └────────────────────────────────────────────────────────────┘ │
│   SOC 2 Type II audit in progress (expected Q2 2026). We're     │
│   operating against SOC 2 criteria with full controls in place. │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Can I deploy in my own VPC?          [+]                   │ │
│   └────────────────────────────────────────────────────────────┘ │
│   Yes — Enterprise plan includes VPC deployment option. Data   │
│   never leaves your VPC without explicit consent.               │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ How do you handle data for fine-tuning?        [+]         │ │
│   └────────────────────────────────────────────────────────────┘ │
│   We curate training data from your production usage. You can  │
│   opt-out any data you don't want used for fine-tuning.        │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Migration from OpenAI/Anthropic?         [+]               │ │
│   └────────────────────────────────────────────────────────────┘ │
│   One API endpoint change (OpenAI-compatible). Typical         │
│   migration: 1-2 weeks. We provide SDKs for Python, TypeScript,│
│   and cURL.                                                       │
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
│   Ready to Cut Your Inference Costs?                             │
│                                                                  │
│   Start your 14-day pilot. No credit card required.             │
│                                                                  │
│   ┌────────────────────┐                                        │
│   │ [Start Your Free   │                                        │
│   │   Pilot]           │                                        │
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
4. **Results Metrics** — Social proof (large numbers)
5. **Pricing Cards** — Conversion point
6. **Footer CTA** — Final conversion push

---

## Color Palette

| Element | Fintech-Specific | Notes |
|---------|-----------------|-------|
| Page background | `#0f0f1a` | Primary dark |
| Section backgrounds | `#1a1a2e` | Cards, boxes |
| Text primary | `#ffffff` | Headlines |
| Text secondary | `#b0b0b0` | Body |
| Accent blue | `#0A84FF` | Primary (consistent) |
| Trust blue | `#4facfe` | Compliance section |
| Success green | `#43e97b` | Accuracy metrics |
| Warning red | `#f5576c` | Cost metrics |
| Borders | `#2a2a4a` | Card borders |

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
| Section | `.vertical-fintech` | Page wrapper |
| Hero | `.hero` | Hero section |
| Problem cards | `.problem-cards` | 3-column |
| Card | `.card` | Base card |
| Use cases | `.use-cases` | Use case grid |
| Compliance | `.compliance` | Compliance section |
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

### Architecture Diagram
- Animated arrows (→) flowing left to right
- Loop animation for fine-tune cycle
- Duration: 3s per loop

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

### DiagramAnimation (new)
```jsx
function ArchitectureDiagram() {
  // Animated flow: Router → Fine-tune → Optimize → Router
  // Duration: 3s loop
  // Use SVG with CSS animations or Framer Motion
}
```

---

## QA Checklist

- [ ] Hero headline and CTA render correctly
- [ ] All 3 problem cards present with icons
- [ ] Architecture diagram renders on all devices
- [ ] All 3 use case cards with metrics
- [ ] Metrics animate on scroll
- [ ] Testimonial displays correctly
- [ ] All 3 pricing cards with correct features
- [ ] FAQ accordion expands/collapses smoothly
- [ ] Footer CTA button wired to sign-up
- [ ] Responsive at 375px, 768px, 1024px
- [ ] No console errors
- [ ] Lighthouse performance >90
- [ ] Dark mode consistent with site design

---

## Copy Dependencies

This spec assumes the following copy files will be created:

**Hero:**
- `site/copy/verticals/fintech-hero-title.md` — "AI Inference, Optimized for Fintech"
- `site/copy/verticals/fintech-hero-subtitle.md` — "Cut API costs by 60%+..."
- `site/copy/verticals/fintech-cta-primary.md` — "Start Your Free Pilot"
- `site/copy/verticals/fintech-cta-secondary.md` — "See How It Works"

**Problem Section:**
- `site/copy/verticals/fintech-problem-title.md` — "The Fintech Inference Problem"
- `site/copy/verticals/fintech-problem-1-title.md` — "Rising Costs"
- `site/copy/verticals/fintech-problem-1-body.md`
- `site/copy/verticals/fintech-problem-2-title.md` — "Compliance Burden"
- `site/copy/verticals/fintech-problem-2-body.md`
- `site/copy/verticals/fintech-problem-3-title.md` — "Benchmarking Drains"
- `site/copy/verticals/fintech-problem-3-body.md`

**Solution Section:**
- `site/copy/verticals/fintech-solution-title.md` — "How Slancha Solves It"
- `site/copy/verticals/fintech-solution-benefits.md` — 5 benefit items

**Use Cases:**
- `site/copy/verticals/fintech-usecases-title.md` — "Use Cases"
- `site/copy/verticals/fintech-fraud-title.md`, `-body.md`, `-metrics.md`
- `site/copy/verticals/fintech-kyc-title.md`, `-body.md`, `-metrics.md`
- `site/copy/verticals/fintech-support-title.md`, `-body.md`, `-metrics.md`

**Compliance:**
- `site/copy/verticals/fintech-compliance-title.md` — "Compliance-First Architecture"
- `site/copy/verticals/fintech-compliance-soc2.md`
- `site/copy/verticals/fintech-compliance-data.md`
- `site/copy/verticals/fintech-compliance-audit.md`

**Results:**
- `site/copy/verticals/fintech-results-title.md` — "Results"
- `site/copy/verticals/fintech-testimonial-quote.md`
- `site/copy/verticals/fintech-testimonial-author.md`
- `site/copy/verticals/fintech-metric-1.md`, `metric-2.md`, `metric-3.md`

**Pricing:**
- `site/copy/verticals/fintech-pricing-title.md` — "Pricing for Fintech Teams"
- `site/copy/verticals/fintech-pricing-pro.md`
- `site/copy/verticals/fintech-pricing-team.md`
- `site/copy/verticals/fintech-pricing-enterprise.md`
- `site/copy/verticals/fintech-pricing-note.md`

**FAQ:**
- `site/copy/verticals/fintech-faq-title.md` — "FAQ: Fintech-Specific Questions"
- `site/copy/verticals/fintech-faq-1.md` through `faq-4.md`

**Footer CTA:**
- `site/copy/verticals/fintech-cta-title.md` — "Ready to Cut Your Inference Costs?"
- `site/copy/verticals/fintech-cta-subtitle.md`
- `site/copy/verticals/fintech-cta-button.md`

---

## Next Steps for Frontend

1. Create `VerticalFintechPage.jsx` component
2. Create `ArchitectureDiagram.jsx` component
3. Implement `MetricCounter` component (reuse from use-cases)
4. Implement `Accordion` component for FAQ
5. Wire copy from copy files
6. Apply scroll reveal animations
7. Test responsive breakpoints
8. QA animations and hover states
9. Integrate with global nav and footer
10. Set up routing: `/fintech`

---

## Notes for Design/Frontend Collaboration

- **Consistency:** This page uses the same design system as the rest of the site (colors, typography, components)
- **Vertical Differentiation:** The fintech page is distinguished by compliance messaging, trust signals, and finance-specific metrics
- **Component Reuse:** Most components (cards, buttons, accordions) are shared with other pages
- **Animation Budget:** Keep animations subtle — fintech buyers expect professionalism, not gimmicks
- **Performance:** Architecture diagram should be SVG with CSS animations (no heavy JS libraries)

---

## Related Specs

- `site/design/homepage.md` — Global design system reference
- `site/design/nav.md` — Navigation component
- `site/design/offerings.md` — Pricing tier cards
- `site/design/faq.md` — FAQ accordion pattern
- `site/design/use-cases.md` — Use case cards pattern

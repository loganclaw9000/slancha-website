# Design Spec — Vertical Landing Page: Healthtech

## Purpose
A dedicated landing page for healthcare AI companies and healthtech startups. This page speaks directly to healthtech pain points: HIPAA compliance, clinical accuracy, BAAs, and the need to validate AI in regulated environments while reducing inference costs.

**Target ICP:** ICP-A (AI-Native Healthtech Startups) and ICP-B/C (Mid-Market & Enterprise Healthtech)
**URL Pattern:** `slancha.ai/healthcare` or `slancha.ai/healthtech`
**Conversion Goal:** Book compliance review + pilot demo

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
│   AI Inference, Built for Healthcare                            │
│                                                                 │
│   Cut API costs by 58%+ while maintaining clinical accuracy.   │
│   HIPAA-compliant inference with BAA available.                │
│                                                                 │
│   [Request BAA + Pilot]  →  See Compliance Features           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   The Healthtech Inference Problem                              │
│                                                                 │
│   [3-column cards: Cost Per Patient, Compliance Complexity,   │
│    Clinical Validation Time]                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   How Slancha Solves It                                         │
│                                                                 │
│   [Left: HIPAA diagram / compliance flow]   [Right: 3 benefits] │
│                                                                 │
│   • BAA signed, endpoint HIPAA-compliant                        │
│   • Fine-tune on clinical data (with opt-out)                   │
│   • SOC 2 + HIPAA-ready infrastructure                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Clinical Use Cases                                             │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │  Clinical    │  │  Patient     │  │  Medical     │         │
│   │  Notes       │  │  Triage      │  │  Coding      │         │
│   │  Summarization│ │  Q&A         │  │  Automation  │         │
│   │              │  │              │  │              │         │
│   │  ↓58% cost   │  │  ↑40% speed  │  │  ↓65% cost   │         │
│   │  ↓45%        │  │  ↑25%        │  │  ↑20%        │         │
│   │  hallucination│ │  accuracy    │  │  accuracy    │         │
│   │  rate        │  │              │  │              │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   HIPAA & Security                                              │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │  BAA         │  │  HIPAA       │  │  SOC 2       │         │
│   │  Available   │  │  Endpoint    │  │  Type II     │         │
│   │              │  │  Configuration│ │  In Progress │         │
│   │  Sign a BAA  │  │  Encryption  │  │  Full audit  │         │
│   │  before      │  │  at rest &   │  │  logging     │         │
│   │  production  │  │  in transit  │  │  with model  │         │
│   │              │  │              │  │  attribution │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Results                                                         │
│                                                                 │
│   "We cut inference costs from $48K/month to $20K/month —       │
│    58% savings while improving summarization accuracy.          │
│    The BAA process took only 2 weeks."                          │
│   — CTO, HealthTech Platform                                    │
│                                                                 │
│   [3 stats: 58% cost reduction, 43% faster latency, 45% fewer   │
│    hallucinations]                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Pricing for Healthcare Teams                                  │
│                                                                 │
│   [Tier cards: Pro ($499/mo), Team ($999/mo), Enterprise       │
│    (custom)]                                                     │
│   • All tiers: SOC 2 compliance features                        │
│   • Enterprise: BAA, HIPAA endpoint, on-prem                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   FAQ: Healthcare-Specific Questions                            │
│                                                                 │
│   • Do you sign BAAs?                                           │
│   │  How long does the BAA process take?                       │
│   │  Is Slancha HIPAA-compliant?                               │
│   │  How do you prevent hallucinations in clinical settings?   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│   Start Your Compliant Pilot Today                              │
│                                                                 │
│   Request a BAA and start your 14-day pilot.                    │
│                                                                 │
│   [Request BAA + Pilot]                                         │
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
│   AI Inference, Built for Healthcare                             │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   Cut API costs by 58%+ while maintaining clinical accuracy.    │
│   HIPAA-compliant inference with BAA available.                 │
│                                                                  │
│   ┌────────────────────┐  ┌──────────────────────────────────┐  │
│   │ [Request BAA +    │  │  →  See Compliance Features      │  │
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
| CTA Secondary | Link | 16px | 600 | `#4facfe` (healthcare blue) |

**Buttons:**

- **Primary (Request BAA + Pilot):** 180px × 52px, `border-radius: 8px`, `background: #0A84FF`, hover: `scale(1.02)`, `box-shadow: 0 8px 24px rgba(10,132,255,0.4)`
- **Secondary (See Compliance Features):** text link with right arrow icon, `color: #4facfe`

**Responsive:**

- **Mobile (≤599px):** H1: 36px, H2: 24px, padding: 64px 20px, buttons stacked full-width
- **Tablet (600-899px):** H1: 48px, padding: 80px 24px, buttons side-by-side
- **Desktop (≥900px):** H1: 56px, padding: 96px 24px, buttons side-by-side

---

### Problem Section (3-Column Cards)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   The Healthtech Inference Problem                               │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ 💰           │  │ 🔐           │  │ ⏱️           │          │
│   │ Cost Per     │  │ Compliance   │  │ Validation   │          │
│   │ Patient      │  │ Complexity   │  │ Time         │          │
│   │              │  │              │  │              │          │
│   │ Every new    │  │ HIPAA, BAA,  │  │ Clinical     │          │
│   │ patient      │  │ audit trails │  │ validation   │          │
│   │ means higher │  │ slow down    │  │ takes weeks  │          │
│   │ API costs    │  │ shipping     │  │ and manual   │          │
│   │              │  │ new features │  │ testing      │          │
│   │ Clinical     │  │              │  │              │          │
│   │ AI is        │  │ Switching    │  │ Can't ship   │          │
│   │ expensive;   │  │ providers    │  │ fast when    │          │
│   │ margins are  │  │ means re-    │  │ compliance   │          │
│   │ thin         │  │ negotiating  │  │ is pending   │          │
│   │              │  │ new BAAs     │  │              │          │
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
| Cost Per Patient | `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` |
| Compliance Complexity | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` |
| Validation Time | `linear-gradient(135deg, #fa709a 0%, #fee140 100%)` |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section title | H2 | 36px | 700 | `#ffffff` |
| Card title | H3 | 20px | 600 | `#ffffff` |
| Card body | Body | 15px | 400 | `#b0b0b0` |

**Hover:** `translateY(-8px)`, `box-shadow: 0 12px 32px rgba(0,0,0,0.3)`, border: `1px solid #4facfe`

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
│   │                  │  │  BAA signed                         │ │
│   │  [Compliance     │  │  → HIPAA-compliant endpoint         │ │
│   │   flow diagram]  │  │                                     │ │
│   │                  │  │  Fine-tune on                     │ │
│   │  Customer →      │  │  clinical data                      │ │
│   │  BAA →           │  │  → with opt-out for sensitive      │ │
│   │  Endpoint →      │  │    data                              │ │
│   │  Monitor         │  │                                     │ │
│   │  (audit logs)    │  │  SOC 2 + HIPAA-                     │ │
│   │                  │  │  ready infrastructure               │ │
│   └──────────────────┘  │  → enterprise-grade security        │ │
│                         │    baked in                         │ │
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

- **Format:** SVG compliance flow diagram
- **Components:** Customer box, BAA box, Endpoint box, Monitor box
- **Arrows:** Flow with checkmarks for compliance steps
- **Accent color:** `#4facfe` for healthcare theme
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
│   Clinical Use Cases                                             │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ 📝           │  │ 💬           │  │ 🏥           │          │
│   │ Clinical     │  │ Patient      │  │ Medical      │          │
│   │ Notes        │  │ Triage       │  │ Coding       │          │
│   │ Summarization│  │ Q&A          │  │ Automation   │          │
│   │              │  │              │  │              │          │
│   │  ↓58% cost   │  │  ↑40% speed  │  │  ↓65% cost   │          │
│   │  ↓45%        │  │  ↑25%        │  │  ↑20%        │          │
│   │  hallucination│ │  accuracy    │  │  accuracy    │          │
│   │  rate        │  │              │  │              │          │
│   │  Fine-tuned  │  │  Small model │  │  Fine-tuned  │          │
│   │  models match│  │  handles     │  │  models for  │          │
│   │  Claude      │  │  60% of      │  │  coding with │          │
│   │  accuracy at │  │  routine     │  │  1/5 the cost│          │
│   │  1/5 the     │  │  queries     │  │              │          │
│   │  cost        │  │              │  │              │          │
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
| Clinical Notes | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` |
| Patient Triage | `linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)` |
| Medical Coding | `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)` |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Card title | H3 | 24px | 600 | `#ffffff` |
| Metric (cost) | Metric | 32px | 700 | `#0A84FF` |
| Metric (speed) | Metric | 20px | 600 | `#43e97b` |
| Metric (accuracy) | Metric | 20px | 600 | `#43e97b` |
| Card body | Body | 15px | 400 | `#b0b0b0` |

**Hover:** `translateY(-4px)`, `border: 1px solid #4facfe`, `box-shadow: 0 8px 24px rgba(79,172,254,0.2)`

**Responsive:**

- **Mobile:** Cards stacked (1 column)
- **Tablet:** 2-column grid (third card spans full-width)
- **Desktop:** 3-column grid, equal width

---

### HIPAA & Security Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   HIPAA & Security                                               │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ 📋           │  │ 🔒           │  │ 🔐           │          │
│   │ BAA          │  │ HIPAA        │  │ SOC 2        │          │
│   │ Available    │  │ Endpoint     │  │ Type II      │          │
│   │              │  │ Configuration│  │ In Progress  │          │
│   │              │  │              │  │              │          │
│   │ Sign a BAA   │  │ Encryption   │  │ Full audit   │          │
│   │ before       │  │ at rest &    │  │ logging with │          │
│   │ production   │  │ in transit   │  │ model        │          │
│   │              │  │              │  │ attribution  │          │
│   │ Typical      │  │              │  │              │          │
│   │ turnaround:  │  │              │  │              │          │
│   │ 2 weeks      │  │              │  │              │          │
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

**Card Styling:**

| Element | Style |
|---------|-------|
| Card background | `#1a1a2e` |
| Card border | `1px solid #2a2a4a` |
| Card border-radius | 12px |
| Card padding | 32px |
| Icon size | 56px × 56px |
| Icon background | Circle, healthcare blue gradient |

**Icon:** All cards use `#4facfe` gradient (healthcare blue)

**Interactive Element:**

- Click each card to expand with more detail (accordion style)
- **BAA expansion:** BAA template preview, what's covered, typical timeline, signature process
- **HIPAA Endpoint expansion:** Encryption details (AES-256 at rest, TLS 1.3 in transit), data flows, BA list
- **SOC 2 expansion:** SOC 2 checklist, expected audit date, what's in scope, audit firm

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
│   │  "We cut inference costs from $48K/month to $20K/month —  │   │
│   │   58% savings while improving summarization accuracy.     │   │
│   │   The BAA process took only 2 weeks."                     │   │
│   │                                                           │   │
│   │  — [Name], CTO                                           │   │
│   │  [HealthTech Co.]                                        │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │   58%        │  │   43%        │  │   45%        │          │
│   │   Cost       │  │   Faster     │  │   Fewer      │          │
│   │   Reduction  │  │   Latency    │  │ Hallucinations│         │
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
| Background | `#163a4a` (teal-tinted, healthcare) |
| Border | `1px solid #2a5a6a` |
| Border-radius | 12px |
| Padding | 32px |
| Quote font | Body, 18px, italic, `#ffffff` |
| Attribution font | Body, 14px, semibold, `#4facfe` |

**Metric Cards:**

| Element | Style |
|---------|-------|
| Card background | `#0f0f1a` |
| Card border | `1px solid #2a2a4a` |
| Metric value font | Display, 48px, 700, `#4facfe` |
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
│   Pricing for Healthcare Teams                                   │
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
│   │              │  │              │  │ ✓ BAA        │          │
│   │ [Start Free  │  │ [Start Free  │  │ ✓ HIPAA      │          │
│   │   Trial]     │  │   Trial]     │  │   endpoint   │          │
│   │              │  │              │  │ ✓ On-prem    │          │
│   │              │  │              │  │ ✓ SLA        │          │
│   │              │  │              │  │ [Contact Sales]│        │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│   Note: All tiers include SOC 2 compliance features. Enterprise│
│   plan includes BAA, HIPAA-compliant endpoint, on-prem deploy. │
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
| Border | `1px solid #2a2a4a` | `1px solid #0A84FF` | `1px solid #4facfe` (healthcare accent) |
| Background | `#1a1a2e` | `#1a1a2e` | `#1a1a2e` |
| Title | 28px, 700, `#ffffff` | 28px, 700, `#ffffff` | 28px, 700, `#ffffff` |
| Price | 36px, 700, `#0A84FF` | 36px, 700, `#0A84FF` | 36px, 700, `#4facfe` |
| Features list | 15px, `#b0b0b0` | 15px, `#b0b0b0` | 15px, `#b0b0b0` |

**Button Styling:**

| Element | Pro | Team | Enterprise |
|---------|-----|------|------------|
| Primary button | `#0A84FF`, white text | `#0A84FF`, white text | `#4facfe`, white text |
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
│   FAQ: Healthcare-Specific Questions                             │
│   ─────────────────────────────────────────                      │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Do you sign BAAs?                [+]                       │ │
│   └────────────────────────────────────────────────────────────┘ │
│   Yes — we sign BAAs for all enterprise customers. Typical     │
│   turnaround is 2 weeks from request to signed agreement. We   │
│   use a standard BAA template aligned with HHS requirements.   │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ How long does the BAA process take?        [+]             │ │
│   └────────────────────────────────────────────────────────────┘ │
│   Typical turnaround is 2 weeks. We have a streamlined process │
│   with legal review done upfront. Enterprise customers get    │
│   priority handling.                                           │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Is Slancha HIPAA-compliant?          [+]                   │ │
│   └────────────────────────────────────────────────────────────┘ │
│   Our infrastructure is HIPAA-ready. Enterprise plan includes  │
│   HIPAA-compliant endpoints with encryption at rest and in    │
│   transit. We're also SOC 2 Type II in progress.               │
│                                                                  │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Preventing hallucinations?             [+]                 │ │
│   └────────────────────────────────────────────────────────────┘ │
│   We use fine-tuned models on your clinical data, eval-based   │
│   quality gates, and logging with model attribution. You can  │
│   set confidence thresholds and route low-confidence responses │
│ │  to human review.                                            │
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
| Hover background | `#163a4a` (teal tint) |

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
│   Start Your Compliant Pilot Today                               │
│                                                                  │
│   Request a BAA and start your 14-day pilot.                    │
│                                                                  │
│   ┌────────────────────┐                                        │
│   │ [Request BAA +    │                                        │
│   │   Pilot]           │                                        │
│   └────────────────────┘                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Styling:**

| Element | Style |
|---------|-------|
| Background | `linear-gradient(180deg, #1a2e3a 0%, #0f1a2e 100%)` (teal-dark gradient) |
| Max-width | 600px, centered |
| Padding | 64px 24px |
| Text-align | center |

**Typography:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Headline | H2 | 36px | 700 | `#ffffff` |
| Subheadline | Body | 16px | 400 | `#b0b0b0` |
| Button | Button | 16px | 600 | `#ffffff` on `#4facfe` |

**Button:**

- Size: 200px × 56px
- Border-radius: 8px
- Background: `#4facfe` (healthcare blue)
- Hover: `scale(1.02)`, `box-shadow: 0 8px 24px rgba(79,172,254,0.4)`

**Responsive:**

- **Mobile:** Button full-width, padding: 48px 20px
- **Desktop:** Button 200px width

---

## Visual Hierarchy

1. **Hero Headline** — Primary attention (H1, 56px, 700)
2. **Primary CTA** — High contrast, healthcare blue accent
3. **Clinical Use Cases** — Second level (H3, icons, metrics)
4. **HIPAA/Security Cards** — Trust signals
5. **Results Metrics** — Social proof (large numbers)
6. **Pricing Cards** — Conversion point
7. **Footer CTA** — Final conversion push

---

## Color Palette

| Element | Healthtech-Specific | Notes |
|---------|--------------------|-------|
| Page background | `#0f0f1a` | Primary dark |
| Section backgrounds | `#1a1a2e` | Cards, boxes |
| Text primary | `#ffffff` | Headlines |
| Text secondary | `#b0b0b0` | Body |
| Accent blue | `#0A84FF` | Primary (consistent) |
| Healthcare blue | `#4facfe` | Healthcare-specific accent |
| Success green | `#43e97b` | Accuracy/speed metrics |
| Warning red | `#f5576c` | Cost metrics |
| Borders | `#2a2a4a` | Card borders |
| Teal tint | `#163a4a` | Testimonial background |

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
| Section | `.vertical-healthtech` | Page wrapper |
| Hero | `.hero` | Hero section |
| Problem cards | `.problem-cards` | 3-column |
| Card | `.card` | Base card |
| Use cases | `.use-cases` | Use case grid |
| HIPAA | `.hipaa-security` | Compliance section |
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

### Compliance Diagram
- Animated flow with checkmarks
- Duration: 2.5s per step
- Sequence: Customer → BAA → Endpoint → Monitor

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

### Accordion (for FAQ and compliance cards)
```jsx
interface AccordionProps {
  question: string;
  children: React.ReactNode;
}

function Accordion({ question, children }: AccordionProps)
```

### ComplianceFlowDiagram (new)
```jsx
function ComplianceFlowDiagram() {
  // Animated flow: Customer → BAA → Endpoint → Monitor
  // Duration: 2.5s per step
  // Use SVG with CSS animations or Framer Motion
}
```

---

## QA Checklist

- [ ] Hero headline and CTA render correctly
- [ ] All 3 problem cards present with icons
- [ ] Compliance flow diagram renders on all devices
- [ ] All 3 clinical use case cards with metrics
- [ ] Metrics animate on scroll
- [ ] Testimonial displays correctly with teal tint
- [ ] All 3 pricing cards with correct features
- [ ] FAQ accordion expands/collapses smoothly
- [ ] Compliance cards expand for details
- [ ] Footer CTA button wired to sign-up
- [ ] Responsive at 375px, 768px, 1024px
- [ ] No console errors
- [ ] Lighthouse performance >90
- [ ] Healthcare blue (`#4facfe`) used consistently

---

## Copy Dependencies

This spec assumes the following copy files will be created:

**Hero:**
- `site/copy/verticals/healthcare-hero-title.md` — "AI Inference, Built for Healthcare"
- `site/copy/verticals/healthcare-hero-subtitle.md` — "Cut API costs by 58%+..."
- `site/copy/verticals/healthcare-cta-primary.md` — "Request BAA + Pilot"
- `site/copy/verticals/healthcare-cta-secondary.md` — "See Compliance Features"

**Problem Section:**
- `site/copy/verticals/healthcare-problem-title.md` — "The Healthtech Inference Problem"
- `site/copy/verticals/healthcare-problem-1-title.md` — "Cost Per Patient"
- `site/copy/verticals/healthcare-problem-1-body.md`
- `site/copy/verticals/healthcare-problem-2-title.md` — "Compliance Complexity"
- `site/copy/verticals/healthcare-problem-2-body.md`
- `site/copy/verticals/healthcare-problem-3-title.md` — "Validation Time"
- `site/copy/verticals/healthcare-problem-3-body.md`

**Solution Section:**
- `site/copy/verticals/healthcare-solution-title.md` — "How Slancha Solves It"
- `site/copy/verticals/healthcare-solution-benefits.md` — 3 benefit items

**Use Cases:**
- `site/copy/verticals/healthcare-usecases-title.md` — "Clinical Use Cases"
- `site/copy/verticals/healthcare-notes-title.md`, `-body.md`, `-metrics.md`
- `site/copy/verticals/healthcare-triage-title.md`, `-body.md`, `-metrics.md`
- `site/copy/verticals/healthcare-coding-title.md`, `-body.md`, `-metrics.md`

**HIPAA & Security:**
- `site/copy/verticals/healthcare-compliance-title.md` — "HIPAA & Security"
- `site/copy/verticals/healthcare-compliance-baa.md`
- `site/copy/verticals/healthcare-compliance-hipaa.md`
- `site/copy/verticals/healthcare-compliance-soc2.md`

**Results:**
- `site/copy/verticals/healthcare-results-title.md` — "Results"
- `site/copy/verticals/healthcare-testimonial-quote.md`
- `site/copy/verticals/healthcare-testimonial-author.md`
- `site/copy/verticals/healthcare-metric-1.md`, `metric-2.md`, `metric-3.md`

**Pricing:**
- `site/copy/verticals/healthcare-pricing-title.md` — "Pricing for Healthcare Teams"
- `site/copy/verticals/healthcare-pricing-pro.md`
- `site/copy/verticals/healthcare-pricing-team.md`
- `site/copy/verticals/healthcare-pricing-enterprise.md`
- `site/copy/verticals/healthcare-pricing-note.md`

**FAQ:**
- `site/copy/verticals/healthcare-faq-title.md` — "FAQ: Healthcare-Specific Questions"
- `site/copy/verticals/healthcare-faq-1.md` through `faq-4.md`

**Footer CTA:**
- `site/copy/verticals/healthcare-cta-title.md` — "Start Your Compliant Pilot Today"
- `site/copy/verticals/healthcare-cta-subtitle.md`
- `site/copy/verticals/healthcare-cta-button.md` — "Request BAA + Pilot"

---

## Next Steps for Frontend

1. Create `VerticalHealthtechPage.jsx` component
2. Create `ComplianceFlowDiagram.jsx` component
3. Implement `MetricCounter` component (reuse from use-cases)
4. Implement `Accordion` component for FAQ and compliance cards
5. Wire copy from copy files
6. Apply scroll reveal animations
7. Test responsive breakpoints
8. QA animations and hover states
9. Integrate with global nav and footer
10. Set up routing: `/healthcare` or `/healthtech`

---

## Notes for Design/Frontend Collaboration

- **Consistency:** This page uses the same design system as the rest of the site (colors, typography, components)
- **Healthcare Differentiation:** The healthtech page is distinguished by healthcare blue accent (`#4facfe`), clinical use cases, and compliance messaging
- **Component Reuse:** Most components (cards, buttons, accordions) are shared with other pages
- **Animation Budget:** Keep animations professional — healthcare buyers expect trust, not flash
- **Performance:** Compliance diagram should be SVG with CSS animations (no heavy JS libraries)
- **Accessibility:** Ensure all healthcare content is WCAG AA compliant (high contrast, readable fonts)

---

## Related Specs

- `site/design/homepage.md` — Global design system reference
- `site/design/nav.md` — Navigation component
- `site/design/offerings.md` — Pricing tier cards
- `site/design/faq.md` — FAQ accordion pattern
- `site/design/use-cases.md` — Use case cards pattern
- `site/design/vertical-fintech.md` — Similar vertical page (compliance-focused)

# Use Cases Page Design Spec

## Purpose
Showcase the different industry verticals and use cases where Slancha delivers value. This page demonstrates real-world applications and quantifiable results.

## Layout Overview
- Full-width page with centered content column
- Maximum content width: 1200px
- Dark tech aesthetic matching site design system
- Animated metric counters for visual engagement
- Segmented by industry/use case with icon treatments
- Testimonial slots embedded within sections

---

## Component Structure

### Page Header
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   Built for Every AI Team                                │
│                                                          │
│   From startups to Fortune 500, see how teams use        │
│   Slancha to ship faster and spend less.                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Title:** "Built for Every AI Team"
- Font: H1, 48px, bold
- Color: `#ffffff`
- Text-align: center
- Margin bottom: 16px

**Subtitle:** "From startups to Fortune 500, see how teams use Slancha to ship faster and spend less."
- Font: Body, 18px, regular
- Color: `#b0b0b0`
- Text-align: center
- Margin bottom: 64px

---

### Segment/Use Case Sections (4 segments)

Each segment follows a consistent pattern with icons, metrics, and testimonials.

#### Layout Pattern
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   [SEGMENT ICON]                                         │
│   Generative AI for Customer Support                     │
│   ─────────────────────────────────────────────          │
│                                                          │
│   ┌──────────────┐   ┌──────────────┐   ┌─────────────┐ │
│   │   ↓ 70%      │   │   $49k/yr    │   │    2hrs     │ │
│   │  Ticket Vol  │   │    Saved     │   │  Setup Time │ │
│   │              │   │              │   │             │ │
│   └──────────────┘   └──────────────┘   └─────────────┘ │
│                                                          │
│   "We reduced support costs by 70% while improving        │
│    CSAT from 3.2 to 4.6. Slancha's eval data showed us   │
│    exactly which questions needed better responses."     │
│   ─────────────────────────────────────────────────────  │
│   Jane Chen, Head of AI @ FinTech Startup                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Section Anatomy

**1. Segment Icon**
- Size: 64px × 64px
- Treatment: Circle background with gradient accent
- Background colors per segment:
  - Customer Support: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
  - E-commerce: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
  - Healthcare: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
  - Education: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`
- Icon inside: White emoji or SVG (🎧, 🛒, 🏥, 🎓)
- Margin bottom: 24px

**2. Segment Title**
- Font: H2, 32px, semibold
- Color: `#ffffff`
- Margin bottom: 8px

**3. Segment Description**
- Font: Body, 16px, regular
- Color: `#cccccc`
- Max-width: 600px
- Margin bottom: 32px

**4. Metrics Grid**
- Layout: 3-column grid on desktop, stacked on mobile
- Each metric card:
  - Background: `#1a1a2e`
  - Border: `1px solid #2a2a4a`
  - Border-radius: 12px
  - Padding: 24px
  - Text-align: center
  - Hover effect: `translateY(-4px)` with `box-shadow` increase

**Metric Card Components:**

```
┌─────────────────┐
│      ↓ 70%      │  ← Large metric (32px, bold, accent color)
│                 │
│  Ticket Volume  │  ← Label (13px, semibold, #a0a0b0)
│   Reduction     │  ← Sublabel (13px, regular, #808090)
└─────────────────┘
```

**Metric Animation:**
- Number counts up from 0 on scroll
- Duration: 2 seconds
- Easing: `ease-out`
- Trigger: IntersectionObserver when 25% visible

**5. Testimonial Slot**
- Background: `#162a3a` (blue-tinted callout)
- Border: `1px solid #2a4a6a`
- Border-radius: 12px
- Padding: 28px
- Quote style: italic, large (18px)
- Attribution line: smaller (14px), semibold, accent color

```
┌─────────────────────────────────────────────────────────┐
│  "We reduced support costs by 70% while improving       │
│   CSAT from 3.2 to 4.6. Slancha's eval data showed us   │
│   exactly which questions needed better responses."     │
│                                                          │
│   Jane Chen • Head of AI • FinTech Startup              │
│   ████████████████  ★★★★☆                               │
└─────────────────────────────────────────────────────────┘
```

---

## Four Segment Details

### 1. Customer Support (🎧)
**Description:** Build AI agents that handle 70%+ of support tickets with human-level quality. Use eval data to continuously improve response accuracy.

**Metrics:**
- ↓ 70% Ticket Volume Reduction
- $49k/year Average Savings
- 2-hour Setup Time

**Sample Testimonial:**
> "We reduced support costs by 70% while improving CSAT from 3.2 to 4.6. Slancha's eval data showed us exactly which questions needed better responses."
> — Jane Chen, Head of AI @ FinTech Startup

---

### 2. E-commerce Personalization (🛒)
**Description:** Deploy recommendation engines that convert. Fine-tune on your actual product catalog and customer behavior data for 10x better accuracy.

**Metrics:**
- ↑ 340% Recommendation CTR
- $120k/year Additional Revenue
- 1-day Model Training

**Sample Testimonial:**
> "Our recommendation CTR jumped 340% after fine-tuning on our actual product data. The auto-post-training keeps it fresh as our catalog grows."
> — Marcus Torres, Head of Growth @ Fashion Retailer

---

### 3. Healthcare Triage (🏥)
**Description:** Deploy HIPAA-compliant AI triage systems with data isolation. Built-in audit logging and SOC 2 readiness for enterprise healthcare.

**Metrics:**
- 95% Triage Accuracy
- SOC 2 Type II Ready
- HIPAA-Compliant Deployment

**Sample Testimonial:**
> "Healthcare requires precision and compliance. Slancha's self-hosted option with full audit trails gave us the confidence to deploy patient-facing AI."
> — Dr. Sarah Kim, CTO @ HealthTech Platform

---

### 4. Education Content (🎓)
**Description:** Automate content creation and tutoring at scale. Fine-tune on your curriculum data for consistent, on-brand educational AI.

**Metrics:**
- 60% Content Creation Time
- 4.8 Student Satisfaction
- 50+ Institutions

**Sample Testimonial:**
> "We went from 6 months to 2 weeks on our AI tutoring product. The eval-driven fine-tuning ensured it matched our pedagogical approach perfectly."
> — Alex Rivera, Founder @ EdTech Startup

---

## Comparison Section (Below Segments)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   How We Stack Up                                        │
│                                                          │
│   Most platforms focus on one use case. Slancha adapts   │
│   to your workload automatically.                        │
│                                                          │
│   ┌────────────────────────────────────────────────────┐ │
│   │  Generic AI Platform    │  Slancha                 │ │
│   │  ───────────────────    │  ─────────              │ │
│   │  Fixed model, no        │  Auto-fine-tuned on      │ │
│   │  adaptation             │  your data               │ │
│   │                          │                          │ │
│   │  Manual evaluation      │  Continuous eval data    │ │
│   │  required               │  collection & analysis   │ │
│   │                          │                          │ │
│   │  $2k-10k/month minimum  │  $499-$2,499/month       │ │
│   │  for meaningful use     │  (scales with usage)     │ │
│   └────────────────────────────────────────────────────┘ │
│                                                          │
│   Result: Slancha customers achieve 5x better results    │
│   at 1/3 the cost of building in-house.                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Comparison Box Styling:**
- Background: `#1a1a2e`
- Border-radius: 16px
- Padding: 32px
- Border: `1px solid #2a2a4a`
- Two-column grid layout
- Right column (Slancha) has accent border on left: `4px solid #0A84FF`

---

## Footer CTA

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   Ready to Ship Your AI Product?                         │
│                                                          │
│   Get evaluated by our team and start your pilot in      │
│   48 hours. No commitment required.                      │
│                                                          │
│   [Start Your Pilot]                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Dark gradient `linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)`
- Border-radius: 16px
- Padding: 48px 32px
- Text-align: center
- Button: Accent background, 200px width, full-width on mobile

---

## Visual Hierarchy

1. **Page title** - Primary (H1, 48px)
2. **Segment titles** - Secondary (H2, 32px)
3. **Metric numbers** - High contrast, accent colors
4. **Testimonial quotes** - Large italic, callout background
5. **Comparison section** - Side-by-side treatment
6. **CTA button** - Prominent, accent color

---

## Color Palette

| Element              | Color              | Notes                     |
|---------------------|--------------------|--------------------------|
| Page background     | `#0f0f1a`          | Primary                 |
| Section backgrounds | `#1a1a2e`          | Cards, boxes            |
| Text primary        | `#ffffff`          | Headlines               |
| Text secondary      | `#cccccc`          | Body text               |
| Text muted          | `#b0b0b0`          | Subtitles               |
| Accent blue         | `#0A84FF`          | Primary accent          |
| Segment gradients   | See above          | Per segment             |
| Borders             | `#2a2a4a`          | Card borders            |
| Testimonial bg      | `#162a3a`          | Blue-tinted callout     |

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
- Segment cards: `translateY(-4px)` on hover
- Metric cards: `translateY(-4px)` + shadow increase
- Button: Scale 1.02, shadow increase

---

## Responsive Design

### Desktop (≥900px)
- Max-width: 1200px, centered
- 3-column metric grids
- Comfortable spacing (64-96px section margins)

### Tablet (600-899px)
- 2-column metric grids
- Reduced spacing (48px section margins)
- Adjusted font sizes (H1: 40px, H2: 28px)

### Mobile (≤599px)
- Stacked layouts (1 column)
- Metric cards full-width
- Icon size: 48px
- Font sizes: H1: 32px, H2: 24px, H3: 20px
- Section margins: 32px
- Button: Full-width

---

## CSS Class Reference

| Element               | Class Name            | Notes                        |
|----------------------|-----------------------|-----------------------------|
| Section wrapper      | `.use-cases`          | Full section                |
| Segment card         | `.use-case-card`      | Per-segment container       |
| Segment icon         | `.use-case-icon`      | Circle gradient background  |
| Metric card          | `.metric-card`        | Individual metric           |
| Metric value         | `.metric-value`       | Animated number             |
| Metric label         | `.metric-label`       | Small description           |
| Testimonial          | `.testimonial-slot`   | Quote box                   |
| Comparison box       | `.comparison-box`     | Side-by-side comparison     |
| CTA section          | `.use-case-cta`       | Footer callout              |

---

## JavaScript Components

### MetricCounter Hook
```jsx
interface MetricCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // ms
}

function MetricCounter({ value, suffix, prefix, duration = 2000 }: MetricCounterProps)
```

### UseScrollReveal Hook (already exists)
- Triggers on 15% viewport intersection
- Fade-in + slide-up animation

---

## QA Checklist

- [ ] All 4 segments present with correct icons
- [ ] All 12 metric cards (3 per segment)
- [ ] Metric counters animate on scroll
- [ ] All testimonials display correctly
- [ ] Comparison section styled properly
- [ ] CTA button wired to contact form
- [ ] Segment gradients render correctly
- [ ] Hover effects smooth (no jank)
- [ ] Mobile responsive at 375px, 768px
- [ ] No console errors
- [ ] Lighthouse performance >90

---

## Copy Dependencies

This spec assumes the following copy files will be created:
- `site/copy/use-cases-header.md` — Page title and subtitle
- `site/copy/use-cases/customer-support.md` — Segment 1 content
- `site/copy/use-cases/ecommerce.md` — Segment 2 content
- `site/copy/use-cases/healthcare.md` — Segment 3 content
- `site/copy/use-cases/education.md` — Segment 4 content
- `site/copy/use-cases/comparison.md` — Comparison section
- `site/copy/use-cases/cta.md` — Footer CTA

---

## Next Steps for Frontend

1. Create `UseCasesPage.jsx` component
2. Implement `MetricCounter` component
3. Wire segment data from copy files
4. Apply scroll reveal animations
5. Test responsive breakpoints
6. QA metric animations and hover states

# Case Study Templates — Visual Design Specification

**Task:** TASK-159  
**Owner:** designer  
**Created:** 2026-03-31  
**Status:** IN PROGRESS

---

## Overview

Design 3 vertical-specific case study template pages (Fintech, Healthtech, E-commerce) that sales can customize for prospects. Each template shares the same structure but with different visual treatments to match vertical aesthetics.

**Purpose:** Sales enablement — customizable proof points for customer conversations  
**Format:** 3 template pages (one per vertical) + shared component library  
**Deliverable:** Complete visual specs with layout, typography, color treatments, and component behavior

---

## Shared Structure (All 3 Templates)

Each case study template follows this section structure:

```
1. Hero Section
   - Headline (3 variant options)
   - Company description
   - Key metrics banner

2. The Challenge
   - Problem statement
   - Previous setup details
   - Pain points (icon list)
   - "The stakes" callout

3. The Slancha Solution
   - Implementation timeline (timeline component)
   - Phase breakdown (Week 1, Week 2, etc.)
   - Key technical decisions (card grid)

4. The Results
   - Results metrics table
   - Savings breakdown (chart/bar visualization)
   - Specific use case results

5. Executive Quotes
   - CTO quote
   - ML Engineer/CMO quote
   - CFO quote (for e-commerce)

6. Compliance Section
   - Compliance requirements
   - How Slancha addresses it
   - Badges/trust signals

7. Next Steps
   - Timeline/roadmap visualization
   - Future evaluation areas

8. Call-to-Action Footer
   - "Want similar results?" CTA
   - Contact form embed
   - Related resources
```

---

## Color Treatments by Vertical

### Fintech
**Theme:** Trust, security, stability  
**Primary:** Deep navy blue (`#0a192f`)  
**Secondary:** Electric blue accent (`#64ffda`)  
**Accent:** Gold/yellow for success metrics (`#ffd700`)  
**Background:** Subtle grid pattern (like financial charts)  
**Tone:** Professional, data-driven, conservative

### Healthtech
**Theme:** Care, compliance, accuracy  
**Primary:** Teal/green (`#0d4a3c`)  
**Secondary:** Soft mint accent (`#a7f3d0`)  
**Accent:** Medical blue (`#3b82f6`)  
**Background:** Clean white with soft curves  
**Tone:** Reassuring, clean, clinical but warm

### E-commerce
**Theme:** Scale, speed, growth  
**Primary:** Deep purple (`#7c3aed`)  
**Secondary:** Vibrant pink/magenta accent (`#ec4899`)  
**Accent:** Orange for growth indicators (`#f97316`)  
**Background:** Dynamic gradient with motion blur effects  
**Tone:** Energetic, modern, growth-focused

---

## Component Specifications

### 1. Hero Section

**Layout:** Full-width section, 80px top/bottom padding  
**Background:** Vertical-specific gradient

```
┌─────────────────────────────────────────────────────────┐
│  [Logo left]                                        [CTA]│
│                                                          │
│  Headline (32-40px, bold)                                │
│  "How [Co.] Cut API Costs by 67% Without Sacrificing   │
│   Accuracy"                                               │
│                                                          │
│  Company description (18px, muted)                       │
│  "[Co.] is a neobank serving 5M users..."                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  $42K→$13.7K    53% FASTER    90% LESS EFFORT      │ │
│  │  Cost savings     latency       engineering       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [3 headline variant dropdown]                          │
└─────────────────────────────────────────────────────────┘
```

**Metric cards:**
- 3-column grid
- Each card: large number (48px bold), label (14px muted)
- Background: glassmorphism card with border
- Hover: slight lift + glow effect

---

### 2. The Challenge Section

**Layout:** Two-column split (45%/55%)

```
┌─────────────────────┬──────────────────────────────────┐
│                     │  The Challenge                   │
│  [Image placeholder]│  [Section title]                 │
│  (Company HQ or     │                                   │
│   product screenshot)│  [Paragraph - problem statement]│
│                     │                                   │
│                     │  Previous setup:                 │
│                     │  • OpenAI/Anthropic/multi-provider│
│                     │  • $42K/month                    │
│                     │  • [X]M daily requests          │
│                     │                                   │
│                     │  Pain points:                    │
│                     │  📈 Costs rising faster than usage│
│                     │  🚨 Provider price increases     │
│                     │  ⚙️  Weeks on benchmarking       │
│                     │  🎯 No optimization without manual│
│                     │                                   │
│                     │  ┌─────────────────────────┐     │
│                     │  │  THE STAKES              │     │
│                     │  │  AI infrastructure was   │     │
│                     │  │  their 2nd-largest       │     │
│                     │  │  engineering expense.    │     │
│                     │  │  They needed a solution  │     │
│                     │  │  without hiring an ML    │     │
│                     │  │  team.                   │     │
│                     │  └─────────────────────────┘     │
└─────────────────────┴──────────────────────────────────┘
```

**Pain points list:**
- 4 items max
- Icon + short text (24px)
- Left margin: 12px
- Icon color: vertical-specific accent

**"The Stakes" callout:**
- Border-left: 4px vertical accent color
- Background: 5% opacity of accent
- Padding: 16px
- Font: 16px

---

### 3. Implementation Timeline

**Layout:** Horizontal step timeline (Fintech: 2 weeks, Healthtech: 3 weeks, E-commerce: 7 days)

```
┌────────────────────────────────────────────────────────────────┐
│                     The Slancha Solution                       │
│                     Implementation timeline: X weeks            │
│                                                                │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐          │
│  │ Week 1  │  Week 2 │ Week 3  │   Day 1 │   Day 2 │          │
│  │  ●──────│────●────│────●────│──●──────│──●──────│          │
│  │         │         │         │         │         │          │
│  │ Migrate │ Slancha │ Sign    │ Single  │ Router  │          │
│  │ endpoint│ began   │ BAAs    │ endpoint│ began   │          │
│  │ to      │ classifying│configured│ migration│ classifying│
│  │ Slancha │ requests│          │         │ patterns│          │
│  │         │         │          │         │         │          │
│  │ Router  │ Task-   │ Migrated│ Observed│ Observed│          │
│  │ started │ specific│ patient  │ workload│ traffic │          │
│  │         │ models  │ note     │ distro│ patterns│          │
│  │         │ deployed│ workload │         │         │          │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘          │
│                                                                │
│  Key technical decisions:                                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ • One API       │ │ • Started with  │ │ • Slancha scales│ │
│  │   endpoint      │ │   low-risk work-│ │   automatically │ │
│  │   replaces 3-4  │ │   load first    │ │   — no capacity │ │
│  │   different     │ │   and expanded  │ │   planning req'd│ │
│  │   endpoints     │ │   from there    │ │                 │ │
│  │                 │ │                 │ │                 │ │
│  │ • No model      │ │ • Maintained    │ │ • Router        │ │
│  │   selection     │ │   human-in-     │ │   automatically │ │
│  │   required      │ │   loop for high-│ │   handles traffic││
│  │                 │ │   stakes        │ │   distribution  │ │
│  │ • No eval       │ │ • Used Slancha  │ │                 │ │
│  │   framework     │ │   logging for   │ │                 │ │
│  │   setup         │ │   audit trail   │ │                 │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Timeline component:**
- Connected circles (●────●)
- Circle: 24px diameter, filled with accent color
- Label above circle (14px)
- Description below (12px muted)
- Mobile: stack vertically with vertical line

**Technical decisions cards:**
- 3-column grid
- Card: white background, 1px border, 12px padding
- Bullet list inside (14px)

---

### 4. Results Section

**Layout:** Two-column (table + breakdown)

```
┌─────────────────────────────────┬─────────────────────────────┐
│    The Results                  │    The breakdown            │
│    3 months post-migration      │                             │
│                                 │    ┌───────────────────┐   │
│  ┌───────────────────────────┐  │    │  45% ROUTING      │   │
│  │ Metric      │ Before  │After│  │    │  Simple queries   │   │
│  ├─────────────┼─────────┼─────┤  │    │   to small models │   │
│  │ Cost        │ $42K    │ $13 │  │    │                   │   │
│  │ Latency     │ 890ms   │ 420 │  │    │  18% FINE-TUNING  │   │
│  │ Engineer time│ 20 hrs  │ 2 hrs│ │    │   Support-specific│   │
│  │ Accuracy    │ 94.2%   │95.8% │  │    │   for common qs   │   │
│  └───────────────────────────┘  │    │                   │   │
│                                 │    │  5% OPTIMIZATION  │   │
│    Results table                │    │   Quantization &   │   │
│    styles:                      │    │    multi-token     │   │
│    - Border: 1px solid gray     │    └───────────────────┘   │
│    - Header: bold, dark         │                             │
│    - Highlight diff in green    │    [Vertical-specific bar  │
│    - Zebra striping             │     chart visualizing the  │
│                                 │      savings breakdown]    │
└─────────────────────────────────┴─────────────────────────────┘
```

**Results table:**
- 3-column layout (Metric, Before, After)
- Optional 4th column: "Improvement" with ▲ symbol
- Alternating row background (5% opacity)
- Highlight improvement values in vertical accent color
- Font: 14px, bold headers

**Savings breakdown:**
- Horizontal bars (70% width of container)
- Each bar: label + percentage width
- Color: vertical accent color with 20% opacity fill
- Label on left, percentage on right
- Tooltip on hover showing details

---

### 5. Executive Quotes

**Layout:** Stacked quote cards (or grid on desktop)

```
┌──────────────────────────────────────────────────────────┐
│              What Their CTO Said                         │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ "We were spending more on API calls than on our    ││
│  │  core infrastructure. Slancha didn't just cut our   ││
│  │  costs — it improved performance. Our fraud         ││
│  │  detection accuracy went up, not down. And most     ││
│  │  importantly, our engineering team can finally      ││
│  │  focus on product features instead of model         ││
│  │  benchmarking."                                     ││
│  │                                                     ││
│  │  — [Name], CTO, [Company]                          ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ "The first time I realized this was real was when  ││
│  │  I checked the bill. I was skeptical — how can you  ││
│  │  save 67% without losing quality? But the eval data ││
│  │  doesn't lie. Slancha's fine-tuned models matched   ││
│  │  our GPT-4 results on every test case we ran."      ││
│  │                                                     ││
│  │  — [Name], Head of ML, [Company]                   ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ "I was skeptical that you could get 68% savings     ││
│  │  without losing quality. But the invoice doesn't    ││
│  │  lie. And now I know that Black Friday won't        ││
│  │  bankrupt us. That alone is worth the migration."   ││
│  │                                                     ││
│  │  — [Name], CFO, [E-commerce Co]                    ││
│  └─────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Quote card styles:**
- Border-radius: 12px
- Border: 1px solid (#e5e7eb)
- Background: white
- Padding: 24px
- Icon quote marks: large, 48px, 5% opacity accent color
- Text: 16px, line-height: 1.6
- Attribution: 14px, italic, muted, right-aligned

---

### 6. Compliance Section

**Layout:** Two-column (requirements vs. how we address)

```
┌───────────────────────────┬───────────────────────────────────┐
│  Compliance Requirements  │  How Slancha Addresses This       │
│                           │                                   │
│  🔒 Data residency        │  ✓ Data never leaves our VPC     │
│  📋 SOC 2 compliance      │  ✓ SOC 2 Type II in progress     │
│  📊 Audit trails          │  ✓ Full API request logging      │
│                           │  ✓ Model attribution             │
│                           │                                   │
│  ┌─────────────────────┐ │  ✓ Enterprise plan includes       │
│  │  CERTIFIED          │ │    data isolation guarantees     │
│  │  SOC 2 READY        │ │                                  │
│  │  HIPAA COMPLIANT    │ │  ┌────────────────────────────┐  │
│  │  GDPR COMPLIANT     │ │  │  COMPLIANCE BADGES        │  │
│  │  (badges row)       │ │  │  [SOC 2] [HIPAA] [GDPR]   │  │
│  └─────────────────────┘ │  └────────────────────────────┘  │
└───────────────────────────┴───────────────────────────────────┘
```

**Compliance requirements list:**
- Icon + text (16px)
- 4-5 items max
- Icon color: gray (#6b7280)

**Compliance badges:**
- Row of 3 badges
- Each badge: 24px icon + label
- Border: 1px solid accent
- Background: 10% opacity of accent
- Hover: 20% opacity, slight lift

---

### 7. Next Steps Timeline

**Layout:** Vertical timeline with checkmark items

```
┌──────────────────────────────────────────────────────────┐
│              Next Steps for [Company]                    │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │  Q2 2026                                            ││
│  │  ─────────────────────────────────────────────────  ││
│  │  ⬜ Evaluate migrating fraud detection to          ││
│  │     Slancha's fine-tuned models                     │
│  │                                                     ││
│  │     Currently using GPT-4-turbo                     │
│  │     → Fine-tuned model matching                   │
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │  Q3 2026                                            ││
│  │  ─────────────────────────────────────────────────  ││
│  │  ⬜ Evaluate Slancha for KYC document verification  ││
│  │                                                     ││
│  │     High volume, low-latency requirements           │
│  │     → Deploy quantized models                       │
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │  Ongoing                                            ││
│  │  ─────────────────────────────────────────────────  ││
│  │  ✅ Monitor compounding savings                     ││
│  │     as fine-tuned models improve                    ││
│  └─────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Timeline items:**
- Border: 1px solid #e5e7eb
- Border-radius: 8px
- Padding: 16px
- Checkbox: left-aligned, accent color when checked
- Period label (Q2 2026): bold, 14px, muted
- Details: 14px, italic, muted

---

### 8. CTA Footer

**Layout:** Full-width CTA section

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│           Want similar results?                          │
│                                                          │
│        Get your customized cost savings estimate        │
│                                                          │
│        ┌───────────────────────────────────────┐       │
│        │  $42K/month → $14K/month              │       │
│        │  Your estimate                        │       │
│        └───────────────────────────────────────┘       │
│                                                          │
│            [Request Custom Quote]                       │
│                                                          │
│        Already a customer? [View Case Studies]          │
│                                                          │
│        Related resources:                               │
│        • [ROI Calculator] • [Competitive Analysis]      │
│        • [Pricing] • [Contact Sales]                    │
└──────────────────────────────────────────────────────────┘
```

**CTA styles:**
- Background: vertical-specific gradient
- Text: white
- Button: solid accent color, 16px padding
- Secondary links: underlined, white 80% opacity

---

## Typography

**Font family:** Inter (consistent with site)  
**Heading scale:**
- H1: 40px, bold (hero)
- H2: 32px, bold (section titles)
- H3: 24px, semibold (subsections)

**Body text:**
- Standard: 16px, regular
- Muted: 16px, medium, 60% opacity
- Small: 14px
- Tiny: 12px

**Line heights:**
- Headings: 1.2
- Body: 1.6
- Tight: 1.3

---

## Spacing System

- XS: 8px
- SM: 12px
- MD: 16px
- LG: 24px
- XL: 32px
- XXL: 48px
- XXXL: 64px
- XXXXL: 80px (hero padding)

---

## Responsive Breakpoints

**Mobile (< 768px):**
- Stack all two-column layouts
- Reduce padding: 40px → 24px
- Metrics row: stack vertically
- Quote cards: full width
- Timeline: vertical with left border

**Tablet (768px - 1024px):**
- Two-column where logical
- Increase padding: 40px → 48px

**Desktop (> 1024px):**
- Full layouts as specified
- Max-width: 1200px container

---

## Interactive States

**Hover effects:**
- Buttons: lift + shadow
- Cards: lift 2px + shadow
- Links: underline + color change
- Metric cards: glow effect

**Focus states:**
- All interactive elements: 2px outline (accent color, 50% opacity)

**Active states:**
- Buttons: slight press (translateY 2px)

---

## Component Library (Reusable)

Create these reusable components for the design system:

1. **MetricCard** - 3-column grid, glassmorphism
2. **PainPoint** - Icon + text list item
3. **CalloutBox** - Border-left accent, background tint
4. **TimelineHorizontal** - Connected steps
5. **TimelineVertical** - Steps with descriptions
6. **ResultTable** - Before/after comparison
7. **SavingsChart** - Horizontal bar visualization
8. **QuoteCard** - Attribution styling
9. **ComplianceBadge** - SOC 2/HIPAA/GDPR
10. **NextStepItem** - Checkbox timeline

---

## Deliverables Checklist

- [ ] `site/design/case-study-templates.md` — This spec
- [ ] Component library markdown (if not in design system)
- [ ] Figma wireframes (if available)
- [ ] Mobile responsive mockups
- [ ] Vertical-specific color treatments documented
- [ ] Accessibility: WCAG 2.1 AA compliant

---

## Notes for Frontend

- Use existing site design tokens (`--bg`, `--accent`, etc.)
- Leverage existing component library (Cards, Accordions, Buttons)
- Vertical-specific themes can be CSS variables or props
- Ensure all interactive elements are keyboard accessible
- Test with screen readers for quote cards and tables
- Timeline components should be accessible (proper ARIA)

---

**QA Checklist for Implementation:**
- [ ] All 3 vertical templates render correctly
- [ ] Color treatments apply per vertical
- [ ] Responsive behavior matches breakpoints
- [ ] No console errors
- [ ] All text is customizable (no hard-coded values)
- [ ] Accessibility audit passed
- [ ] Performance: < 2s load time

---

*This spec provides complete visual guidance for Frontend to build the case study template pages. Any questions should be raised before implementation begins.*

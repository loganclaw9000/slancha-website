# Design Spec — Features Section

## Overview
A feature-card grid section showcasing the five core capabilities of the Slancha platform. Dark-mode, card-based layout with scroll-reveal on entry and hover lift effect.

---

## Layout

- **Section**: full-width, `background: var(--color-bg)` (#121212), vertical padding via `.section-padded` utility
- **Section title**: centered H2, `var(--color-text)`, 36px / weight 600
- **Grid**: 3-column at ≥900px, 2-column at 600–900px, 1-column at <600px
- **Gap**: 1.5rem between cards
- **Top margin**: 3rem between title and grid

---

## Feature Card

| Property       | Value                                              |
|----------------|----------------------------------------------------|
| Background     | `var(--color-surface)` (#1F1F1F)                  |
| Border         | `1px solid var(--color-border)` (#262626)          |
| Border radius  | `var(--radius-md)` (8px)                           |
| Padding        | 2rem top/bottom × 1.5rem left/right                |
| Hover effect   | border-color → `var(--color-accent)` (#0A84FF), translateY(-2px), transition 0.2s ease |

### Card anatomy (top to bottom)

1. **Icon** — emoji, 1.75rem font-size, margin-bottom 1rem
2. **Title** — H3, 1rem / weight 600, `var(--color-text)`, margin-bottom 0.5rem
3. **Body** — p, 0.9rem / line-height 1.65, `var(--color-text-muted)` (#A0AEC0)

---

## Five Feature Cards

| Icon | Title                          | Copy                                                                                         |
|------|-------------------------------|----------------------------------------------------------------------------------------------|
| ⚡   | Latency-First Optimization    | We start with your service-level agreement and automatically pick the right hardware, software, and scaling strategy to meet it. |
| 🔧   | Hardware Agnostic Deployments | Deploy across Amazon Inferentia, NVIDIA L40S, or custom B200 accelerators without rewriting code. |
| 🤖   | Autonomous SRE Agent          | Our AI-driven SRE agent runs the entire inference stack for you – provisioning, monitoring, scaling, and cost optimization. |
| 📊   | Cost Transparency & Control   | Real-time dashboards show performance vs. spend, letting you adjust targets on the fly. |
| 🔗   | Seamless Integration          | Plug into your existing CI/CD pipelines; we handle the heavy lifting while you keep ownership of model development. |

---

## Scroll Reveal

- Section uses `.reveal` class + `useScrollReveal` hook (IntersectionObserver)
- Enters from opacity 0, translateY 20px → opacity 1, translateY 0 over 0.6s ease
- Trigger: 10% of section visible in viewport

---

## Responsive Breakpoints

| Viewport  | Columns |
|-----------|---------|
| ≥900px    | 3       |
| 600–899px | 2       |
| <600px    | 1       |

---

## CSS Class Reference

- `.features` — section wrapper
- `.features-grid` — CSS grid container
- `.feature-card` — individual card
- `.feature-icon` — emoji display
- `.feature-title` — card heading
- `.feature-body` — card description

All tokens reference `design/system.md` CSS variables.

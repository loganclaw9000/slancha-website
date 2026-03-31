# FAQ Page Design Spec

## Purpose
Provide comprehensive answers to common questions about Slancha's platform, pricing, and capabilities.

## Layout Overview
- Full-width page with centered content column
- Maximum content width: 800px
- Sectioned by category with clear visual hierarchy
- Accordion component for each question

---

## Component Structure

### Page Header
```
┌─────────────────────────────────────────────┐
│                                             │
│   Frequently Asked Questions                │
│                                             │
│   Can't find what you're looking for?       │
│   Contact our team                          │
│                                             │
└─────────────────────────────────────────────┘
```

**Title:** "Frequently Asked Questions"
- Font: H1, 48px, bold
- Color: `#ffffff`
- Text-align: center
- Margin bottom: 16px

**Subtitle:** "Can't find what you're looking for? Contact our team"
- Font: Body, 18px, regular
- Color: `#b0b0b0` (or `--text-muted`)
- Text-align: center
- Margin bottom: 48px
- Link: "Contact our team" → `/contact`

---

### Category Sections

Each category has:
- Category title (H2)
- Multiple accordion items (Q&A pairs)
- Visual separator between categories

#### Category Title
```
┌─────────────────────────────────────────────┐
│                                             │
│   General                                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Styling:**
- Font: H2, 28px, semibold
- Color: `#e0e0e0`
- Border-bottom: 1px solid `#333333`
- Padding: 24px 0 16px 0
- Margin bottom: 24px

---

### Accordion Component

#### Closed State
```
┌──────────────────────────────────────────────────────────┐
│  Q: We already use Databricks. Do we need Slancha?       │
│                                     ▼ Expand              │
└──────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: `#1a1a2e` (slightly lighter than page background `#0f0f1a`)
- Border: 1px solid `#333344`
- Border-radius: 8px
- Padding: 20px 24px
- Margin bottom: 12px
- Hover state: Border color `#444455`

**Text (Q):**
- Font: Body semibold, 16px
- Color: `#ffffff`
- Max-width: 90% (leave room for arrow)
- Margin right: 40px (arrow space)

**Arrow Icon:**
- Right-aligned, 24x24px
- Color: `#888888`
- Rotates 180° when open
- SVG chevron down

#### Open State
```
┌──────────────────────────────────────────────────────────┐
│  Q: We already use Databricks. Do we need Slancha?       │
│                                     ▲ Collapse            │
│                                                          │
│  A: Most enterprise customers use both. Databricks       │
│     manages your data infrastructure (ETL, warehouses,   │
│     analytics), while Slancha manages your AI            │
│     engineering workflow (model evaluation, deployment,  │
│     continuous learning). They're complementary —        │
│     Databricks handles data; Slancha handles AI.         │
│                                                          │
│  ---                                                     │
└──────────────────────────────────────────────────────────┘
```

**Answer text:**
- Font: Body, 15px, regular
- Color: `#cccccc`
- Line-height: 1.6
- Margin top: 16px
- Padding top: 16px
- Border-top: 1px dashed `#333344`

**Separator lines (`---`):**
- Displayed as full-width dashed border
- Color: `#333344`
- Margin: 24px 0

---

## Content Structure

### 1. General (5 questions)
1. Databricks comparison
2. Framework support
3. Custom metrics
4. Auto post-training
5. Evaluation latency

### 2. Technical (4 questions)
1. A/B testing
2. Data storage
3. API access

### 3. Pricing (3 questions)
1. Usage-based pricing
2. Upgrade/downgrade
3. Annual discounts

### 4. Security & Compliance (4 questions)
1. SOC 2 compliance
2. Own models
3. Data privacy
4. SSO

### 5. Migration (3 questions)
1. Migration process
2. Self-hosting
3. Support levels

---

## Interaction Details

### Accordion Behavior
- **Single-open or multi-open?** Multi-open allowed (multiple categories can be expanded)
- **Animation:** Smooth height transition, 300ms ease-in-out
- **Default state:** All closed on page load
- **Click target:** Entire accordion item, not just the question text

### Focus States
- Tab navigation supported
- Focus ring: 2px solid `#4a9eff`
- Outline offset: 2px

---

## Responsive Design

### Desktop (>768px)
- Content max-width: 800px
- Full accordion width
- Comfortable spacing

### Mobile (≤768px)
- Content max-width: 100% (with 20px side padding)
- Smaller padding on accordion items (16px 20px)
- Font sizes: H1 32px, H2 24px, Body 15px
- Touch-friendly tap targets (min 44px height)

---

## Accessibility

### Keyboard Navigation
- Tab: Move between accordion items
- Enter/Space: Toggle accordion open/close
- Arrow keys: Navigate between items

### Screen Reader
- Use `<button>` for accordion triggers
- `aria-expanded="true/false"` attribute
- `aria-controls` pointing to answer id
- Semantic HTML: `<details>`/`<summary>` or ARIA accordion pattern

### Color Contrast
- Question text: 16pt regular or 14pt bold → passes AA
- Answer text: 11pt+ → needs 4.5:1 contrast ratio
- `#cccccc` on `#1a1a2e` = 6.2:1 ✓

---

## Visual Hierarchy

1. **Page title** - Highest visual weight
2. **Category headers** - Medium weight, clear dividers
3. **Question text** - Semibold, prominent
4. **Answer text** - Regular weight, secondary
5. **Action links** (Contact, etc.) - Accent color, underlined on hover

---

## Implementation Notes

### Props (for AccordionItem component)
```jsx
interface AccordionItemProps {
  question: string;
  answer: ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  separator?: boolean;
}
```

### CSS Variables to use
- `--bg-card`: `#1a1a2e`
- `--border-color`: `#333344`
- `--text-primary`: `#ffffff`
- `--text-secondary`: `#cccccc`
- `--text-muted`: `#b0b0b0`
- `--accent-color`: `#4a9eff`

### Animation
```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
}

.accordion-content.open {
  max-height: 2000px; /*足够大以容纳内容 */
}
```

---

## QA Checklist

- [ ] All 18 questions from copy render correctly
- [ ] All 5 categories present with correct titles
- [ ] Accordion opens/closes smoothly
- [ ] Keyboard navigation works
- [ ] Screen reader announces state changes
- [ ] Mobile responsive (test at 375px, 768px)
- [ ] Color contrast meets WCAG AA
- [ ] Hover states on interactive elements
- [ ] Separator lines display correctly
- [ ] "Contact our team" link navigates to `/contact`

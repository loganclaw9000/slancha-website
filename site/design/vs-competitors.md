# Vs. Competitors Page Design Spec

## Purpose
Compare Slancha against competitors across multiple categories, demonstrating clear advantages in the AI engineering platform space.

## Layout Overview
- Full-width page with centered content column
- Maximum content width: 1000px (wider for feature table)
- Sectioned by competitor category
- Feature comparison table at bottom
- Strong visual differentiation between Slancha and others

---

## Component Structure

### Page Header
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   How We Compare                                         │
│                                                          │
│   See why AI teams choose Slancha                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Title:** "How We Compare"
- Font: H1, 48px, bold
- Color: `#ffffff`
- Text-align: center
- Margin bottom: 16px

**Subtitle:** "See why AI teams choose Slancha"
- Font: Body, 18px, regular
- Color: `#b0b0b0`
- Text-align: center
- Margin bottom: 64px

---

### Category Sections (6 sections)

Each section follows the same pattern:

#### Section Layout
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   Vs. Databricks & Snowflake                             │
│                                                          │
│   [Databricks/Snowflake Logo/Icon]       [Slancha Logo] │
│                                                          │
│   Databricks manages your data. Slancha manages your AI. │
│   (Key differentiator statement in large type)           │
│                                                          │
│   ────────────────────────────────────────────────────  │
│   Detailed comparison paragraphs (3-4)                   │
│   ────────────────────────────────────────────────────  │
│                                                          │
│   "Most enterprise customers use both: Databricks for   │
│    data, Slancha for AI. They're complementary, not    │
│    competing."                                          │
│   (Callout box / highlight)                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Section Title
```
Vs. Databricks & Snowflake
```

**Styling:**
- Font: H2, 28px, semibold
- Color: `#e0e0e0`
- Border-bottom: 1px solid `#333344`
- Padding: 32px 0 24px 0
- Margin bottom: 24px

#### Key Differentiator Statement
```
Databricks manages your data. Slancha manages your AI.
```

**Styling:**
- Font: H3, 24px, semibold
- Color: `#ffffff`
- Margin bottom: 16px
- Letter-spacing: slight (-0.5px)

#### Detailed Text
```
Databricks and Snowflake are data platforms that handle ETL, 
warehouses, and analytics. They're excellent at managing your 
data infrastructure.

Slancha is the AI engineering platform. We handle model 
evaluation, deployment, and continuous learning. We're built 
for AI teams, not data teams.

Most enterprise customers use both: Databricks for data, 
Slancha for AI. They're complementary, not competing.
```

**Styling:**
- Font: Body, 16px, regular
- Color: `#cccccc`
- Line-height: 1.7
- Margin bottom: 24px
- Paragraphs separated by 16px margin

#### Callout Box
```
┌─────────────────────────────────────────────────────────┐
│  💡 Most enterprise customers use both: Databricks for  │
│     data, Slancha for AI. They're complementary, not    │
│     competing.                                          │
└─────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: `#1a2a3a` (slightly blue-tinted)
- Border: 1px solid `#2a4a6a`
- Border-radius: 8px
- Padding: 20px 24px
- Icon: 💡 (or generic info icon)
- Font: Body, 15px
- Color: `#b8d4e8`

---

## Section Breakdown

### 1. Vs. Databricks & Snowflake (data platforms)
- Key message: Complementary tools
- Visual: Both logos shown side-by-side

### 2. Vs. Cloud Providers (AWS SageMaker, GCP Vertex, Azure ML)
- Key message: Finished product vs. infrastructure
- Highlight: "Build your own loop (6-12 months) vs. use Slancha"

### 3. Vs. Infrastructure Players (CoreWeave, Lambda, Modal)
- Key message: Infrastructure vs. platform
- Visual emphasis: "Works on any cloud"

### 4. Vs. Framework Managers (Anyscale, Hugging Face)
- Key message: Full lifecycle vs. framework-specific
- Highlight: Framework-agnostic approach

### 5. Vs. Building In-House (cost comparison)
- Key message: ROI and time-to-value
- **Special treatment:** Cost breakdown table

---

## Cost Comparison Component (Vs. In-House)

```
┌──────────────────────────────────────────────────────────┐
│                   Build vs. Buy                           │
│                                                          │
│  Build In-House          Slancha                         │
│  ──────────────          ─────────                      │
│  10 engineers            $499-$2,499/month              │
│  × 12 months             (depending on scale)           │
│  = $12M+                 Break-even: 2-3 months         │
│                          ROI: 10x starting month one    │
│                                                          │
│  $12,000,000+            $6,000                          │
│  (first year)            (first year example)           │
└──────────────────────────────────────────────────────────┘
```

**Layout:** Two-column comparison
- Left column: Gray/dimmed styling for "Build" option
- Right column: Brighter styling with checkmark for "Slancha"
- Numbers: Large, bold (32px)
- Labels: Body semibold (16px)
- Divider: 1px solid `#333344` between columns
- Background: `#1a1a2e`
- Border-radius: 12px
- Padding: 32px

---

## Feature Comparison Table

```
┌────────────────────────────────────────────────────────────────┐
│  Feature Comparison                                            │
│                                                                │
│  ┌─────────────────┬─────────┬──────────┬──────────┬───────  │
│  │ Capability      │ Slancha │ Databrix │ AWS Sage │ Build │
│  ├─────────────────┼─────────┼──────────┼──────────┼───────┤
│  │ Automated Eval  │   ✅    │    ❌    │   ⚠️     │  ✅   │
│  │ A/B Testing     │   ✅    │    ❌    │   ⚠️     │  ✅   │
│  │ One-Click Deploy│   ✅    │   ⚠️     │   ⚠️     │  ✅   │
│  │ Data Capture    │   ✅    │    ❌    │    ❌    │  ✅   │
│  │ Auto Post-Train │   ✅    │    ❌    │   ⚠️     │  ✅   │
│  │ Continuous Loop │   ✅    │    ❌    │    ❌    │  ✅   │
│  │ GPU Infra       │   ✅    │   ⚠️     │    ✅    │  ✅   │
│  │ Time to Value   │ Hours   │ Weeks    │ Months   │ 6-12m│
│  └─────────────────┴─────────┴──────────┴──────────┴───────┘
│                                                                │
│  Bottom line: Only Slancha owns the complete automated loop.  │
│  Everything else requires you to build pieces.                 │
└────────────────────────────────────────────────────────────────┘
```

### Table Styling

**Container:**
- Background: `#1a1a2e`
- Border-radius: 12px
- Padding: 24px
- Overflow-x: auto (for mobile)

**Table Structure:**
- Header row: Background `#252540`, text `#ffffff`
- Striped rows: Alternate `#1a1a2e` / `#1f1f35`
- Borders: 1px solid `#333344`
- Cell padding: 16px
- Font: Body, 15px

**Header:**
```
┌─────────────────┬─────────┬──────────┬──────────┬─────────┐
│ Capability      │ Slancha │ Databricks│ AWS Sagemaker│ CoreWeave│
└─────────────────┴─────────┴──────────┴──────────┴─────────┘
```

**Status Icons:**
- ✅ Green check: `#4ade80` (Slancha features)
- ❌ Red X: `#f87171` (Not offered)
- ⚠️ Yellow warning: `#fbbf24` (Partial/manual)
- Text for "Build In-House": `#ffffff` with "Your team" label

**Footer Row:**
```
┌───────────────────────────────────────────────────────────┐
│ Bottom line: Only Slancha owns the complete automated loop.│
└───────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: `#252540`
- Padding: 16px 24px
- Font: Body semibold, 15px
- Color: `#e0e0e0`
- No border on bottom

---

## Visual Hierarchy

1. **Page title** - Primary
2. **Section headers** - Secondary
3. **Key differentiator statements** - Emphasized (large, bold)
4. **Feature table** - Visual scan with icon checkmarks
5. **Cost comparison** - Large numbers for impact
6. **Callout boxes** - Supportive, secondary info

---

## Color Palette

- **Page background:** `#0f0f1a`
- **Section background:** `#1a1a2e` (transparent sections) or full blocks
- **Text primary:** `#ffffff`
- **Text secondary:** `#cccccc`
- **Text muted:** `#b0b0b0`
- **Border:** `#333344`
- **Checkmark (✅):** `#4ade80`
- **X (❌):** `#f87171`
- **Warning (⚠️):** `#fbbf24`
- **Accent blue (callouts):** `#4a9eff`

---

## Responsive Design

### Desktop (>768px)
- Content max-width: 1000px
- Feature table: Full width, horizontal scroll if needed
- Cost comparison: Two-column grid
- Comfortable spacing

### Tablet (481px - 768px)
- Content max-width: 90%
- Feature table: Horizontal scroll
- Cost comparison: Stack vertically

### Mobile (≤480px)
- Content max-width: 100% (16px side padding)
- Feature table: Scrollable, icons may simplify
- Cost comparison: Vertical stack
- Font sizes: H1 32px, H2 24px, H3 20px, Body 15px

---

## Component Props

### ComparisonSection
```jsx
interface ComparisonSectionProps {
  title: string;
  keyMessage: string;
  paragraphs: string[];
  callout?: {
    icon: string;
    text: string;
  };
  children?: ReactNode;
}
```

### FeatureTable
```jsx
interface FeatureTableRow {
  feature: string;
  slancha: '✅' | '❌' | '⚠️';
  databricks: '✅' | '❌' | '⚠️';
  awsSagemaker: '✅' | '❌' | '⚠️';
  coreweave: '✅' | '❌' | '⚠️';
  build: '✅' | '❌' | '⚠️';
}

interface FeatureTableProps {
  rows: FeatureTableRow[];
  footer: string;
}
```

### CostComparison
```jsx
interface CostComparisonProps {
  build: {
    engineers: number;
    months: number;
    total: string;
  };
  slancha: {
    monthlyRange: string;
    breakeven: string;
    roi: string;
  };
}
```

---

## Implementation Notes

### Icon System
Use consistent SVG icons:
- Checkmark: 24x24px
- X: 24x24px  
- Warning: 24x24px
- Info (callouts): 24x24px

### Animation
- Section reveals: Fade in + slide up, 400ms
- Cost comparison: Staggered entry
- Feature table: Stable, no animation needed

### Accessibility
- Table: Proper `<th>` headers, `scope` attributes
- Icons: `aria-hidden="true"` with descriptive text
- Color: Don't rely solely on color (add icon/text)
- Focus: Proper tab order through table

---

## QA Checklist

- [ ] All 6 comparison sections present
- [ ] Feature table has 8 rows + footer
- [ ] Cost comparison numbers match copy
- [ ] All icons render correctly (checkmarks, X, warnings)
- [ ] Color contrast meets WCAG AA
- [ ] Table scrolls horizontally on mobile
- [ ] Callout boxes style correctly
- [ ] "Bottom line" statement visible
- [ ] Section dividers consistent
- [ ] Responsive at 375px, 768px, 1024px

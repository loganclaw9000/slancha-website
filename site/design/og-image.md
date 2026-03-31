# Design Spec — OG Image / Social Card

**Task:** [TASK-109] Design OG image / social card for Twitter/LinkedIn sharing

**Goal:** Create a compelling social card that represents Slancha's brand and value proposition when the website is shared on social media. Optimized for both Twitter Card and Open Graph (OG) display.

---

## Specifications

### Canvas Size
- **Recommended:** 1200 × 630 pixels (1.91:1 ratio — OG standard)
- **Twitter Card:** Requires minimum 144 × 144, recommends 1200 × 600
- **LinkedIn:** 1200 × 627 pixels
- **Use:** 1200 × 630 pixels to cover all platforms

### File Format
- **Output:** PNG (lossless, supports transparency)
- **Max file size:** < 5MB for Twitter

---

## Visual Design

### Color Palette (from design system)
- **Background:** `#121212` (deep charcoal) or gradient from `#121212` to `#1F1F1F`
- **Primary accent:** `#0A84FF` (Vercel blue) — for highlights, logo, key elements
- **Secondary accent:** `#00D1B2` (teal) — for subtle gradients or secondary highlights
- **Text primary:** `#E5E7EB` (light gray)
- **Text secondary:** `#A0AEC0` (soft gray)
- **Border/divider:** `#262626`

### Typography
- **Font family:** "Inter", system UI, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif
- **Headline (Slancha name):** 72px, weight 700, color `#E5E7EB`
- **Tagline:** 28px, weight 500, color `#A0AEC0`
- **Optional subtext:** 18px, weight 400, color `#5E6C84`

### Logo Treatment
- **Logo:** Use existing Slancha logo from `/site/public/favicon.svg` (if SVG) or create text-based logo
- **Logo size:** 64px height
- **Logo position:** Centered, 80px from top
- **Logo color:** `#0A84FF` if monochrome, or full color if available

### Layout Composition

```
┌────────────────────────────────────────┐
│                                        │
│            [Logo / Brand]              │  ← 80px from top
│            Slancha                     │
│                                        │
│   AI Inference That Improves Itself    │  ← Centered, 28px
│                                        │
│                                        │
│    [Optional visual element]           │  ← Abstract network/
│    (gradient lines, nodes, etc.)       │    connection motif
│                                        │
│                                        │
│    end-to-end · black box · zero       │  ← Footer text, 14px
│                                        │
└────────────────────────────────────────┘
```

**Safe zones:**
- Keep critical content 60px from all edges
- Center-align all text for social preview cropping
- Avoid text near bottom (some platforms crop)

---

## Visual Motifs (Optional)

If adding graphical elements, use subtle, abstract representations of:

1. **Neural network nodes** — small circles connected by thin lines
2. **Optimization loop** — curved arrow or cycle diagram (minimal)
3. **Data flow** — subtle gradient lines moving downward
4. **GPU/hardware abstraction** — geometric shapes, circuit-like patterns

**Style guidelines:**
- Use thin lines (1-2px), not bold
- Low opacity (10-20%) for background elements
- Avoid clutter — negative space is key
- Dark theme: elements should be 5-15% lighter than background

---

## Copy Options

### Option A (Minimal — Logo + Headline)
- **Logo:** Slancha
- **Tagline:** AI Inference That Improves Itself

### Option B (Expanded Value Prop)
- **Logo:** Slancha
- **Tagline:** AI Inference That Improves Itself
- **Subtext:** One API endpoint. Better accuracy. Lower cost. Zero ML overhead.

### Option C (Platform Focus)
- **Logo:** Slancha
- **Tagline:** End-to-End AI Inference Platform
- **Subtext:** Routes · Fine-tunes · Optimizes · Deploys

**Recommendation:** Option A or B for clean, impactful social cards.

---

## Technical Implementation

### If using CSS/HTML to generate:
```css
.social-card {
  width: 1200px;
  height: 630px;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
}

.logo {
  font-size: 72px;
  font-weight: 700;
  color: #E5E7EB;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 28px;
  font-weight: 500;
  color: #A0AEC0;
  text-align: center;
  max-width: 800px;
  line-height: 1.4;
}

.footer {
  position: absolute;
  bottom: 40px;
  font-size: 14px;
  color: #5E6C84;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### If using a design tool (Figma, Canva, etc.):
1. Create 1200 × 630 canvas
2. Set background to dark gradient
3. Add logo/brand name in Inter Bold 72px
4. Add tagline in Inter Medium 28px
5. Add subtle background pattern (optional)
6. Export as PNG

---

## Quality Checklist

- [ ] 1200 × 630 pixel dimensions
- [ ] Dark theme consistent with site
- [ ] Brand name "Slancha" prominently displayed
- [ ] Tagline clearly readable at social preview size
- [ ] No text near edges (safe zone respected)
- [ ] Colors match design system (#0A84FF accent)
- [ ] File is PNG, < 5MB
- [ ] Looks good cropped to square (1:1) for some platforms

---

## Deliverable

- **File name:** `og-image.png`
- **Location:** `/home/admin/.openclaw/workspace/site/public/`
- **Update:** Add to `index.html` `<head>` as:
  ```html
  <meta property="og:image" content="/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="/og-image.png">
  ```

---

*Spec ready for implementation.*

---

## Implementation Notes

**Template created:** `/home/admin/.openclaw/workspace/site/og-image-template.html`

To render the OG image:

### Option 1: Using Playwright (if available)
```bash
cd /home/admin/.openclaw/workspace/site
npx playwright screenshot og-image-template.html og-image.png --viewport-width=1200 --viewport-height=630
```

### Option 2: Using a headless browser
```bash
# Install puppeteer if needed
npm install puppeteer

# Create render.js
node render.js
```

### Option 3: Manual design
1. Open the HTML template in a browser
2. Take a full-page screenshot at 1200×630 resolution
3. Crop to exact dimensions
4. Save as `og-image.png` in `/site/public/`

### Option 4: Design tool
1. Recreate design in Figma/Canva using spec above
2. Export as PNG, 1200×630
3. Save to `/site/public/og-image.png`

---

## Next Steps

1. Generate `og-image.png`
2. Save to `/home/admin/.openclaw/workspace/site/public/og-image.png`
3. Update `/home/admin/.openclaw/workspace/site/index.html` with OG meta tags
4. Test social sharing preview (use Twitter Card Validator, LinkedIn Post Inspector)

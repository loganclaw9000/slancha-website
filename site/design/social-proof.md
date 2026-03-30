# Social Proof Section Spec

**Purpose**: Build credibility and trust through testimonials and partner logos. Place this section after Value Props and before How It Works on the homepage.

## Section Layout

### Container
- Max-width: 1200px, centered, margin: 0 auto
- Padding: 96px 64px desktop / 64px 24px mobile
- Background: surface color (`#0A0A0F`)
- Border-top and border-bottom: 1px solid `#1A1A1A`

---

## Part 1: "Trusted By" Logo Row

**Section Label**
- Text: `TRUSTED BY`
- Font: small caps, 11px, color `#5E6C84`, letter-spacing: 0.12em
- Margin-bottom: 32px

**Logo Grid**
- 6 logo slots (flex row on desktop, wrap on mobile)
- Each logo: max-height 40px, max-width 120px, object-fit: contain
- Color: `#5E6C84` (muted) → hover: `#A0AEC0` (lighter muted)
- Opacity: 0.6 → hover: 1.0
- Gap: 48px desktop / 32px mobile

**Placeholder Logo Slots** (use if real logos not available)
- Width: 120px, height: 40px
- Background: `#1A1A1A`
- Border: 1px dashed `#262626`
- Text: "LOGO" centered, 11px, color `#5E6C84`
- Class: `logo-placeholder`

---

## Part 2: Testimonial Carousel

**Section Label**
- Text: `WHAT ENGINEERS SAY`
- Font: small caps, 11px, color `#5E6C84`, letter-spacing: 0.12em
- Margin-bottom: 48px

**Carousel Container**
- Max-width: 800px, centered
- 3 testimonial cards visible on desktop (side-by-side), 1 on mobile (scrollable)

### Testimonial Card

**Card Container**
- Background: `#121212`
- Border: 1px solid `#1A1A1A`
- Border-radius: 12px
- Padding: 32px
- Hover: box-shadow `0 8px 24px rgba(0,0,0,0.3)`, border-color `#262626`

**Quote Icon** (top-left)
- Character: `"`, font-size: 48px, color `#0A84FF`, opacity: 0.3
- Position: absolute or flex-first

**Quote Text**
- Font-size: 18px, line-height: 1.6, color `#E5E7EB`
- Style: italic
- Max-width: 600px
- Class: `testimonial-quote`

**Author Block** (below quote, margin-top: 24px)
- Flex row, align-items: center, gap: 16px

**Author Avatar** (optional)
- Circle, 48px × 48px
- Background: `#1A1A1A`
- Border: 2px solid `#0A84FF`
- If no real photo: initial letter (first name) centered, 24px, color `#0A84FF`
- Class: `author-avatar`

**Author Info**
- Name: 16px, weight 600, color `#E5E7EB`
- Role/Company: 13px, color `#A0AEC0`, opacity 0.9
- Class: `author-name`, `author-role`

---

## Design Tokens

```css
--social-proof-label: {
  font-size: 11px;
  font-weight: 500;
  color: #5E6C84;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

--social-proof-logo-placeholder: {
  background: #1A1A1A;
  border: 1px dashed #262626;
  border-radius: 6px;
}

--social-proof-card: {
  background: #121212;
  border: 1px solid #1A1A1A;
  border-radius: 12px;
}
```

---

## Responsive Behavior

### Desktop (> 768px)
- Logo row: 6 logos, single row, 48px gap
- Testimonial cards: 3 columns, equal width (1fr 1fr 1fr)
- Section padding: 96px 64px

### Mobile (≤ 768px)
- Logo row: wrap to 2 rows (3 per row), 32px gap
- Testimonial cards: single column, horizontally scrollable or stacked
- Section padding: 64px 24px

---

## Component Structure

```jsx
<section className="social-proof">
  <div className="social-proof-container">
    {/* Trusted By Logos */}
    <div className="social-proof-logos">
      <span className="social-proof-label">TRUSTED BY</span>
      <div className="logo-grid">
        <LogoSlot name="Company A" />
        <LogoSlot name="Company B" />
        <LogoSlot name="Company C" />
        <LogoSlot name="Company D" />
        <LogoSlot name="Company E" />
        <LogoSlot name="Company F" />
      </div>
    </div>

    {/* Testimonials */}
    <div className="social-proof-testimonials">
      <span className="social-proof-label">WHAT ENGINEERS SAY</span>
      <div className="testimonial-carousel">
        <TestimonialCard
          quote="Slancha cut our inference costs by 60% while improving latency. The auto-tuning is magic."
          author="Alex Chen"
          role="ML Engineer, TechCorp"
          avatarUrl="/avatars/alex.jpg"
        />
        <TestimonialCard
          quote="Finally, an eval-to-deploy loop that doesn't require a PhD to set up. Our team shipped in days, not months."
          author="Sarah Park"
          role="Lead AI Engineer, StartupXYZ"
          avatarUrl="/avatars/sarah.jpg"
        />
        <TestimonialCard
          quote="The pilot program saved us $200k in GPU costs in the first quarter. Slancha pays for itself."
          author="Marcus Johnson"
          role="CTO, DataFirst Inc"
          avatarUrl="/avatars/marcus.jpg"
        />
      </div>
    </div>
  </div>
</section>
```

---

## Accessibility

- Logo images: `alt` text with company name
- Placeholder slots: `aria-hidden="true"` with descriptive `aria-label`
- Testimonial cards: semantic HTML (`blockquote`, `cite`)
- Color contrast: all text meets WCAG AA (4.5:1 minimum)
- Keyboard navigation: carousel arrows or tab to cycle through testimonials

---

## Copy Pending Notes

- Replace placeholder logos with real partner/customer logos when available
- Populate testimonial quotes from beta pilot users
- Add real avatar photos from beta testers
- Consider adding trust badges (SOC2, GDPR, etc.) if applicable

---

## Deliverables

1. This spec file (`social-proof.md`)
2. `SocialProof.jsx` component with logo grid and testimonial cards
3. `SocialProof.css` with design tokens and responsive rules
4. `LogoSlot.jsx` reusable placeholder component

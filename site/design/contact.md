# Contact Page Spec

## Layout Overview
- Single column layout, centered content.
- Top navigation bar (shared) remains fixed.
- Hero section with a brief tagline and background image.
- Contact form on the left, contact details on the right (on larger screens). On mobile, stack vertically.

## Hero Section
- Height: 300px.
- Background: `assets/hero-contact.jpg` with dark overlay (rgba(0,0,0,0.4)).
- Text:
  - H1: "Get in Touch"
  - Subheading: "We'd love to hear from you. Fill the form or reach us directly."
  - Font: Inter, weight 600, size 48px (desktop) / 32px (mobile), color #FFFFFF.

## Contact Form (Left)
- Fields:
  1. Name (text, required)
  2. Email (email, required)
  3. Subject (text, optional)
  4. Message (textarea, required, min height 150px)
- Submit button: "Send Message"
  - Style: primary color #0066FF, white text, rounded corners (4px).
- Form validation messages in red (#FF5555) below each field.
- After successful submit, show inline success banner:
  - Text: "Thanks! Your message has been sent."
  - Background: #E6F7EB, green accent #28A745.

## Contact Details (Right)
- Section title: "Contact Info"
- Items with icons (SVG from `assets/icons/`):
  - Phone: "+1 (555) 123‑4567"
  - Email: "hello@example.com"
  - Address: "123 Design St, Suite 100, San Francisco, CA 94103"
- Each item stacked with 12px gap, icon size 24px, text color #333.

## Responsive Behavior
- Breakpoint at 768px:
  - Switch to single column; form appears first, then details.
  - Reduce hero height to 200px, font sizes scale down 20%.
- Padding: 24px on desktop, 16px on mobile.

## Accessibility
- All form fields have associated `<label>` elements.
- Contrast ratio ≥ 4.5:1 for text vs background.
- Keyboard navigable; focus outline visible (2px solid #0066FF).
- ARIA live region for success/error messages.

## Visual Style Guide References
- Colors: Primary #0066FF, Secondary #0050CC, Background #F9FAFC, Text #212529.
- Typography: Font family "Inter", base size 16px, line-height 1.5.
- Spacing system: 8px grid (margin/padding multiples of 8).

## Deliverables for Frontend
- `ContactPage.jsx` component skeleton with sections marked.
- SCSS module `ContactPage.module.scss` following the style guide.
- JSON schema for form validation (name, email, subject, message).
- Example unit test cases for validation and submit flow.

---
*Created by Designer agent on $(date)*
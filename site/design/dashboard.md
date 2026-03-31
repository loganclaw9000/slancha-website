# Design Spec — Dashboard

## Overview
A full-width dashboard layout with sticky navigation, sidebar menu, and main content outlet. Dark theme with accent color highlights. Three main pages: Overview, API Keys, Usage, and Account Settings.

### Layout Structure
- **Container:** Sticky header (Nav) + sidebar (left) + main content area (right)
- **Nav:** Full-width top bar, transparent → solid on scroll, 64px height desktop / 56px mobile
- **Sidebar:** Fixed left column, 250px width, collapsible on mobile (hamburger menu)
- **Main Content:** Flexible width, max 1400px, centered with left/right padding

## Visual Design
### Colors
- **Background:** `#0A0A0A` (global)
- **Surface/Card:** `#1F1F1F`
- **Border:** `#262626`
- **Accent:** `#0A84FF` (links, buttons, active states)
- **Text Primary:** `#E5E7EB`
- **Text Secondary:** `#A0AEC0`
- **Success:** `#48BB78` (system health indicators)
- **Warning:** `#ED8936` (caution states)
- **Error:** `#F56565` (errors, revocation warnings)

### Typography
- **Headings:** Inter, 700 weight
- **Body:** Inter, 400 weight
- **Monospace:** JetBrains Mono (for API keys, endpoints)

---

## Page: Overview

### Page Header
- **Layout:** Flex row with justify-between
- **Headline:** "Your Inference Platform" (28px bold, class: `page-title`)
- **Subhead:** "Real-time visibility into your AI infrastructure" (16px regular, color: text-secondary, class: `page-subtitle`)
- **Spacing:** 32px bottom margin

### Empty State (when no endpoints deployed)
- **Layout:** Centered column, max-width 480px
- **Heading:** "Deploy an endpoint to get started" (20px bold, class: `empty-heading`)
- **Body:** "Once you create your first inference endpoint, you'll see usage stats, API key metrics, and system health here." (15px regular, color: text-secondary, line-height 1.6, class: `empty-body`)
- **CTA Button:** "Create New Endpoint" (accent background, white text, padding 12px 24px, rounded 4px, class: `btn-primary`)
- **Spacing:** 100px vertical padding, 48px bottom margin on button

### Dashboard Grid (when data exists)
- **Layout:** 3-column grid on desktop, single column on mobile
- **Gap:** 24px
- **Cards:** Each card is a `div` with class `dashboard-card`

#### Usage Stats Card
- **Layout:** Grid of 4 metrics in 2x2 on desktop, stacked on mobile
- **Label:** "Active Endpoints" (13px uppercase, color: text-secondary, letter-spacing 0.5px)
- **Value:** "3" (32px bold, color: text-primary, class: `stat-value`)
- **Sub-label:** "Requests Today: 47,892" (15px regular, color: text-secondary)
- **Sub-value:** "P95 Latency: 127ms" (15px regular, color: text-secondary)
- **Sub-label:** "Cost (Today): $142.37" (15px regular, color: accent)
- **Card padding:** 24px

#### API Keys Card
- **Layout:** Grid of 4 metrics
- **Metrics:**
  - "Active Keys: 2"
  - "Total Requests (24h): 47,892"
  - "Rate Limit Hits: 0" (color: success if 0, warning if >0)
  - "Top Endpoint: /v1/chat/completions (31,204 req)" (color: text-secondary, use monospace font for endpoint path)
- **Card padding:** 24px

#### System Health Card
- **Status Indicator:** Green dot (circle, 8px diameter) + text "All Systems Operational" (color: success)
- **Last Checked:** "Last checked: 2 minutes ago" (13px regular, color: text-secondary)
- **Card padding:** 24px
- **Border:** Optional green accent border (`border-left: 3px solid #48BB78`) when healthy

---

## Page: API Keys

### Page Header
- **Headline:** "API Keys" (28px bold, class: `page-title`)
- **Subhead:** "Manage access to your inference endpoints" (16px regular, color: text-secondary, class: `page-subtitle`)
- **Spacing:** 32px bottom margin

### Add Key Section
- **Card container:** Class `add-key-card`
- **Field Labels:**
  - "Key Name" (14px bold, color: text-primary) — input placeholder: "e.g., Production App"
  - "Expiration Date" (14px bold, color: text-primary) — optional, date picker input
  - "Permissions" (14px bold, color: text-primary) — select dropdown: "Full Access" | "Read-Only"
- **CTA Button:** "Generate Key" (accent background, white text, padding 12px 24px, rounded 4px, class: `btn-primary`)
- **Spacing:** 32px bottom margin on section

### Key List
- **Layout:** Vertical list, each item is `div` with class `api-key-item`
- **Item styling:**
  - Background: surface (`#1F1F1F`)
  - Border: 1px solid border (`#262626`)
  - Border-radius: 8px
  - Padding: 20px
  - Hover: translateY(-2px), shadow increase
- **Item content (flex row):**
  - **Left column:**
    - Key Name (bold, 16px, class: `key-name`)
    - Created: March 15, 2026 (13px regular, color: text-secondary)
    - Last Used: 3 minutes ago (13px regular, color: text-secondary)
    - Status badge: "Active" (pill, green background `#48BB78`, white text, padding 4px 8px, rounded 12px, class: `status-badge`)
  - **Right column:** Actions
    - "Regenerate" (link text, color: accent, cursor pointer, class: `action-link`)
    - "Revoke" (link text, color: error, cursor pointer, class: `action-link`)
    - **Spacing:** 16px between links

### Regenerate Confirmation Dialog
- **Overlay:** Full-screen or modal overlay with semi-transparent background
- **Card container:** Centered, max-width 480px
- **Heading:** "Regenerate API Key?" (20px bold, class: `dialog-title`)
- **Body:** "This will immediately invalidate your current key. Any applications using it will stop working. Make sure you update your credentials first." (15px regular, color: text-secondary, line-height 1.6, class: `dialog-body`)
- **Buttons:**
  - "Cancel" (outline button, border color: border, text color: text-primary, padding 10px 20px, rounded 4px, class: `btn-secondary`)
  - "Yes, Regenerate" (danger button, background: error, white text, padding 10px 20px, rounded 4px, class: `btn-danger`)
- **Spacing:** 32px bottom margin between body and buttons

### Revoke Confirmation Dialog
- **Same structure as Regenerate Dialog**
- **Heading:** "Revoke API Key?"
- **Body:** "This will permanently disable this key. All requests made with it will fail immediately. This action cannot be undone."
- **Buttons:** "Cancel" | "Yes, Revoke" (both same styling)

---

## Page: Usage & Billing

### Page Header
- **Headline:** "Usage & Billing" (28px bold, class: `page-title`)
- **Subhead:** "Track your inference costs and quota" (16px regular, color: text-secondary, class: `page-subtitle`)
- **Spacing:** 32px bottom margin

### Current Period Summary Card
- **Layout:** Grid of 4 metrics
- **Billing Period:** "March 1–31, 2026" (15px regular, color: text-secondary)
- **Total Requests:** "1,247,892" (24px bold, color: text-primary, class: `usage-value`)
- **Total Cost:** "$3,842.19" (24px bold, color: accent, class: `cost-value`)
- **Estimated Final:** "$4,100.00" (15px regular, color: text-secondary, optional strikethrough if different from total)

### Usage By Model Section
- **Title:** "Usage By Model" (18px bold, color: text-primary, margin-bottom 16px, class: `section-title`)
- **List format:** Each model is a list item with flex layout
  - Model name: "Llama-3-70B:" (15px bold, color: text-primary)
  - Requests: "524,312 requests" (15px regular, color: text-secondary)
  - Cost: "$1,892.40" (15px regular, color: accent)
- **Visual:** Optional progress bar showing percentage of total usage

### Usage By Endpoint Section
- **Title:** "Usage By Endpoint" (18px bold, color: text-primary, margin-bottom 16px, class: `section-title`)
- **Same list format as Usage By Model**
- **Endpoint paths:** Use monospace font (JetBrains Mono) for paths like `/v1/chat/completions`

### Cost Trends Card
- **Layout:** Horizontal bar chart or simple flex row with 3 values
- **Today:** "$142.37" (16px bold)
- **Yesterday:** "$167.82" (16px regular, color: text-secondary)
- **7-day average:** "$158.43" (16px regular, color: text-secondary)
- **Visual:** Optional mini sparkline showing 7-day trend

### Export Button
- **CTA:** "Export CSV" (outline button, border color: border, text color: text-primary, padding 10px 20px, rounded 4px, class: `btn-secondary`)
- **Position:** Top-right of Usage & Billing section, aligned with page title

---

## Page: Account Settings

### Page Header
- **Headline:** "Account Settings" (28px bold, class: `page-title`)
- **Subhead:** "Manage your workspace and preferences" (16px regular, color: text-secondary, class: `page-subtitle`)
- **Spacing:** 32px bottom margin

### Workspace Info Card
- **Layout:** Grid of 4 fields (2x2 on desktop, stacked on mobile)
- **Fields:**
  - **Workspace Name:** "Slancha Inc." (16px bold, color: text-primary)
  - **Organization ID:** "org_slancha_inc_2026" (15px regular, color: text-secondary, monospace font)
  - **Plan:** "Pro ($299/mo)" (16px bold, color: accent)
  - **Seats:** "4/10" (15px regular, color: text-secondary)
- **Card padding:** 24px

### Team Members Section
- **Title:** "Team Members" (18px bold, color: text-primary, margin-bottom 16px, class: `section-title`)
- **List format:** Each member is a list item
  - Name: "admin@slancha.ai" (15px bold, color: text-primary)
  - Role: "(Owner)" (13px regular, color: text-secondary)
  - Status: "— Active" (13px regular, color: success)
  - **Invite button:** "[+ Invite Member]" (link text, color: accent, class: `invite-link`)
- **List spacing:** 12px between items

### Notification Preferences Section
- **Title:** "Notifications" (18px bold, color: text-primary, margin-bottom 16px, class: `section-title`)
- **Checkbox list:** Each option is a checkbox + label pair
  - "[✓] Email me when costs exceed budget" (15px regular, color: text-primary)
  - "[✓] Email me when endpoints fail" (15px regular, color: text-primary)
  - "[ ] Weekly usage summaries" (15px regular, color: text-secondary)
  - "[ ] Product updates and announcements" (15px regular, color: text-secondary)
- **Checkbox styling:** Custom checkbox (square, 18px, border-color: border, checked: accent background + white checkmark)

### Danger Zone
- **Title:** "Danger Zone" (18px bold, color: error, margin-bottom 16px, class: `section-title-danger`)
- **Background:** Optional subtle red tint (`background: rgba(245, 101, 101, 0.05)`)
- **Actions list:**
  - "Delete Workspace (requires 2FA)" (link text, color: error, class: `danger-action`)
  - "Export All Data (CSV + JSON)" (link text, color: text-primary, class: `danger-action`)
- **Spacing:** 32px bottom margin on section

### Save Button
- **CTA:** "Save Changes" (accent background, white text, padding 12px 24px, rounded 4px, class: `btn-primary`)
- **Position:** Bottom of Account Settings page, full-width on mobile, fixed width 200px desktop

---

## Sidebar Navigation

### Menu Items
- **Layout:** Vertical list, full-height sidebar
- **Item styling:**
  - Padding: 12px 20px
  - Border-radius: 6px
  - Hover: background-surface (`#1F1F1F`)
  - Active: background-accent (`#0A84FF`), text-white
  - Icon + text, icon size 18px, spacing 12px between icon and text
- **Menu structure:**
  - **Dashboard** (home icon) — active
  - **API Keys** (key icon)
  - **Usage** (chart icon)
  - **Settings** (gear icon)
- **Spacing:** 8px between items

### Collapsible on Mobile
- **Trigger:** Hamburger icon in top-left of Nav (when sidebar is collapsed)
- **Animation:** Slide-in from left, 300ms ease-out
- **Overlay:** Semi-transparent background when sidebar is open

---

## Animations / Effects
- **Nav transition:** Background fades from transparent → solid on scroll (200ms)
- **Card hover:** `translateY(-4px)`, box-shadow increase, transition 200ms ease
- **Dialog fade-in:** Overlay fades in 150ms, card scales 0.95 → 1.0 with opacity 200ms
- **Loading states:** Skeleton loaders with pulse animation for data cards

## Responsive Breakpoints
- **Mobile:** < 768px (single column, hamburger menu, stacked grids)
- **Tablet:** 768px – 1024px (2-column grids)
- **Desktop:** ≥ 1024px (3-column grids, full sidebar visible)

## Deliverables
- This spec file (`dashboard.md`)
- Component implementations: `src/components/Dashboard/Overview.jsx`, `APIKeys.jsx`, `Usage.jsx`, `AccountSettings.jsx`
- CSS: `src/components/Dashboard/Dashboard.css`, `Overview.css`, `APIKeys.css`, `Usage.css`, `AccountSettings.css`

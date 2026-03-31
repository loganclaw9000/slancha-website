# Email Template Design Spec - Launch Announcement Sequence

## Purpose
Design a 5-email onboarding sequence for pilot signups that guides users through the Slancha platform journey: Welcome → Quick Win → First Eval → Deployment → Upgrade.

## Design System for Email

### Colors
- **Primary (CTA):** `#0A84FF` (Vercel blue)
- **Secondary:** `#5E6C84` (muted slate)
- **Highlight (Hover):** `#00D1B2` (teal)
- **Background:** `#F5F5F7` (light gray)
- **Content Background:** `#FFFFFF` (white)
- **Borders:** `#E5E5E5` (light gray)
- **Text Primary:** `#1D1D1F` (near black)
- **Text Secondary:** `#6E6E73` (gray)

### Typography
- **Font Stack:** "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Body:** 16px, line-height 1.6
- **Headlines:** 24px, weight 600
- **Subheadlines:** 18px, weight 500
- **Small text:** 14px, weight 400

### Spacing
- **Email container max-width:** 600px
- **Padding:** 24px
- **Section spacing:** 32px between major sections
- **Button padding:** 14px 28px

---

## Email Template 1: Welcome + Setup (Day 1)

### Purpose
Welcome the user, confirm their signup, and guide them through initial setup.

### Layout

```
┌────────────────────────────────────────────────────┐
│  [Slancha Logo - Centered]                         │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │                                              │ │
│  │  Welcome to Slancha! 🎉                      │ │
│  │  (H2, 24px, weight 600)                      │ │
│  │                                              │ │
│  │  You're now part of the future of AI         │ │
│  │  inference. Let's get your account set up.   │ │
│  │  (Body, 16px, weight 400)                    │ │
│  │                                              │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │  Quick Setup (2 minutes)               │  │ │
│  │  │                                        │  │ │
│  │  │  1. Generate your API key              │  │ │
│  │  │  2. Run your first evaluation          │  │ │
│  │  │  3. Deploy your model                  │  │ │
│  │  │                                        │  │ │
│  │  │  [Get Started →]                       │  │ │
│  │  └────────────────────────────────────────┘  │ │
│  │                                              │ │
│  │  ─────────────────────────────────────       │ │
│  │                                              │ │
│  │  What's inside?                              │ │
│  │  • Free tier: 10,000 eval requests/month     │ │
│  │  • No credit card required                   │ │
│  │  • Integration with OpenAI, Anthropic, etc.  │ │
│  │                                              │ │
│  │  Need help? Reply to this email or           │ │
│  │  contact@slancha.ai                          │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ─────────────────────────────────────────         │
│                                                    │
│  Slancha — The black box AI inference platform    │
│  [Privacy] [Terms] [Unsubscribe]                  │
│  123 Market Street, San Francisco, CA 94103       │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Components

**Logo:**
- Width: 120px
- Height: auto
- Position: Centered at top
- Background: Transparent or white

**Welcome Header:**
- Headline: "Welcome to Slancha! 🎉"
- Font: 24px, weight 600
- Color: `#1D1D1F`
- Margin bottom: 16px

**Intro Text:**
- Font: 16px, weight 400, line-height 1.6
- Color: `#6E6E73`
- Margin bottom: 32px

**Quick Setup Card:**
- Background: `#F8F9FA` (light gray)
- Border: `1px solid #E5E5E5`
- Border-radius: 12px
- Padding: 24px
- Margin bottom: 32px

**Setup Steps:**
- Numbered list (1-2-3)
- Font: 16px, weight 400
- Color: `#1D1D1F`
- List spacing: 8px between items

**Primary CTA Button:**
- Text: "Get Started →"
- Background: `#0A84FF`
- Color: `#FFFFFF`
- Font: 16px, weight 600
- Border-radius: 8px
- Padding: 14px 28px
- Text-align: center
- Display: block
- Hover: Background `#00D1B2` (teal highlight)

**Divider:**
- Border: `1px solid #E5E5E5`
- Margin: 32px 0

**Features List:**
- Bullet points
- Font: 16px, weight 400
- Color: `#6E6E73`
- List spacing: 6px between items

**Help Text:**
- Font: 14px, weight 400
- Color: `#6E6E73`
- Margin top: 24px

**Footer:**
- Border-top: `1px solid #E5E5E5`
- Padding top: 24px
- Font: 12px, weight 400
- Color: `#9AA0A6`
- Links: Underlined on hover

---

## Email Template 2: Quick Win (Day 3)

### Purpose
Deliver a quick win by showing the user how to get immediate value with minimal effort.

### Layout

```
┌────────────────────────────────────────────────────┐
│  [Slancha Logo - Centered]                         │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │                                              │ │
│  │  You're 2 minutes away from your first       │ │
│  │  evaluation                                  │ │
│  │  (H2, 24px, weight 600)                      │ │
│  │                                              │ │
│  │  Here's the fastest way to see Slancha in    │ │
│  │  action:                                     │ │
│  │  (Body, 16px, weight 400)                    │ │
│  │                                              │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │  Step 1: Paste your API key            │  │ │
│  │  │  ────────────────────────────────────  │  │ │
│  │  │  Go to Settings > API Keys and paste   │  │ │
│  │  │  your existing key from OpenAI,        │  │ │
│  │  │  Anthropic, or another provider.       │  │ │
│  │  │                                        │  │ │
│  │  │  📸 [Screenshot: API Key Input Field]  │  │ │
│  │  │                                        │  │ │
│  │  │  Step 2: Select a dataset              │  │ │
│  │  │  ────────────────────────────────────  │  │ │
│  │  │  Choose from our pre-curated datasets  │  │ │
│  │  │  or upload your own (CSV, JSONL).      │  │ │
│  │  │                                        │  │ │
│  │  │  📸 [Screenshot: Dataset Selector]     │  │ │
│  │  │                                        │  │ │
│  │  │  Step 3: Click "Run"                   │  │ │
│  │  │  ────────────────────────────────────  │  │ │
│  │  │  Your eval runs in 2-5 minutes. We'll  │  │ │
│  │  │  notify you when it's ready.           │  │ │
│  │  │                                        │  │ │
│  │  │  [Run Your First Eval →]               │  │ │
│  │  └────────────────────────────────────────┘  │ │
│  │                                              │ │
│  │  Need help? Reply to this email or           │ │
│  │  contact@slancha.ai                          │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ─────────────────────────────────────────         │
│                                                    │
│  Slancha — The black box AI inference platform    │
│  [Privacy] [Terms] [Unsubscribe]                  │
│  123 Market Street, San Francisco, CA 94103       │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Components

**Headline:**
- "You're 2 minutes away from your first evaluation"
- Font: 24px, weight 600
- Color: `#1D1D1F`
- Margin bottom: 16px

**Intro Text:**
- "Here's the fastest way to see Slancha in action:"
- Font: 16px, weight 400
- Color: `#6E6E73`
- Margin bottom: 24px

**Steps Card:**
- Background: `#FFFFFF` (white)
- Border: `1px solid #E5E5E5`
- Border-radius: 12px
- Padding: 24px

**Step Format:**
- Step title: Bold, 16px, weight 600
- Step description: Regular, 15px, weight 400
- Screenshot placeholder: 100% width, max-width 400px
- Border: `1px solid #E5E5E5`
- Border-radius: 8px
- Margin: 16px 0

**Step 1 - API Key:**
- Title: "Step 1: Paste your API key"
- Description: "Go to Settings > API Keys and paste your existing key from OpenAI, Anthropic, or another provider."

**Step 2 - Dataset:**
- Title: "Step 2: Select a dataset"
- Description: "Choose from our pre-curated datasets or upload your own (CSV, JSONL)."

**Step 3 - Run:**
- Title: "Step 3: Click 'Run'"
- Description: "Your eval runs in 2-5 minutes. We'll notify you when it's ready."

**Primary CTA Button:**
- Text: "Run Your First Eval →"
- Same styling as Email 1

**Help Text:**
- Same as Email 1

---

## Email Template 3: First Eval (Day 7)

### Purpose
Follow up on users who haven't run their first evaluation, providing support and encouragement.

### Layout

```
┌────────────────────────────────────────────────────┐
│  [Slancha Logo - Centered]                         │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │                                              │ │
│  │  How did your first eval go? 🤔              │ │
│  │  (H2, 24px, weight 600)                      │ │
│  │                                              │ │
│  │  We noticed you haven't run an evaluation    │ │
│  │  yet. Here's what you'll discover:           │ │
│  │  (Body, 16px, weight 400)                    │ │
│  │                                              │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │  📊 Your model's performance           │  │ │
│  │  │     across helpfulness, honesty,       │  │ │
│  │  │     safety, and fluency                │  │ │
│  │  │                                        │  │ │
│  │  │  💡 Where your model needs improvement │  │ │
│  │  │     Specific feedback on weak areas    │  │ │
│  │  │                                        │  │ │
│  │  │  🚀 Cost optimization opportunities    │  │ │
│  │  │     Route cheap queries to smaller     │  │ │
│  │  │     models, save up to 40%             │  │ │
│  │  │                                        │  │ │
│  │  │  [See Full Report Template →]          │  │ │
│  │  └────────────────────────────────────────┘  │ │
│  │                                              │ │
│  │  ─────────────────────────────────────       │ │
│  │                                              │ │
│  │  💬 "Slancha showed us our model was        │ │
│  │     scoring 92% on helpfulness but only     │ │
│  │     67% on honesty. We fine-tuned and now   │ │
│  │     we're at 94% and 89% respectively."     │ │
│  │     — Sarah Kim, ML Lead @ FinTech Startup  │ │
│  │                                              │ │
│  │  Need help getting started?                  │ │
│  │  We offer 1:1 onboarding calls.              │ │
│  │  [Book a Call →]                             │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ─────────────────────────────────────────         │
│                                                    │
│  Slancha — The black box AI inference platform    │
│  [Privacy] [Terms] [Unsubscribe]                  │
│  123 Market Street, San Francisco, CA 94103       │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Components

**Headline:**
- "How did your first eval go? 🤔"
- Font: 24px, weight 600
- Color: `#1D1D1F`
- Margin bottom: 16px

**Intro Text:**
- "We noticed you haven't run an evaluation yet. Here's what you'll discover:"
- Font: 16px, weight 400
- Color: `#6E6E73`
- Margin bottom: 24px

**Benefits Card:**
- Background: `#F8F9FA` (light gray)
- Border: `1px solid #E5E5E5`
- Border-radius: 12px
- Padding: 24px

**Benefit Items (3 items):**
- Icon: Emoji or SVG (24px)
- Title: Bold, 16px, weight 600
- Description: Regular, 15px, weight 400
- Line spacing: 12px between items

**Primary CTA Button (inline in card):**
- Text: "See Full Report Template →"
- Background: `#0A84FF`
- Color: `#FFFFFF`
- Font: 16px, weight 600
- Border-radius: 8px
- Padding: 12px 24px
- Margin: 16px 0

**Divider:**
- Border: `1px solid #E5E5E5`
- Margin: 32px 0

**Testimonial:**
- Background: `#FFFFFF`
- Border-left: `4px solid #0A84FF`
- Padding: 16px 24px
- Margin: 24px 0
- Quote text: Italic, 16px, weight 400
- Attribution: Regular, 14px, weight 500, color `#6E6E73`

**Secondary CTA:**
- Text: "Book a Call →"
- Background: Transparent
- Border: `2px solid #0A84FF`
- Color: `#0A84FF`
- Font: 16px, weight 600
- Border-radius: 8px
- Padding: 12px 24px
- Hover: Background `#0A84FF`, Color `#FFFFFF`

**Help Text:**
- Same as previous emails

---

## Email Template 4: Deployment (Day 14)

### Purpose
Guide users who have run evaluations to deployment, highlighting the next value step.

### Layout

```
┌────────────────────────────────────────────────────┐
│  [Slancha Logo - Centered]                         │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │                                              │ │
│  │  Ready to deploy?                            │ │
│  │  (H2, 24px, weight 600)                      │ │
│  │                                              │ │
│  │  You've run your evaluation. Now let's       │ │
│  │  get it into production.                     │ │
│  │  (Body, 16px, weight 400)                    │ │
│  │                                              │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │  Deploy in 3 steps                     │  │ │
│  │  │                                        │  │ │
│  │  │  1️⃣  Select your model                │  │ │
│  │  │     Choose from evaluated models       │  │ │
│  │  │                                        │  │ │
│  │  │  2️⃣  Enable Semantic Router           │  │ │
│  │  │     Auto-route queries to best model   │  │ │
│  │  │                                        │  │ │
│  │  │  3️⃣  Get your endpoint URL            │  │ │
│  │  │     One API call, infinite possibilities│ │ │
│  │  │                                        │  │ │
│  │  │  [Deploy Now →]                        │  │ │
│  │  └────────────────────────────────────────┘  │ │
│  │                                              │ │
│  │  ─────────────────────────────────────       │ │
│  │                                              │ │
│  │  What you get:                               │ │
│  │  • Dedicated endpoint URL                    │ │
│  │  • 99.9% SLA uptime                          │ │
│  │  • Automatic model updates                   │ │
│  │  • Real-time metrics dashboard               │ │
│  │  • Cost savings: Up to 43% vs. direct API    │ │
│  │                                              │ │
│  │  Questions? Our deployment specialists are    │ │
│  │  here to help.                               │ │
│  │  [Schedule a Demo →]                         │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ─────────────────────────────────────────         │
│                                                    │
│  Slancha — The black box AI inference platform    │
│  [Privacy] [Terms] [Unsubscribe]                  │
│  123 Market Street, San Francisco, CA 94103       │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Components

**Headline:**
- "Ready to deploy?"
- Font: 24px, weight 600
- Color: `#1D1D1F`
- Margin bottom: 16px

**Intro Text:**
- "You've run your evaluation. Now let's get it into production."
- Font: 16px, weight 400
- Color: `#6E6E73`
- Margin bottom: 24px

**Steps Card:**
- Background: `#F8F9FA` (light gray)
- Border: `1px solid #E5E5E5`
- Border-radius: 12px
- Padding: 24px

**Step Items (3 steps):**
- Step number: Emoji or icon (24px)
- Step title: Bold, 16px, weight 600
- Step description: Regular, 15px, weight 400
- Line spacing: 12px between items

**Primary CTA Button:**
- Text: "Deploy Now →"
- Background: `#0A84FF`
- Color: `#FFFFFF`
- Font: 16px, weight 600
- Border-radius: 8px
- Padding: 14px 28px
- Margin: 16px 0

**Divider:**
- Border: `1px solid #E5E5E5`
- Margin: 32px 0

**Features List:**
- Bullet points
- Font: 16px, weight 400
- Color: `#6E6E73`
- Line spacing: 6px between items
- Emphasize: "43% vs. direct API" (bold)

**Secondary CTA:**
- Text: "Schedule a Demo →"
- Background: `#0A84FF`
- Color: `#FFFFFF`
- Font: 16px, weight 600
- Border-radius: 8px
- Padding: 14px 28px
- Margin: 16px 0

---

## Email Template 5: Upgrade Prompt (Day 21)

### Purpose
Convert free tier users to paid plans, highlighting value and upgrade benefits.

### Layout

```
┌────────────────────────────────────────────────────┐
│  [Slancha Logo - Centered]                         │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │                                              │ │
│  │  Your free tier is almost full 🎯            │ │
│  │  (H2, 24px, weight 600)                      │ │
│  │                                              │ │
│  │  You've used 9,500 of 10,000 free eval       │ │
│  │  requests this month. Upgrade to keep the    │ │
│  │  momentum going.                             │ │
│  │  (Body, 16px, weight 400)                    │ │
│  │                                              │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │  Choose your plan                      │  │ │
│  │  │                                        │ │ │
│  │  │  ┌─────────────────┐  ┌─────────────┐  │ │ │
│  │  │  │   PRO           │  │   ENTERPRISE│  │ │ │
│  │  │  │   ───────────── │  │   ──────────│  │ │ │
│  │  │  │   $299/month    │  │   Custom    │  │ │ │
│  │  │  │                 │  │             │  │ │ │
│  │  │  │  100K evals     │  │  Unlimited  │  │ │ │
│  │  │  │  $0.003/eval    │  │  $0.002/eval│  │ │ │
│  │  │  │                 │  │             │  │ │ │
│  │  │  │  ✓ Semantic     │  │  ✓ All Pro  │  │ │ │
│  │  │  │    Router       │  │    features │  │ │ │
│  │  │  │  ✓ Fine-tuning  │  │  ✓ Dedicated│  │ │ │
│  │  │  │    credits      │  │    support  │  │ │ │
│  │  │  │  ✓ Priority     │  │  ✓ Custom   │  │ │ │
│  │  │  │    support      │  │    SLA      │  │ │ │
│  │  │  │                 │  │  ✓ On-prem  │  │ │ │
│  │  │  └─────────────────┘  └─────────────┘  │ │ │
│  │  │                                        │ │ │
│  │  │  [Start Free Trial →]   [Talk to Sales]│ │ │
│  │  └────────────────────────────────────────┘  │ │
│  │                                              │ │
│  │  ─────────────────────────────────────       │ │
│  │                                              │ │
│  │  💰 ROI Snapshot                             │ │
│  │                                              │ │
│  │  Based on your usage, Slancha can save you:  │ │
│  │                                              │ │
│  │  $49,000 / year vs. building in-house        │ │
│  │  $12,500 / year vs. direct API calls         │ │
│  │                                              │ │
│  │  [View Full ROI Calculator →]                │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ─────────────────────────────────────────         │
│                                                    │
│  Slancha — The black box AI inference platform    │
│  [Privacy] [Terms] [Unsubscribe]                  │
│  123 Market Street, San Francisco, CA 94103       │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Components

**Headline:**
- "Your free tier is almost full 🎯"
- Font: 24px, weight 600
- Color: `#1D1D1F`
- Margin bottom: 16px

**Intro Text:**
- "You've used 9,500 of 10,000 free eval requests this month. Upgrade to keep the momentum going."
- Font: 16px, weight 400
- Color: `#6E6E73`
- Margin bottom: 24px

**Plans Card:**
- Background: `#FFFFFF` (white)
- Border: `1px solid #E5E5E5`
- Border-radius: 12px
- Padding: 24px

**Pricing Table (2-column grid):**

**Pro Plan Column:**
- Plan name: Bold, 18px, weight 600
- Price: Bold, 32px, weight 700, color `#0A84FF`
- Price label: Regular, 14px, weight 400
- Features list: Regular, 15px, weight 400
- Checkmark icons: Green checkmarks (✓)

**Enterprise Plan Column:**
- Same styling as Pro
- Custom pricing emphasis

**CTA Buttons (2 buttons):**
**Primary CTA:**
- Text: "Start Free Trial →"
- Background: `#0A84FF`
- Color: `#FFFFFF`
- Font: 16px, weight 600
- Border-radius: 8px
- Padding: 14px 28px
- Width: 48% (each button)
- Margin: 0 1% (1% gap between buttons)

**Secondary CTA:**
- Text: "Talk to Sales"
- Background: Transparent
- Border: `2px solid #0A84FF`
- Color: `#0A84FF`
- Font: 16px, weight 600
- Border-radius: 8px
- Padding: 14px 28px
- Width: 48%
- Hover: Background `#0A84FF`, Color `#FFFFFF`

**Divider:**
- Border: `1px solid #E5E5E5`
- Margin: 32px 0

**ROI Section:**
- Background: `#F8F9FA` (light gray)
- Border-radius: 8px
- Padding: 24px
- Margin: 24px 0

**ROI Headline:**
- "💰 ROI Snapshot"
- Font: 18px, weight 600
- Color: `#1D1D1F`
- Margin bottom: 16px

**ROI Values:**
- Value 1: Bold, 20px, weight 600, color `#0A84FF`
  - "$49,000 / year vs. building in-house"
- Value 2: Bold, 20px, weight 600, color `#0A84FF`
  - "$12,500 / year vs. direct API calls"
- Description: Regular, 16px, weight 400, color `#6E6E73`

**Link Button:**
- Text: "View Full ROI Calculator →"
- Color: `#0A84FF`
- Font: 16px, weight 600
- Text-decoration: underline on hover
- Margin: 16px 0

---

## Responsive Design

### Desktop (>600px)
- Container: 600px max-width
- All layouts as specified above
- Comfortable spacing

### Mobile (≤600px)
- Container: 100% width with 20px padding
- Pricing table: Stack vertically instead of side-by-side
- Buttons: Full width, stacked
- Smaller font sizes: H2 20px, Body 15px
- Simplified layouts for screenshots

---

## Accessibility

### Color Contrast
- All text meets WCAG AA (4.5:1 minimum)
- Links have underlines on hover
- Focus states: 2px outline on interactive elements

### Screen Reader
- Semantic HTML structure
- ARIA labels for buttons
- Descriptive link text

### Images
- All screenshots have alt text describing content
- Decorative elements have empty alt=""

---

## Implementation Notes

### Email Template Variables
```jsx
interface EmailTemplateProps {
  recipientName: string;
  userName: string;
  userCompany: string;
  apiKey?: string; // For personalized emails
  evalCount?: number;
  creditsUsed?: number;
  creditsRemaining?: number;
  trialStartDate?: Date;
  roiSavings?: {
    vsInHouse: number;
    vsDirectAPI: number;
  };
}
```

### CSS Classes (for email client compatibility)
```css
/* Inline styles required for most email clients */
.email-container {
  max-width: 600px;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 12px;
}

.card {
  background: #F8F9FA;
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
}

.button {
  display: inline-block;
  background: #0A84FF;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  padding: 14px 28px;
  text-decoration: none;
}

.button:hover {
  background: #00D1B2;
}
```

### Email Client Compatibility
- Support: Gmail, Outlook, Apple Mail, Yahoo Mail
- Fallbacks for:
  - CSS Grid → Table layouts
  - Flexbox → Inline table cells
  - CSS Variables → Hardcoded values
  - Images → Alt text fallbacks

---

## QA Checklist

- [ ] All 5 email templates rendered correctly
- [ ] All CTA buttons link to correct destinations
- [ ] Images/screenshots have proper alt text
- [ ] Links work and track correctly
- [ ] Responsive design tested on mobile and desktop
- [ ] Color contrast meets WCAG AA
- [ ] Unsubscribe link present in footer
- [ ] Physical address present in footer
- [ ] Preheader text optimized for each email
- [ ] Send preview tested in all major email clients
- [ ] A/B test subject lines prepared
- [ ] Personalization tokens working correctly

---

## Subject Line Variations (for A/B Testing)

**Email 1 (Welcome):**
- A: "Welcome to Slancha! 🎉 Let's get started"
- B: "Your Slancha account is ready →"

**Email 2 (Quick Win):**
- A: "You're 2 minutes away from your first evaluation"
- B: "How to run your first eval in 3 steps"

**Email 3 (First Eval):**
- A: "How did your first eval go? 🤔"
- B: "What you'll discover with your first eval"

**Email 4 (Deployment):**
- A: "Ready to deploy?"
- B: "Your evaluation is complete. Now deploy."

**Email 5 (Upgrade):**
- A: "Your free tier is almost full 🎯"
- B: "Upgrade to keep the momentum going"

---

## Completion Criteria

This spec is complete when:
- [ ] All 5 email templates have detailed wireframes
- [ ] All sections and components are specified
- [ ] Responsive breakpoints are defined
- [ ] Accessibility requirements are specified
- [ ] Email client compatibility considerations documented
- [ ] Subject line variations provided
- [ ] QA checklist is comprehensive
- [ ] Copywriter has provided body copy (TASK-092)

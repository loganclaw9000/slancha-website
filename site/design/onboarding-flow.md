# Design Spec — Onboarding Flow Wireframes

**Task:** [TASK-112] Create onboarding flow wireframes: post-signup experience from dashboard to first API call

**Goal:** Design a clear, guided post-signup experience that takes new users from account creation to their first API call in under 3 minutes.

---

## Flow Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   1. Welcome Screen                    2. Quick Setup           │
│   (post-signup redirect)               (guided tour)            │
│   ┌──────────────┐                     ┌──────────────┐         │
│   │              │                     │              │         │
│   │  Welcome!    │     → Click →       │  Select      │         │
│   │  Get         │                     │  Use Case    │         │
│   │  started     │                     │  (dropdown)  │         │
│   │              │                     │              │         │
│   └──────────────┘                     └──────────────┘         │
│                                                                  │
│   3. First Endpoint                  4. API Credentials        │
│      Creation                        (display + copy)          │
│   ┌──────────────┐                     ┌──────────────┐         │
│   │              │                     │              │         │
│   │  Endpoint    │     → Click →       │  sk-live_...   │         │
│   │  Name        │                     │  [Copy]      │         │
│   │  Region      │                     │              │         │
│   │  Model       │                     │  Quick       │         │
│   │              │                     │  Test        │         │
│   └──────────────┘                     └──────────────┘         │
│                                                                  │
│   5. First API Call                    6. Dashboard             │
│      (in-playground)                 (post-first-call)          │
│   ┌──────────────┐                     ┌──────────────┐         │
│   │              │                     │              │         │
│   │  {           │     → Click →       │  Success!    │         │
│   │   "model":   │                     │  You're in!  │         │
│   │   "messages"│                     │  [View       │         │
│   │  }           │                     │   Usage]     │         │
│   └──────────────┘                     └──────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Welcome Screen (Post-Signup Redirect)

**URL:** `/welcome` (redirects to `/dashboard` after completion)

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   LOGO                                                           │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                                                          │  │
│   │   Welcome to Slancha!                                    │  │
│   │                                                          │  │
│   │   Let's get your first inference endpoint set up.        │  │
│   │   This takes about 2 minutes.                            │  │
│   │                                                          │  │
│   │   ┌──────────────────────────────────────────────────┐  │  │
│   │   │  What's your primary use case?                   │  │  │
│   │   │                                                  │  │  │
│   │   │  ○ Chatbot / Customer Support                    │  │  │
│   │   │  ○ Content Generation (blogs, marketing)         │  │  │
│   │   │  ○ Code Assistant / Developer Tools              │  │  │
│   │   │  ○ Data Analysis / Insights                      │  │  │
│   │   │  ○ Other                                         │  │  │
│   │   │                                                  │  │  │
│   │   │  [Continue →]                                    │  │  │
│   │   └──────────────────────────────────────────────────┘  │  │
│   │                                                          │  │
│   │   Already know what you need?                            │  │
│   │   [Skip Setup →]                                         │  │
│   │                                                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components

**Header:**
- Logo centered, 48px height
- Margin top: 60px
- Background: `#121212` (site background)

**Card:**
- Background: `#1F1F1F`
- Border: `1px solid #262626`
- Border-radius: `12px`
- Padding: `40px`
- Max-width: `500px`
- Margin: `0 auto`
- Shadow: `0 4px 16px rgba(0,0,0,0.3)`

**Heading:**
- Font: H2, 32px, weight 700
- Color: `#E5E7EB`
- Text-align: center
- Margin bottom: `16px`

**Subheading:**
- Font: Body, 16px, weight 400
- Color: `#A0AEC0`
- Text-align: center
- Margin bottom: `32px`

**Use Case Options:**
- Radio buttons with custom styling
- Each option: 100% width, padding `16px`, border-radius `8px`
- Hover: Background `#262626`
- Selected: Border `2px solid #0A84FF`, background `#1A1A2E`
- Text: 16px, weight 500, color `#E5E7EB`
- Margin between options: `12px`

**Continue Button:**
- Background: `linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)`
- Color: `#FFFFFF`
- Padding: `14px 32px`
- Border-radius: `8px`
- Width: `100%`
- Margin top: `24px`
- Font: Semibold, 16px
- Hover: Slight lift, shadow
- Disabled state: Gray, no hover effect

**Skip Link:**
- Text: "Skip Setup →"
- Color: `#0A84FF`
- Underline on hover
- Text-align: center
- Margin top: `24px`
- Font: Regular, 14px

### Microinteractions
- Radio selection: Smooth border transition (200ms)
- Continue button: Loading spinner after click
- Skip link: Underline animation on hover

---

## Step 2: Quick Setup (Guided Tour)

**URL:** `/setup/use-case`

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   < Back to Welcome        Quick Setup                          │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                                                          │  │
│   │   Tell us about your workload                            │  │
│   │                                                          │  │
│   │   ┌──────────────────────────────────────────────────┐  │  │
│   │   │  Use Case (required)                             │  │  │
│   │   │  ┌────────────────────────────────────────────┐  │  │  │
│   │   │  │ Chatbot / Customer Support           ▼     │  │  │  │
│   │   │  └────────────────────────────────────────────┘  │  │  │
│   │   │                                                  │  │  │
│   │   │  Typical monthly request volume                  │  │  │
│   │   │  ┌────────────────────────────────────────────┐  │  │  │
│   │   │  │ <10K requests / month                ▼     │  │  │  │
│   │   │  └────────────────────────────────────────────┘  │  │  │
│   │   │                                                  │  │  │
│   │   │  Priority                                        │  │  │
│   │   │  ☑ Cost optimization                             │  │  │
│   │   │  ☐ Lowest latency                                │  │  │
│   │   │  ☐ Highest accuracy                              │  │  │
│   │   │                                                  │  │  │
│   │   │  [← Back]        [Continue →]                    │  │  │
│   │   └──────────────────────────────────────────────────┘  │  │
│   │                                                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Form Fields

**Use Case Dropdown:**
- Type: Select (required)
- Options:
  - Chatbot / Customer Support
  - Content Generation (blogs, marketing)
  - Code Assistant / Developer Tools
  - Data Analysis / Insights
  - Research / Analysis
  - Other

**Volume Dropdown:**
- Type: Select
- Options:
  - <10K requests / month
  - 10K - 100K requests / month
  - 100K - 1M requests / month
  - 1M - 10M requests / month
  - 10M+ requests / month

**Priority Checkboxes:**
- Max 2 selections allowed
- Labels:
  - Cost optimization (default: checked)
  - Lowest latency
  - Highest accuracy

### Navigation

**Back Button:**
- Text: "← Back"
- Background: Transparent
- Border: `1px solid #262626`
- Color: `#A0AEC0`
- Padding: `12px 24px`
- Border-radius: `8px`
- Margin right: `16px`

**Continue Button:**
- Same as Welcome screen button
- Disabled until use case is selected

### Microinteractions
- Dropdown: Smooth expand, 150ms
- Checkboxes: Smooth toggle animation
- Continue button: Validates all required fields

---

## Step 3: First Endpoint Creation

**URL:** `/setup/endpoint`

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   < Back to Setup        Create Your First Endpoint             │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                                                          │  │
│   │   Your endpoint will be:                                 │  │
│   │   https://api.slancha.ai/v1/endpoint/your-endpoint-name  │
│   │                                                          │
│   │   ┌──────────────────────────────────────────────────┐  │  │
│   │   │  Endpoint name (required)                        │  │  │
│   │   │  ┌────────────────────────────────────────────┐  │  │  │
│   │   │  │ my-first-endpoint              [●]         │  │  │  │
│   │   │  └────────────────────────────────────────────┘  │  │  │
│   │   │                                                  │  │  │
│   │   │  Region                                          │  │  │
│   │   │  ┌────────────────────────────────────────────┐  │  │  │
│   │   │  │ us-east-1 (N. Virginia)            ▼       │  │  │  │
│   │   │  └────────────────────────────────────────────┘  │  │  │
│   │   │                                                  │  │  │
│   │   │  Base model                                      │  │  │
│   │   │  ┌────────────────────────────────────────────┐  │  │  │
│   │   │  │ Recommended (auto-selected)          ▼     │  │  │  │
│   │   │  └────────────────────────────────────────────┘  │  │  │
│   │   │                                                  │  │  │
│   │   │  ℹ️  We'll auto-select the best model based     │  │  │
│   │   │     on your use case. You can change this later. │  │  │
│   │   │                                                  │  │  │
│   │   │  [← Back]             [Create Endpoint →]        │  │  │
│   │   └──────────────────────────────────────────────────┘  │
│   │                                                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Form Fields

**Endpoint Name Input:**
- Type: Text (required)
- Placeholder: "my-first-endpoint"
- Auto-generate from previous use case (e.g., "chatbot-support")
- Validation: Alphanumeric + hyphens only, 3-50 chars
- Error state: Red border, inline error message

**Region Dropdown:**
- Type: Select
- Options:
  - us-east-1 (N. Virginia) — Recommended
  - us-west-2 (Oregon)
  - eu-west-1 (Ireland)
  - asia-southeast-1 (Singapore)
- Default: us-east-1

**Base Model Dropdown:**
- Type: Select
- Options:
  - Recommended (auto-selected based on use case)
  - GPT-4 Turbo
  - Llama-3-70B
  - Mistral-Large
  - Claude-3
- Default: "Recommended"
- Help text below: "We'll auto-select the best model based on your use case. You can change this later."

### Recommended Model Logic (based on use case):
- **Chatbot:** GPT-4 Turbo (best conversation quality)
- **Content Generation:** Llama-3-70B (creative writing, cost-effective)
- **Code Assistant:** Llama-3-70B (strong code understanding)
- **Data Analysis:** Claude-3 (best reasoning)
- **Other:** GPT-4 Turbo (safe default)

### Navigation

**Back Button:**
- Same as previous step

**Create Endpoint Button:**
- Text: "Create Endpoint →"
- Same styling as previous continue buttons
- On click: Shows loading state, creates endpoint via API
- On success: Redirects to Step 4

### Microinteractions
- Input: Real-time validation, character counter
- Button: Loading spinner with "Creating endpoint..."
- Success: Brief success animation, auto-redirect

---

## Step 4: API Credentials Display

**URL:** `/setup/credentials`

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   < Back to Setup        Your API Credentials                   │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                                                          │  │
│   │   ✅ Endpoint created successfully!                      │  │
│   │                                                          │  │
│   │   Your endpoint URL:                                     │  │
│   │   https://api.slancha.ai/v1/endpoint/your-endpoint-name  │
│   │                                                          │  │
│   │   ───────────────────────────────────────────────────    │  │
│   │                                                          │  │
│   │   API Key (keep this secret!):                           │  │
│   │   ┌──────────────────────────────────────────────────┐  │  │
│   │   │ sk-live_abc123def456ghi789jkl012mno345pqr678   [📋]│  │  │
│   │   │                    ***********                 │  │  │
│   │   └──────────────────────────────────────────────────┘  │  │
│   │                                                          │  │
│   │   [Copy Full Key]                                        │  │
│   │                                                          │  │
│   │   ───────────────────────────────────────────────────    │  │
│   │                                                          │  │
│   │   Quick Test                                             │  │
│   │   ┌──────────────────────────────────────────────────┐  │  │
│   │   │ curl -X POST https://api.slancha.ai/v1/...       │  │  │
│   │   │   -H "Authorization: Bearer sk-live_..."         │  │  │
│   │   │   -H "Content-Type: application/json"            │  │  │
│   │   │   -d '{"model": "auto", "messages": [...]}'.     │  │  │
│   │   └──────────────────────────────────────────────────┘  │  │
│   │                                                          │  │
│   │   [Test with cURL]         [← Back to Setup]             │  │
│   │                                                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components

**Success Message:**
- Icon: Green checkmark (✓), 48px
- Text: "Endpoint created successfully!"
- Color: `#4ade80` (green)
- Font: Semibold, 18px
- Margin bottom: `24px`

**Endpoint URL Display:**
- Background: `#1A1A2E`
- Padding: `16px`
- Border-radius: `8px`
- Font: Monospace, 14px
- Color: `#A0AEC0`
- Margin bottom: `24px`

**API Key Field:**
- Background: `#1A1A2E`
- Border: `1px solid #262626`
- Border-radius: `8px`
- Padding: `16px`
- Font: Monospace, 14px
- Color: `#E5E7EB`
- Truncated display: Show first 30 chars + asterisks
- Copy button: Icon button on right
- Margin bottom: `12px`

**Copy Full Key Button:**
- Text: "Copy Full Key"
- Icon: Clipboard (📋)
- Background: Transparent
- Border: `1px solid #262626`
- Color: `#A0AEC0`
- Padding: `12px 24px`
- Border-radius: `8px`
- Width: `100%`
- Hover: Background `#262626`

**Separator:**
- Text: "─" repeated 60 times
- Color: `#262626`
- Margin: `24px 0`

**cURL Snippet Box:**
- Background: `#0A0A14`
- Border: `1px solid #262626`
- Border-radius: `8px`
- Padding: `16px`
- Font: Monospace, 12px
- Color: `#A0AEC0`
- Syntax highlighting:
  - Strings: `#A5D6FF` (blue)
  - Keys: `#82AAFF` (purple)
  - Comments: `#6B737E` (gray)

**Quick Actions:**
- Layout: Flex row, space-between
- Buttons:
  - "Test with cURL" — Primary button
  - "← Back to Setup" — Secondary button

### Microinteractions
- Copy button: Shows "Copied!" tooltip for 2s
- Copy Full Key: Shows success feedback
- Test with cURL: Opens playground with pre-filled request

---

## Step 5: First API Call (Playground)

**URL:** `/setup/playground` (or `/playground?endpoint=your-endpoint-name`)

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   < Back to Setup        API Playground                         │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                                                          │  │
│   │   Test your endpoint with a real API call                │  │
│   │                                                          │  │
│   │   ┌──────────────────────────────────────────────────┐  │  │
│   │   │ Request                                          │  │  │
│   │   │ ┌────────────────────────────────────────────┐  │  │  │
│   │   │ │ {                                           │  │  │  │
│   │   │ │   "model": "auto",                          │  │  │  │
│   │   │ │   "messages": [                             │  │  │  │
│   │   │ │     {                                       │  │  │  │
│   │   │ │       "role": "user",                       │  │  │  │
│   │   │ │       "content": "Hello, how can you help? │  │  │  │
│   │   │ │     }                                       │  │  │  │
│   │   │ │   ],                                        │  │  │  │
│   │   │ │   "temperature": 0.7                        │  │  │  │
│   │   │ │ }                                           │  │  │  │
│   │   │ └────────────────────────────────────────────┘  │  │  │
│   │   │                                                  │  │  │
│   │   │   [Clear]                   [▶ Send Request]     │  │  │
│   │   │                                                  │  │  │
│   │   │ ───────────────────────────────────────────      │  │  │
│   │   │                                                  │  │  │
│   │   │ Response (247ms)                                 │  │  │
│   │   │ ┌────────────────────────────────────────────┐  │  │  │
│   │   │ │ {                                           │  │  │  │
│   │   │ │   "content": "Hello! I'm here to help...   │  │  │  │
│   │   │ │   "model": "llama-3-70b",                  │  │  │  │
│   │   │ │   "usage": {                               │  │  │  │
│   │   │ │     "prompt_tokens": 12,                   │  │  │  │
│   │   │ │     "completion_tokens": 47,               │  │  │  │
│   │   │ │     "total_tokens": 59                     │  │  │  │
│   │   │ │   }                                         │  │  │  │
│   │   │ │ }                                           │  │  │  │
│   │   │ └────────────────────────────────────────────┘  │  │  │
│   │   │                                                  │  │  │
│   │   │   Cost: $0.00012 · 247ms · 59 tokens             │  │  │
│   │   │                                                  │  │  │
│   │   │   [View in Dashboard →]                          │  │  │
│   │   └──────────────────────────────────────────────────┘  │  │
│   │                                                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components

**Header:**
- Heading: "API Playground"
- Subheading: "Test your endpoint with a real API call"
- Color: `#A0AEC0`
- Margin bottom: `24px`

**Request Box:**
- Background: `#0A0A14`
- Border: `1px solid #262626`
- Border-radius: `8px`
- Padding: `16px`
- Font: Monospace, 14px
- Syntax highlighting (JSON):
  - Keys: `#82AAFF` (purple)
  - Strings: `#A5D6FF` (blue)
  - Numbers: `#D3869B` (pink)
  - Booleans: `#FF79C6` (pink)

**Request Controls:**
- Layout: Flex row, space-between
- Buttons:
  - "Clear" — Secondary button
  - "▶ Send Request" — Primary button

**Response Box:**
- Background: `#0A0A14`
- Border: `1px solid #4ade80` (green border on success)
- Border-radius: `8px`
- Padding: `16px`
- Font: Monospace, 14px
- Shows automatically after first request

**Response Metadata:**
- Layout: Flex row, space-between
- Text: "Cost: $0.00012 · 247ms · 59 tokens"
- Color: `#A0AEC0`
- Font: 12px, regular

**View Dashboard Link:**
- Text: "View in Dashboard →"
- Color: `#0A84FF`
- Underline on hover
- Text-align: center
- Margin top: `16px`

### Microinteractions
- Send Request:
  - Shows loading spinner
  - Displays "Sending..." state
  - On success: Green border, response appears
  - On error: Red border, error message
- Clear: Resets request box to default template
- Response timing: 200-500ms simulated delay for demo

---

## Step 6: Dashboard (Post-First-Call)

**URL:** `/dashboard`

### Layout (minimal — just the success banner)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Navigation Bar                                                 │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                                                          │  │
│   │   🎉 Congratulations!                                    │  │
│   │                                                          │  │
│   │   You've made your first API call!                       │  │
│   │                                                          │  │
│   │   Here's what's happening behind the scenes:             │  │
│   │                                                          │  │
│   │   ┌──────────────────────────────────────────────────┐  │  │
│   │   │  1. Request routed to optimal model              │  │  │
│   │   │     Your query was classified as "general chat"  │  │  │
│   │   │     and routed to Llama-3-70B (best cost/perf)   │  │  │
│   │   │                                                  │  │  │
│   │   │  2. Response captured for fine-tuning            │  │  │
│   │   │     Your interaction is now part of eval data    │  │  │
│   │   │     that will improve your future responses      │  │  │
│   │   │                                                  │  │  │
│   │   │  3. Cost optimization applied                    │  │  │
│   │   │     This request cost $0.00012 vs $0.00085       │  │  │
│   │   │     with direct API access                       │  │  │
│   │   └──────────────────────────────────────────────────┘  │  │
│   │                                                          │  │
│   │   [Explore Dashboard]         [See How It Works →]       │  │
│   │                                                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components

**Success Banner:**
- Same styling as previous success cards
- Icon: 🎉 (confetti emoji) or checkmark
- Margin bottom: `24px`

**Explanation Cards (3-column grid):**
- Background: `#1F1F1F`
- Border: `1px solid #262626`
- Border-radius: `8px`
- Padding: `20px`
- Icon: 1. 🔄 2. 📊 3. 💰
- Heading: Semibold, 16px
- Body: Regular, 14px, `#A0AEC0`

**Action Buttons:**
- Layout: Flex row, space-between
- "Explore Dashboard" — Primary button
- "See How It Works →" — Secondary button (links to docs)

---

## Wireframe Notes

### Overall Flow Principles

1. **Progressive Disclosure:** Don't overwhelm users with all options at once. Show only what's needed for the next step.

2. **Contextual Help:** Every field should have help text or tooltips explaining what it means.

3. **Visual Feedback:** Every action should have immediate visual feedback (loading states, success indicators, error messages).

4. **Breadcrumbs:** Each screen shows where you are in the flow (e.g., "Step 3 of 5: Create Endpoint").

5. **Escape Hatches:** Always allow users to skip the setup and explore the dashboard manually.

6. **Mobile Responsive:** All steps should work on mobile (stack vertically, simplify forms).

### Color Coding for Steps

| Step | Accent Color | Visual Cue |
|------|-------------|------------|
| 1. Welcome | `#0A84FF` (blue) | Introductory, friendly |
| 2. Quick Setup | `#0A84FF` (blue) | Form-focused |
| 3. Endpoint Creation | `#0A84FF` (blue) | Technical setup |
| 4. Credentials | `#00D1B2` (teal) | Success state |
| 5. Playground | `#00D1B2` (teal) | Interactive demo |
| 6. Dashboard | `#4ade80` (green) | Completion |

### Progress Indicator

Show a visual progress bar on each step (except welcome):

```
┌──────────────────────────────────────────────────────────────────┐
│  Progress: [███░░░░░░░░░░░░░░░░░░] 40%                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

### Desktop (>1024px)
- Card max-width: 600px
- Side-by-side layouts where appropriate
- Comfortable spacing

### Tablet (768px - 1024px)
- Card max-width: 100% with padding
- Stack form fields vertically
- Simplified navigation

### Mobile (<768px)
- Full-screen cards
- Larger touch targets (min 44px)
- Horizontal scrolling for cURL snippets
- Accordion for multi-step flows

---

## QA Checklist

- [ ] All 6 steps render correctly
- [ ] Form validation works on all inputs
- [ ] Back navigation preserves entered data
- [ ] Progress bar updates correctly
- [ ] Copy-to-clipboard works on all key displays
- [ ] API call simulation works (success + error states)
- [ ] Mobile responsive on all breakpoints
- [ ] Keyboard navigation works (Tab, Enter, Arrow keys)
- [ ] All buttons have proper hover states
- [ ] Loading states show during async operations
- [ ] Error messages are clear and actionable
- [ ] URLs are shareable with state preserved
- [ ] LocalStorage saves progress for re-entry
- [ ] Analytics events fire on step completion

---

## Deliverables

1. **This spec file** — Detailed wireframes for all 6 steps
2. **Interactive prototype** — Figma link (if available) or HTML mockups
3. **Component library** — Reusable form components for Frontend
4. **QA test cases** — Checklist above

---

*Spec ready for Frontend implementation.*

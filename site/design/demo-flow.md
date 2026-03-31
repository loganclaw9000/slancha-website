# Demo Flow Design Spec - Interactive Product Walkthrough

## Purpose
Create an interactive, self-guided demo experience that walks visitors through Slancha's 5-step platform flow: Signup → First Eval → Route Deployment → Fine-tuning → Metrics Dashboard. This replaces static screenshots with an interactive "show, don't tell" experience.

## Layout Overview
- Full-width hero with compelling headline and demo entry CTA
- Interactive demo container with side navigation
- 5-step walkthrough with guided tooltips and animations
- Sticky sidebar showing progress and allowing quick navigation
- Full-page or embedded demo mode toggle
- Dark tech aesthetic matching site design system

---

## Component Structure

### Page Header
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   See Slancha in Action                                  │
│                                                          │
│   Experience the platform that evaluates, routes,        │
│   and auto-finetunes your models. No setup required.     │
│                                                          │
│              [▶ Try Interactive Demo]                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Title:** "See Slancha in Action"
- Font: H1, 48px, bold
- Color: `#ffffff`
- Text-align: center
- Margin bottom: 16px

**Subtitle:** "Experience the platform that evaluates, routes, and auto-finetunes your models. No setup required."
- Font: Body, 18px, regular
- Color: `#b0b0b0`
- Text-align: center
- Margin bottom: 48px

**Primary CTA Button:** "[▶ Try Interactive Demo]"
- Font: Body semibold, 16px
- Background: `linear-gradient(135deg, #4a9eff 0%, #3a7bd5 100%)`
- Text color: `#ffffff`
- Border-radius: 8px
- Padding: 16px 32px
- Icon: Play triangle (▶)
- Hover: Slight lift effect (transform: translateY(-2px)), shadow
- Margin: 0 auto (centered)

---

## Demo Container Layout

Two modes available:

### Mode 1: Embedded Demo (Page Default)
```
┌──────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Demo Mode: [● Embedded] [⊞ Fullscreen]              │ │
│ ├──────────────────┬───────────────────────────────────┤ │
│ │                  │                                   │ │
│ │  STEPS           │   DEMO INTERFACE                  │ │
│ │  ─────────       │   (Interactive platform mock)     │ │
│ │                  │                                   │ │
│ │  ○ Step 1        │   ┌───────────────────────────┐   │ │
│ │  ● Step 2        │   │  Evaluation Dashboard     │   │ │
│ │  ○ Step 3        │   │  [Metrics, Charts, Data]  │   │ │
│ │  ○ Step 4        │   └───────────────────────────┘   │ │
│ │  ○ Step 5        │                                   │ │
│ │                  │                                   │ │
│ │  [< Prev]        │   [Next Step →]                   │ │
│ │  [Reset Demo]    │                                   │ │
│ │                  │                                   │ │
│ └──────────────────┴───────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Mode 2: Fullscreen Demo (Overlay)
```
┌──────────────────────────────────────────────────────────┐
│  ▲ Exit Fullscreen   Demo Mode: Fullscreen              │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  STEPS   │                                          │ │
│ │  ─────   │   FULL-SCREEN DEMO INTERFACE             │ │
│ │  ○ 1     │   (Same content, no distractions)        │ │
│ │  ● 2     │                                          │ │
│ │  ○ 3     │                                          │ │
│ │  ○ 4     │                                          │ │
│ │  ○ 5     │                                          │ │
│ │          │                                          │ │
│ │  [<]     │                                          │ │
│ │  [→]     │                                          │ │
│ └──────────┴──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Demo Container:**
- Border: `1px solid #333344`
- Background: `#0f0f1a` (same as site background) or `#1a1a2e` (darker card)
- Border-radius: 16px
- Padding: 32px
- Shadow: `0 8px 32px rgba(0, 0, 0, 0.4)`
- Max-width: 1400px (on large screens), 100% on mobile
- Margin: 0 auto

**Demo Controls Bar:**
- Position: Top of demo container
- Background: `#1a1a2e`
- Padding: 12px 24px
- Border-bottom: `1px solid #333344`
- Border-radius: 16px 16px 0 0
- Flex layout: Space-between

---

## Side Navigation (Steps Panel)

```
┌──────────────────┐
│  DEMO STEPS      │
│  ───────────     │
│                  │
│  1               │
│  SIGNUP          │
│  ─────────────   │
│  ⚡ 30 sec       │
│                  │
│  2 (active)      │
│  FIRST EVAL      │
│  ─────────────   │
│  📊 Run eval     │
│                  │
│  3               │
│  ROUTE DEPLOY    │
│  ─────────────   │
│  🚀 Deploy       │
│                  │
│  4               │
│  AUTO FINE-TUNE  │
│  ─────────────   │
│  🎯 Train model  │
│                  │
│  5               │
│  METRICS DASH    │
│  ─────────────   │
│  📈 Monitor perf │
│                  │
│                  │
│  [⟳ Reset Demo] │
└──────────────────┘
```

### Step Item Component

#### Inactive Step
```
┌──────────────────────────┐
│  1                       │
│  SIGNUP                  │
│  ─────────────           │
│  ⚡ 30 sec               │
└──────────────────────────┘
```

**Styling:**
- Padding: 16px
- Border-radius: 8px
- Background: transparent
- Cursor: pointer
- Hover: Background `#1a1a2e`

**Number:**
- Font: Bold, 14px
- Color: `#666688`
- Margin bottom: 8px

**Title:**
- Font: Semibold, 12px (all caps)
- Color: `#8888aa`
- Margin bottom: 8px

**Description:**
- Font: Body, 12px
- Color: `#666688`
- Icon: Small emoji or SVG

---

#### Active Step (Selected)
```
┌──────────────────────────┐
│  2                       │
│  FIRST EVAL              │
│  ─────────────           │
│  📊 Run eval             │
└──────────────────────────┘
```

**Styling:**
- Background: `linear-gradient(135deg, rgba(74, 158, 255, 0.15) 0%, rgba(74, 158, 255, 0.05) 100%)`
- Border: `1px solid #4a9eff`
- Left border accent: `3px solid #4a9eff`
- Number color: `#4a9eff`
- Title color: `#ccccff`
- Active state indicator visible

---

#### Completed Step
```
┌──────────────────────────┐
│  ✓                       │
│  SIGNUP                  │
│  ─────────────           │
│  ⚡ 30 sec               │
└──────────────────────────┘
```

**Styling:**
- Same as inactive
- Number replaced with checkmark icon (✓)
- Color: `#4a9eff`

---

## Step Content Area

Each step displays the corresponding platform interface with guided annotations.

### Step 1: Sign Up (30 seconds)

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────┐ │
│  │  Slancha                                       │ │
│  ├────────────────────────────────────────────────┤ │
│  │                                                │ │
│  │   Create your free account                     │ │
│  │                                                │ │
│  │   Email                                         │ │
│  │   ┌────────────────────────────────────────┐   │ │
│  │   │ john@company.com          [●]          │   │ │
│  │   └────────────────────────────────────────┘   │ │
│  │                                                │ │
│  │   API Key (optional)                           │ │
│  │   ┌────────────────────────────────────────┐   │ │
│  │   │ sk-...______________________ [●]       │   │ │
│  │   └────────────────────────────────────────┘   │ │
│  │                                                │ │
│  │   [Create Account & Continue →]                │ │
│  │                                                │ │
│  │   Already have an account? Sign in             │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Guided Annotations:**
- **Tooltip 1:** "Free tier includes 10,000 eval requests/month"
  - Position: Bottom-right of card
  - Arrow pointing to "Create Account" button
  - Background: `#2a2a4a`
  - Text: `#ffffff`
  - Padding: 12px
  - Border-radius: 8px

- **Tooltip 2:** "Import existing API keys from OpenAI, Anthropic, or other providers"
  - Position: Top-right, pointing to API key field
  - Same styling as above

**Microinteractions:**
- Input focus: Border glow `#4a9eff`, 2px
- Button hover: Slight scale (1.02), shadow lift
- Form validation: Red border + inline error message

**Button:** "Create Account & Continue →"
- Background: `linear-gradient(135deg, #4a9eff 0%, #3a7bd5 100%)`
- Full width
- Padding: 14px
- Border-radius: 8px

---

### Step 2: First Evaluation

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  Slancha / Evaluations                               │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  New Evaluation                                │ │
│  │                                                │ │
│  │  Dataset                                       │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │ select-dataset...    ▼                   │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │                                                │ │
│  │  Model                                         │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │ gpt-4-turbo            ▼                 │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │                                                │ │
│  │  Metrics to evaluate                           │ │
│  │  ☑ Helpfulness    ☑ Honesty                   │ │
│  │  ☑ Safety         ☑ Fluency                   │ │
│  │                                                │ │
│  │  [▶ Run Evaluation]                            │ │
│  │                                                │ │
│  │  ─────────────────────────────────           │ │
│  │                                                │ │
│  │  📊 Latest Results                             │ │
│  │                                                │ │
│  │  Helpfulness: 87%  │  Honesty: 92%            │ │
│  │  Safety: 94%       │  Fluency: 89%            │ │
│  │                                                │ │
│  │  ┌────────────────────────────────────────┐   │ │
│  │  │  ████████████████░░░░░░░░ 87%          │   │ │
│  │  └────────────────────────────────────────┘   │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Guided Annotations:**
1. **Dataset selector** - "Choose from pre-curated eval datasets or upload your own (CSV, JSONL)"
2. **Model selector** - "Eval against any model: OpenAI, Anthropic, Llama, Mistral, or your fine-tunes"
3. **Metrics checkboxes** - "Select metrics aligned with your product goals: helpfulness, honesty, safety, fluency"
4. **Run button** - "Runs eval in 2-5 minutes. You'll get a notification when ready."
5. **Results section** - "Visual feedback shows which dimensions need improvement"

**Charts/Metrics Display:**
- Bar charts for each metric (4-column grid)
- Color coding: Green (>90%), Yellow (70-90%), Red (<70%)
- Values shown as both % and score (e.g., "87% (4.35/5)")
- Sparkline showing trend vs. previous eval

**Microinteractions:**
- Dataset dropdown: Smooth expand, 150ms
- Checkboxes: Smooth animation, custom checkbox styling
- Run button: Spinner animation while "running"
- Results: Staggered fade-in animation (200ms delay between bars)

---

### Step 3: Route Deployment

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  Slancha / Deployments                               │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Deploy Model                                  │ │
│  │                                                │ │
│  │  Select model to deploy                        │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │ gpt-4-turbo (eval-v20260331)   ▼        │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │                                                │ │
│  │  Router Configuration                          │ │
│  │                                                │ │
│  │  ☑ Enable Semantic Router                      │ │
│  │    Routes to best model based on query intent  │ │
│  │                                                │ │
│  │  ☑ Enable Cost Optimization                    │ │
│  │    Automatically routes cheap queries to       │ │
│  │    smaller, cheaper models                     │ │
│  │                                                │ │
│  │  Deployment target                             │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │ Production (us-east-1)         ▼         │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │                                                │ │
│  │  [🚀 Deploy to Production]                     │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ─────────────────────────────────────────         │ │
│                                                      │
│  📈 Live Metrics (142 req/min)                      │ │
│                                                      │
│  Cost per 1K tokens: $0.42  (-43% vs direct)        │ │
│  P99 latency: 847ms                                   │ │
│  Router accuracy: 94%                                 │ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Guided Annotations:**
1. **Model selector** - "Deploy any evaluated model with one click. See eval results before deploying."
2. **Semantic Router checkbox** - "Aurelio Semantic Router routes each query to the best model automatically. No prompt engineering needed."
3. **Cost Optimization checkbox** - "Intelligent routing sends simple queries to cheaper models (e.g., Llama 3 8B), complex queries to premium models (e.g., GPT-4)."
4. **Deploy button** - "Deployment takes 30-60 seconds. You'll receive a dedicated endpoint URL."

**Live Metrics Section:**
- Background: `#1a1a2e`
- Border: `1px solid #2a2a4a`
- Border-radius: 8px
- Padding: 16px
- Grid layout: 3 columns
- Metric cards:
  - Icon (left): Small SVG
  - Value (primary): Bold, large font (24px)
  - Label (secondary): Regular, muted color
  - Trend indicator: Green arrow + % (if improvement)

**Microinteractions:**
- Checkboxes: Smooth toggle, custom styling
- Deploy button: Loading state with spinner + "Deploying..."
- Metrics: Pulse animation (1s interval) to show "live" status

---

### Step 4: Auto Fine-Tuning

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  Slancha / Fine-Tuning                               │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Auto Fine-Tuning Pipeline                     │ │
│  │                                                │ │
│  │  Slancha automatically improves your model     │ │
│  │  based on evaluation data.                     │ │
│  │                                                │ │
│  │  ┌────────────────────────────────────────┐   │ │
│  │  │ 1. Analyze eval data                   │   │ │
│  │  │    Found: 847 samples needing safety   │   │ │
│  │  │    improvement, 423 for helpfulness    │   │ │
│  │  └────────────────────────────────────────┘   │ │
│  │                  ↓                             │ │
│  │  ┌────────────────────────────────────────┐   │ │
│  │  │ 2. Curate training dataset             │   │ │
│  │  │    Generated: 1,274 high-quality       │   │ │
│  │  │    training pairs from eval data       │   │ │
│  │  └────────────────────────────────────────┘   │ │
│  │                  ↓                             │ │
│  │  ┌────────────────────────────────────────┐   │ │
│  │  │ 3. Fine-tune smaller model             │   │ │
│  │  │    Training: Llama-3-8B for 2 hours    │   │ │
│  │  │    QAT enabled, MIG on H100            │   │ │
│  │  └────────────────────────────────────────┘   │ │
│  │                  ↓                             │ │
│  │  ┌────────────────────────────────────────┐   │ │
│  │  │ 4. Evaluate fine-tuned model           │   │ │
│  │  │    Safety: 97% (+3%)                   │   │ │
│  │  │    Helpful: 91% (+4%)                  │   │ │
│  │  │    Cost: $0.12/K vs $0.85/K            │   │ │
│  │  └────────────────────────────────────────┘   │ │
│  │                  ↓                             │ │
│  │  ┌────────────────────────────────────────┐   │ │
│  │  │ 5. Auto-promote to router              │   │ │
│  │  │    New model available in 2 minutes    │   │ │
│  │  └────────────────────────────────────────┘   │ │
│  │                                                │ │
│  │  [▶ Start Auto Fine-Tune]                      │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Guided Annotations:**
1. **Pipeline visualization** - "The entire loop: analyze → curate → train → evaluate → deploy. Fully automated, zero manual work."
2. **Step 1 (Analysis)** - "NLP analysis identifies patterns in eval failures: '847 samples showing safety issues in technical queries'"
3. **Step 2 (Curate)** - "Automatically generates high-quality training pairs from eval data. No labeling needed."
4. **Step 3 (Fine-tune)** - "Uses QAT (quantization-aware training) and MIG on B200/B300 GPUs. Fine-tunes smaller, cheaper models."
5. **Step 4 (Evaluate)** - "New model evaluated against same dataset. Must improve by 2%+ to be promoted."
6. **Step 5 (Auto-promote)** - "Approved models auto-added to semantic router. Old model still available for rollback."

**Pipeline Visualization:**
- Vertical timeline layout
- Each step in a card with arrow connecting them
- Step icons: 1. 🔍 2. 📚 3. ⚙️ 4. 📊 5. 🚀
- Active step: Accent color, slightly larger
- Completed steps: Green checkmark
- Incomplete steps: Muted, no border

**Microinteractions:**
- "Start Auto Fine-Tune" button:
  - Initial state: Normal button
  - Click: Opens modal showing progress
  - Progress modal:
    - Real-time progress bar
    - Current step highlighted
    - Estimated time remaining
    - "Pause" and "Cancel" options
- Pipeline steps: Hover to see detailed explanation tooltip

---

### Step 5: Metrics Dashboard

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  Slancha / Dashboard                                 │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Overview                                      │ │
│  │                                                │ │
│  │  ┌──────────────┐ ┌──────────────┐           │ │
│  │  │  Total Calls │ │  Success     │           │ │
│  │  │   2.4M      │ │    99.7%     │           │ │
│  │  │  +12% ↑     │ │  +0.2% ↑     │           │ │
│  │  └──────────────┘ └──────────────┘           │ │
│  │                                                │ │
│  │  ┌──────────────┐ ┌──────────────┐           │ │
│  │  │  Avg Cost    │ │  P99 Latency │           │ │
│  │  │   $0.42     │ │   847ms      │           │ │
│  │  │  -43% ↓     │ │  -12% ↓      │           │ │
│  │  └──────────────┘ └──────────────┘           │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Performance Trends (7 days)                   │ │
│  │                                                │ │
│  │  100% ┤     ╭───╮                              │ │
│  │       │    ╱     ╲   ╭───╮                    │ │
│  │   90% ┤   ╱       ╲ ╱     ╲                   │ │
│  │       │  ╱         ╲       ╲      ╭───╮       │ │
│  │   80% ┤ ╱           ╲       ╲    ╱     ╲     │ │
│  │       │ ╲           ╱        ╲  ╱       ╲    │ │
│  │   70% ┤  ╲         ╱          ╲╱         ╲  │ │
│  │       │   ╲──────╱              ──────────  │ │
│  │    60 └────┴────┴────┴────┴────┴────┴─────  │ │
│  │        M  T  W  T  F  S  S                   │ │
│  │                                                │ │
│  │  Legend: ── Eval Score  ··· Router Accuracy   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Model Distribution                            │ │
│  │                                                │ │
│  │  ┌────────────────────────────────────────┐   │ │
│  │  │  GPT-4 Turbo     ████████████  34%     │   │ │
│  │  │  Llama-3-70B       ███████  24%        │   │ │
│  │  │  Claude-3          ██████  19%         │   │ │
│  │  │  Mistral-Large     ████  13%           │   │ │
│  │  │  Fine-tuned 8B     ██  10%             │   │ │
│  │  └────────────────────────────────────────┘   │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Router Decisions (Last 24h)                   │ │
│  │                                                │ │
│  │  Simple queries    → Llama-3-8B (fine-tuned)  │ │
│  │  Tech support      → GPT-4 Turbo              │ │
│  │  Creative writing  → Claude-3                 │ │
│  │  Data analysis     → Llama-3-70B              │ │
│  │                                                │ │
│  │  [📊 View Detailed Logs]                       │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Guided Annotations:**
1. **KPI Cards** - "Real-time metrics showing the impact: 43% cost reduction, 12% latency improvement since using Slancha"
2. **Performance Trends Chart** - "Combined view of eval scores (solid line) and router accuracy (dotted). See correlation between fine-tuning and performance."
3. **Model Distribution** - "Traffic automatically distributed across models based on query complexity. Fine-tuned models handle simple queries, premium models handle complex ones."
4. **Router Decisions** - "Transparency into routing decisions. See exactly which queries go where and why."

**KPI Cards:**
- Grid: 4-column layout
- Card styling: Background `#1a1a2e`, border `1px solid #2a2a4a`, border-radius `12px`, padding `20px`
- Icon (top-left): Small SVG for context
- Value (primary): 32px, bold, `#ffffff`
- Label (secondary): 14px, `#8888aa`, uppercase
- Trend (bottom): Arrow icon + percentage, green/red coloring

**Performance Trends Chart:**
- Type: Line chart with area fill
- X-axis: Days (M T W T F S S)
- Y-axis: Percentage (60% - 100%)
- Lines:
  - Eval Score: Solid line, `#4a9eff`
  - Router Accuracy: Dotted line, `#4a9eff` with 30% opacity
- Hover: Show tooltip with exact values
- Legend: Below chart

**Model Distribution Bar Chart:**
- Horizontal bars
- Each bar: Model name, progress bar, percentage
- Progress bar gradient: `#4a9eff` to `#3a7bd5`
- Colors match model branding when possible

**Microinteractions:**
- Chart hover: Tooltip with exact values appears
- KPI card hover: Slight lift effect
- "View Detailed Logs" button: Full-page log viewer modal
- Time range selector: "7d" "30d" "90d" tabs (default: 7d)

---

## Navigation Controls

### Step Navigation Arrows
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   [⟵ Previous Step]              [Next Step ⟶]          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Previous Button:**
- Visible: Steps 2-5 (hidden on Step 1)
- Background: Transparent
- Border: `1px solid #333344`
- Text color: `#cccccc`
- Padding: 12px 24px
- Border-radius: 8px
- Hover: Background `#1a1a2e`, border `#4a9eff`
- Icon: Left arrow (⟵)

**Next Button:**
- Visible: Steps 1-4 (hidden on Step 5)
- Background: `linear-gradient(135deg, #4a9eff 0%, #3a7bd5 100%)`
- Text color: `#ffffff`
- Padding: 12px 24px
- Border-radius: 8px
- Hover: Slight lift, shadow
- Icon: Right arrow (⟶)

**Step 5 - Completion State:**
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   Your demo is complete!                                 │
│                                                          │
│   [⟵ Back to Step 4]         [Start Over]                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Start Over Button:**
- Reset all step progress
- Return to Step 1
- Same styling as Previous button

---

## Interaction Details

### Demo Progress Management
- **State persistence:** Save current step to localStorage
- **Keyboard navigation:** Left/Right arrow keys to navigate steps
- **URL hash:** Update URL with step number (`?step=3`) for shareability
- **Progress bar:** Top of demo container showing overall progress (0-100%)

### Progress Bar
```
┌──────────────────────────────────────────────────────────┐
│  Progress: ████░░░░░░░░░░░░░░░░░░░ 40%                  │
└──────────────────────────────────────────────────────────┘
```

- Height: 4px
- Background: `#2a2a4a`
- Progress fill: Gradient `#4a9eff` to `#3a7bd5`
- Percentage text: Right-aligned, 12px, `#8888aa`

### Transitions Between Steps
- **Slide animation:** Content slides from right to left (300ms)
- **Step indicator:** Active step highlights in side nav
- **Progress bar:** Smooth width transition (300ms)
- **Tooltip fade:** New tooltips fade in (200ms)

### Fullscreen Mode Toggle
```
┌──────────────────────────────────────────────────────────┐
│  ▲ Exit Fullscreen   Demo Mode: Fullscreen              │
└──────────────────────────────────────────────────────────┘
```

**Enter Fullscreen:**
- Hides page header
- Demo container takes full viewport
- Side nav collapses to compact icon strip
- Exit button visible at top-left

**Exit Fullscreen:**
- Returns to embedded mode
- Restores page header
- Side nav expands to full width

---

## Responsive Design

### Desktop (>1024px)
- Demo container: Max-width 1400px
- Side nav: 240px width
- Content area: Flex-grow, remaining width
- Comfortable spacing between elements

### Tablet (768px - 1024px)
- Demo container: 100% width with 20px padding
- Side nav: Collapses to icon-only strip (64px)
- Tooltips: Position dynamically to avoid overflow
- Charts: Stack vertically instead of grid

### Mobile (≤768px)
- Full-screen demo mode by default
- Side nav becomes bottom tab bar:
  ```
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │  [1] [2●] [3] [4] [5]                                    │
  │  S  F  R  A  M                                          │
  │                                                          │
  └──────────────────────────────────────────────────────────┘
  ```
- Step content: 100% width
- Charts: Stacked, simplified
- Tooltips: Full-screen overlays
- Navigation: Large touch targets (min 44px)

---

## Accessibility

### Keyboard Navigation
- **Tab:** Cycle through interactive elements
- **Arrow keys:** Navigate between steps (in fullscreen mode)
- **Enter/Space:** Activate buttons
- **Escape:** Exit fullscreen, close modals
- **Focus states:** 2px solid `#4a9eff`, outline-offset 2px

### Screen Reader
- **ARIA labels:** All buttons have descriptive labels
- **Progress announcements:** "Step 3 of 5: Route Deployment"
- **Live regions:** Update announcements for progress changes
- **Semantic HTML:** Use `<nav>`, `<main>`, `<section>` appropriately

### Color Contrast
- All text meets WCAG AA (4.5:1 minimum)
- Charts use patterns + colors (not color alone)
- Focus states clearly visible

---

## Visual Hierarchy

1. **Demo interface** - Primary focus, largest area
2. **Step navigation** - Secondary, clearly shows progress
3. **Guided tooltips** - Tertiary, appear on demand
4. **Progress bar** - Subtle but visible

---

## QA Checklist

- [ ] All 5 steps render correctly
- [ ] Step navigation arrows work
- [ ] Side nav highlights active step
- [ ] All tooltips appear and disappear correctly
- [ ] Keyboard navigation works (Tab, Arrow keys, Enter, Escape)
- [ ] Progress bar updates correctly
- [ ] Fullscreen toggle works
- [ ] URL hash updates with step number
- [ ] localStorage persists progress
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] Charts render correctly with hover states
- [ ] Microinteractions smooth (300ms transitions)
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader announcements correct
- [ ] All buttons have proper ARIA labels
- [ ] Reset demo function works

---

## Implementation Notes

### Component Structure
```
DemoPage/
├── DemoHeader/
│   ├── Title
│   ├── Subtitle
│   └── TryDemoCTA
├── DemoContainer/
│   ├── DemoControlsBar/
│   │   ├── ModeToggle (Embedded/Fullscreen)
│   │   └── ProgressBar
│   ├── SideNav/
│   │   └── StepItem (repeated 5x)
│   ├── StepContent/
│   │   ├── Step1: Signup
│   │   ├── Step2: First Eval
│   │   ├── Step3: Route Deploy
│   │   ├── Step4: Auto Fine-Tune
│   │   └── Step5: Metrics Dashboard
│   └── NavigationControls/
│       ├── PreviousButton
│       └── NextButton
└── TutorialTooltip (reusable component)
```

### Props (for StepItem)
```jsx
interface StepItemProps {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}
```

### Props (for TutorialTooltip)
```jsx
interface TutorialTooltipProps {
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  targetElementRef: React.RefObject<HTMLElement>;
  onClose?: () => void;
}
```

### CSS Variables to use
- `--bg-card`: `#1a1a2e`
- `--bg-overlay`: `#0f0f1a`
- `--border-color`: `#333344`
- `--text-primary`: `#ffffff`
- `--text-secondary`: `#cccccc`
- `--text-muted`: `#8888aa`
- `--accent-color`: `#4a9eff`
- `--success-color`: `#4ade80`
- `--warning-color`: `#fbbf24`
- `--danger-color`: `#f87171`

### Animation timings
- Slide transitions: `300ms ease-in-out`
- Fade in: `200ms ease-out`
- Progress bar: `300ms linear`
- Tooltip fade: `150ms ease-in-out`

---

## Notes for Copywriter

This spec assumes the following walkthrough text (from TASK-091):

**Step 1 - Signup:**
- "Free tier includes 10,000 eval requests/month"
- "Import existing API keys from OpenAI, Anthropic, or other providers"

**Step 2 - First Eval:**
- "Choose from pre-curated eval datasets or upload your own (CSV, JSONL)"
- "Eval against any model: OpenAI, Anthropic, Llama, Mistral, or your fine-tunes"
- "Select metrics aligned with your product goals: helpfulness, honesty, safety, fluency"
- "Runs eval in 2-5 minutes. You'll get a notification when ready."

**Step 3 - Route Deploy:**
- "Deploy any evaluated model with one click. See eval results before deploying."
- "Aurelio Semantic Router routes each query to the best model automatically. No prompt engineering needed."
- "Intelligent routing sends simple queries to cheaper models (e.g., Llama 3 8B), complex queries to premium models (e.g., GPT-4)."
- "Deployment takes 30-60 seconds. You'll receive a dedicated endpoint URL."

**Step 4 - Auto Fine-Tune:**
- "The entire loop: analyze → curate → train → evaluate → deploy. Fully automated, zero manual work."
- "NLP analysis identifies patterns in eval failures"
- "Automatically generates high-quality training pairs from eval data. No labeling needed."
- "Uses QAT (quantization-aware training) and MIG on B200/B300 GPUs. Fine-tunes smaller, cheaper models."
- "New model evaluated against same dataset. Must improve by 2%+ to be promoted."
- "Approved models auto-added to semantic router. Old model still available for rollback."

**Step 5 - Metrics Dashboard:**
- "Real-time metrics showing the impact: 43% cost reduction, 12% latency improvement since using Slancha"
- "Combined view of eval scores and router accuracy. See correlation between fine-tuning and performance."
- "Traffic automatically distributed across models based on query complexity."
- "Transparency into routing decisions. See exactly which queries go where and why."

---

## Completion Criteria

This spec is complete when:
- [ ] All 5 demo steps have detailed wireframes
- [ ] All guided annotations and tooltips are specified
- [ ] All microinteractions are documented
- [ ] Responsive breakpoints are defined
- [ ] Accessibility requirements are specified
- [ ] Implementation notes are clear for Frontend
- [ ] QA checklist is comprehensive
- [ ] Copywriter has provided walkthrough text (TASK-091)

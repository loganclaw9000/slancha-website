# Slancha Website

Marketing site + authenticated dashboard for [slancha.ai](https://slancha.ai). React + Vite, Supabase backend, Stripe billing.

## Quick Start

```bash
git clone git@github.com:SlanchaAi/slancha-website.git
cd slancha-website
cp .env.example .env
# Fill in .env values (see "Environment Variables" below)
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## Prerequisites

- Node.js >= 22 (tested on 22.22.1)
- npm >= 10
- Supabase CLI (`npm i -g supabase`) for local dev / migrations
- Playwright for E2E tests: `npx playwright install`

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Where to get it |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase Dashboard > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard > Settings > API |
| `VITE_BASE_URL` | Yes | `http://localhost:5173` for dev |
| `VITE_FORMSPREE_ID` | No | [formspree.io](https://formspree.io) (falls back to Supabase `contact_submissions` table) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | For billing | Stripe Dashboard > Developers > API Keys |
| `VITE_API_URL` | For billing | API server URL (enables Checkout Sessions) |
| `VITE_STRIPE_LINK_EVAL_DEPLOY` | Fallback | Stripe Payment Link for Eval+Deploy tier |
| `VITE_STRIPE_LINK_FULL_LOOP` | Fallback | Stripe Payment Link for Full Loop tier |
| `VITE_STRIPE_CUSTOMER_PORTAL_URL` | For billing | Stripe Billing Portal link |

### Test-only variables (optional)

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_TEST_URL` | Separate Supabase project for test isolation |
| `VITE_SUPABASE_TEST_ANON_KEY` | Test project anon key |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Service role key for seed/cleanup scripts |

## Supabase Setup

### Project info

- **Project ref:** `tqbvmmhgiivyjjcctqcb`
- **Dashboard:** https://supabase.com/dashboard/project/tqbvmmhgiivyjjcctqcb

### Connecting to the existing project

```bash
npx supabase login
npx supabase link --project-ref tqbvmmhgiivyjjcctqcb
```

### Running migrations on a new project

If starting fresh with a new Supabase project:

```bash
npx supabase db push
```

This applies all migrations in `supabase/migrations/` in order:

| Migration | What it does |
|---|---|
| 001_profiles | User profiles table |
| 001_api_keys | API keys table (early version) |
| 002_api_keys_and_usage | API keys + usage_logs tables |
| 003_usage_logs_extend | Adds endpoint, cost_cents, status_code to usage_logs |
| 004_subscriptions | Subscriptions + plan_limits tables |
| 005_webhooks | Webhooks table |
| 006_align_plan_tiers | Updates plan_limits data to match pricing |
| 007_stripe_checkout | Stripe-related schema (invoices, etc.) |
| 008_usage_tracking | Usage tracking improvements |
| 009_fix_plan_limits_indexes_drop_request_logs | Adds plan_limits SELECT policy, missing indexes, drops duplicate request_logs table |

### Database overview

24 tables in `public` schema. All have RLS enabled. Key tables:

- **profiles** - user profiles (FK to auth.users)
- **subscriptions** - billing state, Stripe IDs (one per user)
- **plan_limits** - plan tier definitions (free, eval-deploy, full-loop, self-hosted)
- **api_keys** - customer API keys (hashed)
- **usage_logs** - request logging (tokens, latency, cost)
- **deployments** - model deployment state
- **router_models** / **llm_providers** / **model_backends** - routing config
- **routing_decisions** - routing rules (JSONB)
- **fine_tuning_jobs** / **datasets** / **evaluations** - ML pipeline
- **optimization_stats** / **optimization_events** - optimization tracking
- **webhooks** - customer webhook endpoints
- **invoices** - billing history
- **team_members** / **team_invites** - org/team management
- **notifications** - in-app notifications
- **contact_submissions** - public contact form (anonymous INSERT allowed)
- **router_config_snapshots** - saved router YAML configs

### Connection pooling

Enabled in `supabase/config.toml` for local dev. Transaction mode, pool size 20, max 100 clients. The hosted project uses Supabase's built-in Supavisor pooler.

## Stripe Setup

### Edge Functions

Two Supabase Edge Functions handle Stripe:

| Function | JWT | Purpose |
|---|---|---|
| `stripe-checkout` | Required | Creates Checkout Sessions for subscription upgrades |
| `stripe-webhook` | Disabled (uses Stripe signature) | Handles subscription lifecycle events |

### Required secrets

Set these in the Supabase Dashboard (Settings > Edge Functions > Secrets) or via CLI:

```bash
npx supabase secrets set \
  STRIPE_SECRET_KEY=sk_live_xxx \
  STRIPE_WEBHOOK_SECRET=whsec_xxx
```

| Secret | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard > Developers > API Keys > Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard > Developers > Webhooks > Signing secret |

### Stripe webhook endpoint

Add in Stripe Dashboard > Developers > Webhooks:

- **URL:** `https://tqbvmmhgiivyjjcctqcb.supabase.co/functions/v1/stripe-webhook`
- **Events:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### Price mapping

The webhook function maps Stripe price amounts to plans:
- `$299/mo` -> `eval-deploy`
- `$999/mo` -> `full-loop`

Update `PRICE_TO_PLAN` in `supabase/functions/stripe-webhook/index.ts` after creating Stripe products, or rely on the amount-based fallback.

## Scripts

```bash
npm run dev              # Dev server (localhost:5173)
npm run build            # Production build (dist/)
npm run preview          # Preview production build (localhost:4173)

npm test                 # Run all tests (unit + component + E2E)
npm run test:unit        # Unit tests only
npm run test:components  # Component tests only
npm run test:e2e         # Playwright E2E tests
npm run test:db          # Database integration tests

npm run test:fixtures        # Seed test data
npm run test:fixtures:clean  # Clean up test data
```

## Project Structure

```
site/
  src/
    components/       # React components
      dashboard/      # Authenticated dashboard pages
    hooks/            # Custom React hooks (useAuth, useApiKeys, etc.)
    lib/
      supabase.js     # Supabase client init
    pages/            # Top-level page components
  copy/               # Marketing copy source files
  supabase/
    config.toml       # Supabase local dev config
    migrations/       # SQL migrations (applied in order)
    functions/
      stripe-checkout/ # Checkout Session edge function
      stripe-webhook/  # Webhook handler edge function
  dist/               # Built output (gitignored)
  __tests__/          # Vitest unit/component tests
  e2e/                # Playwright E2E tests
  scripts/            # Utility scripts (seed, cleanup, feeds)
```

## Deploying

The site is a static SPA. Build and deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

```bash
npm run build
# deploy dist/ folder
```

Analytics: Plausible (`data-domain="slancha.ai"` in index.html).

## Picking up on a new machine

1. Clone this repo
2. `npm install`
3. Copy `.env.example` to `.env`, fill in Supabase + Stripe values
4. `npx supabase login && npx supabase link --project-ref tqbvmmhgiivyjjcctqcb`
5. `npm run dev`

The Supabase project, edge functions, and database are already live -- you just need the env vars to connect.

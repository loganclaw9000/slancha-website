# AGENTS.md — Slancha Website

## What This Is
Static marketing site + authenticated dashboard for [Slancha](https://slancha.ai), an end-to-end AI inference platform. Single API endpoint that routes, fine-tunes, optimizes, and redeploys models automatically.

## Tech Stack
- **Framework:** React 18 + Vite
- **Routing:** React Router v6 (client-side SPA)
- **Backend:** Supabase (auth, database, edge functions)
- **Hosting:** GitHub Pages (static, SPA routing via 404.html copy)
- **Billing:** Stripe
- **Analytics:** Plausible
- **Testing:** Vitest (unit) + Playwright (E2E)

## Key Directories
- `src/pages/` — Route-level page components
- `src/components/` — Shared UI components
- `src/content/blog/index.js` — All blog posts (markdown in JS template literals)
- `src/content/docs/index.js` — All documentation (markdown in JS template literals)
- `src/hooks/` — Custom React hooks (Supabase data fetching)
- `src/lib/` — Utilities (supabase client, stripe, analytics)
- `public/` — Static assets copied to dist/ at build time
- `supabase/functions/` — Edge functions (stripe-checkout, stripe-webhook)
- `e2e/` — Playwright E2E test specs

## Content Architecture
Blog and docs content live as JavaScript arrays of objects with `body` fields containing markdown template literals. This is NOT MDX — it's raw JS with embedded markdown strings. When editing content, preserve the template literal backtick escaping.

## API
- **Base URL:** `https://api.slancha.ai/v1`
- **Auth:** Bearer token, `sk-sl_` prefix
- **Compatibility:** OpenAI-compatible (chat completions, models, etc.)
- **OpenAPI spec:** `public/openapi.yaml`
- **LLM index:** `public/llms.txt`

## Build & Deploy
```bash
npm ci
npm run build              # local build
GITHUB_PAGES=true npm run build  # GitHub Pages build (sets /slancha-website/ base path)
```
Deploy workflow: `.github/workflows/deploy-pages.yml` triggers on push to `master`.

## Environment Variables
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `VITE_API_URL` — API server URL (optional, for checkout sessions)
- `GITHUB_PAGES` — Set to `true` for GitHub Pages base path

## Testing
```bash
npm test                   # Vitest unit tests
npx playwright test        # E2E tests (starts preview server)
VITE_BASE_URL=https://loganclaw9000.github.io/slancha-website npx playwright test e2e/live-qa.spec.js --project=chromium  # Live site QA
```

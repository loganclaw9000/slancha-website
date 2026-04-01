---
lastCommit: c3c4e24
timestamp: 2026-04-01T07:35:00Z
---

# Site Notes

Recent changes and deployment notes.

## Latest Changes

**Commit:** `c3c4e24`  
**Date:** 2026-04-01 07:35 UTC

**QA: Updated bug status to 0 open bugs**

Verified all QA checks passing during heartbeat test run. Updated `qa/bugs.md` to reflect 0 open bugs and added verification notes for the contact form fallback behavior.

---

**Previous Changes**

**Commit:** `be47fec`  
**Date:** 2026-04-01 06:35 UTC

**Notifications Dashboard Complete (TASK-180)**

Built full Supabase integration for the Notifications dashboard:
- Created `useNotifications` hook with notifications table
- Added read/unread toggle with bell icon states
- Added action_url deep link navigation support
- Added notification_type color coding (eval/deploy/cost/finetune/route/webhook/info/warning/error/success)
- Added dismiss all action with confirmation
- Added dismiss single notification action
- Added date range filter with default 7-day window
- Added relative time formatting (Just now, 2 min ago, 1 hr ago, etc.)
- Added loading state and empty states

**Models & Routing Dashboard Complete (TASK-179)**

Built full Supabase integration for the Models & Routing dashboard:
- Created `useModels` hook with model_pool and optimization_events tables
- Added routing weight slider controls with real-time updates
- Added latency heatmap visualization (P50→P99 gradient)
- Added cost comparison bar chart (sorted cheapest→most expensive)
- Added optimization event log with event_type badges
- Added improvement percentage callouts with trend arrows
- Added model status toggle (active↔testing) and delete actions

**Previous Changes**

**Commit:** `22b15a4813d7af8a3adc4ee9f955a1a02d0423e8`  
**Date:** 2026-03-31 17:41 UTC

**Updated blog feed with new CFO guide article**

## Previous Changes

**Commit:** `22b15a4813d7af8a3adc4ee9f955a1a02d0423e8`  
**Date:** 2026-03-31 17:41 UTC

**Updated blog feed with new CFO guide article**

## All Dashboard Components Status

✅ All 6 dashboard components are now fully wired to Supabase:

1. **ApiKeys** — Supabase-backed with vault API key encryption
2. **UsageStats** — Supabase-backed usage tracking
3. **Overview** — Aggregated stats from multiple sources
4. **Evaluations** — `useEvaluations` hook + `useDatasets` hook
5. **Deployments** — `useDeployments` hook with traffic distribution
6. **FineTuning** — `useFineTuningJobs` hook with training loss charts
7. **Models & Routing** — `useModels` hook + latency heatmap + cost comparison
8. **Notifications** — `useNotifications` hook with read/unread states
9. **RequestLogs** — Real-time request tracking with filters
10. **Webhooks** — Webhook management with retry logic
11. **Team Management** — Team member CRUD + invite system
12. **Account Settings** — Profile management with Supabase profiles table

All components include:
- Demo data fallback when Supabase not configured
- Error handling and loading states
- Responsive design
- Consistent styling using `dash-*` CSS class naming

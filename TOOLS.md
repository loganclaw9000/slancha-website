# TOOLS.md - Local Infrastructure

## Workspace Layout

```
/home/admin/.openclaw/workspace/
├── site/                    # Slancha marketing site (React/Vite)
│   ├── copy/                # All site copy as markdown files
│   ├── site/                # Built site + notes
│   └── node_modules/        # Dependencies installed
├── observability/           # Agent metrics & dashboard
│   ├── scripts/             # collect-metrics.sh, aggregate-metrics.js
│   ├── dashboard/           # HTML dashboard (serve on :8080)
│   ├── data/                # Raw + aggregated metrics JSON
│   └── reports/             # Processed report JSONs
├── .openclaw/               # OpenClaw workspace state
├── SOUL.md                  # Agent personality/values
├── USER.md                  # Human context
├── IDENTITY.md              # Agent identity
├── AGENTS.md                # Operating procedures
├── TOOLS.md                 # This file
└── HEARTBEAT.md             # Periodic task config
```

## Active Infrastructure

### Observability Dashboard
- **Collection:** `bash observability/scripts/collect-metrics.sh`
- **Aggregation:** `node observability/scripts/aggregate-metrics.js`
- **Dashboard:** `cd observability/dashboard && python3 -m http.server 8080`
- **Cron:** Runs every 30 min via OpenClaw cron (`observability-cron`)
- **Data:** 129 sessions tracked, 6 models monitored, currently 0% success rate (network/credit issues)

### Slancha Site
- **Stack:** React + Vite + React Router
- **Copy source:** `site/copy/*.md` (hero, about, features, offerings, etc.)
- **Status:** Copy written, positioning locked ("Databricks of AI Engineering")

### Git
- **Main branch:** `main`
- **Working branch:** `master`
- **Commit convention:** Prefix with `[agent:<name>]` for agent commits
- **Another agent active:** Has been committing as `[agent:frontend]`

## SSH / Remote Access
_(Document as discovered)_

## Accounts & Services
- **Contact email:** contact@slancha.ai
- **Site domain:** slancha.ai (assumed from copy)

---

Add infrastructure details here as you use them. This is your cheat sheet, not documentation.

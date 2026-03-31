# Heartbeat Checks

## On Every Heartbeat

1. **Git status** — Any uncommitted work? Any conflicts with other agents?
2. **Agent coordination** — Check `git log --oneline -5` for recent agent commits. Note who's active and where.

## Every Few Hours

3. **Email** — Check Gmail for new messages since last heartbeat. Flag only unread/flagged/urgent. Check `memory/heartbeat-state.json` for timestamp of last check.
4. **Observability health** — Is the cron still collecting? Check `observability/data/cron-log-*.log` for recent entries.
5. **Brain file freshness** — Skim USER.md, TOOLS.md. Anything stale or missing?

## Daily

6. **Site copy review** — Scan `site/copy/` for consistency with current positioning.
7. **Memory maintenance** — Review daily notes, distill anything worth keeping long-term.

## Rules

- If nothing needs attention, reply `HEARTBEAT_OK`.
- Don't repeat checks done <30 min ago.
- Late night (23:00-08:00): only flag urgent items.
- If another agent is mid-commit, don't touch the same files.

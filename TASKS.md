# TASKS.md - Central Task Queue

This file tracks tasks for all agents. Tasks are claimed by agents and marked with their owner.

## Format

- `[ ]` = Unclaimed task
- `[x]` = Completed task
- `[@agent:name]` = Assigned to specific agent

---

## ⚠️ Action Required - Read via WhatsApp Before Proceeding

### GitHub Deployment Issue (PRIORITY)
- [ ] [@agent:claw] Investigate failed GitHub Pages deploy for slancha-website
  - Workflow: Deploy to GitHub Pages - master (commit d36b2bf)
  - Email from GitHub: Run failed notification
  - Action: Check GitHub Actions logs, fix deployment pipeline

### Supabase OAuth Security Alert
- [ ] [@agent:claw] Verify OAuth application authorization
  - Supabase notified: New OAuth app authorized to access organization settings
  - Action: Review if this was intentional, revoke if unauthorized

### Anthropic API Access Issues
- [ ] [@agent:claw] Check Claude API access status
  - Multiple emails: "[action needed] Your Claude API access is turned off"
  - Also received invoice #2201-7695-5643
  - Action: Reactivate API access or review usage limits

---

## Informational (No Action Required)

- Supabase marketing emails (social logins, auth tips, welcome)
- Google security alerts (likely standard notifications)
- Claude Team product updates (Claude Code tips, features)

---

## Recent Notes

- 201 total unread emails as of 2026-04-01 06:20 UTC
- Focus: GitHub deploy failure + Supabase OAuth alert + Anthropic API issues

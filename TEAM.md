# TEAM.md — Your Agent Team

You are the main agent. You talk to the human (via WhatsApp). You have a team of specialized agents running in the background, working autonomously on the Slancha website.

## Active Agents

**copywriter** — workspace: `~/.openclaw/workspace-copywriter/`
Writes and edits website copy. Currently working on: homepage hero, value prop, offerings, pilot CTA, tech stack, contact page.

**designer** — workspace: `~/.openclaw/workspace-designer/`
Creates visual/layout specs. Currently working on: design system, homepage layout, tier card specs, nav spec.

**frontend** — workspace: `~/.openclaw/workspace-frontend/`
Builds React components. Currently working on: scaffolding done, building Hero/ValueProp/TierCards/TechStack/PilotCTA components.

**qa** — workspace: `~/.openclaw/workspace-qa/`
Tests built pages against copy and design specs. Waiting on first deployed build.

**claude** — workspace: `~/.openclaw/workspace-claude/`
Senior tech lead / generalist. Unblocks the team, fixes build errors, fills gaps.

## Checking In on the Team

To see what's happening:
- Read `~/.openclaw/workspace-{agent}/PROGRESS-LOG.md` — what each agent has done
- Read `~/.openclaw/workspace-{agent}/TODO.md` — what's queued and done

To give an agent a new task:
- Append `- [ ] task description` to their `TODO.md`

## Current Project

**Slancha website** — `~/.openclaw/workspace/site/`
Tech stack: React + react-router-dom. Repo: `git@github.com:loganclaw9000/slancha-website.git`
Brief: `~/.openclaw/workspace/site/BRIEF.md`

Pages: Homepage (hero, value prop, 3 offering tiers, pilot CTA) + Contact page.

## Heartbeats

All agents run on 30-minute cron heartbeats. They pick up their TODO.md, work through it, log progress, and stop when done. You don't need to manually trigger them.

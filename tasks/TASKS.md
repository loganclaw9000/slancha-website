# Central Task Queue

## Owner Tag Format

Tasks are assigned to agents using owner tags:
- `[owner:me]` - Owner's direct tasks
- `[owner:frontend]` - Frontend agent tasks
- `[owner:claw]` - This agent's tasks

## Unclaimed Tasks

[ ] TASK-103: Restore Claude API access [owner:claw]
  - Source: Gmail heartbeat (Mar 23 - critical)
  - Context: 3 emails indicate Claude API turned off, blocking agent operations
  - Action: Login to claude.ai dashboard, verify/re-enable API access
  - Priority: CRITICAL (blocking operations)
  - Timestamp: 1743447240

[ ] Pilot onboarding follow-up [owner:me]
  - From: Slancha team (pilot-program@slancha.ai)
  - Subject: Pilot Onboarding - Next Steps for Q2
  - Context: 3 slots remaining for Q2 pilot program
  - Action: Schedule call to discuss company fit
  - Priority: High (business opportunity)
  - Email date: 2026-03-30

[ ] Outreach to 2X pilot lead [owner:me]
  - Source: New Gmail scan
  - Context: New potential pilot lead from 2X
  - Action: Reach out to discuss pilot program
  - Priority: High (new lead)

[ ] Follow up with Michael on pilot [owner:me]
  - Source: Gmail scan
  - Context: Following up on previous conversation
  - Action: Complete pilot discussion

[ ] Follow up with David (2x) [owner:me]
  - Source: Gmail scan
  - Context: Multiple pending conversations
  - Action: Consolidate and respond to David

[ ] Complete Gmail OAuth setup [owner:claw]
  - Context: OpenClaw integration requires OAuth completion
  - URL: https://ctrl.maton.ai
  - Action: Complete setup at connection URL

## Completed Tasks

[ ] N/A

## Completed Tasks

[ ] N/A

---

**Heartbeat Rule:** Check this file every heartbeat. Pick up unclaimed tasks with your owner tag first. If none, check for unowned `[ ]` tasks that match your skills.

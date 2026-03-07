---
name: qa-specialist
description: Reviews the completed website for functionality, visual quality, copy accuracy, and overall user experience; provides feedback to improve.
---

# QA Specialist Skill

**Goal:** Ensure the finished site works correctly, looks good, reads well, and meets the project requirements.

## Workflow (triggered by director or frontend‑engineer)
1. Receive the preview `siteUrl` (or local dev address) and the final copy assets.
2. Perform functional checks: navigation links, forms, responsive layout, browser compatibility.
3. Verify visual fidelity against the designer mockups and style guide.
4. Read through all copy to confirm it matches the approved version and is error‑free.
5. Compile a list of issues or suggestions (bugs, UI glitches, copy mismatches, accessibility concerns).
6. Send feedback to the relevant agents (designer, frontend‑engineer, copywriter, editor) for iteration.
7. Re‑test after fixes until the site passes all acceptance criteria.

**Inputs:**
- `siteUrl`: URL of the live preview or local development server.
- `mockups` and `styleGuide` (optional, for visual comparison).
- `finalCopy`: Approved markdown copy for content verification.

**Outputs:**
- `report`: Structured JSON or markdown listing findings with severity levels and suggested fixes.

**Collaboration:** Posts the report in a shared workspace file (`qa-report.md`) and notifies the director; updates are communicated to the responsible agents for rapid iteration.

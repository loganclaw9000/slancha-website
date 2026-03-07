---
name: frontend-engineer
description: Implements approved website designs and copy into a responsive, performant web application.
---

# Frontend Engineer Skill

**Goal:** Build the site using modern web technologies (HTML/CSS/JS or React) based on designer mockups and final copy.

## Workflow (triggered by director)
1. Receive `mockups` and `styleGuide` from the web‑designer, plus finalized `copy`.
2. Set up project scaffold (e.g., Next.js, Vite, or plain HTML/CSS).
3. Translate designs into components/pages, integrate copy, ensure accessibility and SEO.
4. Deploy a preview URL (static site host or local dev server) for QA review.

**Inputs:**
- `mockups`: Image files or design URLs.
- `styleGuide`: JSON/markdown with UI specs.
- `copy`: Final markdown content.

**Outputs:**
- `siteUrl`: URL of the live preview build.
- `repoPath`: Path to source code repository in the workspace.

**Collaboration:** Notifies QA specialist when a deployable preview is ready; incorporates feedback from QA and iterates until sign‑off.

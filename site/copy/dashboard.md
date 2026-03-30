# Dashboard Copy

## Overview Page

### Page Header
**Headline:** Your Inference Platform
**Subhead:** Real-time visibility into your AI infrastructure

### Empty State
**Heading:** Deploy an endpoint to get started
**Body:** Once you create your first inference endpoint, you'll see usage stats, API key metrics, and system health here.
**CTA Button:** Create New Endpoint

---

### Main Dashboard (with data)

#### Usage Stats Card
**Active Endpoints:** 3
**Requests Today:** 47,892
**P95 Latency:** 127ms
**Cost (Today):** $142.37

#### API Keys Card
**Active Keys:** 2
**Total Requests (24h):** 47,892
**Rate Limit Hits:** 0
**Top Endpoint:** /v1/chat/completions (31,204 req)

#### System Health
**All Systems Operational**
Last checked: 2 minutes ago

---

## API Keys Page

### Page Header
**Headline:** API Keys
**Subhead:** Manage access to your inference endpoints

### Add Key Section
**Field Labels:**
- Key Name (e.g., "Production App", "Staging Environment")
- Expiration Date (optional)
- Permissions (Full Access / Read-Only)

**CTA Button:** Generate Key

### Key List Item
**Key Name:** Production App
**Created:** March 15, 2026
**Last Used:** 3 minutes ago
**Status:** Active
**Actions:** Regenerate | Revoke

### Regenerate Confirmation Dialog
**Heading:** Regenerate API Key?
**Body:** This will immediately invalidate your current key. Any applications using it will stop working. Make sure you update your credentials first.
**Buttons:** Cancel | Yes, Regenerate

### Revoke Confirmation Dialog
**Heading:** Revoke API Key?
**Body:** This will permanently disable this key. All requests made with it will fail immediately. This action cannot be undone.
**Buttons:** Cancel | Yes, Revoke

---

## Usage Page

### Page Header
**Headline:** Usage & Billing
**Subhead:** Track your inference costs and quota

### Current Period Summary
**Billing Period:** March 1–31, 2026
**Total Requests:** 1,247,892
**Total Cost:** $3,842.19
**Estimated Final:** $4,100.00

### Usage By Model
**Llama-3-70B:** 524,312 requests — $1,892.40
**Mistral-7B:** 412,108 requests — $412.37
**Custom Fine-tune:** 311,472 requests — $1,537.42

### Usage By Endpoint
**/v1/chat/completions:** 892,104 req — $2,847.21
**/v1/completions:** 247,108 req — $687.42
**/v1/embeddings:** 108,680 req — $307.56

### Cost Trends
**Today:** $142.37
**Yesterday:** $167.82
**7-day average:** $158.43

### Export Button
**CTA Button:** Export CSV

---

## Account Settings Page

### Page Header
**Headline:** Account Settings
**Subhead:** Manage your workspace and preferences

### Workspace Info
**Workspace Name:** Slancha Inc.
**Organization ID:** org_slancha_inc_2026
**Plan:** Pro ($299/mo)
**Seats:** 4/10

### Team Members Section
**Heading:** Team Members
**List:**
- admin@slancha.ai (Owner) — Active
- dev@slancha.ai (Developer) — Active
- qa@slancha.ai (Viewer) — Active
- [+ Invite Member]

### Notification Preferences
**Heading:** Notifications
**Options:**
- [✓] Email me when costs exceed budget
- [✓] Email me when endpoints fail
- [ ] Weekly usage summaries
- [ ] Product updates and announcements

### Danger Zone
**Heading:** Danger Zone
**Actions:**
- Delete Workspace (requires 2FA)
- Export All Data (CSV + JSON)

### Save Button
**CTA Button:** Save Changes

# Design Spec — Team Management Page (Polish)

## Purpose
Enhance the existing TeamManagement component with:
1. **Avatar upload** — allow users to upload custom profile pictures
2. **Activity feed** — show individual member activity history
3. **Audit log** — track all team management actions with timestamps

---

## Visual Design

### Colors (same as dashboard)
- **Background:** `#0A0A0A`
- **Surface/Card:** `#1F1F1F`
- **Border:** `#262626`
- **Accent:** `#0A84FF`
- **Text Primary:** `#E5E7EB`
- **Text Secondary:** `#A0AEC0`
- **Text Tertiary:** `#71717A`
- **Success:** `#22C55E`
- **Warning:** `#F59E0B`
- **Error:** `#EF4444`

### Typography
- **Headings:** Inter, 700 weight
- **Body:** Inter, 400 weight
- **Monospace:** JetBrains Mono (for timestamps, IDs)

---

## 1. Avatar Upload Section

### Where
Each member row in the team table, add an "Avatar" column between Member and Role. Also add a dedicated "Profile Settings" section when clicking on a member.

### Avatar Display
- **Size:** 48px diameter circle
- **Fallback:** Gradient background with initials (keep existing behavior)
- **Uploaded image:** Object-fit cover, no distortion
- **Border:** 2px solid transparent, hover → accent border

### Avatar Upload UI (Modal)
When clicking the avatar, open a modal with:

```
┌─────────────────────────────────────┐
│  Change Profile Picture              │
├─────────────────────────────────────┤
│                                      │
│     ┌──────────────────┐            │
│     │                  │            │
│     │   Current Image  │            │
│     │   (48x48 circle) │            │
│     │                  │            │
│     └──────────────────┘            │
│                                      │
│  [ Upload New Photo ]  (accent btn) │
│                                      │
│  or                                  │
│                                      │
│  [ Use Initials Only ] (outline)    │
│                                      │
└─────────────────────────────────────┘
```

**Modal specs:**
- Max-width: 420px
- Background: surface (`#1F1F1F`)
- Border: 1px solid border (`#262626`)
- Border-radius: 12px
- Padding: 28px
- Overlay: semi-transparent `rgba(0,0,0,0.6)`

**Upload button:**
- Background: accent (`#0A84FF`)
- Text: white
- Padding: 12px 24px
- Border-radius: 6px
- Icon: upload SVG (20x20) + text "Upload New Photo"

**File input:** Hidden, triggered by button click
- Accept: `image/png, image/jpeg, image/webp`
- Max size: 5MB
- Validation: show error if invalid type/size

**Preview area:**
- 48x48 circle display of uploaded image
- If upload fails, show error message in error color
- If upload succeeds, show "Use this photo?" confirmation

**Use Initials button:**
- Outline style (border only)
- Same padding as upload button
- Removes any uploaded avatar, reverts to gradient + initials

---

## 2. Activity Feed Section

### Where
Add as a separate collapsible section below the members table. Also show in a member's detailed view (if/when modal is added).

### Activity Feed Header
```
┌──────────────────────────────────────────────────┐
│  Activity Feed          [▼ Collapse]            │
├──────────────────────────────────────────────────┤
│  Filters: [All Actions ▼]  [Last 30 days ▼]     │
└──────────────────────────────────────────────────┘
```

**Filters:**
- Action type dropdown: "All Actions" | "Member Added" | "Member Removed" | "Role Changed" | "Avatar Updated" | "Invite Sent" | "Invite Revoked"
- Date range dropdown: "Last 7 days" | "Last 30 days" | "Last 90 days" | "All time"

### Activity Feed Items
Each activity item is a vertical list entry:

```
┌──────────────────────────────────────────────────┐
│  Sarah Chen changed role                         │
│  Marcus Johnson → Developer                      │
│  March 31, 2026 at 10:42 AM                      │
└──────────────────────────────────────────────────┘
```

**Activity item layout:**
- Left column: Action icon (colored by type)
- Middle column:
  - **Heading:** Bold, text-primary — who did what
  - **Details:** Secondary text — specific changes
  - **Timestamp:** Tertiary, monospace font
- Right column: (optional) Edit/revert actions if applicable

**Action icon colors:**
- Member Added: `#22C55E` (green)
- Member Removed: `#EF4444` (red)
- Role Changed: `#818CF8` (purple/accent)
- Avatar Updated: `#F59E0B` (yellow)
- Invite Sent: `#0A84FF` (blue)
- Invite Revoked: `#EF4444` (red)

**Activity item example variations:**

*Role change:*
```
Icon: Role badge SVG (purple)
Heading: "Sarah Chen changed role"
Details: "Marcus Johnson → Developer"
Timestamp: "Mar 31, 2026 at 10:42 AM (you performed this action)"
```

*Member added:*
```
Icon: User plus SVG (green)
Heading: "Sarah Chen invited Marcus Johnson"
Details: "Role: Developer, Expires: Apr 7, 2026"
Timestamp: "Mar 31, 2026 at 9:15 AM"
```

*Invite revoked:*
```
Icon: Exclamation circle SVG (red)
Heading: "Sarah Chen revoked invitation"
Details: "alex@company.com was scheduled to expire in 6 days"
Timestamp: "Mar 31, 2026 at 8:30 AM"
```

---

## 3. Audit Log Section

### Where
Separate section below Activity Feed. This is a more detailed, exportable log for compliance/records.

### Audit Log Header
```
┌──────────────────────────────────────────────────┐
│  Audit Log                    [Export CSV ▼]    │
├──────────────────────────────────────────────────┤
│  Total entries: 247  |  Showing: Last 100       │
└──────────────────────────────────────────────────┘
```

**Export button:**
- Outline style
- Text: "Export CSV" + download icon
- Opens dropdown: "All time" | "Last 30 days" | "Last 90 days"

### Audit Log Table
Similar to member table but with more columns:

| Timestamp | Actor | Action | Target | Details | IP Address |
|-----------|-------|--------|--------|---------|------------|
| 2026-03-31 10:42 AM | Sarah Chen (you@company.com) | role_changed | Marcus Johnson | developer → admin | 192.168.1.105 |
| 2026-03-31 09:15 AM | Sarah Chen (you@company.com) | invite_sent | alex@company.com | role: developer | 192.168.1.105 |
| 2026-03-31 08:30 AM | Sarah Chen (you@company.com) | invite_revoked | alex@company.com | - | 192.168.1.105 |

**Table specs:**
- Same styling as member table (same CSS classes where possible)
- Timestamp: monospace font, tertiary color
- Actor: bold primary, email secondary
- Action: badge styling (same colors as activity feed icons)
- Target: email or name depending on action
- Details: secondary text, max 60 chars then "…"
- IP Address: monospace, tertiary, hide on mobile (< 768px)

**Row hover:** Same as member table (2% white overlay)

---

## Component Structure

### New Components Needed

#### `AvatarUploadModal.jsx`
- Props: `member`, `isOpen`, `onClose`, `onUpload`, `onRemove`
- Handles file input, preview, validation

#### `ActivityFeed.jsx`
- Props: `activities`, `filter`, `onFilterChange`, `showCollapse`
- Renders activity list with filters

#### `AuditLog.jsx`
- Props: `logs`, `exportHandler`
- Renders audit log table with export

#### `ActivityIcon.jsx` (helper)
- Props: `actionType`
- Returns colored SVG icon based on action type

### Updated Components

#### `TeamManagement.jsx`
Add new state:
```javascript
const [showAvatarModal, setShowAvatarModal] = useState(false);
const [selectedMember, setSelectedMember] = useState(null);
const [activityFilter, setActivityFilter] = useState('all');
const [dateRange, setDateRange] = useState('30d');
const [audits, setAudits] = useState([]); // new
const [activities, setActivities] = useState([]); // new
```

Add new handlers:
```javascript
const handleAvatarUpload = (file, memberId) => { /* validation + upload */ };
const handleAvatarRemove = (memberId) => { /* revert to initials */ };
const handleExportAudits = (range) => { /* generate CSV */ };
```

Add new sections to render:
```jsx
{/* Avatar upload modal */}
{showAvatarModal && selectedMember && (
  <AvatarUploadModal
    member={selectedMember}
    isOpen={showAvatarModal}
    onClose={() => setShowAvatarModal(false)}
    onUpload={handleAvatarUpload}
    onRemove={() => handleAvatarRemove(selectedMember.id)}
  />
)}

{/* Activity Feed */}
<ActivityFeed
  activities={activities}
  filter={{ action: activityFilter, range: dateRange }}
  onFilterChange={{ setAction: setActivityFilter, setDate: setDateRange }}
/>

{/* Audit Log */}
<AuditLog
  logs={audits}
  exportHandler={handleExportAudits}
/>
```

#### `TeamManagement.css`
Add new classes:

```css
/* Avatar upload button */
.avatar-upload-btn {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 150ms ease;
}

.avatar-upload-btn:hover {
  border-color: var(--color-accent, #6366F1);
}

.avatar-upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 150ms ease;
}

.avatar-upload-btn:hover .avatar-upload-overlay {
  opacity: 1;
}

.avatar-upload-icon {
  color: white;
  font-size: 18px;
}

/* Activity feed */
.activity-feed-section {
  margin-top: 32px;
  border-top: 1px solid var(--border-muted);
  padding-top: 24px;
}

.activity-feed-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.activity-feed-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid transparent;
  transition: background 150ms ease;
}

.activity-feed-item:hover {
  background: rgba(255,255,255,0.02);
  border-color: var(--border-muted);
}

.activity-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.activity-details {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.activity-timestamp {
  font-size: 12px;
  color: var(--text-tertiary);
  font-family: 'JetBrains Mono', monospace;
}

/* Audit log */
.audit-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.audit-log-stats {
  font-size: 13px;
  color: var(--text-tertiary);
}

.audit-log-table th:first-child,
.audit-log-table td:first-child {
  width: 160px; /* timestamp */
}

.audit-log-table th:nth-child(2),
.audit-log-table td:nth-child(2) {
  width: 200px; /* actor */
}

.audit-log-table th:last-child,
.audit-log-table td:last-child {
  display: none; /* IP on mobile */
}

@media (min-width: 768px) {
  .audit-log-table th:last-child,
  .audit-log-table td:last-child {
    display: table-cell;
  }
}
```

---

## Mock Data Examples

### Activity Data Structure
```javascript
const MOCK_ACTIVITIES = [
  {
    id: 'act_1',
    timestamp: '2026-03-31T10:42:00Z',
    actor: { name: 'Sarah Chen', email: 'sarah@company.com' },
    action: 'role_changed',
    target: { name: 'Marcus Johnson', email: 'marcus@company.com' },
    details: { from: 'developer', to: 'admin' },
    performedByYou: true,
  },
  {
    id: 'act_2',
    timestamp: '2026-03-31T09:15:00Z',
    actor: { name: 'Sarah Chen', email: 'sarah@company.com' },
    action: 'invite_sent',
    target: { email: 'alex@company.com' },
    details: { role: 'developer', expires: '2026-04-07' },
    performedByYou: true,
  },
  {
    id: 'act_3',
    timestamp: '2026-03-31T08:30:00Z',
    actor: { name: 'Sarah Chen', email: 'sarah@company.com' },
    action: 'invite_revoked',
    target: { email: 'alex@company.com' },
    details: { daysRemaining: 6 },
    performedByYou: true,
  },
  {
    id: 'act_4',
    timestamp: '2026-03-30T16:20:00Z',
    actor: { name: 'Marcus Johnson', email: 'marcus@company.com' },
    action: 'avatar_updated',
    target: { name: 'Marcus Johnson', email: 'marcus@company.com' },
    details: {},
    performedByYou: false,
  },
];
```

### Audit Log Data Structure
```javascript
const MOCK_AUDITS = [
  {
    id: 'audit_1',
    timestamp: '2026-03-31T10:42:00Z',
    actor: { name: 'Sarah Chen', email: 'sarah@company.com' },
    action: 'role_changed',
    target: { name: 'Marcus Johnson', email: 'marcus@company.com' },
    details: 'role changed from developer to admin',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; ARM) ...',
  },
  {
    id: 'audit_2',
    timestamp: '2026-03-31T09:15:00Z',
    actor: { name: 'Sarah Chen', email: 'sarah@company.com' },
    action: 'invite_sent',
    target: { email: 'alex@company.com' },
    details: 'sent invite for developer role',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; ARM) ...',
  },
];
```

---

## Interaction Flows

### Avatar Upload Flow
1. User clicks on member's avatar
2. Modal opens with current avatar (or initials circle)
3. User clicks "Upload New Photo"
4. File picker opens
5. User selects image (PNG/JPG/WebP, max 5MB)
6. Validation runs:
   - If invalid: show error message in red
   - If valid: show preview with "Use this photo?" prompt
7. User confirms or cancels
8. If confirmed: API call to upload, show success toast
9. Avatar updates in table immediately

### Activity Feed Flow
1. User scrolls to Activity Feed section
2. Section shows last 10 activities by default
3. User can filter by action type
4. User can change date range
5. List updates based on filters
6. Click on any activity → no action (for now, just view)

### Audit Log Flow
1. User scrolls to Audit Log section
2. Table shows last 100 entries
3. User clicks "Export CSV"
4. Dropdown shows date range options
5. User selects range
6. CSV file downloads with all matching entries
7. Columns: timestamp, actor, action, target, details, IP, user agent

---

## Responsive Behavior

### Mobile (< 768px)
- **Avatar:** Keep in table, but hide "Upload" overlay on hover (use tap instead)
- **Activity Feed:** Stack vertically, reduce padding to 8px
- **Audit Log:** Hide IP Address column, truncate Details to 40 chars
- **Filters:** Stack vertically, full-width dropdowns

### Tablet (768px - 1024px)
- **Avatar:** Same as desktop
- **Activity Feed:** 2-column grid for filter dropdowns
- **Audit Log:** Show IP Address column, keep Details at 60 chars

### Desktop (> 1024px)
- Full layout as specified
- Hover effects active
- All columns visible

---

## Accessibility

### Avatar Upload
- Keyboard accessible (tab to avatar, enter to open modal)
- Screen reader announces "Change profile picture for [name]"
- File input has proper labels

### Activity Feed
- Semantic list (`<ul>` with `<li>`)
- ARIA labels for filter dropdowns
- Timestamps announced with screen reader

### Audit Log
- Table headers properly associated with cells
- Screen reader announces column names
- Export button has clear purpose

---

## Performance Considerations

- **Activity feed:** Load last 50 items by default, pagination or "load more" button
- **Audit log:** Server-side pagination (100 items per page)
- **Avatar images:** Lazy load, cache on CDN
- **Filter operations:** Debounce input, memoize filtered results

---

## Edge Cases

### No Activities
Show empty state:
```
┌──────────────────────────────────────────────────┐
│  📭 No activities yet                            │
│                                                  │
│  Activity history will appear here once team     │
│  management actions are performed.               │
└──────────────────────────────────────────────────┘
```

### No Audit Logs
Same as above, but with "🗄️" icon.

### Avatar Upload Fails
Show inline error:
```
❌ Failed to upload avatar. Please try again.
```

### Invalid File Type/Size
Show validation error in modal:
```
⚠️ Please select a PNG, JPG, or WebP file under 5MB.
```

### Member Count at Limit
Disable "Invite Member" button, show tooltip:
```
You've reached your 10-seat limit. Upgrade your plan
to add more team members.
```

---

## Testing Checklist

### Avatar Upload
- [ ] Click avatar opens modal
- [ ] Upload button triggers file picker
- [ ] Invalid file type shows error
- [ ] File > 5MB shows error
- [ ] Valid image shows preview
- [ ] "Use this photo" updates avatar
- [ ] "Use initials" reverts to initials
- [ ] Modal closes on outside click
- [ ] Modal closes on Escape key

### Activity Feed
- [ ] Last 10 activities show by default
- [ ] Filter by action type works
- [ ] Filter by date range works
- [ ] Empty state shows when no activities
- [ ] Activity timestamps formatted correctly
- [ ] "Performed by you" badge shows

### Audit Log
- [ ] Last 100 entries show by default
- [ ] Export CSV downloads correctly
- [ ] Export respects date range
- [ ] IP Address hidden on mobile
- [ ] Details truncated at 60 chars
- [ ] Table sortable (future feature)

### Responsive
- [ ] Mobile layout works (< 768px)
- [ ] Tablet layout works (768-1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] All interactions work on touch devices

---

## Deliverables

1. ✅ `site/design/team-management.md` — This spec file
2. ⏳ `src/components/dashboard/AvatarUploadModal.jsx` — New component
3. ⏳ `src/components/dashboard/ActivityFeed.jsx` — New component
4. ⏳ `src/components/dashboard/AuditLog.jsx` — New component
5. ⏳ `src/components/dashboard/ActivityIcon.jsx` — Helper component
6. ⏳ Updated `src/components/dashboard/TeamManagement.jsx` — Add new state/handlers/sections
7. ⏳ Updated `src/components/dashboard/TeamManagement.css` — Add new styles
8. ⏳ Mock data for activities and audit logs

---

## Notes

- Keep visual consistency with existing TeamManagement design
- Reuse existing CSS variables and design tokens
- Follow React best practices (memoization, lazy loading)
- Plan for future integration with real backend (currently using mock data)
- Consider adding "last seen" tracking for members (optional enhancement)

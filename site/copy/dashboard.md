# Slancha Dashboard Copy

## Sidebar Navigation

**Sidebar Item: Overview**
`Overview`

**Sidebar Item: API Keys**
`API Keys`

**Sidebar Item: Usage**
`Usage`

**Sidebar Item: Settings**
`Settings`

---

## Overview Page

### Empty State (when no API keys exist)
**Heading:**
`Get started with your first API key`

**Description:**
`API keys let you authenticate requests to the Slancha platform. Create your first key to begin deploying and monitoring inference workloads.`

**Primary CTA Button:**
`Create API Key`

### Summary Stats Cards

**Total Requests Label:**
`Total Requests`

**Unique Models Label:**
`Unique Models`

**Avg Latency Label:**
`Avg Latency`

**Total Spend Label:**
`Total Spend`

### Recent Activity Section

**Section Title:**
`Recent Activity`

**Empty State:**
`No activity yet. Create an API key to see your usage appear here.`

---

## API Keys Page

### Page Header
**Heading:**
`API Keys`

**Subheading:**
`Manage your API keys and control access to the Slancha platform.`

### API Key Table Headers
**Column: Name:**
`Name`

**Column: Key:**
`Key`

**Column: Created:**
`Created`

**Column: Status:**
`Status`

**Column: Actions:**
`Actions`

### Empty State (when no API keys exist)
**Heading:**
`No API keys yet`

**Description:**
`Create your first API key to start using the Slancha platform. Keys are required for all API requests.`

**Primary CTA Button:**
`Create API Key`

### API Key Row Display

**Key Status - Active:**
`Active`

**Key Status - Revoked:**
`Revoked`

**Key Status - Disabled:**
`Disabled`

### Action Buttons

**Copy Button Tooltip:**
`Copy to clipboard`

**Copy Button Label:**
`Copy`

**Revoke Button:**
`Revoke`

**Delete Button:**
`Delete`

---

## API Key Creation Flow

### Modal Header
**Title:**
`Create API Key`

**Subtitle:**
`Generate a new API key to authenticate requests to the Slancha platform.`

### Form Fields

**Field: Name Label:**
`Key Name`

**Field: Name Placeholder:**
`e.g., Production Key, Staging Environment`

**Field: Name Description:**
`Choose a descriptive name to identify this key. You can't change this later.`

**Field: Name Required Message:**
`Please enter a name for this API key.`

### Create Button
**Primary CTA Button:**
`Create Key`

### Success Message
**Heading:**
`API Key Created`

**Body:**
`Your API key has been generated. Copy it now — you won't be able to see it again.`

**Instructions:**
`Store this key securely. It will be used to authenticate all your API requests.`

**Button:**
`Copy Key & Close`

### Warning (key not copied)
**Alert:**
`⚠️ This key is shown only once. If you lose it, you'll need to create a new one.`

### Cancel Button
`Cancel`

---

## Revoke Confirmation Dialog

**Dialog Title:**
`Revoke API Key?`

**Body:**
`Are you sure you want to revoke this key? All requests using this key will fail immediately and you'll need to create a new one.`

**Warning (additional):**
`This action cannot be undone.`

**Cancel Button:**
`Cancel`

**Confirm Button:**
`Revoke Key`

**Confirm Button Color Variant:**
`Destructive (red)`

---

## Usage Page

### Page Header
**Heading:**
`Usage`

**Subheading:**
`Monitor your API usage, costs, and performance metrics.`

### Date Range Picker
**Label:**
`Date Range`

**Options:**
`Last 7 days`
`Last 30 days`
`Last 90 days`
`Custom range`

### Usage Summary Cards

**Requests Card Label:**
`Requests`

**Requests Card Description:**
`Total API calls made`

**Models Card Label:**
`Models Used`

**Models Card Description:**
`Unique models invoked`

**Latency Card Label:**
`Average Latency`

**Latency Card Description:**
`Mean response time per request`

**Cost Card Label:**
`Total Cost`

**Cost Card Description:**
`Spend for selected period`

### Breakdown Section

**Section Title:**
`Usage by Key`

**Section Title:**
`Usage by Model`

**Section Title:**
`Usage by Hour`

### Export Data
**Button:**
`Export CSV`

---

## Settings Page

### Page Header
**Heading:**
`Settings`

**Subheading:**
`Manage your account and preferences.`

### Profile Section

**Section Title:**
`Profile`

**Field: Display Name:**
`Display Name`

**Field: Display Name Placeholder:**
`Your name or organization`

**Field: Company:**
`Company`

**Field: Company Placeholder:**
`Your company name`

**Field: Email:**
`Email`

**Save Button:**
`Save Changes`

**Success Message:**
`✓ Profile updated successfully`

### Security Section

**Section Title:**
`Security`

**Field: Current Password:**
`Current Password`

**Field: New Password:**
`New Password`

**Field: Confirm Password:**
`Confirm New Password`

**Field Password Requirements:**
`Must be at least 8 characters`

**Change Password Button:**
`Update Password`

**Success Message:**
`✓ Password updated successfully`

### Account Danger Zone

**Section Title:**
`Danger Zone`

**Title:**
`Delete Account`

**Description:**
`Permanently delete your Slancha account and all associated data. This action cannot be undone.`

**Button:**
`Delete Account`

**Delete Confirmation Modal Title:**
`Delete Account?`

**Delete Confirmation Modal Body:**
`Are you absolutely sure? This action will permanently delete your account, all API keys, and all usage data. This cannot be undone.`

**Cancel Button:**
`Cancel`

**Confirm Delete Button:**
`Yes, Delete My Account`

**Confirm Delete Button Color Variant:**
`Destructive (red)`

---

## Notifications & Alerts

### Toast Messages

**API Key Copied:**
`✓ API key copied to clipboard`

**Key Revoked:**
`✓ API key revoked`

**Key Deleted:**
`✓ API key deleted`

**Profile Saved:**
`✓ Profile saved`

**Password Updated:**
`✓ Password updated`

**Error Generic:**
`Something went wrong. Please try again.`

**Error Network:**
`Network error. Please check your connection and try again.`

**Error Permission:**
`You don't have permission to perform this action.`

### Empty States

**No Usage Data:**
`No usage data available for the selected period.`

**No Activity:**
`No activity to display.`

---

## Tooltips

### API Key Column Tooltips

**Name Tooltip:**
`The descriptive name you assigned to this key`

**Key Tooltip:**
`The actual API key (click to copy full value)`

**Created Tooltip:**
`Date and time when this key was created`

**Status Tooltip - Active:**
`This key is active and can be used for authentication`

**Status Tooltip - Revoked:**
`This key has been revoked and can no longer be used`

### Button Tooltips

**Copy Tooltip:**
`Copy this key to your clipboard`

**Revoke Tooltip:**
`Revoke this key to disable all requests made with it`

**Settings Tooltip:**
`Manage your account settings and preferences`

**Export Tooltip:**
`Download usage data as a CSV file`

### Date Range Tooltip
`Select a time period to view usage metrics`

---

## Footer / Help

**Help Text:**
`Need help? Check out our [documentation](link) or [contact support](link).`

**Support Email:**
`support@slancha.io`

---

## Accessibility Labels

**Skip Link:**
`Skip to main content`

**Nav Label:**
`Dashboard navigation`

**Table Label:**
`API keys table`

**Form Label:**
`Settings form`

---

*Copy spec ready for frontend implementation.*

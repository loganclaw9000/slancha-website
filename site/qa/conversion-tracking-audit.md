# Conversion Tracking Audit Report

**Date:** 2026-04-01  
**Task:** TASK-219 - Add conversion tracking to all CTAs  
**Scope:** Complete marketing site CTA verification

---

## Executive Summary

The analytics infrastructure exists (`src/lib/analytics.js`) with `trackCtaClick()` and related helpers, but **critical CTAs across the site are not using it**. This creates blind spots in the conversion funnel.

**Coverage Status:**
- ✅ 4 CTAs tracked
- ❌ 12+ major CTAs NOT tracked

---

## Tracked CTAs (Working Correctly)

| Page | CTA | Event | Status |
|------|-----|-------|--------|
| `/pricing` | Tier checkout buttons | `trackCtaClick('pricing_${tier.id}', 'pricing_page')` | ✅ |
| `/contact` | Form submit | `trackCtaClick('contact_form_submit', 'contact_page')` | ✅ |
| `/` (Hero) | Waitlist form | `trackWaitlistJoined(emailDomain)` | ✅ |
| `/signup` | Signup form submit | `trackSignup(emailDomain, 'email')` | ✅ |

---

## **NOT Tracked - Critical Gaps**

### Navigation (Nav.jsx)
| CTA | Location | Impact |
|-----|----------|--------|
| "Get Started" | Nav CTA (unauthenticated) | ❌ HIGH - Primary conversion CTA |
| "Dashboard" | Nav CTA (authenticated) | ❌ MEDIUM - User retention tracking |
| "Sign in" | Nav link (unauthenticated) | ❌ MEDIUM - Login funnel tracking |

### Homepage (Home.jsx)
| CTA | Location | Impact |
|-----|----------|--------|
| "Get Your API Endpoint" | Hero primary CTA | ❌ HIGH - PRIMARY conversion CTA |
| "See How It Works" | Hero secondary CTA | ❌ MEDIUM - Engagement tracking |
| "Get Your Endpoint" | PilotCTA component | ❌ HIGH - Pilot program conversion |

### Enterprise Page (Enterprise.jsx)
| CTA | Location | Impact |
|-----|----------|--------|
| "Talk to Sales" | Hero CTAs | ❌ HIGH - Enterprise lead gen |
| "Compare Plans" | Hero CTAs | ❌ MEDIUM - Pricing page funnel |
| "Schedule a Demo" | Bottom CTA section | ❌ HIGH - Demo booking funnel |
| "Read Case Studies" | Bottom CTA section | ❌ LOW - Content engagement |

### Pilot Program Page (PilotProgram.jsx)
| CTA | Location | Impact |
|-----|----------|--------|
| "Apply for a Pilot" | Hero CTAs | ❌ HIGH - Pilot conversion |
| "Enterprise Overview" | Hero CTAs | ❌ LOW - Cross-page navigation |
| "Start Your Pilot" | Bottom CTA | ❌ HIGH - Pilot conversion |
| "See the Demo First" | Bottom CTA | ❌ MEDIUM - Demo funnel |

### A/B Test Framework (src/ab/)
| Page | CTA | Note |
|------|-----|------|
| Homepage Variant A | Pricing CTA | ✅ Tracked (`trackABTestEvent`) |
| Homepage Variant B | Demo CTA | ✅ Tracked (`trackABTestEvent`) |

---

## Additional Observations

### ✅ Good Practices Found
1. **Analytics module exists** with comprehensive tracking functions
2. **Event enrichment** includes session ID, page path, UTM params, referrer
3. **Multiple providers supported** (PostHog, GA4, custom endpoint)
4. **A/B test events tracked** via `trackABTestEvent()`
5. **Usage tracking** exists for API calls (`trackUsage`)

### ⚠️ Missing Features
1. **No centralized CTA component** - each page implements tracking inline
2. **No tracking on Nav buttons** - missing entire nav funnel
3. **No tracking on secondary/tertiary CTAs** - only some primary CTAs tracked
4. **No tracking on internal navigation** (anchor links, "See How It Works")
5. **No page scroll tracking** (only A/B test variants have this)
6. **No time-on-page tracking** (only in A/B test variants)

---

## Recommendations

### Immediate (Must Fix)
1. Add `trackCtaClick()` to all Nav buttons:
   - "Get Started" → `trackCtaClick('nav_get_started', 'global_nav')`
   - "Sign in" → `trackCtaClick('nav_sign_in', 'global_nav')`
   - "Dashboard" → `trackCtaClick('nav_dashboard', 'global_nav')`

2. Add tracking to Hero CTAs:
   - Homepage: `trackCtaClick('hero_get_endpoint', 'homepage')`
   - Enterprise: `trackCtaClick('enterprise_talk_sales', 'enterprise_page')`

3. Add tracking to PilotProgram page:
   - "Apply for a Pilot" → `trackCtaClick('pilot_apply', 'pilot_page')`

### Short-term (Should Fix)
4. Create a reusable `TrackableButton` component with automatic tracking
5. Add scroll depth tracking to all pages
6. Add time-on-page tracking globally
7. Track all anchor navigation clicks (internal links)

### Long-term (Nice to Have)
8. Implement event deduplication (prevent duplicate tracking)
9. Add offline queueing for failed tracking calls
10. Create a tracking dashboard for real-time funnel visibility

---

## Implementation Example

```jsx
// Before (no tracking)
<Link to="/signup" className="btn-primary">Get Started</Link>

// After (with tracking)
<Link 
  to="/signup" 
  className="btn-primary"
  onClick={() => trackCtaClick('nav_get_started', 'global_nav')}
>
  Get Started
</Link>
```

---

## Files Modified in This Audit
- No files modified (audit only)

## Next Steps
1. Report findings to frontend agent
2. Prioritize critical gaps (Nav + Hero CTAs)
3. Consider creating a CTA component library

---

**Report Generated:** 2026-04-01  
**Auditor:** qa (via HEARTBEAT)  
**Task Status:** PARTIAL (TASK-219 requires implementation, not just audit)

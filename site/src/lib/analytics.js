/**
 * Slancha Analytics Module
 *
 * Lightweight conversion funnel tracking per the strategist's spec.
 * Supports PostHog, GA4 (gtag), and custom webhook endpoints.
 * Falls back to console.debug in development when no provider is configured.
 *
 * Configure via env vars:
 *   VITE_POSTHOG_KEY       — PostHog project API key
 *   VITE_POSTHOG_HOST      — PostHog host (default: https://app.posthog.com)
 *   VITE_ANALYTICS_ENDPOINT — Custom webhook URL for event ingestion
 *
 * Events follow the conversion funnel schema from conversion-funnel.md:
 *   page_view, signup_completed, cta_clicked, api_key_created,
 *   upgrade_pro, upgrade_growth, pilot_application, waitlist_joined
 */

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
const CUSTOM_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const IS_DEV = import.meta.env.DEV;

// Session-level context
let sessionId = null;
let pageloadTimestamp = null;

function getSessionId() {
  if (!sessionId) {
    sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    pageloadTimestamp = new Date().toISOString();
  }
  return sessionId;
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

function getReferrer() {
  try {
    const ref = document.referrer;
    if (!ref) return null;
    const url = new URL(ref);
    if (url.hostname === window.location.hostname) return null;
    return ref;
  } catch {
    return document.referrer || null;
  }
}

// ---------- Providers ----------

function sendToPostHog(event, properties) {
  if (!POSTHOG_KEY) return;
  // Use PostHog JS SDK if loaded, otherwise fire API directly
  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(event, properties);
    return;
  }
  // Lightweight beacon fallback
  const payload = {
    api_key: POSTHOG_KEY,
    event,
    properties: {
      ...properties,
      $current_url: window.location.href,
      $referrer: getReferrer(),
      distinct_id: properties.user_id || getSessionId(),
    },
    timestamp: new Date().toISOString(),
  };
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(`${POSTHOG_HOST}/capture/`, blob);
  } catch {
    // silent
  }
}

function sendToGA4(event, properties) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, properties);
}

function sendToCustomEndpoint(event, properties) {
  if (!CUSTOM_ENDPOINT) return;
  const payload = { event, properties, timestamp: new Date().toISOString() };
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(CUSTOM_ENDPOINT, blob);
  } catch {
    fetch(CUSTOM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }
}

// ---------- Core ----------

function track(event, properties = {}) {
  const enriched = {
    ...properties,
    session_id: getSessionId(),
    page: window.location.pathname,
    ...getUtmParams(),
  };

  const referrer = getReferrer();
  if (referrer) enriched.referrer = referrer;

  if (IS_DEV && !POSTHOG_KEY && !CUSTOM_ENDPOINT) {
    console.debug('[analytics]', event, enriched);
    return;
  }

  sendToPostHog(event, enriched);
  sendToGA4(event, enriched);
  sendToCustomEndpoint(event, enriched);
}

// ---------- Typed event helpers ----------

export function trackPageView(page, title) {
  track('page_view', { page: page || window.location.pathname, title });
}

export function trackSignup(emailDomain, method = 'email') {
  track('signup_completed', { email_domain: emailDomain, method, plan: 'free' });
}

export function trackLogin(method = 'email') {
  track('login', { method });
}

export function trackCtaClick(ctaName, location) {
  track('cta_clicked', { cta_name: ctaName, location });
}

export function trackApiKeyCreated() {
  track('api_key_created', {});
}

export function trackWaitlistJoined(emailDomain) {
  track('waitlist_joined', { email_domain: emailDomain });
}

export function trackPilotApplication(company, useCase) {
  track('pilot_application', { company, use_case: useCase });
}

export function trackUpgrade(tier, previousPlan) {
  track(tier === 'growth' ? 'upgrade_growth' : 'upgrade_pro', {
    previous_plan: previousPlan,
    new_plan: tier,
  });
}

export function trackSearch(query, resultsCount) {
  track('search', { query, results_count: resultsCount });
}

export { track };
export default { track, trackPageView, trackSignup, trackLogin, trackCtaClick, trackApiKeyCreated, trackWaitlistJoined, trackPilotApplication, trackUpgrade, trackSearch };

/**
 * A/B Test Framework
 * 
 * Simple localStorage-based A/B testing system for homepage variants.
 * Tracks experiment assignments and fires analytics events on interactions.
 */

// Default experiment configuration
export const DEFAULT_EXPERIMENTS = {
  homepage: {
    name: 'Homepage Variants',
    description: 'Test different homepage layouts and copy',
    variations: [
      { id: 'control', name: 'Control (Current)', weight: 50 },
      { id: 'variant-a', name: 'Variant A (Pricing-focused)', weight: 30 },
      { id: 'variant-b', name: 'Variant B (Testimonial-focused)', weight: 20 },
    ],
    metrics: ['cta_click', 'scroll_depth', 'time_on_page'],
  },
};

/**
 * Generate consistent assignment based on user ID
 */
export function getExperimentVariation(experimentKey, userId = null) {
  const storedAssignment = localStorage.getItem(`abtest_${experimentKey}`);
  
  if (storedAssignment) {
    return JSON.parse(storedAssignment);
  }
  
  // Generate user ID if not provided
  const userKey = userId || localStorage.getItem('abtest_user_id') || 
    crypto.randomUUID() || 
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  if (!localStorage.getItem('abtest_user_id')) {
    localStorage.setItem('abtest_user_id', userKey);
  }
  
  // Get experiment config
  const experiment = DEFAULT_EXPERIMENTS[experimentKey];
  if (!experiment) {
    console.warn(`[ABTest] Unknown experiment: ${experimentKey}`);
    return { variation: 'control', userId: userKey, timestamp: Date.now() };
  }
  
  // Weighted random selection — deterministic hash from string
  const str = userKey + experimentKey;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const random = Math.abs(hash % 100) / 100;
  let cumulative = 0;
  let selected = experiment.variations[0].id;
  
  for (const variation of experiment.variations) {
    cumulative += variation.weight / 100;
    if (random < cumulative) {
      selected = variation.id;
      break;
    }
  }
  
  const assignment = { variation: selected, userId: userKey, timestamp: Date.now() };
  localStorage.setItem(`abtest_${experimentKey}`, JSON.stringify(assignment));
  
  // Fire analytics event
  if (window.analytics) {
    window.analytics.track('abtest_assignment', {
      experiment: experimentKey,
      variation: selected,
      userId: userKey,
    });
  }
  
  return assignment;
}

/**
 * Track A/B test events
 */
export function trackABTestEvent(event, metadata = {}) {
  const assignment = getExperimentAssignment('homepage');
  
  const eventData = {
    event,
    experiment: 'homepage',
    variation: assignment.variation,
    timestamp: Date.now(),
    ...metadata,
  };
  
  if (window.analytics) {
    window.analytics.track(event, eventData);
  }
  
  // Log to console for debugging
  console.log('[ABTest Event]', eventData);
  
  return eventData;
}

/**
 * Get current A/B test assignment
 */
export function getExperimentAssignment(experimentKey) {
  const stored = localStorage.getItem(`abtest_${experimentKey}`);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Reset A/B test assignment (for testing)
 */
export function resetExperimentAssignment(experimentKey) {
  localStorage.removeItem(`abtest_${experimentKey}`);
  localStorage.removeItem('abtest_user_id');
  console.log(`[ABTest] Reset assignment for ${experimentKey}`);
}

/**
 * Get all experiment assignments
 */
export function getAllAssignments() {
  const assignments = {};
  for (const key in DEFAULT_EXPERIMENTS) {
    assignments[key] = getExperimentAssignment(key);
  }
  return assignments;
}

/**
 * Export assignments for analysis
 */
export function exportAssignments() {
  return {
    exportedAt: new Date().toISOString(),
    assignments: getAllAssignments(),
  };
}

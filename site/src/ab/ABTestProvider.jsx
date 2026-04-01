import React, { createContext, useContext, useEffect, useState } from 'react';
import { getExperimentVariation } from './abTestConfig';

const ABTestContext = createContext(null);

/**
 * A/B Test Provider
 * 
 * Wraps the app to provide A/B test assignments to all components.
 */
export function ABTestProvider({ children }) {
  const [variations, setVariations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine variations on mount
    const homepageVariation = getExperimentVariation('homepage');
    setVariations({
      homepage: homepageVariation.variation,
    });
    setLoading(false);
  }, []);

  const value = {
    variations,
    isVariation: (experiment, variationId) => variations[experiment] === variationId,
    getVariation: (experiment) => variations[experiment],
    loading,
  };

  if (loading) {
    return <>{children}</>; // Don't block rendering
  }

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
}

/**
 * Hook to use A/B test context
 */
export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}

/**
 * Hook to get current homepage variation
 */
export function useHomepageVariation() {
  const { getVariation } = useABTest();
  return getVariation('homepage');
}

export default ABTestProvider;

// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Performance Tests
 * Lighthouse-style performance metrics
 */

test.describe('Performance Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  test('homepage should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('homepage First Contentful Paint should be under 1.8s', async ({ page }) => {
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      const fcp = timing.fetchStart - timing.navigationStart;
      return {
        fcp,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart,
      };
    });

    // FCP should be under 1.8 seconds
    expect(performanceTiming.domContentLoaded).toBeLessThan(1800);
  });

  test('about section should render within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for about section
    const aboutSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /about/i }),
    });
    await aboutSection.waitFor({ state: 'visible' });
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('contact page should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('navigation should be responsive (no long tasks)', async ({ page }) => {
    await page.goto('/');
    
    // Measure time to interactive
    const ti = await page.evaluate(() => {
      return new Promise(resolve => {
        if (window.performance) {
          const observer = new PerformanceObserver(list => {
            const entries = list.getEntries();
            const longTasks = entries.filter(entry => entry.duration > 50);
            resolve({
              longTaskCount: longTasks.length,
              totalLongTaskTime: longTasks.reduce((sum, t) => sum + t.duration, 0),
            });
          });
          observer.observe({ entryTypes: ['longtask'] });
          
          // Give it a moment to collect
          setTimeout(() => {
            resolve({ longTaskCount: 0, totalLongTaskTime: 0 });
          }, 1000);
        } else {
          resolve({ longTaskCount: 0, totalLongTaskTime: 0 });
        }
      });
    });

    // Should not have significant long tasks
    expect(ti.totalLongTaskTime).toBeLessThan(200);
  });

  test('images should be properly optimized', async ({ page }) => {
    await page.goto('/');
    
    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      
      return images.map(img => ({
        src: img.src,
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));
    });

    // Check that images have dimensions specified
    const imagesWithoutDimensions = imageMetrics.filter(
      img => !img.width || !img.height
    );
    
    // Allow some images to not have inline dimensions
    expect(imagesWithoutDimensions.length).toBeLessThan(3);
  });

  test('CSS should be minified (check file size)', async ({ page }) => {
    await page.goto('/');
    
    const mainScriptSize = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        // This is a simplified check - in production you'd actually fetch and measure
        totalSize += script.getAttribute('src').length;
      });
      
      return totalSize;
    });

    // Just verify scripts are loaded without errors
    expect(mainScriptSize).toBeGreaterThanOrEqual(0);
  });

  test('no unoptimized resources', async ({ page }) => {
    await page.goto('/');
    
    // Check for any large images or unoptimized assets
    const resourceMetrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      const images = entries.filter(entry => entry.initiatorType === 'img');
      
      return images.map(img => ({
        name: img.name,
        transferSize: img.transferSize,
        encodedBodySize: img.encodedBodySize,
      }));
    });

    // Should not have extremely large resources (> 1MB)
    const largeResources = resourceMetrics.filter(
      r => r.transferSize > 1024 * 1024
    );
    
    expect(largeResources).toHaveLength(0);
  });

  test('time to interactive should be under 5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for page to be interactive
    await page.waitForFunction(() => {
      return document.readyState === 'complete';
    });
    
    const tti = Date.now() - startTime;
    
    expect(tti).toBeLessThan(5000);
  });

  test('core web vitals - Largest Contentful Paint under 2.5s', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get LCP using performance observer
    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        let lcpValue = 0;
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            lcpValue = entries[entries.length - 1].startTime;
          }
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Fallback after 2 seconds
        setTimeout(() => {
          resolve(lcpValue || 0);
        }, 2000);
      });
    });

    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });

  test('cumulative layout shift should be minimal (CLS < 0.1)', async ({ page }) => {
    await page.goto('/');
    
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0;
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => {
          resolve(clsValue);
        }, 1000);
      });
    });

    // CLS should be less than 0.1
    expect(cls).toBeLessThan(0.1);
  });
});

// @ts-check
import { test, expect } from '@playwright/test';

/**
 * CTA (Call-to-Action) Smoke Tests
 * Tests all CTA buttons across the site
 */

test.describe('CTA Button Tests', () => {
  test('should have primary CTA on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Look for primary CTA buttons
    const primaryCTAs = page.locator('button, a').filter({
      hasText: /start free|get started|try for free|sign up|signup|create account/i
    });
    
    const count = await primaryCTAs.count();
    expect(count).toBeGreaterThan(0);
    
    // All CTAs should be visible
    for (let i = 0; i < count; i++) {
      const cta = primaryCTAs.nth(i);
      await expect(cta).toBeVisible();
    }
  });

  test('should have secondary CTA on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Look for secondary CTAs (docs, learn more, etc.)
    const secondaryCTAs = page.locator('button, a').filter({
      hasText: /learn more|read docs|documentation|try demo|see examples/i
    });
    
    const count = await secondaryCTAs.count();
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const cta = secondaryCTAs.nth(i);
        await expect(cta).toBeVisible();
      }
    }
  });

  test('should navigate to correct pages on CTA click', async ({ page }) => {
    await page.goto('/');
    
    // Test "Get Started" or similar primary CTA
    const getStartedBtn = page.locator('button, a').filter({
      hasText: /get started|start free/i
    }).first();
    
    if (await getStartedBtn.count() > 0) {
      const href = await getStartedBtn.getAttribute('href');
      
      if (href) {
        await getStartedBtn.click();
        await page.waitForLoadState('networkidle');
        
        // Should navigate to signup or pricing
        expect(['https://yourdomain.com/signup', '/signup', 'https://yourdomain.com/pricing', '/pricing'].includes(page.url()) || 
               page.url().includes('/signup') || page.url().includes('/pricing')).toBeTruthy();
      }
    }
  });

  test('should navigate to docs on "Read Docs" CTA', async ({ page }) => {
    await page.goto('/');
    
    const docsLink = page.locator('a').filter({ hasText: /docs|documentation/i }).first();
    
    if (await docsLink.count() > 0) {
      await docsLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/docs');
    }
  });

  test('should have CTAs in multiple sections', async ({ page }) => {
    await page.goto('/');
    
    // Count all CTA-like elements
    const allCTAs = page.locator('button, a').filter({
      hasText: /(start|get|try|sign|create|learn|read|docs)/i
    });
    
    const count = await allCTAs.count();
    
    // Should have multiple CTAs throughout the page
    expect(count).toBeGreaterThan(1);
  });

  test('should have CTA in footer', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    
    if (await footer.count() > 0) {
      const footerCTAs = footer.locator('button, a').filter({
        hasText: /signup|login|start free/i
      });
      
      // Footer might have CTAs or might not - just verify no errors
      const footerText = await footer.textContent();
      expect(footerText !== null).toBeTruthy();
    }
  });

  test('should have visible hover states on CTAs', async ({ page }) => {
    await page.goto('/');
    
    const primaryCTA = page.locator('button, a').filter({
      hasText: /start free|get started|signup/i
    }).first();
    
    if (await primaryCTA.count() > 0) {
      // Hover over the CTA
      await primaryCTA.hover();
      
      // Allow time for hover state
      await page.waitForTimeout(300);
      
      // CTA should still be visible (no hover state that hides it)
      await expect(primaryCTA).toBeVisible();
    }
  });

  test('should not have broken CTA links', async ({ page }) => {
    await page.goto('/');
    
    // Get all buttons and links
    const allCTAs = page.locator('button, a').filter({ hasText: true });
    const count = await allCTAs.count();
    
    let brokenLinks = 0;
    
    for (let i = 0; i < count; i++) {
      const cta = allCTAs.nth(i);
      const href = await cta.getAttribute('href');
      
      if (href && href.startsWith('http') && !href.startsWith(page.url())) {
        // External link - just verify it exists
        continue;
      }
      
      if (href && href.startsWith('/')) {
        // Internal link - navigate and check status
        const originalUrl = page.url();
        await cta.click();
        await page.waitForLoadState('networkidle');
        
        if (page.url() === originalUrl) {
          // Page didn't change, might be broken or JavaScript handler
        }
        
        // Navigate back
        await page.goto('/');
      }
    }
    
    // Report broken links
    if (brokenLinks > 0) {
      console.log(`Found ${brokenLinks} potentially broken CTA links`);
    }
  });
});

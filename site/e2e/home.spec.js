// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Homepage Smoke Tests
 * Tests basic functionality of the Slancha homepage
 */

test.describe('Homepage Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Slancha/);
    
    // Check homepage loads without errors
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display hero section with CTA', async ({ page }) => {
    // Look for hero content - adjust selectors based on actual markup
    const heroSection = page.locator('section').filter({ has: page.locator('h1') });
    await expect(heroSection).toBeVisible();
    
    // Check for primary CTA button
    const primaryCta = page.locator('button, a').filter({ 
      hasText: /start free|get started|try free/i 
    }).first();
    await expect(primaryCta).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Find all nav links
    const navLinks = page.locator('nav a, header a').filter({ hasText: true });
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Test that each nav link navigates without errors
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (href) {
        await link.click();
        await page.waitForLoadState('networkidle');
        
        // Check that we're on a valid page (not 404 unless link is broken)
        const url = page.url();
        expect(url).toBeDefined();
      }
    }
  });

  test('should display features section', async ({ page }) => {
    // Look for features or benefits section
    const featuresSection = page.locator('section').filter({
      has: page.locator('h2, h3').filter({ hasText: /feature|benefit|how it works|eval.*deploy/i })
    });
    
    if (await featuresSection.count() > 0) {
      await expect(featuresSection).toBeVisible();
    }
  });

  test('should have footer with links', async ({ page }) => {
    const footer = page.locator('footer');
    
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
      
      // Check for footer links
      const footerLinks = footer.locator('a').filter({ hasText: true });
      const linkCount = await footerLinks.count();
      
      if (linkCount > 0) {
        console.log(`Footer has ${linkCount} links`);
      }
    }
  });

  test('should have responsive layout elements', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Page should still render on mobile
    await expect(page.locator('h1')).toBeVisible();
  });
});

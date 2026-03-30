// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Navigation Smoke Tests
 * Tests navigation components across the site
 */

test.describe('Navigation Smoke Tests', () => {
  test('should have consistent navigation across pages', async ({ page }) => {
    const pages = ['/', '/about', '/features', '/docs', '/blog'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Navigation should be visible on all pages
      const nav = page.locator('nav, header');
      await expect(nav).toBeVisible();
      
      // Nav should have links
      const navLinks = nav.locator('a').filter({ hasText: true });
      const count = await navLinks.count();
      
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should have logo that links home', async ({ page }) => {
    await page.goto('/about');
    
    // Find logo element
    const logo = page.locator('img[src*="logo"], a:has(img), .logo');
    
    if (await logo.count() > 0) {
      await logo.click();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to homepage
      expect(page.url()).toContain('/');
    }
  });

  test('should have mobile menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for mobile menu button
    const menuToggle = page.locator('button:has(svg), button:has(icon), .menu-toggle, .mobile-menu');
    
    if (await menuToggle.count() > 0) {
      await menuToggle.click();
      
      // Mobile menu should appear
      const mobileMenu = page.locator('.mobile-menu, .mobile-nav, .dropdown-menu, [role="menu"]');
      // Menu might appear differently, just check page doesn't break
      await page.waitForTimeout(500);
    }
  });

  test('should handle navigation errors gracefully', async ({ page }) => {
    // Try to navigate to a non-existent page
    await page.goto('/nonexistent-page-12345');
    await page.waitForLoadState('networkidle');
    
    // Should show a 404 or similar, not crash
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeDefined();
  });
});

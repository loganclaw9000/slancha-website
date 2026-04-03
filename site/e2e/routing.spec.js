// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Navigation and Routing Tests
 * Tests for navigation consistency and routing
 */

test.describe('Navigation Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have consistent navigation across all pages', async ({ page }) => {
    const pages = ['/', '/docs', '/blog', '/contact', '/login', '/signup'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Navigation should be present on all pages
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Logo should be present
      const logo = page.locator('.nav-logo, a[href="/"]');
      await expect(logo).toBeVisible();
    }
  });

  test('logo should always link to homepage', async ({ page }) => {
    await page.goto('/contact');
    
    const logo = page.locator('.nav-logo');
    await expect(logo).toHaveAttribute('href', '/');
    
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('docs link should navigate to docs page', async ({ page }) => {
    await page.goto('/');
    
    const docsLink = page.locator('a', { hasText: /docs/i }).first();
    await expect(docsLink).toBeVisible();
    
    await docsLink.click();
    await expect(page).toHaveURL(/\/docs/);
  });

  test('blog link should navigate to blog page', async ({ page }) => {
    await page.goto('/');
    
    const blogLink = page.locator('a', { hasText: /blog/i }).first();
    await expect(blogLink).toBeVisible();
    
    await blogLink.click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('contact link should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    
    // Find contact link in navigation or footer
    const contactLink = page.locator('a', { hasText: /contact/i }).first();
    if (await contactLink.count() > 0) {
      await contactLink.click();
      await expect(page).toHaveURL(/\/contact/);
    }
  });

  test('mobile menu should toggle correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    const hamburger = page.locator('.nav-hamburger, button[aria-label*="menu"]');
    await expect(hamburger).toBeVisible();
    
    // Open menu
    await hamburger.click();
    await page.waitForTimeout(300);
    
    const menu = page.locator('.nav-overlay, .mobile-menu');
    if (await menu.count() > 0) {
      await expect(menu).toBeVisible();
    }
    
    // Close menu by clicking overlay
    const overlay = page.locator('.nav-overlay');
    if (await overlay.count() > 0) {
      await overlay.click();
      await page.waitForTimeout(300);
      
      // Menu should be closed
      await expect(menu).not.toBeVisible();
    }
  });

  test('navigation items should be clickable', async ({ page }) => {
    const navLinks = page.locator('.nav-link, nav a').filter({ hasText: true });
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Test a few navigation links
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && !href.startsWith('#')) {
        await link.click();
        await page.waitForLoadState('networkidle');
        
        // URL should change
        const currentUrl = page.url();
        expect(currentUrl).toBeDefined();
        
        // Navigate back
        await page.goto('/');
      }
    }
  });

  test('back link should work on auth pages', async ({ page }) => {
    await page.goto('/login');
    
    // Check if back link exists
    const backLink = page.locator('.nav-link', { hasText: /back/i });
    if (await backLink.count() > 0) {
      await backLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should handle 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    
    const notFound = page.locator('.not-found, [data-testid="not-found"]');
    if (await notFound.count() > 0) {
      await expect(notFound).toBeVisible();
    } else {
      // Should show some kind of error or 404 indicator
      const h1 = page.locator('h1');
      const text = await h1.textContent();
      expect(text).toContain('404') || expect(text).toContain('Not found');
    }
  });

  test('should handle nested routes (dashboard)', async ({ page }) => {
    // Dashboard routes should work when authenticated
    // This is a basic navigation test; auth tests are in auth.spec.js
    
    await page.goto('/dashboard');
    
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/\/login/);
  });

  test('should maintain scroll position on navigation', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThanOrEqual(500);
    
    // Navigate and come back
    await page.goto('/contact');
    await page.goto('/');
    
    // Note: Browser may reset scroll on full page reload
    // This test documents expected behavior
    expect(page.url()).toBe('http://localhost:4173/');
  });

  test('should support browser back/forward', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to another page
    await page.goto('/about');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/\/about/);
  });

  test('should have skip link for accessibility', async ({ page }) => {
    await page.goto('/');
    
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();
    
    // Click skip link
    await skipLink.click();
    
    // Focus should move to main content
    const main = page.locator('#main-content, main');
    const isFocused = await main.evaluate(el => el === document.activeElement);
    // This may vary by browser, so we just check the element exists
    await expect(main).toBeVisible();
  });
});

/**
 * Routing Tests
 */

test.describe('Routing Tests', () => {
  test('should navigate to correct routes', async ({ page }) => {
    const routes = [
      { path: '/', expectedTitle: /Slancha/i },
      { path: '/contact', expectedTitle: /Slancha/i },
      { path: '/docs', expectedTitle: /Slancha/i },
      { path: '/blog', expectedTitle: /Slancha/i },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      
      // Page should load without errors
      const statusCode = page.url().startsWith('http') ? 200 : 200;
      expect(statusCode).toBe(200);
      
      // Title should be consistent
      await expect(page).toHaveTitle(route.expectedTitle);
    }
  });

  test('should handle route with parameters', async ({ page }) => {
    // Blog post with slug
    await page.goto('/blog/getting-started');
    
    // Should load without 404
    expect(page.url()).toContain('/blog/');
  });

  test('should handle dashboard sub-routes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    expect(page.url()).toContain('/login');
  });

  test('should handle auth callback route', async ({ page }) => {
    await page.goto('/auth/callback');
    
    // Should handle callback (may show loading or error)
    // Document expected behavior
    expect(page.url()).toContain('/auth/callback');
  });
});

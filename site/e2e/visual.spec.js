// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Visual Regression Tests
 * Compare screenshots against baselines
 */

test.describe('Visual Regression Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  // Homepage visual tests
  test('homepage should match baseline', async ({ page, context }) => {
    await context.tracing.start({ screenshots: true, snapshots: true });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow some minor differences
    });
    
    await context.tracing.stop({ path: 'traces/homepage.trace.zip' });
  });

  test('hero section should render correctly', async ({ page }) => {
    await page.goto('/');
    
    const heroSection = page.locator('.hero, [class*="hero"], section:has(h1:has-text(/Slancha/i))');
    if (await heroSection.count() > 0) {
      await expect(heroSection).toHaveScreenshot('hero-section.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('features section should render correctly', async ({ page }) => {
    await page.goto('/');
    
    const featuresSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /features/i }),
    });
    
    if (await featuresSection.count() > 0) {
      await expect(featuresSection).toHaveScreenshot('features-section.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('tier cards should render correctly', async ({ page }) => {
    await page.goto('/');
    
    const tierSection = page.locator('section').filter({
      has: page.locator('h2, h3', { hasText: /tier|pricing/i }),
    });
    
    if (await tierSection.count() > 0) {
      await expect(tierSection).toHaveScreenshot('tier-section.png', {
        maxDiffPixels: 50,
      });
    }
  });

  // Contact page tests
  test('contact page should match baseline', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('contact-full.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('contact form should render correctly', async ({ page }) => {
    await page.goto('/contact');
    
    const form = page.locator('form');
    await expect(form).toHaveScreenshot('contact-form.png', {
      maxDiffPixels: 30,
    });
  });

  test('contact form with validation errors', async ({ page }) => {
    await page.goto('/contact');
    
    // Submit empty form to trigger validation
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500); // Allow animations to settle
    
    const form = page.locator('form');
    await expect(form).toHaveScreenshot('contact-form-validation.png', {
      maxDiffPixels: 30,
    });
  });

  // Navigation tests
  test('navigation bar should render correctly', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav');
    await expect(nav).toHaveScreenshot('navigation.png', {
      maxDiffPixels: 20,
    });
  });

  test('mobile navigation should render correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const nav = page.locator('nav');
    await expect(nav).toHaveScreenshot('navigation-mobile.png', {
      maxDiffPixels: 20,
    });
  });

  test('mobile navigation menu should open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Click hamburger
    const hamburger = page.locator('.nav-hamburger, button[aria-label*="menu"]');
    if (await hamburger.count() > 0) {
      await hamburger.click();
      await page.waitForTimeout(300);
      
      const nav = page.locator('nav');
      await expect(nav).toHaveScreenshot('navigation-mobile-open.png', {
        maxDiffPixels: 20,
      });
    }
  });

  // Footer tests
  test('footer should render correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer.png', {
      maxDiffPixels: 30,
    });
  });

  // Responsive breakpoints
  test('homepage should render correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('homepage should render correctly on desktop large', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-desktop-large.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  // Dark mode (if supported)
  test('homepage dark mode should render correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if dark mode toggle exists
    const darkModeToggle = page.locator('button[aria-label*="dark"], button[aria-label*="theme"]');
    if (await darkModeToggle.count() > 0) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('homepage-dark.png', {
        fullPage: true,
        maxDiffPixels: 100,
      });
    }
  });

  // State-based visual tests
  test('contact form success state', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill and submit form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Mock API
    await page.route('**/*', route => {
      if (route.request().url().includes('contact') || route.request().url().includes('form')) {
        route.fulfill({
          status: 200,
          json: { success: true },
        });
      } else {
        route.continue();
      }
    });
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('.contact-success');
    
    await expect(page.locator('.contact-success')).toHaveScreenshot('contact-success.png', {
      maxDiffPixels: 30,
    });
  });
});

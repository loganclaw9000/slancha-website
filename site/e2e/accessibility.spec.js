// @ts-check
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

/**
 * Accessibility Tests (WCAG 2.1 AA Compliance)
 * Tests for accessibility compliance using axe-core
 */

test.describe('Accessibility Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  test('homepage should not have any accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('about section should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Wait for about section to be in viewport
    const aboutSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /about/i }),
    });
    await aboutSection.scrollIntoViewIfNeeded();
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('contact form should be accessible', async ({ page }) => {
    await page.goto('/contact');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('contact form labels should be properly associated', async ({ page }) => {
    await page.goto('/contact');
    
    // Check all form inputs have associated labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else {
        // Or should have aria-label
        const ariaLabel = await input.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('navigation should have proper landmarks', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Should not have missing landmark errors
    const landmarkViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'landmark' || v.id === 'landmark-one-main'
    );
    
    expect(landmarkViolations).toHaveLength(0);
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaHidden = await img.getAttribute('aria-hidden');
      
      // Either has alt text or is decorative (aria-hidden="true")
      expect(alt !== null || ariaHidden === 'true').toBeTruthy();
    }
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Should have a focus indicator
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('heading hierarchy should be correct', async ({ page }) => {
    await page.goto('/');
    
    // Get all headings
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1); // At least one H1
    
    // Check no skipped heading levels
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    
    let currentLevel = 0;
    for (const heading of headings) {
      const level = parseInt(heading.charAt(1));
      // Should not skip levels (e.g., from h1 to h3)
      expect(level - currentLevel).toBeLessThanOrEqual(1);
      currentLevel = level;
    }
  });

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    // No contrast violations for AA compliance
    expect(contrastViolations).toHaveLength(0);
  });

  test('links should have descriptive text', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Should have text content or aria-label
      expect((text && text.trim().length > 0) || ariaLabel).toBeTruthy();
    }
  });

  test('skip links should be present', async ({ page }) => {
    await page.goto('/');
    
    const skipLink = page.locator('a[href="#main-content"], a[href="#main"]');
    await expect(skipLink).toBeVisible();
  });

  test('error messages should be announced to screen readers', async ({ page }) => {
    await page.goto('/contact');
    
    // Trigger form validation errors
    await page.click('button[type="submit"]');
    
    // Check for aria-live regions or error roles
    const alerts = page.locator('[role="alert"], [aria-live="assertive"], [aria-live="polite"]');
    const count = await alerts.count();
    
    // Should have at least one live region for errors
    expect(count).toBeGreaterThan(0);
  });
});

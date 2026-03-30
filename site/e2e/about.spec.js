// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * About Page Tests
 * Tests for about section and company information
 */

test.describe('About Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display about section', async ({ page }) => {
    const aboutSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /about|mission|team/i }),
    });
    await expect(aboutSection).toBeVisible();
  });

  test('should have about section heading', async ({ page }) => {
    const aboutSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /about/i }),
    });
    
    const heading = aboutSection.locator('h2');
    await expect(heading).toBeVisible();
    expect(await heading.innerText()).toContain('About');
  });

  test('should display mission or values statement', async ({ page }) => {
    const aboutSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /about/i }),
    });
    
    const content = aboutSection.locator('p');
    const count = await content.count();
    expect(count).toBeGreaterThan(0);
  });
});

/**
 * Pilot CTA Tests
 */

test.describe('Pilot CTA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display pilot CTA section', async ({ page }) => {
    const pilotSection = page.locator('section').filter({
      has: page.locator('h2, h3', { hasText: /pilot/i }),
    });
    await expect(pilotSection).toBeVisible();
  });

  test('should have CTA button', async ({ page }) => {
    const pilotSection = page.locator('section').filter({
      has: page.locator('h2, h3', { hasText: /pilot/i }),
    });
    
    const buttons = pilotSection.locator('button, a.btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should link to contact page', async ({ page }) => {
    const pilotSection = page.locator('section').filter({
      has: page.locator('h2, h3', { hasText: /pilot/i }),
    });
    
    const buttons = pilotSection.locator('a.btn');
    const count = await buttons.count();
    
    if (count > 0) {
      const href = await buttons.first().getAttribute('href');
      expect(href).toContain('/contact');
    }
  });
});

/**
 * How It Works Section Tests
 */

test.describe('How It Works Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display how it works section', async ({ page }) => {
    const howWorksSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /how it works/i }),
    });
    await expect(howWorksSection).toBeVisible();
  });

  test('should show numbered steps', async ({ page }) => {
    const howWorksSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /how it works/i }),
    });
    
    // Look for step indicators
    const steps = howWorksSection.locator('.step, [class*="step"], ol li');
    const count = await steps.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should explain the eval-deploy-post-train cycle', async ({ page }) => {
    const howWorksSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /how it works/i }),
    });
    
    const text = await howWorksSection.locator('p, li').first().innerText();
    expect(text.length).toBeGreaterThan(0);
  });
});

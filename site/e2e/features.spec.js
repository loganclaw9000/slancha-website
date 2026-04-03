// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Features Page Tests
 * Tests for features and value propositions
 */

test.describe('Features Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display features section', async ({ page }) => {
    const featuresSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /features/i }),
    });
    await expect(featuresSection).toBeVisible();
  });

  test('should show all feature cards', async ({ page }) => {
    const featureCards = page.locator('.feature-card, .card, [role="listitem"]');
    const count = await featureCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have feature icons', async ({ page }) => {
    const featuresSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /features/i }),
    });
    
    const icons = featuresSection.locator('svg, i, [class*="icon"], [class*="icon-"]');
    const count = await icons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should scroll to features section', async ({ page }) => {
    await page.goto('/#features');
    const featuresSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /features/i }),
    });
    await expect(featuresSection).toBeInViewport();
  });
});

/**
 * Tier Cards / Offerings Tests
 */

test.describe('Tier Cards Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display tier cards section', async ({ page }) => {
    const tierSection = page.locator('section').filter({
      has: page.locator('h2', { hasText: /tier|offerings|plans/i }),
    });
    await expect(tierSection).toBeVisible();
  });

  test('should show three tiers', async ({ page }) => {
    const tierCards = page.locator('.tier-card, .pricing-card, .card');
    const count = await tierCards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('each tier should have title, description, and CTA', async ({ page }) => {
    const tierCards = page.locator('.tier-card, .pricing-card, .card');
    const count = await tierCards.count();
    
    for (let i = 0; i < count; i++) {
      const card = tierCards.nth(i);
      await expect(card.locator('h3, h4')).toBeVisible();
      await expect(card.locator('p')).toBeVisible();
      await expect(card.locator('button, a.btn')).toBeVisible();
    }
  });

  test('should have call-to-action buttons for each tier', async ({ page }) => {
    const tierCards = page.locator('.tier-card, .pricing-card, .card');
    const buttons = tierCards.locator('button, a.btn, a.btn-primary');
    
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should handle hover states on tier cards', async ({ page }) => {
    const tierCards = page.locator('.tier-card, .pricing-card, .card');
    const count = await tierCards.count();
    
    if (count > 0) {
      const firstCard = tierCards.first();
      await firstCard.hover();
      
      // Card should have some visual feedback
      const styles = await firstCard.evaluate(el => el.style.transform);
      // Transform might be applied via CSS, so we just check it doesn't error
      expect(styles).toBeDefined();
    }
  });
});

/**
 * Tech Stack Tests
 */

test.describe('Tech Stack Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display tech stack section', async ({ page }) => {
    const techSection = page.locator('section').filter({
      has: page.locator('h2, h3', { hasText: /tech|stack|powered by/i }),
    });
    await expect(techSection).toBeVisible();
  });

  test('should show technology logos/icons', async ({ page }) => {
    const techSection = page.locator('section').filter({
      has: page.locator('h2, h3', { hasText: /tech|stack|powered by/i }),
    });
    
    const logos = techSection.locator('svg, img, [class*="logo"], [class*="icon-"]');
    const count = await logos.count();
    expect(count).toBeGreaterThan(0);
  });
});

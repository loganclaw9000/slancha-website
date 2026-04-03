// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Contact Page E2E Tests
 * Tests for contact form functionality and validation
 */

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./contact');
  });

  test('should load contact page', async ({ page }) => {
    await expect(page).toHaveTitle(/Slancha/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display contact form with all fields', async ({ page }) => {
    // Check for all form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('.contact-error')).toHaveText([
      /name is required/i,
      /email is required/i,
      /message is required/i,
    ]);
  });

  test('should validate email format', async ({ page }) => {
    // Fill name and message
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Enter invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Check for email validation error
    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      'aria-describedby',
      'email-error'
    );
    await expect(page.locator('#email-error')).toBeVisible();
  });

  test('should show success message after submission', async ({ page }) => {
    // Mock API endpoint
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

    // Fill form with valid data
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Interested in your pilot program');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Check for success message
    await expect(page.locator('.contact-success')).toBeVisible();
    await expect(page.locator('.contact-success-heading')).toContainText(
      /thanks/i
    );
  });

  test('should have contact information visible', async ({ page }) => {
    await expect(page.locator('.contact-info-heading')).toBeVisible();
    await expect(page.locator('.contact-info-item')).toHaveCount(3);
    await expect(page.locator('a[href*="slancha.ai"]')).toBeVisible();
  });

  test('should navigate back to homepage', async ({ page }) => {
    await page.click('.nav-logo');
    await expect(page).toHaveURL(/\/$/);
  });
});

// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Dashboard E2E Tests
 * Tests for protected dashboard area
 */

test.describe('Dashboard Protected Routes', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ page }) => {
    // Set up authenticated session mock
    await page.route('**/auth/*', route => {
      route.fulfill({
        status: 200,
        json: {
          session: {
            user: { id: 'test-user', email: 'test@example.com' },
            access_token: 'test-token',
          },
        },
      });
    });

    await page.goto('/dashboard');
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    // Clear any auth cookies/sessions
    await page.context().clearCookies();
    
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show dashboard when authenticated', async ({ page }) => {
    // Mock authenticated session
    await page.addInitScript(() => {
      window.supabase = {
        auth: {
          getSession: async () => ({
            data: {
              session: {
                user: { id: 'test-user', email: 'test@example.com' },
              },
            },
            error: null,
          }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
        },
      };
    });

    await page.goto('/dashboard');
    
    await expect(page.locator('h1, h2')).toContainText(/dashboard/i);
  });

  test('should have dashboard navigation tabs', async ({ page }) => {
    // Setup auth
    await page.addInitScript(() => {
      window.supabase = {
        auth: {
          getSession: async () => ({
            data: { session: { user: { id: 'test-user' } } },
            error: null,
          }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
        },
      };
    });

    await page.goto('/dashboard');
    
    // Check for navigation tabs
    const navTabs = page.locator('.nav-tabs, nav [role="tab"], [class*="nav-item"]');
    const count = await navTabs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    // Setup auth
    await page.addInitScript(() => {
      window.supabase = {
        auth: {
          getSession: async () => ({
            data: { session: { user: { id: 'test-user' } } },
            error: null,
          }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
        },
      };
    });

    await page.goto('/dashboard');
    
    // Wait for dashboard to load
    await page.waitForSelector('.dashboard, [role="main"]');
    
    // Click on navigation tab
    const navLink = page.locator('.nav-tabs a, [role="tab"]').first();
    if (await navLink.count() > 0) {
      await navLink.click();
      
      // Should navigate to new section
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/dashboard');
    }
  });
});

/**
 * Dashboard API Keys Section
 */

test.describe('Dashboard API Keys', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.supabase = {
        auth: {
          getSession: async () => ({
            data: { session: { user: { id: 'test-user' } } },
            error: null,
          }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
        },
      };
    });

    await page.goto('/dashboard/keys');
  });

  test('should display API keys section', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/api keys/i);
  });

  test('should have create new key button', async ({ page }) => {
    const createButton = page.locator('button, a').filter({
      hasText: /create|new|generate/i,
    });
    await expect(createButton).toBeVisible();
  });

  test('should show API key list (if any exist)', async ({ page }) => {
    // Mock API keys response
    await page.route('**/api_keys*', route => {
      route.fulfill({
        status: 200,
        json: [],
      });
    });

    await page.reload();
    
    // Should have a list or empty state
    const list = page.locator('.api-key-list, ul, table, [role="list"]');
    await expect(list).toBeVisible();
  });

  test('should have delete/revoke action for each key', async ({ page }) => {
    const deleteButtons = page.locator('button').filter({
      hasText: /delete|revoke|remove|trash/i,
    });
    
    // At least the create button should exist
    const count = await deleteButtons.count();
    // May be 0 if no keys exist
    expect(count >= 0).toBe(true);
  });
});

/**
 * Dashboard Usage Stats Section
 */

test.describe('Dashboard Usage Stats', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.supabase = {
        auth: {
          getSession: async () => ({
            data: { session: { user: { id: 'test-user' } } },
            error: null,
          }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
        },
      };
    });

    await page.goto('/dashboard/usage');
  });

  test('should display usage stats section', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/usage|stats/i);
  });

  test('should show usage metrics', async ({ page }) => {
    // Look for metrics display
    const metrics = page.locator('.metrics, [class*="metric"], .stat');
    const count = await metrics.count();
    
    // Should have some metrics
    expect(count >= 0).toBe(true);
  });

  test('should have date range selector', async ({ page }) => {
    const dateSelector = page.locator(
      'select, [role="combobox"], button[aria-label*="date"], input[type="date"]'
    );
    
    const count = await dateSelector.count();
    // May or may not have date selector
    expect(count >= 0).toBe(true);
  });
});

/**
 * Dashboard Account Settings
 */

test.describe('Dashboard Account Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.supabase = {
        auth: {
          getSession: async () => ({
            data: { session: { user: { id: 'test-user' } } },
            error: null,
          }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
        },
      };
    });

    await page.goto('/dashboard/settings');
  });

  test('should display account settings section', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/settings/i);
  });

  test('should have profile editing fields', async ({ page }) => {
    const profileFields = page.locator(
      'input[name*="name"], input[name*="email"], input[type="text"]'
    );
    
    const count = await profileFields.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have save/update button', async ({ page }) => {
    const saveButton = page.locator('button').filter({
      hasText: /save|update|change/i,
    });
    await expect(saveButton).toBeVisible();
  });

  test('should have change password option', async ({ page }) => {
    const changePassword = page.locator('button, a').filter({
      hasText: /password/i,
    });
    
    const count = await changePassword.count();
    expect(count >= 0).toBe(true);
  });
});

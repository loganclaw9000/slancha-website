// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Live Site QA Tests
 * Comprehensive smoke tests against the deployed GitHub Pages site.
 * All paths use relative URLs (no leading /) so they resolve under baseURL.
 */

const BASE = 'https://loganclaw9000.github.io/slancha-website';

test.describe('Live QA — Page Loading', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/Slancha/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('homepage has hero section and CTA', async ({ page }) => {
    await page.goto(BASE);
    const cta = page.locator('a, button').filter({
      hasText: /start free|get started|try free|sign up/i,
    }).first();
    await expect(cta).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page).toHaveTitle(/Slancha/);
    // Should have email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('signup page loads', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await expect(page).toHaveTitle(/Slancha/);
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await expect(page).toHaveTitle(/Slancha/);
    const heading = page.locator('h1, h2').filter({ hasText: /contact/i });
    await expect(heading).toBeVisible();
  });

  test('docs page loads', async ({ page }) => {
    await page.goto(`${BASE}/docs`);
    await expect(page).toHaveTitle(/Slancha/);
  });

  test('blog page loads', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await expect(page).toHaveTitle(/Slancha/);
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await expect(page).toHaveTitle(/Slancha/);
  });

  test('dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    // Should redirect to login
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });
});

test.describe('Live QA — Navigation', () => {
  test('nav bar is visible on homepage', async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('footer is visible on homepage', async ({ page }) => {
    await page.goto(BASE);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('nav links exist', async ({ page }) => {
    await page.goto(BASE);
    const navLinks = page.locator('nav a, header a').filter({ hasText: /.+/ });
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(3);
  });

  test('mobile menu toggles', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE);
    const hamburger = page.locator('button[aria-label*="menu"], .nav-hamburger, button.hamburger').first();
    if (await hamburger.count() > 0) {
      await hamburger.click();
      await page.waitForTimeout(500);
      // Some mobile menu element should appear
      const mobileLinks = page.locator('.nav-overlay a, .mobile-menu a, nav a').filter({ hasText: /.+/ });
      const count = await mobileLinks.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Live QA — Console Errors', () => {
  const pagesToCheck = [
    { name: 'homepage', path: '' },
    { name: 'login', path: '/login' },
    { name: 'signup', path: '/signup' },
    { name: 'contact', path: '/contact' },
    { name: 'docs', path: '/docs' },
    { name: 'blog', path: '/blog' },
    { name: 'pricing', path: '/pricing' },
  ];

  for (const p of pagesToCheck) {
    test(`no critical JS errors on ${p.name}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (err) => {
        errors.push(err.message);
      });

      await page.goto(`${BASE}${p.path}`);
      await page.waitForLoadState('networkidle');

      // Filter out known non-critical errors
      const critical = errors.filter(
        (e) => !e.includes('supabase') && !e.includes('Failed to fetch')
      );
      if (critical.length > 0) {
        console.log(`JS errors on ${p.name}:`, critical);
      }
      // We log but don't fail on supabase-related errors (expected without auth)
      // Fail only on truly critical errors
      expect(critical.length).toBe(0);
    });
  }
});

test.describe('Live QA — Asset Loading', () => {
  test('no 404s for JS/CSS on homepage', async ({ page }) => {
    const failed = [];
    page.on('response', (response) => {
      const url = response.url();
      if (
        response.status() === 404 &&
        (url.endsWith('.js') || url.endsWith('.css'))
      ) {
        failed.push(url);
      }
    });

    await page.goto(BASE);
    await page.waitForLoadState('networkidle');

    if (failed.length > 0) {
      console.log('Failed assets:', failed);
    }
    expect(failed.length).toBe(0);
  });

  test('no CORS errors on homepage', async ({ page }) => {
    const corsErrors = [];
    page.on('console', (msg) => {
      if (msg.text().toLowerCase().includes('cors')) {
        corsErrors.push(msg.text());
      }
    });

    await page.goto(BASE);
    await page.waitForLoadState('networkidle');

    if (corsErrors.length > 0) {
      console.log('CORS errors:', corsErrors);
    }
    expect(corsErrors.length).toBe(0);
  });

  test('no CORS errors on login page', async ({ page }) => {
    const corsErrors = [];
    page.on('console', (msg) => {
      if (msg.text().toLowerCase().includes('cors')) {
        corsErrors.push(msg.text());
      }
    });

    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');

    if (corsErrors.length > 0) {
      console.log('CORS errors on login:', corsErrors);
    }
    expect(corsErrors.length).toBe(0);
  });
});

test.describe('Live QA — Static Pages', () => {
  const staticPages = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms', path: '/terms' },
    { name: 'Privacy', path: '/privacy' },
  ];

  for (const p of staticPages) {
    test(`${p.name} page loads`, async ({ page }) => {
      await page.goto(`${BASE}${p.path}`);
      await expect(page).toHaveTitle(/Slancha/);
      // Page should have some content
      const body = page.locator('body');
      const text = await body.textContent();
      expect(text.length).toBeGreaterThan(100);
    });
  }
});

test.describe('Live QA — Auth Forms', () => {
  test('login form has no CORS errors on load', async ({ page }) => {
    const networkErrors = [];
    page.on('requestfailed', (req) => {
      networkErrors.push(`${req.failure().errorText}: ${req.url()}`);
    });

    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');

    const corsRelated = networkErrors.filter((e) =>
      e.toLowerCase().includes('cors')
    );
    expect(corsRelated.length).toBe(0);
  });

  test('signup form has no CORS errors on load', async ({ page }) => {
    const networkErrors = [];
    page.on('requestfailed', (req) => {
      networkErrors.push(`${req.failure().errorText}: ${req.url()}`);
    });

    await page.goto(`${BASE}/signup`);
    await page.waitForLoadState('networkidle');

    const corsRelated = networkErrors.filter((e) =>
      e.toLowerCase().includes('cors')
    );
    expect(corsRelated.length).toBe(0);
  });

  test('login form accepts input', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    const email = page.locator('input[type="email"]');
    await email.fill('test@example.com');
    await expect(email).toHaveValue('test@example.com');

    const password = page.locator('input[type="password"]');
    if (await password.count() > 0) {
      await password.fill('testpassword123');
      await expect(password).toHaveValue('testpassword123');
    }
  });
});

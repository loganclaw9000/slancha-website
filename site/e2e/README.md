# Playwright E2E Tests for Slancha

Smoke tests for the Slancha website covering homepage, navigation, authentication, and CTA functionality.

## Setup

### 1. Install Playwright Browsers

```bash
npx playwright install --with-deps chromium
```

> Note: Requires sudo access to install system dependencies.

### 2. Configure Environment

Copy `.env.example` to `.env.local` and set your base URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_BASE_URL=http://localhost:4173
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with browser visible (headless by default)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Generate test report
```bash
# First run tests, then:
npm run test:report
```

## Test Coverage

### Homepage Tests (`home.spec.js`)
- ✅ Page loads successfully
- ✅ Hero section with CTA displays
- ✅ Navigation links work
- ✅ Features section renders
- ✅ Footer with links exists
- ✅ Responsive layout (mobile viewport)

### Navigation Tests (`navigation.spec.js`)
- ✅ Consistent navigation across pages
- ✅ Logo links to homepage
- ✅ Mobile menu toggle
- ✅ Error handling for invalid pages

### Authentication Tests (`auth.spec.js`)
- ✅ Login page loads
- ✅ Signup page loads
- ✅ Forgot password link works
- ✅ Link from login to signup
- ✅ Auth callback handling
- ✅ Auth state indicators

### CTA Tests (`cta.spec.js`)
- ✅ Primary CTA on homepage
- ✅ Secondary CTA (docs, learn more)
- ✅ CTA navigation works
- ✅ Multiple CTAs across sections
- ✅ Hover states functional
- ✅ No broken links

## Test Configuration

- **Base URL**: Configurable via `VITE_BASE_URL` env var
- **Retry**: 2 retries on CI, 0 locally
- **Tracing**: Enabled on first retry
- **Screenshots**: Captured on failure
- **Video**: Captured on failure
- **Web Server**: Automatically starts `npm run preview` before tests

## Browser Support

Tests run on:
- Chrome (Desktop)
- Firefox (Desktop)
- Safari (Desktop)

## Troubleshooting

### "Browser not installed"
```bash
npx playwright install chromium
```

### "Web server not starting"
- Verify `.env.local` has correct `VITE_BASE_URL`
- Ensure `npm run preview` works manually first
- Check that build completed successfully: `npm run build`

### Tests failing on specific pages
- Update selectors based on current DOM structure
- Check for dynamic content that needs waiting

## Adding New Tests

1. Create new spec file in `e2e/` or add to existing spec
2. Use `test.describe()` for grouping related tests
3. Use `test()` for individual test cases
4. Follow the pattern: setup → action → assert

Example:
```javascript
test('should do something', async ({ page }) => {
  await page.goto('/page');
  await page.click('button');
  await expect(page.locator('.result')).toBeVisible();
});
```

## CI Integration

Tests are configured to:
- Run with 2 retries on CI
- Run sequentially on CI
- Capture traces for debugging
- Fail build if tests fail

## Maintenance

- Update selectors when DOM structure changes
- Review and update test coverage quarterly
- Remove tests for deprecated features

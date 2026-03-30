# Test Suite Documentation

Comprehensive testing suite for Slancha website and user database.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install --with-deps

# 3. Copy environment file
cp .env.example .env.local

# 4. Run all tests
npm run test

# 5. Run specific test type
npm run test:e2e        # E2E tests
npm run test:unit       # Unit tests
npm run test:components # Component tests
npm run test:a11y       # Accessibility tests
npm run test:visual     # Visual regression tests
npm run test:perf       # Performance tests
npm run test:db         # Database tests
```

## Test Coverage

### Unit Tests (Vitest)
Location: `__tests__/`
- Utility functions (validation, formatting)
- Custom hooks (auth, data fetching)
- Pure functions

**Run:** `npm run test:unit` or `npm run test:components`

### Component Tests (React Testing Library + Vitest)
Location: `__tests__/components/`, `__tests__/pages/`
- Individual React components
- Form interactions
- State management
- Props validation

**Run:** `npm run test:components`

### E2E Tests (Playwright)
Location: `e2e/`
- Homepage and marketing pages
- Authentication flows
- Dashboard and protected routes
- Form submissions
- Navigation

**Run:** `npm run test:e2e`

**Headed mode:** `npm run test:e2e:headed`

**UI mode:** `npm run test:e2e:ui`

### Accessibility Tests (Playwright + axe-core)
Location: `e2e/accessibility.spec.js`
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- ARIA attributes
- Color contrast
- Heading hierarchy

**Run:** `npm run test:a11y`

### Visual Regression Tests (Playwright)
Location: `e2e/visual.spec.js`
- Full page screenshots
- Component screenshots
- State-based screenshots (hover, validation, etc.)
- Responsive breakpoints
- Dark mode (if applicable)

**Update baselines:** `npm run test:visual:update`

**Run:** `npm run test:visual`

### Performance Tests (Playwright)
Location: `e2e/performance.spec.js`
- Load time metrics
- First Contentful Paint
- Time to Interactive
- Largest Contentful Paint
- Cumulative Layout Shift
- Core Web Vitals

**Run:** `npm run test:perf`

### Database Tests (Playwright + Supabase)
Location: `e2e/database.spec.js`
- User authentication (signup, login, logout)
- Profile CRUD operations
- API key management
- Usage log tracking
- Row Level Security (RLS) policies
- Data validation
- Security (SQL injection prevention)

**Run:** `npm run test:db`

**Requires:** Supabase test instance configuration

## Test Structure

```
site/
├── __tests__/                    # Unit and component tests
│   ├── setup.js                 # Test setup and mocks
│   ├── utils/                   # Utility function tests
│   ├── hooks/                   # Custom hook tests
│   ├── components/              # Component tests
│   │   ├── Nav.test.jsx
│   │   ├── Hero.test.jsx
│   │   └── dashboard/
│   └── pages/                   # Page component tests
│
├── __mocks__/                    # Mock modules
│   ├── supabase.js
│   └── react-router-dom.js
│
├── e2e/                          # End-to-end tests
│   ├── auth.spec.js             # Authentication flows
│   ├── homepage.spec.js         # Homepage tests
│   ├── navigation.spec.js       # Navigation tests
│   ├── contact.spec.js          # Contact form tests
│   ├── features.spec.js         # Features page tests
│   ├── offerings.spec.js        # Offerings tests
│   ├── about.spec.js            # About page tests
│   ├── dashboard.spec.js        # Protected dashboard tests
│   ├── accessibility.spec.js    # WCAG compliance
│   ├── performance.spec.js      # Performance metrics
│   ├── visual.spec.js           # Visual regression
│   └── database.spec.js         # Database integration
│
├── scripts/                      # Test utilities
│   ├── seed-test-data.js        # Seed test database
│   ├── cleanup-test-data.js     # Cleanup after tests
│   └── generate-baseline.js     # Generate visual baselines
│
├── .github/workflows/
│   └── test.yml                 # CI/CD configuration
│
├── vitest.config.js             # Vitest configuration
├── playwright.config.js         # Playwright configuration
└── TESTING.md                   # Testing documentation
```

## CI/CD Integration

Tests run automatically on:
- Push to main branch
- Pull requests to main
- Daily scheduled runs (2 AM UTC)
- Manual workflow trigger

Artifacts uploaded:
- Playwright HTML report
- Test traces
- Coverage reports
- Visual diff images
- Accessibility report
- Performance report

## Mocking External Services

### Supabase Mock

```javascript
// __mocks__/supabase.js
export const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }),
};
```

### Router Mock

```javascript
// __mocks__/react-router-dom.js
export const useNavigate = vi.fn();
export const useParams = vi.fn();
export const useLocation = vi.fn();
```

## Test Best Practices

1. **One assertion per test**: Each test should verify a single behavior
2. **Descriptive names**: `should display error when form is empty` not `test1`
3. **Arrange-Act-Assert**: Structure tests in three clear sections
4. **Independent tests**: Tests should not depend on each other
5. **Mock external deps**: Never test real API calls in unit tests
6. **Clean up**: Reset mocks and state after each test
7. **Accessibility first**: Include a11y tests for UI components
8. **Performance conscious**: Test for performance budgets

## Troubleshooting

### Tests fail to start
```bash
# Install Playwright browsers
npx playwright install --with-deps

# Verify environment
cp .env.example .env.local
# Edit .env.local with correct values
```

### Visual regression differences
```bash
# Review baseline images
ls __playwright__/baseline/

# Update baselines if changes are intentional
npm run test:visual:update
```

### Database tests fail
```bash
# Check Supabase connection
# Verify test instance is running
# Ensure RLS policies are configured correctly

# Run cleanup after tests
npm run test:fixtures:clean
```

### Performance tests slow
```bash
# Check network connectivity
# Ensure server is running locally
# Increase timeouts in test files
```

## Adding New Tests

1. **Unit tests**: Create file in `__tests__/utils/` or `__tests__/hooks/`
2. **Component tests**: Create file in `__tests__/components/` or `__tests__/pages/`
3. **E2E tests**: Create file in `e2e/` with `.spec.js` extension
4. **Use test.describe()** for grouping related tests
5. **Use test()** for individual test cases
6. **Follow naming convention**: `should [expected behavior]`

Example:
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });
});
```

## Metrics and Reporting

### Coverage Goals
- Unit tests: 80%+ coverage
- Component tests: All components tested
- E2E tests: Critical user flows covered
- Accessibility: WCAG 2.1 AA compliance
- Performance: Lighthouse score 90+

### Report Generation
```bash
# Generate coverage report
npm run test:coverage

# Open coverage report
open coverage/index.html

# View Playwright report
npm run test:report
```

## Contributing

When adding tests:
1. Identify the feature to test
2. Choose appropriate test type (unit/component/E2E)
3. Write tests following conventions
4. Update documentation if needed
5. Ensure all tests pass before PR

## Resources

- [Playwright Documentation](https://playwright.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe-core](https://www.deque.com/axe/)

---

This testing suite is designed to detect regressions early and ensure code quality across the Slancha platform.

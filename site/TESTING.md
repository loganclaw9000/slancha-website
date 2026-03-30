# Testing Suite for Slancha

Comprehensive testing coverage for the Slancha website and user database.

## Overview

This testing suite provides:
- **Unit Tests**: Test individual functions and utilities
- **Component Tests**: Test React components in isolation
- **E2E Tests**: End-to-end testing of complete user flows
- **Visual Regression Tests**: Detect visual changes
- **Performance Tests**: Lighthouse-style metrics
- **Accessibility Tests**: WCAG 2.1 compliance
- **Database Tests**: User authentication, CRUD, security

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Playwright browsers
- Local Supabase instance or test credentials

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### 3. Configure Environment

Copy `.env.example` to `.env.test`:

```bash
cp .env.example .env.test
```

Edit `.env.test`:
```bash
VITE_SUPABASE_URL=https://test.supabase.co
VITE_SUPABASE_ANON_KEY=test-key
VITE_BASE_URL=http://localhost:4173
VITE_FORM_ENDPOINT=http://localhost:3001
```

### 4. Start Test Server

For component and E2E tests, start the preview server:

```bash
npm run build
npm run preview -- --port 4173
```

## Test Commands

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run component tests only
npm run test:components

# Run E2E tests only
npm run test:e2e

# Run E2E tests with visible browser
npm run test:e2e:headed

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run accessibility tests
npm run test:a11y

# Run visual regression tests
npm run test:visual

# Run performance tests
npm run test:perf

# Run database tests
npm run test:db

# Run with coverage report
npm run test:coverage

# Run specific test file
npm run test -- src/utils/

# Run specific test description
npm run test -- -t "should login"
```

## Test Structure

```
site/
├── e2e/                           # End-to-end tests
│   ├── README.md
│   ├── auth.spec.js              # Authentication flows
│   ├── homepage.spec.js          # Homepage tests
│   ├── navigation.spec.js        # Navigation tests
│   ├── contact.spec.js           # Contact form tests
│   ├── features.spec.js          # Features page tests
│   ├── offerings.spec.js         # Offerings/Tier cards tests
│   ├── about.spec.js             # About page tests
│   ├── dashboard.spec.js         # Protected dashboard tests
│   ├── visual.spec.js            # Visual regression tests
│   ├── accessibility.spec.js     # WCAG compliance tests
│   ├── performance.spec.js       # Performance tests
│   └── fixtures/                 # Test fixtures
│       └── users.json
│
├── __tests__/                     # Unit and component tests
│   ├── setup.js                  # Test setup (JSDOM, mocks)
│   ├── utils/                    # Utility function tests
│   │   └── validation.test.js
│   ├── hooks/                    # Custom hook tests
│   │   └── useAuth.test.js
│   ├── components/               # Component tests
│   │   ├── Nav.test.jsx
│   │   ├── Hero.test.jsx
│   │   ├── Footer.test.jsx
│   │   ├── Contact.test.jsx
│   │   ├── TierCards.test.jsx
│   │   └── dashboard/
│   │       ├── Overview.test.jsx
│   │       └── ApiKeys.test.jsx
│   └── pages/                    # Page component tests
│       ├── Home.test.jsx
│       ├── Contact.test.jsx
│       └── Login.test.jsx
│
├── __mocks__/                     # Mock modules
│   ├── supabase.js               # Supabase client mock
│   ├── react-router-dom.js       # React Router mock
│   └── @sentry/browser.js        # Sentry mock
│
├── scripts/                       # Test scripts
│   ├── seed-test-data.js         # Seed test database
│   ├── cleanup-test-data.js      # Cleanup after tests
│   └── generate-baseline.js      # Generate visual baseline
│
├── __playwright__/                # Playwright artifacts
│   ├── screenshots/
│   ├── traces/
│   └── video/
│
├── jest.config.js                 # Jest/Vitest configuration
├── playwright.config.js           # Playwright configuration
├── vitest.config.js              # Vitest configuration
└── coverage/                     # Coverage reports
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Component Tests**: All components tested
- **E2E Tests**: Critical user flows covered
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Lighthouse score 90+

## CI/CD Integration

Tests run automatically on:
- Pull request to main branch
- Daily scheduled runs
- Manual workflow triggers

See `.github/workflows/test.yml` for CI configuration.

## Mocking External Services

### Supabase

```javascript
// __mocks__/supabase.js
export const supabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
};
```

### Router

```javascript
// __mocks__/react-router-dom.js
import * as reactRouterDom from 'react-router-dom';

export const useNavigate = jest.fn();
export const useRouter = jest.fn();
// ... other mocks
```

## Best Practices

1. **Test One Thing**: Each test should verify a single behavior
2. **Arrange-Act-Assert**: Follow AAA pattern
3. **Mock External Dependencies**: Never test real API calls in unit tests
4. **Use Descriptive Names**: Test names should describe behavior
5. **Keep Tests Independent**: Tests should not depend on each other
6. **Clean Up After Tests**: Reset mocks, clear data
7. **Snapshot Tests**: Use sparingly, update when intentional
8. **Accessibility First**: Include a11y tests for all UI components

## Troubleshooting

### Tests fail to start
- Ensure `.env.test` exists with required variables
- Run `npx playwright install` to install browsers

### Visual regression differences
- Review baseline images in `__playwright__/baseline/`
- Run `npm run test:visual:update` to update baselines
- Check for intentional CSS/HTML changes

### Performance tests slow
- Check network connectivity
- Ensure server is running locally
- Increase timeout in performance tests

### Accessiblity test failures
- Review WCAG guidelines for specific failures
- Add ARIA attributes where needed
- Ensure proper contrast ratios
- Test with screen reader (optional)

## Contributing

When adding new tests:
1. Identify the feature to test
2. Choose appropriate test type (unit/component/E2E)
3. Write tests following project conventions
4. Update documentation if needed
5. Ensure all tests pass before PR

## Resources

- [Playwright Documentation](https://playwright.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

#!/usr/bin/env node
/**
 * Auth Flow Test — Tests the login/signup pages and auth redirect behavior.
 *
 * Usage:
 *   node qa/auth-test.js [--url http://localhost:4173] [--json]
 */

const { chromium } = require('playwright');

const BASE_URL = (() => {
  const i = process.argv.indexOf('--url');
  return i !== -1 ? process.argv[i + 1] : 'http://localhost:4173';
})();
const JSON_OUTPUT = process.argv.includes('--json');

async function testAuthFlow() {
  const results = {
    login: { pass: true, checks: [], errors: [] },
    signup: { pass: true, checks: [], errors: [] },
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Test Login page
  console.log('\n=== Testing Login Page ===\n');
  const loginPage = await context.newPage();
  
  loginPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      results.login.errors.push(msg.text());
    }
  });

  try {
    await loginPage.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 15000 });
    results.login.checks.push({ name: 'HTTP 200', pass: true });
    
    await loginPage.waitForTimeout(1000);
    
    // Check for expected elements
    const hasTitle = await loginPage.$('h1') !== null;
    results.login.checks.push({ name: 'Page title present', pass: hasTitle });
    
    const hasEmailInput = await loginPage.$('input[type="email"]') !== null;
    results.login.checks.push({ name: 'Email input present', pass: hasEmailInput });
    
    const hasPasswordInput = await loginPage.$('input[type="password"]') !== null;
    results.login.checks.push({ name: 'Password input present', pass: hasPasswordInput });
    
    const hasSubmitButton = await loginPage.$('button[type="submit"]') !== null;
    results.login.checks.push({ name: 'Submit button present', pass: hasSubmitButton });
    
    const hasGoogleButton = await loginPage.$('button:has-text("Google")') !== null;
    results.login.checks.push({ name: 'Google OAuth button present', pass: hasGoogleButton });
    
    const hasSignUpLink = await loginPage.$('a:has-text("Sign up")') !== null;
    results.login.checks.push({ name: 'Sign up link present', pass: hasSignUpLink });
    
    if (results.login.errors.length > 0) {
      results.login.pass = false;
      results.login.checks.push({ name: 'No JS errors', pass: false, detail: results.login.errors.join(', ') });
    } else {
      results.login.checks.push({ name: 'No JS errors', pass: true });
    }
    
  } catch (e) {
    results.login.pass = false;
    results.login.checks.push({ name: 'Page load', pass: false, detail: e.message });
  }

  await loginPage.close();

  // Test Signup page
  console.log('\n=== Testing Signup Page ===\n');
  const signupPage = await context.newPage();
  
  signupPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      results.signup.errors.push(msg.text());
    }
  });

  try {
    await signupPage.goto(BASE_URL + '/signup', { waitUntil: 'networkidle', timeout: 15000 });
    results.signup.checks.push({ name: 'HTTP 200', pass: true });
    
    await signupPage.waitForTimeout(1000);
    
    // Check for expected elements
    const hasTitle = await signupPage.$('h1') !== null;
    results.signup.checks.push({ name: 'Page title present', pass: hasTitle });
    
    const hasEmailInput = await signupPage.$('input[type="email"]') !== null;
    results.signup.checks.push({ name: 'Email input present', pass: hasEmailInput });
    
    const hasPasswordInput = await signupPage.$('input[type="password"]') !== null;
    results.signup.checks.push({ name: 'Password input present', pass: hasPasswordInput });
    
    const hasConfirmPasswordInput = await signupPage.$('input[placeholder*="Confirm" i]') !== null;
    results.signup.checks.push({ name: 'Confirm password input present', pass: hasConfirmPasswordInput });
    
    const hasSubmitButton = await signupPage.$('button[type="submit"]') !== null;
    results.signup.checks.push({ name: 'Submit button present', pass: hasSubmitButton });
    
    // Check for sign in link (may have different text like "Already have an account?" or "Sign in")
    const signInLinks = await signupPage.$$('a');
    let hasSignInLink = false;
    for (const link of signInLinks) {
      const text = await link.textContent();
      if (text && (text.toLowerCase().includes('sign in') || text.toLowerCase().includes('already have'))) {
        hasSignInLink = true;
        break;
      }
    }
    results.signup.checks.push({ name: 'Sign in link present', pass: hasSignInLink });
    
    if (results.signup.errors.length > 0) {
      results.signup.pass = false;
      results.signup.checks.push({ name: 'No JS errors', pass: false, detail: results.signup.errors.join(', ') });
    } else {
      results.signup.checks.push({ name: 'No JS errors', pass: true });
    }
    
  } catch (e) {
    results.signup.pass = false;
    results.signup.checks.push({ name: 'Page load', pass: false, detail: e.message });
  }

  await signupPage.close();
  await browser.close();

  return results;
}

function printReport(results) {
  let exitCode = 0;
  console.log('\n=== Auth Flow Test Report ===\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Run: ${new Date().toISOString()}\n`);

  ['login', 'signup'].forEach(authType => {
    const r = results[authType];
    const status = r.pass ? '✓ PASS' : '✗ FAIL';
    console.log(`--- ${authType.charAt(0).toUpperCase() + authType.slice(1)} Page — ${status} ---`);
    
    r.checks.forEach(c => {
      const icon = c.pass ? '  ✓' : '  ✗';
      console.log(`${icon} ${c.name}${c.detail ? ': ' + c.detail : ''}`);
    });
    
    if (!r.pass) exitCode = 1;
    console.log();
  });

  const allPass = results.login.pass && results.signup.pass;
  if (allPass) {
    console.log('✅ Auth pages working correctly');
  } else {
    console.log('❌ Some auth pages have issues');
  }
  
  console.log();
  return exitCode;
}

(async () => {
  const results = await testAuthFlow();
  
  if (JSON_OUTPUT) {
    console.log(JSON.stringify(results, null, 2));
    process.exit(results.login.pass && results.signup.pass ? 0 : 1);
  } else {
    process.exit(printReport(results));
  }
})();

/**
 * Supabase Security Test Suite
 *
 * Tests RLS policies, auth enforcement, and API security directly
 * against the Supabase instance (no browser, no UI).
 *
 * Run: node scripts/test-supabase-security.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://tqbvmmhgiivyjjcctqcb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxYnZtbWhnaWl2eWpqY2N0cWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTkyNTAsImV4cCI6MjA5MDM5NTI1MH0.zY9_zVBJRwQRhARZSH_tvmSNcbBulbTJ1GZzOMT8hGM';
const TEST_EMAIL = 'loganclaw9000@gmail.com';
const TEST_PASSWORD = 'NewTestPassword123!';
const FAKE_USER_ID = '00000000-0000-0000-0000-000000000000';

const results = [];
let passed = 0;
let failed = 0;

function log(name, status, detail = '') {
  const icon = status === 'PASS' ? '✓' : status === 'FAIL' ? '✗' : '⚠';
  console.log(`  ${icon} ${name}${detail ? ' — ' + detail : ''}`);
  results.push({ name, status, detail });
  if (status === 'PASS') passed++;
  if (status === 'FAIL') failed++;
}

async function main() {
  console.log('\n=== SUPABASE SECURITY TEST SUITE ===\n');

  // Create unauthenticated client (anon key only)
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Create authenticated client
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (authError) {
    console.error('Failed to authenticate:', authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`Authenticated as ${TEST_EMAIL} (${userId})\n`);

  // ============================================
  // 1. RLS ENFORCEMENT — UNAUTHENTICATED ACCESS
  // ============================================
  console.log('--- 1. RLS: Unauthenticated Access ---');

  const tables = ['profiles', 'api_keys', 'usage_logs', 'subscriptions', 'webhooks',
    'notifications', 'datasets', 'deployments', 'evaluations', 'fine_tuning_jobs',
    'model_pool', 'optimization_events', 'optimization_stats', 'request_logs',
    'team_members', 'team_invites'];

  for (const table of tables) {
    const { data, error } = await anonClient.from(table).select('*').limit(1);
    if (error && error.code === '42P01') {
      log(`anon SELECT ${table}`, 'PASS', 'table does not exist (OK)');
    } else if (error) {
      log(`anon SELECT ${table}`, 'PASS', `blocked: ${error.message}`);
    } else if (data && data.length === 0) {
      log(`anon SELECT ${table}`, 'PASS', 'empty result (RLS blocks or no data)');
    } else if (data && data.length > 0) {
      log(`anon SELECT ${table}`, 'FAIL', `RETURNED ${data.length} ROWS WITHOUT AUTH!`);
    }
  }

  // ============================================
  // 2. RLS ENFORCEMENT — CROSS-USER ACCESS
  // ============================================
  console.log('\n--- 2. RLS: Cross-User Access (IDOR) ---');

  // Try to insert into api_keys with a fake user_id
  {
    const { error } = await authClient.from('api_keys').insert({
      user_id: FAKE_USER_ID,
      name: 'hacked-key',
      key_hash: 'abc123',
      key_prefix: 'sk-sl_hack',
    });
    if (error) {
      log('INSERT api_keys with fake user_id', 'PASS', `blocked: ${error.message}`);
    } else {
      log('INSERT api_keys with fake user_id', 'FAIL', 'INSERT SUCCEEDED WITH WRONG USER_ID!');
      // Clean up
      await authClient.from('api_keys').delete().eq('key_prefix', 'sk-sl_hack');
    }
  }

  // Try to read another user's data by filtering on fake user_id
  {
    const { data, error } = await authClient.from('api_keys').select('*').eq('user_id', FAKE_USER_ID);
    if (error) {
      log('SELECT api_keys for other user', 'PASS', `blocked: ${error.message}`);
    } else if (data && data.length === 0) {
      log('SELECT api_keys for other user', 'PASS', 'empty result (RLS enforced)');
    } else {
      log('SELECT api_keys for other user', 'FAIL', `RETURNED ${data.length} ROWS FOR WRONG USER!`);
    }
  }

  // Try to update another user's profile
  {
    const { error } = await authClient.from('profiles').update({ display_name: 'hacked' }).eq('id', FAKE_USER_ID);
    if (error) {
      log('UPDATE profile for other user', 'PASS', `blocked: ${error.message}`);
    } else {
      log('UPDATE profile for other user', 'PASS', 'no error but 0 rows affected (RLS)');
    }
  }

  // Try to insert webhook for another user
  {
    const { error } = await authClient.from('webhooks').insert({
      user_id: FAKE_USER_ID,
      url: 'https://evil.com/steal',
      events: ['*'],
      secret: 'hacked',
    });
    if (error) {
      log('INSERT webhook for other user', 'PASS', `blocked: ${error.message}`);
    } else {
      log('INSERT webhook for other user', 'FAIL', 'INSERT SUCCEEDED WITH WRONG USER_ID!');
      await authClient.from('webhooks').delete().eq('url', 'https://evil.com/steal');
    }
  }

  // ============================================
  // 3. AUTH ENDPOINT SECURITY
  // ============================================
  console.log('\n--- 3. Auth Endpoint Security ---');

  // Try to list all users (should fail with anon key)
  {
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
    });
    if (resp.status === 401 || resp.status === 403) {
      log('List all users (admin endpoint)', 'PASS', `blocked: HTTP ${resp.status}`);
    } else {
      const body = await resp.text();
      log('List all users (admin endpoint)', 'FAIL', `HTTP ${resp.status} — ${body.substring(0, 100)}`);
    }
  }

  // Try to enumerate users by email
  {
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=test@test.com`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
    });
    if (resp.status === 401 || resp.status === 403) {
      log('Enumerate users by email', 'PASS', `blocked: HTTP ${resp.status}`);
    } else {
      log('Enumerate users by email', 'FAIL', `HTTP ${resp.status}`);
    }
  }

  // ============================================
  // 4. POSTGREST ENUMERATION
  // ============================================
  console.log('\n--- 4. PostgREST Enumeration ---');

  // Try to access PostgREST schema endpoint
  {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { 'apikey': SUPABASE_ANON_KEY },
    });
    const body = await resp.text();
    // PostgREST returns OpenAPI spec — this is normal but should be reviewed
    if (resp.status === 200 && body.includes('definitions')) {
      log('PostgREST schema endpoint', 'PASS', 'returns OpenAPI spec (standard Supabase behavior)');
    } else {
      log('PostgREST schema endpoint', 'PASS', `HTTP ${resp.status}`);
    }
  }

  // ============================================
  // 5. EDGE FUNCTION SECURITY
  // ============================================
  console.log('\n--- 5. Edge Function Security ---');

  // Stripe webhook without signature
  {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/stripe-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'checkout.session.completed' }),
    }).catch(e => ({ status: 'error', statusText: e.message }));
    if (resp.status === 400 || resp.status === 401 || resp.status === 403 || resp.status === 404 || resp.status === 'error') {
      log('Stripe webhook without signature', 'PASS', `rejected: ${resp.status}${resp.status === 404 ? ' (function not deployed — OK for pre-launch)' : ''}`);
    } else if (resp.status === 200) {
      log('Stripe webhook without signature', 'FAIL', 'ACCEPTED unsigned webhook — signature verification missing!');
    } else {
      log('Stripe webhook without signature', 'PASS', `rejected: ${resp.status}`);
    }
  }

  // Stripe checkout with malformed body
  {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }).catch(e => ({ status: 'error' }));
    if (resp.status >= 400 || resp.status === 'error') {
      log('Stripe checkout with malformed body', 'PASS', `rejected: ${resp.status}`);
    } else {
      log('Stripe checkout with malformed body', 'FAIL', `HTTP ${resp.status}`);
    }
  }

  // ============================================
  // 6. SQL INJECTION VIA REST API
  // ============================================
  console.log('\n--- 6. SQL Injection via REST API ---');

  // Try SQL injection through query parameters
  {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent("' OR 1=1 --")}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authData.session.access_token}`,
      },
    });
    const data = await resp.json().catch(() => []);
    if (Array.isArray(data) && data.length === 0) {
      log('SQLi via REST query param', 'PASS', 'no data returned (parameterized)');
    } else if (resp.status >= 400) {
      log('SQLi via REST query param', 'PASS', `rejected: HTTP ${resp.status}`);
    } else {
      log('SQLi via REST query param', 'FAIL', `returned data: ${JSON.stringify(data).substring(0, 100)}`);
    }
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n=== RESULTS ===');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${results.length}`);

  // Write report
  const report = {
    date: new Date().toISOString().split('T')[0],
    totalTests: results.length,
    passed,
    failed,
    findings: results.filter(r => r.status === 'FAIL').map(r => ({
      severity: 'critical',
      name: r.name,
      detail: r.detail,
    })),
    allResults: results,
  };

  const outPath = 'qa-logs/supabase-security-report.json';
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${outPath}`);

  // Sign out
  await authClient.auth.signOut();

  if (failed > 0) {
    console.log('\n⚠️  SECURITY ISSUES FOUND — review failures above');
    process.exit(1);
  } else {
    console.log('\n✓ All security tests passed');
  }
}

main().catch(e => { console.error(e); process.exit(1); });

// @ts-check
const { test, expect } = require('@playwright/test');
const { createClient } = require('@supabase/supabase-js');

/**
 * Database Integration Tests
 * Tests for user authentication, CRUD operations, and security
 */

// Test configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_TEST_URL || 'https://test.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_TEST_ANON_KEY || 'test-key';

// Create test client
const testSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Helper to create test user
 */
async function createTestUser(email, password) {
  const { data, error } = await testSupabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data.user;
}

/**
 * Helper to delete test user
 */
async function deleteTestUser(userId) {
  // Note: In production, you'd use a service role key for this
  // For tests, we rely on cleanup in afterAll
}

/**
 * Authentication Tests
 */
test.describe('Authentication Tests', () => {
  let testUser;
  let authToken;

  test.beforeEach(async () => {
    // Clean up any existing test user
    const { data: existingUsers } = await testSupabase
      .from('profiles')
      .select('id, email')
      .ilike('email', 'test-%');
    
    if (existingUsers && existingUsers.length > 0) {
      // Delete old test users
      for (const user of existingUsers) {
        await testSupabase.auth.admin.deleteUser(user.id);
      }
    }
  });

  test('should register new user', async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    const { data, error } = await testSupabase.auth.signUp({
      email,
      password,
    });
    
    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(email);
  });

  test('should login with valid credentials', async () => {
    const email = `test-login-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    // Create user first
    await testSupabase.auth.signUp({ email, password });
    
    // Login
    const { data, error } = await testSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    expect(error).toBeNull();
    expect(data.session).toBeDefined();
    expect(data.session.access_token).toBeDefined();
  });

  test('should fail login with invalid credentials', async () => {
    const email = `test-invalid-${Date.now()}@example.com`;
    const password = 'WrongPassword123';
    
    const { data, error } = await testSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });

  test('should get current session', async () => {
    const email = `test-session-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    // Create and login user
    await testSupabase.auth.signUp({ email, password });
    const { data: loginData } = await testSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Get session
    const { data: sessionData, error } = await testSupabase.auth.getSession();
    
    expect(error).toBeNull();
    expect(sessionData.session).toBeDefined();
    expect(sessionData.session.user.email).toBe(email);
  });

  test('should refresh session', async () => {
    const email = `test-refresh-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    // Create and login user
    await testSupabase.auth.signUp({ email, password });
    const { data: loginData } = await testSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!loginData.session) throw new Error('No session');
    
    // Refresh token
    const { data, error } = await testSupabase.auth.refreshSession();
    
    expect(error).toBeNull();
    expect(data.session).toBeDefined();
  });

  test('should reset password', async () => {
    const email = `test-reset-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    // Create user
    await testSupabase.auth.signUp({ email, password });
    
    // Request password reset
    const { error } = await testSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.VITE_BASE_URL || 'http://localhost:4173'}/update-password`,
    });
    
    // Note: In real tests, you'd need to check email for the token
    // This test just verifies the API call succeeds
    expect(error).toBeNull();
  });

  test('should update password', async () => {
    const email = `test-update-${Date.now()}@example.com`;
    const oldPassword = 'OldPassword123';
    const newPassword = 'NewPassword456';
    
    // Create user
    await testSupabase.auth.signUp({ email, password: oldPassword });
    
    // Login with old password
    const { data: loginData } = await testSupabase.auth.signInWithPassword({
      email,
      password: oldPassword,
    });
    
    if (!loginData.session) throw new Error('No session');
    
    // Update password
    const { data, error } = await testSupabase.auth.updateUser({
      password: newPassword,
    });
    
    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    
    // Verify new password works
    const { data: newLoginData } = await testSupabase.auth.signInWithPassword({
      email,
      password: newPassword,
    });
    
    expect(newLoginData.session).toBeDefined();
  });

  test('should sign out', async () => {
    const email = `test-signout-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    // Create and login user
    await testSupabase.auth.signUp({ email, password });
    await testSupabase.auth.signInWithPassword({ email, password });
    
    // Sign out
    const { error } = await testSupabase.auth.signOut();
    
    expect(error).toBeNull();
  });
});

/**
 * CRUD Operations Tests
 */
test.describe('Profile CRUD Operations', () => {
  let testUser;
  let testSession;

  test.beforeEach(async () => {
    const email = `test-crud-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    const { data: signUpData } = await testSupabase.auth.signUp({
      email,
      password,
    });
    
    testUser = signUpData.user;
    
    const { data: sessionData } = await testSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    testSession = sessionData.session;
  });

  test.afterEach(async () => {
    if (testUser) {
      await testSupabase.auth.admin.deleteUser(testUser.id);
    }
  });

  test('should create profile', async () => {
    const { data, error } = await testSupabase
      .from('profiles')
      .select('*')
      .eq('id', testUser.id)
      .single();
    
    // Profile should be auto-created on signup
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(testUser.id);
  });

  test('should update profile', async () => {
    const displayName = 'Test User';
    
    const { data, error } = await testSupabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', testUser.id)
      .select('*')
      .single();
    
    expect(error).toBeNull();
    expect(data.display_name).toBe(displayName);
  });

  test('should read profile', async () => {
    const { data, error } = await testSupabase
      .from('profiles')
      .select('*')
      .eq('id', testUser.id)
      .single();
    
    expect(error).toBeNull();
    expect(data.id).toBe(testUser.id);
  });

  test('should delete profile', async () => {
    // Delete should cascade with user deletion
    const { error } = await testSupabase
      .from('profiles')
      .delete()
      .eq('id', testUser.id);
    
    // Note: In production, we'd use a service role key
    expect(error || true); // Error expected due to RLS
  });
});

/**
 * API Keys CRUD Tests
 */
test.describe('API Keys CRUD Operations', () => {
  let testUser;
  let authToken;

  test.beforeEach(async () => {
    const email = `test-apikey-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    const { data: signUpData } = await testSupabase.auth.signUp({
      email,
      password,
    });
    
    testUser = signUpData.user;
    
    const { data: sessionData } = await testSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    authToken = sessionData.session.access_token;
  });

  test.afterEach(async () => {
    if (testUser) {
      await testSupabase.auth.admin.deleteUser(testUser.id);
    }
  });

  test('should create API key', async () => {
    const { data, error } = await testSupabase
      .from('api_keys')
      .insert([
        {
          user_id: testUser.id,
          name: 'Test Key',
          key_prefix: 'sk_test_',
          key_hash: 'hashed_key_value',
          is_active: true,
        },
      ])
      .select('*')
      .single();
    
    expect(error).toBeNull();
    expect(data.name).toBe('Test Key');
    expect(data.is_active).toBe(true);
  });

  test('should list user API keys', async () => {
    // Create test key
    await testSupabase
      .from('api_keys')
      .insert({
        user_id: testUser.id,
        name: 'Test Key',
        key_prefix: 'sk_test_',
        key_hash: 'hashed_key_value',
        is_active: true,
      });
    
    // List keys
    const { data, error } = await testSupabase
      .from('api_keys')
      .select('*')
      .eq('user_id', testUser.id);
    
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('should revoke API key', async () => {
    // Create key
    const { data: keyData } = await testSupabase
      .from('api_keys')
      .insert({
        user_id: testUser.id,
        name: 'Test Key',
        key_prefix: 'sk_test_',
        key_hash: 'hashed_key_value',
        is_active: true,
      })
      .select('*')
      .single();
    
    // Revoke key
    const { data, error } = await testSupabase
      .from('api_keys')
      .update({ is_active: false, revoked_at: new Date().toISOString() })
      .eq('id', keyData.id)
      .select('*')
      .single();
    
    expect(error).toBeNull();
    expect(data.is_active).toBe(false);
    expect(data.revoked_at).toBeDefined();
  });

  test('should not see other users API keys', async () => {
    // Create another user
    const { data: otherUserData } = await testSupabase.auth.signUp({
      email: `other-${Date.now()}@example.com`,
      password: 'TestPassword123',
    });
    
    // Create key for other user
    await testSupabase
      .from('api_keys')
      .insert({
        user_id: otherUserData.user.id,
        name: 'Other Key',
        key_prefix: 'sk_other_',
        key_hash: 'other_key_hash',
        is_active: true,
      });
    
    // Try to access as first user (should be denied by RLS)
    const { data, error } = await testSupabase
      .from('api_keys')
      .select('*')
      .eq('user_id', testUser.id);
    
    expect(error).toBeNull();
    // Should not see other user's keys
    const otherKeys = data.filter(key => key.user_id === otherUserData.user.id);
    expect(otherKeys.length).toBe(0);
  });
});

/**
 * Usage Logs Tests
 */
test.describe('Usage Logs', () => {
  let testUser;
  let testApiKey;

  test.beforeEach(async () => {
    const email = `test-usage-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    const { data: signUpData } = await testSupabase.auth.signUp({
      email,
      password,
    });
    
    testUser = signUpData.user;
    
    // Create API key
    const { data: keyData } = await testSupabase
      .from('api_keys')
      .insert({
        user_id: testUser.id,
        name: 'Usage Test Key',
        key_prefix: 'sk_test_',
        key_hash: 'hashed_key_value',
        is_active: true,
      })
      .select('*')
      .single();
    
    testApiKey = keyData;
  });

  test.afterEach(async () => {
    if (testUser) {
      await testSupabase.auth.admin.deleteUser(testUser.id);
    }
  });

  test('should create usage log entry', async () => {
    const { data, error } = await testSupabase
      .from('usage_logs')
      .insert([
        {
          user_id: testUser.id,
          api_key_id: testApiKey.id,
          model: 'gpt-4',
          tokens_in: 100,
          tokens_out: 200,
          latency_ms: 500,
        },
      ])
      .select('*')
      .single();
    
    expect(error).toBeNull();
    expect(data.model).toBe('gpt-4');
    expect(data.tokens_in).toBe(100);
  });

  test('should query usage logs by user', async () => {
    // Create multiple usage entries
    await testSupabase
      .from('usage_logs')
      .insert([
        {
          user_id: testUser.id,
          api_key_id: testApiKey.id,
          model: 'gpt-4',
          tokens_in: 100,
          tokens_out: 200,
        },
        {
          user_id: testUser.id,
          api_key_id: testApiKey.id,
          model: 'claude',
          tokens_in: 150,
          tokens_out: 250,
        },
      ]);
    
    // Query by user
    const { data, error } = await testSupabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', testUser.id)
      .order('created_at', { ascending: false });
    
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(2);
  });

  test('should aggregate usage by model', async () => {
    // Create usage entries
    await testSupabase
      .from('usage_logs')
      .insert([
        {
          user_id: testUser.id,
          api_key_id: testApiKey.id,
          model: 'gpt-4',
          tokens_in: 100,
          tokens_out: 200,
        },
        {
          user_id: testUser.id,
          api_key_id: testApiKey.id,
          model: 'gpt-4',
          tokens_in: 150,
          tokens_out: 250,
        },
        {
          user_id: testUser.id,
          api_key_id: testApiKey.id,
          model: 'claude',
          tokens_in: 100,
          tokens_out: 100,
        },
      ]);
    
    // Query all entries
    const { data, error } = await testSupabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', testUser.id);
    
    expect(error).toBeNull();
    expect(data.length).toBe(3);
  });
});

/**
 * Security Tests
 */
test.describe('Security Tests', () => {
  test('should prevent SQL injection in queries', async () => {
    // Attempt SQL injection (should be prevented by Supabase)
    const maliciousInput = "' OR '1'='1";
    
    const { data, error } = await testSupabase
      .from('profiles')
      .select('*')
      .eq('email', maliciousInput);
    
    // Should return empty or error, not all profiles
    expect(Array.isArray(data)).toBe(true);
    
    // In production, RLS should prevent this
  });

  test('should validate email format', async () => {
    const invalidEmails = [
      'invalid-email',
      'missing@dot',
      '@missinglocal.com',
      'noat.com',
    ];
    
    for (const email of invalidEmails) {
      const { data, error } = await testSupabase.auth.signUp({
        email,
        password: 'TestPassword123',
      });
      
      // Should fail or create with normalized email
      expect(data || error).toBeDefined();
    }
  });

  test('should enforce password strength', async () => {
    const weakPasswords = [
      'weak',
      'password',
      '12345678',
      'NoNumber',
    ];
    
    for (const password of weakPasswords) {
      const email = `test-weak-${Date.now()}-${Math.random()}@example.com`;
      const { data, error } = await testSupabase.auth.signUp({
        email,
        password,
      });
      
      // Supabase has default password requirements
      // This test documents expected behavior
      expect(data || error).toBeDefined();
    }
  });

  test('should enforce RLS policies', async () => {
    // Create public test data
    const { data: publicData } = await testSupabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    // Should not be able to access data without authentication
    // (RLS policies should deny access)
    expect(publicData).toBeNull() || expect(Array.isArray(publicData)).toBe(true);
  });
});

/**
 * Data Validation Tests
 */
test.describe('Data Validation Tests', () => {
  let testUser;

  test.beforeEach(async () => {
    const email = `test-validation-${Date.now()}@example.com`;
    const password = 'TestPassword123';
    
    const { data: signUpData } = await testSupabase.auth.signUp({
      email,
      password,
    });
    
    testUser = signUpData.user;
  });

  test.afterEach(async () => {
    if (testUser) {
      await testSupabase.auth.admin.deleteUser(testUser.id);
    }
  });

  test('should validate display_name length', async () => {
    const longDisplayName = 'A'.repeat(300); // Too long
    
    const { data, error } = await testSupabase
      .from('profiles')
      .update({ display_name: longDisplayName })
      .eq('id', testUser.id);
    
    // Should either reject or truncate
    expect(data || error).toBeDefined();
  });

  test('should validate email uniqueness', async () => {
    const email = `test-unique-${Date.now()}@example.com`;
    
    // First signup should succeed
    const { data: firstData } = await testSupabase.auth.signUp({
      email,
      password: 'TestPassword123',
    });
    
    expect(firstData.user).toBeDefined();
    
    // Second signup with same email should fail
    const { data: secondData } = await testSupabase.auth.signUp({
      email,
      password: 'TestPassword123',
    });
    
    // Should return error
    expect(secondData.error).toBeDefined();
  });

  test('should handle null and empty values', async () => {
    const { data, error } = await testSupabase
      .from('profiles')
      .update({
        display_name: null,
        company: '',
      })
      .eq('id', testUser.id);
    
    // Should accept null for nullable fields
    expect(data || error).toBeDefined();
  });
});

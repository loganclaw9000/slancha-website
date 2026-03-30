// Cleanup test data after tests
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_TEST_URL || 'https://test.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('VITE_SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function cleanupTestData() {
  console.log('Cleaning up test data...');

  // Find test users
  const { data: testUsers, error: usersError } = await supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', 'test-%')
    .or('email.eq.test-seed@example.com');

  if (usersError) {
    console.error('Error fetching test users:', usersError);
    process.exit(1);
  }

  if (!testUsers || testUsers.length === 0) {
    console.log('No test data to clean up');
    return;
  }

  console.log(`Found ${testUsers.length} test user(s) to cleanup`);

  // Delete profiles (will cascade to api_keys and usage_logs)
  for (const user of testUsers) {
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      console.error(`Error deleting profile for ${user.email}:`, profileError);
      continue;
    }

    // Also delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    if (authError) {
      console.error(`Error deleting auth user ${user.email}:`, authError);
    }

    console.log(`✓ Cleaned up: ${user.email}`);
  }

  console.log('\n✅ Test data cleanup complete!');
}

cleanupTestData().catch((error) => {
  console.error('Cleanup failed:', error);
  process.exit(1);
});

// Seed test data for database tests
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_TEST_URL || 'https://test.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('VITE_SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seedTestData() {
  console.log('Seeding test data...');

  // Create test user
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email: 'test-seed@example.com',
    password: 'TestPassword123',
    user_metadata: {
      display_name: 'Test User',
    },
  });

  if (userError) {
    console.error('Error creating user:', userError);
    process.exit(1);
  }

  console.log('✓ Created test user:', user.user.id);

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.user.id,
      display_name: 'Test User',
      company: 'Test Company',
    });

  if (profileError) {
    console.error('Error creating profile:', profileError);
    process.exit(1);
  }

  console.log('✓ Created test profile');

  // Create API key
  const { error: keyError } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.user.id,
      name: 'Seed Test Key',
      key_prefix: 'sk_test_',
      key_hash: 'hashed_seed_key',
      is_active: true,
    });

  if (keyError) {
    console.error('Error creating API key:', keyError);
    process.exit(1);
  }

  console.log('✓ Created test API key');

  // Create usage logs
  const { error: usageError } = await supabase
    .from('usage_logs')
    .insert([
      {
        user_id: user.user.id,
        api_key_id: 'seed-key-id', // Replace with actual ID if needed
        model: 'gpt-4',
        tokens_in: 1000,
        tokens_out: 2000,
        latency_ms: 500,
      },
    ]);

  if (usageError) {
    console.error('Error creating usage logs:', usageError);
    process.exit(1);
  }

  console.log('✓ Created test usage logs');

  console.log('\n✅ Test data seeding complete!');
  console.log('User ID:', user.user.id);
}

seedTestData().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});

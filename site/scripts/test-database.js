// Database test runner
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function runDatabaseTests() {
  console.log('Running database integration tests...\n');

  // Check for required environment variables
  if (!process.env.VITE_SUPABASE_TEST_URL) {
    console.error('❌ VITE_SUPABASE_TEST_URL is required');
    console.error('Please set up your test Supabase instance\n');
    console.error('Example:');
    console.error('  VITE_SUPABASE_TEST_URL=https://your-test-project.supabase.co');
    console.error('  VITE_SUPABASE_TEST_ANON_KEY=your-anon-key');
    process.exit(1);
  }

  console.log('📊 Database Test Configuration:');
  console.log(`   URL: ${process.env.VITE_SUPABASE_TEST_URL}`);
  console.log('');

  try {
    // Run database tests with playwright
    await execAsync('npx playwright test e2e/database.spec.js --reporter=list', {
      env: { 
        ...process.env,
        PLAYWRIGHT_TEST_BASE_URL: process.env.VITE_BASE_URL || 'http://localhost:4173',
      },
      timeout: 180000, // 3 minutes for database tests
    });

    console.log('\n✅ Database tests completed!');
  } catch (error) {
    console.error('\n❌ Database tests failed:');
    console.error(error.message);
    process.exit(1);
  }
}

runDatabaseTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

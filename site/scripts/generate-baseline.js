// Generate visual regression baselines
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function generateBaselines() {
  console.log('Generating visual regression baselines...\n');

  const commands = [
    'npm run build',
    'npm run preview -- --port 4173',
  ];

  // Start preview server in background
  console.log('Starting preview server...');
  const preview = exec('npm run preview -- --port 4173');
  
  preview.stdout.on('data', (data) => {
    console.log(data);
  });

  preview.stderr.on('data', (data) => {
    console.error(data);
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('\nGenerating baselines...\n');

  // Run visual tests with update-snapshots flag
  try {
    await execAsync('npx playwright test e2e/visual.spec.js --update-snapshots', {
      env: { ...process.env, PLAYWRIGHT_BASELINE: 'true' },
      timeout: 120000,
    });

    console.log('\n✅ Baselines generated successfully!');
    console.log('Check __playwright__/baseline/ for updated images');
  } catch (error) {
    console.error('\n❌ Error generating baselines:', error.message);
  } finally {
    // Kill preview server
    preview.kill();
  }
}

generateBaselines().catch(console.error);

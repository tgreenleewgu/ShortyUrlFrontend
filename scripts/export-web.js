require('dotenv').config({ path: '.env.production' });

console.log('Exporting web with BACKEND_URL =', process.env.BACKEND_URL);

const { spawnSync } = require('child_process');

const result = spawnSync('npx', ['expo', 'export', '--platform', 'web'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
  },
});

if (result.error) {
  console.error('❌ Export failed:', result.error.message);
  process.exit(1);
}

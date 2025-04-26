// This is a simple script that uses the Payload CLI to seed the database
// It's a workaround for the TypeScript ESM issues

import { execSync } from 'child_process';

try {
  console.log('Starting database seeding...');

  // Run a simple payload command to create a user
  execSync('npx payload create-user --email admin@example.com --password password123 --firstName Admin --lastName User --roles admin', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('Seeding completed successfully!');
} catch (error) {
  console.error('Error seeding database:', error.message);
  process.exit(1);
}

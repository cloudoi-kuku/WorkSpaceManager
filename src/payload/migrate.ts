import payload from 'payload';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateDatabase() {
  await payload.init({
    secret: 'your-secret-key-change-me',
    local: true,
    configPath: path.resolve(__dirname, 'payload.config.ts'),
  });

  // Run migrations
  await payload.db.migrate();
  console.log('Migration completed successfully!');
  process.exit(0);
}

migrateDatabase().catch((err) => {
  console.error('Error during migration:', err);
  process.exit(1);
});

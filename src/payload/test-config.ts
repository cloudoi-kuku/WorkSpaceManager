import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the config path
const configPath = path.resolve(__dirname, './payload.config.ts');
console.log('Config path:', configPath);

// Try to import the config
import('./payload.config.ts')
  .then((config) => {
    console.log('Config loaded successfully!');
    console.log('Config:', config.default);
  })
  .catch((err) => {
    console.error('Error loading config:', err);
  });

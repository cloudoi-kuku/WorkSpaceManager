import payload from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script is used to generate TypeScript types for Payload CMS collections
// It's useful to run this after making changes to your collections

async function generateTypes() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
    local: true,
    onInit: async () => {
      await payload.generateTypes({
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
      });
      console.log('Types generated successfully!');
      process.exit(0);
    },
  });
}

generateTypes();

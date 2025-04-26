// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users.js';
import { Media } from './collections/Media.js';
import { Tasks } from './collections/Tasks.js';
import { Workspaces } from './collections/Workspaces.js';
import { Projects } from './collections/Projects.js';
import { Features } from './collections/Features.js';
import { WorkItems } from './collections/WorkItems.js';
import { Sessions } from './collections/Sessions.js';
import { RecoveryPoints } from './collections/RecoveryPoints.js';
import { Dependencies } from './collections/Dependencies.js';
import { WorkflowDefinitions } from './collections/WorkflowDefinitions.js';
import { AIConversations } from './collections/AIConversations.js';
import endpoints from './endpoints/index.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users, 
    Media, 
    Tasks, 
    Workspaces, 
    Projects, 
    Features, 
    WorkItems, 
    Sessions, 
    RecoveryPoints, 
    Dependencies, 
    WorkflowDefinitions, 
    AIConversations
  ],
  endpoints,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',  // This should not be empty
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@192.168.1.89:54322/postgres',
    },
    // Explicitly disable database creation
    disableCreateDatabase: true,
    // Add a custom schema name to isolate your tables
    schemaName: 'workspace_manager',
  }),
  cors: ['http://localhost:5173'],
  csrf: ['http://localhost:5173'],
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});

// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tasks } from './collections/Tasks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tasks],
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
})

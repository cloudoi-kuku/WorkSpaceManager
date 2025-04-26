import dotenv from 'dotenv';
import { Client } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

async function fixSchema() {
  // Create a new PostgreSQL client
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to the database');

    // 1. Check if the users table exists
    const usersTableQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'workspace_manager' 
      AND table_name = 'users'
    `);

    if (usersTableQuery.rows.length > 0) {
      console.log('Users table exists');

      // 2. Check if first_name and last_name columns exist
      const firstNameColumnQuery = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'workspace_manager' 
        AND table_name = 'users' 
        AND column_name = 'first_name'
      `);

      if (firstNameColumnQuery.rows.length === 0) {
        console.log('Adding first_name column to users table...');
        await client.query(`
          ALTER TABLE workspace_manager.users 
          ADD COLUMN first_name text
        `);
        console.log('first_name column added');
      } else {
        console.log('first_name column already exists');
      }

      const lastNameColumnQuery = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'workspace_manager' 
        AND table_name = 'users' 
        AND column_name = 'last_name'
      `);

      if (lastNameColumnQuery.rows.length === 0) {
        console.log('Adding last_name column to users table...');
        await client.query(`
          ALTER TABLE workspace_manager.users 
          ADD COLUMN last_name text
        `);
        console.log('last_name column added');
      } else {
        console.log('last_name column already exists');
      }
    } else {
      console.log('Users table does not exist yet');
    }

    // 3. Check if the workspaces table exists
    const workspacesTableQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'workspace_manager' 
      AND table_name = 'workspaces'
    `);

    if (workspacesTableQuery.rows.length > 0) {
      console.log('Workspaces table exists');

      // 4. Check if description column exists and its type
      const descriptionColumnQuery = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'workspace_manager' 
        AND table_name = 'workspaces' 
        AND column_name = 'description'
      `);

      if (descriptionColumnQuery.rows.length > 0) {
        const dataType = descriptionColumnQuery.rows[0].data_type;
        
        if (dataType !== 'jsonb') {
          console.log(`Converting description column from ${dataType} to jsonb...`);
          
          // First, create a backup of the column
          await client.query(`
            ALTER TABLE workspace_manager.workspaces 
            ADD COLUMN description_backup text
          `);
          
          await client.query(`
            UPDATE workspace_manager.workspaces 
            SET description_backup = description::text
          `);
          
          // Then drop the original column
          await client.query(`
            ALTER TABLE workspace_manager.workspaces 
            DROP COLUMN description
          `);
          
          // Create the new column with the correct type
          await client.query(`
            ALTER TABLE workspace_manager.workspaces 
            ADD COLUMN description jsonb
          `);
          
          // Convert the backup data to jsonb and restore it
          await client.query(`
            UPDATE workspace_manager.workspaces 
            SET description = CASE 
              WHEN description_backup IS NULL THEN NULL
              ELSE to_jsonb(description_backup)
            END
          `);
          
          // Drop the backup column
          await client.query(`
            ALTER TABLE workspace_manager.workspaces 
            DROP COLUMN description_backup
          `);
          
          console.log('description column converted to jsonb');
        } else {
          console.log('description column is already jsonb');
        }
      } else {
        console.log('description column does not exist');
      }
    } else {
      console.log('Workspaces table does not exist yet');
    }

    console.log('Schema fixes completed successfully');
  } catch (error) {
    console.error('Error fixing schema:', error);
  } finally {
    // Close the database connection
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the function
fixSchema();

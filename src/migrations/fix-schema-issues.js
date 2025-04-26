import { sql } from 'drizzle-orm';

export async function up({ payload }) {
  // Get the database connection from payload
  const { db } = payload;

  // Execute raw SQL to fix the schema issues
  try {
    // 1. Fix the description column type issue by converting it to jsonb
    // We'll first check if the column exists and what type it is
    const descriptionColumnQuery = await db.raw(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'workspace_manager' 
      AND table_name = 'workspaces' 
      AND column_name = 'description'
    `);

    if (descriptionColumnQuery.rows.length > 0) {
      const dataType = descriptionColumnQuery.rows[0].data_type;
      
      if (dataType !== 'jsonb') {
        console.log('Converting description column to jsonb...');
        
        // First, create a backup of the column
        await db.raw(sql`
          ALTER TABLE workspace_manager.workspaces 
          ADD COLUMN description_backup text
        `);
        
        await db.raw(sql`
          UPDATE workspace_manager.workspaces 
          SET description_backup = description
        `);
        
        // Then drop the original column
        await db.raw(sql`
          ALTER TABLE workspace_manager.workspaces 
          DROP COLUMN description
        `);
        
        // Create the new column with the correct type
        await db.raw(sql`
          ALTER TABLE workspace_manager.workspaces 
          ADD COLUMN description jsonb
        `);
        
        // Convert the backup data to jsonb and restore it
        await db.raw(sql`
          UPDATE workspace_manager.workspaces 
          SET description = CASE 
            WHEN description_backup IS NULL THEN NULL
            ELSE to_jsonb(description_backup::text)
          END
        `);
        
        // Drop the backup column
        await db.raw(sql`
          ALTER TABLE workspace_manager.workspaces 
          DROP COLUMN description_backup
        `);
      }
    }

    // 2. Add the missing first_name and last_name columns to the users table
    const firstNameColumnQuery = await db.raw(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'workspace_manager' 
      AND table_name = 'users' 
      AND column_name = 'first_name'
    `);

    if (firstNameColumnQuery.rows.length === 0) {
      console.log('Adding first_name column to users table...');
      await db.raw(sql`
        ALTER TABLE workspace_manager.users 
        ADD COLUMN first_name text
      `);
    }

    const lastNameColumnQuery = await db.raw(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'workspace_manager' 
      AND table_name = 'users' 
      AND column_name = 'last_name'
    `);

    if (lastNameColumnQuery.rows.length === 0) {
      console.log('Adding last_name column to users table...');
      await db.raw(sql`
        ALTER TABLE workspace_manager.users 
        ADD COLUMN last_name text
      `);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function down({ payload }) {
  // This is a risky migration to revert, so we'll just log a warning
  console.log('WARNING: This migration cannot be safely reverted.');
}

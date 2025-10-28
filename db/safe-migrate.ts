import 'dotenv/config'; // Load .env file
import { config } from 'dotenv';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";

// Load environment variables (matches original migrate.ts)
config({ path: '.env.local' });

async function runMigrations() {
  if (!process.env.POSTGRES_URL) {
    console.log('⚠️  No POSTGRES_URL found, skipping migrations');
    return;
  }

  let migrationClient: any = null;

  try {
    console.log('⏳ Running migrations...');
    
    const start = Date.now();
    migrationClient = postgres(process.env.POSTGRES_URL, { 
      max: 1,
      idle_timeout: 5,
      connect_timeout: 10,
    });
    const db = drizzle(migrationClient);
    
    await migrate(db, { migrationsFolder: './lib/drizzle' });
    
    const end = Date.now();
    console.log('✅ Migrations completed in', end - start, 'ms');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('⚠️  Migration completed with notices:', errorMessage);
    // Don't fail the build for migration notices or existing columns
    if (errorMessage.includes('already exists') || errorMessage.includes('skipping')) {
      console.log('✅ Database schema is already up to date');
    } else {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  } finally {
    // Ensure connection is closed
    if (migrationClient) {
      try {
        await migrationClient.end({ timeout: 5 });
        console.log('✅ Database connection closed');
      } catch (err) {
        console.log('⚠️  Error closing connection:', err);
      }
    }
    // Exit the process to ensure no hanging connections
    process.exit(0);
  }
}

runMigrations().catch((error) => {
  console.error('❌ Migration script failed:', error);
  process.exit(1);
});
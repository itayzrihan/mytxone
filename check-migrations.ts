import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function checkMigrations() {
  const sql = postgres(process.env.POSTGRES_URL!);

  try {
    const migrations = await sql`SELECT name FROM __drizzle_migrations ORDER BY name`;
    console.log('Applied migrations:');
    migrations.forEach(m => console.log(' -', m.name));
  } catch (error) {
    console.log('Error checking migrations:', error instanceof Error ? error.message : String(error));
  } finally {
    await sql.end();
  }
}

checkMigrations();
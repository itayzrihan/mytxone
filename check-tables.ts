import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function checkTables() {
  const sql = postgres(process.env.POSTGRES_URL!);

  try {
    console.log('Checking for RegistrationToken table...');
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'RegistrationToken'`;
    if (tables.length > 0) {
      console.log('✅ RegistrationToken table EXISTS');
    } else {
      console.log('❌ RegistrationToken table does NOT exist');
    }

    console.log('\nAll tables in public schema:');
    const allTables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
    allTables.forEach(t => console.log(' -', t.table_name));

  } catch (error) {
    console.log('Error checking tables:', error instanceof Error ? error.message : String(error));
  } finally {
    await sql.end();
  }
}

checkTables();
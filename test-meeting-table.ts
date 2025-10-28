import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function testMeetingCreation() {
  const sql = postgres(process.env.POSTGRES_URL!);

  try {
    console.log('Testing Meeting table...');

    // Check if Meeting table exists
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Meeting'`;
    if (tables.length === 0) {
      console.log('❌ Meeting table does NOT exist');
      return;
    }
    console.log('✅ Meeting table exists');

    // Try to insert a test meeting (this will fail due to auth, but should not fail due to missing table)
    try {
      await sql`
        INSERT INTO "Meeting" (
          "user_id", "title", "meeting_type", "start_time", "end_time", "timezone", "is_public", "requires_approval", "status"
        ) VALUES (
          '00000000-0000-0000-0000-000000000000'::uuid,
          'Test Meeting',
          'webinar',
          NOW() + INTERVAL '1 day',
          NOW() + INTERVAL '2 days',
          'UTC',
          true,
          false,
          'upcoming'
        )
      `;
      console.log('✅ Meeting insertion successful');

      // Clean up test data
      await sql`DELETE FROM "Meeting" WHERE title = 'Test Meeting'`;

    } catch (insertError: any) {
      // We expect this to fail due to foreign key constraint (invalid user_id), but not due to missing table
      if (insertError.message.includes('violates foreign key constraint')) {
        console.log('✅ Meeting insertion attempted (failed as expected due to foreign key, but table exists)');
      } else {
        console.log('❌ Unexpected error during insertion:', insertError.message);
      }
    }

  } catch (error) {
    console.log('Error during test:', error instanceof Error ? error.message : String(error));
  } finally {
    await sql.end();
  }
}

testMeetingCreation();
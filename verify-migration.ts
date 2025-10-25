import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { registrationToken } from './db/schema';
import { eq } from 'drizzle-orm';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function verifyMigration() {
  try {
    console.log('🔍 Verifying RegistrationToken table...');

    if (!process.env.POSTGRES_URL) {
      console.error('❌ No POSTGRES_URL found in environment');
      process.exit(1);
    }

    // Create database connection
    const client = postgres(process.env.POSTGRES_URL);
    const db = drizzle(client, { schema: { registrationToken } });

    // Try to select from the table
    const result = await db.select().from(registrationToken).limit(1);
    console.log('✅ RegistrationToken table exists and is accessible');

    // Check table structure by trying to insert and delete a test record
    console.log('🔍 Testing table operations...');

    const testToken = {
      token: 'test_verification_token_' + Date.now(),
      userId: '00000000-0000-0000-0000-000000000000', // dummy UUID
      email: 'test@example.com',
      serviceName: 'test',
      status: 'pending' as const,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    // Insert test record
    const insertResult = await db.insert(registrationToken).values(testToken).returning();
    console.log('✅ INSERT operation successful');

    // Update test record
    const updateResult = await db
      .update(registrationToken)
      .set({ status: 'completed' })
      .where(eq(registrationToken.token, testToken.token))
      .returning();
    console.log('✅ UPDATE operation successful');

    // Delete test record
    await db.delete(registrationToken).where(eq(registrationToken.token, testToken.token));
    console.log('✅ DELETE operation successful');

    // Close connection
    await client.end();

    console.log('🎉 Migration verification COMPLETE - RegistrationToken table is fully functional!');

  } catch (error) {
    console.error('❌ Migration verification FAILED:', error);
    process.exit(1);
  }
}

verifyMigration();
import { config } from 'dotenv';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';

// Load environment variables
config({
  path: '.env.local',
});

// Setup database connection
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is not set');
  process.exit(1);
}
const client = postgres(`${dbUrl}?sslmode=require`);
const db = drizzle(client, { schema });

async function updateAdminSubscription() {
  try {
    console.log('Updating admin subscription...');

    // First, check if admin exists
    const adminUser = await db.select().from(user).where(eq(user.email, 'admin@mytx.ai')).limit(1);
    
    if (adminUser.length === 0) {
      console.log('Admin user not found. Please run create-admin.ts first.');
      return;
    }

    console.log('Current admin user:', {
      email: adminUser[0].email,
      subscription: adminUser[0].subscription,
      role: adminUser[0].role
    });

    // Update admin to pro subscription for testing
    await db.update(user)
      .set({ 
        subscription: 'pro',
        updatedAt: new Date()
      })
      .where(eq(user.email, 'admin@mytx.ai'));

    console.log('✅ Admin subscription updated to "pro"');

    // Verify the update
    const updatedAdmin = await db.select().from(user).where(eq(user.email, 'admin@mytx.ai')).limit(1);
    console.log('Updated admin user:', {
      email: updatedAdmin[0].email,
      subscription: updatedAdmin[0].subscription,
      role: updatedAdmin[0].role
    });

  } catch (error) {
    console.error('❌ Error updating admin subscription:', error);
  } finally {
    process.exit(0);
  }
}

updateAdminSubscription().catch(console.error);
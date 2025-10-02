import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";

// Load environment variables
config({ path: '.env.local' });

// Initialize database connection for script
const dbUrl = process.env.POSTGRES_URL;
if (!dbUrl) {
  console.error('❌ POSTGRES_URL environment variable is not set');
  console.log('Please check your .env.local file');
  process.exit(1);
}

let client = postgres(`${dbUrl}?sslmode=require`);
let db = drizzle(client, { schema });

const { user } = schema;

/**
 * Bootstrap script to create the first admin user
 * This should be run once to create an initial admin account
 * 
 * Usage: npx tsx scripts/create-admin.ts
 */

async function createFirstAdmin() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mytx.ai";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123!";

  console.log('🔐 Creating first admin user...');
  console.log(`📧 Email: ${ADMIN_EMAIL}`);

  try {
    // Check if admin already exists
    const existingUsers = await db.select()
      .from(user)
      .where(eq(user.email, ADMIN_EMAIL));

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      
      // If user exists but is not admin, make them admin
      if (existingUser.role !== 'admin') {
        await db.update(user)
          .set({ 
            role: 'admin',
            updatedAt: new Date()
          })
          .where(eq(user.id, existingUser.id));
        
        console.log('✅ Existing user promoted to admin successfully!');
        console.log(`👤 User ID: ${existingUser.id}`);
        console.log(`📧 Email: ${existingUser.email}`);
        console.log(`🔑 Role: admin`);
      } else {
        console.log('ℹ️  Admin user already exists!');
        console.log(`👤 User ID: ${existingUser.id}`);
        console.log(`📧 Email: ${existingUser.email}`);
        console.log(`🔑 Role: ${existingUser.role}`);
      }
      return;
    }

    // Create new admin user
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(ADMIN_PASSWORD, salt);

    const [newAdmin] = await db.insert(user).values({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('✅ Admin user created successfully!');
    console.log(`👤 User ID: ${newAdmin.id}`);
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`🔑 Role: ${newAdmin.role}`);
    console.log('');
    console.log('🚨 IMPORTANT SECURITY NOTES:');
    console.log('1. Change the default password immediately after first login');
    console.log('2. Use a strong, unique password for production');
    console.log('3. Consider setting up 2FA if available');
    console.log('4. This script should only be run once for initial setup');
    console.log('');
    console.log(`🔗 Access admin dashboard at: http://localhost:3001/admin`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createFirstAdmin().then(() => {
  console.log('🏁 Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
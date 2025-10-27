import { getAllUsers } from "./db/queries";

async function fetchAllUsers() {
  try {
    console.log("🔍 Fetching all users from database...\n");

    const users = await getAllUsers();

    console.log(`📊 Found ${users.length} users in total\n`);
    console.log("═".repeat(100));

    users.forEach((user, index) => {
      console.log(`${(index + 1).toString().padStart(3, ' ')}. User Details:`);
      console.log(`     ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`    Role: ${user.role}`);
      console.log(`Subscription: ${user.subscription}`);
      console.log(` 2FA Enabled: ${user.totpEnabled ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
      console.log(`   Updated: ${new Date(user.updatedAt).toLocaleString()}`);
      console.log("─".repeat(50));
    });

    console.log("\n✅ Successfully fetched all users!");

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    process.exit(1);
  }
}

fetchAllUsers();
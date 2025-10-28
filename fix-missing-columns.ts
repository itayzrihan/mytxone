import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.POSTGRES_URL!, { max: 1 });

async function addMissingColumns() {
  try {
    console.log('Checking for missing columns...');
    
    // Check if full_name exists
    const result = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'full_name'
      );
    `;
    
    if (!result[0].exists) {
      console.log('Adding full_name column...');
      await sql`ALTER TABLE "User" ADD COLUMN full_name varchar(255);`;
      console.log('✅ full_name column added');
    } else {
      console.log('✅ full_name column already exists');
    }
    
    // Check other columns
    const columns = ['phone_number', 'not_mytx_email', 'profile_image_url'];
    for (const col of columns) {
      const res = await sql`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'User' AND column_name = ${col}
        );
      `;
      if (!res[0].exists) {
        console.log(`Adding ${col} column...`);
        if (col === 'profile_image_url') {
          await sql`ALTER TABLE "User" ADD COLUMN profile_image_url text;`;
        } else {
          await sql`ALTER TABLE "User" ADD COLUMN ${sql(col)} varchar(20);`;
        }
        console.log(`✅ ${col} column added`);
      }
    }
    
    console.log('✅ All columns verified');
    await sql.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addMissingColumns();

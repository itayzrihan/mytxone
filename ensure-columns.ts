import postgres from 'postgres';
import 'dotenv/config';

async function ensureColumns() {
  const connectionUrl = process.env.POSTGRES_URL || 'postgresql://mytxonepost:54sdfgFDG554515fgFGdf8779984fdg@localhost:53332/mytxone?sslmode=disable';
  const sql = postgres(connectionUrl);
  
  try {
    console.log('Adding missing user columns...');
    
    // Add each column safely (IF NOT EXISTS is not available in PostgreSQL ALTER TABLE)
    // So we'll catch errors for columns that already exist
    const columnsToAdd = [
      { name: 'full_name', type: 'varchar(255)' },
      { name: 'phone_number', type: 'varchar(20)' },
      { name: 'not_mytx_email', type: 'varchar(255)' },
      { name: 'profile_image_url', type: 'text' },
    ];
    
    for (const col of columnsToAdd) {
      try {
        await sql`ALTER TABLE "User" ADD COLUMN ${sql(col.name)} ${sql.unsafe(col.type)};`;
        console.log(`✅ Added ${col.name}`);
      } catch (err: any) {
        if (err.code === '42701') {
          console.log(`ℹ️  ${col.name} already exists`);
        } else {
          throw err;
        }
      }
    }
    
    console.log('✅ Database schema updated');
    await sql.end();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

ensureColumns();

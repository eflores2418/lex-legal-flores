const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://lex_legal_flores_user:hKuJC0ZPg7NjYeBllLKib49u9XUDWq5r@dpg-d8av2se7r5hc73fdqb6g-a/lex_legal_flores',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrateToBoolean() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration to BOOLEAN types...');
    
    // Check if columns exist and their types
    const checkAppointments = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'appointments' AND column_name = 'reminder_sent'
    `);
    
    const checkReminders = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reminders' AND column_name = 'sent'
    `);
    
    // Migrate appointments.reminder_sent
    if (checkAppointments.rows.length > 0 && checkAppointments.rows[0].data_type === 'integer') {
      console.log('Migrating appointments.reminder_sent from INTEGER to BOOLEAN...');
      await client.query(`
        ALTER TABLE appointments 
        ALTER COLUMN reminder_sent TYPE BOOLEAN 
        USING CASE WHEN reminder_sent = 0 THEN FALSE ELSE TRUE END
      `);
      console.log('✓ appointments.reminder_sent migrated successfully');
    } else {
      console.log('✓ appointments.reminder_sent already BOOLEAN or doesn\'t exist');
    }
    
    // Migrate reminders.sent
    if (checkReminders.rows.length > 0 && checkReminders.rows[0].data_type === 'integer') {
      console.log('Migrating reminders.sent from INTEGER to BOOLEAN...');
      await client.query(`
        ALTER TABLE reminders 
        ALTER COLUMN sent TYPE BOOLEAN 
        USING CASE WHEN sent = 0 THEN FALSE ELSE TRUE END
      `);
      console.log('✓ reminders.sent migrated successfully');
    } else {
      console.log('✓ reminders.sent already BOOLEAN or doesn\'t exist');
    }
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (err) {
    console.error('❌ Error during migration:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrateToBoolean()
  .then(() => {
    console.log('Migration script finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });

// Made with Bob
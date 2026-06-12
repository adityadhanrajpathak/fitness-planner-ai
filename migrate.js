const Database = require('better-sqlite3');
const path = require('path');
const config = require('./server/config');

const db = new Database(config.DB_PATH);

try {
  // Check if is_admin column already exists
  const tableInfo = db.pragma('table_info(users)');
  const hasIsAdmin = tableInfo.some(column => column.name === 'is_admin');

  if (!hasIsAdmin) {
    db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;`);
    console.log('Successfully added is_admin column to users table.');
  } else {
    console.log('is_admin column already exists.');
  }

  // Promote adityadhanraj042@gmail.com to admin
  const result = db.prepare(`UPDATE users SET is_admin = 1 WHERE email = ?`).run('adityadhanraj042@gmail.com');
  
  if (result.changes > 0) {
    console.log('Successfully promoted adityadhanraj042@gmail.com to admin!');
  } else {
    console.log('User adityadhanraj042@gmail.com not found. They will need to register first, then you can run this script again or promote them manually.');
  }

} catch (err) {
  console.error('Migration failed:', err);
} finally {
  db.close();
}

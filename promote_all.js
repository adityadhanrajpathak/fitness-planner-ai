require('dotenv').config();
const { initDatabase, getAllUsers, promoteUser } = require('./server/models/database');

async function makeEveryoneAdmin() {
  try {
    await initDatabase();
    const users = await getAllUsers.all();
    console.log(`Found ${users.length} users.`);

    for (const u of users) {
      await promoteUser.run(u.id);
      console.log(`Promoted: ${u.name} (${u.email})`);
    }

    console.log('✅ Everyone is now an admin.');
  } catch (err) {
    console.error('Error:', err);
  }
}

makeEveryoneAdmin();

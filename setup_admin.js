require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDatabase, createUser, findUserByEmail, promoteUser } = require('./server/models/database');

async function createAdmin() {
  try {
    await initDatabase();
    
    const email = 'adityadhanraj042@gmail.com';
    const name = 'Aditya';
    const password = 'aditya#06';
    
    // Create or find user
    let user = await findUserByEmail.get(email);
    
    if (!user) {
      console.log('User not found. Trying to create...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const result = await createUser.run(name, email, hashedPassword);
      
      const newUserId = result.lastInsertRowid.toString();
      console.log(`Created user with ID: ${newUserId}`);
      
      await promoteUser.run(newUserId);
    } else {
      console.log(`User found with ID: ${user.id}`);
      await promoteUser.run(user.id);
    }

    console.log(`✅ Success! ${email} is now the Admin.`);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

createAdmin();

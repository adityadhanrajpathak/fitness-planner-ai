require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDatabase, createUser, findUserByEmail, promoteUser } = require('./server/models/database');

async function fixUser() {
  try {
    await initDatabase();
    
    const email = 'adityadhanraj042@gmail.com';
    const name = 'Aditya';
    const password = 'aditya#06';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // We can't delete directly without getClient, but we can just use the createUser method
    // But since the current row has email='Aditya', and name='$2a$10$...', we can just 
    // insert a new row because 'adityadhanraj042@gmail.com' is not currently taken as an email in the DB!
    // The broken row has email='Aditya'. 
    
    // So let's just create the user correctly.
    // The order in database.js is: createUser = prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');
    // So we pass: email, hashedPassword, name
    const result = await createUser.run(email, hashedPassword, name);
    const newUserId = result.lastInsertRowid;
    
    await promoteUser.run(newUserId);
    
    console.log(`✅ Success! Corrected the user record with ID ${newUserId}`);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

fixUser();

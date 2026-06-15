require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDatabase, findUserByEmail, updateUserPassword } = require('./server/models/database');

async function updatePassword() {
  try {
    await initDatabase();
    
    const email = 'adityadhanraj042@gmail.com';
    const newPassword = 'aditya#06';
    
    const user = await findUserByEmail.get(email);
    if (!user) {
      console.log('User not found!');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await updateUserPassword.run(hashedPassword, user.id);
    console.log(`✅ Password for ${email} has been updated to: ${newPassword}`);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

updatePassword();

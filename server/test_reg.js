const { hashPassword } = require('./auth');
const db = require('./db/database');

async function test() {
  console.log('Starting registration test...');
  try {
    const username = 'testuser_' + Math.floor(Math.random() * 10000);
    console.log('Attempting to hash password...');
    const hp = await hashPassword('password123');
    console.log('Hashed Password:', hp);
    
    console.log('Attempting DB Insert for:', username);
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hp, 'user'], function(err) {
      if (err) {
        console.error('DATABASE ERROR:', err);
      } else {
        console.log('REGISTRATION SUCCESSFUL! New User ID:', this.lastID);
      }
      // Give DB time to finish
      setTimeout(() => {
        db.close();
        process.exit(0);
      }, 500);
    });
  } catch (e) {
    console.error('CRITICAL LOGIC ERROR:', e);
    process.exit(1);
  }
}

test();

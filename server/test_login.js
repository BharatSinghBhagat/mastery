const { comparePassword } = require('./auth');
const db = require('./db/database');

async function testLogin() {
  console.log('Testing Admin Login...');
  const username = 'admin';
  const password = 'admin';

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) {
      console.error('User not found or DB error:', err || 'User empty');
      process.exit(1);
    }
    
    console.log('User found:', user.username, 'Role:', user.role);
    console.log('Comparing passwords...');
    const isValid = await comparePassword(password, user.password);
    
    if (isValid) {
      console.log('LOGIN SUCCESSFUL!');
    } else {
      console.error('LOGIN FAILED: Invalid Password');
      console.log('Stored Hash:', user.password);
    }
    db.close();
  });
}

testLogin();

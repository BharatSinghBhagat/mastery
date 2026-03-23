const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/interview.db');
const adminPassword = '$2b$10$TpKPXzB2yhGMtO1IW2Xm0.s/HJwEn9iy1NXGGkTxG3qer4eM/PEJO'; // 'admin' hashed

db.run('UPDATE users SET password = ? WHERE username = ?', [adminPassword, 'admin'], function(err) {
  if (err) {
    console.error('Update Error:', err);
  } else {
    console.log('Admin password updated! Rows affected:', this.changes);
  }
  db.close();
});

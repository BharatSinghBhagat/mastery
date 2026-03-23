const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'db', 'interview.db');
const db = new sqlite3.Database(dbPath);

console.log('Inspecting Database at:', dbPath);

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err);
      process.exit(1);
    }
    console.log('Tables found:', tables.map(t => t.name).join(', '));
    
    tables.forEach(table => {
      db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
        if (err) {
          console.error(`Error fetching columns for ${table.name}:`, err);
          return;
        }
        console.log(`- ${table.name} columns:`, columns.map(c => c.name).join(', '));
      });
    });
  });
});
setTimeout(() => db.close(), 2000);

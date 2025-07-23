const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const readline = require('readline');

const dbPath = path.join(__dirname, '..', 'data', 'data.db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚨 DATABASE RESET UTILITY 🚨');
console.log('This will permanently delete ALL data in the database!');
console.log('Database path:', dbPath);
console.log('');

rl.question('Are you absolutely sure you want to reset the database? Type "YES DELETE ALL" to confirm: ', (answer) => {
  if (answer === 'YES DELETE ALL') {
    console.log('Resetting database...');
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
      }
      
      db.serialize(() => {
        // Drop existing tables
        db.run(`DROP TABLE IF EXISTS submissions`, (err) => {
          if (err) {
            console.error('Error dropping submissions table:', err);
          } else {
            console.log('✓ Dropped submissions table');
          }
        });
        
        db.run(`DROP TABLE IF EXISTS contribution_ledger`, (err) => {
          if (err) {
            console.error('Error dropping contribution_ledger table:', err);
          } else {
            console.log('✓ Dropped contribution_ledger table');
          }
        });
        
        // Recreate tables
        db.run(`
          CREATE TABLE submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            points TEXT NOT NULL,
            label TEXT DEFAULT 'human',
            grid_size TEXT DEFAULT '32x32',
            features TEXT,
            timestamp_bucket TEXT,
            opted_in_for_credit BOOLEAN DEFAULT true,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating submissions table:', err);
          } else {
            console.log('✓ Created submissions table');
          }
        });
        
        db.run(`
          CREATE TABLE contribution_ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            contribution_count INTEGER DEFAULT 0,
            opted_out BOOLEAN DEFAULT false,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating contribution_ledger table:', err);
          } else {
            console.log('✓ Created contribution_ledger table');
          }
        });
        
        // Recreate indexes
        db.run(`
          CREATE INDEX idx_timestamp_bucket 
          ON submissions(timestamp_bucket)
        `, (err) => {
          if (err) {
            console.error('Error creating timestamp index:', err);
          } else {
            console.log('✓ Created timestamp index');
          }
        });
        
        db.run(`
          CREATE INDEX idx_username 
          ON contribution_ledger(username)
        `, (err) => {
          if (err) {
            console.error('Error creating username index:', err);
          } else {
            console.log('✓ Created username index');
          }
          
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('✅ Database reset complete!');
              console.log('All data has been permanently deleted.');
            }
            rl.close();
          });
        });
      });
    });
  } else {
    console.log('Database reset cancelled.');
    rl.close();
  }
});

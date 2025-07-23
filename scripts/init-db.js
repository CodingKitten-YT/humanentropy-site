const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'data.db');

console.log('Creating database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

db.serialize(() => {
  // Create submissions table (anonymous)
  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
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
      console.log('Submissions table created successfully');
    }
  });
  
  // Create contribution ledger - separate from submissions
  db.run(`
    CREATE TABLE IF NOT EXISTS contribution_ledger (
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
      console.log('Contribution ledger table created successfully');
    }
  });
  
  // Create indexes
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_timestamp_bucket 
    ON submissions(timestamp_bucket)
  `, (err) => {
    if (err) {
      console.error('Error creating timestamp index:', err);
    } else {
      console.log('Timestamp index created successfully');
    }
  });
  
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_username 
    ON contribution_ledger(username)
  `, (err) => {
    if (err) {
      console.error('Error creating username index:', err);
    } else {
      console.log('Username index created successfully');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database initialization complete!');
  }
});

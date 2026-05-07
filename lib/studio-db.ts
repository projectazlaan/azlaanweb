import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'studio.db');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Singleton database connection
const db = new Database(DB_PATH);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS page_states (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at INTEGER
  );
  CREATE TABLE IF NOT EXISTS gallery_meta (
    id TEXT PRIMARY KEY,
    tags TEXT,
    favorite INTEGER
  );
`);

// Prepared statements for better performance
export const getPageStateStmt = db.prepare('SELECT value FROM page_states WHERE key = ?');
export const setPageStateStmt = db.prepare('INSERT OR REPLACE INTO page_states (key, value, updated_at) VALUES (?, ?, ?)');

export const getGalleryMetaStmt = db.prepare('SELECT tags, favorite FROM gallery_meta WHERE id = ?');
export const getAllGalleryMetaStmt = db.prepare('SELECT id, tags, favorite FROM gallery_meta');
export const setGalleryMetaStmt = db.prepare('INSERT OR REPLACE INTO gallery_meta (id, tags, favorite) VALUES (?, ?, ?)');

export default db;

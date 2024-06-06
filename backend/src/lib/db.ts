import dotenv from 'dotenv';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3'

// to read info from .env file
dotenv.config();

const filename = process.env.SQLITE_DIR ?? '/tmp/sp-database.db';

const db = await open({
  filename: filename,
  driver: sqlite3.Database
});

await db.run(`CREATE TABLE IF NOT EXISTS users (
  name TEXT,
  city TEXT,
  country TEXT,
  favorite_sport TEXT
)`);

export default db;

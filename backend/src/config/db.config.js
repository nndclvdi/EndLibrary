import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL belum diisi. Isi backend/.env agar backend tersambung ke Neon PostgreSQL.');
}

const isLocalDatabase = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');

const db = new Pool({
  connectionString,
  ssl: connectionString && !isLocalDatabase ? { rejectUnauthorized: false } : false,
});

export default db;

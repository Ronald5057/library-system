// Creates the first admin account: membership ID "A001", password "admin123"
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const hash = await bcrypt.hash('admin123', 10);
await pool.query(
  `INSERT IGNORE INTO users (name, membership_id, role, password_hash) VALUES (?, ?, 'admin', ?)`,
  ['Administrator', 'A001', hash]
);
console.log('Admin created: A001 / admin123');
process.exit(0);

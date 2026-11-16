import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

const router = Router();
const COLUMNS = 'id, name, membership_id, role';

router.post('/login', async (req, res, next) => {
  try {
    const { membership_id, password } = req.body;
    if (!membership_id || !password) return res.status(400).json({ error: 'Membership ID and password are required.' });
    const [rows] = await pool.query('SELECT * FROM users WHERE membership_id=?', [membership_id]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Wrong membership ID or password.' });
    res.json({ id: user.id, name: user.name, membership_id: user.membership_id, role: user.role });
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT ${COLUMNS} FROM users ORDER BY name`);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, membership_id, role, password } = req.body;
    if (!name || !membership_id || !password) return res.status(400).json({ error: 'Name, membership ID and password are required.' });
    if (!['admin', 'member'].includes(role)) return res.status(400).json({ error: 'Role must be admin or member.' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, membership_id, role, password_hash) VALUES (?, ?, ?, ?)',
      [name, membership_id, role, hash]
    );
    res.status(201).json({ id: result.insertId, name, membership_id, role });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, membership_id, role, password } = req.body;
    if (!name || !membership_id) return res.status(400).json({ error: 'Name and membership ID are required.' });
    if (!['admin', 'member'].includes(role)) return res.status(400).json({ error: 'Role must be admin or member.' });
    let result;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      [result] = await pool.query('UPDATE users SET name=?, membership_id=?, role=?, password_hash=? WHERE id=?', [name, membership_id, role, hash, req.params.id]);
    } else {
      [result] = await pool.query('UPDATE users SET name=?, membership_id=?, role=? WHERE id=?', [name, membership_id, role, req.params.id]);
    }
    if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ id: Number(req.params.id), name, membership_id, role });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (e) { next(e); }
});

export default router;

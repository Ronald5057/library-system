import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.type, t.quantity, t.created_at,
             b.title AS book_title, u.name AS user_name
      FROM transactions t
      JOIN books b ON b.id = t.book_id
      LEFT JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC, t.id DESC`);
    res.json(rows);
  } catch (e) { next(e); }
});

// type = ADD_STOCK (new copies arrive) or BORROW (a member takes copies)
router.post('/', async (req, res, next) => {
  const { book_id, user_id, type, quantity } = req.body;
  const qty = Number(quantity);
  if (!book_id || !['ADD_STOCK', 'BORROW'].includes(type) || !Number.isInteger(qty) || qty < 1)
    return res.status(400).json({ error: 'Choose a book, a type and a quantity of 1 or more.' });
  if (type === 'BORROW' && !user_id)
    return res.status(400).json({ error: 'Choose the member who is borrowing.' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT quantity FROM books WHERE id=? FOR UPDATE', [book_id]);
    if (!rows.length) { await conn.rollback(); return res.status(404).json({ error: 'Book not found' }); }

    const change = type === 'ADD_STOCK' ? qty : -qty;
    if (rows[0].quantity + change < 0) {
      await conn.rollback();
      return res.status(400).json({ error: `Only ${rows[0].quantity} cop${rows[0].quantity === 1 ? 'y' : 'ies'} in stock.` });
    }
    await conn.query('UPDATE books SET quantity = quantity + ? WHERE id=?', [change, book_id]);
    const [result] = await conn.query(
      'INSERT INTO transactions (book_id, user_id, type, quantity) VALUES (?, ?, ?, ?)',
      [book_id, type === 'BORROW' ? user_id : null, type, qty]
    );
    await conn.commit();
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
});

export default router;

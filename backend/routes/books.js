import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function validate({ title, author, genre, isbn, quantity }) {
  if (!title || !author || !genre || !isbn) return 'Title, author, genre and ISBN are required.';
  if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) return 'Quantity must be a whole number, 0 or more.';
  return null;
}

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, author, genre, isbn, quantity } = req.body;
    const [result] = await pool.query(
      'INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)',
      [title, author, genre, isbn, quantity]
    );
    res.status(201).json({ id: result.insertId, title, author, genre, isbn, quantity: Number(quantity) });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, author, genre, isbn, quantity } = req.body;
    const [result] = await pool.query(
      'UPDATE books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?',
      [title, author, genre, isbn, quantity, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Book not found' });
    res.json({ id: Number(req.params.id), title, author, genre, isbn, quantity: Number(quantity) });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (e) { next(e); }
});

export default router;

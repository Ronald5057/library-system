import { useState } from 'react';
import Message from './Message.jsx';

const EMPTY = { title: '', author: '', genre: '', isbn: '', quantity: 0 };

// Used for both adding (no `initial`) and editing (`initial` = the book)
export default function BookForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [error, setError] = useState('');
  const editing = Boolean(initial);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.genre.trim()) return setError('Fill in title, author and genre.');
    if (!/^[0-9-]{10,17}$/.test(form.isbn.trim())) return setError('ISBN must be 10 to 13 digits (dashes allowed).');
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0) return setError('Quantity must be a whole number, 0 or more.');
    try {
      await onSubmit({ ...form, quantity: Number(form.quantity) });
      setError('');
      if (!editing) setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
      <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
      <input name="quantity" type="number" min="0" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
      <div className="row">
        <button className="btn" type="submit">{editing ? 'Save changes' : 'Add book'}</button>
        {editing && <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
      <Message text={error} />
    </form>
  );
}

import { useState } from 'react';
import Message from './Message.jsx';

export default function TransactionForm({ books, users, onSubmit }) {
  const [form, setForm] = useState({ book_id: '', user_id: '', type: 'ADD_STOCK', quantity: 1 });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.book_id) return setError('Choose a book.');
    if (form.type === 'BORROW' && !form.user_id) return setError('Choose the member who is borrowing.');
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) return setError('Quantity must be 1 or more.');
    try {
      await onSubmit({ ...form, quantity: Number(form.quantity) });
      setError('');
      setForm({ ...form, quantity: 1 });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="ADD_STOCK">Add stock (new copies arrived)</option>
        <option value="BORROW">Borrow (deduct stock)</option>
      </select>
      <select name="book_id" value={form.book_id} onChange={handleChange}>
        <option value="">Choose a book</option>
        {books.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.quantity} in stock)</option>)}
      </select>
      {form.type === 'BORROW' && (
        <select name="user_id" value={form.user_id} onChange={handleChange}>
          <option value="">Choose a member</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.membership_id})</option>)}
        </select>
      )}
      <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} />
      <button className="btn" type="submit">{form.type === 'ADD_STOCK' ? 'Add stock' : 'Record borrowing'}</button>
      <Message text={error} />
    </form>
  );
}

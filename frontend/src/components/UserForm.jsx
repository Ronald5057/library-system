import { useState } from 'react';
import Message from './Message.jsx';

const EMPTY = { name: '', membership_id: '', role: 'member', password: '' };

export default function UserForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ? { ...initial, password: '' } : EMPTY);
  const [error, setError] = useState('');
  const editing = Boolean(initial);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.membership_id.trim()) return setError('Name and membership ID are required.');
    if (!editing && form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (editing && form.password && form.password.length < 6) return setError('New password must be at least 6 characters.');
    try {
      await onSubmit(form);
      setError('');
      if (!editing) setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
      <input name="membership_id" placeholder="Membership ID" value={form.membership_id} onChange={handleChange} />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <input
        name="password" type="password"
        placeholder={editing ? 'New password (leave blank to keep)' : 'Password'}
        value={form.password} onChange={handleChange}
      />
      <div className="row">
        <button className="btn" type="submit">{editing ? 'Save changes' : 'Add user'}</button>
        {editing && <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
      <Message text={error} />
    </form>
  );
}

import { useState } from 'react';
import { api } from '../api.js';
import Message from './Message.jsx';

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ membership_id: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.membership_id.trim() || !form.password) return setError('Enter your membership ID and password.');
    try {
      onLogin(await api.login(form));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form narrow" onSubmit={handleSubmit}>
      <input name="membership_id" placeholder="Membership ID" value={form.membership_id} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <button className="btn" type="submit">Log in</button>
      <Message text={error} />
    </form>
  );
}

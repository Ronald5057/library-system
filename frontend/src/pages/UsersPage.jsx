import { useEffect, useState } from 'react';
import { api } from '../api.js';
import LoginForm from '../components/LoginForm.jsx';
import UserForm from '../components/UserForm.jsx';
import UserList from '../components/UserList.jsx';
import Message from '../components/Message.jsx';

export default function UsersPage({ user, onLogin }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const isAdmin = user?.role === 'admin';

  const load = () => api.getUsers().then(setUsers).catch((e) => setError(e.message));
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (!user) {
    return (
      <section>
        <h1>Log in</h1>
        <LoginForm onLogin={onLogin} />
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section>
        <h1>Your account</h1>
        <p>Signed in as {user.name} ({user.membership_id}). Only admins can manage users.</p>
      </section>
    );
  }

  const addUser = async (u) => { await api.addUser(u); await load(); };
  const updateUser = async (id, u) => { await api.updateUser(id, u); await load(); };
  const deleteUser = async (id) => {
    try { await api.deleteUser(id); await load(); } catch (e) { setError(e.message); }
  };

  return (
    <section>
      <h1>User management</h1>
      <h2>Add a user</h2>
      <UserForm onSubmit={addUser} />
      <h2>All users</h2>
      <Message text={error} />
      <UserList users={users} currentUserId={user.id} onUpdate={updateUser} onDelete={deleteUser} />
    </section>
  );
}

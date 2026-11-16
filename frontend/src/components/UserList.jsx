import { useState } from 'react';
import UserForm from './UserForm.jsx';

export default function UserList({ users, currentUserId, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (!users.length) return <p className="empty">No users yet.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((u) =>
            editingId === u.id ? (
              <tr key={u.id}>
                <td colSpan="4">
                  <UserForm
                    initial={u}
                    onSubmit={async (data) => { await onUpdate(u.id, data); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                </td>
              </tr>
            ) : (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.membership_id}</td>
                <td>{u.role}</td>
                <td className="actions">
                  <button className="btn small" onClick={() => setEditingId(u.id)}>Update</button>
                  <button
                    className="btn small danger"
                    disabled={u.id === currentUserId}
                    onClick={() => window.confirm(`Delete ${u.name}?`) && onDelete(u.id)}
                  >Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

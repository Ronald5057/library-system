import { useState } from 'react';
import BookForm from './BookForm.jsx';

export default function BookList({ books, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (!books.length) return <p className="empty">No books yet. Add your first book above.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {books.map((book) =>
            editingId === book.id ? (
              <tr key={book.id}>
                <td colSpan="6">
                  <BookForm
                    initial={book}
                    onSubmit={async (data) => { await onUpdate(book.id, data); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                </td>
              </tr>
            ) : (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td className="actions">
                  <button className="btn small" onClick={() => setEditingId(book.id)}>Update</button>
                  <button
                    className="btn small danger"
                    onClick={() => window.confirm(`Delete "${book.title}"?`) && onDelete(book.id)}
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

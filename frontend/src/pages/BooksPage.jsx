import { useEffect, useState } from 'react';
import { api } from '../api.js';
import BookForm from '../components/BookForm.jsx';
import BookList from '../components/BookList.jsx';
import Message from '../components/Message.jsx';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  const load = () => api.getBooks().then(setBooks).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const addBook = async (book) => { await api.addBook(book); await load(); };
  const updateBook = async (id, book) => { await api.updateBook(id, book); await load(); };
  const deleteBook = async (id) => {
    try { await api.deleteBook(id); await load(); } catch (e) { setError(e.message); }
  };

  return (
    <section>
      <h1>Book management</h1>
      <h2>Add a book</h2>
      <BookForm onSubmit={addBook} />
      <h2>All books</h2>
      <Message text={error} />
      <BookList books={books} onUpdate={updateBook} onDelete={deleteBook} />
    </section>
  );
}

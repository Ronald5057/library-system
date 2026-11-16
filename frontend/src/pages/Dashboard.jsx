import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Message from '../components/Message.jsx';

const LOW_STOCK = 2;

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getBooks().then(setBooks).catch((e) => setError(e.message));
  }, []);

  const lowStock = books.filter((b) => b.quantity < LOW_STOCK);

  return (
    <section>
      <h1>Book availability</h1>
      <Message text={error} />
      {lowStock.length > 0 && (
        <p className="message warn">
          {lowStock.length} book{lowStock.length > 1 ? 's are' : ' is'} running low: {lowStock.map((b) => b.title).join(', ')}.
        </p>
      )}
      <div className="cards">
        {books.map((b) => (
          <article key={b.id} className={`card ${b.quantity < LOW_STOCK ? 'low' : ''}`}>
            <h3>{b.title}</h3>
            <p>{b.author} &middot; {b.genre}</p>
            <p className="stock">{b.quantity} in stock{b.quantity < LOW_STOCK && ' (low)'}</p>
          </article>
        ))}
      </div>
      {!books.length && !error && <p className="empty">No books in the library yet.</p>}
    </section>
  );
}

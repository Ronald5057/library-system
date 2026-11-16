import { useEffect, useState } from 'react';
import { api } from '../api.js';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionLog from '../components/TransactionLog.jsx';
import Message from '../components/Message.jsx';

export default function TransactionsPage() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([api.getBooks(), api.getUsers(), api.getTransactions()])
      .then(([b, u, t]) => { setBooks(b); setUsers(u); setTransactions(t); })
      .catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  const record = async (t) => { await api.addTransaction(t); await load(); };

  return (
    <section>
      <h1>Transactions</h1>
      <Message text={error} />
      <h2>Record a transaction</h2>
      <TransactionForm books={books} users={users} onSubmit={record} />
      <h2>History</h2>
      <TransactionLog transactions={transactions} />
    </section>
  );
}

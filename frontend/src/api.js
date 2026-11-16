const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

export const api = {
  getBooks: () => request('/books'),
  addBook: (book) => request('/books', { method: 'POST', body: book }),
  updateBook: (id, book) => request(`/books/${id}`, { method: 'PUT', body: book }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),

  getTransactions: () => request('/transactions'),
  addTransaction: (t) => request('/transactions', { method: 'POST', body: t }),

  getUsers: () => request('/users'),
  addUser: (u) => request('/users', { method: 'POST', body: u }),
  updateUser: (id, u) => request(`/users/${id}`, { method: 'PUT', body: u }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  login: (creds) => request('/users/login', { method: 'POST', body: creds }),
};

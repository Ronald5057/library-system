import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BooksPage from './pages/BooksPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Pages other than Dashboard and Users need a logged-in user
  const requireLogin = (page) => (currentUser ? page : <Navigate to="/users" replace />);

  return (
    <>
      <Navbar user={currentUser} onLogout={() => setCurrentUser(null)} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={requireLogin(<BooksPage />)} />
          <Route path="/transactions" element={requireLogin(<TransactionsPage />)} />
          <Route path="/users" element={<UsersPage user={currentUser} onLogin={setCurrentUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

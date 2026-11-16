import { NavLink } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <span className="brand">Library Manager</span>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/users">Users</NavLink>
      </nav>
      <div className="session">
        {user ? (
          <>
            <span>{user.name} ({user.role})</span>
            <button className="btn small ghost" onClick={onLogout}>Log out</button>
          </>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </header>
  );
}

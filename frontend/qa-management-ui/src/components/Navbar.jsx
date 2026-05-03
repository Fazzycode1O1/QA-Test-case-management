import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">QA Management System</p>
        <h1>Workspace</h1>
      </div>

      <div className="navbar-user">
        <div className="user-summary">
          <strong>{user?.name || 'User'}</strong>
          <span>{user?.role || 'ROLE'}</span>
        </div>
        <button type="button" className="button button-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

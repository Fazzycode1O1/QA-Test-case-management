import { useEffect, useRef, useState } from 'react';
import {
  HiOutlineBell, HiOutlineLogout, HiOutlineUser,
  HiOutlineChevronDown, HiOutlineSearch
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../utils/roles';

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  const notifPath = user?.role
    ? `/${user.role.toLowerCase()}/notifications`
    : '/notifications';

  useEffect(() => {
    if (!user?.userId) return;
    api.get(`/notifications/user/${user.userId}/unread`)
      .then((r) => setUnreadCount(r.data.length))
      .catch(() => {});
  }, [user?.userId]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [dropdownOpen]);

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <p className="eyebrow">QA Management System</p>
        <h1>Workspace</h1>
      </div>

      <div className="navbar-search">
        <HiOutlineSearch size={15} style={{ flexShrink: 0 }} />
        <input type="search" placeholder="Search…" aria-label="Search" />
      </div>

      <div className="navbar-actions">
        {/* Notification bell */}
        <button
          type="button"
          className="notif-bell"
          onClick={() => navigate(notifPath)}
          title="Notifications"
        >
          <HiOutlineBell size={20} />
          {unreadCount > 0 && (
            <span className="notif-bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>

        {/* User menu */}
        <div className="user-menu" ref={menuRef}>
          <button
            type="button"
            className="user-menu-trigger"
            onClick={() => setDropdownOpen((p) => !p)}
            aria-expanded={dropdownOpen}
          >
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <div className="user-menu-name">
              <strong>{user?.name || 'User'}</strong>
              <span>{user?.role}</span>
            </div>
            <HiOutlineChevronDown
              size={14}
              className={`user-menu-chevron${dropdownOpen ? ' open' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <strong>{user?.name}</strong>
                <span>{user?.email || ''}</span>
                <div>
                  <span className="user-dropdown-role">{user?.role}</span>
                </div>
              </div>

              <div className="user-dropdown-items">
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => { navigate(getRoleDashboard(user?.role)); setDropdownOpen(false); }}
                >
                  <HiOutlineUser size={15} />
                  Dashboard
                </button>
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => { navigate(notifPath); setDropdownOpen(false); }}
                >
                  <HiOutlineBell size={15} />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="notif-count" style={{ marginLeft: 'auto' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="user-dropdown-divider" />

                <button
                  type="button"
                  className="user-dropdown-item danger"
                  onClick={handleLogout}
                >
                  <HiOutlineLogout size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

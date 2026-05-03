import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineTrash
} from 'react-icons/hi';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { fmtDateTime } from '../utils/formatters';

export default function Notifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isLoading, setIsLoading]  = useState(true);
  const [error, setError]          = useState('');

  useEffect(() => { fetchNotifications(); }, [showUnreadOnly]);

  async function fetchNotifications() {
    setIsLoading(true);
    setError('');
    try {
      const url = showUnreadOnly
        ? `/notifications/user/${user.userId}/unread`
        : `/notifications/user/${user.userId}`;
      const res = await api.get(url);
      setNotifications(res.data);
    } catch {
      setError('Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }

  async function markRead(id) {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: res.data.read } : n));
    } catch {
      toast.error('Could not mark as read.');
    }
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => api.put(`/notifications/${n.id}/read`).catch(() => {})));
    await fetchNotifications();
    toast.success('All notifications marked as read.');
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((p) => p.filter((n) => n.id !== id));
      toast.success('Notification deleted.');
    } catch {
      toast.error('Could not delete notification.');
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>
            Notifications
            {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
          </h2>
        </div>
        {unreadCount > 0 && (
          <button className="button button-secondary btn-icon" onClick={markAllRead}>
            <HiOutlineCheckCircle size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="tab-bar">
        <button
          className={`tab ${!showUnreadOnly ? 'tab-active' : ''}`}
          onClick={() => setShowUnreadOnly(false)}
        >
          All
        </button>
        <button
          className={`tab ${showUnreadOnly ? 'tab-active' : ''}`}
          onClick={() => setShowUnreadOnly(true)}
        >
          Unread {unreadCount > 0 && <span className="notif-count" style={{ fontSize: '0.65rem' }}>{unreadCount}</span>}
        </button>
      </div>

      {isLoading && <div className="status-box">Loading notifications…</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!isLoading && !error && notifications.length === 0 && (
        <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 40 }}>
          <HiOutlineBell size={36} style={{ color: '#c8d8d3' }} />
          {showUnreadOnly ? 'No unread notifications.' : 'No notifications yet.'}
        </div>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="notif-list">
          {notifications.map((n) => (
            <article key={n.id} className={`notif-card ${n.read ? 'notif-read' : 'notif-unread'}`}>
              <div className="notif-body">
                <strong className="notif-title">{n.title}</strong>
                <p className="notif-message">{n.message}</p>
                <span className="notif-time">{fmtDateTime(n.createdAt)}</span>
              </div>
              <div className="notif-actions">
                {!n.read && (
                  <button className="button button-sm button-secondary btn-icon" onClick={() => markRead(n.id)}>
                    <HiOutlineCheckCircle size={13} /> Mark read
                  </button>
                )}
                <button className="button button-sm button-danger btn-icon" onClick={() => handleDelete(n.id)}>
                  <HiOutlineTrash size={13} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

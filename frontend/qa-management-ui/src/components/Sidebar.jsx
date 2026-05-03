import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/modules', label: 'Modules' },
  { to: '/test-cases', label: 'Test Cases' },
  { to: '/test-executions', label: 'Executions' },
  { to: '/defects', label: 'Defects' },
  { to: '/test-suites', label: 'Test Suites' },
  { to: '/test-plans', label: 'Test Plans' },
  { to: '/reports', label: 'Reports' },
  { to: '/notifications', label: 'Notifications' }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">QA</span>
        <div>
          <strong>QAMS</strong>
          <small>Test Management</small>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

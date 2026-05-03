import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlinePlay,
  HiOutlineExclamationCircle,
  HiOutlineCollection,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineChevronLeft,
  HiOutlineChevronRight
} from 'react-icons/hi';

const ROLE_LINKS = {
  ADMIN: [
    { to: '/admin/dashboard',       label: 'Dashboard',     Icon: HiOutlineHome },
    { to: '/admin/projects',        label: 'Projects',      Icon: HiOutlineFolder },
    { to: '/admin/modules',         label: 'Modules',       Icon: HiOutlineViewGrid },
    { to: '/admin/test-cases',      label: 'Test Cases',    Icon: HiOutlineDocumentText },
    { to: '/admin/test-executions', label: 'Executions',    Icon: HiOutlinePlay },
    { to: '/admin/defects',         label: 'Defects',       Icon: HiOutlineExclamationCircle },
    { to: '/admin/test-suites',     label: 'Test Suites',   Icon: HiOutlineCollection },
    { to: '/admin/test-plans',      label: 'Test Plans',    Icon: HiOutlineClipboardList },
    { to: '/admin/reports',         label: 'Reports',       Icon: HiOutlineChartBar },
    { to: '/admin/notifications',   label: 'Notifications', Icon: HiOutlineBell }
  ],
  TESTER: [
    { to: '/tester/dashboard',       label: 'Dashboard',     Icon: HiOutlineHome },
    { to: '/tester/test-cases',      label: 'Test Cases',    Icon: HiOutlineDocumentText },
    { to: '/tester/test-suites',     label: 'Test Suites',   Icon: HiOutlineCollection },
    { to: '/tester/test-plans',      label: 'Test Plans',    Icon: HiOutlineClipboardList },
    { to: '/tester/test-executions', label: 'Executions',    Icon: HiOutlinePlay },
    { to: '/tester/defects',         label: 'Defects',       Icon: HiOutlineExclamationCircle },
    { to: '/tester/notifications',   label: 'Notifications', Icon: HiOutlineBell }
  ],
  DEVELOPER: [
    { to: '/developer/dashboard',     label: 'Dashboard',     Icon: HiOutlineHome },
    { to: '/developer/defects',       label: 'Defects',       Icon: HiOutlineExclamationCircle },
    { to: '/developer/notifications', label: 'Notifications', Icon: HiOutlineBell }
  ]
};

export default function Sidebar({ role, collapsed, onToggle }) {
  const links = ROLE_LINKS[role] ?? [];

  return (
    <aside className={`sidebar${collapsed ? ' sidebar-collapsed' : ''}`}>
      <div className="brand">
        <span className="brand-mark">QA</span>
        {!collapsed && (
          <div>
            <strong>QAMS</strong>
            <small>Test Management</small>
          </div>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Icon className="nav-icon" />
            {!collapsed && <span className="nav-label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <HiOutlineChevronRight size={18} /> : <HiOutlineChevronLeft size={18} />}
      </button>
    </aside>
  );
}

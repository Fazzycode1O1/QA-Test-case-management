import { useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';
import { getRoleDashboard } from './utils/roles';
import AdminDashboard from './pages/AdminDashboard';
import TesterDashboard from './pages/TesterDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import Defects from './pages/Defects';
import Login from './pages/Login';
import Modules from './pages/Modules';
import Notifications from './pages/Notifications';
import Projects from './pages/Projects';
import Register from './pages/Register';
import Reports from './pages/Reports';
import TestCases from './pages/TestCases';
import TestExecutions from './pages/TestExecutions';
import TestPlans from './pages/TestPlans';
import TestSuites from './pages/TestSuites';

function AppShell({ role }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className="app-shell"
      style={{ gridTemplateColumns: collapsed ? '62px minmax(0,1fr)' : '260px minmax(0,1fr)' }}
    >
      <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      <main className="main-area">
        <Navbar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboard(user?.role)} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── ADMIN ── full system access ─────────────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AppShell role="ADMIN" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"       element={<AdminDashboard />} />
        <Route path="projects"        element={<Projects />} />
        <Route path="modules"         element={<Modules />} />
        <Route path="test-cases"      element={<TestCases />} />
        <Route path="test-executions" element={<TestExecutions />} />
        <Route path="defects"         element={<Defects />} />
        <Route path="test-suites"     element={<TestSuites />} />
        <Route path="test-plans"      element={<TestPlans />} />
        <Route path="reports"         element={<Reports />} />
        <Route path="notifications"   element={<Notifications />} />
      </Route>

      {/* ── TESTER ── testing workflow only ─────────────────────── */}
      <Route
        path="/tester"
        element={
          <ProtectedRoute allowedRole="TESTER">
            <AppShell role="TESTER" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"       element={<TesterDashboard />} />
        <Route path="test-cases"      element={<TestCases />} />
        <Route path="test-suites"     element={<TestSuites />} />
        <Route path="test-plans"      element={<TestPlans />} />
        <Route path="test-executions" element={<TestExecutions />} />
        <Route path="defects"         element={<Defects />} />
        <Route path="notifications"   element={<Notifications />} />
      </Route>

      {/* ── DEVELOPER ── defect handling only ───────────────────── */}
      <Route
        path="/developer"
        element={
          <ProtectedRoute allowedRole="DEVELOPER">
            <AppShell role="DEVELOPER" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"     element={<DeveloperDashboard />} />
        <Route path="defects"       element={<Defects />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      <Route path="/"  element={<RootRedirect />} />
      <Route path="*"  element={<RootRedirect />} />
    </Routes>
  );
}

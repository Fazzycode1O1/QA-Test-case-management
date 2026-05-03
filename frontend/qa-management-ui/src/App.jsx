import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
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

function AppShell() {
  return (
    <ProtectedRoute>
      <div className="app-shell">
        <Sidebar />
        <main className="main-area">
          <Navbar />
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="modules" element={<Modules />} />
        <Route path="test-cases" element={<TestCases />} />
        <Route path="test-executions" element={<TestExecutions />} />
        <Route path="defects" element={<Defects />} />
        <Route path="test-suites" element={<TestSuites />} />
        <Route path="test-plans" element={<TestPlans />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

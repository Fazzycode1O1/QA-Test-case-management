import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../utils/roles';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={getRoleDashboard(user?.role)} replace />;
  }

  return children;
}

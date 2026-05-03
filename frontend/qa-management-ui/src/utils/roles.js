export function getRoleDashboard(role) {
  switch (role) {
    case 'ADMIN':     return '/admin/dashboard';
    case 'TESTER':    return '/tester/dashboard';
    case 'DEVELOPER': return '/developer/dashboard';
    default:          return '/login';
  }
}

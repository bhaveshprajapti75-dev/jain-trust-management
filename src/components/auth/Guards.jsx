import { Navigate, Outlet } from 'react-router-dom'
import { ROLES } from '../../config/roles'

// Note: Replace with actual auth logic
const getAuthUser = () => {
  const role = localStorage.getItem('userRole') || ROLES.SUPER_ADMIN
  return {
    isAuthenticated: true, 
    role: role
  }
}

export function ProtectedRoute() {
  const user = getAuthUser()
  
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function RoleGuard({ allowedRoles }) {
  const user = getAuthUser()

  if (!allowedRoles.includes(user.role)) {
    if (user.role === ROLES.SANGH_ADMIN) return <Navigate to="/sangh-admin" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

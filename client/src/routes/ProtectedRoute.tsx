import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type ProtectedRouteProps = {
    allowedRoles: string[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { token, role } = useAuth()

    if (!token) {
        return <Navigate to='/login' replace />
    }

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to={role === 'ADMIN' ? '/dashboard' : '/collector'} replace />
    }

    return <Outlet />
}

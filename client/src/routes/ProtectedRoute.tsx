import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type ProtectedRouteProps = {
    allowedRoles: string[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { usuario, role, loading } = useAuth()

    if (loading) return null

    if (!usuario) {
        // 401 em /usuarios/me já disparou o redirect pro hub (client.ts)
        return null
    }

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to={role === 'ADMIN' ? '/dashboard' : '/collector'} replace />
    }

    return <Outlet />
}

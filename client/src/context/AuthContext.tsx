import { useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import { getMeuUsuario, type Usuario } from '../api/users'

const HUB_URL = 'https://hub.lojanovamix.com.br'

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMeuUsuario()
            .then(setUsuario)
            .catch(() => setUsuario(null))
            .finally(() => setLoading(false))
    }, [])

    function logout() {
        window.location.href = HUB_URL
    }

    return (
        <AuthContext.Provider value={{ usuario, role: usuario?.role ?? null, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )

}

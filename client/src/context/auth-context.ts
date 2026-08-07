import { createContext } from 'react'
import type { Usuario } from '../api/users'

export type AuthContextType = {
    usuario: Usuario | null
    role: string | null
    loading: boolean
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

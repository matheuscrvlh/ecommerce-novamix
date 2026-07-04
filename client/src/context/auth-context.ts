import { createContext } from 'react'

export type AuthContextType = {
    token: string | null
    role: string | null
    login: (token: string) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

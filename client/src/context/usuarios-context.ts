import { createContext } from 'react'
import type { Usuario } from '../api/users'

export type UsuariosContextType = {
    usuarios: Usuario[]
    carregando: boolean
    erro: string
    recarregar: () => void
}

export const UsuariosContext = createContext<UsuariosContextType | null>(null)

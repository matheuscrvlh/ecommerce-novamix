import { createContext } from 'react'
import type { UsuarioResumo } from '../api/users'

export type UsuariosResumoContextType = {
    usuarios: UsuarioResumo[]
    carregando: boolean
    erro: string
    recarregar: () => void
}

export const UsuariosResumoContext = createContext<UsuariosResumoContextType | null>(null)

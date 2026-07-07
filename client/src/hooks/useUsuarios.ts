import { useContext } from 'react'
import { UsuariosContext } from '../context/usuarios-context'

export function useUsuarios() {
    const context = useContext(UsuariosContext)

    if (!context) {
        throw new Error('useUsuarios deve ser usado dentro de um UsuariosProvider')
    }

    return context
}

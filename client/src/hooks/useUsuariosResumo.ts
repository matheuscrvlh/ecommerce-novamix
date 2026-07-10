import { useContext } from 'react'
import { UsuariosResumoContext } from '../context/usuarios-resumo-context'

export function useUsuariosResumo() {
    const context = useContext(UsuariosResumoContext)

    if (!context) {
        throw new Error('useUsuariosResumo deve ser usado dentro de um UsuariosResumoProvider')
    }

    return context
}

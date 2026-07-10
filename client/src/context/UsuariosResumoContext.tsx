import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { getUsuariosResumo, type UsuarioResumo } from '../api/users'
import { useAuth } from '../hooks/useAuth'
import { UsuariosResumoContext } from './usuarios-resumo-context'

export function UsuariosResumoProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth()

    const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [versao, setVersao] = useState(0)

    const recarregar = useCallback(() => {
        setVersao((atual) => atual + 1)
    }, [])

    useEffect(() => {
        if (!token) return

        let cancelado = false

        getUsuariosResumo(token)
            .then((result) => {
                if (cancelado) return
                setUsuarios(result)
                setErro('')
                setCarregando(false)
            })
            .catch((error) => {
                if (cancelado) return
                setErro(error instanceof Error ? error.message : 'Erro ao buscar usuários.')
                setCarregando(false)
            })

        return () => {
            cancelado = true
        }
    }, [token, versao])

    return (
        <UsuariosResumoContext.Provider value={{ usuarios, carregando, erro, recarregar }}>
            {children}
        </UsuariosResumoContext.Provider>
    )
}

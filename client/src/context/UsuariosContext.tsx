import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { getUsuarios, type Usuario } from '../api/users'
import { useAuth } from '../hooks/useAuth'
import { UsuariosContext } from './usuarios-context'

export function UsuariosProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth()

    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [versao, setVersao] = useState(0)

    const recarregar = useCallback(() => {
        setVersao((atual) => atual + 1)
    }, [])

    useEffect(() => {
        if (!token) return

        let cancelado = false

        getUsuarios(token)
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
        <UsuariosContext.Provider value={{ usuarios, carregando, erro, recarregar }}>
            {children}
        </UsuariosContext.Provider>
    )
}

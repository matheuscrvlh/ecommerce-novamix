import client from './client.ts'

export type Usuario = {
    id: number
    nome: string
    role: string
    access: string
    status: boolean
    cracha: string
}

export type UsuarioResumo = {
    id: number
    nome: string
}

export async function getUsuarios(): Promise<Usuario[]> {
    return client({ url: '/usuarios', method: 'GET' })
}

export async function getUsuariosResumo(): Promise<UsuarioResumo[]> {
    return client({ url: '/usuarios/resumo', method: 'GET' })
}

export async function getMeuUsuario(): Promise<Usuario> {
    return client({ url: '/usuarios/me', method: 'GET' })
}

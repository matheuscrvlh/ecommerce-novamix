import client from './client.ts'

export type Usuario = {
    id: number
    nome: string
    role: string
    cracha: string | null
    status: boolean
    hub_user_id: number | null
    criado_em: string
}

type CreateUsuarioParams = {
    nome: string
    role: string
    cracha: string
    hub_user_id: number | null
}

type UpdateUsuarioParams = {
    id: number
    nome: string
    role: string
    cracha: string
    status: boolean
    hub_user_id: number | null
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

export async function createUsuario({ nome, role, cracha, hub_user_id }: CreateUsuarioParams) {
    return client({ url: '/usuarios', method: 'POST', data: { nome, role, cracha, hub_user_id } })
}

export async function updateUsuario({ id, nome, role, cracha, status, hub_user_id }: UpdateUsuarioParams) {
    return client({ url: '/usuarios', method: 'PUT', data: { id, nome, role, cracha, status, hub_user_id } })
}

export async function deleteUsuario(id: number) {
    return client({ url: '/usuarios', method: 'DELETE', data: { id } })
}

type UpdateMeParams = {
    nome: string
}

export async function getMeuUsuario(): Promise<Usuario> {
    return client({ url: '/usuarios/me', method: 'GET' })
}

export async function updateMe({ nome }: UpdateMeParams) {
    return client({ url: '/usuarios/me', method: 'PUT', data: { nome } })
}

import client from './client.ts'

export type Usuario = {
    id: number
    nome: string
    login: string
    role: string
    cracha: string | null
    status: boolean
    criado_em: string
}

type CreateUsuarioParams = {
    nome: string
    login: string
    senha: string
    role: string
    cracha: string
    token: string
}

type UpdateUsuarioParams = {
    id: number
    nome: string
    login: string
    role: string
    cracha: string
    status: boolean
    token: string
}

type UpdatePasswordParams = {
    idUsuario: number
    novaSenha: string
    token: string
}

export type UsuarioResumo = {
    id: number
    nome: string
}

export async function getUsuarios(token: string): Promise<Usuario[]> {
    return client({ url: '/usuarios', token, method: 'GET' })
}

export async function getUsuariosResumo(token: string): Promise<UsuarioResumo[]> {
    return client({ url: '/usuarios/resumo', token, method: 'GET' })
}

export async function createUsuario({ nome, login, senha, role, cracha, token }: CreateUsuarioParams) {
    return client({ url: '/usuarios', token, method: 'POST', data: { nome, login, senha, role, cracha } })
}

export async function updateUsuario({ id, nome, login, role, cracha, status, token }: UpdateUsuarioParams) {
    return client({ url: '/usuarios', token, method: 'PUT', data: { id, nome, login, role, cracha, status } })
}

export async function updatePassword({ idUsuario, novaSenha, token }: UpdatePasswordParams) {
    return client({ url: '/usuarios', token, method: 'PATCH', data: { idUsuario, novaSenha } })
}

export async function deleteUsuario(id: number, token: string) {
    return client({ url: '/usuarios', token, method: 'DELETE', data: { id } })
}

type UpdateMeParams = {
    nome: string
    login: string
    token: string
}

type UpdateMyPasswordParams = {
    novaSenha: string
    token: string
}

export async function getMeuUsuario(token: string): Promise<Usuario> {
    return client({ url: '/usuarios/me', token, method: 'GET' })
}

export async function updateMe({ nome, login, token }: UpdateMeParams) {
    return client({ url: '/usuarios/me', token, method: 'PUT', data: { nome, login } })
}

export async function updateMyPassword({ novaSenha, token }: UpdateMyPasswordParams) {
    return client({ url: '/usuarios/me/senha', token, method: 'PATCH', data: { novaSenha } })
}

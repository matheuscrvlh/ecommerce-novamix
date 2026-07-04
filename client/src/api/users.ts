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
    token: string
}

type UpdateUsuarioParams = CreateUsuarioParams & {
    id: number
    status: boolean
}

export async function getUsuarios(token: string): Promise<Usuario[]> {
    return client({ url: '/usuarios', token, method: 'GET' })
}

export async function createUsuario({ nome, login, senha, role, token }: CreateUsuarioParams) {
    return client({ url: '/usuarios', token, method: 'POST', data: { nome, login, senha, role } })
}

export async function updateUsuario({ id, nome, login, senha, role, status, token }: UpdateUsuarioParams) {
    return client({ url: '/usuarios', token, method: 'PUT', data: { id, nome, login, senha, role, status } })
}

export async function deleteUsuario(id: number, token: string) {
    return client({ url: '/usuarios', token, method: 'DELETE', data: { id } })
}

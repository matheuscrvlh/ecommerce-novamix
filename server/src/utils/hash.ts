import { hash, compare } from 'bcryptjs'

export async function hashPassword(password: string) {
    try {
        const hashedPassword = await hash(password, 10);

        return hashedPassword
    } catch {
        throw new Error('Erro ao hashear senha.')
    }
}

export async function comparePassword(password: string, passwordHash: string) {
    try {
        const verify = await compare(password, passwordHash)

        return verify
    } catch {
        throw new Error('Erro ao comparar senhas.')
    }
}
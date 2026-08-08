import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/jwt.ts";

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            sub: number
            role: 'ADMIN' | 'OPERADOR'
            hubPermissions: { module: string, access: string }[]
        }
    }
}

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
    const authHeader = req.headers['authorization'];
    const token = req.cookies.token ?? authHeader?.split(' ')[1]

    if (!token) {
        return res.code(401).send({ error: 'Autorização não encontrada.' })
    }

    try {
        const payload = verifyToken(token)
        const access = payload.permissions.find(p => p.module === 'ecommerce')?.access

        if (!access) {
            return res.code(403).send({ error: 'Usuário não tem acesso ao módulo ecommerce no hub.' })
        }

        req.user = {
            sub: payload.sub,
            role: access === 'admin' ? 'ADMIN' : 'OPERADOR',
            hubPermissions: payload.permissions
        }
    } catch (error) {
        console.error(error)
        return res.code(401).send({ error: 'Token inválido ou expirado.' })
    }
}

export async function checkAdmin(req: FastifyRequest, res: FastifyReply) {
    const access = req.user.hubPermissions.find(p => p.module === 'ecommerce')?.access

    if (access === 'admin') {
        return null
    } else {
        return res.code(403).send({ error: 'Usuário não liberado.' })
    }
}

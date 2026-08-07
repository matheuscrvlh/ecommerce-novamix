import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/jwt.ts";
import { db } from "../database/database.ts";

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            sub: number
            role: 'ADMIN' | 'OPERADOR'
            cracha: string | null
            hubSub: number
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

        const local = await db.query(
            'SELECT id, role, cracha, status FROM usuarios WHERE hub_user_id = $1',
            [payload.sub]
        )

        if (local.rows.length === 0) {
            return res.code(403).send({ error: 'Sua conta do hub ainda não foi vinculada a um usuário do ecommerce. Peça para um administrador vincular.' })
        }

        if (!local.rows[0].status) {
            return res.code(403).send({ error: 'Usuário desativado.' })
        }

        req.user = {
            sub: local.rows[0].id,
            role: local.rows[0].role,
            cracha: local.rows[0].cracha,
            hubSub: payload.sub,
            hubPermissions: payload.permissions
        }
    } catch {
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

import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/jwt.ts";

declare module 'fastify' {
    interface FastifyRequest {
        user: any
    }
}

export async function authenticate(req:FastifyRequest, res:FastifyReply) {
    const authHeader = req.headers['authorization'];
    
    if(!authHeader) {
        return res.code(401).send({ error: 'Erro ao encontrar token.'})
    }

    const token = authHeader.split(' ')[1]

    try {
        req.user = verifyToken(token)
    } catch {
        return res.code(401).send({ error: 'Erro ao verificar authorization.'})
    }
}

export async function checkAdmin(req:FastifyRequest, res:FastifyReply) {
    const role = req.user.role

    if(role === 'ADMIN') {
        return null
    } else {
        return res.code(403).send({ error: 'Usuário não liberado.'})
    }
}
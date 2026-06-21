import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { hashPassword } from '../utils/hash.js'
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.js'

type CreateUserBody = {
    nome: string
    login: string
    senha: string
    role: string
}

async function createUser(req: FastifyRequest<{Body: CreateUserBody}>, res: FastifyReply) {
    const { nome, login, senha, role } = req.body

    try{
        const passwordHashed = await hashPassword(senha);

        await db.query(
            'INSERT INTO usuarios (nome, login, senha, role) VALUES ($1, $2, $3, $4)',
            [nome, login, passwordHashed, role]
        )

        return res.code(201).send({ success: `Usuario ${nome} criado com sucesso.`})
    } catch {
        res.code(400).send({ error: 'Erro ao criar usuario.'})
    }
}

export async function usersRoutes(fastify: FastifyInstance) {
    fastify.post('/usuarios', { preHandler: [authenticate, checkAdmin] }, createUser)
}


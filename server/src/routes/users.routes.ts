import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { hashPassword } from '../utils/hash.js'
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.js'

type CreateUserBody = {
    id: number
    nome: string
    login: string
    senha: string
    role: string
    status: boolean
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

async function getUsers(req:FastifyRequest, res:FastifyReply) {
    const result = await db.query(
        'SELECT * FROM usuarios'
    );

    return res.code(200).send(result.rows)
}

async function putUser(req:FastifyRequest<{Body: CreateUserBody}>, res:FastifyReply) {
    const { id, nome, login, senha, role, status } = req.body

    const passwordHashed = await hashPassword(senha)

    const result = await db.query(
        'UPDATE usuarios SET nome = $1, login = $2, senha = $3, role = $4, status = $5 WHERE id = $6',
        [nome, login, passwordHashed, role, status, id]
    );

    if(!result) {
        throw new Error('Nenhum usuário encontrado.')
    }

    return res.code(200).send({ success: 'Usuário editado com sucesso.'})
}

async function deleteUser(req:FastifyRequest<{Body: CreateUserBody}>, res:FastifyReply) {
    const { id } = req.body

    const result = await db.query(
        'DELETE FROM usuarios WHERE id = $1',
        [id]
    );

    if(!result) {
        return res.code(401).send({ error: 'Erro ao deletar usuário.'})
    };

    return res.code(204).send({ success: 'Usuário deletado com sucesso'})
}

export async function usersRoutes(fastify: FastifyInstance) {
    fastify.post('/usuarios', { preHandler: [authenticate, checkAdmin] }, createUser);
    fastify.get('/usuarios', { preHandler: [authenticate, checkAdmin] }, getUsers);
    fastify.put('/usuarios', { preHandler: [authenticate, checkAdmin] }, putUser);
    fastify.delete('/usuarios', { preHandler: [authenticate, checkAdmin] }, deleteUser);
}


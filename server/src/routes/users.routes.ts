import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { hashPassword } from '../utils/hash.ts'
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.ts'

type CreateUserBody = {
    id: number
    nome: string
    login: string
    senha: string
    role: string
    cracha: string
    status: boolean
}

async function createUser(req: FastifyRequest<{Body: CreateUserBody}>, res: FastifyReply) {
    const { nome, login, senha, role, cracha } = req.body

    try{
        const passwordHashed = await hashPassword(senha);

        await db.query(
            'INSERT INTO usuarios (nome, login, senha, role, cracha) VALUES ($1, $2, $3, $4, $5)',
            [nome, login, passwordHashed, role, cracha]
        )

        return res.code(201).send({ success: `Usuario ${nome} criado com sucesso.`})
    } catch {
        res.code(400).send({ error: 'Erro ao criar usuario.'})
    }
}

async function getUsers(req:FastifyRequest, res:FastifyReply) {
    const result = await db.query(
        'SELECT id, nome, login, role, cracha, status, criado_em FROM usuarios'
    );

    return res.code(200).send(result.rows)
}

async function putUser(req:FastifyRequest<{Body: CreateUserBody}>, res:FastifyReply) {
    const { id, nome, login, senha, role, cracha, status } = req.body

    const passwordHashed = await hashPassword(senha)

    const result = await db.query(
        'UPDATE usuarios SET nome = $1, login = $2, senha = $3, role = $4, cracha = $5, status = $6 WHERE id = $7',
        [nome, login, passwordHashed, role, cracha, status, id]
    );

    if(result.rowCount === 0) {
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

    if(result.rowCount === 0) {
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


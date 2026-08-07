import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.ts'

type CreateUserBody = {
    id: number
    nome: string
    role: string
    cracha: string
    status: boolean
    hub_user_id: number
}

type UpdateMeBody = {
    nome: string
}

async function createUser(req: FastifyRequest<{Body: CreateUserBody}>, res: FastifyReply) {
    const { nome, role, cracha, hub_user_id } = req.body

    try{
        await db.query(
            'INSERT INTO usuarios (nome, role, cracha, hub_user_id) VALUES ($1, $2, $3, $4)',
            [nome, role, cracha, hub_user_id]
        )

        return res.code(201).send({ success: `Usuario ${nome} criado com sucesso.`})
    } catch {
        res.code(400).send({ error: 'Erro ao criar usuario.'})
    }
}

async function getUsers(req:FastifyRequest, res:FastifyReply) {
    const result = await db.query(
        'SELECT id, nome, role, cracha, status, hub_user_id, criado_em FROM usuarios'
    );

    return res.code(200).send(result.rows)
}

async function getMeUser(req:FastifyRequest, res:FastifyReply) {
    const id = req.user.sub

    try {
        const result = await db.query(`
            SELECT id, nome, role, cracha, status, hub_user_id, criado_em
            FROM usuarios
            WHERE id = $1
        `,[id]);

        return res.code(200).send(result.rows[0])
    } catch (error) {
        console.log(error)
        res.code(401).send({ error: 'Erro ao buscar user'})
    }

}

async function getResumeUsers(req:FastifyRequest, res:FastifyReply) {
    const result = await db.query(
        'SELECT id, nome FROM usuarios'
    );

    return res.code(200).send(result.rows)
}

async function putUser(req:FastifyRequest<{Body: CreateUserBody}>, res:FastifyReply) {
    const { id, nome, role, cracha, status, hub_user_id } = req.body

    const result = await db.query(
        'UPDATE usuarios SET nome = $1, role = $2, cracha = $3, status = $4, hub_user_id = $5 WHERE id = $6',
        [nome, role, cracha, status, hub_user_id, id]
    );

    if(result.rowCount === 0) {
        throw new Error('Nenhum usuário encontrado.')
    };

    return res.code(200).send({ success: 'Usuário editado com sucesso.'})
}

async function putMe(req:FastifyRequest<{Body: UpdateMeBody}>, res:FastifyReply) {
    const id = req.user.sub
    const { nome } = req.body

    const result = await db.query(
        'UPDATE usuarios SET nome = $1 WHERE id = $2',
        [nome, id]
    );

    if(result.rowCount === 0) {
        throw new Error('Nenhum usuário encontrado.')
    };

    return res.code(200).send({ success: 'Usuário editado com sucesso.'})
}

async function deleteUser(req:FastifyRequest<{Body: CreateUserBody}>, res:FastifyReply) {
    const { id } = req.body

    try {
        const result = await db.query(`
            DELETE FROM usuarios WHERE id = $1
            `,[id]
        );

        if(result.rowCount === 0) {
            return res.code(404).send({ error: 'Erro ao deletar usuário.'})
        };

        return res.code(200).send({ success: 'Usuário deletado com sucesso'})
    } catch (error) {
        console.log(error);

        if((error as { code?: string }).code === '23503') {
            return res.code(409).send({ error: 'Não é possível excluir: este usuário possui pedidos vinculados.'})
        }

        res.code(500).send({ error: 'Erro ao deletar usuário.'})
    }
}

export async function usersRoutes(fastify: FastifyInstance) {
    fastify.post('/usuarios', { preHandler: [authenticate, checkAdmin] }, createUser);
    fastify.get('/usuarios', { preHandler: [authenticate, checkAdmin] }, getUsers);
    fastify.get('/usuarios/me', { preHandler: [authenticate] }, getMeUser);
    fastify.get('/usuarios/resumo', { preHandler: [authenticate] }, getResumeUsers);
    fastify.put('/usuarios', { preHandler: [authenticate, checkAdmin] }, putUser);
    fastify.put('/usuarios/me', { preHandler: [authenticate] }, putMe);
    fastify.delete('/usuarios', { preHandler: [authenticate, checkAdmin] }, deleteUser);
}

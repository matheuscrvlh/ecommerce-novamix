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

type UpdateMeBody = {
    nome: string
    login: string
}

type UpdatePasswordBody = {
    idUsuario: number
    novaSenha: string
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

async function getMeUser(req:FastifyRequest, res:FastifyReply) {
    const id = req.user.sub

    try {
        const result = await db.query(`
            SELECT id, nome, login, role, cracha, status, criado_em 
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
    const { id, nome, login, role, cracha, status } = req.body

    const result = await db.query(
        'UPDATE usuarios SET nome = $1, login = $2, role = $3, cracha = $4, status = $5 WHERE id = $6',
        [nome, login, role, cracha, status, id]
    );

    if(result.rowCount === 0) {
        throw new Error('Nenhum usuário encontrado.')
    };

    return res.code(200).send({ success: 'Usuário editado com sucesso.'})
}

async function putMe(req:FastifyRequest<{Body: UpdateMeBody}>, res:FastifyReply) {
    const id = req.user.sub
    const { nome, login } = req.body

    const result = await db.query(
        'UPDATE usuarios SET nome = $1, login = $2 WHERE id = $3',
        [nome, login, id]
    );

    if(result.rowCount === 0) {
        throw new Error('Nenhum usuário encontrado.')
    };

    return res.code(200).send({ success: 'Usuário editado com sucesso.'})
}

async function putPassword(req: FastifyRequest<{Body: UpdatePasswordBody}>, res: FastifyReply) {
    const { idUsuario, novaSenha } = req.body

    try {
        const passwordHashed = await hashPassword(novaSenha)

        const result = await db.query(`
            UPDATE usuarios
            SET senha = $1
            WHERE id = $2
        `, [passwordHashed, idUsuario])

        if(result.rowCount === 0) {
            res.code(401).send({ error: 'Erro ao editar senha'})
            return
        }

        res.code(201).send({ success: 'Senha alterada com sucesso'})
    } catch (error) {
        console.log(error)
        res.code(401).send({ error: 'Erro ao editar senha.'})
    }
}

async function putMePassword(req: FastifyRequest<{Body: UpdatePasswordBody}>, res: FastifyReply) {
    const id = req.user.sub
    const { novaSenha } = req.body

    try {
        const passwordHashed = await hashPassword(novaSenha)

        const result = await db.query(`
            UPDATE usuarios
            SET senha = $1
            WHERE id = $2
        `, [passwordHashed, id])

        if(result.rowCount === 0) {
            res.code(401).send({ error: 'Erro ao editar senha'})
            return
        }

        res.code(201).send({ success: 'Senha alterada com sucesso'})
    } catch (error) {
        console.log(error)
        res.code(401).send({ error: 'Erro ao editar senha.'})
    }
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
    fastify.patch('/usuarios', { preHandler: [authenticate, checkAdmin] }, putPassword);
    fastify.patch('/usuarios/me/senha', { preHandler: [authenticate] }, putMePassword);
    fastify.delete('/usuarios', { preHandler: [authenticate, checkAdmin] }, deleteUser);
}


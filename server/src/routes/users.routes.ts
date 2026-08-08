import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { findHubUsuarioEcommerce, listHubUsuariosEcommerce } from '../database/hub.database.ts'
import { crachaDoId } from '../utils/cracha.ts'
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.ts'

async function getUsers(req: FastifyRequest, res: FastifyReply) {
    const usuarios = await listHubUsuariosEcommerce()

    return res.code(200).send(usuarios.map((usuario) => ({
        ...usuario,
        role: usuario.access === 'admin' ? 'ADMIN' : 'OPERADOR',
        cracha: crachaDoId(usuario.id)
    })))
}

async function getMeUser(req: FastifyRequest, res: FastifyReply) {
    const usuario = await findHubUsuarioEcommerce(req.user.sub)

    if (!usuario) {
        return res.code(404).send({ error: 'Usuário não encontrado.' })
    }

    return res.code(200).send({
        ...usuario,
        role: usuario.access === 'admin' ? 'ADMIN' : 'OPERADOR',
        cracha: crachaDoId(usuario.id)
    })
}

async function getResumeUsers(req: FastifyRequest, res: FastifyReply) {
    const usuarios = await listHubUsuariosEcommerce()

    return res.code(200).send(usuarios.map(({ id, nome }) => ({ id, nome })))
}

export async function usersRoutes(fastify: FastifyInstance) {
    fastify.get('/usuarios', { preHandler: [authenticate, checkAdmin] }, getUsers);
    fastify.get('/usuarios/me', { preHandler: [authenticate] }, getMeUser);
    fastify.get('/usuarios/resumo', { preHandler: [authenticate] }, getResumeUsers);
}

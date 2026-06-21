import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { comparePassword } from '../utils/hash.js'

type LoginBody = {
    login: string,
    senha: string
}

async function login(req: FastifyRequest<{Body: LoginBody}>, res:FastifyReply) {
    const { login, senha } = req.body

    try {
        const searchPasswordUser = await db.query(
            'SELECT id, senha, role FROM usuarios WHERE login = $1',
            [login]
        )

        if(searchPasswordUser.rows.length === 0) {
            return res.code(401).send({ error: 'Usuario não encontrado'})
        }

        const compareUser = await comparePassword(senha, searchPasswordUser.rows[0].senha)

        if(!compareUser) {
            return res.code(401).send({ error: 'Senha inválida'})
        }

        // gerar jwt
        // retornar token


    } catch {
        res.code(401).send({ error: 'Erro ao efetuar login.'})
        throw new Error('Erro ao efetuar login.')
    }
}

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/login', login)
}
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { comparePassword } from '../utils/hash.ts'
import { generateToken, verifyToken } from '../utils/jwt.ts'

type LoginBody = {
    login: string,
    senha: string
}

async function login(req: FastifyRequest<{Body: LoginBody}>, res:FastifyReply) {
    const { login, senha } = req.body

    try {

        const identificador = login.trim()
        const ehNumerico = /^\d+$/.test(identificador)

        const searchPasswordUser = await db.query(
            ehNumerico
                ? 'SELECT id, senha, role FROM usuarios WHERE id = $1'
                : 'SELECT id, senha, role FROM usuarios WHERE login = $1',
            [ehNumerico ? Number(identificador) : identificador]
        );

        if(searchPasswordUser.rows.length === 0) {
            return res.code(401).send({ error: 'Usuario não encontrado'})
        }

        const compareUser = await comparePassword(senha, searchPasswordUser.rows[0].senha)

        if(!compareUser) {
            return res.code(401).send({ error: 'Senha inválida'})
        }

        const token = generateToken(
            searchPasswordUser.rows[0].id, 
            searchPasswordUser.rows[0].role
        )

        return res.code(200).send({ token })

    } catch {
        res.code(401).send({ error: 'Erro ao efetuar login.'})
    }
}

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/login', login)
}
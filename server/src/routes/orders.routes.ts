import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { authenticate } from '../middlewares/auth.middleware.ts'

type CreateOrderBody = {
    codigo_pedido: string
}

async function postOrder(req: FastifyRequest<{Body: CreateOrderBody}>, res: FastifyReply) {
    const { codigo_pedido } = req.body
    const operador_id = req.user.sub
    
    try {
        // consulta se ja existe o pedido
        const search = await db.query(
            'SELECT bipado_em FROM pedidos WHERE codigo_pedido = $1',
            [codigo_pedido]
        );

        if(search.rows.length > 0) {
            const date = search.rows[0].bipado_em

            const searchUser = await db.query(
                'SELECT nome FROM usuarios WHERE id = $1',
                [operador_id]
            );

            const user = searchUser.rows[0].nome

            return res.code(400).send({ error: `Pedido já bipado por ${user} em ${date}` })
        };

        // caso nao exista
        await db.query(
            'INSERT INTO pedidos (codigo_pedido, operador_id, bipado_em) VALUES ($1, $2, NOW())',
            [codigo_pedido, operador_id]
        );

        return res.code(201).send({ success: 'Pedido adicionado.'})
    } catch {
        res.code(400).send({ error: 'Erro ao adicionar pedido.' })
    }
    
}

export async function ordersRoutes(fastify: FastifyInstance) {
    fastify.post('/pedidos', { preHandler: [authenticate] }, postOrder)
}
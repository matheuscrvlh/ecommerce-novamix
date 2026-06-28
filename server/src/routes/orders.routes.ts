import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.ts'

type CreateOrderBody = {
    codigo_pedido: string
}

async function postOrder(req: FastifyRequest<{Body: CreateOrderBody}>, res: FastifyReply) {
    const { codigo_pedido } = req.body
    const operador_id = req.user.sub
    
    try {
        // consulta se ja existe o pedido
        const search = await db.query(
            'SELECT operador_id, bipado_em FROM pedidos WHERE codigo_pedido = $1',
            [codigo_pedido]
        );

        if(search.rows.length > 0) {
            const date = search.rows[0].bipado_em
            const idUser = search.rows[0].operador_id

            const user = await db.query(
                'SELECT nome FROM usuarios WHERE id = $1',
                [idUser]
            )

            const nome = user.rows[0]?.nome ?? 'Desconhecido'

            return res.code(400).send({ error: `Pedido já bipado por ${nome} em ${date}` })
        };

        // caso nao exista
        await db.query(
            'INSERT INTO pedidos (codigo_pedido, operador_id, bipado_em) VALUES ($1, $2, NOW())',
            [codigo_pedido, operador_id]
        );

        return res.code(201).send({ success: 'Pedido adicionado.'})
    } catch {
        res.code(500).send({ error: 'Erro ao adicionar pedido.' })
    }
}

async function getOrders(req: FastifyRequest, res: FastifyReply) {
    try {
        const result = await db.query(
            'SELECT * FROM pedidos'
        )

        return res.code(200).send(result.rows)
    } catch {
        res.code(500).send({ error: 'Erro ao buscar pedidos.'})
    }
}

async function deleteOrder(req: FastifyRequest<{Params: {codigo_pedido: string}}>, res: FastifyReply) {
    const codigo_pedido = req.params.codigo_pedido

    try {
        // verifica se existe
        const search = await db.query(
            'SELECT 1 FROM pedidos WHERE codigo_pedido = $1',
            [codigo_pedido]
        )

        if(!search.rows.length) {
            return res.code(400).send({ error: 'Pedido não encontrado.'})
        }

        // caso exista
        await db.query(
            'DELETE FROM pedidos WHERE codigo_pedido = $1',
            [codigo_pedido]
        )

        res.code(200).send({ success: 'Pedido deletado com sucesso.'})
    } catch {
        res.code(500).send({ error: 'Erro ao deletar pedido.'})
    }
}

export async function ordersRoutes(fastify: FastifyInstance) {
    fastify.post('/pedidos', { preHandler: [authenticate] }, postOrder);
    fastify.get('/pedidos', { preHandler: [authenticate, checkAdmin] }, getOrders);
    fastify.delete('/pedidos/:codigo_pedido', { preHandler: [authenticate, checkAdmin] }, deleteOrder)
}
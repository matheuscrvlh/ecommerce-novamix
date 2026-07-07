import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.ts'

type CreateOrderBody = {
    codigo_pedido: string
    cracha: string
}

type GetOrderBody = {
    dataInicial: string
    dataFinal: string
}

async function postOrder(req: FastifyRequest<{Body: CreateOrderBody}>, res: FastifyReply) {
    const { codigo_pedido, cracha } = req.body

    try {
        let usuario_id = req.user.sub

        if(cracha) {
            const operador = await db.query(
                'SELECT id FROM usuarios WHERE cracha = $1 AND status = true',
                [cracha]
            )

            if(operador.rows.length === 0) {
                return res.code(400).send({ error: 'Crachá não encontrado.' })
            }

            usuario_id = operador.rows[0].id
        }
        // consulta se ja existe o pedido
        const search = await db.query(
            'SELECT usuario_id, bipado_em FROM pedidos WHERE codigo_pedido = $1',
            [codigo_pedido]
        );

        if(search.rows.length > 0) {
            const date = search.rows[0].bipado_em
            const idUser = search.rows[0].usuario_id

            const user = await db.query(
                'SELECT nome FROM usuarios WHERE id = $1',
                [idUser]
            )

            const nome = user.rows[0]?.nome ?? 'Desconhecido'

            return res.code(400).send({ error: `Pedido já bipado por ${nome} em ${date}` })
        };

        // caso nao exista
        await db.query(
            'INSERT INTO pedidos (codigo_pedido, usuario_id, bipado_em) VALUES ($1, $2, NOW())',
            [codigo_pedido, usuario_id]
        );

        return res.code(201).send({ success: 'Pedido adicionado.'})
    } catch {
        res.code(500).send({ error: 'Erro ao adicionar pedido.' })
    }
}

async function getOrders(req: FastifyRequest<{Body: GetOrderBody}>, res: FastifyReply) {
    const { dataInicial, dataFinal } = req.body
    
    try {
        const result = await db.query(`
            SELECT * FROM pedidos
            ORDER BY bipado_em DESC
            WHERE bipado_em >= $1 AND bipado_em <= $2
        `,[dataInicial, dataFinal])

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
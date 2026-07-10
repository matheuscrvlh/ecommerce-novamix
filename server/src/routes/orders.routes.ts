import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { db } from '../database/database.ts'
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.ts'

type CreateOrderBody = {
    codigo_pedido: string
    cracha: string
}

type GetOrderBody = {
    codigoPedido?: string
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
    } catch (error) {
        console.error(error)
        res.code(500).send({ error: 'Erro ao adicionar pedido.' })
    }
}

async function getOrders(req: FastifyRequest<{Body: GetOrderBody}>, res: FastifyReply) {
    const { dataInicial, dataFinal } = req.body
    
    try {
        const result = await db.query(`
            SELECT * FROM pedidos
            WHERE bipado_em >= $1 AND bipado_em <= $2
            ORDER BY bipado_em DESC
        `,[dataInicial, dataFinal])

        return res.code(200).send(result.rows)
    } catch (error) {
        console.error(error)
        res.code(500).send({ error: 'Erro ao buscar pedidos.'})
    }
}

async function orderConsultation(req: FastifyRequest<{Body: GetOrderBody}>, res: FastifyReply) {
    const { codigoPedido } = req.body

    try {
        const result = await db.query(`
            SELECT * 
            FROM pedidos
            WHERE codigo_pedido = $1
        `, [codigoPedido])

        if(result.rows.length === 0) {
            res.code(404).send({ error: 'Pedido não encontrado.' })
            return
        }

        const idUser = result.rows[0]?.usuario_id
        const data = result.rows[0]?.bipado_em

        const searchUser = await db.query(`
            SELECT nome
            FROM usuarios
            WHERE id = $1
        `, [idUser])

        const nome = searchUser.rows[0]?.nome ?? 'Desconhecido'

        res.code(200).send({ success: `Pedido já coletado por ${nome} em ${data}`})
    } catch (error) {
        console.log(error)
        res.code(500).send({ error: 'Erro ao buscar pedidos.'})
    }
}

async function getOrdersCountByUser(req:FastifyRequest<{Body: GetOrderBody}>, res:FastifyReply) {
    const { dataInicial, dataFinal } = req.body

    try {
        const result = await db.query(`
            SELECT u.id, u.nome, count(codigo_pedido)
            FROM pedidos p
            JOIN usuarios u
            ON p.usuario_id = u.id
            WHERE bipado_em >= $1 AND bipado_em <= $2
            GROUP BY u.id, u.nome
        `,[dataInicial, dataFinal])

        return res.code(200).send(result.rows)
    } catch (error) {
        console.error(error)
        res.code(500).send({ error: 'Erro ao buscar pedidos por usuários.'})
    }
}

async function putOrder(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.body
    const codigo_pedido = req.params.codigo_pedido

    try {
        const searchOrder = await db.query(`
            SELECT codigo_pedido
            FROM pedidos
            WHERE codigo_pedido = $1
        `, [codigo_pedido]);

        if(searchOrder.rows.length === 0) {
            res.code(401).send({ error: 'Erro ao achar pedido'});
            return
        }

        const result = await db.query(`
            UPDATE pedidos
            SET usuario_id = $1, bipado_em = NOW()
            WHERE codigo_pedido = $2
        `, [id, codigo_pedido])

        res.code(200).send({ success: 'Sucesso ao editar pedido.'})
    } catch (error) {
        console.log(error);
        res.code(401).send({ error: 'Erro ao editar pedido.'})
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
    } catch (error) {
        console.error(error)
        res.code(500).send({ error: 'Erro ao deletar pedido.'})
    }
}

export async function ordersRoutes(fastify: FastifyInstance) {
    fastify.post('/pedidos', { preHandler: [authenticate] }, postOrder);
    fastify.post('/pedidos/buscar', { preHandler: [authenticate] }, getOrders);
    fastify.post('/pedidos/consulta', { preHandler: [authenticate] }, orderConsultation);
    fastify.post('/pedidos/resumo-usuarios', { preHandler: [authenticate] }, getOrdersCountByUser);
    fastify.put('/pedidos/:codigo_pedido', { preHandler: [authenticate, checkAdmin] }, putOrder);
    fastify.delete('/pedidos/:codigo_pedido', { preHandler: [authenticate, checkAdmin] }, deleteOrder)
}
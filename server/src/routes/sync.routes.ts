import { type FastifyRequest, type FastifyReply, type FastifyInstance } from "fastify";
import { db } from "../database/database.ts";
import { cissDb } from "../database/ciss.database.ts";
import { authenticate, checkAdmin } from "../middlewares/auth.middleware.ts";

type SyncOrdersBody = {
    dataInicial: string
    dataFinal: string
}

export async function syncOrders(req:FastifyRequest<{Body: SyncOrdersBody}>, res:FastifyReply) {
    const { dataInicial, dataFinal } = req.body

    try {
        const connectionCiss = await cissDb()

        const consultCISS = await connectionCiss.query(
            ''
        );

        if(!consultCISS) {
            throw new Error('Consulta com banco CISS falhou.');
        };
        
        await connectionCiss.close()

        const result = await db.query(
            'INSERT INTO pedidos (codigo_pedido) VALUES ($1) ON CONFLICT (codigo_pedido) DO NOTHING',
            [consultCISS]
        );

        res.code(200).send({ success: `Pedidos da data ${dataInicial} até ${dataFinal} sincronizados.`})

    } catch (error) {
        console.error(error);
        throw new Error('Erro de conexão com bancos.')
    }
}

export async function syncRoutes(fastify: FastifyInstance) {
    fastify.get('/sincronizar/pedidos', { preHandler: [authenticate, checkAdmin] }, syncOrders)
}
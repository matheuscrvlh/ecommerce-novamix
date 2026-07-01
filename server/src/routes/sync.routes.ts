import { type FastifyRequest, type FastifyReply, type FastifyInstance } from "fastify";
import { db } from "../database/database.ts";
import { connCiss } from "../database/ciss.database.ts";
import { authenticate, checkAdmin } from "../middlewares/auth.middleware.ts";

type SyncOrdersBody = {
    dataInicial: string
    dataFinal: string
}

export async function syncOrders(req:FastifyRequest<{Body: SyncOrdersBody}>, res:FastifyReply) {
    const { dataInicial, dataFinal } = req.body

    try {
        const conn = await connCiss()
        const stmt = await conn.prepare(` 
            SELECT
                oe.IDPEDIDO
            FROM DBA.ORCAMENTO_ECOMMERCE oe 
            JOIN DBA.PEDIDO_VENDA_EFETIVACAO pve
                ON oe.IDORCAMENTO = pve.IDORCAMENTO
            WHERE pve.DTHORAPROCESSAMENTO >= ?
            AND pve.DTHORAPROCESSAMENTO < ?
        `);
        
        const result = await stmt.execute([dataInicial, dataFinal])
        const consultCISS = await result.fetchAll()

        console.log(consultCISS.length)

        await conn.close()
        await stmt.close()
        await result.close()

        await Promise.all(
            consultCISS.map((row: { IDPEDIDO: string }) => 
                db.query(
                    'INSERT INTO pedidos (codigo_pedido) VALUES ($1) ON CONFLICT (codigo_pedido) DO NOTHING',
                    [row.IDPEDIDO]
                )
            )
        )

        res.code(200).send({ success: `Pedidos da data ${dataInicial} até ${dataFinal} sincronizados.`})
    } catch (error) {
        console.error(error);
        throw new Error('Erro de conexão com bancos.')
    }
}

export async function syncRoutes(fastify: FastifyInstance) {
    fastify.post('/sincronizar/pedidos', { preHandler: [authenticate, checkAdmin] }, syncOrders)
}
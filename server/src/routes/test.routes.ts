import type { FastifyInstance } from "fastify";

function test(req, res) {
    res.code(200).send({ success: 'Testado'})
}

export function testRoutes(fastify: FastifyInstance) {
    fastify.get('/teste', test)
}
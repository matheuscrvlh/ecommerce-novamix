import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { addClient, removeClient } from "../events/sse-hub.ts";

async function getEvents(req: FastifyRequest, res: FastifyReply) {
    res.hijack()

    res.raw.writeHead(200, {
        "Content-type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    })

    addClient(res)

    req.raw.on("close", () => {
        removeClient(res)
    })
}

export async function eventsRoutes(fastify: FastifyInstance) {
    fastify.get('/eventos', getEvents)
}
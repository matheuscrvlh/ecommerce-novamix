import type { FastifyReply } from "fastify";

const clients = new Set<FastifyReply>()

export function addClient(reply: FastifyReply) {
    clients.add(reply)
}

export function removeClient(reply: FastifyReply) {
    clients.delete(reply)
}

export function broadcast(event: string, data: unknown) {
    for (const client of clients) {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
        client.raw.write(message)
    }
}

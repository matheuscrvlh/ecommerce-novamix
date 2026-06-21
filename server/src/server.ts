import 'dotenv/config'
import Fastify from 'fastify'

// DB
import { db } from './database/database.ts' 

// ROUTES
import { usersRoutes } from './routes/users.routes.ts'
import { authRoutes } from './routes/auth.routes.ts'

const app = Fastify()

app.register(usersRoutes)
app.register(authRoutes)

async function start() {
    await app.listen({port: process.env.SERVER_PORT }, () => {})
    console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`)

    await db.query('SELECT NOW()')
    console.log('Supabase Conectado')
}

start()
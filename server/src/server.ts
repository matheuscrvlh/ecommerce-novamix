import 'dotenv/config'
import Fastify from 'fastify'
import { db } from './database/database.ts' 
import { testRoutes } from './routes/test.routes.js'
import { usersRoutes } from './routes/users.routes.ts'
import { authRoutes } from './routes/auth.routes.ts'
import { ordersRoutes } from './routes/orders.routes.ts'

const app = Fastify()

// Provisório - valida o env ao iniciar
if(!process.env.SERVER_PORT) {
    throw new Error('Erro ao achar SERVER_PORT no env.')
} else if (!process.env.DATABASE_URL) {
    throw new Error('Erro ao achar DATABASE_URL no env.')
} else if (!process.env.JWT_SECRET) {
    throw new Error('Erro ao achar JWT_SECRET no env.')
}

app.register(testRoutes)
app.register(usersRoutes)
app.register(authRoutes)
app.register(ordersRoutes)

async function start() {
    await app.listen({ port: process.env.SERVER_PORT }, () => {})
    console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`)

    await db.query('SELECT NOW()')
    console.log('Supabase Conectado')
}

start()
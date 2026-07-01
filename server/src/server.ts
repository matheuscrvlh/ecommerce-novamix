import 'dotenv/config'
import Fastify from 'fastify'
import { db } from './database/database.ts' 
import { connCiss } from './database/ciss.database.js'
import { usersRoutes } from './routes/users.routes.ts'
import { authRoutes } from './routes/auth.routes.ts'
import { ordersRoutes } from './routes/orders.routes.ts'
import { syncRoutes } from './routes/sync.routes.ts'

const app = Fastify()

// Provisório - valida o env ao iniciar
if(!process.env.SERVER_PORT) {
    throw new Error('Erro ao achar SERVER_PORT no env.')
} else if (!process.env.DATABASE_URL) {
    throw new Error('Erro ao achar DATABASE_URL no env.')
} else if (!process.env.JWT_SECRET) {
    throw new Error('Erro ao achar JWT_SECRET no env.')
} else if (!process.env.CISS_DATABASE_URL) {
    throw new Error('Erro ao achar CISS_DATABASE_URL no env.')
}

app.register(usersRoutes)
app.register(authRoutes)
app.register(ordersRoutes)
app.register(syncRoutes)

async function start() {
    await app.listen({ port: process.env.SERVER_PORT }, () => {})
    console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`)

    await db.query('SELECT NOW()')
    console.log('Supabase Conectado')

    const conn = await connCiss()
    await conn.query('SELECT 1 FROM SYSIBM.SYSDUMMY1')
    console.log('CISS Conectado.')
    await conn.close()
}

start()
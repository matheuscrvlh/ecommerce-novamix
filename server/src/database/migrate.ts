import 'dotenv/config'
import { db } from './database.ts'

// Arquivo pra iniciar banco em novo projeto caso queira

async function createTables() {

    try {
        const createTableOrders = await db.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id SERIAL PRIMARY KEY,
                codigo_pedido VARCHAR (100) UNIQUE NOT NULL,
                usuario_id INTEGER NOT NULL,
                canal VARCHAR (100),
                bipado_em TIMESTAMPTZ
            )
        `)

        console.log('Tabelas Criadas!')

        return
    } catch (error) {
        console.error(error)
        throw new Error('Erro ao comunicar com Supabase')
    }
}

createTables()

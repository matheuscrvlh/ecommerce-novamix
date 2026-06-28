import 'dotenv/config'
import { db } from './database.ts'
import { hashPassword } from '../utils/hash.ts'

// Arquivo pra iniciar banco em novo projeto caso queira

async function createTables() {

    try {
        const createType = await db.query(`
            CREATE TYPE usuario_cargo AS ENUM ('ADMIN', 'OPERADOR')
        `)

        const createTableUsers = await db.query(`
            CREATE TABLE usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                login VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(100) NOT NULL,
                role usuario_cargo NOT NULL,
                status BOOLEAN DEFAULT true,
                criado_em TIMESTAMP DEFAULT NOW()
            )
        `)

        const createTableOrders = await db.query(`
            CREATE TABLE pedidos (
                id SERIAL PRIMARY KEY,
                codigo_pedido VARCHAR (100) UNIQUE NOT NULL,
                operador_id INTEGER REFERENCES usuarios(id),
                bipado_em TIMESTAMP
            )
        `)

        console.log('Tabelas Criadas!')

        return
    } catch {
        throw new Error('Erro ao criar tabelas.')
    }
}

createTables()

async function createSeedUser() {
    const senhaHasheada = await hashPassword('092004')
    
    try {
        const result = await db.query(
            'INSERT INTO usuarios (nome, login, senha, role) VALUES ($1, $2, $3, $4)',
            ['Matheus Carvalho','matheus.carvalho',senhaHasheada,'ADMIN']
        )
        console.log(result)

        return db.end()
    } catch {
        throw new Error('Erro ao cadastrar user seed.')
    }
    
}

createSeedUser()
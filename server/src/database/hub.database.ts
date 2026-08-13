import { db } from './database.ts'

export type HubUsuario = {
    id: number
    nome: string
    status: boolean
    access: string
}

export async function findHubUsuarioEcommerce(id: number): Promise<HubUsuario | null> {
    const result = await db.query(`
        SELECT u.id, u.name AS nome, u.status, up.access
        FROM users u
        JOIN user_permissions up ON up.user_id = u.id
        JOIN modules m ON m.id = up.module_id
        WHERE m.slug = 'ecommerce' AND u.id = $1
    `, [id])

    return result.rows[0] ?? null
}

export async function listHubUsuariosEcommerce(): Promise<HubUsuario[]> {
    const result = await db.query(`
        SELECT u.id, u.name AS nome, u.status, up.access
        FROM users u
        JOIN user_permissions up ON up.user_id = u.id
        JOIN modules m ON m.id = up.module_id
        WHERE m.slug = 'ecommerce'
        ORDER BY u.name
    `)

    return result.rows
}

export async function findHubNomesPorId(ids: number[]): Promise<Map<number, string>> {
    if (ids.length === 0) return new Map()

    const result = await db.query(
        'SELECT id, name AS nome FROM users WHERE id = ANY($1)',
        [ids]
    )

    return new Map(result.rows.map((row) => [row.id, row.nome]))
}

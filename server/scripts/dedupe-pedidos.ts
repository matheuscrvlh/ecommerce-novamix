import 'dotenv/config'
import { db } from '../src/database/database.ts'

// Corrige duplicidade de pedidos:
//   npx tsx scripts/dedupe-pedidos.ts            -> só mostra o que seria feito
//   npx tsx scripts/dedupe-pedidos.ts --aplicar  -> aplica (com backup)
//
// 1. normaliza codigo_pedido (sem espaços, em maiúsculas), igual a utils/pedido.ts
// 2. apaga duplicatas mantendo a bipagem mais antiga (cópia em ecommerce.pedidos_duplicados_backup)
// 3. cria o UNIQUE em codigo_pedido se não existir

const APLICAR = process.argv.includes('--aplicar')
const NORMALIZADO = `upper(regexp_replace(codigo_pedido, '[[:space:]]', '', 'g'))`

async function main() {
    const client = await db.connect()

    try {
        const constraints = await client.query(`
            SELECT conname, pg_get_constraintdef(oid) AS def
            FROM pg_constraint
            WHERE conrelid = 'ecommerce.pedidos'::regclass AND contype IN ('u', 'p')
        `)
        const temUnique = constraints.rows.some((c) => c.def === 'UNIQUE (codigo_pedido)')

        console.log('Constraints:', constraints.rows.map((c) => `${c.conname} ${c.def}`).join(' | '))
        console.log('UNIQUE em codigo_pedido:', temUnique ? 'sim' : 'NÃO')

        const total = await client.query('SELECT count(*)::int AS n FROM ecommerce.pedidos')
        const sujos = await client.query(`SELECT count(*)::int AS n FROM ecommerce.pedidos WHERE codigo_pedido <> ${NORMALIZADO}`)

        const duplicados = await client.query(`
            SELECT ${NORMALIZADO} AS codigo,
                   count(*)::int AS vezes,
                   array_agg(id ORDER BY bipado_em NULLS LAST, id) AS ids,
                   array_agg(usuario_id ORDER BY bipado_em NULLS LAST, id) AS usuarios,
                   array_agg(bipado_em ORDER BY bipado_em NULLS LAST, id) AS horarios
            FROM ecommerce.pedidos
            GROUP BY 1
            HAVING count(*) > 1
            ORDER BY 2 DESC, 1
        `)

        console.log(`\nPedidos na tabela: ${total.rows[0].n}`)
        console.log(`Códigos fora do padrão (espaço ou minúscula): ${sujos.rows[0].n}`)
        console.log(`Códigos duplicados: ${duplicados.rows.length}`)

        for (const d of duplicados.rows) {
            console.log(`  ${d.codigo} (${d.vezes}x) ids=${d.ids.join(',')} usuarios=${d.usuarios.join(',')} mantém id ${d.ids[0]}`)
        }

        const outroUsuario = duplicados.rows.filter((d) => new Set(d.usuarios).size > 1).length
        console.log(`Duplicados bipados por usuários diferentes: ${outroUsuario}`)

        if (!APLICAR) {
            console.log('\nNada foi alterado. Rode com --aplicar para corrigir.')
            return
        }

        await client.query('BEGIN')

        // cópia completa antes de mexer, pra poder desfazer tudo
        const snapshot = `pedidos_backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
        await client.query(`CREATE TABLE ecommerce.${snapshot} AS SELECT * FROM ecommerce.pedidos`)

        await client.query(`
            CREATE TABLE IF NOT EXISTS ecommerce.pedidos_duplicados_backup
            (LIKE ecommerce.pedidos INCLUDING DEFAULTS)
        `)
        await client.query(`ALTER TABLE ecommerce.pedidos_duplicados_backup ADD COLUMN IF NOT EXISTS removido_em TIMESTAMPTZ DEFAULT NOW()`)

        const removidos = await client.query(`
            WITH ranqueados AS (
                SELECT id, row_number() OVER (PARTITION BY ${NORMALIZADO} ORDER BY bipado_em NULLS LAST, id) AS pos
                FROM ecommerce.pedidos
            ),
            apagados AS (
                DELETE FROM ecommerce.pedidos p
                USING ranqueados r
                WHERE p.id = r.id AND r.pos > 1
                RETURNING p.*
            )
            INSERT INTO ecommerce.pedidos_duplicados_backup
            SELECT * FROM apagados
        `)

        const limpos = await client.query(`
            UPDATE ecommerce.pedidos SET codigo_pedido = ${NORMALIZADO}
            WHERE codigo_pedido <> ${NORMALIZADO}
        `)

        if (!temUnique) {
            await client.query('ALTER TABLE ecommerce.pedidos ADD CONSTRAINT pedidos_codigo_pedido_key UNIQUE (codigo_pedido)')
        }

        await client.query('COMMIT')

        console.log(`\nAplicado: ${removidos.rowCount} duplicata(s) removida(s) (backup em ecommerce.pedidos_duplicados_backup), ${limpos.rowCount} código(s) normalizado(s)${temUnique ? '' : ', UNIQUE criado'}.`)
        console.log(`Cópia da tabela antes da correção: ecommerce.${snapshot}`)
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {})
        console.error('Erro, nada foi alterado:', error)
        process.exitCode = 1
    } finally {
        client.release()
        await db.end()
    }
}

main()

import client from './client.ts'

// Leitores podem mandar o mesmo código com espaços ou em minúsculas (ex.: Caps Lock ligado)
export function normalizarCodigo(codigo: string) {
    return codigo.replace(/\s/g, '').toUpperCase()
}

// As telas mandam o período no horário local ("2026-09-25T00:00:00"); o banco compara em UTC,
// então sem converter o "hoje" ia das 21h de ontem às 20:59 de hoje
function paraUTC(dataHoraLocal: string) {
    return new Date(dataHoraLocal).toISOString()
}

type PostOrderParams = {
    codigo_pedido: string
}

export async function postOrder({ codigo_pedido }: PostOrderParams) {
    return client({
        url: '/pedidos',
        method: 'POST',
        data: { codigo_pedido: normalizarCodigo(codigo_pedido) }
    })
}

type GetOrdersParams = {
    dataInicial: string
    dataFinal: string
}

export async function getOrders({ dataInicial, dataFinal }: GetOrdersParams) {
    return client({
        url: '/pedidos/buscar',
        method: 'POST',
        data: { dataInicial: paraUTC(dataInicial), dataFinal: paraUTC(dataFinal) }
    })
}

type GetRankingParams = {
    dataInicial: string
    dataFinal: string
}

export type RankingUsuario = {
    id: number
    nome: string
    count: string
}

export async function getRanking({ dataInicial, dataFinal }: GetRankingParams): Promise<RankingUsuario[]> {
    return client({
        url: '/pedidos/resumo-usuarios',
        method: 'POST',
        data: { dataInicial: paraUTC(dataInicial), dataFinal: paraUTC(dataFinal) }
    })
}

type ConsultOrderParams = {
    codigoPedido: string
}

export async function consultOrder({ codigoPedido }: ConsultOrderParams) {
    return client({
        url: '/pedidos/consulta',
        method: 'POST',
        data: { codigoPedido: normalizarCodigo(codigoPedido) }
    })
}

type EditOrderParams = {
    codigoPedido: string
    usuarioId: number
}

export async function editOrder({ codigoPedido, usuarioId }: EditOrderParams) {
    return client({
        url: `/pedidos/${encodeURIComponent(normalizarCodigo(codigoPedido))}`,
        method: 'PUT',
        data: { id: usuarioId }
    })
}

type PostOrderAsParams = {
    codigo_pedido: string
    cracha: string
}

export async function postOrderAs({ codigo_pedido, cracha }: PostOrderAsParams) {
    return client({
        url: '/pedidos',
        method: 'POST',
        data: { codigo_pedido: normalizarCodigo(codigo_pedido), cracha }
    })
}

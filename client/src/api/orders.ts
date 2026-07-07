import client from './client.ts'

type PostOrderParams = {
    codigo_pedido: string
    token: string
}

export async function postOrder({ codigo_pedido, token }: PostOrderParams) {
    return client({
        url: '/pedidos',
        token,
        method: 'POST',
        data: { codigo_pedido }
    })
}

type GetOrdersParams = {
    dataInicial: string
    dataFinal: string
    token: string
}

export async function getOrders({ dataInicial, dataFinal, token }: GetOrdersParams) {
    return client({
        url: '/pedidos/buscar',
        token,
        method: 'POST',
        data: { dataInicial, dataFinal }
    })
}

type GetRankingParams = {
    dataInicial: string
    dataFinal: string
    token: string
}

export type RankingUsuario = {
    id: number
    nome: string
    count: string
}

export async function getRanking({ dataInicial, dataFinal, token }: GetRankingParams): Promise<RankingUsuario[]> {
    return client({
        url: '/pedidos/resumo-usuarios',
        token,
        method: 'POST',
        data: { dataInicial, dataFinal }
    })
}

type PostOrderAsParams = {
    codigo_pedido: string
    cracha: string
    token: string
}

export async function postOrderAs({ codigo_pedido, cracha, token }: PostOrderAsParams) {
    return client({
        url: '/pedidos',
        token,
        method: 'POST',
        data: { codigo_pedido, cracha }
    })
}

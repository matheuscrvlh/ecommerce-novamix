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

export async function getOrders(token: string) {
    return client({
        url: '/pedidos',
        token,
        method: 'GET'
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

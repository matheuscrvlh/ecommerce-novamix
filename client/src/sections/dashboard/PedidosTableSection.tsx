import Spinner from '../../components/Spinner'

type Pedido = {
    id: number
    codigo_pedido: string
    usuario_id: number | null
    bipado_em: string | null
}

type PedidosTableSectionProps = {
    pedidos: Pedido[]
    carregando: boolean
}

export default function PedidosTableSection({ pedidos, carregando }: PedidosTableSectionProps) {
    return (
        <section className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-400 uppercase'>Pedidos bipados</h2>

            <table className='w-full border-collapse text-left text-sm'>
                <thead>
                    <tr className='border-b border-gray-100 text-gray-400'>
                        <th className='py-2 font-medium'>Código do pedido</th>
                        <th className='py-2 font-medium'>Usuário</th>
                        <th className='py-2 font-medium'>Bipado em</th>
                    </tr>
                </thead>
                <tbody>
                    {carregando && (
                        <tr>
                            <td colSpan={3} className='py-8 text-center'>
                                <Spinner className='mx-auto h-6 w-6' />
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        pedidos.map((pedido) => (
                            <tr key={pedido.id} className='border-b border-gray-50 transition hover:bg-gray-50'>
                                <td className='py-2'>{pedido.codigo_pedido}</td>
                                <td className='py-2'>{pedido.usuario_id ?? '—'}</td>
                                <td className='py-2'>
                                    {pedido.bipado_em ? new Date(pedido.bipado_em).toLocaleString('pt-BR') : '—'}
                                </td>
                            </tr>
                        ))}

                    {!carregando && pedidos.length === 0 && (
                        <tr>
                            <td colSpan={3} className='py-6 text-center text-gray-400'>Nenhum pedido bipado ainda.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    )
}

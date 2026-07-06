import { useState } from 'react'
import Spinner from '../../components/Spinner'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from '../../components/icons'
import type { Usuario } from '../../api/users'

const ITENS_POR_PAGINA = 100

type Pedido = {
    id: number
    codigo_pedido: string
    usuario_id: number | null
    bipado_em: string | null
}

type PedidosTableSectionProps = {
    pedidos: Pedido[]
    usuarios: Usuario[]
    carregando: boolean
}

export default function PedidosTableSection({ pedidos, usuarios, carregando }: PedidosTableSectionProps) {
    const [pagina, setPagina] = useState(0)

    const totalPaginas = Math.max(1, Math.ceil(pedidos.length / ITENS_POR_PAGINA))
    const paginaAtual = Math.min(pagina, totalPaginas - 1)
    const inicio = paginaAtual * ITENS_POR_PAGINA
    const pedidosPagina = pedidos.slice(inicio, inicio + ITENS_POR_PAGINA)

    function usuarioLabel(usuario_id: number | null) {
        if (usuario_id === null) return '—'

        const usuario = usuarios.find((u) => u.id === usuario_id)
        return usuario ? `${usuario_id} - ${usuario.nome}` : `${usuario_id}`
    }

    return (
        <section className='rounded-lg bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-xs font-semibold tracking-wide text-gray-dark uppercase'>Pedidos bipados</h2>
                {!carregando && pedidos.length > 0 && (
                    <span className='text-xs text-gray-dark'>
                        {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, pedidos.length)} de {pedidos.length}
                    </span>
                )}
            </div>

            <table className='w-full border-collapse text-left text-sm'>
                <thead>
                    <tr className='border-b border-gray text-gray-dark'>
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
                        pedidosPagina.map((pedido) => (
                            <tr key={pedido.id} className='border-b border-gray transition hover:bg-gray'>
                                <td className='py-2'>{pedido.codigo_pedido}</td>
                                <td className='py-2'>{usuarioLabel(pedido.usuario_id)}</td>
                                <td className='py-2'>
                                    {pedido.bipado_em ? new Date(pedido.bipado_em).toLocaleString('pt-BR') : '—'}
                                </td>
                            </tr>
                        ))}

                    {!carregando && pedidos.length === 0 && (
                        <tr>
                            <td colSpan={3} className='py-6 text-center text-gray-dark'>Nenhum pedido bipado ainda.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {!carregando && pedidos.length > ITENS_POR_PAGINA && (
                <div className='mt-4 flex items-center justify-center gap-2'>
                    <button
                        onClick={() => setPagina(0)}
                        disabled={paginaAtual === 0}
                        title='Primeira página'
                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-dark'
                    >
                        <ChevronsLeftIcon />
                    </button>
                    <button
                        onClick={() => setPagina((p) => Math.max(0, p - 1))}
                        disabled={paginaAtual === 0}
                        title='Página anterior'
                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-dark'
                    >
                        <ChevronLeftIcon />
                    </button>
                    <span className='mx-2 text-sm text-gray-dark'>Página {paginaAtual + 1} de {totalPaginas}</span>
                    <button
                        onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
                        disabled={paginaAtual >= totalPaginas - 1}
                        title='Próxima página'
                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-dark'
                    >
                        <ChevronRightIcon />
                    </button>
                    <button
                        onClick={() => setPagina(totalPaginas - 1)}
                        disabled={paginaAtual >= totalPaginas - 1}
                        title='Última página'
                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-dark'
                    >
                        <ChevronsRightIcon />
                    </button>
                </div>
            )}
        </section>
    )
}

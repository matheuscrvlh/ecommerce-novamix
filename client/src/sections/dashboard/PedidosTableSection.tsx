import { useState } from 'react'
import Spinner from '../../components/Spinner'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    CalendarIcon,
    ClockIcon,
    SearchIcon
} from '../../components/icons'
import type { Usuario } from '../../api/users'

const ITENS_POR_PAGINA = 100
const TAMANHO_MAXIMO_CODIGO = 16

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
    const [busca, setBusca] = useState('')

    function usuarioLabel(usuario_id: number | null) {
        if (usuario_id === null) return '—'

        const usuario = usuarios.find((u) => u.id === usuario_id)
        return usuario ? `${usuario_id} - ${usuario.nome}` : `${usuario_id}`
    }

    const termo = busca.trim().toLowerCase()
    const pedidosFiltrados = termo
        ? pedidos.filter(
              (pedido) =>
                  pedido.codigo_pedido.toLowerCase().includes(termo) ||
                  usuarioLabel(pedido.usuario_id).toLowerCase().includes(termo)
          )
        : pedidos

    const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / ITENS_POR_PAGINA))
    const paginaAtual = Math.min(pagina, totalPaginas - 1)
    const inicio = paginaAtual * ITENS_POR_PAGINA
    const pedidosPagina = pedidosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

    function handleBuscaChange(valor: string) {
        setBusca(valor)
        setPagina(0)
    }

    function truncarCodigo(codigo: string) {
        return codigo.length > TAMANHO_MAXIMO_CODIGO
            ? `${codigo.slice(0, TAMANHO_MAXIMO_CODIGO)}…`
            : codigo
    }

    return (
        <section className='rounded-lg bg-white p-6 shadow-sm'>
            <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                <h2 className='text-xs font-semibold tracking-wide text-gray-dark uppercase'>Pedidos bipados</h2>
                {!carregando && pedidosFiltrados.length > 0 && (
                    <span className='text-xs text-gray-dark'>
                        {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, pedidosFiltrados.length)} de {pedidosFiltrados.length}
                    </span>
                )}
            </div>

            <div className='relative mb-4'>
                <SearchIcon className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-dark' />
                <Input
                    placeholder='Buscar por código do pedido ou usuário'
                    value={busca}
                    onChange={(e) => handleBuscaChange(e.target.value)}
                    className='pl-9'
                />
            </div>

            <div className='space-y-3 sm:hidden'>
                {carregando && (
                    <div className='py-8 text-center'>
                        <Spinner className='mx-auto h-6 w-6' />
                    </div>
                )}

                {!carregando &&
                    pedidosPagina.map((pedido) => (
                        <div
                            key={pedido.id}
                            className='rounded-lg border border-gray p-4 transition hover:border-orange-base/40 hover:shadow-sm'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <p className='truncate font-semibold text-gray-text'>{usuarioLabel(pedido.usuario_id)}</p>
                                <Badge color='green'>Bipado</Badge>
                            </div>

                            <p className='mt-2 truncate text-[11px] text-gray-dark'>
                                <span className='font-medium text-gray-text'>Cod. produto: </span>
                                {truncarCodigo(pedido.codigo_pedido)}
                            </p>

                            <div className='mt-2 flex items-center gap-1.5 text-[11px] text-gray-dark'>
                                <CalendarIcon className='h-3.5 w-3.5 shrink-0 text-orange-base' />
                                {pedido.bipado_em ? new Date(pedido.bipado_em).toLocaleDateString('pt-BR') : '—'}
                            </div>

                            {pedido.bipado_em && (
                                <div className='mt-1 flex items-center gap-1.5 text-[11px] text-gray-dark'>
                                    <ClockIcon className='h-3.5 w-3.5 shrink-0 text-orange-base' />
                                    {new Date(pedido.bipado_em).toLocaleTimeString('pt-BR')}
                                </div>
                            )}
                        </div>
                    ))}

                {!carregando && pedidosFiltrados.length === 0 && (
                    <p className='py-6 text-center text-sm text-gray-dark'>
                        {termo ? 'Nenhum pedido encontrado para essa busca.' : 'Nenhum pedido bipado ainda.'}
                    </p>
                )}
            </div>

            <div className='hidden overflow-hidden rounded-lg border border-gray sm:block'>
                <div className='overflow-x-auto'>
                    <table className='w-full min-w-140 border-collapse text-left text-sm'>
                        <thead>
                            <tr className='border-b border-gray bg-gray text-xs font-semibold tracking-wide text-gray-dark uppercase'>
                                <th className='px-4 py-3'>Usuário</th>
                                <th className='px-4 py-3'>Código do pedido</th>
                                <th className='px-4 py-3'>
                                    <span className='flex items-center gap-1.5'>
                                        <CalendarIcon className='h-3.5 w-3.5' />
                                        Bipado em
                                    </span>
                                </th>
                                <th className='px-4 py-3'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carregando && (
                                <tr>
                                    <td colSpan={4} className='py-8 text-center'>
                                        <Spinner className='mx-auto h-6 w-6' />
                                    </td>
                                </tr>
                            )}

                            {!carregando &&
                                pedidosPagina.map((pedido) => (
                                    <tr key={pedido.id} className='border-b border-gray transition last:border-0 hover:bg-gray'>
                                        <td className='px-4 py-3 font-medium whitespace-nowrap text-gray-text'>
                                            {usuarioLabel(pedido.usuario_id)}
                                        </td>
                                        <td className='px-4 py-3 whitespace-nowrap'>{pedido.codigo_pedido}</td>
                                        <td className='px-4 py-3 whitespace-nowrap text-gray-dark'>
                                            {pedido.bipado_em ? (
                                                <div className='flex items-center gap-3'>
                                                    <span className='flex items-center gap-1.5'>
                                                        <CalendarIcon className='h-3.5 w-3.5 text-orange-base' />
                                                        {new Date(pedido.bipado_em).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span className='flex items-center gap-1.5'>
                                                        <ClockIcon className='h-3.5 w-3.5 text-orange-base' />
                                                        {new Date(pedido.bipado_em).toLocaleTimeString('pt-BR')}
                                                    </span>
                                                </div>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className='px-4 py-3 whitespace-nowrap'>
                                            <Badge color='green'>Bipado</Badge>
                                        </td>
                                    </tr>
                                ))}

                            {!carregando && pedidosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={4} className='py-6 text-center text-gray-dark'>
                                        {termo ? 'Nenhum pedido encontrado para essa busca.' : 'Nenhum pedido bipado ainda.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!carregando && pedidosFiltrados.length > ITENS_POR_PAGINA && (
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

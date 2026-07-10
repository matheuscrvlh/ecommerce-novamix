import { useState } from 'react'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import Skeleton from '../../components/Skeleton'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    CalendarIcon,
    ClockIcon,
    SearchIcon,
    EditIcon
} from '../../components/icons'
import type { UsuarioResumo } from '../../api/users'

const ITENS_POR_PAGINA = 30
const TAMANHO_MAXIMO_CODIGO = 16

type Pedido = {
    id: number
    codigo_pedido: string
    usuario_id: number | null
    bipado_em: string | null
}

type PedidosTableSectionProps = {
    pedidos: Pedido[]
    usuarios: UsuarioResumo[]
    carregando: boolean
    onEditarOperador: (pedido: Pedido) => void
}

export default function PedidosTableSection({ pedidos, usuarios, carregando, onEditarOperador }: PedidosTableSectionProps) {
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

    const mostrarSkeleton = carregando && pedidos.length === 0
    const linhasSkeleton = [0, 1, 2, 3, 4, 5]

    return (
        <section className='rounded-lg bg-white p-6 shadow-sm dark:bg-dark-surface'>
            <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                <h2 className='text-xs font-semibold tracking-wide text-gray-dark uppercase dark:text-dark-text-muted'>Pedidos bipados</h2>
                {!mostrarSkeleton && pedidosFiltrados.length > 0 && (
                    <span className='text-xs text-gray-dark dark:text-dark-text-muted'>
                        {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, pedidosFiltrados.length)} de {pedidosFiltrados.length}
                    </span>
                )}
            </div>

            <div className='relative mb-4'>
                <SearchIcon className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-dark dark:text-dark-text-muted' />
                <Input
                    placeholder='Buscar por código do pedido ou usuário'
                    value={busca}
                    onChange={(e) => handleBuscaChange(e.target.value)}
                    className='pl-9'
                />
            </div>

            <div className='space-y-3 sm:hidden'>
                {mostrarSkeleton &&
                    linhasSkeleton.map((linha) => (
                        <div key={linha} className='rounded-lg border border-gray p-4 dark:border-dark-border'>
                            <div className='flex items-start justify-between gap-3'>
                                <Skeleton className='h-4 w-32' />
                                <Skeleton className='h-5 w-14 rounded-full' />
                            </div>
                            <Skeleton className='mt-2 h-3 w-40' />
                            <Skeleton className='mt-2 h-3 w-24' />
                        </div>
                    ))}

                {!mostrarSkeleton &&
                    pedidosPagina.map((pedido) => (
                        <div
                            key={pedido.id}
                            className='rounded-lg border border-gray p-4 transition hover:border-orange-base/40 hover:shadow-sm dark:border-dark-border'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <p className='truncate font-semibold text-gray-text dark:text-dark-text'>{usuarioLabel(pedido.usuario_id)}</p>
                                <div className='flex shrink-0 items-center gap-2'>
                                    <Badge color='green'>Bipado</Badge>
                                    <button
                                        onClick={() => onEditarOperador(pedido)}
                                        className='rounded-md p-1 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                        title='Alterar operador'
                                    >
                                        <EditIcon />
                                    </button>
                                </div>
                            </div>

                            <p className='mt-2 truncate text-[11px] text-gray-dark dark:text-dark-text-muted'>
                                <span className='font-medium text-gray-text dark:text-dark-text'>Cod. produto: </span>
                                {truncarCodigo(pedido.codigo_pedido)}
                            </p>

                            <div className='mt-2 flex items-center gap-1.5 text-[11px] text-gray-dark dark:text-dark-text-muted'>
                                <CalendarIcon className='h-3.5 w-3.5 shrink-0 text-orange-base' />
                                {pedido.bipado_em ? new Date(pedido.bipado_em).toLocaleDateString('pt-BR') : '—'}
                            </div>

                            {pedido.bipado_em && (
                                <div className='mt-1 flex items-center gap-1.5 text-[11px] text-gray-dark dark:text-dark-text-muted'>
                                    <ClockIcon className='h-3.5 w-3.5 shrink-0 text-orange-base' />
                                    {new Date(pedido.bipado_em).toLocaleTimeString('pt-BR')}
                                </div>
                            )}
                        </div>
                    ))}

                {!mostrarSkeleton && pedidosFiltrados.length === 0 && (
                    <p className='py-6 text-center text-sm text-gray-dark dark:text-dark-text-muted'>
                        {termo ? 'Nenhum pedido encontrado para essa busca.' : 'Nenhum pedido bipado ainda.'}
                    </p>
                )}
            </div>

            <div className='hidden overflow-hidden rounded-lg border border-gray sm:block dark:border-dark-border'>
                <div className='overflow-x-auto'>
                    <table className='w-full min-w-140 border-collapse text-left text-sm'>
                        <thead>
                            <tr className='border-b border-gray bg-gray text-xs font-semibold tracking-wide text-gray-dark uppercase dark:border-dark-border dark:bg-dark-surface-2 dark:text-dark-text-muted'>
                                <th className='px-4 py-3'>Usuário</th>
                                <th className='px-4 py-3'>Código do pedido</th>
                                <th className='px-4 py-3'>
                                    <span className='flex items-center gap-1.5'>
                                        <CalendarIcon className='h-3.5 w-3.5' />
                                        Bipado em
                                    </span>
                                </th>
                                <th className='px-4 py-3'>Status</th>
                                <th className='px-4 py-3' />
                            </tr>
                        </thead>
                        <tbody>
                            {mostrarSkeleton &&
                                linhasSkeleton.map((linha) => (
                                    <tr key={linha} className='border-b border-gray last:border-0 dark:border-dark-border'>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-3.5 w-28' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-3.5 w-24' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-3.5 w-36' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-5 w-16 rounded-full' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-6 w-6' />
                                        </td>
                                    </tr>
                                ))}

                            {!mostrarSkeleton &&
                                pedidosPagina.map((pedido) => (
                                    <tr key={pedido.id} className='border-b border-gray transition last:border-0 hover:bg-gray dark:border-dark-border dark:hover:bg-dark-surface-2'>
                                        <td className='px-4 py-3 font-medium whitespace-nowrap text-gray-text dark:text-dark-text'>
                                            {usuarioLabel(pedido.usuario_id)}
                                        </td>
                                        <td className='px-4 py-3 whitespace-nowrap dark:text-dark-text'>{pedido.codigo_pedido}</td>
                                        <td className='px-4 py-3 whitespace-nowrap text-gray-dark dark:text-dark-text-muted'>
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
                                        <td className='px-4 py-3 whitespace-nowrap'>
                                            <button
                                                onClick={() => onEditarOperador(pedido)}
                                                className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                                title='Alterar operador'
                                            >
                                                <EditIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            {!mostrarSkeleton && pedidosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={5} className='py-6 text-center text-gray-dark dark:text-dark-text-muted'>
                                        {termo ? 'Nenhum pedido encontrado para essa busca.' : 'Nenhum pedido bipado ainda.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!mostrarSkeleton && pedidosFiltrados.length > ITENS_POR_PAGINA && (
                <div className='mt-4 flex items-center justify-center gap-2'>
                    <button
                        onClick={() => setPagina(0)}
                        disabled={paginaAtual === 0}
                        title='Primeira página'
                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-dark dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                    >
                        <ChevronsLeftIcon />
                    </button>
                    <button
                        onClick={() => setPagina((p) => Math.max(0, p - 1))}
                        disabled={paginaAtual === 0}
                        title='Página anterior'
                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-dark dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                    >
                        <ChevronLeftIcon />
                    </button>
                    <span className='mx-2 text-sm text-gray-dark dark:text-dark-text-muted'>Página {paginaAtual + 1} de {totalPaginas}</span>
                    <button
                        onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
                        disabled={paginaAtual >= totalPaginas - 1}
                        title='Próxima página'
                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-dark dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                    >
                        <ChevronRightIcon />
                    </button>
                    <button
                        onClick={() => setPagina(totalPaginas - 1)}
                        disabled={paginaAtual >= totalPaginas - 1}
                        title='Última página'
                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-dark dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                    >
                        <ChevronsRightIcon />
                    </button>
                </div>
            )}
        </section>
    )
}

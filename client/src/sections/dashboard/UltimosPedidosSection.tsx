import Badge from '../../components/Badge'
import Skeleton from '../../components/Skeleton'
import { CalendarIcon, ClockIcon } from '../../components/icons'
import type { UsuarioResumo } from '../../api/users'

const QUANTIDADE_LOG = 10

type Pedido = {
    id: number
    codigo_pedido: string
    usuario_id: number | null
    bipado_em: string | null
}

type UltimosPedidosSectionProps = {
    pedidos: Pedido[]
    usuarios: UsuarioResumo[]
    carregando: boolean
}

export default function UltimosPedidosSection({ pedidos, usuarios, carregando }: UltimosPedidosSectionProps) {
    function usuarioLabel(usuario_id: number | null) {
        if (usuario_id === null) return '—'

        const usuario = usuarios.find((u) => u.id === usuario_id)
        return usuario ? usuario.nome : `${usuario_id}`
    }

    const ultimos = pedidos.slice(0, QUANTIDADE_LOG)
    const mostrarSkeleton = carregando && pedidos.length === 0
    const linhasSkeleton = [0, 1, 2]

    return (
        <section className='rounded-lg bg-white p-6 shadow-sm dark:bg-dark-surface'>
            <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-dark uppercase dark:text-dark-text-muted'>
                Últimos pedidos bipados
            </h2>

            <div className='space-y-2'>
                {mostrarSkeleton &&
                    linhasSkeleton.map((linha) => (
                        <div
                            key={linha}
                            className='flex items-center justify-between gap-3 rounded-md border border-gray px-3 py-2 dark:border-dark-border'
                        >
                            <Skeleton className='h-4 w-32' />
                            <Skeleton className='h-4 w-24' />
                        </div>
                    ))}

                {!mostrarSkeleton &&
                    ultimos.map((pedido) => (
                        <div
                            key={pedido.id}
                            className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray px-3 py-2 text-sm transition hover:border-orange-base/40 dark:border-dark-border'
                        >
                            <span className='font-medium text-gray-text dark:text-dark-text'>
                                {pedido.usuario_id !== null && (
                                    <span className='font-normal text-gray-dark dark:text-dark-text-muted'>#{pedido.usuario_id}</span>
                                )}{' '}
                                {usuarioLabel(pedido.usuario_id)}
                            </span>
                            <span className='text-gray-dark dark:text-dark-text-muted'>{pedido.codigo_pedido}</span>

                            {pedido.bipado_em && (
                                <span className='flex items-center gap-3 text-xs text-gray-dark dark:text-dark-text-muted'>
                                    <span className='flex items-center gap-1.5'>
                                        <CalendarIcon className='h-3.5 w-3.5 text-orange-base' />
                                        {new Date(pedido.bipado_em).toLocaleDateString('pt-BR')}
                                    </span>
                                    <span className='flex items-center gap-1.5'>
                                        <ClockIcon className='h-3.5 w-3.5 text-orange-base' />
                                        {new Date(pedido.bipado_em).toLocaleTimeString('pt-BR')}
                                    </span>
                                </span>
                            )}

                            <Badge color='green'>Bipado</Badge>
                        </div>
                    ))}

                {!mostrarSkeleton && ultimos.length === 0 && (
                    <p className='py-6 text-center text-sm text-gray-dark dark:text-dark-text-muted'>
                        Nenhum pedido bipado ainda.
                    </p>
                )}
            </div>
        </section>
    )
}

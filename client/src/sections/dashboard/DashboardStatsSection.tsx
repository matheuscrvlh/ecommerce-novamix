import StatCard from '../../components/StatCard'
import { PackageIcon, CheckCircleIcon, UsersIcon } from '../../components/icons'

type Pedido = {
    id: number
    usuario_id: number | null
    bipado_em: string | null
}

type DashboardStatsSectionProps = {
    pedidos: Pedido[]
}

function isHoje(data: string | null) {
    if (!data) return false
    return new Date(data).toDateString() === new Date().toDateString()
}

export default function DashboardStatsSection({ pedidos }: DashboardStatsSectionProps) {
    const bipadosHoje = pedidos.filter((pedido) => isHoje(pedido.bipado_em))
    const operadoresAtivosHoje = new Set(bipadosHoje.map((pedido) => pedido.usuario_id)).size

    return (
        <section className='mb-8'>
            <h2 className='mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase'>Pedidos</h2>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <StatCard
                    label='Total bipados'
                    value={pedidos.length}
                    color='orange'
                    icon={<PackageIcon className='h-5 w-5' />}
                />
                <StatCard
                    label='Bipados hoje'
                    value={bipadosHoje.length}
                    color='green'
                    icon={<CheckCircleIcon className='h-5 w-5' />}
                />
                <StatCard
                    label='Operadores ativos hoje'
                    value={operadoresAtivosHoje}
                    color='teal'
                    icon={<UsersIcon className='h-5 w-5' />}
                />
            </div>
        </section>
    )
}

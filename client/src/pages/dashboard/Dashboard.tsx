import { useEffect, useState } from 'react'
import { getOrders } from '../../api/orders'
import { getUsuarios, type Usuario } from '../../api/users'
import { useAuth } from '../../hooks/useAuth'
import SidebarSection from '../../sections/SidebarSection'
import PageHeaderSection from '../../sections/PageHeaderSection'
import DashboardStatsSection from '../../sections/dashboard/DashboardStatsSection'
import PedidosTableSection from '../../sections/dashboard/PedidosTableSection'
import Alert from '../../components/Alert'
import Footer from '../../components/Footer'

type Pedido = {
    id: number
    codigo_pedido: string
    usuario_id: number | null
    bipado_em: string | null
}

export default function Dashboard() {
    const { token } = useAuth()
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        Promise.all([getOrders(token!), getUsuarios(token!)])
            .then(([pedidosResult, usuariosResult]) => {
                setPedidos(pedidosResult)
                setUsuarios(usuariosResult)
                setCarregando(false)
            })
            .catch((error) => {
                setErro(error instanceof Error ? error.message : 'Erro ao buscar pedidos.')
                setCarregando(false)
            })
    }, [token])

    return (
        <div className='flex min-h-screen flex-col bg-gray md:flex-row'>
            <SidebarSection />

            <main className='flex-1 p-4 sm:p-8'>
                <PageHeaderSection title='Dashboard' />

                {erro && (
                    <div className='mb-4'>
                        <Alert>{erro}</Alert>
                    </div>
                )}

                <DashboardStatsSection pedidos={pedidos} />
                <PedidosTableSection pedidos={pedidos} usuarios={usuarios} carregando={carregando} />

                <Footer />
            </main>
        </div>
    )
}

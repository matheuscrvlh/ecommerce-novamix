import { useEffect, useState, type SubmitEvent } from 'react'
import { getOrders } from '../../api/orders'
import { getUsuarios, type Usuario } from '../../api/users'
import { useAuth } from '../../hooks/useAuth'
import SidebarSection from '../../sections/SidebarSection'
import PageHeaderSection from '../../sections/PageHeaderSection'
import DateFilterSection from '../../sections/dashboard/DateFilterSection'
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

function hojeISO() {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

export default function Dashboard() {
    const { token } = useAuth()
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    const [dataInicialInput, setDataInicialInput] = useState(hojeISO())
    const [dataFinalInput, setDataFinalInput] = useState(hojeISO())
    const [filtro, setFiltro] = useState({ dataInicial: hojeISO(), dataFinal: hojeISO() })

    useEffect(() => {
        setCarregando(true)
        setErro('')

        Promise.all([
            getOrders({
                dataInicial: `${filtro.dataInicial}T00:00:00`,
                dataFinal: `${filtro.dataFinal}T23:59:59.999`,
                token: token!
            }),
            getUsuarios(token!)
        ])
            .then(([pedidosResult, usuariosResult]) => {
                setPedidos(pedidosResult)
                setUsuarios(usuariosResult)
                setCarregando(false)
            })
            .catch((error) => {
                setErro(error instanceof Error ? error.message : 'Erro ao buscar pedidos.')
                setCarregando(false)
            })
    }, [token, filtro])

    function handleFiltrar(event: SubmitEvent) {
        event.preventDefault()
        setFiltro({ dataInicial: dataInicialInput, dataFinal: dataFinalInput })
    }

    return (
        <div className='flex min-h-screen flex-col bg-gray md:flex-row'>
            <SidebarSection />

            <main className='flex-1 p-4 sm:p-8'>
                <PageHeaderSection title='Dashboard' />

                <DateFilterSection
                    dataInicial={dataInicialInput}
                    dataFinal={dataFinalInput}
                    onDataInicialChange={setDataInicialInput}
                    onDataFinalChange={setDataFinalInput}
                    onSubmit={handleFiltrar}
                />

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

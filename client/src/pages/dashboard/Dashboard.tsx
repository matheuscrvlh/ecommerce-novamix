import { useEffect, useState, type SubmitEvent } from 'react'
import { getOrders } from '../../api/orders'
import { getUsuarios, type Usuario } from '../../api/users'
import { useAuth } from '../../hooks/useAuth'
import SidebarSection from '../../sections/SidebarSection'
import PageHeaderSection from '../../sections/PageHeaderSection'
import DateFilterSection from '../../sections/dashboard/DateFilterSection'
import DashboardStatsSection from '../../sections/dashboard/DashboardStatsSection'
import PodiumSection from '../../sections/dashboard/PodiumSection'
import ProducaoPorHoraSection from '../../sections/dashboard/ProducaoPorHoraSection'
import PedidosTableSection from '../../sections/dashboard/PedidosTableSection'
import RankingModal from '../../sections/RankingModal'
import Alert from '../../components/Alert'
import Button from '../../components/Button'
import Footer from '../../components/Footer'
import { TrophyIcon } from '../../components/icons'

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
    const [rankingAberto, setRankingAberto] = useState(false)

    useEffect(() => {
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
        setCarregando(true)
        setErro('')
        setFiltro({ dataInicial: dataInicialInput, dataFinal: dataFinalInput })
    }

    return (
        <div className='flex min-h-screen flex-col bg-gray md:flex-row'>
            <SidebarSection />

            <main className='flex-1 p-4 sm:p-8'>
                <PageHeaderSection title='Dashboard' />

                <div className='mb-4 flex justify-end'>
                    <Button
                        variant='ghost'
                        className='flex items-center gap-2 text-orange-base'
                        onClick={() => setRankingAberto(true)}
                    >
                        <TrophyIcon className='h-4 w-4 origin-center animate-trophy-wiggle' />
                        Ranking
                    </Button>
                </div>

                <PodiumSection pedidos={pedidos} usuarios={usuarios} />

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
                <ProducaoPorHoraSection pedidos={pedidos} />
                <PedidosTableSection pedidos={pedidos} usuarios={usuarios} carregando={carregando} />

                <Footer />
            </main>

            <RankingModal open={rankingAberto} onClose={() => setRankingAberto(false)} />
        </div>
    )
}

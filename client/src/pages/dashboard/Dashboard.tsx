import { useEffect, useRef, useState, type SubmitEvent } from 'react'
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
import Toast from '../../components/Toast'
import { TrophyIcon } from '../../components/icons'
import { tocarSomNotificacao } from '../../lib/notificationSound'

type Pedido = {
    id: number
    codigo_pedido: string
    usuario_id: number | null
    bipado_em: string | null
}

const INTERVALO_ATUALIZACAO_MS = 15000

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
    const [notificacao, setNotificacao] = useState<string | null>(null)

    const idsConhecidosRef = useRef<Set<number> | null>(null)

    useEffect(() => {
        if (!notificacao) return
        const timeout = setTimeout(() => setNotificacao(null), 4000)
        return () => clearTimeout(timeout)
    }, [notificacao])

    useEffect(() => {
        idsConhecidosRef.current = null
    }, [filtro])

    useEffect(() => {
        let cancelado = false

        function buscar() {
            if (document.hidden) return

            Promise.all([
                getOrders({
                    dataInicial: `${filtro.dataInicial}T00:00:00`,
                    dataFinal: `${filtro.dataFinal}T23:59:59.999`,
                    token: token!
                }),
                getUsuarios(token!)
            ])
                .then(([pedidosResult, usuariosResult]) => {
                    if (cancelado) return

                    if (idsConhecidosRef.current) {
                        const novos = pedidosResult.filter(
                            (pedido: Pedido) => !idsConhecidosRef.current!.has(pedido.id)
                        )

                        if (novos.length > 0) {
                            tocarSomNotificacao()
                            setNotificacao(
                                novos.length === 1
                                    ? `Novo pedido bipado: ${novos[0].codigo_pedido}`
                                    : `${novos.length} novos pedidos bipados`
                            )
                        }
                    }

                    idsConhecidosRef.current = new Set(pedidosResult.map((pedido: Pedido) => pedido.id))

                    setPedidos(pedidosResult)
                    setUsuarios(usuariosResult)
                    setCarregando(false)
                })
                .catch((error) => {
                    if (cancelado) return
                    setErro(error instanceof Error ? error.message : 'Erro ao buscar pedidos.')
                    setCarregando(false)
                })
        }

        buscar()
        const intervalo = setInterval(buscar, INTERVALO_ATUALIZACAO_MS)

        function handleVisibilidade() {
            if (!document.hidden) buscar()
        }

        document.addEventListener('visibilitychange', handleVisibilidade)

        return () => {
            cancelado = true
            clearInterval(intervalo)
            document.removeEventListener('visibilitychange', handleVisibilidade)
        }
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

                <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-start'>
                    <DateFilterSection
                        className='sm:flex-1'
                        dataInicial={dataInicialInput}
                        dataFinal={dataFinalInput}
                        onDataInicialChange={setDataInicialInput}
                        onDataFinalChange={setDataFinalInput}
                        onSubmit={handleFiltrar}
                    />

                    <Button
                        variant='ghost'
                        className='flex items-center justify-center gap-2 self-start bg-white text-orange-base shadow-sm sm:h-17.5'
                        onClick={() => setRankingAberto(true)}
                    >
                        <TrophyIcon className='h-4 w-4 origin-center animate-trophy-wiggle' />
                        Ranking
                    </Button>
                </div>

                {erro && (
                    <div className='mb-4'>
                        <Alert>{erro}</Alert>
                    </div>
                )}

                <DashboardStatsSection pedidos={pedidos} carregando={carregando} />
                <ProducaoPorHoraSection pedidos={pedidos} carregando={carregando} />
                <PodiumSection pedidos={pedidos} usuarios={usuarios} carregando={carregando} />
                <PedidosTableSection pedidos={pedidos} usuarios={usuarios} carregando={carregando} />

                <Footer />
            </main>

            <RankingModal open={rankingAberto} onClose={() => setRankingAberto(false)} />
            <Toast mensagem={notificacao} />
        </div>
    )
}

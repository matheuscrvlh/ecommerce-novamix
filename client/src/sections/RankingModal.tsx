import { useEffect, useState, type SubmitEvent } from 'react'
import { getRanking, type RankingUsuario } from '../api/orders'
import { useAuth } from '../hooks/useAuth'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'
import DateFilterSection from './dashboard/DateFilterSection'

const INICIO_PADRAO = '2000-01-01'

function hojeISO() {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

type RankingModalProps = {
    open: boolean
    onClose: () => void
}

export default function RankingModal({ open, onClose }: RankingModalProps) {
    const { token } = useAuth()
    const [ranking, setRanking] = useState<RankingUsuario[]>([])
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    const [dataInicialInput, setDataInicialInput] = useState(INICIO_PADRAO)
    const [dataFinalInput, setDataFinalInput] = useState(hojeISO())
    const [filtro, setFiltro] = useState({ dataInicial: INICIO_PADRAO, dataFinal: hojeISO() })

    useEffect(() => {
        if (!open) return

        setCarregando(true)
        setErro('')

        getRanking({
            dataInicial: `${filtro.dataInicial}T00:00:00`,
            dataFinal: `${filtro.dataFinal}T23:59:59.999`,
            token: token!
        })
            .then((result) => {
                const ordenado = [...result].sort((a, b) => Number(b.count) - Number(a.count))
                setRanking(ordenado)
                setCarregando(false)
            })
            .catch((error) => {
                setErro(error instanceof Error ? error.message : 'Erro ao buscar ranking.')
                setCarregando(false)
            })
    }, [open, token, filtro])

    function handleFiltrar(event: SubmitEvent) {
        event.preventDefault()
        setFiltro({ dataInicial: dataInicialInput, dataFinal: dataFinalInput })
    }

    return (
        <Modal open={open} onClose={onClose} title='Ranking de pedidos bipados'>
            <DateFilterSection
                dataInicial={dataInicialInput}
                dataFinal={dataFinalInput}
                onDataInicialChange={setDataInicialInput}
                onDataFinalChange={setDataFinalInput}
                onSubmit={handleFiltrar}
            />

            {erro && (
                <div className='mt-4'>
                    <Alert>{erro}</Alert>
                </div>
            )}

            <div className='mt-4 max-h-80 space-y-1 overflow-y-auto'>
                {carregando && <Spinner className='mx-auto h-6 w-6' />}

                {!carregando && ranking.length === 0 && (
                    <p className='text-center text-sm text-gray-dark'>Nenhum pedido bipado no período.</p>
                )}

                {!carregando &&
                    ranking.map((usuario, index) => (
                        <div
                            key={usuario.id}
                            className='flex items-center justify-between border-b border-gray px-2 py-3 last:border-0'
                        >
                            <div className='flex items-center gap-3'>
                                <span className='w-6 text-center text-sm font-semibold text-gray-dark'>{index + 1}º</span>
                                <span className='text-sm text-gray-text'>{usuario.nome}</span>
                            </div>
                            <span className='text-sm font-semibold text-orange-base'>{usuario.count}</span>
                        </div>
                    ))}
            </div>
        </Modal>
    )
}

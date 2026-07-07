import { useEffect, useState, type SubmitEvent } from 'react'
import { getRanking, type RankingUsuario } from '../api/orders'
import { useAuth } from '../hooks/useAuth'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import Input from '../components/Input'
import Skeleton from '../components/Skeleton'
import { SearchIcon } from '../components/icons'
import DateFilterSection from './dashboard/DateFilterSection'

function hojeISO() {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

const CORES_POSICAO = [
    'bg-gold text-white',
    'bg-silver text-white',
    'bg-bronze text-white'
]

const LINHAS_SKELETON = [0, 1, 2, 3, 4]

type RankingModalProps = {
    open: boolean
    onClose: () => void
}

export default function RankingModal({ open, onClose }: RankingModalProps) {
    const { token } = useAuth()
    const [ranking, setRanking] = useState<RankingUsuario[]>([])
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [busca, setBusca] = useState('')

    const [dataInicialInput, setDataInicialInput] = useState(hojeISO())
    const [dataFinalInput, setDataFinalInput] = useState(hojeISO())
    const [filtro, setFiltro] = useState({ dataInicial: hojeISO(), dataFinal: hojeISO() })

    useEffect(() => {
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
    }, [token, filtro])

    function handleFiltrar(event: SubmitEvent) {
        event.preventDefault()
        setCarregando(true)
        setErro('')
        setFiltro({ dataInicial: dataInicialInput, dataFinal: dataFinalInput })
    }

    const termo = busca.trim().toLowerCase()
    const rankingFiltrado = termo
        ? ranking.filter((usuario) => usuario.nome.toLowerCase().includes(termo))
        : ranking

    const maiorContagem = Math.max(1, ...ranking.map((usuario) => Number(usuario.count)))

    return (
        <Modal open={open} onClose={onClose} title='Ranking de pedidos bipados'>
            <DateFilterSection
                dataInicial={dataInicialInput}
                dataFinal={dataFinalInput}
                onDataInicialChange={setDataInicialInput}
                onDataFinalChange={setDataFinalInput}
                onSubmit={handleFiltrar}
            />

            <div className='relative mt-3'>
                <SearchIcon className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-dark' />
                <Input
                    placeholder='Buscar operador'
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className='pl-9'
                />
            </div>

            {erro && (
                <div className='mt-4'>
                    <Alert>{erro}</Alert>
                </div>
            )}

            {!carregando && !erro && ranking.length > 0 && (
                <p className='mt-3 text-xs text-gray-dark'>
                    {rankingFiltrado.length} de {ranking.length} operador{ranking.length === 1 ? '' : 'es'} no período
                </p>
            )}

            <div className='mt-2 max-h-80 space-y-1 overflow-y-auto pr-1'>
                {carregando &&
                    LINHAS_SKELETON.map((linha) => (
                        <div key={linha} className='flex items-center gap-3 px-2 py-2.5'>
                            <Skeleton className='h-7 w-7 shrink-0 rounded-full' />
                            <Skeleton className='h-3.5 flex-1' />
                            <Skeleton className='h-3.5 w-8 shrink-0' />
                        </div>
                    ))}

                {!carregando && rankingFiltrado.length === 0 && (
                    <p className='py-6 text-center text-sm text-gray-dark'>
                        {termo ? 'Nenhum operador encontrado.' : 'Nenhum pedido bipado no período.'}
                    </p>
                )}

                {!carregando &&
                    rankingFiltrado.map((usuario) => {
                        const posicao = ranking.findIndex((item) => item.id === usuario.id)
                        const corPosicao = CORES_POSICAO[posicao] ?? 'bg-gray text-gray-dark'
                        const percentual = Math.max(6, (Number(usuario.count) / maiorContagem) * 100)

                        return (
                            <div
                                key={usuario.id}
                                className='relative overflow-hidden rounded-md transition hover:bg-gray'
                            >
                                <div
                                    className='absolute inset-y-0 left-0 bg-orange-base/10'
                                    style={{ width: `${percentual}%` }}
                                />
                                <div className='relative flex items-center justify-between gap-3 px-2 py-2.5'>
                                    <div className='flex min-w-0 items-center gap-3'>
                                        <span
                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${corPosicao}`}
                                        >
                                            {posicao + 1}
                                        </span>
                                        <span className='truncate text-sm text-gray-text'>{usuario.nome}</span>
                                    </div>
                                    <span className='shrink-0 text-sm font-semibold text-orange-base'>{usuario.count}</span>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </Modal>
    )
}

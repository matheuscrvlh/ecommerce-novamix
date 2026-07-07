import { useMemo, useState, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import AnimatedNumber from '../../components/AnimatedNumber'
import Skeleton from '../../components/Skeleton'

type Pedido = {
    id: number
    usuario_id: number | null
    bipado_em: string | null
}

type ProducaoPorHoraSectionProps = {
    pedidos: Pedido[]
    carregando: boolean
}

const HORAS = Array.from({ length: 24 }, (_, hora) => hora)
const LARGURA = 720
const ALTURA = 160
const PADDING_TOPO = 16
const PADDING_BASE = 4
const ALTURA_PLOTAVEL = ALTURA - PADDING_TOPO - PADDING_BASE
const PASSO_X = LARGURA / (HORAS.length - 1)

export default function ProducaoPorHoraSection({ pedidos, carregando }: ProducaoPorHoraSectionProps) {
    const [horaAtiva, setHoraAtiva] = useState<number | null>(null)

    const contagemPorHora = useMemo(() => {
        const contagem = new Array(24).fill(0)

        pedidos.forEach((pedido) => {
            if (!pedido.bipado_em) return
            const hora = new Date(pedido.bipado_em).getHours()
            contagem[hora] += 1
        })

        return contagem
    }, [pedidos])

    const total = contagemPorHora.reduce((soma, valor) => soma + valor, 0)
    const maximo = Math.max(...contagemPorHora)

    if (carregando && total === 0) {
        return (
            <section className='mb-8 rounded-lg bg-white p-4 shadow-sm sm:p-6'>
                <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-dark uppercase'>Produção por hora</h2>
                <Skeleton className='h-32 w-full sm:h-40' />
            </section>
        )
    }

    if (total === 0) {
        return (
            <section className='mb-8 rounded-lg bg-white p-6 shadow-sm'>
                <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-dark uppercase'>Produção por hora</h2>
                <p className='py-8 text-center text-sm text-gray-dark'>Sem pedidos bipados no período selecionado.</p>
            </section>
        )
    }

    function coordenadas(hora: number) {
        const valor = contagemPorHora[hora]
        const x = hora * PASSO_X
        const y = PADDING_TOPO + (1 - valor / maximo) * ALTURA_PLOTAVEL
        return { x, y, valor }
    }

    const pontos = HORAS.map((hora) => coordenadas(hora))
    const linePath = pontos.map((ponto, index) => `${index === 0 ? 'M' : 'L'} ${ponto.x},${ponto.y}`).join(' ')
    const baseY = PADDING_TOPO + ALTURA_PLOTAVEL
    const areaPath = `${linePath} L ${pontos[pontos.length - 1].x},${baseY} L ${pontos[0].x},${baseY} Z`

    const ultimaHoraComDado = [...HORAS].reverse().find((hora) => contagemPorHora[hora] > 0) ?? 0
    const horaExibida = horaAtiva ?? ultimaHoraComDado
    const valorExibido = contagemPorHora[horaExibida]
    const pontoAtivo = coordenadas(horaExibida)
    const pontoAoVivo = coordenadas(ultimaHoraComDado)

    function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
        const rect = event.currentTarget.getBoundingClientRect()
        const posicaoRelativa = (event.clientX - rect.left) / rect.width
        const hora = Math.round(posicaoRelativa * (HORAS.length - 1))
        setHoraAtiva(Math.min(23, Math.max(0, hora)))
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='mb-8 rounded-lg bg-white p-4 shadow-sm sm:p-6'
        >
            <h2 className='text-xs font-semibold tracking-wide text-gray-dark uppercase'>Produção por hora</h2>

            <div className='overflow-x-auto overflow-y-visible pt-8'>
                <div className='sm:min-w-180'>
                    <div className='flex'>
                        <div className='flex w-8 shrink-0 flex-col justify-between text-right text-[10px] text-gray-dark'>
                            <span>{maximo}</span>
                            <span>{Math.round(maximo / 2)}</span>
                            <span>0</span>
                        </div>

                        <div className='relative flex-1'>
                            <svg
                                viewBox={`0 0 ${LARGURA} ${ALTURA}`}
                                className='w-full touch-none'
                                onPointerMove={handlePointerMove}
                                onPointerLeave={() => setHoraAtiva(null)}
                                role='img'
                                aria-label='Gráfico de pedidos bipados por hora'
                            >
                                <defs>
                                    <linearGradient id='producaoGradiente' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='0%' stopColor='#7BAD7F' stopOpacity='0.28' />
                                        <stop offset='100%' stopColor='#7BAD7F' stopOpacity='0' />
                                    </linearGradient>
                                </defs>

                                <line x1='0' y1={PADDING_TOPO} x2={LARGURA} y2={PADDING_TOPO} className='stroke-gray-dark/10' strokeWidth='1' />
                                <line
                                    x1='0'
                                    y1={PADDING_TOPO + ALTURA_PLOTAVEL / 2}
                                    x2={LARGURA}
                                    y2={PADDING_TOPO + ALTURA_PLOTAVEL / 2}
                                    className='stroke-gray-dark/10'
                                    strokeWidth='1'
                                />
                                <line x1='0' y1={baseY} x2={LARGURA} y2={baseY} className='stroke-gray-dark/20' strokeWidth='1' />

                                <motion.path
                                    fill='url(#producaoGradiente)'
                                    stroke='none'
                                    animate={{ d: areaPath }}
                                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                                />
                                <motion.path
                                    fill='none'
                                    className='stroke-green-base'
                                    strokeWidth='2'
                                    strokeLinejoin='round'
                                    strokeLinecap='round'
                                    animate={{ d: linePath }}
                                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                                />

                                {horaAtiva !== null && (
                                    <motion.line
                                        y1={PADDING_TOPO}
                                        y2={baseY}
                                        className='stroke-gray-dark/30'
                                        strokeWidth='1'
                                        strokeDasharray='3 3'
                                        initial={{ x1: pontoAtivo.x, x2: pontoAtivo.x, opacity: 0 }}
                                        animate={{ x1: pontoAtivo.x, x2: pontoAtivo.x, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                    />
                                )}

                                {/* pulso "ao vivo" no último horário com pedido, quando ninguém está passando o mouse */}
                                {horaAtiva === null && (
                                    <motion.circle
                                        cx={pontoAoVivo.x}
                                        cy={pontoAoVivo.y}
                                        r='4.5'
                                        className='fill-green-base'
                                        animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                        style={{ originX: '50%', originY: '50%' }}
                                    />
                                )}

                                <motion.circle
                                    r='4.5'
                                    className='fill-green-base stroke-white'
                                    strokeWidth='2'
                                    animate={{ cx: pontoAtivo.x, cy: pontoAtivo.y }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                />

                                {HORAS.map((hora) => (
                                    <rect
                                        key={hora}
                                        x={hora * PASSO_X - PASSO_X / 2}
                                        y='0'
                                        width={PASSO_X}
                                        height={ALTURA}
                                        fill='transparent'
                                        tabIndex={0}
                                        role='graphics-symbol'
                                        aria-label={`${hora}h: ${contagemPorHora[hora]} pedido${contagemPorHora[hora] === 1 ? '' : 's'}`}
                                        onFocus={() => setHoraAtiva(hora)}
                                        onBlur={() => setHoraAtiva(null)}
                                        className='outline-none'
                                    />
                                ))}
                            </svg>

                            <div className='pointer-events-none absolute right-1 bottom-1 text-right'>
                                <span className='text-[10px] font-semibold text-gray-text sm:text-sm'>
                                    <AnimatedNumber value={valorExibido} /> pedido{valorExibido === 1 ? '' : 's'}
                                </span>
                                <span className='ml-1 text-[9px] text-gray-dark sm:text-xs'>{horaExibida}h</span>
                            </div>

                            {horaAtiva !== null && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.15 }}
                                    className={`pointer-events-none absolute z-30 -translate-y-full rounded-md bg-gray-text px-1.5 py-0.5 text-[9px] whitespace-nowrap text-white shadow-lg sm:px-2 sm:py-1 sm:text-xs ${
                                        horaAtiva <= 1
                                            ? 'left-0'
                                            : horaAtiva >= 22
                                              ? 'right-0'
                                              : 'left-1/2 -translate-x-1/2'
                                    }`}
                                    style={{
                                        top: `${(pontoAtivo.y / ALTURA) * 100}%`,
                                        marginTop: '-8px',
                                        ...(horaAtiva > 1 && horaAtiva < 22
                                            ? { left: `${(pontoAtivo.x / LARGURA) * 100}%` }
                                            : {})
                                    }}
                                >
                                    <span className='font-semibold'>
                                        {valorExibido} pedido{valorExibido === 1 ? '' : 's'}
                                    </span>
                                    <span className='ml-1 text-white/70'>· {horaAtiva}h</span>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className='ml-8 flex justify-between pt-1 text-[10px] text-gray-dark'>
                        {HORAS.filter((hora) => hora % 2 === 0).map((hora) => (
                            <span key={hora} className={hora % 4 === 0 ? '' : 'hidden sm:inline'}>
                                {hora}h
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

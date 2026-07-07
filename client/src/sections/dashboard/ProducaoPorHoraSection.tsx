import { useMemo, useState, type PointerEvent } from 'react'

type Pedido = {
    id: number
    usuario_id: number | null
    bipado_em: string | null
}

type ProducaoPorHoraSectionProps = {
    pedidos: Pedido[]
}

const HORAS = Array.from({ length: 24 }, (_, hora) => hora)
const LARGURA = 720
const ALTURA = 160
const PADDING_TOPO = 16
const PADDING_BASE = 4
const ALTURA_PLOTAVEL = ALTURA - PADDING_TOPO - PADDING_BASE
const PASSO_X = LARGURA / (HORAS.length - 1)

export default function ProducaoPorHoraSection({ pedidos }: ProducaoPorHoraSectionProps) {
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

    function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
        const rect = event.currentTarget.getBoundingClientRect()
        const posicaoRelativa = (event.clientX - rect.left) / rect.width
        const hora = Math.round(posicaoRelativa * (HORAS.length - 1))
        setHoraAtiva(Math.min(23, Math.max(0, hora)))
    }

    return (
        <section className='mb-8 rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-dark uppercase'>Produção por hora</h2>

            <div className='overflow-x-auto'>
                <div className='min-w-180'>
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

                                <path d={areaPath} fill='url(#producaoGradiente)' stroke='none' />
                                <path d={linePath} fill='none' className='stroke-green-base' strokeWidth='2' strokeLinejoin='round' strokeLinecap='round' />

                                {horaAtiva !== null && (
                                    <line
                                        x1={pontoAtivo.x}
                                        x2={pontoAtivo.x}
                                        y1={PADDING_TOPO}
                                        y2={baseY}
                                        className='stroke-gray-dark/30'
                                        strokeWidth='1'
                                        strokeDasharray='3 3'
                                    />
                                )}

                                <circle cx={pontoAtivo.x} cy={pontoAtivo.y} r='4.5' className='fill-green-base stroke-white' strokeWidth='2' />

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
                                <span className='text-sm font-semibold text-gray-text'>
                                    {valorExibido} pedido{valorExibido === 1 ? '' : 's'}
                                </span>
                                <span className='ml-1 text-xs text-gray-dark'>{horaExibida}h</span>
                            </div>

                            {horaAtiva !== null && (
                                <div
                                    className={`pointer-events-none absolute z-10 -translate-y-full rounded-md bg-gray-text px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg ${
                                        horaAtiva <= 1
                                            ? 'left-0'
                                            : horaAtiva >= 22
                                              ? 'right-0'
                                              : 'left-1/2 -translate-x-1/2'
                                    }`}
                                    style={{
                                        top: `${(pontoAtivo.y / ALTURA) * 100}%`,
                                        marginTop: '-10px',
                                        ...(horaAtiva > 1 && horaAtiva < 22
                                            ? { left: `${(pontoAtivo.x / LARGURA) * 100}%` }
                                            : {})
                                    }}
                                >
                                    <span className='font-semibold'>
                                        {valorExibido} pedido{valorExibido === 1 ? '' : 's'}
                                    </span>
                                    <span className='ml-1 text-white/70'>· {horaAtiva}h</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='ml-8 flex justify-between pt-1 text-[10px] text-gray-dark'>
                        {HORAS.filter((hora) => hora % 2 === 0).map((hora) => (
                            <span key={hora}>{hora}h</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

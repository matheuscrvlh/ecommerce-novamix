import { AnimatePresence, motion } from 'framer-motion'
import { TrophyIcon } from '../../components/icons'
import AnimatedNumber from '../../components/AnimatedNumber'
import type { Usuario } from '../../api/users'

type Pedido = {
    id: number
    usuario_id: number | null
    bipado_em: string | null
}

type PodiumSectionProps = {
    pedidos: Pedido[]
    usuarios: Usuario[]
}

const MEDALHAS = [
    {
        posicao: '1º',
        altura: 'h-14',
        texto: 'text-gold',
        glow: 'rgba(255,196,0,0.6)',
        claro: '#FFE9A8',
        base: '#FFC400',
        escuro: '#C98A00'
    },
    {
        posicao: '2º',
        altura: 'h-10',
        texto: 'text-silver',
        glow: 'rgba(125,166,224,0.45)',
        claro: '#EAF2FF',
        base: '#8FB4E8',
        escuro: '#4E6FA0'
    },
    {
        posicao: '3º',
        altura: 'h-8',
        texto: 'text-bronze',
        glow: 'rgba(255,124,41,0.45)',
        claro: '#FFB27A',
        base: '#FF7C29',
        escuro: '#B0490D'
    },
    {
        posicao: '4º',
        altura: 'h-6',
        texto: 'text-gray-dark',
        glow: 'transparent',
        claro: '#5C7285',
        base: '#354856',
        escuro: '#212D36'
    },
    {
        posicao: '5º',
        altura: 'h-5',
        texto: 'text-gray-dark',
        glow: 'transparent',
        claro: '#5C7285',
        base: '#354856',
        escuro: '#212D36'
    }
]

function isHoje(data: string | null) {
    if (!data) return false
    return new Date(data).toDateString() === new Date().toDateString()
}

export default function PodiumSection({ pedidos, usuarios }: PodiumSectionProps) {
    const contagem = new Map<number, number>()

    pedidos
        .filter((pedido) => isHoje(pedido.bipado_em))
        .forEach((pedido) => {
            if (pedido.usuario_id === null) return
            contagem.set(pedido.usuario_id, (contagem.get(pedido.usuario_id) ?? 0) + 1)
        })

    const podio = [...contagem.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([usuario_id, total]) => {
            const usuario = usuarios.find((u) => u.id === usuario_id)
            return { usuario_id, nome: usuario?.nome ?? `Usuário ${usuario_id}`, total }
        })

    if (podio.length === 0) return null

    return (
        <section className='mb-4'>
            <h2 className='mb-2 text-xs font-semibold tracking-wide text-gray-dark uppercase'>Pódio de hoje</h2>

            <div className='flex items-end justify-center gap-3 rounded-lg bg-white p-4 pt-6 shadow-sm'>
                <AnimatePresence>
                    {podio.map((item, index) => {
                        const medalha = MEDALHAS[index]

                        return (
                            <motion.div
                                key={item.usuario_id}
                                layout
                                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -16, scale: 0.85 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                                className='relative flex w-16 flex-col items-center'
                                style={{ perspective: 500 }}
                            >
                                {index === 0 && (
                                    <motion.div
                                        aria-hidden
                                        className='pointer-events-none absolute -top-2 h-10 w-10 rounded-full blur-lg'
                                        style={{ backgroundColor: medalha.glow }}
                                        animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.15, 0.9] }}
                                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                )}

                                <motion.div
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{
                                        duration: 2.4,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: index * 0.18
                                    }}
                                    className='relative'
                                >
                                    <TrophyIcon className={`h-4 w-4 ${medalha.texto}`} />
                                </motion.div>

                                <p
                                    className='mt-0.5 w-full truncate text-center text-[10px] font-semibold text-gray-text'
                                    title={item.nome}
                                >
                                    {item.nome}
                                </p>
                                <AnimatedNumber value={item.total} className='text-[10px] text-gray-dark' />

                                <motion.div
                                    layout
                                    whileHover={{ rotateX: -14, y: -3, scale: 1.04 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                    className={`relative mt-1 flex w-full items-end justify-center overflow-hidden rounded-t-md ${medalha.altura}`}
                                    style={{
                                        backgroundImage: `linear-gradient(180deg, ${medalha.claro} 0%, ${medalha.base} 55%, ${medalha.escuro} 100%)`,
                                        boxShadow: `0 6px 10px -4px ${medalha.escuro}66`,
                                        transformStyle: 'preserve-3d'
                                    }}
                                >
                                    <div
                                        className='pointer-events-none absolute inset-x-0 top-0 h-2 opacity-70'
                                        style={{ backgroundImage: `linear-gradient(180deg, ${medalha.claro}, transparent)` }}
                                    />
                                    <div className='pointer-events-none absolute -top-1 -left-3 h-10 w-8 -rotate-12 bg-white/25 blur-[2px]' />
                                    <span className='relative z-10 pb-1 text-[10px] font-bold text-white drop-shadow'>
                                        {medalha.posicao}
                                    </span>
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </section>
    )
}

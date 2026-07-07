import { TrophyIcon } from '../../components/icons'
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
    { posicao: '1º', altura: 'h-12', cor: 'bg-gold', texto: 'text-gold' },
    { posicao: '2º', altura: 'h-9', cor: 'bg-silver', texto: 'text-silver' },
    { posicao: '3º', altura: 'h-7', cor: 'bg-bronze', texto: 'text-bronze' },
    { posicao: '4º', altura: 'h-6', cor: 'bg-gray-dark', texto: 'text-gray-dark' },
    { posicao: '5º', altura: 'h-5', cor: 'bg-gray-dark/70', texto: 'text-gray-dark' }
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
            return { nome: usuario?.nome ?? `Usuário ${usuario_id}`, total }
        })

    if (podio.length === 0) return null

    return (
        <section className='mb-4'>
            <h2 className='mb-2 text-xs font-semibold tracking-wide text-gray-dark uppercase'>Pódio de hoje</h2>

            <div className='flex items-end justify-center gap-2 rounded-lg bg-white p-3 shadow-sm'>
                {podio.map((item, index) => {
                    const medalha = MEDALHAS[index]

                    return (
                        <div key={item.nome} className='flex w-16 flex-col items-center'>
                            <TrophyIcon className={`h-3.5 w-3.5 ${medalha.texto}`} />
                            <p
                                className='mt-0.5 w-full truncate text-center text-[10px] font-semibold text-gray-text'
                                title={item.nome}
                            >
                                {item.nome}
                            </p>
                            <p className='text-[10px] text-gray-dark'>{item.total}</p>
                            <div
                                className={`mt-1 flex w-full items-center justify-center rounded-t-md ${medalha.altura} ${medalha.cor}`}
                            >
                                <span className='text-[10px] font-bold text-white'>{medalha.posicao}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

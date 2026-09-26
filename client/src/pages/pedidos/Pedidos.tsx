import { useEffect, useState, type SubmitEvent } from 'react'
import { consultOrder, editOrder, getOrders } from '../../api/orders'
import { useAuth } from '../../hooks/useAuth'
import { useUsuariosResumo } from '../../hooks/useUsuariosResumo'
import SidebarSection from '../../sections/SidebarSection'
import PageHeaderSection from '../../sections/PageHeaderSection'
import DateFilterSection from '../../sections/dashboard/DateFilterSection'
import PedidosTableSection from '../../sections/pedidos/PedidosTableSection'
import EditarOperadorModal from '../../sections/pedidos/EditarOperadorModal'
import Alert from '../../components/Alert'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Footer from '../../components/Footer'
import BarcodeScannerModal from '../../components/BarcodeScannerModal'
import ThemeToggle from '../../components/ThemeToggle'
import { CameraIcon } from '../../components/icons'
import { PROPS_CAMPO_CODIGO } from '../../lib/campoCodigo'

type Pedido = {
    id: number
    codigo_pedido: string
    usuario_id: number | null
    bipado_em: string | null
}

type ResultadoConsulta = {
    bipado: boolean
    mensagem: string
}

function hojeISO() {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

export default function Pedidos() {
    const { loading: carregandoAuth, role } = useAuth()
    const { usuarios } = useUsuariosResumo()
    // só admin pode trocar o operador (o server recusa pros outros)
    const podeEditar = role === 'ADMIN'

    const [codigoPedido, setCodigoPedido] = useState('')
    const [resultado, setResultado] = useState<ResultadoConsulta | null>(null)
    const [erroConsulta, setErroConsulta] = useState('')
    const [consultando, setConsultando] = useState(false)
    const [scannerAberto, setScannerAberto] = useState(false)

    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [erroTabela, setErroTabela] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [dataInicialInput, setDataInicialInput] = useState(hojeISO())
    const [dataFinalInput, setDataFinalInput] = useState(hojeISO())
    const [filtro, setFiltro] = useState({ dataInicial: hojeISO(), dataFinal: hojeISO() })

    const [editandoPedido, setEditandoPedido] = useState<string | null>(null)

    function buscarPedidos(cancelado?: () => boolean) {
        if (carregandoAuth) return Promise.resolve()

        setCarregando(true)
        setErroTabela('')

        return getOrders({
            dataInicial: `${filtro.dataInicial}T00:00:00`,
            dataFinal: `${filtro.dataFinal}T23:59:59.999`
        })
            .then((resultado) => {
                if (cancelado?.()) return
                setPedidos(resultado)
                setCarregando(false)
            })
            .catch((error) => {
                if (cancelado?.()) return
                setErroTabela(error instanceof Error ? error.message : 'Erro ao buscar pedidos.')
                setCarregando(false)
            })
    }

    useEffect(() => {
        let cancelado = false
        buscarPedidos(() => cancelado)

        return () => {
            cancelado = true
        }
    }, [carregandoAuth, filtro])

    function aplicarPeriodo(dataInicial: string, dataFinal: string) {
        setDataInicialInput(dataInicial)
        setDataFinalInput(dataFinal)
        setFiltro({ dataInicial, dataFinal })
    }

    function handleFiltrar(event: SubmitEvent) {
        event.preventDefault()
        aplicarPeriodo(dataInicialInput, dataFinalInput)
    }

    async function handleSalvarOperador(usuarioId: number) {
        const codigo = editandoPedido!
        await editOrder({ codigoPedido: codigo, usuarioId })
        await buscarPedidos()
        if (resultado) {
            await consultarPedido(codigo)
        }
    }

    async function consultarPedido(codigo: string) {
        setErroConsulta('')
        setResultado(null)
        setConsultando(true)

        try {
            const result = await consultOrder({ codigoPedido: codigo })
            setResultado({ bipado: true, mensagem: result.success })
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro ao consultar pedido.'

            if (msg === 'Pedido não encontrado.') {
                setResultado({ bipado: false, mensagem: 'Esse pedido ainda não foi bipado.' })
            } else {
                setErroConsulta(msg)
            }
        } finally {
            setConsultando(false)
        }
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        await consultarPedido(codigoPedido)
    }

    function handleScan(codigo: string) {
        setCodigoPedido(codigo)
        consultarPedido(codigo)
    }

    return (
        <div className='flex min-h-screen flex-col bg-gray md:flex-row dark:bg-dark-bg'>
            <SidebarSection />

            <main className='flex-1 p-4 sm:p-8'>
                <PageHeaderSection title='Pedidos' action={<ThemeToggle className='hidden md:block' />} />

                <section className='mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-dark-surface'>
                    <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-dark uppercase dark:text-dark-text-muted'>
                        Consultar pedido
                    </h2>

                    <form onSubmit={handleSubmit} className='flex flex-wrap gap-2'>
                        <Input
                            {...PROPS_CAMPO_CODIGO}
                            enterKeyHint='search'
                            placeholder='Código do pedido'
                            value={codigoPedido}
                            onChange={(e) => setCodigoPedido(e.target.value)}
                            className='flex-1 min-w-50'
                            required
                        />
                        <button
                            type='button'
                            onClick={() => {
                                setResultado(null)
                                setErroConsulta('')
                                setScannerAberto(true)
                            }}
                            className='rounded-md border border-gray-base px-3 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                            title='Escanear com a câmera'
                        >
                            <CameraIcon />
                        </button>
                        <Button type='submit' disabled={consultando}>
                            {consultando ? 'Consultando...' : 'Consultar'}
                        </Button>
                    </form>

                    {resultado && (
                        <div
                            className={`mt-4 flex flex-wrap items-center justify-between gap-2 rounded-md px-4 py-3 text-sm ${
                                resultado.bipado ? 'bg-green-base/10 text-green-base' : 'bg-orange-base/10 text-orange-base'
                            }`}
                        >
                            <span>{resultado.mensagem}</span>
                            {resultado.bipado && podeEditar && (
                                <Button variant='ghost' className='shrink-0' onClick={() => setEditandoPedido(codigoPedido)}>
                                    Alterar operador
                                </Button>
                            )}
                        </div>
                    )}
                    {erroConsulta && (
                        <div className='mt-4'>
                            <Alert>{erroConsulta}</Alert>
                        </div>
                    )}
                </section>

                {erroTabela && (
                    <div className='mb-4'>
                        <Alert>{erroTabela}</Alert>
                    </div>
                )}

                <DateFilterSection
                    className='mb-6'
                    dataInicial={dataInicialInput}
                    dataFinal={dataFinalInput}
                    onDataInicialChange={setDataInicialInput}
                    onDataFinalChange={setDataFinalInput}
                    onSubmit={handleFiltrar}
                    onAplicarPeriodo={aplicarPeriodo}
                />

                <PedidosTableSection
                    pedidos={pedidos}
                    usuarios={usuarios}
                    carregando={carregando}
                    onEditarOperador={podeEditar ? (pedido) => setEditandoPedido(pedido.codigo_pedido) : undefined}
                />

                <Footer />
            </main>

            {scannerAberto && (
                <BarcodeScannerModal
                    onClose={() => setScannerAberto(false)}
                    onResult={handleScan}
                />
            )}

            <EditarOperadorModal
                codigoPedido={editandoPedido}
                usuarios={usuarios}
                onClose={() => setEditandoPedido(null)}
                onSubmit={handleSalvarOperador}
            />
        </div>
    )
}

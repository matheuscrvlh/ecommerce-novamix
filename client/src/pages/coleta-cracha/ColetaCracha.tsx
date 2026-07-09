import { useEffect, useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Usuario } from '../../api/users'
import { postOrderAs } from '../../api/orders'
import { useAuth } from '../../hooks/useAuth'
import { useUsuarios } from '../../hooks/useUsuarios'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Logo from '../../components/Logo'
import Alert from '../../components/Alert'
import BarcodeScannerModal from '../../components/BarcodeScannerModal'
import ThemeToggle from '../../components/ThemeToggle'
import { DashboardIcon, LogoutIcon, CameraIcon } from '../../components/icons'

const SEGUNDOS_SESSAO = 15

type ItemFeed = {
    codigo: string
    ok: boolean
    mensagem: string
}

export default function ColetaCracha() {
    const { token, logout } = useAuth()
    const { usuarios, carregando: carregandoUsuarios } = useUsuarios()

    const [crachaInput, setCrachaInput] = useState('')
    const [erroCracha, setErroCracha] = useState('')

    const [sessao, setSessao] = useState<Usuario | null>(null)
    const [restante, setRestante] = useState(SEGUNDOS_SESSAO)
    const [pedidoInput, setPedidoInput] = useState('')
    const [feed, setFeed] = useState<ItemFeed[]>([])
    const [scannerCrachaAberto, setScannerCrachaAberto] = useState(false)
    const [scannerPedidoAberto, setScannerPedidoAberto] = useState(false)
    const [ultimoResultadoScannerPedido, setUltimoResultadoScannerPedido] = useState<{ ok: boolean; mensagem: string } | null>(null)

    useEffect(() => {
        if (!sessao) return

        const interval = setInterval(() => {
            setRestante((atual) => {
                if (atual <= 1) {
                    setSessao(null)
                    setFeed([])
                    return SEGUNDOS_SESSAO
                }
                return atual - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [sessao])

    function verificarCracha(cracha: string) {
        setErroCracha('')

        if (carregandoUsuarios) {
            setErroCracha('Aguarde, carregando lista de usuários...')
            return
        }

        const encontrado = usuarios.find(
            (usuario) => usuario.cracha === cracha.trim() && usuario.status
        )

        if (!encontrado) {
            setErroCracha('Crachá não encontrado ou usuário inativo.')
        } else {
            setSessao(encontrado)
            setRestante(SEGUNDOS_SESSAO)
            setCrachaInput('')
        }
    }

    function handleCrachaSubmit(event: SubmitEvent) {
        event.preventDefault()
        verificarCracha(crachaInput)
    }

    function handleCrachaScan(cracha: string) {
        setScannerCrachaAberto(false)
        verificarCracha(cracha)
    }

    async function biparPedido(codigo: string, viaScanner = false) {
        if (!sessao) return

        setRestante(SEGUNDOS_SESSAO)
        setPedidoInput('')

        try {
            const result = await postOrderAs({ codigo_pedido: codigo, cracha: sessao.cracha!, token: token! })
            const msg = result.success ?? 'Bipado com sucesso.'
            setFeed((atual) => [{ codigo, ok: true, mensagem: msg }, ...atual])
            if (viaScanner) setUltimoResultadoScannerPedido({ ok: true, mensagem: `${codigo} — ${msg}` })
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro ao bipar.'
            setFeed((atual) => [{ codigo, ok: false, mensagem: msg }, ...atual])
            if (viaScanner) setUltimoResultadoScannerPedido({ ok: false, mensagem: `${codigo} — ${msg}` })
        }
    }

    async function handlePedidoSubmit(event: SubmitEvent) {
        event.preventDefault()
        await biparPedido(pedidoInput)
    }

    function handlePedidoScan(codigo: string) {
        biparPedido(codigo, true)
    }

    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-br from-orange-base/10 via-white to-gray-base/10 p-4 dark:bg-dark-bg dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg'>
            <div className='absolute top-4 right-4 flex items-center gap-4'>
                <Link
                    to='/dashboard'
                    className='flex items-center gap-1 text-sm text-gray-dark transition hover:text-gray-text dark:text-dark-text-muted dark:hover:text-dark-text'
                >
                    <DashboardIcon className='h-4 w-4' />
                    Voltar ao Dashboard
                </Link>

                <div className='h-4 w-px bg-gray-base/30' />

                <ThemeToggle />

                <div className='h-4 w-px bg-gray-base/30' />

                <button
                    onClick={logout}
                    className='flex items-center gap-1 text-sm font-medium text-red-base transition hover:text-red-light'
                >
                    <LogoutIcon className='h-4 w-4' />
                    Sair
                </button>
            </div>

            <div className='flex justify-center'>
                <Logo />
            </div>

            {!sessao && (
                <form onSubmit={handleCrachaSubmit} className='w-full max-w-sm space-y-4 rounded-lg bg-white p-8 shadow-sm dark:bg-dark-surface'>
                    <h1 className='text-center text-lg font-semibold text-gray-text dark:text-dark-text'>Coleta por Crachá</h1>
                    <p className='text-center text-sm text-gray-dark dark:text-dark-text-muted'>
                        Bipe ou digite seu crachá pra começar a conferir pedidos
                    </p>

                    <div className='flex gap-2'>
                        <Input
                            autoFocus
                            placeholder='Crachá'
                            value={crachaInput}
                            onChange={(e) => setCrachaInput(e.target.value)}
                            className='flex-1'
                            required
                        />
                        <button
                            type='button'
                            onClick={() => setScannerCrachaAberto(true)}
                            className='rounded-md border border-gray-base px-3 text-gray-dark transition hover:bg-gray hover:text-orange-base sm:hidden dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                            title='Escanear com a câmera'
                        >
                            <CameraIcon />
                        </button>
                    </div>

                    {erroCracha && <Alert>{erroCracha}</Alert>}

                    <Button type='submit' className='w-full'>
                        Entrar
                    </Button>
                </form>
            )}

            {sessao && (
                <div className='w-full max-w-sm space-y-4 rounded-lg bg-white p-8 shadow-sm dark:bg-dark-surface'>
                    <div className='text-center'>
                        <h1 className='text-lg font-semibold text-gray-text dark:text-dark-text'>Olá, {sessao.nome}!</h1>
                        <p className='text-sm text-gray-dark dark:text-dark-text-muted'>Bipe os pedidos que quiser conferir</p>
                    </div>

                    <div className='h-2 w-full overflow-hidden rounded-full bg-gray dark:bg-dark-surface-2'>
                        <div
                            className='h-2 rounded-full bg-orange-base transition-all duration-1000 ease-linear'
                            style={{ width: `${(restante / SEGUNDOS_SESSAO) * 100}%` }}
                        />
                    </div>
                    <p className='text-center text-xs text-gray-dark dark:text-dark-text-muted'>
                        Sessão encerra em {restante}s de inatividade
                    </p>

                    <form onSubmit={handlePedidoSubmit} className='flex gap-2'>
                        <Input
                            autoFocus
                            placeholder='Código do pedido'
                            value={pedidoInput}
                            onChange={(e) => setPedidoInput(e.target.value)}
                            className='flex-1'
                            required
                        />
                        <button
                            type='button'
                            onClick={() => {
                                setUltimoResultadoScannerPedido(null)
                                setScannerPedidoAberto(true)
                            }}
                            className='rounded-md border border-gray-base px-3 text-gray-dark transition hover:bg-gray hover:text-orange-base sm:hidden dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                            title='Escanear com a câmera'
                        >
                            <CameraIcon />
                        </button>
                    </form>

                    {feed.length > 0 && (
                        <ul className='max-h-48 space-y-1 overflow-y-auto text-sm'>
                            {feed.map((item, index) => (
                                <li
                                    key={`${item.codigo}-${index}`}
                                    className={item.ok ? 'text-green-base' : 'text-red-base'}
                                >
                                    {item.codigo} — {item.mensagem}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {scannerCrachaAberto && (
                <BarcodeScannerModal
                    onClose={() => setScannerCrachaAberto(false)}
                    onResult={handleCrachaScan}
                />
            )}
            {scannerPedidoAberto && (
                <BarcodeScannerModal
                    onClose={() => {
                        setScannerPedidoAberto(false)
                        setUltimoResultadoScannerPedido(null)
                    }}
                    onResult={handlePedidoScan}
                    ultimoResultado={ultimoResultadoScannerPedido}
                />
            )}
        </div>
    )
}

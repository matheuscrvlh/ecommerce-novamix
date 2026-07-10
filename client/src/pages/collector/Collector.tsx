import { useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { postOrder } from '../../api/orders'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Logo from '../../components/Logo'
import Alert from '../../components/Alert'
import BarcodeScannerModal from '../../components/BarcodeScannerModal'
import RankingModal from '../../sections/RankingModal'
import ThemeToggle from '../../components/ThemeToggle'
import { LogoutIcon, DashboardIcon, TrophyIcon, CameraIcon, QrCodeIcon, UserAvatarIcon } from '../../components/icons'

export default function Collector() {
    const [codigoPedido, setCodigoPedido] = useState('')
    const [mensagem, setMensagem] = useState('')
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [scannerAberto, setScannerAberto] = useState(false)
    const [rankingAberto, setRankingAberto] = useState(false)
    const [ultimoResultadoScanner, setUltimoResultadoScanner] = useState<{ ok: boolean; mensagem: string } | null>(null)
    const { token, logout } = useAuth()

    async function biparPedido(codigo: string, viaScanner = false) {
        setErro('')
        setMensagem('')
        setEnviando(true)

        try {
            const result = await postOrder({ codigo_pedido: codigo, token: token! })
            const msg = result.success ?? 'Pedido bipado com sucesso.'
            setMensagem(msg)
            setCodigoPedido('')
            if (viaScanner) setUltimoResultadoScanner({ ok: true, mensagem: msg })
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro ao bipar pedido.'
            setErro(msg)
            if (viaScanner) setUltimoResultadoScanner({ ok: false, mensagem: msg })
        } finally {
            setEnviando(false)
        }
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        await biparPedido(codigoPedido)
    }

    function handleScan(codigo: string) {
        setCodigoPedido(codigo)
        biparPedido(codigo, true)
    }

    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-br from-orange-base/10 via-white to-gray-base/10 p-4 dark:bg-dark-bg dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg'>
            <div className='absolute top-4 right-4 flex items-center gap-4'>
                <Link
                    to='/dashboard'
                    className='flex items-center gap-1 text-sm text-gray-dark transition hover:text-gray-text dark:text-dark-text-muted dark:hover:text-dark-text'
                >
                    <DashboardIcon className='h-4 w-4' />
                    Dashboard
                </Link>

                <Link
                    to='/pedidos'
                    className='flex items-center gap-1 text-sm text-gray-dark transition hover:text-gray-text dark:text-dark-text-muted dark:hover:text-dark-text'
                >
                    <QrCodeIcon className='h-4 w-4' />
                    Pedidos
                </Link>

                <Link
                    to='/conta'
                    className='flex items-center gap-1 text-sm text-gray-dark transition hover:text-gray-text dark:text-dark-text-muted dark:hover:text-dark-text'
                >
                    <UserAvatarIcon className='h-4 w-4' />
                    Minha Conta
                </Link>

                <button
                    onClick={() => setRankingAberto(true)}
                    className='flex items-center gap-1 text-sm text-orange-base transition hover:text-orange-light'
                >
                    <TrophyIcon className='h-4 w-4 origin-center animate-trophy-wiggle' />
                    Ranking
                </button>

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

            <div className='w-full max-w-sm space-y-5 rounded-lg bg-white p-8 shadow-sm dark:bg-dark-surface'>
                <div className='flex justify-center'>
                    <Logo />
                </div>

                <h1 className='text-center text-lg font-semibold text-gray-text dark:text-dark-text'>Bipar pedido</h1>

                <form onSubmit={handleSubmit} className='space-y-3'>
                    <div className='flex gap-2'>
                        <Input
                            autoFocus
                            placeholder='Código do pedido'
                            value={codigoPedido}
                            onChange={(e) => setCodigoPedido(e.target.value)}
                            className='flex-1'
                            required
                        />
                        <button
                            type='button'
                            onClick={() => {
                                setUltimoResultadoScanner(null)
                                setScannerAberto(true)
                            }}
                            className='rounded-md border border-gray-base px-3 text-gray-dark transition hover:bg-gray hover:text-orange-base sm:hidden dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                            title='Escanear com a câmera'
                        >
                            <CameraIcon />
                        </button>
                    </div>

                    <Button type='submit' className='w-full' disabled={enviando}>
                        {enviando ? 'Enviando...' : 'Bipar'}
                    </Button>
                </form>

                {mensagem && (
                    <p className='rounded-md bg-green-base/10 px-4 py-3 text-sm text-green-base'>{mensagem}</p>
                )}
                {erro && <Alert>{erro}</Alert>}
            </div>

            {scannerAberto && (
                <BarcodeScannerModal
                    onClose={() => {
                        setScannerAberto(false)
                        setUltimoResultadoScanner(null)
                    }}
                    onResult={handleScan}
                    ultimoResultado={ultimoResultadoScanner}
                />
            )}

            <RankingModal open={rankingAberto} onClose={() => setRankingAberto(false)} />
        </div>
    )
}

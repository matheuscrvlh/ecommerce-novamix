import { useRef, useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { normalizarCodigo, postOrder } from '../../api/orders'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Logo from '../../components/Logo'
import BarcodeScannerModal from '../../components/BarcodeScannerModal'
import RankingModal from '../../sections/RankingModal'
import SidebarSection from '../../sections/SidebarSection'
import ThemeToggle from '../../components/ThemeToggle'
import { LogoutIcon, DashboardIcon, TrophyIcon, CameraIcon, QrCodeIcon, UserAvatarIcon, ChevronLeftIcon, CheckCircleIcon, XCircleIcon } from '../../components/icons'
import { HUB_URL } from '../../lib/hub'
import { liberarAudio, sinalizarBipagem } from '../../lib/notificationSound'
import { PROPS_CAMPO_CODIGO } from '../../lib/campoCodigo'

const QUANTIDADE_LEITURAS = 5

type Leitura = {
    id: number
    ok: boolean
    codigo: string
    mensagem: string
}

export default function Collector() {
    const [codigoPedido, setCodigoPedido] = useState('')
    const [leituras, setLeituras] = useState<Leitura[]>([])
    const [enviando, setEnviando] = useState(false)
    const [scannerAberto, setScannerAberto] = useState(false)
    const [rankingAberto, setRankingAberto] = useState(false)
    const [ultimoResultadoScanner, setUltimoResultadoScanner] = useState<{ ok: boolean; mensagem: string } | null>(null)
    const { logout } = useAuth()
    const inputRef = useRef<HTMLInputElement>(null)
    const proximoIdRef = useRef(0)

    async function biparPedido(codigo: string, viaScanner = false) {
        if (!codigo.trim()) return

        const codigoExibido = normalizarCodigo(codigo)
        // limpa antes da resposta: se a pistola ler o próximo pedido, ele não gruda no código anterior
        setCodigoPedido('')
        setEnviando(true)

        let ok = false
        let mensagem: string

        try {
            await postOrder({ codigo_pedido: codigo })
            ok = true
            mensagem = `Bipado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
        } catch (error) {
            mensagem = error instanceof Error ? error.message : 'Erro ao bipar pedido.'
        } finally {
            setEnviando(false)
        }

        sinalizarBipagem(ok)
        proximoIdRef.current += 1
        const leitura = { id: proximoIdRef.current, ok, codigo: codigoExibido, mensagem }
        setLeituras((atual) => [leitura, ...atual].slice(0, QUANTIDADE_LEITURAS))

        if (viaScanner) {
            setUltimoResultadoScanner({ ok, mensagem: `${codigoExibido} — ${mensagem}` })
        } else {
            inputRef.current?.focus()
        }
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        liberarAudio()
        await biparPedido(codigoPedido)
    }

    function handleScan(codigo: string) {
        biparPedido(codigo, true)
    }

    return (
        <div className='flex min-h-screen flex-col bg-linear-to-br from-orange-base/10 via-white to-gray-base/10 dark:bg-dark-bg dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg'>
            {/* no celular os links não cabem numa linha: usa o cabeçalho com menu das outras telas */}
            <SidebarSection mobileOnly />

            <div className='relative flex flex-1 flex-col items-center justify-center gap-4 p-4'>
                <div className='absolute top-4 right-4 hidden items-center gap-4 md:flex'>
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

                    <a
                        href={HUB_URL}
                        className='flex items-center gap-1 text-sm text-gray-dark transition hover:text-gray-text dark:text-dark-text-muted dark:hover:text-dark-text'
                    >
                        <ChevronLeftIcon className='h-4 w-4' />
                        Voltar ao Hub
                    </a>

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
                    <div className='hidden justify-center md:flex'>
                        <Logo />
                    </div>

                    <h1 className='text-center text-lg font-semibold text-gray-text dark:text-dark-text'>Bipar pedido</h1>

                    <form onSubmit={handleSubmit} className='space-y-3'>
                        <div className='flex gap-2'>
                            <Input
                                ref={inputRef}
                                autoFocus
                                {...PROPS_CAMPO_CODIGO}
                                enterKeyHint='send'
                                placeholder='Código do pedido'
                                value={codigoPedido}
                                onChange={(e) => setCodigoPedido(e.target.value)}
                                className='flex-1'
                                required
                            />
                            <button
                                type='button'
                                onClick={() => {
                                    liberarAudio()
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

                    {leituras.length > 0 && (
                        <div className='space-y-2' aria-live='polite'>
                            {/* key muda a cada leitura: o card "pisca" mesmo quando a mensagem é igual à anterior */}
                            <motion.div
                                key={leituras[0].id}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-start gap-3 rounded-md border px-4 py-3 ${
                                    leituras[0].ok
                                        ? 'border-green-base/30 bg-green-base/10 text-green-base'
                                        : 'border-red-base/20 bg-red-base/10 text-red-base'
                                }`}
                            >
                                {leituras[0].ok
                                    ? <CheckCircleIcon className='mt-0.5 h-6 w-6 shrink-0' />
                                    : <XCircleIcon className='mt-0.5 h-6 w-6 shrink-0' />}
                                <div className='min-w-0'>
                                    <p className='truncate font-semibold'>{leituras[0].codigo}</p>
                                    <p className='text-sm'>{leituras[0].mensagem}</p>
                                </div>
                            </motion.div>

                            {leituras.length > 1 && (
                                <ul className='space-y-1 text-xs'>
                                    {leituras.slice(1).map((leitura) => (
                                        <li key={leitura.id} className='flex min-w-0 items-center gap-1.5'>
                                            {leitura.ok
                                                ? <CheckCircleIcon className='h-3.5 w-3.5 shrink-0 text-green-base' />
                                                : <XCircleIcon className='h-3.5 w-3.5 shrink-0 text-red-base' />}
                                            <span className='font-medium text-gray-text dark:text-dark-text'>{leitura.codigo}</span>
                                            <span className='truncate text-gray-dark dark:text-dark-text-muted'>— {leitura.mensagem}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setRankingAberto(true)}
                    className='flex items-center gap-1 text-sm text-orange-base transition hover:text-orange-light md:hidden'
                >
                    <TrophyIcon className='h-4 w-4 origin-center animate-trophy-wiggle' />
                    Ver ranking
                </button>
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

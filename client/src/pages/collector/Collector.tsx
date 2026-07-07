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
import { LogoutIcon, DashboardIcon, TrophyIcon, CameraIcon } from '../../components/icons'

export default function Collector() {
    const [codigoPedido, setCodigoPedido] = useState('')
    const [mensagem, setMensagem] = useState('')
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [scannerAberto, setScannerAberto] = useState(false)
    const [rankingAberto, setRankingAberto] = useState(false)
    const { token, role, logout } = useAuth()

    async function biparPedido(codigo: string) {
        setErro('')
        setMensagem('')
        setEnviando(true)

        try {
            const result = await postOrder({ codigo_pedido: codigo, token: token! })
            setMensagem(result.success ?? 'Pedido bipado com sucesso.')
            setCodigoPedido('')
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao bipar pedido.')
        } finally {
            setEnviando(false)
        }
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        await biparPedido(codigoPedido)
    }

    function handleScan(codigo: string) {
        setScannerAberto(false)
        setCodigoPedido(codigo)
        biparPedido(codigo)
    }

    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-br from-orange-base/10 via-white to-gray-base/10 p-4'>
            <div className='absolute top-4 right-4 flex items-center gap-4'>
                {role === 'ADMIN' && (
                    <Link
                        to='/dashboard'
                        className='flex items-center gap-1 text-sm text-gray-dark transition hover:text-gray-text'
                    >
                        <DashboardIcon className='h-4 w-4' />
                        Voltar ao Dashboard
                    </Link>
                )}
                <button
                    onClick={() => setRankingAberto(true)}
                    className='flex items-center gap-1 text-sm text-gray-dark transition hover:text-gray-text'
                >
                    <TrophyIcon className='h-4 w-4' />
                    Ranking
                </button>
                <button
                    onClick={logout}
                    className='flex items-center gap-1 text-sm text-gray-dark transition hover:text-gray-text'
                >
                    <LogoutIcon className='h-4 w-4' />
                    Sair
                </button>
            </div>

            <div className='w-full max-w-sm space-y-5 rounded-lg bg-white p-8 shadow-sm'>
                <div className='flex justify-center'>
                    <Logo />
                </div>

                <h1 className='text-center text-lg font-semibold text-gray-text'>Bipar pedido</h1>

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
                            onClick={() => setScannerAberto(true)}
                            className='rounded-md border border-gray-base px-3 text-gray-dark transition hover:bg-gray hover:text-orange-base'
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
                    onClose={() => setScannerAberto(false)}
                    onResult={handleScan}
                />
            )}

            <RankingModal open={rankingAberto} onClose={() => setRankingAberto(false)} />
        </div>
    )
}

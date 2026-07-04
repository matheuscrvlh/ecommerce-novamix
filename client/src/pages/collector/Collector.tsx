import { useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { postOrder } from '../../api/orders'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Logo from '../../components/Logo'
import Alert from '../../components/Alert'
import { LogoutIcon, DashboardIcon } from '../../components/icons'

export default function Collector() {
    const [codigoPedido, setCodigoPedido] = useState('')
    const [mensagem, setMensagem] = useState('')
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)
    const { token, role, logout } = useAuth()

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        setErro('')
        setMensagem('')
        setEnviando(true)

        try {
            const result = await postOrder({ codigo_pedido: codigoPedido, token: token! })
            setMensagem(result.success ?? 'Pedido bipado com sucesso.')
            setCodigoPedido('')
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao bipar pedido.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-br from-orange-50 via-white to-teal-50 p-4'>
            <div className='absolute top-4 right-4 flex items-center gap-4'>
                {role === 'ADMIN' && (
                    <Link
                        to='/dashboard'
                        className='flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700'
                    >
                        <DashboardIcon className='h-4 w-4' />
                        Voltar ao Dashboard
                    </Link>
                )}
                <button
                    onClick={logout}
                    className='flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700'
                >
                    <LogoutIcon className='h-4 w-4' />
                    Sair
                </button>
            </div>

            <div className='w-full max-w-sm space-y-5 rounded-lg bg-white p-8 shadow-sm'>
                <div className='flex justify-center'>
                    <Logo />
                </div>

                <h1 className='text-center text-lg font-semibold text-gray-800'>Bipar pedido</h1>

                <form onSubmit={handleSubmit} className='space-y-3'>
                    <Input
                        autoFocus
                        placeholder='Código do pedido'
                        value={codigoPedido}
                        onChange={(e) => setCodigoPedido(e.target.value)}
                        required
                    />

                    <Button type='submit' className='w-full' disabled={enviando}>
                        {enviando ? 'Enviando...' : 'Bipar'}
                    </Button>
                </form>

                {mensagem && (
                    <p className='rounded-md bg-green-50 px-4 py-3 text-sm text-green-600'>{mensagem}</p>
                )}
                {erro && <Alert>{erro}</Alert>}
            </div>
        </div>
    )
}

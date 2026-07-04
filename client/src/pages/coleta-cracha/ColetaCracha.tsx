import { useEffect, useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { getUsuarios, type Usuario } from '../../api/users'
import { postOrderAs } from '../../api/orders'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Logo from '../../components/Logo'
import Alert from '../../components/Alert'
import { DashboardIcon, LogoutIcon } from '../../components/icons'

const SEGUNDOS_SESSAO = 15

type ItemFeed = {
    codigo: string
    ok: boolean
    mensagem: string
}

export default function ColetaCracha() {
    const { token, logout } = useAuth()

    const [crachaInput, setCrachaInput] = useState('')
    const [erroCracha, setErroCracha] = useState('')
    const [buscando, setBuscando] = useState(false)

    const [sessao, setSessao] = useState<Usuario | null>(null)
    const [restante, setRestante] = useState(SEGUNDOS_SESSAO)
    const [pedidoInput, setPedidoInput] = useState('')
    const [feed, setFeed] = useState<ItemFeed[]>([])

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

    async function handleCrachaSubmit(event: SubmitEvent) {
        event.preventDefault()
        setErroCracha('')
        setBuscando(true)

        try {
            const usuarios = await getUsuarios(token!)
            const encontrado = usuarios.find(
                (usuario) => usuario.cracha === crachaInput.trim() && usuario.status
            )

            if (!encontrado) {
                setErroCracha('Crachá não encontrado ou usuário inativo.')
            } else {
                setSessao(encontrado)
                setRestante(SEGUNDOS_SESSAO)
                setCrachaInput('')
            }
        } catch (error) {
            setErroCracha(error instanceof Error ? error.message : 'Erro ao buscar crachá.')
        } finally {
            setBuscando(false)
        }
    }

    async function handlePedidoSubmit(event: SubmitEvent) {
        event.preventDefault()
        if (!sessao) return

        setRestante(SEGUNDOS_SESSAO)
        const codigo = pedidoInput
        setPedidoInput('')

        try {
            const result = await postOrderAs({ codigo_pedido: codigo, cracha: sessao.cracha!, token: token! })
            setFeed((atual) => [{ codigo, ok: true, mensagem: result.success ?? 'Bipado com sucesso.' }, ...atual])
        } catch (error) {
            setFeed((atual) => [
                { codigo, ok: false, mensagem: error instanceof Error ? error.message : 'Erro ao bipar.' },
                ...atual
            ])
        }
    }

    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-br from-orange-50 via-white to-teal-50 p-4'>
            <div className='absolute top-4 right-4 flex items-center gap-4'>
                <Link
                    to='/dashboard'
                    className='flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700'
                >
                    <DashboardIcon className='h-4 w-4' />
                    Voltar ao Dashboard
                </Link>
                <button
                    onClick={logout}
                    className='flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700'
                >
                    <LogoutIcon className='h-4 w-4' />
                    Sair
                </button>
            </div>

            <div className='flex justify-center'>
                <Logo />
            </div>

            {!sessao && (
                <form onSubmit={handleCrachaSubmit} className='w-full max-w-sm space-y-4 rounded-lg bg-white p-8 shadow-sm'>
                    <h1 className='text-center text-lg font-semibold text-gray-800'>Coleta por Crachá</h1>
                    <p className='text-center text-sm text-gray-400'>
                        Bipe ou digite seu crachá pra começar a conferir pedidos
                    </p>

                    <Input
                        autoFocus
                        placeholder='Crachá'
                        value={crachaInput}
                        onChange={(e) => setCrachaInput(e.target.value)}
                        required
                    />

                    {erroCracha && <Alert>{erroCracha}</Alert>}

                    <Button type='submit' className='w-full' disabled={buscando}>
                        {buscando ? 'Verificando...' : 'Entrar'}
                    </Button>
                </form>
            )}

            {sessao && (
                <div className='w-full max-w-sm space-y-4 rounded-lg bg-white p-8 shadow-sm'>
                    <div className='text-center'>
                        <h1 className='text-lg font-semibold text-gray-800'>Olá, {sessao.nome}!</h1>
                        <p className='text-sm text-gray-400'>Bipe os pedidos que quiser conferir</p>
                    </div>

                    <div className='h-2 w-full overflow-hidden rounded-full bg-gray-100'>
                        <div
                            className='h-2 rounded-full bg-orange-500 transition-all duration-1000 ease-linear'
                            style={{ width: `${(restante / SEGUNDOS_SESSAO) * 100}%` }}
                        />
                    </div>
                    <p className='text-center text-xs text-gray-400'>
                        Sessão encerra em {restante}s de inatividade
                    </p>

                    <form onSubmit={handlePedidoSubmit}>
                        <Input
                            autoFocus
                            placeholder='Código do pedido'
                            value={pedidoInput}
                            onChange={(e) => setPedidoInput(e.target.value)}
                            required
                        />
                    </form>

                    {feed.length > 0 && (
                        <ul className='max-h-48 space-y-1 overflow-y-auto text-sm'>
                            {feed.map((item, index) => (
                                <li
                                    key={`${item.codigo}-${index}`}
                                    className={item.ok ? 'text-green-600' : 'text-red-600'}
                                >
                                    {item.codigo} — {item.mensagem}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

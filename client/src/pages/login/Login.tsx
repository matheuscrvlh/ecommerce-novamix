import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Logo from '../../components/Logo'
import Alert from '../../components/Alert'

export default function Login() {
    const [login, setLogin] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)
    const { login: authLogin } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        setErro('')
        setEnviando(true)

        try {
            const result = await auth({ login, senha })
            authLogin(result.token)
            navigate('/dashboard')
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao efetuar login.')
            setEnviando(false)
        }
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 via-white to-teal-50 p-4'>
            <form onSubmit={handleSubmit} className='w-full max-w-sm space-y-5 rounded-lg bg-white p-8 shadow-sm'>
                <div className='flex justify-center'>
                    <Logo />
                </div>

                <h1 className='text-center text-lg font-semibold text-gray-800'>Entrar no sistema</h1>

                <div className='space-y-3'>
                    <Input
                        placeholder='Login'
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                    <Input
                        type='password'
                        placeholder='Senha'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                {erro && <Alert>{erro}</Alert>}

                <Button type='submit' className='w-full' disabled={enviando}>
                    {enviando ? 'Entrando...' : 'Entrar'}
                </Button>
            </form>
        </div>
    )
}

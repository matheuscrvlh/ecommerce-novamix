import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Alert from '../../components/Alert'
import Footer from '../../components/Footer'
import bannerLogin from '../../assets/banners/bannerLogin.jpeg'
import logoNm from '../../assets/logos/logo-nm.jpeg'

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
        <main className='w-full min-h-screen flex relative overflow-hidden'>
            <img
                src={bannerLogin}
                alt='Banner Novamix'
                className='absolute inset-0 w-full h-full object-cover'
            />

            <form
                onSubmit={handleSubmit}
                className='bg-white w-[90%] max-w-95 mx-auto my-auto flex flex-col gap-3 p-6
                           justify-center rounded-xl shadow-2xl relative z-10
                           md:w-105 md:max-w-105 md:absolute md:right-[8%]
                           md:top-1/2 md:-translate-y-1/2 md:mx-0
                           lg:right-[10%]'
            >
                <img src={logoNm} alt='Logo Novamix' className='w-[45%] max-w-35 mx-auto mb-3' />

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

                {erro && <Alert>{erro}</Alert>}

                <Button type='submit' className='w-full mt-2' disabled={enviando}>
                    {enviando ? 'Entrando...' : 'Entrar'}
                </Button>

                <Footer stacked />
            </form>
        </main>
    )
}

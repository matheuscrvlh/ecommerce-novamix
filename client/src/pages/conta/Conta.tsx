import { useEffect, useState, type SubmitEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getMeuUsuario, updateMe, updateMyPassword, type Usuario } from '../../api/users'
import { getRanking } from '../../api/orders'
import SidebarSection from '../../sections/SidebarSection'
import PageHeaderSection from '../../sections/PageHeaderSection'
import UserPasswordModal from '../../sections/users/UserPasswordModal'
import UserQrCodeModal from '../../sections/users/UserQrCodeModal'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Alert from '../../components/Alert'
import Footer from '../../components/Footer'
import Badge from '../../components/Badge'
import Skeleton from '../../components/Skeleton'
import ThemeToggle from '../../components/ThemeToggle'
import { UserAvatarIcon, QrCodeIcon, LockIcon } from '../../components/icons'

function hojeISO() {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

export default function Conta() {
    const { token } = useAuth()

    const [perfil, setPerfil] = useState<Usuario | null>(null)
    const [carregandoPerfil, setCarregandoPerfil] = useState(true)
    const [erroPerfil, setErroPerfil] = useState('')

    const [totalColetados, setTotalColetados] = useState<number | null>(null)
    const [totalHoje, setTotalHoje] = useState<number | null>(null)

    const [nome, setNome] = useState('')
    const [login, setLogin] = useState('')
    const [erroSalvar, setErroSalvar] = useState('')
    const [sucessoSalvar, setSucessoSalvar] = useState('')
    const [salvando, setSalvando] = useState(false)

    const [senhaModalAberto, setSenhaModalAberto] = useState(false)
    const [qrAberto, setQrAberto] = useState(false)

    useEffect(() => {
        if (!token) return

        let cancelado = false

        getMeuUsuario(token)
            .then((result) => {
                if (cancelado) return
                setPerfil(result)
                setNome(result.nome)
                setLogin(result.login)
                setCarregandoPerfil(false)
            })
            .catch((error) => {
                if (cancelado) return
                setErroPerfil(error instanceof Error ? error.message : 'Erro ao buscar perfil.')
                setCarregandoPerfil(false)
            })

        return () => {
            cancelado = true
        }
    }, [token])

    useEffect(() => {
        if (!token || !perfil) return

        let cancelado = false
        const hoje = hojeISO()

        Promise.all([
            getRanking({
                dataInicial: '2000-01-01T00:00:00',
                dataFinal: `${hoje}T23:59:59.999`,
                token
            }),
            getRanking({
                dataInicial: `${hoje}T00:00:00`,
                dataFinal: `${hoje}T23:59:59.999`,
                token
            })
        ])
            .then(([resultadoTotal, resultadoHoje]) => {
                if (cancelado) return
                const meuTotal = resultadoTotal.find((item) => item.id === perfil.id)
                const meuHoje = resultadoHoje.find((item) => item.id === perfil.id)
                setTotalColetados(meuTotal ? Number(meuTotal.count) : 0)
                setTotalHoje(meuHoje ? Number(meuHoje.count) : 0)
            })
            .catch(() => {
                if (cancelado) return
                setTotalColetados(0)
                setTotalHoje(0)
            })

        return () => {
            cancelado = true
        }
    }, [token, perfil])

    async function handleSalvar(event: SubmitEvent) {
        event.preventDefault()
        setErroSalvar('')
        setSucessoSalvar('')
        setSalvando(true)

        try {
            await updateMe({ nome, login, token: token! })
            setSucessoSalvar('Dados atualizados com sucesso.')
            setPerfil((atual) => (atual ? { ...atual, nome, login } : atual))
        } catch (error) {
            setErroSalvar(error instanceof Error ? error.message : 'Erro ao salvar dados.')
        } finally {
            setSalvando(false)
        }
    }

    async function handleTrocarSenha(novaSenha: string) {
        await updateMyPassword({ novaSenha, token: token! })
    }

    return (
        <div className='flex min-h-screen flex-col bg-gray md:flex-row dark:bg-dark-bg'>
            <SidebarSection />

            <main className='flex-1 space-y-6 p-4 sm:p-8'>
                <PageHeaderSection title='Minha Conta' action={<ThemeToggle className='hidden md:block' />} />

                {erroPerfil && <Alert>{erroPerfil}</Alert>}

                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <section className='rounded-lg bg-white p-6 shadow-sm md:col-span-1 dark:bg-dark-surface'>
                        <div className='flex flex-col items-center gap-3 text-center'>
                            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gray text-gray-dark dark:bg-dark-surface-2 dark:text-dark-text-muted'>
                                <UserAvatarIcon className='h-12 w-12' />
                            </div>

                            {carregandoPerfil ? (
                                <Skeleton className='h-5 w-32' />
                            ) : (
                                <>
                                    <p className='text-lg font-semibold text-gray-text dark:text-dark-text'>{perfil?.nome}</p>
                                    <Badge color={perfil?.role === 'ADMIN' ? 'teal' : 'orange'}>
                                        {perfil?.role === 'ADMIN' ? 'Administrador' : 'Operador'}
                                    </Badge>
                                </>
                            )}

                            {perfil?.criado_em && (
                                <p className='text-xs text-gray-dark dark:text-dark-text-muted'>
                                    Membro desde {new Date(perfil.criado_em).toLocaleDateString('pt-BR')}
                                </p>
                            )}
                        </div>

                        <div className='mt-6 flex flex-col gap-2'>
                            <Button
                                variant='ghost'
                                className='flex items-center justify-center gap-2'
                                onClick={() => setSenhaModalAberto(true)}
                                disabled={carregandoPerfil}
                            >
                                <LockIcon />
                                Alterar senha
                            </Button>
                            <Button
                                variant='ghost'
                                className='flex items-center justify-center gap-2'
                                onClick={() => setQrAberto(true)}
                                disabled={carregandoPerfil || !perfil?.cracha}
                            >
                                <QrCodeIcon />
                                Imprimir meu crachá
                            </Button>
                        </div>
                    </section>

                    <section className='rounded-lg bg-white p-6 shadow-sm md:col-span-2 dark:bg-dark-surface'>
                        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                            <div>
                                <h2 className='mb-1 text-xs font-semibold tracking-wide text-gray-dark uppercase dark:text-dark-text-muted'>
                                    Bipados hoje
                                </h2>
                                {totalHoje === null ? (
                                    <Skeleton className='h-10 w-24' />
                                ) : (
                                    <p className='text-4xl font-bold text-orange-base'>{totalHoje}</p>
                                )}
                                <p className='mt-1 text-xs text-gray-dark dark:text-dark-text-muted'>pedidos bipados hoje</p>
                            </div>

                            <div>
                                <h2 className='mb-1 text-xs font-semibold tracking-wide text-gray-dark uppercase dark:text-dark-text-muted'>
                                    Total coletado
                                </h2>
                                {totalColetados === null ? (
                                    <Skeleton className='h-10 w-24' />
                                ) : (
                                    <p className='text-4xl font-bold text-orange-base'>{totalColetados}</p>
                                )}
                                <p className='mt-1 text-xs text-gray-dark dark:text-dark-text-muted'>pedidos bipados no total</p>
                            </div>
                        </div>

                        <div className='mt-6 border-t border-gray pt-6 dark:border-dark-border'>
                            <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-dark uppercase dark:text-dark-text-muted'>
                                Editar meus dados
                            </h2>

                            {carregandoPerfil ? (
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                    <Skeleton className='h-9 w-full' />
                                    <Skeleton className='h-9 w-full' />
                                </div>
                            ) : (
                                <form onSubmit={handleSalvar} className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                    <Input placeholder='Nome' value={nome} onChange={(e) => setNome(e.target.value)} required />
                                    <Input placeholder='Login' value={login} onChange={(e) => setLogin(e.target.value)} required />

                                    {erroSalvar && (
                                        <div className='sm:col-span-2'>
                                            <Alert>{erroSalvar}</Alert>
                                        </div>
                                    )}
                                    {sucessoSalvar && (
                                        <p className='rounded-md bg-green-base/10 px-4 py-3 text-sm text-green-base sm:col-span-2'>
                                            {sucessoSalvar}
                                        </p>
                                    )}

                                    <div className='sm:col-span-2'>
                                        <Button type='submit' disabled={salvando}>
                                            {salvando ? 'Salvando...' : 'Salvar'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </section>
                </div>

                <Footer />
            </main>

            <UserPasswordModal
                usuario={senhaModalAberto ? perfil : null}
                onClose={() => setSenhaModalAberto(false)}
                onSubmit={handleTrocarSenha}
            />

            <UserQrCodeModal usuario={qrAberto ? perfil : null} onClose={() => setQrAberto(false)} />
        </div>
    )
}

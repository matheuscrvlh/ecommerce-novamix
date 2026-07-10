import { useState } from 'react'
import { createUsuario, deleteUsuario, updateUsuario, updatePassword, type Usuario } from '../../api/users'
import { useAuth } from '../../hooks/useAuth'
import { useUsuarios } from '../../hooks/useUsuarios'
import SidebarSection from '../../sections/SidebarSection'
import PageHeaderSection from '../../sections/PageHeaderSection'
import UserFormSection, { type UsuarioFormValues } from '../../sections/users/UserFormSection'
import UsersTableSection from '../../sections/users/UsersTableSection'
import UsersFilterSection, { type FiltroCargo, type FiltroStatus } from '../../sections/users/UsersFilterSection'
import UserQrCodeModal from '../../sections/users/UserQrCodeModal'
import UserPasswordModal from '../../sections/users/UserPasswordModal'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import Modal from '../../components/Modal'
import Footer from '../../components/Footer'
import ThemeToggle from '../../components/ThemeToggle'
import { PlusIcon } from '../../components/icons'

export default function Users() {
    const { token } = useAuth()
    const { usuarios, carregando, recarregar } = useUsuarios()
    const [erro, setErro] = useState('')

    const [editando, setEditando] = useState<Usuario | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [excluindo, setExcluindo] = useState<Usuario | null>(null)
    const [qrUsuario, setQrUsuario] = useState<Usuario | null>(null)
    const [senhaUsuario, setSenhaUsuario] = useState<Usuario | null>(null)
    const [filtroCargo, setFiltroCargo] = useState<FiltroCargo>('TODOS')
    const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('ATIVOS')

    function abrirCriacao() {
        setEditando(null)
        setModalAberto(true)
    }

    function abrirEdicao(usuario: Usuario) {
        setEditando(usuario)
        setModalAberto(true)
    }

    async function handleCreate(values: UsuarioFormValues) {
        await createUsuario({
            nome: values.nome,
            login: values.login,
            senha: values.senha!,
            role: values.role,
            cracha: values.cracha,
            token: token!
        })
        setModalAberto(false)
        recarregar()
    }

    async function handleUpdate(values: UsuarioFormValues) {
        await updateUsuario({
            id: editando!.id,
            nome: values.nome,
            login: values.login,
            role: values.role,
            cracha: values.cracha,
            status: values.status,
            token: token!
        })
        setModalAberto(false)
        setEditando(null)
        recarregar()
    }

    async function handleUpdatePassword(novaSenha: string) {
        await updatePassword({ idUsuario: senhaUsuario!.id, novaSenha, token: token! })
    }

    const usuariosFiltrados = usuarios.filter((usuario) => {
        const passaCargo = filtroCargo === 'TODOS' || usuario.role === filtroCargo
        const passaStatus =
            filtroStatus === 'TODOS' ||
            (filtroStatus === 'ATIVOS' ? usuario.status : !usuario.status)

        return passaCargo && passaStatus
    })

    async function confirmarExclusao() {
        if (!excluindo) return

        try {
            await deleteUsuario(excluindo.id, token!)
            setExcluindo(null)
            recarregar()
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao excluir usuário.')
            setExcluindo(null)
        }
    }

    return (
        <div className='flex min-h-screen flex-col bg-gray md:flex-row dark:bg-dark-bg'>
            <SidebarSection />

            <main className='flex-1 space-y-6 p-4 sm:p-8'>
                <PageHeaderSection title='Usuários' action={<ThemeToggle className='hidden md:block' />} />

                <div className='flex justify-end'>
                    <Button className='flex items-center gap-2' onClick={abrirCriacao}>
                        <PlusIcon />
                        Novo usuário
                    </Button>
                </div>

                {erro && <Alert>{erro}</Alert>}

                <UsersFilterSection
                    filtroCargo={filtroCargo}
                    onFiltroCargoChange={setFiltroCargo}
                    filtroStatus={filtroStatus}
                    onFiltroStatusChange={setFiltroStatus}
                />

                <UsersTableSection
                    usuarios={usuariosFiltrados}
                    carregando={carregando}
                    onEdit={abrirEdicao}
                    onDelete={setExcluindo}
                    onShowQrCode={setQrUsuario}
                    onChangePassword={setSenhaUsuario}
                />

                <Footer />
            </main>

            <UserQrCodeModal usuario={qrUsuario} onClose={() => setQrUsuario(null)} />

            <UserPasswordModal
                usuario={senhaUsuario}
                onClose={() => setSenhaUsuario(null)}
                onSubmit={handleUpdatePassword}
            />

            <Modal
                open={modalAberto}
                onClose={() => setModalAberto(false)}
                title={editando ? `Editar usuário — ${editando.nome}` : 'Novo usuário'}
            >
                <UserFormSection
                    key={editando?.id ?? 'novo'}
                    mode={editando ? 'edit' : 'create'}
                    initialValues={editando ? { ...editando, cracha: editando.cracha ?? '' } : undefined}
                    onSubmit={editando ? handleUpdate : handleCreate}
                />
            </Modal>

            <Modal
                open={excluindo !== null}
                onClose={() => setExcluindo(null)}
                title='Excluir usuário'
            >
                <p className='mb-4 text-sm text-gray-text dark:text-dark-text'>
                    Tem certeza que deseja excluir <strong>{excluindo?.nome}</strong>? Essa ação não pode ser desfeita.
                </p>
                <div className='flex justify-end gap-2'>
                    <Button variant='ghost' onClick={() => setExcluindo(null)}>Cancelar</Button>
                    <Button variant='danger' onClick={confirmarExclusao}>Excluir</Button>
                </div>
            </Modal>
        </div>
    )
}

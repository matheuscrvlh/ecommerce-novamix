import { useState } from 'react'
import type { Usuario } from '../../api/users'
import { useUsuarios } from '../../hooks/useUsuarios'
import SidebarSection from '../../sections/SidebarSection'
import PageHeaderSection from '../../sections/PageHeaderSection'
import UsersTableSection from '../../sections/users/UsersTableSection'
import UsersFilterSection, { type FiltroCargo, type FiltroStatus } from '../../sections/users/UsersFilterSection'
import UserQrCodeModal from '../../sections/users/UserQrCodeModal'
import Alert from '../../components/Alert'
import Footer from '../../components/Footer'
import ThemeToggle from '../../components/ThemeToggle'

export default function Users() {
    const { usuarios, carregando, erro } = useUsuarios()

    const [qrUsuario, setQrUsuario] = useState<Usuario | null>(null)
    const [filtroCargo, setFiltroCargo] = useState<FiltroCargo>('TODOS')
    const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('ATIVOS')

    const usuariosFiltrados = usuarios.filter((usuario) => {
        const passaCargo = filtroCargo === 'TODOS' || usuario.role === filtroCargo
        const passaStatus =
            filtroStatus === 'TODOS' ||
            (filtroStatus === 'ATIVOS' ? usuario.status : !usuario.status)

        return passaCargo && passaStatus
    })

    return (
        <div className='flex min-h-screen flex-col bg-gray md:flex-row dark:bg-dark-bg'>
            <SidebarSection />

            <main className='flex-1 space-y-6 p-4 sm:p-8'>
                <PageHeaderSection title='Usuários' action={<ThemeToggle className='hidden md:block' />} />

                <p className='text-sm text-gray-dark dark:text-dark-text-muted'>
                    Quem entra aqui e vira ADMIN ou OPERADOR é definido no hub-novamix (login, cargo e permissão do módulo "ecommerce"). Essa tela é só consulta.
                </p>

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
                    onShowQrCode={setQrUsuario}
                />

                <Footer />
            </main>

            <UserQrCodeModal usuario={qrUsuario} onClose={() => setQrUsuario(null)} />
        </div>
    )
}

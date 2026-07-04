import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import SidebarLink from '../components/SidebarLink'
import Button from '../components/Button'
import { DashboardIcon, UsersIcon, PackageIcon, BadgeIcon, LogoutIcon, MenuIcon, CloseIcon } from '../components/icons'
import { useAuth } from '../hooks/useAuth'

export default function SidebarSection() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <>
            <div className='flex items-center justify-between border-b border-gray-100 bg-white p-4 md:hidden'>
                <Logo compact />
                <button onClick={() => setOpen(true)} className='text-gray-500'>
                    <MenuIcon className='h-6 w-6' />
                </button>
            </div>

            {open && (
                <div className='fixed inset-0 z-40 bg-black/40 md:hidden' onClick={() => setOpen(false)} />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white transition-transform md:static md:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='flex items-center justify-between'>
                    <Logo />
                    <button onClick={() => setOpen(false)} className='mr-4 text-gray-400 md:hidden'>
                        <CloseIcon className='h-5 w-5' />
                    </button>
                </div>

                <nav className='flex flex-1 flex-col gap-1 px-4'>
                    <SidebarLink to='/dashboard' icon={<DashboardIcon className='h-5 w-5' />}>
                        Dashboard
                    </SidebarLink>
                    <SidebarLink to='/usuarios' icon={<UsersIcon className='h-5 w-5' />}>
                        Usuários
                    </SidebarLink>
                    <SidebarLink to='/collector' icon={<PackageIcon className='h-5 w-5' />}>
                        Bipar
                    </SidebarLink>
                    <SidebarLink to='/coleta-cracha' icon={<BadgeIcon className='h-5 w-5' />}>
                        Coleta por Crachá
                    </SidebarLink>
                </nav>

                <div className='p-4'>
                    <Button
                        variant='danger'
                        className='flex w-full items-center justify-center gap-2'
                        onClick={handleLogout}
                    >
                        <LogoutIcon className='h-4 w-4' />
                        Sair
                    </Button>
                </div>
            </aside>
        </>
    )
}

import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

type SidebarLinkProps = {
    to: string
    icon?: ReactNode
    children: ReactNode
}

export default function SidebarLink({ to, icon, children }: SidebarLinkProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
            }
        >
            {icon}
            {children}
        </NavLink>
    )
}

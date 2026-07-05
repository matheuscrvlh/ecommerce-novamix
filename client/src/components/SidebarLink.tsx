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
                    isActive ? 'bg-orange-base text-white' : 'text-gray-text hover:bg-gray'
                }`
            }
        >
            {icon}
            {children}
        </NavLink>
    )
}

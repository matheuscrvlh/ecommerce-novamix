import type { ReactNode } from 'react'

type BadgeProps = {
    children: ReactNode
    color?: 'green' | 'red' | 'orange' | 'teal' | 'gray'
}

const colors = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    teal: 'bg-teal-50 text-teal-600',
    gray: 'bg-gray-100 text-gray-600'
}

export default function Badge({ children, color = 'gray' }: BadgeProps) {
    return (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
            {children}
        </span>
    )
}

import type { ReactNode } from 'react'

type BadgeProps = {
    children: ReactNode
    color?: 'green' | 'red' | 'orange' | 'teal' | 'gray'
}

const colors = {
    green: 'bg-green-base/10 text-green-base',
    red: 'bg-red-base/10 text-red-base',
    orange: 'bg-orange-base/10 text-orange-base',
    teal: 'bg-gray-base/10 text-gray-base',
    gray: 'bg-gray text-gray-text dark:bg-dark-surface-2 dark:text-dark-text'
}

export default function Badge({ children, color = 'gray' }: BadgeProps) {
    return (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
            {children}
        </span>
    )
}

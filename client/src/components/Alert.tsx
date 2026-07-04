import type { ReactNode } from 'react'

type AlertProps = {
    children: ReactNode
    variant?: 'error' | 'info'
}

const variants = {
    error: 'bg-red-50 text-red-600 border-red-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100'
}

export default function Alert({ children, variant = 'error' }: AlertProps) {
    return (
        <div className={`rounded-md border px-4 py-3 text-sm ${variants[variant]}`}>
            {children}
        </div>
    )
}

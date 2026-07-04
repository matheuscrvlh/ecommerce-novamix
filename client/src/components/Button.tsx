import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'danger' | 'ghost'
}

const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100'
}

export default function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
    return (
        <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

import type { SelectHTMLAttributes } from 'react'

export default function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${className}`}
            {...props}
        >
            {children}
        </select>
    )
}

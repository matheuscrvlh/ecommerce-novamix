import type { SelectHTMLAttributes } from 'react'

export default function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={`w-full rounded-md border border-gray-base bg-white px-3 py-2 text-sm text-gray-text outline-none focus:border-orange-base focus:ring-1 focus:ring-orange-base dark:border-dark-border dark:bg-dark-surface-2 dark:text-dark-text ${className}`}
            {...props}
        >
            {children}
        </select>
    )
}

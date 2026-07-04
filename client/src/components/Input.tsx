import type { InputHTMLAttributes } from 'react'

export default function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${className}`}
            {...props}
        />
    )
}

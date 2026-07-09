import type { ReactNode } from 'react'

type StatCardProps = {
    label: string
    value: number | string
    color?: 'orange' | 'green' | 'red' | 'teal'
    icon?: ReactNode
}

const colors = {
    orange: { text: 'text-orange-base', bg: 'bg-orange-base/10' },
    green: { text: 'text-green-base', bg: 'bg-green-base/10' },
    red: { text: 'text-red-base', bg: 'bg-red-base/10' },
    teal: { text: 'text-gray-base', bg: 'bg-gray-base/10' }
}

export default function StatCard({ label, value, color = 'orange', icon }: StatCardProps) {
    const palette = colors[color]

    return (
        <div className='rounded-lg bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-dark-surface'>
            <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold tracking-wide text-gray-dark uppercase dark:text-dark-text-muted'>{label}</span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${palette.bg} ${palette.text}`}>
                    {icon}
                </span>
            </div>
            <p className={`mt-3 text-3xl font-bold ${palette.text}`}>{value}</p>
        </div>
    )
}

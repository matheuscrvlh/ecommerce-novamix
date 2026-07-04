import type { ReactNode } from 'react'

type StatCardProps = {
    label: string
    value: number | string
    color?: 'orange' | 'green' | 'red' | 'teal'
    icon?: ReactNode
}

const colors = {
    orange: { text: 'text-orange-600', bg: 'bg-orange-50' },
    green: { text: 'text-green-600', bg: 'bg-green-50' },
    red: { text: 'text-red-600', bg: 'bg-red-50' },
    teal: { text: 'text-teal-600', bg: 'bg-teal-50' }
}

export default function StatCard({ label, value, color = 'orange', icon }: StatCardProps) {
    const palette = colors[color]

    return (
        <div className='rounded-lg bg-white p-5 shadow-sm transition hover:shadow-md'>
            <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold tracking-wide text-gray-400 uppercase'>{label}</span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${palette.bg} ${palette.text}`}>
                    {icon}
                </span>
            </div>
            <p className={`mt-3 text-3xl font-bold ${palette.text}`}>{value}</p>
        </div>
    )
}

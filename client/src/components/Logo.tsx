type LogoProps = {
    compact?: boolean
}

export default function Logo({ compact = false }: LogoProps) {
    return (
        <div className={`flex items-center gap-2 ${compact ? '' : 'px-6 py-6'}`}>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-teal-600 text-lg font-bold text-white'>
                N
            </div>
            <span className='text-lg font-semibold text-gray-800'>Novamix</span>
        </div>
    )
}

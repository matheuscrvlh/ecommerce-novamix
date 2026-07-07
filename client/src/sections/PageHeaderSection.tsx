type PageHeaderSectionProps = {
    title: string
    subtitle?: string
}

export default function PageHeaderSection({ title, subtitle }: PageHeaderSectionProps) {
    const hoje = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })

    return (
        <header className='mb-6'>
            <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-bold text-orange-base'>{title}</h1>
                <span className='text-xs text-gray-dark capitalize sm:text-sm'>{subtitle ?? hoje}</span>
            </div>
            <div className='mt-3 h-0.5 w-full bg-linear-to-r from-orange-base to-gray-base' />
        </header>
    )
}

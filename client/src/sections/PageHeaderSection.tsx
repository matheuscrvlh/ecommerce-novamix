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
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-orange-600'>{title}</h1>
                <span className='text-sm text-gray-400 capitalize'>{subtitle ?? hoje}</span>
            </div>
            <div className='mt-3 h-0.5 w-full bg-linear-to-r from-orange-500 to-teal-600' />
        </header>
    )
}

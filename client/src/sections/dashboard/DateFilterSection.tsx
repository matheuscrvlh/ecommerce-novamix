import type { SubmitEvent } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { CalendarIcon } from '../../components/icons'

type DateFilterSectionProps = {
    dataInicial: string
    dataFinal: string
    onDataInicialChange: (value: string) => void
    onDataFinalChange: (value: string) => void
    onSubmit: (event: SubmitEvent) => void
    className?: string
}

export default function DateFilterSection({
    dataInicial,
    dataFinal,
    onDataInicialChange,
    onDataFinalChange,
    onSubmit,
    className = ''
}: DateFilterSectionProps) {
    return (
        <form
            onSubmit={onSubmit}
            className={`flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-dark-surface ${className}`}
        >
            <div className='flex shrink-0 items-center gap-2 text-gray-dark dark:text-dark-text-muted'>
                <CalendarIcon className='h-4 w-4' />
                <span className='text-xs font-semibold tracking-wide uppercase'>Período</span>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
                <div className='w-40'>
                    <Input
                        type='date'
                        value={dataInicial}
                        max={dataFinal}
                        onChange={(e) => onDataInicialChange(e.target.value)}
                        required
                    />
                </div>
                <span className='text-xs text-gray-dark dark:text-dark-text-muted'>até</span>
                <div className='w-40'>
                    <Input
                        type='date'
                        value={dataFinal}
                        min={dataInicial}
                        onChange={(e) => onDataFinalChange(e.target.value)}
                        required
                    />
                </div>
            </div>

            <Button type='submit' className='shrink-0'>
                Filtrar
            </Button>
        </form>
    )
}

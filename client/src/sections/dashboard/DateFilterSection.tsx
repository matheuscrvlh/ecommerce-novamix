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
            className={`flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm ${className}`}
        >
            <div className='flex items-center gap-2 pb-2 text-gray-dark'>
                <CalendarIcon className='h-4 w-4' />
                <span className='text-xs font-semibold tracking-wide uppercase'>Período</span>
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-gray-dark'>De</label>
                <Input
                    type='date'
                    value={dataInicial}
                    max={dataFinal}
                    onChange={(e) => onDataInicialChange(e.target.value)}
                    required
                />
            </div>
            <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-gray-dark'>Até</label>
                <Input
                    type='date'
                    value={dataFinal}
                    min={dataInicial}
                    onChange={(e) => onDataFinalChange(e.target.value)}
                    required
                />
            </div>
            <Button type='submit'>Filtrar</Button>
        </form>
    )
}

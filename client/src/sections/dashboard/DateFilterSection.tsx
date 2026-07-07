import type { SubmitEvent } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'

type DateFilterSectionProps = {
    dataInicial: string
    dataFinal: string
    onDataInicialChange: (value: string) => void
    onDataFinalChange: (value: string) => void
    onSubmit: (event: SubmitEvent) => void
}

export default function DateFilterSection({
    dataInicial,
    dataFinal,
    onDataInicialChange,
    onDataFinalChange,
    onSubmit
}: DateFilterSectionProps) {
    return (
        <form onSubmit={onSubmit} className='mb-6 flex flex-wrap items-end gap-3 rounded-lg bg-white p-4 shadow-sm'>
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

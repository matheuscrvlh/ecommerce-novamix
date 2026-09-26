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
    // aplica um atalho (Hoje, Ontem...) direto, sem precisar clicar em Filtrar
    onAplicarPeriodo?: (dataInicial: string, dataFinal: string) => void
    className?: string
}

function diaISO(data: Date) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

function listarAtalhos() {
    const hoje = new Date()
    const diasAtras = (dias: number) => diaISO(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - dias))

    return [
        { label: 'Hoje', inicio: diasAtras(0), fim: diasAtras(0) },
        { label: 'Ontem', inicio: diasAtras(1), fim: diasAtras(1) },
        { label: '7 dias', inicio: diasAtras(6), fim: diasAtras(0) },
        { label: 'Este mês', inicio: diaISO(new Date(hoje.getFullYear(), hoje.getMonth(), 1)), fim: diasAtras(0) }
    ]
}

export default function DateFilterSection({
    dataInicial,
    dataFinal,
    onDataInicialChange,
    onDataFinalChange,
    onSubmit,
    onAplicarPeriodo,
    className = ''
}: DateFilterSectionProps) {
    return (
        // @container: o layout segue a largura do card (no modal do ranking ele é estreito mesmo no desktop)
        <form
            onSubmit={onSubmit}
            className={`@container rounded-lg bg-white p-4 shadow-sm dark:bg-dark-surface ${className}`}
        >
            <div className='flex flex-wrap items-center gap-3'>
                <div className='flex shrink-0 items-center gap-2 text-gray-dark dark:text-dark-text-muted'>
                    <CalendarIcon className='h-4 w-4' />
                    <span className='text-xs font-semibold tracking-wide uppercase'>Período</span>
                </div>

                {onAplicarPeriodo && (
                    <div className='flex flex-wrap gap-1'>
                        {listarAtalhos().map((atalho) => {
                            const ativo = atalho.inicio === dataInicial && atalho.fim === dataFinal

                            return (
                                <button
                                    key={atalho.label}
                                    type='button'
                                    onClick={() => onAplicarPeriodo(atalho.inicio, atalho.fim)}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                        ativo
                                            ? 'bg-orange-base text-white'
                                            : 'text-gray-dark hover:bg-gray dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                    }`}
                                >
                                    {atalho.label}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* muito estreito (ex.: ranking no iPhone SE) as duas datas não cabem lado a lado: empilha */}
                <div className='flex w-full flex-col gap-2 @xs:flex-row @xs:items-center @2xl:w-auto'>
                    <Input
                        type='date'
                        value={dataInicial}
                        max={dataFinal}
                        onChange={(e) => onDataInicialChange(e.target.value)}
                        className='min-w-0 flex-1 @2xl:w-40 @2xl:flex-none'
                        required
                    />
                    <span className='hidden text-xs text-gray-dark @xs:inline dark:text-dark-text-muted'>até</span>
                    <Input
                        type='date'
                        value={dataFinal}
                        min={dataInicial}
                        onChange={(e) => onDataFinalChange(e.target.value)}
                        className='min-w-0 flex-1 @2xl:w-40 @2xl:flex-none'
                        required
                    />
                </div>

                <Button type='submit' className='w-full shrink-0 @2xl:w-auto'>
                    Filtrar
                </Button>
            </div>
        </form>
    )
}

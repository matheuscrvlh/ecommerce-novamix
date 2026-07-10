export type FiltroCargo = 'TODOS' | 'ADMIN' | 'OPERADOR'
export type FiltroStatus = 'ATIVOS' | 'INATIVOS' | 'TODOS'

type UsersFilterSectionProps = {
    filtroCargo: FiltroCargo
    onFiltroCargoChange: (valor: FiltroCargo) => void
    filtroStatus: FiltroStatus
    onFiltroStatusChange: (valor: FiltroStatus) => void
}

const OPCOES_CARGO: { valor: FiltroCargo; label: string }[] = [
    { valor: 'TODOS', label: 'Todos' },
    { valor: 'ADMIN', label: 'Administradores' },
    { valor: 'OPERADOR', label: 'Operadores' }
]

const OPCOES_STATUS: { valor: FiltroStatus; label: string }[] = [
    { valor: 'ATIVOS', label: 'Ativos' },
    { valor: 'INATIVOS', label: 'Inativos' },
    { valor: 'TODOS', label: 'Todos' }
]

export default function UsersFilterSection({
    filtroCargo,
    onFiltroCargoChange,
    filtroStatus,
    onFiltroStatusChange
}: UsersFilterSectionProps) {
    return (
        <div className='flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-dark-surface'>
            <div className='flex flex-wrap gap-1'>
                {OPCOES_CARGO.map((opcao) => (
                    <button
                        key={opcao.valor}
                        type='button'
                        onClick={() => onFiltroCargoChange(opcao.valor)}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                            filtroCargo === opcao.valor
                                ? 'bg-orange-base text-white'
                                : 'text-gray-dark hover:bg-gray dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                        }`}
                    >
                        {opcao.label}
                    </button>
                ))}
            </div>

            <div className='h-6 w-px bg-gray-base/30' />

            <div className='flex flex-wrap gap-1'>
                {OPCOES_STATUS.map((opcao) => (
                    <button
                        key={opcao.valor}
                        type='button'
                        onClick={() => onFiltroStatusChange(opcao.valor)}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                            filtroStatus === opcao.valor
                                ? 'bg-orange-base text-white'
                                : 'text-gray-dark hover:bg-gray dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                        }`}
                    >
                        {opcao.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

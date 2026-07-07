export type FiltroCargo = 'TODOS' | 'ADMIN' | 'OPERADOR'

type UsersFilterSectionProps = {
    filtro: FiltroCargo
    onFiltroChange: (valor: FiltroCargo) => void
}

const OPCOES: { valor: FiltroCargo; label: string }[] = [
    { valor: 'TODOS', label: 'Todos' },
    { valor: 'ADMIN', label: 'Administradores' },
    { valor: 'OPERADOR', label: 'Operadores' }
]

export default function UsersFilterSection({ filtro, onFiltroChange }: UsersFilterSectionProps) {
    return (
        <div className='flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-sm'>
            <span className='text-xs font-semibold tracking-wide text-gray-dark uppercase'>Cargo</span>

            <div className='flex flex-wrap gap-1'>
                {OPCOES.map((opcao) => (
                    <button
                        key={opcao.valor}
                        type='button'
                        onClick={() => onFiltroChange(opcao.valor)}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                            filtro === opcao.valor
                                ? 'bg-orange-base text-white'
                                : 'text-gray-dark hover:bg-gray'
                        }`}
                    >
                        {opcao.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

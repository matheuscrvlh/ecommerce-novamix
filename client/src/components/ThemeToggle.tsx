import { useTheme } from '../hooks/useTheme'
import { SunIcon, MoonIcon } from './icons'

type ThemeToggleProps = {
    className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
    const { tema, alternarTema } = useTheme()

    return (
        <button
            type='button'
            onClick={alternarTema}
            title={tema === 'dark' ? 'Mudar pro modo claro' : 'Mudar pro modo escuro'}
            className={`text-gray-dark transition hover:text-orange-base dark:text-dark-text-muted dark:hover:text-orange-light ${className}`}
        >
            {tema === 'dark' ? <SunIcon className='h-5 w-5' /> : <MoonIcon className='h-5 w-5' />}
        </button>
    )
}

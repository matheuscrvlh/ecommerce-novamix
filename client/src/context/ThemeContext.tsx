import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, type Tema } from './theme-context'

const CHAVE_STORAGE = 'tema'

function temaInicial(): Tema {
    const salvo = localStorage.getItem(CHAVE_STORAGE)
    if (salvo === 'dark' || salvo === 'light') return salvo

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [tema, setTema] = useState<Tema>(temaInicial)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', tema === 'dark')
        localStorage.setItem(CHAVE_STORAGE, tema)
    }, [tema])

    function alternarTema() {
        setTema((atual) => (atual === 'dark' ? 'light' : 'dark'))
    }

    return (
        <ThemeContext.Provider value={{ tema, alternarTema }}>
            {children}
        </ThemeContext.Provider>
    )
}

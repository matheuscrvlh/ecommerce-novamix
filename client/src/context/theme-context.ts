import { createContext } from 'react'

export type Tema = 'light' | 'dark'

export type ThemeContextType = {
    tema: Tema
    alternarTema: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

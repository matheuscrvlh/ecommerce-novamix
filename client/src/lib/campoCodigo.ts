import type { InputHTMLAttributes } from 'react'

// Campos de código de pedido/crachá: no celular o teclado abre em maiúsculas e sem corretor/sugestões
export const PROPS_CAMPO_CODIGO: InputHTMLAttributes<HTMLInputElement> = {
    autoCapitalize: 'characters',
    autoCorrect: 'off',
    autoComplete: 'off',
    spellCheck: false
}

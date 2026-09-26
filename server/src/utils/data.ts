const FUSO = 'America/Sao_Paulo'

// "25/09/2026 às 17:03" — o container roda em UTC, então sem o fuso a hora sairia 3h adiantada
export function formatarDataHora(data: Date | string): string {
    const valor = new Date(data)
    const dia = valor.toLocaleDateString('pt-BR', { timeZone: FUSO })
    const hora = valor.toLocaleTimeString('pt-BR', { timeZone: FUSO, hour: '2-digit', minute: '2-digit' })
    return `${dia} às ${hora}`
}

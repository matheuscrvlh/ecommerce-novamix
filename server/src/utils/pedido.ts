// Leitores podem mandar o mesmo código com espaços ou em minúsculas (ex.: Caps Lock ligado)
export function normalizarCodigoPedido(codigo: string): string {
    return codigo.replace(/\s/g, '').toUpperCase()
}

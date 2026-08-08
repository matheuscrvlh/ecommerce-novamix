const PREFIXO = 'NVX'
const CRACHA_REGEX = /^NVX(\d{4})$/

export function crachaDoId(id: number): string {
    return `${PREFIXO}${String(id).padStart(4, '0')}`
}

export function idDoCracha(cracha: string): number | null {
    const match = CRACHA_REGEX.exec(cracha.trim())
    return match ? Number(match[1]) : null
}

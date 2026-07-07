let contextoAudio: AudioContext | null = null

export function tocarSomNotificacao() {
    try {
        contextoAudio ??= new AudioContext()

        const agora = contextoAudio.currentTime
        const notas = [880, 1175]

        notas.forEach((frequencia, indice) => {
            const oscilador = contextoAudio!.createOscillator()
            const ganho = contextoAudio!.createGain()

            oscilador.type = 'sine'
            oscilador.frequency.setValueAtTime(frequencia, agora)

            const inicio = agora + indice * 0.09
            ganho.gain.setValueAtTime(0, inicio)
            ganho.gain.linearRampToValueAtTime(0.08, inicio + 0.02)
            ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.25)

            oscilador.connect(ganho)
            ganho.connect(contextoAudio!.destination)

            oscilador.start(inicio)
            oscilador.stop(inicio + 0.3)
        })
    } catch {
        // navegador sem suporte a AudioContext, ou autoplay bloqueado — ignora silenciosamente
    }
}

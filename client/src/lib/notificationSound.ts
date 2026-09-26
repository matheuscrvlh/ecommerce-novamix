let contextoAudio: AudioContext | null = null

type Nota = {
    frequencia: number
    inicio: number
    duracao: number
}

function tocar(notas: Nota[], tipo: OscillatorType, volume: number) {
    try {
        contextoAudio ??= new AudioContext()

        const agora = contextoAudio.currentTime

        notas.forEach(({ frequencia, inicio, duracao }) => {
            const oscilador = contextoAudio!.createOscillator()
            const ganho = contextoAudio!.createGain()

            oscilador.type = tipo
            oscilador.frequency.setValueAtTime(frequencia, agora)

            const comeco = agora + inicio
            ganho.gain.setValueAtTime(0, comeco)
            ganho.gain.linearRampToValueAtTime(volume, comeco + 0.02)
            ganho.gain.exponentialRampToValueAtTime(0.0001, comeco + duracao)

            oscilador.connect(ganho)
            ganho.connect(contextoAudio!.destination)

            oscilador.start(comeco)
            oscilador.stop(comeco + duracao + 0.05)
        })
    } catch {
        // navegador sem suporte a AudioContext, ou autoplay bloqueado — ignora silenciosamente
    }
}

export function tocarSomNotificacao() {
    tocar([
        { frequencia: 880, inicio: 0, duracao: 0.25 },
        { frequencia: 1175, inicio: 0.09, duracao: 0.25 }
    ], 'sine', 0.08)
}

// Chamar num clique/toque: o navegador só libera o áudio depois de um gesto do usuário.
// Sem isso, o primeiro bipe vindo da câmera sairia mudo.
export function liberarAudio() {
    try {
        contextoAudio ??= new AudioContext()
        if (contextoAudio.state === 'suspended') contextoAudio.resume()
    } catch {
        // sem suporte a áudio
    }
}

// Bipe curto e agudo no acerto, dois graves no erro — o operador olha pro pacote, não pra tela
export function sinalizarBipagem(ok: boolean) {
    if (ok) {
        tocar([{ frequencia: 1320, inicio: 0, duracao: 0.12 }], 'sine', 0.12)
    } else {
        tocar([
            { frequencia: 220, inicio: 0, duracao: 0.16 },
            { frequencia: 180, inicio: 0.2, duracao: 0.22 }
        ], 'square', 0.06)
    }

    // vibração só existe no Android; no iPhone é ignorada
    navigator.vibrate?.(ok ? 60 : [120, 80, 120])
}

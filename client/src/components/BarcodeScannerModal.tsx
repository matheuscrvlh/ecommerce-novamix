import { useEffect, useId, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import Alert from './Alert'
import { CloseIcon } from './icons'

const COOLDOWN_ENTRE_LEITURAS_MS = 1500

type ResultadoLeitura = {
    ok: boolean
    mensagem: string
}

type BarcodeScannerModalProps = {
    onClose: () => void
    onResult: (texto: string) => void
    ultimoResultado?: ResultadoLeitura | null
}

export default function BarcodeScannerModal({ onClose, onResult, ultimoResultado }: BarcodeScannerModalProps) {
    const scannerId = useId().replace(/:/g, '')
    const [erro, setErro] = useState('')
    const onResultRef = useRef(onResult)

    useEffect(() => {
        onResultRef.current = onResult
    })

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    useEffect(() => {
        const scanner = new Html5Qrcode(scannerId)
        let processando = false
        let destruido = false

        scanner
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    if (processando) return
                    processando = true
                    onResultRef.current(decodedText)

                    setTimeout(() => {
                        if (!destruido) processando = false
                    }, COOLDOWN_ENTRE_LEITURAS_MS)
                },
                undefined
            )
            .catch(() => {
                if (!destruido) setErro('Não foi possível acessar a câmera. Verifique a permissão do navegador.')
            })

        return () => {
            destruido = true
            scanner.stop().then(() => scanner.clear()).catch(() => {})
        }
    }, [scannerId])

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
            <div className='w-full max-w-sm rounded-lg bg-white p-4 shadow-lg'>
                <div className='mb-3 flex items-center justify-between'>
                    <h2 className='text-sm font-semibold text-gray-text'>Aponte a câmera pro código</h2>
                    <button onClick={onClose} className='text-gray-dark transition hover:text-gray-text'>
                        <CloseIcon className='h-5 w-5' />
                    </button>
                </div>

                {erro && (
                    <div className='mb-3'>
                        <Alert>{erro}</Alert>
                    </div>
                )}

                {ultimoResultado && (
                    <div
                        className={`mb-3 rounded-md px-3 py-2 text-sm ${
                            ultimoResultado.ok ? 'bg-green-base/10 text-green-base' : 'bg-red-base/10 text-red-base'
                        }`}
                    >
                        {ultimoResultado.mensagem}
                    </div>
                )}

                <div id={scannerId} className='overflow-hidden rounded-md' />

                <p className='mt-3 text-center text-xs text-gray-dark'>
                    A câmera continua aberta — pode ir bipando os próximos pedidos direto.
                </p>
            </div>
        </div>
    )
}

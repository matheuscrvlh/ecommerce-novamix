import { useEffect, useId, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import Alert from './Alert'
import { CloseIcon } from './icons'

type BarcodeScannerModalProps = {
    onClose: () => void
    onResult: (texto: string) => void
}

export default function BarcodeScannerModal({ onClose, onResult }: BarcodeScannerModalProps) {
    const scannerId = useId().replace(/:/g, '')
    const [erro, setErro] = useState('')
    const onResultRef = useRef(onResult)

    useEffect(() => {
        onResultRef.current = onResult
    })

    useEffect(() => {
        const scanner = new Html5Qrcode(scannerId)
        let paraDe = false

        scanner
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    if (paraDe) return
                    paraDe = true
                    onResultRef.current(decodedText)
                },
                undefined
            )
            .catch(() => {
                if (!paraDe) setErro('Não foi possível acessar a câmera. Verifique a permissão do navegador.')
            })

        return () => {
            paraDe = true
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

                <div id={scannerId} className='overflow-hidden rounded-md' />
            </div>
        </div>
    )
}

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import type { Usuario } from '../../api/users'

type UserQrCodeModalProps = {
    usuario: Usuario | null
    onClose: () => void
}

export default function UserQrCodeModal({ usuario, onClose }: UserQrCodeModalProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState('')

    useEffect(() => {
        if (!usuario?.cracha) return

        let cancelado = false

        QRCode.toDataURL(usuario.cracha, { width: 320, margin: 1 })
            .then((url) => { if (!cancelado) setQrCodeUrl(url) })
            .catch(() => { if (!cancelado) setQrCodeUrl('') })

        return () => { cancelado = true }
    }, [usuario])

    function handlePrint() {
        window.print()
    }

    return (
        <Modal open={usuario !== null} onClose={onClose} title={`Crachá — ${usuario?.nome ?? ''}`}>
            {!usuario?.cracha && (
                <p className='text-center text-sm text-gray-dark'>
                    Esse usuário ainda não tem um crachá cadastrado.
                </p>
            )}

            {usuario?.cracha && (
                <div id='qr-print-area' className='flex flex-col items-center gap-3'>
                    {qrCodeUrl && <img src={qrCodeUrl} alt={`QR Code do crachá de ${usuario.nome}`} className='h-64 w-64' />}
                    <p className='text-center font-semibold text-gray-text'>{usuario.nome}</p>
                    <p className='text-center text-sm text-gray-dark'>{usuario.cracha}</p>
                </div>
            )}

            {usuario?.cracha && (
                <div className='mt-5 flex justify-end gap-2 print:hidden'>
                    <Button variant='ghost' onClick={onClose}>Fechar</Button>
                    <Button onClick={handlePrint}>Imprimir</Button>
                </div>
            )}
        </Modal>
    )
}

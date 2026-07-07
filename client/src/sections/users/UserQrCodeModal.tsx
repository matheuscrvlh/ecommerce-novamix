import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { UserAvatarIcon } from '../../components/icons'
import logoNm from '../../assets/logos/logo-nm.jpeg'
import type { Usuario } from '../../api/users'

type UserQrCodeModalProps = {
    usuario: Usuario | null
    onClose: () => void
}

function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR')
}

export default function UserQrCodeModal({ usuario, onClose }: UserQrCodeModalProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState('')

    useEffect(() => {
        if (!usuario?.cracha) return

        let cancelado = false

        QRCode.toDataURL(usuario.cracha, { width: 240, margin: 1 })
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
                <div id='qr-print-area' className='flex justify-center'>
                    <div className='w-72 overflow-hidden rounded-2xl border border-gray bg-white shadow-sm print:rounded-none print:border-2 print:border-dashed print:border-gray-text print:shadow-none'>
                        <div className='bg-linear-to-r from-orange-base to-gray-base p-3'>
                            <img src={logoNm} alt='Logo Novamix' className='mx-auto h-8 w-auto rounded bg-white/95 px-3 py-1' />
                        </div>

                        <div className='flex flex-col items-center gap-2 px-6 py-5'>
                            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gray text-gray-dark'>
                                <UserAvatarIcon className='h-12 w-12' />
                            </div>

                            <p className='text-center text-lg leading-tight font-bold text-gray-text'>{usuario.nome}</p>

                            <Badge color={usuario.role === 'ADMIN' ? 'teal' : 'orange'}>
                                {usuario.role === 'ADMIN' ? 'Administrador' : 'Operador'}
                            </Badge>

                            {qrCodeUrl && (
                                <img
                                    src={qrCodeUrl}
                                    alt={`QR Code do crachá de ${usuario.nome}`}
                                    className='mt-2 h-36 w-36'
                                />
                            )}

                            <p className='text-center text-sm font-semibold tracking-wide text-gray-text'>{usuario.cracha}</p>

                            <div className='mt-2 w-full border-t border-gray pt-2 text-center'>
                                <p className='text-[10px] text-gray-dark'>Crachá emitido em {formatarData(usuario.criado_em)}</p>
                            </div>
                        </div>
                    </div>
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

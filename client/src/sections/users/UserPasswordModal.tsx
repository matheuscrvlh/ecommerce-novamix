import { useState, type SubmitEvent } from 'react'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Alert from '../../components/Alert'
import type { Usuario } from '../../api/users'

type UserPasswordModalProps = {
    usuario: Usuario | null
    onClose: () => void
    onSubmit: (novaSenha: string) => Promise<void>
}

export default function UserPasswordModal({ usuario, onClose, onSubmit }: UserPasswordModalProps) {
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    function handleClose() {
        setNovaSenha('')
        setConfirmarSenha('')
        setErro('')
        onClose()
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        setErro('')

        if (novaSenha !== confirmarSenha) {
            setErro('As senhas não coincidem.')
            return
        }

        setEnviando(true)

        try {
            await onSubmit(novaSenha)
            handleClose()
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao alterar senha.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <Modal open={usuario !== null} onClose={handleClose} title={`Alterar senha — ${usuario?.nome ?? ''}`}>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <Input
                    type='password'
                    placeholder='Nova senha'
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                    autoFocus
                />
                <Input
                    type='password'
                    placeholder='Confirmar nova senha'
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                />

                {erro && <Alert>{erro}</Alert>}

                <div className='flex justify-end gap-2'>
                    <Button type='button' variant='ghost' onClick={handleClose}>Cancelar</Button>
                    <Button type='submit' disabled={enviando}>
                        {enviando ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

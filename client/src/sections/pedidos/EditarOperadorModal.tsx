import { useState, type SubmitEvent } from 'react'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import Select from '../../components/Select'
import Alert from '../../components/Alert'
import type { UsuarioResumo } from '../../api/users'

type EditarOperadorModalProps = {
    codigoPedido: string | null
    usuarios: UsuarioResumo[]
    onClose: () => void
    onSubmit: (usuarioId: number) => Promise<void>
}

export default function EditarOperadorModal({ codigoPedido, usuarios, onClose, onSubmit }: EditarOperadorModalProps) {
    const [usuarioId, setUsuarioId] = useState('')
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    function handleClose() {
        setUsuarioId('')
        setErro('')
        onClose()
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        setErro('')

        if (!usuarioId) {
            setErro('Selecione um operador.')
            return
        }

        setEnviando(true)

        try {
            await onSubmit(Number(usuarioId))
            handleClose()
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao alterar operador.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <Modal open={codigoPedido !== null} onClose={handleClose} title={`Alterar operador — ${codigoPedido ?? ''}`}>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <Select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
                    <option value=''>Selecione um operador</option>
                    {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                            {usuario.nome}
                        </option>
                    ))}
                </Select>

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

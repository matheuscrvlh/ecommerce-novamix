import { useState, type SubmitEvent } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Alert from '../../components/Alert'

export type UsuarioFormValues = {
    id?: number
    nome: string
    role: string
    cracha: string
    status: boolean
    hub_user_id: number | null
}

type UserFormSectionProps = {
    mode: 'create' | 'edit'
    initialValues?: UsuarioFormValues
    onSubmit: (values: UsuarioFormValues) => Promise<void>
}

const emptyForm: UsuarioFormValues = { nome: '', role: 'OPERADOR', cracha: '', status: true, hub_user_id: null }

export default function UserFormSection({ mode, initialValues, onSubmit }: UserFormSectionProps) {
    const [values, setValues] = useState<UsuarioFormValues>(initialValues ?? emptyForm)
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        setErro('')
        setEnviando(true)

        try {
            await onSubmit(values)
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao salvar usuário.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Input
                placeholder='Nome'
                value={values.nome}
                onChange={(e) => setValues({ ...values, nome: e.target.value })}
                required
            />
            <Input
                type='number'
                placeholder='ID do usuário no Hub (opcional)'
                value={values.hub_user_id ?? ''}
                onChange={(e) => setValues({ ...values, hub_user_id: e.target.value ? Number(e.target.value) : null })}
            />
            <Select
                value={values.role}
                onChange={(e) => setValues({ ...values, role: e.target.value })}
            >
                <option value='OPERADOR'>Operador</option>
                <option value='ADMIN'>Admin</option>
            </Select>
            <Input
                placeholder='Crachá'
                value={values.cracha}
                onChange={(e) => setValues({ ...values, cracha: e.target.value })}
            />

            {mode === 'edit' && (
                <label className='flex items-center gap-2 text-sm text-gray-text dark:text-dark-text'>
                    <input
                        type='checkbox'
                        checked={values.status}
                        onChange={(e) => setValues({ ...values, status: e.target.checked })}
                    />
                    Usuário ativo
                </label>
            )}

            {erro && (
                <div className='sm:col-span-2'>
                    <Alert>{erro}</Alert>
                </div>
            )}

            <div className='sm:col-span-2'>
                <Button type='submit' disabled={enviando} className='w-full'>
                    {enviando ? 'Salvando...' : mode === 'create' ? 'Cadastrar' : 'Salvar'}
                </Button>
            </div>
        </form>
    )
}

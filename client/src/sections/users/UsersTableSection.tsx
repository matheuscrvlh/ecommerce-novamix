import Badge from '../../components/Badge'
import Spinner from '../../components/Spinner'
import { EditIcon, TrashIcon } from '../../components/icons'
import type { Usuario } from '../../api/users'

type UsersTableSectionProps = {
    usuarios: Usuario[]
    carregando: boolean
    onEdit: (usuario: Usuario) => void
    onDelete: (usuario: Usuario) => void
}

export default function UsersTableSection({ usuarios, carregando, onEdit, onDelete }: UsersTableSectionProps) {
    return (
        <section className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-400 uppercase'>Usuários cadastrados</h2>

            <table className='w-full border-collapse text-left text-sm'>
                <thead>
                    <tr className='border-b border-gray-100 text-gray-400'>
                        <th className='py-2 font-medium'>Nome</th>
                        <th className='py-2 font-medium'>Login</th>
                        <th className='py-2 font-medium'>Cargo</th>
                        <th className='py-2 font-medium'>Status</th>
                        <th className='py-2 font-medium' />
                    </tr>
                </thead>
                <tbody>
                    {carregando && (
                        <tr>
                            <td colSpan={5} className='py-8 text-center'>
                                <Spinner className='mx-auto h-6 w-6' />
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        usuarios.map((usuario) => (
                            <tr key={usuario.id} className='border-b border-gray-50 transition hover:bg-gray-50'>
                                <td className='py-2'>{usuario.nome}</td>
                                <td className='py-2'>{usuario.login}</td>
                                <td className='py-2'>
                                    <Badge color={usuario.role === 'ADMIN' ? 'teal' : 'orange'}>{usuario.role}</Badge>
                                </td>
                                <td className='py-2'>
                                    <Badge color={usuario.status ? 'green' : 'red'}>
                                        {usuario.status ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </td>
                                <td className='py-2'>
                                    <div className='flex gap-1'>
                                        <button
                                            onClick={() => onEdit(usuario)}
                                            className='rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-orange-600'
                                            title='Editar'
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(usuario)}
                                            className='rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600'
                                            title='Excluir'
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    {!carregando && usuarios.length === 0 && (
                        <tr>
                            <td colSpan={5} className='py-6 text-center text-gray-400'>Nenhum usuário cadastrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    )
}

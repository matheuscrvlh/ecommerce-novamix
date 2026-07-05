import Badge from '../../components/Badge'
import Spinner from '../../components/Spinner'
import { EditIcon, TrashIcon, QrCodeIcon } from '../../components/icons'
import type { Usuario } from '../../api/users'

type UsersTableSectionProps = {
    usuarios: Usuario[]
    carregando: boolean
    onEdit: (usuario: Usuario) => void
    onDelete: (usuario: Usuario) => void
    onShowQrCode: (usuario: Usuario) => void
}

export default function UsersTableSection({ usuarios, carregando, onEdit, onDelete, onShowQrCode }: UsersTableSectionProps) {
    return (
        <section className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-dark uppercase'>Usuários cadastrados</h2>

            <table className='w-full border-collapse text-left text-sm'>
                <thead>
                    <tr className='border-b border-gray text-gray-dark'>
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
                            <tr key={usuario.id} className='border-b border-gray transition hover:bg-gray'>
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
                                            onClick={() => onShowQrCode(usuario)}
                                            className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base'
                                            title='Crachá (QR Code)'
                                        >
                                            <QrCodeIcon />
                                        </button>
                                        <button
                                            onClick={() => onEdit(usuario)}
                                            className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base'
                                            title='Editar'
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(usuario)}
                                            className='rounded-md p-2 text-gray-dark transition hover:bg-red-base/10 hover:text-red-base'
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
                            <td colSpan={5} className='py-6 text-center text-gray-dark'>Nenhum usuário cadastrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    )
}

import Badge from '../../components/Badge'
import Skeleton from '../../components/Skeleton'
import { EditIcon, TrashIcon, QrCodeIcon, LockIcon } from '../../components/icons'
import type { Usuario } from '../../api/users'

const LINHAS_SKELETON = [0, 1, 2, 3, 4]

type UsersTableSectionProps = {
    usuarios: Usuario[]
    carregando: boolean
    onEdit: (usuario: Usuario) => void
    onDelete: (usuario: Usuario) => void
    onShowQrCode: (usuario: Usuario) => void
    onChangePassword: (usuario: Usuario) => void
}

export default function UsersTableSection({ usuarios, carregando, onEdit, onDelete, onShowQrCode, onChangePassword }: UsersTableSectionProps) {
    return (
        <section className='rounded-lg bg-white p-6 shadow-sm dark:bg-dark-surface'>
            <h2 className='mb-4 text-xs font-semibold tracking-wide text-gray-dark uppercase dark:text-dark-text-muted'>Usuários cadastrados</h2>

            <div className='space-y-3 sm:hidden'>
                {carregando &&
                    LINHAS_SKELETON.map((linha) => (
                        <div key={linha} className='rounded-lg border border-gray p-4 dark:border-dark-border'>
                            <div className='flex items-start justify-between gap-3'>
                                <Skeleton className='h-4 w-32' />
                                <Skeleton className='h-5 w-16 rounded-full' />
                            </div>
                            <Skeleton className='mt-2 h-3 w-24' />
                        </div>
                    ))}

                {!carregando &&
                    usuarios.map((usuario) => (
                        <div key={usuario.id} className='rounded-lg border border-gray p-4 dark:border-dark-border'>
                            <div className='flex items-start justify-between gap-3'>
                                <div className='min-w-0'>
                                    <p className='truncate font-semibold text-gray-text dark:text-dark-text'>
                                        {usuario.nome} <span className='font-normal text-gray-dark dark:text-dark-text-muted'>#{usuario.id}</span>
                                    </p>
                                    <p className='truncate text-xs text-gray-dark dark:text-dark-text-muted'>{usuario.login}</p>
                                </div>
                                <Badge color={usuario.role === 'ADMIN' ? 'teal' : 'orange'}>{usuario.role}</Badge>
                            </div>

                            <div className='mt-3 flex items-center justify-between'>
                                <Badge color={usuario.status ? 'green' : 'red'}>
                                    {usuario.status ? 'Ativo' : 'Inativo'}
                                </Badge>

                                <div className='flex gap-1'>
                                    <button
                                        onClick={() => onShowQrCode(usuario)}
                                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                        title='Crachá (QR Code)'
                                    >
                                        <QrCodeIcon />
                                    </button>
                                    <button
                                        onClick={() => onChangePassword(usuario)}
                                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                        title='Alterar senha'
                                    >
                                        <LockIcon />
                                    </button>
                                    <button
                                        onClick={() => onEdit(usuario)}
                                        className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                        title='Editar'
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        onClick={() => onDelete(usuario)}
                                        className='rounded-md p-2 text-gray-dark transition hover:bg-red-base/10 hover:text-red-base dark:text-dark-text-muted'
                                        title='Excluir'
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                {!carregando && usuarios.length === 0 && (
                    <p className='py-6 text-center text-sm text-gray-dark dark:text-dark-text-muted'>Nenhum usuário cadastrado.</p>
                )}
            </div>

            <div className='hidden overflow-hidden rounded-lg border border-gray sm:block dark:border-dark-border'>
                <div className='overflow-x-auto'>
                    <table className='w-full min-w-140 border-collapse text-left text-sm'>
                        <thead>
                            <tr className='border-b border-gray bg-gray text-xs font-semibold tracking-wide text-gray-dark uppercase dark:border-dark-border dark:bg-dark-surface-2 dark:text-dark-text-muted'>
                                <th className='px-4 py-3'>ID</th>
                                <th className='px-4 py-3'>Nome</th>
                                <th className='px-4 py-3'>Login</th>
                                <th className='px-4 py-3'>Cargo</th>
                                <th className='px-4 py-3'>Status</th>
                                <th className='px-4 py-3' />
                            </tr>
                        </thead>
                        <tbody>
                            {carregando &&
                                LINHAS_SKELETON.map((linha) => (
                                    <tr key={linha} className='border-b border-gray last:border-0 dark:border-dark-border'>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-3.5 w-8' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-3.5 w-28' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-3.5 w-24' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-5 w-16 rounded-full' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-5 w-14 rounded-full' />
                                        </td>
                                        <td className='px-4 py-3'>
                                            <Skeleton className='h-6 w-20' />
                                        </td>
                                    </tr>
                                ))}

                            {!carregando &&
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className='border-b border-gray transition last:border-0 hover:bg-gray dark:border-dark-border dark:hover:bg-dark-surface-2'>
                                        <td className='px-4 py-3 whitespace-nowrap text-gray-dark dark:text-dark-text-muted'>{usuario.id}</td>
                                        <td className='px-4 py-3 whitespace-nowrap text-gray-text dark:text-dark-text'>{usuario.nome}</td>
                                        <td className='px-4 py-3 whitespace-nowrap text-gray-text dark:text-dark-text'>{usuario.login}</td>
                                        <td className='px-4 py-3 whitespace-nowrap'>
                                            <Badge color={usuario.role === 'ADMIN' ? 'teal' : 'orange'}>{usuario.role}</Badge>
                                        </td>
                                        <td className='px-4 py-3 whitespace-nowrap'>
                                            <Badge color={usuario.status ? 'green' : 'red'}>
                                                {usuario.status ? 'Ativo' : 'Inativo'}
                                            </Badge>
                                        </td>
                                        <td className='px-4 py-3 whitespace-nowrap'>
                                            <div className='flex gap-1'>
                                                <button
                                                    onClick={() => onShowQrCode(usuario)}
                                                    className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                                    title='Crachá (QR Code)'
                                                >
                                                    <QrCodeIcon />
                                                </button>
                                                <button
                                                    onClick={() => onChangePassword(usuario)}
                                                    className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                                    title='Alterar senha'
                                                >
                                                    <LockIcon />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(usuario)}
                                                    className='rounded-md p-2 text-gray-dark transition hover:bg-gray hover:text-orange-base dark:text-dark-text-muted dark:hover:bg-dark-surface-2'
                                                    title='Editar'
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(usuario)}
                                                    className='rounded-md p-2 text-gray-dark transition hover:bg-red-base/10 hover:text-red-base dark:text-dark-text-muted'
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
                                    <td colSpan={6} className='py-6 text-center text-gray-dark dark:text-dark-text-muted'>Nenhum usuário cadastrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

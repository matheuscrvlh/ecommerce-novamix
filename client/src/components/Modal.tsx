import { useEffect, type ReactNode } from 'react'
import { CloseIcon } from './icons'

type ModalProps = {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (!open) return

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
            onClick={onClose}
        >
            <div
                className='w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-dark-surface'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='mb-4 flex items-center justify-between'>
                    <h2 className='text-lg font-semibold text-gray-text dark:text-dark-text'>{title}</h2>
                    <button onClick={onClose} className='text-gray-dark transition hover:text-gray-text dark:text-dark-text-muted dark:hover:text-dark-text'>
                        <CloseIcon className='h-5 w-5' />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

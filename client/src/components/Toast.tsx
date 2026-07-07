import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircleIcon } from './icons'

type ToastProps = {
    mensagem: string | null
}

export default function Toast({ mensagem }: ToastProps) {
    return (
        <div className='pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:justify-end sm:pr-8'>
            <AnimatePresence>
                {mensagem && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        className='flex items-center gap-2 rounded-lg bg-gray-text px-4 py-3 text-sm text-white shadow-lg'
                    >
                        <CheckCircleIcon className='h-4 w-4 shrink-0 text-green-base' />
                        {mensagem}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

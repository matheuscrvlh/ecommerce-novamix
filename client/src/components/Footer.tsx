type FooterProps = {
    stacked?: boolean
}

export default function Footer({ stacked = false }: FooterProps) {
    const mthcode = (
        <a
            href='https://www.mthcode.com.br/'
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium text-gray-text transition hover:text-orange-base dark:text-dark-text dark:hover:text-orange-light'
        >
            MTHCODE
        </a>
    )

    const marlonAlves = (
        <a
            href='https://www.marlonalves.dev/'
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium text-gray-text transition hover:text-orange-base dark:text-dark-text dark:hover:text-orange-light'
        >
            MarlonAlves
        </a>
    )

    if (stacked) {
        return (
            <footer className='space-y-1 pt-4 text-center text-xs text-gray-dark dark:text-dark-text-muted'>
                <p>Desenvolvido por:</p>
                <p>{mthcode} e {marlonAlves}</p>
            </footer>
        )
    }

    return (
        <footer className='pt-4 text-center text-xs text-gray-dark dark:text-dark-text-muted'>
            Desenvolvido por {mthcode} e {marlonAlves}
        </footer>
    )
}

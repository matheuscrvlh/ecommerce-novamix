type IconProps = { className?: string }

export function DashboardIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <rect x='3' y='3' width='7' height='9' rx='1.5' />
            <rect x='14' y='3' width='7' height='5' rx='1.5' />
            <rect x='14' y='12' width='7' height='9' rx='1.5' />
            <rect x='3' y='16' width='7' height='5' rx='1.5' />
        </svg>
    )
}

export function UsersIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <circle cx='9' cy='8' r='3' />
            <path d='M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6' />
            <circle cx='17' cy='8' r='2.5' />
            <path d='M15.5 14.2c2.5.4 4.5 2.6 4.5 5.8' />
        </svg>
    )
}

export function UserAvatarIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='currentColor' className={className}>
            <circle cx='12' cy='8' r='4' />
            <path d='M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8a1 1 0 01-1 1H5a1 1 0 01-1-1z' />
        </svg>
    )
}

export function LogoutIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4' />
            <path d='M16 17l5-5-5-5' />
            <path d='M21 12H9' />
        </svg>
    )
}

export function PackageIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M21 8l-9-5-9 5 9 5 9-5z' />
            <path d='M3 8v8l9 5 9-5V8' />
            <path d='M12 13v8' />
        </svg>
    )
}

export function CheckCircleIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <circle cx='12' cy='12' r='9' />
            <path d='M8.5 12.5l2.5 2.5 4.5-5' />
        </svg>
    )
}

export function MenuIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M3 6h18M3 12h18M3 18h18' />
        </svg>
    )
}

export function CloseIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M6 6l12 12M18 6L6 18' />
        </svg>
    )
}

export function EditIcon({ className = 'h-4 w-4' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M12 20h9' />
            <path d='M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z' />
        </svg>
    )
}

export function TrashIcon({ className = 'h-4 w-4' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M3 6h18' />
            <path d='M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2' />
            <path d='M19 6l-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6' />
        </svg>
    )
}

export function PlusIcon({ className = 'h-4 w-4' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} className={className}>
            <path d='M12 5v14M5 12h14' />
        </svg>
    )
}

export function BadgeIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <rect x='4' y='3' width='16' height='18' rx='2' />
            <circle cx='12' cy='9' r='2.5' />
            <path d='M8 17c0-2.2 1.8-4 4-4s4 1.8 4 4' />
        </svg>
    )
}

export function CameraIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M4 8a2 2 0 012-2h1.5l1-1.5h7l1 1.5H18a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z' />
            <circle cx='12' cy='13' r='3.5' />
        </svg>
    )
}

export function ChevronLeftIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M15 18l-6-6 6-6' />
        </svg>
    )
}

export function ChevronRightIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M9 18l6-6-6-6' />
        </svg>
    )
}

export function ChevronsLeftIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M18 18l-6-6 6-6' />
            <path d='M11 18l-6-6 6-6' />
        </svg>
    )
}

export function ChevronsRightIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M6 18l6-6-6-6' />
            <path d='M13 18l6-6-6-6' />
        </svg>
    )
}

export function TrophyIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <path d='M7 4h10v5a5 5 0 01-10 0V4z' />
            <path d='M7 5H4a3 3 0 003 3M17 5h3a3 3 0 01-3 3' />
            <path d='M12 14v3' />
            <path d='M9 20h6' />
            <path d='M10 17h4v3h-4z' />
        </svg>
    )
}

export function CalendarIcon({ className = 'h-4 w-4' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <rect x='3' y='5' width='18' height='16' rx='2' />
            <path d='M3 10h18M8 3v4M16 3v4' />
        </svg>
    )
}

export function ClockIcon({ className = 'h-4 w-4' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <circle cx='12' cy='12' r='9' />
            <path d='M12 7v5l3.5 2' />
        </svg>
    )
}

export function SearchIcon({ className = 'h-4 w-4' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <circle cx='11' cy='11' r='7' />
            <path d='M21 21l-4.35-4.35' />
        </svg>
    )
}

export function QrCodeIcon({ className = 'h-4 w-4' }: IconProps) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className={className}>
            <rect x='3' y='3' width='7' height='7' rx='1' />
            <rect x='14' y='3' width='7' height='7' rx='1' />
            <rect x='3' y='14' width='7' height='7' rx='1' />
            <path d='M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01' />
        </svg>
    )
}

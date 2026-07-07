type SkeletonProps = {
    className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
    return <div className={`animate-pulse rounded-md bg-gray-dark/10 ${className}`} />
}

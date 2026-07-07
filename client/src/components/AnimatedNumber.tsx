import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

type AnimatedNumberProps = {
    value: number
    className?: string
}

export default function AnimatedNumber({ value, className }: AnimatedNumberProps) {
    const spring = useSpring(value, { stiffness: 140, damping: 22, mass: 0.5 })
    const exibido = useTransform(spring, (v) => Math.round(v).toLocaleString('pt-BR'))

    useEffect(() => {
        spring.set(value)
    }, [spring, value])

    return <motion.span className={className}>{exibido}</motion.span>
}

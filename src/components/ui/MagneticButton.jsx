import { motion, useMotionValue } from 'framer-motion'

export default function MagneticButton({ children, className = '', onClick }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.2
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.2
    x.set(dx)
    y.set(dy)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      style={{ x, y }}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

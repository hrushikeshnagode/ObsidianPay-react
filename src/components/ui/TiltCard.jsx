import { motion, useMotionValue } from 'framer-motion'

export default function TiltCard({ children, className = '' }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height
    ry.set(dx * 8)
    rx.set(dy * -8)
  }

  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.article
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.article>
  )
}

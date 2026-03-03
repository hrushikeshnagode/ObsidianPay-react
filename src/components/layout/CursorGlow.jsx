import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

export default function CursorGlow() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(215,181,122,0.16), transparent 62%)`

  const onMove = (e) => {
    x.set(e.clientX)
    y.set(e.clientY)
  }

  return (
    <motion.div
      aria-hidden="true"
      onMouseMove={onMove}
      style={{ background: glow }}
      className="pointer-events-none fixed inset-0 z-10 hidden md:block"
    />
  )
}

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function SectionShell({ id, children, parallax = 24 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yRaw = useTransform(scrollYProgress, [0, 0.5, 1], [parallax, 0, -parallax])
  const y = useSpring(yRaw, { stiffness: 90, damping: 26, mass: 0.4 })

  return (
    <motion.section
      ref={ref}
      style={{ y }}
      className="post mx-auto grid min-h-screen w-[92vw] max-w-6xl grid-cols-1 items-center gap-5 pt-28 md:grid-cols-[1.1fr_.9fr]"
      id={id}
    >
      {children}
    </motion.section>
  )
}

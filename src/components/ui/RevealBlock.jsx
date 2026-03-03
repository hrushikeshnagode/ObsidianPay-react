import { motion } from 'framer-motion'

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } },
}

export default function RevealBlock({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={reveal}
      className={className}
    >
      {children}
    </motion.div>
  )
}

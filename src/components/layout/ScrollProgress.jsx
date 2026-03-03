import { motion } from 'framer-motion'

export default function ScrollProgress({ progressHeight }) {
  return (
    <div className="progress-track">
      <motion.span className="progress-fill" style={{ height: progressHeight }} />
    </div>
  )
}

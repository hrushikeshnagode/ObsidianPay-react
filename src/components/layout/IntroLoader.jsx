import { motion } from 'framer-motion'

export default function IntroLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#07090f]"
    >
      <div className="relative text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="mx-auto mb-4 h-16 w-16 rounded-full border border-[#d7b57a66] bg-gradient-to-br from-[#d7b57a33] to-[#66b8ff22]"
        />
        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-display text-3xl tracking-tight text-[#f8ead2]"
        >
          ObsidianPay
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-2 text-sm text-slate-300"
        >
          Premium motion experience loading...
        </motion.p>

        <div className="mx-auto mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
          <motion.span
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="block h-full w-1/2 bg-gradient-to-r from-[#66b8ff] to-[#d7b57a]"
          />
        </div>
      </div>
    </motion.div>
  )
}

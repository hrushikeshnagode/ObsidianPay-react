import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}

/* ── Animated Counter ── */
export function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0)
  const frame = useRef()
  useEffect(() => {
    const target = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0
    if (target === 0) { setDisplay(0); return }
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [value, duration])
  return <>{display.toLocaleString()}</>
}

/* ── White Card ── */
export function Card({ children, className = '', delay = 0, hover = true, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', transition: { duration: 0.2 } } : undefined}
      className={`rounded-xl border border-slate-100 bg-white shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ── Status Badge ── */
export function StatusBadge({ status }) {
  const key = String(status || '').toUpperCase()
  let cls

  if (['PAID', 'COMPLETED', 'CLOSED', 'APPROVED'].includes(key)) {
    cls = 'bg-emerald-50 text-emerald-700 border-emerald-200'
  } else if (['IN_PROGRESS', 'WORKING', 'SCHEDULED', 'SENT', 'PENDING'].includes(key)) {
    cls = 'bg-amber-50 text-amber-700 border-amber-200'
  } else if (['NEW', 'NEW_LEAD', 'FAILED', 'CANCELLED', 'OVERDUE'].includes(key)) {
    cls = 'bg-rose-50 text-rose-700 border-rose-200'
  } else {
    cls = 'bg-slate-50 text-slate-600 border-slate-200'
  }

  const label = status ? String(status).toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '--'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      {['NEW', 'NEW_LEAD', 'IN_PROGRESS', 'WORKING', 'SCHEDULED', 'SENT', 'PENDING', 'PAID', 'COMPLETED', 'CLOSED', 'APPROVED'].includes(key) && (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {label}
    </span>
  )
}

/* ── Data Table ── */
export function VoltTable({ columns, rows, emptyText = 'No data yet' }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {columns.map(c => <th key={c} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="px-4 py-8 text-center text-sm text-slate-400" colSpan={columns.length}>{emptyText}</td></tr>
            ) : rows.map((cells, idx) => (
              <motion.tr key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="border-t border-slate-50 text-slate-600 transition-colors hover:bg-gray-50">
                {cells.map((cell, i) => <td key={i} className="px-4 py-3">{cell}</td>)}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Animated Progress Bar ── */
export function AnimatedBar({ label, percent, color = '#3b82f6', delay = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-slate-700">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  )
}

/* ── Module Transition ── */
export function ModuleWrap({ moduleKey, children }) {
  return (
    <motion.div key={moduleKey} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  )
}

/* ── Revenue Chart ── */
export function RevenueChart({ data }) {
  const w = 680, h = 220
  const pad = { t: 20, r: 20, b: 35, l: 20 }
  const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b
  const maxVal = Math.max(...data.map(d => d.value)) * 1.15
  const pts = data.map((d, i) => ({ x: pad.l + (i / (data.length - 1)) * cw, y: pad.t + ch - (d.value / maxVal) * ch }))
  let line = `M ${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cp = (pts[i].x - pts[i - 1].x) * 0.4
    line += ` C ${pts[i - 1].x + cp},${pts[i - 1].y} ${pts[i].x - cp},${pts[i].y} ${pts[i].x},${pts[i].y}`
  }
  const area = line + ` L ${pts[pts.length - 1].x},${pad.t + ch} L ${pts[0].x},${pad.t + ch} Z`
  const gridY = [0, 0.25, 0.5, 0.75, 1].map(p => pad.t + ch * (1 - p))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      {gridY.map((y, i) => <line key={i} x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#f0f0f0" strokeDasharray="4 3" />)}
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5a623" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#areaG)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d={line} fill="none" stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }} />
      {pts.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#f5a623" strokeWidth="2"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.12 * i + 0.4, type: 'spring', stiffness: 300 }} />
      ))}
      {data.map((d, i) => (
        <text key={i} x={pts[i].x} y={h - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: '11px' }}>{d.label}</text>
      ))}
    </svg>
  )
}

/* ── Buttons ── */
export function PrimaryBtn({ children, onClick, disabled, className = '' }) {
  return (
    <motion.button type="button" onClick={onClick} disabled={disabled}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(31,41,55,0.15)' }} whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-lg bg-[#1f2937] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {children}
    </motion.button>
  )
}
export function OutlineBtn({ children, onClick, disabled, className = '' }) {
  return (
    <motion.button type="button" onClick={onClick} disabled={disabled}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {children}
    </motion.button>
  )
}
export function GreenBtn({ children, onClick, disabled, className = '' }) {
  return (
    <motion.button type="button" onClick={onClick} disabled={disabled}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(5,166,119,0.2)' }} whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {children}
    </motion.button>
  )
}

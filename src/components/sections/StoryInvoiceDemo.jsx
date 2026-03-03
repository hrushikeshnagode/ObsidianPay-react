import { motion } from 'framer-motion'
import RevealBlock from '../ui/RevealBlock'
import SectionShell from './SectionShell'

export default function StoryInvoiceDemo({ content, invoice }) {
  return (
    <SectionShell id="story-3" parallax={22}>
      <RevealBlock>
        <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-[0.08em]">
          {content.chip}
        </p>
        <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">{content.title}</h2>
      </RevealBlock>

      <RevealBlock>
        <article className="glass rounded-3xl p-5">
          <div className="flex justify-between border-b border-white/10 py-2"><span>Client</span><strong>{invoice.client}</strong></div>
          <div className="flex justify-between border-b border-white/10 py-2"><span>Subtotal</span><strong>Rs {invoice.subtotal.toLocaleString('en-IN')}</strong></div>
          <div className="flex justify-between border-b border-white/10 py-2"><span>GST (18%)</span><strong>Rs {invoice.gst.toLocaleString('en-IN')}</strong></div>
          <div className="flex justify-between py-3"><span>Total</span><strong>Rs {invoice.total.toLocaleString('en-IN')}</strong></div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.span className="block h-full bg-gradient-to-r from-[#66b8ff] to-[#d7b57a]" style={{ width: `${invoice.progressPct}%` }} />
          </div>
          <small className="mt-2 block text-slate-300">{invoice.stage}</small>
        </article>
      </RevealBlock>
    </SectionShell>
  )
}

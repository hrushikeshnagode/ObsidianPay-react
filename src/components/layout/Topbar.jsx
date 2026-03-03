import MagneticButton from '../ui/MagneticButton'

export default function Topbar({ onPrimaryAction, primaryLabel = 'Start Free' }) {
  return (
    <header className="fixed left-1/2 top-4 z-40 flex w-[92vw] max-w-6xl -translate-x-1/2 items-center justify-between rounded-full border border-white/15 bg-[#090b11b8] px-4 py-3 backdrop-blur-md">
      <div className="font-display flex items-center gap-2 text-base font-bold">
        <i className="h-[11px] w-[11px] rounded-full bg-gradient-to-br from-[#d7b57a] to-[#f7e3b5] shadow-[0_0_0_8px_rgba(215,181,122,0.16)]" />
        ObsidianPay
      </div>

      <nav className="hidden gap-4 text-sm font-semibold text-slate-300 md:flex">
        <a href="#story-1">Story</a>
        <a href="#story-3">Demo</a>
        <a href="#story-5">Launch</a>
      </nav>

      <MagneticButton
        onClick={onPrimaryAction}
        className="rounded-full border border-[#d7b57a4d] bg-gradient-to-br from-[#1f2534] to-[#151922] px-4 py-2 text-sm font-bold text-[#f8ead2]"
      >
        {primaryLabel}
      </MagneticButton>
    </header>
  )
}

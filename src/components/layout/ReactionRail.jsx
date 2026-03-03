export default function ReactionRail({ onReact }) {
  return (
    <aside className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 gap-2 rounded-2xl border border-white/10 bg-[#0c0f16b8] p-3 text-center backdrop-blur md:grid">
      <p className="m-0 text-xs text-slate-300">Live Feed</p>
      <button
        onClick={onReact}
        className="rounded-xl border border-[#d7b57a4d] bg-gradient-to-br from-[#1f2534] to-[#151922] px-3 py-2 text-sm font-bold text-[#f8ead2]"
      >
        Like
      </button>
    </aside>
  )
}

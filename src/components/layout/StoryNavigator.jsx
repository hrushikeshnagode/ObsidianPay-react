import { useEffect, useMemo, useState } from 'react'

export default function StoryNavigator({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  const targets = useMemo(() => items.map((item) => item.id), [items])

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.5
      let nextActive = targets[0]

      targets.forEach((id) => {
        const el = document.getElementById(id)
        if (el && mid >= el.offsetTop) nextActive = id
      })

      setActiveId(nextActive)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targets])

  return (
    <aside className="fixed left-1/2 top-[86px] z-30 hidden -translate-x-1/2 md:flex">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0c0f16b8] px-3 py-2 backdrop-blur-md">
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-label={item.label}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                active ? 'w-8 bg-[#d7b57a]' : 'w-2.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          )
        })}
      </div>
    </aside>
  )
}

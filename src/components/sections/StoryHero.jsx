import RevealBlock from '../ui/RevealBlock'
import TiltCard from '../ui/TiltCard'
import SectionShell from './SectionShell'

export default function StoryHero({ content }) {
  return (
    <SectionShell id="story-1" parallax={18}>
      <RevealBlock>
        <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-[0.08em]">
          {content.chip}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-[1.03] md:text-6xl">
          {content.title} <span className="text-[#d7b57a]">{content.accent}</span>.
        </h1>
        <p className="mt-3 max-w-xl text-slate-300">{content.body}</p>
      </RevealBlock>

      <RevealBlock>
        <TiltCard className="glass rounded-3xl p-5">
          <h3 className="font-display text-xl">{content.cardTitle}</h3>
          <p className="mt-2 text-slate-300">{content.cardBody}</p>
        </TiltCard>
      </RevealBlock>
    </SectionShell>
  )
}

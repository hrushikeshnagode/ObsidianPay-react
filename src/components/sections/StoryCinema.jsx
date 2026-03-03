import RevealBlock from '../ui/RevealBlock'
import TiltCard from '../ui/TiltCard'
import SectionShell from './SectionShell'

export default function StoryCinema({ content }) {
  return (
    <SectionShell id="story-2" parallax={30}>
      <RevealBlock>
        <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-[0.08em]">
          {content.chip}
        </p>
        <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">{content.title}</h2>
      </RevealBlock>

      <RevealBlock className="grid gap-3">
        <TiltCard className="glass rounded-3xl p-5">
          <h4 className="font-display text-lg">{content.cards[0].title}</h4>
          <p className="mt-1 text-slate-300">{content.cards[0].body}</p>
        </TiltCard>
        <TiltCard className="glass rounded-3xl p-5">
          <h4 className="font-display text-lg">{content.cards[1].title}</h4>
          <p className="mt-1 text-slate-300">{content.cards[1].body}</p>
        </TiltCard>
      </RevealBlock>
    </SectionShell>
  )
}

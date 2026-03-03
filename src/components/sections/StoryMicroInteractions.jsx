import RevealBlock from '../ui/RevealBlock'
import SectionShell from './SectionShell'

export default function StoryMicroInteractions({ content }) {
  return (
    <SectionShell id="story-4" parallax={28}>
      <RevealBlock>
        <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-[0.08em]">
          {content.chip}
        </p>
        <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">{content.title}</h2>
      </RevealBlock>

      <RevealBlock>
        <article className="glass grid rounded-3xl p-5 md:grid-cols-3 md:gap-3">
          <div>
            <h4 className="font-display text-lg">{content.cards[0].title}</h4>
            <p className="mt-1 text-slate-300">{content.cards[0].body}</p>
          </div>
          <div>
            <h4 className="font-display text-lg">{content.cards[1].title}</h4>
            <p className="mt-1 text-slate-300">{content.cards[1].body}</p>
          </div>
          <div>
            <h4 className="font-display text-lg">{content.cards[2].title}</h4>
            <p className="mt-1 text-slate-300">{content.cards[2].body}</p>
          </div>
        </article>
      </RevealBlock>
    </SectionShell>
  )
}

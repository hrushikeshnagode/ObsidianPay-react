import MagneticButton from '../ui/MagneticButton'
import RevealBlock from '../ui/RevealBlock'
import SectionShell from './SectionShell'

export default function StoryCta({ content }) {
  return (
    <SectionShell id="story-5" parallax={16}>
      <RevealBlock>
        <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-[0.08em]">
          {content.chip}
        </p>
        <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">{content.title}</h2>
        <MagneticButton className="mt-5 rounded-full border border-[#d7b57a4d] bg-gradient-to-br from-[#1f2534] to-[#151922] px-5 py-3 text-sm font-bold text-[#f8ead2]">
          {content.buttonText}
        </MagneticButton>
      </RevealBlock>
    </SectionShell>
  )
}

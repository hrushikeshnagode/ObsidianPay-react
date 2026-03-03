import { useEffect } from 'react'
import Lenis from 'lenis'

export default function useLenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
    })

    let frame = null
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])
}

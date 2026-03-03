import { useState } from 'react'
import { Fit, Layout, useRive } from '@rive-app/react-canvas'

export default function RiveBadge({
  src,
  stateMachines,
  artboard,
  className = '',
  fallback = 'RF',
  fallbackClassName = '',
}) {
  const [errored, setErrored] = useState(false)
  const { RiveComponent } = useRive(
    {
      src,
      stateMachines,
      artboard,
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain }),
      onLoadError: () => setErrored(true),
    },
    {
      fitCanvasToArtboardHeight: true,
      useDevicePixelRatio: true,
    },
  )

  if (errored || !src) {
    return (
      <span className={`inline-flex items-center justify-center ${fallbackClassName}`}>
        {fallback}
      </span>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <RiveComponent />
    </div>
  )
}

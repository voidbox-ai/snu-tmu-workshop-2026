import { useEffect, useRef, useState } from 'react'
import { STAGE } from '../deck.config'

export interface RevealState {
  /** True once reveal.js has finished initialising. */
  ready: boolean
  /** 0-based index of the slide currently on screen. */
  index: number
  /** ms timestamp of the moment the speaker left the title slide, or null. */
  startedAt: number | null
  /** Put the pacing clock back to zero. */
  resetTimer: () => void
}

/**
 * Boot reveal.js over the sections React has already rendered.
 *
 * React owns the markup, reveal owns the behavior. That division only holds
 * because the slides are static: nothing re-renders a <section> after mount,
 * so reveal's own classes (`present`, `past`, `future`) are never clobbered.
 * The one thing React does keep updating is each slide's <aside class="notes">,
 * which reveal reads rather than writes.
 */
export function useReveal(keyBindings: Record<string, () => void>): RevealState {
  const [ready, setReady] = useState(false)
  const [index, setIndex] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  // keep the latest handlers reachable without re-binding reveal's keyboard
  const bindings = useRef(keyBindings)
  bindings.current = keyBindings

  const booted = useRef(false)

  useEffect(() => {
    if (booted.current) return // React 19 StrictMode mounts twice in dev
    booted.current = true

    const reveal = window.Reveal
    if (!reveal) {
      console.error('reveal.js did not load — check public/reveal/reveal.js')
      return
    }

    void reveal
      .initialize({
        width: STAGE.width,
        height: STAGE.height,
        margin: 0.04,
        minScale: 0.2,
        maxScale: 2.0,

        center: false, // we center with flexbox instead
        hash: true,
        history: false,
        controls: false,
        progress: true,
        slideNumber: 'c/t',
        showSlideNumber: 'all',
        transition: 'fade',
        transitionSpeed: 'fast',
        backgroundTransition: 'fade',
        overview: true,
        help: false, // '?' is ours; reveal's own overlay would swallow keys
        pdfSeparateFragments: false,

        plugins: [window.RevealNotes],
      })
      .then(() => {
        /* Registered through Reveal rather than on document, because reveal
           already owns most of the keyboard and its own bindings win silently
           otherwise:
             N  is reveal's "next slide"  -> notes live on I instead
             /  is reveal's blackout      -> B and . still blank the screen  */
        const keys: Record<string, number> = { T: 84, I: 73, R: 82, '?': 191 }
        const describe: Record<string, string> = {
          T: 'Pacing clock on this screen',
          I: 'Speaker notes on this screen',
          R: 'Reset the timer',
          '?': 'Shortcuts',
        }

        for (const key of Object.keys(keys)) {
          reveal.addKeyBinding(
            { keyCode: keys[key]!, key, description: describe[key] },
            () => {
              if (key === 'R') setStartedAt(null)
              bindings.current[key]?.()
            },
          )
        }

        reveal.on('slidechanged', (event) => {
          // the clock starts the moment you leave the title slide
          setStartedAt((prev) => (prev === null && event.indexh > 0 ? Date.now() : prev))
          setIndex(event.indexh)
        })

        setIndex(reveal.getIndices().h)
        setReady(true)
      })
  }, [])

  return {
    ready,
    index,
    startedAt,
    resetTimer: () => setStartedAt(null),
  }
}

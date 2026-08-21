import { useEffect, useState } from 'react'

/**
 * Is the reveal.js speaker view open?
 *
 * It matters because the moment it opens, *this* window becomes the audience
 * screen. Nothing meant for the presenter may stay on it — the pacing clock,
 * the notes panel and the shortcut bar all belong on the speaker's screen.
 *
 * The speaker view announces itself with `connected` and then beats once a
 * second; a few missed beats mean it has been closed.
 */
export function useSpeakerView(): boolean {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let lastBeat = 0

    function onMessage(e: MessageEvent) {
      let data: { namespace?: string; type?: string }
      try {
        data = JSON.parse(String(e.data))
      } catch {
        return
      }
      if (data?.namespace !== 'reveal-notes') return
      if (data.type === 'connected' || data.type === 'heartbeat') {
        lastBeat = Date.now()
        setOpen(true)
      }
    }

    const timer = window.setInterval(() => {
      if (lastBeat && Date.now() - lastBeat > 4000) setOpen(false)
    }, 1000)

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      window.clearInterval(timer)
    }
  }, [])

  return open
}

/** True when this document is one of the speaker view's slide previews. */
export const IS_EMBEDDED = typeof window !== 'undefined' && window.self !== window.top

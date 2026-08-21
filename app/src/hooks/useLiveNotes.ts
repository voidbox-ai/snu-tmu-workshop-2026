import { useEffect, useState } from 'react'
import { SLIDES } from '../slides/registry'

/**
 * Speaker notes, editable from the speaker view while the deck is running.
 *
 * The dev server has already written the change to disk (into the slide's
 * `.notes.html` file) by the time this runs; the message only keeps the live
 * DOM — and therefore the `I` overlay — in step without a reload.
 */
export function useLiveNotes(): string[] {
  const [notes, setNotes] = useState<string[]>(() => SLIDES.map((s) => s.notes))

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      let data: { namespace?: string; type?: string; index?: number; html?: string }
      try {
        data = JSON.parse(String(e.data))
      } catch {
        return
      }
      if (data?.namespace !== 'deck-notes' || data.type !== 'updated') return
      if (typeof data.index !== 'number' || typeof data.html !== 'string') return

      setNotes((prev) => {
        if (data.index! < 0 || data.index! >= prev.length) return prev
        const next = prev.slice()
        next[data.index!] = data.html!
        return next
      })
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return notes
}

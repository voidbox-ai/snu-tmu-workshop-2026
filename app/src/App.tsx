import { useEffect, useState } from 'react'
import { SLIDES } from './slides/registry'
import { SlideSection } from './components/SlideSection'
import { PaceBar } from './components/PaceBar'
import { NotesOverlay } from './components/NotesOverlay'
import { HelpBar } from './components/HelpBar'
import { useReveal } from './hooks/useReveal'
import { useLiveNotes } from './hooks/useLiveNotes'
import { IS_EMBEDDED, useSpeakerView } from './hooks/useSpeakerView'

export default function App() {
  const notes = useLiveNotes()
  const speakerOpen = useSpeakerView()

  const [notesOn, setNotesOn] = useState(false)
  const [helpOn, setHelpOn] = useState(false)
  /** null until the presenter presses T; after that their choice wins. */
  const [paceChoice, setPaceChoice] = useState<boolean | null>(null)

  const { index, startedAt } = useReveal({
    T: () => setPaceChoice((prev) => !(prev ?? !speakerOpen)),
    I: () => setNotesOn((v) => !v),
    R: () => undefined, // the timer itself is reset inside useReveal
    '?': () => setHelpOn((v) => !v),
  })

  /* Once the speaker view is open this window is the projector: hand the
     presenter's furniture over to the speaker's screen, and go back to the
     default the next time the setup changes. */
  useEffect(() => {
    setPaceChoice(null)
    if (speakerOpen) {
      setNotesOn(false)
      setHelpOn(false)
    }
  }, [speakerOpen])

  const paceOn = IS_EMBEDDED ? false : (paceChoice ?? !speakerOpen)

  return (
    <>
      <div className="reveal">
        <div className="slides">
          {SLIDES.map((slide) => (
            <SlideSection key={slide.id} slide={slide} notes={notes[slide.index] ?? ''} />
          ))}
        </div>
      </div>

      <PaceBar on={paceOn} slideIndex={index} startedAt={startedAt} />
      <NotesOverlay on={notesOn && !speakerOpen} html={notes[index] ?? ''} />
      <HelpBar on={helpOn && !speakerOpen} />
    </>
  )
}

/**
 * Speaker notes on the presentation screen itself (`I`).
 *
 * For rehearsing on one monitor, where the proper speaker view is not an
 * option. It hides itself the moment the speaker view connects.
 */
export function NotesOverlay({ on, html }: { on: boolean; html: string }) {
  return (
    <div id="notesOverlay" className={on ? 'on' : undefined}>
      <h4>SPEAKER NOTES</h4>
      {html ? (
        <div id="notesBody" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div id="notesBody">
          <p className="cue">— no notes —</p>
        </div>
      )}
    </div>
  )
}

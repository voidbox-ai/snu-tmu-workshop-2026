const SHORTCUTS: [string, string][] = [
  ['S', 'speaker view'],
  ['T', 'timer'],
  ['I', 'notes on this screen'],
  ['R', 'reset timer'],
  ['B', 'blank screen'],
  ['ESC', 'overview'],
  ['?', 'close'],
]

/** The shortcut strip, toggled with `?`. */
export function HelpBar({ on }: { on: boolean }) {
  return (
    <div id="helpBar" className={on ? 'on' : undefined}>
      {SHORTCUTS.map(([key, what]) => (
        <span key={key}>
          <kbd>{key}</kbd>
          {what}
        </span>
      ))}
    </div>
  )
}

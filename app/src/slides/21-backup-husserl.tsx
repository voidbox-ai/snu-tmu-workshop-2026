import type { SlideMeta } from '../types'
import { Note, Pull, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Next',
  dur: 0,
  uncounted: true,
  title: 'Backup',
  sub: 'Husserl — Abschattung',
}

export default function BackupHusserl() {
  return (
    <>
      <Pull plain style={{ marginBottom: 20 }}>
        “A thing in space is given to us, essentially, only through adumbrations.”
      </Pull>
      <Note style={{ marginBottom: 22 }}>
        — Edmund Husserl, <em>Ideen I</em> (1913), §41
      </Note>
      <Text>
        The object is never given whole; it is given as partial profiles, which consciousness
        synthesises across the movement of the body. Map that onto the pipeline — the object, the
        input images, the scanner's walking path, the optimization.{' '}
        <strong>3DGS is arguably that idea turned into an algorithm.</strong>
      </Text>
    </>
  )
}

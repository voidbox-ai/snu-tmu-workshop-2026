import type { SlideMeta } from '../types'
import { Note, Pull, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Next',
  dur: 0,
  uncounted: true,
  title: 'Backup',
  sub: 'Borges — the 1:1 map',
}

export default function BackupBorges() {
  return (
    <>
      <Pull plain style={{ marginBottom: 20 }}>
        “…the Cartographers Guild drew a Map of the Empire whose size was that of the Empire,
        coinciding point for point with it. Succeeding Generations… delivered it up to the
        Inclemencies of Sun and Winters.”
      </Pull>
      <Note style={{ marginBottom: 22 }}>
        — Jorge Luis Borges, “Del rigor en la ciencia”, 1946
      </Note>
      <Text>
        Asked whether we are building the 1:1 map: our data says fidelity alone neither made the
        archive valuable nor useless. What made it valuable was that it stayed open. Borges's map
        failed because nobody could stand inside it.
      </Text>
    </>
  )
}

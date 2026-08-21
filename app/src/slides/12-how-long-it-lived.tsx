import type { SlideMeta } from '../types'
import { Cap, Diagram } from '../components/layout'
import { TimelineDiagram } from '../components/diagrams/TimelineDiagram'

export const meta: SlideMeta = {
  sec: 'Findings',
  dur: 60,
  title: 'How long each exhibition lived',
}

export default function HowLongItLived() {
  return (
    <Diagram>
      <TimelineDiagram />
      <Cap style={{ marginTop: 14 }}>
        The physical exhibition was dismantled in June. The virtual one is open right now.
      </Cap>
    </Diagram>
  )
}

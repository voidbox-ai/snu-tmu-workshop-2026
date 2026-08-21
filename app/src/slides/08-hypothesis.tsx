import type { SlideMeta } from '../types'
import { Cap, Diagram } from '../components/layout'
import { CouplingDiagram } from '../components/diagrams/CouplingDiagram'

export const meta: SlideMeta = {
  sec: 'Yonsei',
  dur: 30,
  title: 'The hypothesis',
  sub: 'what we were actually testing',
}

export default function Hypothesis() {
  return (
    <Diagram>
      <CouplingDiagram />
      <Cap style={{ marginTop: 16 }}>
        If the two spaces act on each other they become one event; if they become one event, the
        online and offline participants become one community. <b>That was the bet.</b>
      </Cap>
    </Diagram>
  )
}

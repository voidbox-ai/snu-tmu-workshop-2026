import type { SlideMeta } from '../types'
import { Diagram, Pull } from '../components/layout'
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
      {/* This sentence is the hypothesis the whole Yonsei section turns on, and
          slides 9 and 10 answer it. It carries the weight of a claim, not of a
          caption. */}
      <Pull style={{ marginTop: 26 }}>
        If the two spaces act on each other they become one event; if they become one event, the
        online and offline participants become one community. That was our bet.
      </Pull>
    </Diagram>
  )
}

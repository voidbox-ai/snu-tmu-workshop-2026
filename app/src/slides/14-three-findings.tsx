import type { SlideMeta } from '../types'
import { Lesson, Lessons } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Findings',
  dur: 75,
  title: 'Three findings',
}

export default function ThreeFindings() {
  return (
    <Lessons>
      <Lesson n="01" heading="Presence before synchronization.">
        We optimized the coupling. What carried the project was the fidelity of simply being there.
      </Lesson>
      <Lesson n="02" heading="We measured the wrong thing.">
        We built metrics for interaction; the metric that mattered was how long the space stayed
        open. Note the asymmetry — we know the virtual attendance exactly (813) and have no idea what
        the physical attendance was. We never counted.
      </Lesson>
      <Lesson n="03" heading="Not simultaneity, but asynchrony.">
        Nobody wanted to be in two places at once. They wanted to be in one place, later.
      </Lesson>
    </Lessons>
  )
}

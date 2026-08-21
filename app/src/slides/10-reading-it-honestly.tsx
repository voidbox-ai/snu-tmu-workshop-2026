import type { SlideMeta } from '../types'
import { List, Pull, Rule } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Findings',
  dur: 80,
  title: 'Reading that honestly',
}

export default function ReadingItHonestly() {
  return (
    <>
      <List>
        <li>
          The coupling we designed was bidirectional. In practice{' '}
          <strong>one of the two directions never ran at all</strong> — the virtual exhibition could
          only watch.
        </li>
        <li>The second layer never formed. We laid it over the geometry and it did not take.</li>
        <li>
          <strong>Limitation.</strong> This says our interaction layer was not used. It does not show
          that interaction is impossible — one event, five days, one department, no control
          condition.
        </li>
      </List>
      <Rule style={{ marginTop: 30 }} />
      <Pull plain>
        At some point we stopped asking why people didn't use what we built, and started asking what
        they did instead.
      </Pull>
    </>
  )
}

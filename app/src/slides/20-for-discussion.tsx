import type { SlideMeta } from '../types'
import { List, Note, Rule } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Next',
  dur: 15,
  title: 'For discussion',
}

export default function ForDiscussion() {
  return (
    <>
      <List>
        <li>Can two spaces be one event — and does anyone actually want them to be?</li>
        <li>
          What would it take for an archive to become a place where events <em>continue</em>?
        </li>
        <li>If a twin makes presence countable, what does it make invisible?</li>
      </List>
      <Rule style={{ marginTop: 30 }} />
      <Note>
        Hyeogjin Noh &nbsp;·&nbsp; hyeogjin.noh@voidbox.ai &nbsp;·&nbsp; nubim.voidbox.ai
      </Note>
    </>
  )
}

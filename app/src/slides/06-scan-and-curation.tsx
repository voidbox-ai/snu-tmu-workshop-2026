import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
import { Body, Cap, List, Media, Note, Rule, Split } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Yonsei',
  dur: 40,
  title: 'The scan, and the exhibition placed inside it',
}

export default function ScanAndCuration() {
  return (
    <Split>
      <Media>
        <ImageSlot slot="assets/tool-curation.jpg" desc="카드 배치 / 큐레이션 툴 화면" />
        <Cap>The curation tool — works positioned inside the scanned hall.</Cap>
      </Media>
      <Body>
        <List>
          <li>We scanned the exhibition hall before installation.</li>
          <li>
            A <strong>curation tool</strong> let the department place each student's work into the
            scanned space, from a plan view.
          </li>
          <li>
            An <strong>archive site</strong> wrapped it: navigation, notices, and a page per work.
          </li>
        </List>
        <Rule />
        <Note>
          So the virtual exhibition was not a video or a photo gallery. It was the hall itself, with
          the show installed in it.
        </Note>
      </Body>
    </Split>
  )
}

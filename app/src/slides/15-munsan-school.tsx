import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
import { Body, Cap, List, Media, Note, Pull, Rule, Split } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Munsan',
  dur: 45,
  title: 'Munsan Elementary School',
  sub: 'Seocheon-gun, Chungcheongnam-do',
}

export default function MunsanSchool() {
  return (
    <Split>
      <Media>
        <ImageSlot slot="assets/munsan-scan.jpg" desc="문산초등학교 3DGS 스캔 화면" />
        <Cap>The school as it currently stands, scanned.</Cap>
      </Media>
      <Body>
        <Pull plain style={{ marginBottom: 20 }}>
          If what we actually deliver is presence — who else needs it?
        </Pull>
        <List>
          <li>A rural county losing population.</li>
          <li>
            A small elementary school to be converted and extended as a{' '}
            <strong>special-education school</strong>.
          </li>
          <li>An open design competition, which we entered.</li>
        </List>
        <Rule />
        <Note>Not a community case study — this is what we did with the finding.</Note>
      </Body>
    </Split>
  )
}

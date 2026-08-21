import type { SlideMeta } from '../types'
import { MediaSlot } from '../components/MediaSlot'
import { Body, Media, Note, Pull, Rule, Split, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Next',
  dur: 35,
  title: 'Where this leaves us',
}

/* Deliberately the same photograph as slide 4 — the talk closes on the blur
   it opened with. */
export default function WhereThisLeavesUs() {
  return (
    <Split>
      <Media>
        <MediaSlot
          slot="assets/playground.jpg"
          desc="놀이터 3DGS 스캔 — 4번 슬라이드와 동일 이미지"
        />
      </Media>
      <Body>
        <Text lg style={{ marginBottom: 20 }}>
          We spent a long time trying to remove this blur. It is the only place in the whole
          reconstruction where something actually happened.
        </Text>
        <Pull>Presence before synchronization.</Pull>
        <Rule />
        <Note>
          What we don't have yet: whether an archive can become a place where events continue, rather
          than a monument.
        </Note>
      </Body>
    </Split>
  )
}

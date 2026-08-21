import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
import { Body, Cap, Media, Note, Pull, Rule, Split, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Munsan',
  dur: 45,
  title: 'Use 2 — design review inside the existing place',
}

export default function UseTwoDesignReview() {
  return (
    <Split>
      <Media>
        <ImageSlot
          slot="assets/munsan-overlay.jpg"
          desc="3DGS 스캔 위에 설계안을 겹친 디자인 검토 화면"
        />
        <Cap>Our competition proposal, overlaid on the scan.</Cap>
      </Media>
      <Body>
        <Pull style={{ marginBottom: 22 }}>
          The proposal is judged inside the existing place, not against an abstracted model of it.
        </Pull>
        <Text>
          We overlay the design directly onto the scan and walk through it. Daylight, circulation and
          the relationship to what is already there stay visible throughout, instead of being
          reconstructed from drawings.
        </Text>
        <Rule />
        <Note>The user of the twin here is not a visitor. It is the designer.</Note>
      </Body>
    </Split>
  )
}

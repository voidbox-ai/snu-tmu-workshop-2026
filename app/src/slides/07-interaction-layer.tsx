import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
import { Body, Cap, Media, Note, Pull, Rule, Split, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Yonsei',
  dur: 40,
  title: 'And then the layer we cared most about',
}

export default function InteractionLayer() {
  return (
    <Split>
      <Media>
        <ImageSlot slot="assets/archive-site.jpg" desc="아카이브 사이트 / 댓글·동기화 레이어 화면" />
        <Cap>The interaction layer, as designed.</Cap>
      </Media>
      <Body>
        <Pull style={{ marginBottom: 22 }}>
          An interaction layer — comments, and two-way sync between the physical and the virtual
          exhibition.
        </Pull>
        <Text>
          Something happening in the hall should change the virtual exhibition. Something happening
          in the virtual exhibition should change the hall.
        </Text>
        <Rule />
        <Note>
          This is where most of our design effort went. It is the second layer — our attempt to lay
          events back over the geometry.
        </Note>
      </Body>
    </Split>
  )
}
